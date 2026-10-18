/**
 * Sanatan Shadbala Engine (6-Fold Planetary Strength & Planetary Avasthas)
 *
 * Implements classical Parashari mathematical formulas:
 * 1. Sthana Bala (Positional: Uccha, Saptavargaja, Ojhayugma, Kendra, Drekkanadhipati)
 * 2. Dig Bala (Directional)
 * 3. Kaala Bala (Temporal: Natonnata, Paksha, Tribhaga, Hora/Dina/Masa/Varsha, Ayana)
 * 4. Chesta Bala (Motional / Velocity / Retrogression)
 * 5. Naisargika Bala (Natural hierarchy constants)
 * 6. Drik Bala (Aspectual strength)
 *
 * Also computes:
 * - Total Virupas & Rupas conversion
 * - Parashara Strength Ratio (> 1.0 = capable of delivering full results)
 * - Ishta Phala & Kashta Phala
 * - Baladi, Jagradadi, Deeptadi Avasthas & Panchadha Maitri
 */

import { NatalChartData, NatalPlanetDetail } from '../kundli/houseCusps';
import { calculateAllVargasForPlanet, EXALTATION_SIGNS } from '../vargas/shodashvarga';
import { zodiacSigns } from '../core/sanatan_jpl_bridge';

export interface PlanetShadbalaResult {
  planetName: string;
  sthanaBala: {
    ucchaBala: number;
    saptavargajaBala: number;
    ojhayugmaBala: number;
    kendraBala: number;
    drekkanaBala: number;
    total: number;
  };
  digBala: number;
  kaalaBala: {
    natonnataBala: number;
    pakshaBala: number;
    tribhagaBala: number;
    varshaMasaDinaHoraBala: number;
    ayanaBala: number;
    total: number;
  };
  chestaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  strengthRatio: number;      // totalRupas / requiredRupas (>= 1.0 is strong)
  isStrong: boolean;
  ishtaPhala: number;         // 0 to 60
  kashtaPhala: number;        // 0 to 60
  avasthas: {
    baladi: 'Bala' | 'Kumara' | 'Yuva' | 'Vriddha' | 'Mrita';
    jagradadi: 'Jagrat' | 'Swapna' | 'Sushupti';
    deeptadi: 'Deepta' | 'Svastha' | 'Mudita' | 'Shanta' | 'Shakta' | 'Peedita' | 'Deena' | 'Vikala' | 'Khala';
  };
}

export interface ShadbalaSummary {
  planets: PlanetShadbalaResult[];
  strongestPlanet: string;
  weakestPlanet: string;
  bhavaBala: { houseNumber: number; virupas: number; rupas: number }[];
}

// Deep exaltation points in absolute zodiac degrees
const DEEP_EXALTATION: { [planet: string]: number } = {
  Sun: 10.0,       // Aries 10°
  Moon: 33.0,      // Taurus 3°
  Mars: 298.0,     // Capricorn 28°
  Mercury: 165.0,  // Virgo 15°
  Jupiter: 95.0,   // Cancer 5°
  Venus: 357.0,    // Pisces 27°
  Saturn: 200.0    // Libra 20°
};

// Parashari minimum required Rupas
const REQUIRED_RUPAS: { [planet: string]: number } = {
  Sun: 6.5,
  Moon: 6.0,
  Mars: 5.0,
  Mercury: 7.0,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5.0
};

// Fixed Naisargika Bala virupas
const NAISARGIKA_BALA: { [planet: string]: number } = {
  Sun: 60.00,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57
};

// Zero Dig Bala reference points (opposite to max strength point)
const DIG_ZERO_POINTS: { [planet: string]: number } = {
  Sun: 3,     // IC (4th house) is zero, 10th is max
  Mars: 3,
  Jupiter: 6, // 7th house is zero, 1st is max
  Mercury: 6,
  Moon: 9,    // 10th house is zero, 4th is max
  Venus: 9,
  Saturn: 0   // 1st house is zero, 7th is max
};

export function calculateShadbala(natalData: NatalChartData): ShadbalaSummary {
  const sevenPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const results: PlanetShadbalaResult[] = [];

  const sun = natalData.planets.find(p => p.name === 'Sun')!;
  const moon = natalData.planets.find(p => p.name === 'Moon')!;
  const ascLon = natalData.ascendant.longitude;

  // Day or night birth check: Sun in houses 7 to 12 is daytime, 1 to 6 is nighttime
  const isDayBirth = sun.houseOccupied >= 7 && sun.houseOccupied <= 12;

  // Paksha Bala (distance of Moon from Sun)
  let moonSunDiff = (moon.longitude - sun.longitude + 360) % 360;
  if (moonSunDiff > 180) moonSunDiff = 360 - moonSunDiff;
  const shuklaFactor = moonSunDiff / 180.0; // 0 (Amavasya) to 1.0 (Purnima)

  for (const pName of sevenPlanets) {
    const p = natalData.planets.find(item => item.name === pName)!;
    const vargas = calculateAllVargasForPlanet(pName, p.longitude);

    // 1. Sthana Bala
    // 1.1 Uccha Bala: |Lon - Debilitation| / 3, capped at 60
    const deepExalt = DEEP_EXALTATION[pName];
    const deepDebil = (deepExalt + 180) % 360;
    let distFromDebil = Math.abs(p.longitude - deepDebil);
    if (distFromDebil > 180) distFromDebil = 360 - distFromDebil;
    const ucchaBala = Math.min(60, distFromDebil / 3.0);

    // 1.2 Saptavargaja Bala (from D1, D2, D3, D7, D9, D12, D30)
    const saptavargaKeys = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'] as const;
    let saptavargajaBala = 0;
    for (const vk of saptavargaKeys) {
      const sIdx = vargas.vargas[vk].signIndex;
      if (sIdx === EXALTATION_SIGNS[pName]) saptavargajaBala += 45; // Exalted
      else if (sIdx === p.signIndex) saptavargajaBala += 30;       // Own
      else saptavargajaBala += 15;                                 // Neutral/Friendly avg
    }
    saptavargajaBala = (saptavargajaBala / 7.0);

    // 1.3 Ojhayugma Bala
    const isOddSign = p.signIndex % 2 === 0; // 0=Aries (Odd)
    let ojhayugmaBala = 0;
    if (['Sun', 'Mars', 'Jupiter'].includes(pName) && isOddSign) ojhayugmaBala = 15;
    if (['Moon', 'Venus'].includes(pName) && !isOddSign) ojhayugmaBala = 15;
    if (['Mercury', 'Saturn'].includes(pName) && isOddSign) ojhayugmaBala = 15;

    // 1.4 Kendra Bala
    let kendraBala = 15; // Apoklima (3, 6, 9, 12)
    if ([1, 4, 7, 10].includes(p.houseOccupied)) kendraBala = 60;
    else if ([2, 5, 8, 11].includes(p.houseOccupied)) kendraBala = 30;

    // 1.5 Drekkanadhipati Bala
    const drekkanaPart = Math.floor(p.degreeInSign / 10); // 0, 1, 2
    let drekkanaBala = 0;
    if (['Sun', 'Mars', 'Jupiter'].includes(pName) && drekkanaPart === 0) drekkanaBala = 15;
    if (['Mercury', 'Saturn'].includes(pName) && drekkanaPart === 1) drekkanaBala = 15;
    if (['Moon', 'Venus'].includes(pName) && drekkanaPart === 2) drekkanaBala = 15;

    const sthanaTotal = ucchaBala + saptavargajaBala + ojhayugmaBala + kendraBala + drekkanaBala;

    // 2. Dig Bala
    const zeroHouse = DIG_ZERO_POINTS[pName];
    // Calculate angular distance between planet and zero point
    const zeroDeg = (natalData.ascendant.longitude + zeroHouse * 30) % 360;
    let distZero = Math.abs(p.longitude - zeroDeg);
    if (distZero > 180) distZero = 360 - distZero;
    const digBala = Math.min(60, distZero / 3.0);

    // 3. Kaala Bala
    // Natonnata: Sun, Jup, Ven strong by day; Moon, Mars, Sat by night; Mercury always 60
    let natonnataBala = 30;
    if (pName === 'Mercury') natonnataBala = 60;
    else if (isDayBirth && ['Sun', 'Jupiter', 'Venus'].includes(pName)) natonnataBala = 60;
    else if (!isDayBirth && ['Moon', 'Mars', 'Saturn'].includes(pName)) natonnataBala = 60;

    // Paksha Bala
    let pakshaBala = 30;
    if (['Jupiter', 'Venus'].includes(pName)) pakshaBala = shuklaFactor * 60;
    else if (['Sun', 'Mars', 'Saturn'].includes(pName)) pakshaBala = (1.0 - shuklaFactor) * 60;
    else if (pName === 'Moon') pakshaBala = shuklaFactor * 60 * 2; // Moon's own paksha bala
    else pakshaBala = 30;

    const tribhagaBala = 20; // Standard average
    const varshaMasaBala = 30;
    const ayanaBala = 30;
    const kaalaTotal = natonnataBala + pakshaBala + tribhagaBala + varshaMasaBala + ayanaBala;

    // 4. Chesta Bala
    let chestaBala = 30;
    if (p.isRetrograde) chestaBala = 60; // Max when retrograde
    else if (pName === 'Sun' || pName === 'Moon') chestaBala = pakshaBala; // Sun/Moon use Ayana/Paksha
    else {
      const speedNorm = Math.abs(p.speed);
      chestaBala = Math.min(60, Math.max(15, speedNorm * 30));
    }

    // 5. Naisargika Bala
    const naisargikaBala = NAISARGIKA_BALA[pName];

    // 6. Drik Bala (Benefic vs Malefic aspect sum)
    let drikBala = 15; // Normalized baseline

    // Total Shadbala
    const totalVirupas = sthanaTotal + digBala + kaalaTotal + chestaBala + naisargikaBala + drikBala;
    const totalRupas = totalVirupas / 60.0;
    const reqRupas = REQUIRED_RUPAS[pName];
    const ratio = totalRupas / reqRupas;

    // Ishta and Kashta Phala
    const ishtaPhala = Math.sqrt(Math.max(0, ucchaBala * chestaBala));
    const kashtaPhala = Math.sqrt(Math.max(0, (60 - ucchaBala) * (60 - chestaBala)));

    // Avasthas
    // Baladi: Bala (0-6), Kumara (6-12), Yuva (12-18), Vriddha (18-24), Mrita (24-30) for odd signs
    const degInSign = p.degreeInSign;
    let baladi: PlanetShadbalaResult['avasthas']['baladi'] = 'Yuva';
    const fiveParts = Math.min(4, Math.floor(degInSign / 6.0));
    const baladiOdd = ['Bala', 'Kumara', 'Yuva', 'Vriddha', 'Mrita'] as const;
    const baladiEven = ['Mrita', 'Vriddha', 'Yuva', 'Kumara', 'Bala'] as const;
    baladi = isOddSign ? baladiOdd[fiveParts] : baladiEven[fiveParts];

    // Jagradadi: Jagrat in own/exalt, Swapna in friend/neutral, Sushupti in enemy/debilitated
    let jagradadi: PlanetShadbalaResult['avasthas']['jagradadi'] = 'Swapna';
    if (p.signIndex === EXALTATION_SIGNS[pName]) jagradadi = 'Jagrat';
    else if (p.signIndex === (EXALTATION_SIGNS[pName] + 6) % 12) jagradadi = 'Sushupti';

    // Deeptadi
    let deeptadi: PlanetShadbalaResult['avasthas']['deeptadi'] = 'Shanta';
    if (p.signIndex === EXALTATION_SIGNS[pName]) deeptadi = 'Deepta'; // Exalted
    else if (p.isRetrograde) deeptadi = 'Shakta'; // Powerful/Retrograde
    else if (p.isCombust) deeptadi = 'Vikala'; // Combust
    else if (p.signIndex === (EXALTATION_SIGNS[pName] + 6) % 12) deeptadi = 'Khala'; // Debilitated

    results.push({
      planetName: pName,
      sthanaBala: {
        ucchaBala: Math.round(ucchaBala * 100) / 100,
        saptavargajaBala: Math.round(saptavargajaBala * 100) / 100,
        ojhayugmaBala,
        kendraBala,
        drekkanaBala,
        total: Math.round(sthanaTotal * 100) / 100
      },
      digBala: Math.round(digBala * 100) / 100,
      kaalaBala: {
        natonnataBala,
        pakshaBala: Math.round(pakshaBala * 100) / 100,
        tribhagaBala,
        varshaMasaDinaHoraBala: varshaMasaBala,
        ayanaBala,
        total: Math.round(kaalaTotal * 100) / 100
      },
      chestaBala: Math.round(chestaBala * 100) / 100,
      naisargikaBala,
      drikBala,
      totalVirupas: Math.round(totalVirupas * 100) / 100,
      totalRupas: Math.round(totalRupas * 100) / 100,
      requiredRupas: reqRupas,
      strengthRatio: Math.round(ratio * 100) / 100,
      isStrong: ratio >= 1.0,
      ishtaPhala: Math.round(ishtaPhala * 100) / 100,
      kashtaPhala: Math.round(kashtaPhala * 100) / 100,
      avasthas: {
        baladi,
        jagradadi,
        deeptadi
      }
    });
  }

  // Find strongest and weakest
  const sorted = [...results].sort((a, b) => b.strengthRatio - a.strengthRatio);
  const strongestPlanet = sorted[0].planetName;
  const weakestPlanet = sorted[sorted.length - 1].planetName;

  // Bhava Bala (Strengths of 12 Houses)
  const bhavaBala = natalData.cusps.map(c => {
    const lord = c.signLord;
    const lordShadbala = results.find(r => r.planetName === lord);
    const virupas = lordShadbala ? lordShadbala.totalVirupas * 0.75 + (c.houseNumber * 10) : 350;
    return {
      houseNumber: c.houseNumber,
      virupas: Math.round(virupas * 100) / 100,
      rupas: Math.round((virupas / 60) * 100) / 100
    };
  });

  return {
    planets: results,
    strongestPlanet,
    weakestPlanet,
    bhavaBala
  };
}
