/**
 * Sanatan Astronomical Engine (100% Closed-Source / Proprietary Engine)
 *
 * Drop-in MIT/JPL replacement for Swiss Ephemeris WASM.
 * Powered by astronomy-engine (MIT License) with JPL-calibrated models.
 * Provides synchronous, instantaneous Vedic Panchang & Astronomical calculations.
 */

import { EngineLogger } from './engineLogger';
import {
  calculateSolarTimesCore,
  calculateMoonTimesCore,
  calculatePanchangPositionsCore,
  calculateTimezoneOffset,
  SolarTimesResult,
  MoonTimesResult,
  PanchangPositionsResult,
  PlanetPositionResult,
  AyanamshaSystem
} from './core/sanatan_jpl_bridge';
import {
  calculateNatalChart,
  NatalChartData,
  BhavaCuspDetail,
  NatalPlanetDetail
} from './kundli/houseCusps';

let panchangCacheClearer: (() => void) | null = null;
export function registerPanchangCacheClearer(fn: () => void) {
  panchangCacheClearer = fn;
}

export type SolarTimes = SolarTimesResult;
export type MoonTimes = MoonTimesResult;
export type PlanetPosition = PlanetPositionResult;
export type PanchangPositions = PanchangPositionsResult;
export type AscendantDetail = NatalChartData['ascendant'];
export type { BhavaCuspDetail, NatalPlanetDetail, NatalChartData };

export interface AstronomicalEngine {
  getSolarTimes(lat: number, lon: number, date: Date, offsetHours?: number): SolarTimes;
  getMoonTimes(sunriseMin: number, sunsetMin: number, tithiIdx: number, date: Date, lat: number, lon: number, offsetHours?: number): MoonTimes;
  getPanchangPositions(date: Date, offsetHours?: number): PanchangPositions;
  getAscendant(lat: number, lon: number, date: Date, ayanamsha?: AyanamshaSystem): AscendantDetail;
  getHouseCusps(lat: number, lon: number, date: Date, houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse', ayanamsha?: AyanamshaSystem): BhavaCuspDetail[];
  getNatalChart(lat: number, lon: number, date: Date, houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse', ayanamsha?: AyanamshaSystem): NatalChartData;
  isReady(): boolean;
}

// ---------------------------------------------------------------------------
// Engine State & Cache Management
// ---------------------------------------------------------------------------
const solarCache = new Map<string, SolarTimes>();
const moonCache = new Map<string, MoonTimes>();
const positionCache = new Map<string, PanchangPositions>();
const kundliCache = new Map<string, NatalChartData>();
const pendingQueries = new Set<string>();
const activeExpectedKeys = new Set<string>();

let updateListener: (() => void) | null = null;
const isEngineReady = true;
const isEngineTimeout = false;
let engineProgressStage: 'WORKER_CREATED' | 'WASM_COMPILED' | 'EPHEMERIS_READY' | 'PANCHANG_PREFETCH' | 'ENGINE_READY' = 'ENGINE_READY';

export function registerEngineListener(callback: () => void) {
  updateListener = callback;
  if (typeof setTimeout !== 'undefined') {
    setTimeout(callback, 0);
  }
}

export function isReady(): boolean {
  return isEngineReady;
}

export function isEngineCalculating(): boolean {
  return pendingQueries.size > 0;
}

export function registerActiveExpectedKeys(keys: string[]) {
  activeExpectedKeys.clear();
  keys.forEach(k => activeExpectedKeys.add(k));
}

export function isTimeoutTriggered(): boolean {
  return isEngineTimeout;
}

export function getEngineProgressStage() {
  return engineProgressStage;
}

export function getRetryCount(): number {
  return 0;
}

export function getLastDiagnosticInfo() {
  return {
    errorCode: 'NONE',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    elapsedTime: '0.0s'
  };
}

export function isMaxRetriesReached(): boolean {
  return false;
}

export function extendInitializationTimeout() {
  // No-op: Engine initializes synchronously in 0 ms
}

export function retryEngineInitialization() {
  if (updateListener) {
    updateListener();
  }
}

// ---------------------------------------------------------------------------
// Precision Cache Keys (Resolves E2: Exact instant down to milliseconds)
// ---------------------------------------------------------------------------
function getPositionCacheKey(date: Date, offsetHours?: number): string {
  const tzSuffix = typeof offsetHours === 'number' ? `_TZ${offsetHours}` : '';
  return `POS_${date.getTime()}${tzSuffix}`;
}

function getSolarCacheKey(lat: number, lon: number, date: Date, offsetHours?: number): string {
  const dStr = date.toISOString().split('T')[0];
  const tzSuffix = typeof offsetHours === 'number' ? `_TZ${offsetHours}` : '';
  return `SOLAR_${lat.toFixed(4)}_${lon.toFixed(4)}_${dStr}${tzSuffix}`;
}

function getMoonCacheKey(lat: number, lon: number, date: Date, offsetHours?: number): string {
  const dStr = date.toISOString().split('T')[0];
  const tzSuffix = typeof offsetHours === 'number' ? `_TZ${offsetHours}` : '';
  return `MOON_${lat.toFixed(4)}_${lon.toFixed(4)}_${dStr}${tzSuffix}`;
}

function getKundliCacheKey(lat: number, lon: number, date: Date, houseSystem: string, ayanamsha: string): string {
  return `KUNDLI_${lat.toFixed(4)}_${lon.toFixed(4)}_${date.getTime()}_${houseSystem}_${ayanamsha}`;
}

// ---------------------------------------------------------------------------
// Synchronous High-Precision Engine Implementation (Resolves E1, E4, E6)
// ---------------------------------------------------------------------------
class SanatanProprietaryAstronomicalEngine implements AstronomicalEngine {
  isReady(): boolean {
    return isEngineReady;
  }

  getSolarTimes(lat: number, lon: number, date: Date, offsetHours?: number): SolarTimes {
    if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error(`Invalid latitude: ${lat}. Must be between -90 and 90.`);
    }
    if (typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180) {
      throw new Error(`Invalid longitude: ${lon}. Must be between -180 and 180.`);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided for solar times calculation.`);
    }

    const cacheKey = getSolarCacheKey(lat, lon, date, offsetHours);
    const cached = solarCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculateSolarTimesCore(lat, lon, date, offsetHours);
    solarCache.set(cacheKey, result);
    return result;
  }

  getMoonTimes(sunriseMin: number, sunsetMin: number, tithiIdx: number, date: Date, lat: number, lon: number, offsetHours?: number): MoonTimes {
    if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error(`Invalid latitude: ${lat}. Must be between -90 and 90.`);
    }
    if (typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180) {
      throw new Error(`Invalid longitude: ${lon}. Must be between -180 and 180.`);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided for moon times calculation.`);
    }

    const cacheKey = getMoonCacheKey(lat, lon, date, offsetHours);
    const cached = moonCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculateMoonTimesCore(lat, lon, date, offsetHours);
    moonCache.set(cacheKey, result);
    return result;
  }

  getPanchangPositions(date: Date, offsetHours?: number): PanchangPositions {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided for panchang positions calculation.`);
    }

    const cacheKey = getPositionCacheKey(date, offsetHours);
    const cached = positionCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculatePanchangPositionsCore(date, offsetHours);
    positionCache.set(cacheKey, result);
    return result;
  }

  getNatalChart(
    lat: number,
    lon: number,
    date: Date,
    houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse' = 'Sripati',
    ayanamsha: AyanamshaSystem = 'Lahiri'
  ): NatalChartData {
    if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error(`Invalid latitude: ${lat}. Must be between -90 and 90.`);
    }
    if (typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180) {
      throw new Error(`Invalid longitude: ${lon}. Must be between -180 and 180.`);
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided for natal calculation.`);
    }

    const cacheKey = getKundliCacheKey(lat, lon, date, houseSystem, ayanamsha);
    const cached = kundliCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculateNatalChart(date, lat, lon, {
      houseSystem,
      ayanamshaSystem: ayanamsha
    });

    kundliCache.set(cacheKey, result);
    return result;
  }

  getAscendant(lat: number, lon: number, date: Date, ayanamsha: AyanamshaSystem = 'Lahiri'): AscendantDetail {
    const chart = this.getNatalChart(lat, lon, date, 'Sripati', ayanamsha);
    return chart.ascendant;
  }

  getHouseCusps(
    lat: number,
    lon: number,
    date: Date,
    houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse' = 'Sripati',
    ayanamsha: AyanamshaSystem = 'Lahiri'
  ): BhavaCuspDetail[] {
    const chart = this.getNatalChart(lat, lon, date, houseSystem, ayanamsha);
    return chart.cusps;
  }
}

export const astronomicalEngine: AstronomicalEngine = new SanatanProprietaryAstronomicalEngine();
