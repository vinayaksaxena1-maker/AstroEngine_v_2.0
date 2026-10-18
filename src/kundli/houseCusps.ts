/**
 * Sanatan Kundli Engine: Natal Horizon & House Cusps Adapter
 *
 * Computes exact Sidereal Ascendant (Lagna), 12 Bhava Cusps (Sripati, Placidus, Equal),
 * Bhava Sandhis, and complete Natal Planetary Longitudes with Combustion & Retrogrades.
 */

import {
  drik_calc_ut,
  drik_get_ayanamsa_ut,
  getAyanamshaForSystem,
  AyanamshaSystem,
  drik_houses,
  SE_SUN,
  SE_MOON,
  SE_MERCURY,
  SE_VENUS,
  SE_MARS,
  SE_JUPITER,
  SE_SATURN,
  SE_MEAN_NODE,
  SE_TRUE_NODE,
  SE_KETU,
  zodiacSigns,
  Grahas
} from '../core/sanatan_jpl_bridge';

export interface BhavaCuspDetail {
  houseNumber: number;      // 1 to 12
  startLongitude: number;   // 0 to 360
  midLongitude: number;     // Bhava Madhya (0 to 360)
  endLongitude: number;     // Bhava Sandhi (0 to 360)
  signIndex: number;        // 0 to 11
  signName: string;
  signHindi: string;
  signLord: string;
}

export interface NatalPlanetDetail {
  id: number;
  name: string;
  hindiName: string;
  longitude: number;        // 0 to 360 sidereal
  latitude: number;
  speed: number;            // deg/day
  isRetrograde: boolean;
  isCombust: boolean;
  signIndex: number;        // 0 to 11
  signName: string;
  signHindi: string;
  degreeInSign: number;     // 0 to 30
  degreeFormatted: string;  // e.g. "14°25'12\""
  nakshatraIndex: number;   // 0 to 26
  nakshatraName: string;
  nakshatraPada: number;    // 1 to 4
  nakshatraLord: string;
  houseOccupied: number;    // 1 to 12 (based on Lagna sign or Bhava Madhya)
}

export interface NatalChartData {
  birthDate: Date;
  latitude: number;
  longitude: number;
  jd_ut: number;
  ayanamsa: number;
  ayanamshaSystem: AyanamshaSystem;
  ascendant: {
    longitude: number;
    signIndex: number;
    signName: string;
    signHindi: string;
    degreeInSign: number;
    degreeFormatted: string;
    nakshatraIndex: number;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    signLord: string;
  };
  midheaven: {
    longitude: number;
    signIndex: number;
    signName: string;
  };
  houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse';
  cusps: BhavaCuspDetail[];
  planets: NatalPlanetDetail[];
}

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
];

export const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

// Combustion orbs in degrees
const COMBUSTION_ORBS: { [planet: string]: number } = {
  Moon: 12.0,
  Mars: 17.0,
  Mercury: 14.0,
  Jupiter: 11.0,
  Venus: 10.0,
  Saturn: 15.0
};

export function formatDegrees(deg: number): string {
  const norm = (deg % 360 + 360) % 360;
  const d = Math.floor(norm);
  const mFloat = (norm - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}

export function getNakshatraInfo(longitude: number): { index: number; name: string; pada: number; lord: string } {
  const norm = (longitude % 360 + 360) % 360;
  const naksSpan = 13.333333333333334; // 13°20'
  const index = Math.floor(norm / naksSpan) % 27;
  const rem = norm % naksSpan;
  const pada = Math.floor(rem / 3.3333333333333335) + 1;
  return {
    index,
    name: NAKSHATRA_NAMES[index],
    pada: Math.min(4, Math.max(1, pada)),
    lord: NAKSHATRA_LORDS[index]
  };
}

/**
 * Computes complete Natal Kundli data including Ascendant, Cusps, and Grahas
 */
export interface NatalChartOptions {
  houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse';
  ayanamshaSystem?: AyanamshaSystem;
}

export function calculateNatalChart(
  birthDate: Date,
  latitude: number,
  longitude: number,
  options: NatalChartOptions = {}
): NatalChartData {
  const houseSystem = options.houseSystem || 'Sripati';
  const ayanamshaSystem = options.ayanamshaSystem || 'Lahiri';
  let sysChar = 'O'; // Sripati (Porphyry) default
  if (houseSystem === 'Placidus') sysChar = 'P';
  if (houseSystem === 'EqualHouse') sysChar = 'E';

  const jd_ut = (birthDate.getTime() / 86400000) + 2440587.5;
  const ayanamsa = getAyanamshaForSystem(jd_ut, ayanamshaSystem);

  const houses = drik_houses(jd_ut, latitude, longitude, sysChar);
  const siderealAsc = (houses.ascmc[0] - ayanamsa + 360) % 360;
  const siderealMC = (houses.ascmc[1] - ayanamsa + 360) % 360;

  const ascSignIdx = Math.floor(siderealAsc / 30);
  const ascDegInSign = siderealAsc % 30;
  const ascNaks = getNakshatraInfo(siderealAsc);

  // Raw sidereal house cusps (index 1 to 12)
  const rawCusps: number[] = [];
  for (let i = 1; i <= 12; i++) {
    rawCusps.push((houses.cusps[i] - ayanamsa + 360) % 360);
  }

  // Bhava Sandhi (start and end) calculation for Sripati
  const cuspDetails: BhavaCuspDetail[] = [];
  for (let i = 0; i < 12; i++) {
    const mid = rawCusps[i];
    const prevMid = rawCusps[(i + 11) % 12];
    const nextMid = rawCusps[(i + 1) % 12];

    let start = 0;
    if (mid >= prevMid) {
      start = (prevMid + mid) / 2.0;
    } else {
      start = ((prevMid + mid + 360.0) / 2.0) % 360.0;
    }

    let end = 0;
    if (nextMid >= mid) {
      end = (mid + nextMid) / 2.0;
    } else {
      end = ((mid + nextMid + 360.0) / 2.0) % 360.0;
    }

    const signIdx = Math.floor(mid / 30);
    cuspDetails.push({
      houseNumber: i + 1,
      startLongitude: start,
      midLongitude: mid,
      endLongitude: end,
      signIndex: signIdx,
      signName: zodiacSigns[signIdx].eng,
      signHindi: zodiacSigns[signIdx].hin,
      signLord: SIGN_LORDS[signIdx]
    });
  }

  // Natal Planetary Coordinates
  const bodies = [
    { id: SE_SUN, name: 'Sun', hindiName: 'सूर्य' },
    { id: SE_MOON, name: 'Moon', hindiName: 'चन्द्र' },
    { id: SE_MARS, name: 'Mars', hindiName: 'मंगल' },
    { id: SE_MERCURY, name: 'Mercury', hindiName: 'बुध' },
    { id: SE_JUPITER, name: 'Jupiter', hindiName: 'गुरु' },
    { id: SE_VENUS, name: 'Venus', hindiName: 'शुक्र' },
    { id: SE_SATURN, name: 'Saturn', hindiName: 'शनि' },
    { id: SE_MEAN_NODE, name: 'Rahu', hindiName: 'राहु' }
  ];

  const planets: NatalPlanetDetail[] = [];
  let sunLon = 0;

  for (const b of bodies) {
    const calc = drik_calc_ut(jd_ut, b.id);
    const sidLon = (calc[0] - ayanamsa + 360) % 360;
    const speed = calc[3];
    const signIdx = Math.floor(sidLon / 30);
    const degInSign = sidLon % 30;
    const naks = getNakshatraInfo(sidLon);

    if (b.id === SE_SUN) {
      sunLon = sidLon;
    }

    // Determine occupied house based on Lagna sign: House 1 = Lagna sign
    const houseFromLagna = ((signIdx - ascSignIdx + 12) % 12) + 1;

    planets.push({
      id: b.id,
      name: b.name,
      hindiName: b.hindiName,
      longitude: sidLon,
      latitude: calc[1],
      speed,
      isRetrograde: speed < 0,
      isCombust: false, // Calculated after Sun is known
      signIndex: signIdx,
      signName: zodiacSigns[signIdx].eng,
      signHindi: zodiacSigns[signIdx].hin,
      degreeInSign: degInSign,
      degreeFormatted: formatDegrees(degInSign),
      nakshatraIndex: naks.index,
      nakshatraName: naks.name,
      nakshatraPada: naks.pada,
      nakshatraLord: naks.lord,
      houseOccupied: houseFromLagna
    });
  }

  // Add Ketu (Rahu + 180)
  const rahu = planets.find(p => p.name === 'Rahu')!;
  const ketuLon = (rahu.longitude + 180) % 360;
  const ketuSignIdx = Math.floor(ketuLon / 30);
  const ketuDegInSign = ketuLon % 30;
  const ketuNaks = getNakshatraInfo(ketuLon);
  const ketuHouse = ((ketuSignIdx - ascSignIdx + 12) % 12) + 1;

  planets.push({
    id: SE_KETU,
    name: 'Ketu',
    hindiName: 'केतु',
    longitude: ketuLon,
    latitude: 0,
    speed: rahu.speed,
    isRetrograde: true,
    isCombust: false,
    signIndex: ketuSignIdx,
    signName: zodiacSigns[ketuSignIdx].eng,
    signHindi: zodiacSigns[ketuSignIdx].hin,
    degreeInSign: ketuDegInSign,
    degreeFormatted: formatDegrees(ketuDegInSign),
    nakshatraIndex: ketuNaks.index,
    nakshatraName: ketuNaks.name,
    nakshatraPada: ketuNaks.pada,
    nakshatraLord: ketuNaks.lord,
    houseOccupied: ketuHouse
  });

  // Evaluate Combustion against Sun
  for (const p of planets) {
    if (p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      const orb = COMBUSTION_ORBS[p.name] || 12.0;
      let diff = Math.abs(p.longitude - sunLon);
      if (diff > 180) diff = 360 - diff;
      p.isCombust = diff <= orb;
    }
  }

  return {
    birthDate,
    latitude,
    longitude,
    jd_ut,
    ayanamsa,
    ayanamshaSystem,
    ascendant: {
      longitude: siderealAsc,
      signIndex: ascSignIdx,
      signName: zodiacSigns[ascSignIdx].eng,
      signHindi: zodiacSigns[ascSignIdx].hin,
      degreeInSign: ascDegInSign,
      degreeFormatted: formatDegrees(ascDegInSign),
      nakshatraIndex: ascNaks.index,
      nakshatraName: ascNaks.name,
      nakshatraPada: ascNaks.pada,
      nakshatraLord: ascNaks.lord,
      signLord: SIGN_LORDS[ascSignIdx]
    },
    midheaven: {
      longitude: siderealMC,
      signIndex: Math.floor(siderealMC / 30),
      signName: zodiacSigns[Math.floor(siderealMC / 30)].eng
    },
    houseSystem,
    cusps: cuspDetails,
    planets
  };
}
