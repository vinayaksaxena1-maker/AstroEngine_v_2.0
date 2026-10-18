/**
 * Sanatan Astro Engine: Input & Time Resolver
 *
 * Implements bulletproof input validation guardrails and dual-format time resolution
 * (unambiguous UTC instant OR civil date/time + timezoneOffset/ianaTimezone).
 */

import { AyanamshaSystem, getAyanamshaForSystem } from '../core/sanatan_jpl_bridge';

export class InvalidCoordinateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCoordinateError';
  }
}

export class InvalidDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDateError';
  }
}

export interface HoroscopeInput {
  // Format A: Direct unambiguous UTC instant
  birthDate?: Date;

  // Format B: Civil date + time + timezone
  date?: string;           // 'YYYY-MM-DD'
  time?: string;           // 'HH:mm:ss' or 'HH:mm'
  timezoneOffset?: number; // e.g. +5.5 for IST, -5 for EST
  ianaTimezone?: string;   // e.g. 'Asia/Kolkata', 'America/New_York'
  dstDisambiguation?: 'earlier' | 'later'; // Required for repeated local times during fall-back

  // Geographic Coordinates (Mandatory)
  latitude: number;        // [-90.0, 90.0]
  longitude: number;       // [-180.0, 180.0]
  altitudeMeters?: number;

  // Calculation Preferences (Optional)
  houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse';
  ayanamshaSystem?: 'Lahiri' | 'KP' | 'Raman';
}

export interface EngineMetadata {
  engineName: 'Sanatan Astro Engine';
  engineVersion: '1.1.1';
  calculatedAt: string;          // ISO UTC of calculation runtime
  resolvedUtcInstant: string;    // Exact birth instant in UTC
  julianDayUT: number;
  ayanamshaType: AyanamshaSystem;
  ayanamshaValue: number;
  houseSystemUsed: 'Sripati' | 'Placidus' | 'EqualHouse';
  coordinates: { lat: number; lng: number };
}

export interface ResolvedInputResult {
  resolvedDate: Date;
  metadata: EngineMetadata;
  houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse';
  ayanamshaSystem: AyanamshaSystem;
}

function validateCalendarDate(year: number, month: number, day: number): void {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new InvalidDateError(`Invalid calendar date: ${year}-${month}-${day}.`);
  }
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 31, 30, 31, 30, 31];
  if (!Number.isInteger(day) || day < 1 || day > days[month - 1]) {
    throw new InvalidDateError(`Invalid calendar date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}.`);
  }
}

function getZonedParts(formatter: Intl.DateTimeFormat, instantMs: number): Record<string, string> {
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(instantMs))) parts[part.type] = part.value;
  return parts;
}

function zonedWallTimeAsUtc(parts: Record<string, string>): number {
  const hour = Number(parts.hour) === 24 ? 0 : Number(parts.hour);
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), hour,
    Number(parts.minute), Number(parts.second));
}

/**
 * Resolves civil date and time into a UTC Date object using either explicit timezone offset or IANA timezone.
 */
function resolveCivilTimeToUtc(
  dateStr: string,
  timeStr: string,
  timezoneOffset?: number,
  ianaTimezone?: string,
  dstDisambiguation?: 'earlier' | 'later'
): Date {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new InvalidDateError(`Invalid date format "${dateStr}". Expected "YYYY-MM-DD".`);
  }

  const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
  if (!timeRegex.test(timeStr)) {
    throw new InvalidDateError(`Invalid time format "${timeStr}". Expected "HH:mm" or "HH:mm:ss".`);
  }

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    throw new InvalidDateError(`Invalid month ${month}. Must be between 1 and 12.`);
  }
  if (day < 1 || day > 31) {
    throw new InvalidDateError(`Invalid day ${day}. Must be between 1 and 31.`);
  }

  validateCalendarDate(year, month, day);

  const timeParts = timeStr.split(':');
  const hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);
  const second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    throw new InvalidDateError(`Invalid time values: ${hour}:${minute}:${second}.`);
  }

  // Format B.1: Explicit numeric timezone offset (in hours, e.g. +5.5 for IST)
  if (timezoneOffset !== undefined) {
    if (typeof timezoneOffset !== 'number' || isNaN(timezoneOffset) || !isFinite(timezoneOffset) || timezoneOffset < -14 || timezoneOffset > 14) {
      throw new InvalidDateError(`Invalid timezoneOffset "${timezoneOffset}". Must be a number between -14 and 14 hours.`);
    }
    const civilUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const offsetMs = Math.round(timezoneOffset * 3600 * 1000);
    return new Date(civilUtcMs - offsetMs);
  }

  // Format B.2: IANA Timezone string. Enumerate nearby offsets so DST folds
  // produce both valid instants and DST gaps produce no valid instant.
  if (ianaTimezone) {
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaTimezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hourCycle: 'h23'
      });
    } catch {
      throw new InvalidDateError(`Invalid or unsupported IANA timezone "${ianaTimezone}".`);
    }

    const targetCivilMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const matchesRequestedCivilTime = (instantMs: number): boolean => {
      const p = getZonedParts(formatter, instantMs);
      return Number(p.year) === year && Number(p.month) === month && Number(p.day) === day
        && Number(p.hour) === hour && Number(p.minute) === minute && Number(p.second) === second;
    };

    const offsets = new Set<number>();
    for (let hours = -48; hours <= 48; hours += 6) {
      const sampleMs = targetCivilMs + hours * 3600000;
      offsets.add(zonedWallTimeAsUtc(getZonedParts(formatter, sampleMs)) - sampleMs);
    }

    const candidates = [...offsets]
      .map(offsetMs => targetCivilMs - offsetMs)
      .filter(matchesRequestedCivilTime)
      .sort((a, b) => a - b)
      .filter((value, index, all) => index === 0 || value !== all[index - 1]);

    if (candidates.length === 0) {
      throw new InvalidDateError(`Local time "${dateStr} ${timeStr}" does not exist in timezone "${ianaTimezone}", likely because of a Daylight Saving Time spring-forward gap.`);
    }
    if (candidates.length > 1) {
      if (!dstDisambiguation) {
        throw new InvalidDateError(`Local time "${dateStr} ${timeStr}" in timezone "${ianaTimezone}" occurs twice during a clock change. Ask the user to choose the first or second occurrence and pass dstDisambiguation: "earlier" or "later".`);
      }
      return new Date(dstDisambiguation === 'earlier' ? candidates[0] : candidates[candidates.length - 1]);
    }
    return new Date(candidates[0]);
  }

  // Default: If no timezone or offset specified, treat as UTC
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

/**
 * Validates HoroscopeInput and resolves exact UTC date, Julian Day, and calculation metadata.
 */
export function resolveHoroscopeInput(input: HoroscopeInput): ResolvedInputResult {
  if (!input || typeof input !== 'object') {
    throw new Error('HoroscopeInput must be a valid non-null object.');
  }

  // 1. Coordinate Validation
  const { latitude, longitude } = input;
  if (typeof latitude !== 'number' || isNaN(latitude) || !isFinite(latitude) || latitude < -90.0 || latitude > 90.0) {
    throw new InvalidCoordinateError(`Invalid latitude ${latitude}. Must be a finite number between -90.0 and 90.0.`);
  }

  if (typeof longitude !== 'number' || isNaN(longitude) || !isFinite(longitude) || longitude < -180.0 || longitude > 180.0) {
    throw new InvalidCoordinateError(`Invalid longitude ${longitude}. Must be a finite number between -180.0 and 180.0.`);
  }

  // 2. Date & Time Resolution
  let resolvedDate: Date;

  if (input.birthDate) {
    if (!(input.birthDate instanceof Date) || isNaN(input.birthDate.getTime())) {
      throw new InvalidDateError('Provided birthDate is not a valid Date instance.');
    }
    resolvedDate = new Date(input.birthDate.getTime());
  } else if (input.date && input.time) {
    if (input.timezoneOffset === undefined && !input.ianaTimezone) {
      throw new InvalidDateError('Civil date and time requires an explicit timezone. Pass timezoneOffset (0 for UTC) or an IANA timezone such as "Asia/Kolkata".');
    }
    if (input.timezoneOffset !== undefined && input.ianaTimezone) {
      throw new InvalidDateError('Pass either timezoneOffset or ianaTimezone, not both.');
    }
    if (input.dstDisambiguation !== undefined && !['earlier', 'later'].includes(input.dstDisambiguation)) {
      throw new InvalidDateError('dstDisambiguation must be "earlier" or "later".');
    }
    resolvedDate = resolveCivilTimeToUtc(
      input.date,
      input.time,
      input.timezoneOffset,
      input.ianaTimezone,
      input.dstDisambiguation
    );
  } else {
    throw new InvalidDateError(
      'Invalid input: Must provide either "birthDate" (Date) or civil "date" (YYYY-MM-DD) and "time" (HH:mm).'
    );
  }

  // 3. Year Bound Validation [1800, 2100]
  const resolvedYear = resolvedDate.getUTCFullYear();
  if (resolvedYear < 1800 || resolvedYear > 2100) {
    throw new InvalidDateError(
      `Resolved year ${resolvedYear} is outside supported historical boundary [1800, 2100].`
    );
  }

  // 4. Julian Day and Ayanamsha Resolution
  const jd_ut = (resolvedDate.getTime() / 86400000) + 2440587.5;
  const ayanamshaSystem = input.ayanamshaSystem || 'Lahiri';
  if (!['Lahiri', 'KP', 'Raman'].includes(ayanamshaSystem)) {
    throw new InvalidDateError(`Unsupported ayanamsha system "${ayanamshaSystem}".`);
  }
  const ayanamshaValue = getAyanamshaForSystem(jd_ut, ayanamshaSystem);

  const houseSystem = input.houseSystem || 'Sripati';
  if (!['Sripati', 'Placidus', 'EqualHouse'].includes(houseSystem)) {
    throw new InvalidDateError(`Unsupported house system "${houseSystem}".`);
  }

  const metadata: EngineMetadata = {
    engineName: 'Sanatan Astro Engine',
    engineVersion: '1.1.0',
    calculatedAt: new Date().toISOString(),
    resolvedUtcInstant: resolvedDate.toISOString(),
    julianDayUT: jd_ut,
    ayanamshaType: ayanamshaSystem,
    ayanamshaValue,
    houseSystemUsed: houseSystem,
    coordinates: {
      lat: latitude,
      lng: longitude
    }
  };

  return {
    resolvedDate,
    metadata,
    houseSystem,
    ayanamshaSystem
  };
}
