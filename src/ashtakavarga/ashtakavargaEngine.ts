/**
 * Sanatan Vedic Astrology Engine: Ashtakavarga Engine
 *
 * Implements:
 * 1. Bhinnashtakavarga (BAV) for 7 Grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
 *    using classical Parashari benefic dot matrices (Sun: 48, Moon: 49, Mars: 39,
 *    Mercury: 54, Jupiter: 56, Venus: 52, Saturn: 39).
 * 2. Sarvashtakavarga (SAV) Matrix with strict Invariant Assertion: Sum(SAV) == 337.
 * 3. Trikona Shodhana (1st Reduction across sign trines 1-5-9, 2-6-10, 3-7-11, 4-8-12).
 * 4. Ekadhipatya Shodhana (2nd Reduction for dual lordship signs Mars, Mercury, Jupiter, Venus, Saturn).
 * 5. Shodhya Pinda (Rashi Pinda, Graha Pinda, Shodhya Pinda) and Kakshya transit triggers.
 */

import { NatalChartData, NatalPlanetDetail } from '../kundli/houseCusps';
import { zodiacSigns } from '../core/sanatan_jpl_bridge';

// Contributor names: 7 Grahas + Lagna
export const ASHTAKAVARGA_CONTRIBUTORS = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Ascendant'
] as const;

export type ContributorName = (typeof ASHTAKAVARGA_CONTRIBUTORS)[number];

// 7 Grahas evaluated in Ashtakavarga
export const ASHTAKAVARGA_GRAHAS = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn'
] as const;

export type AshtakavargaGraha = (typeof ASHTAKAVARGA_GRAHAS)[number];

/**
 * Classical Parashari Benefic House Positions (1-indexed house distance)
 * for each Graha BAV from the 8 contributors.
 */
export const PARASHARA_BAV_RULES: Record<
  AshtakavargaGraha,
  Record<ContributorName, number[]>
> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [3, 4, 6, 10, 11, 12]
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Ascendant: [3, 6, 10, 11]
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 3, 6, 10, 11]
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 2, 4, 6, 8, 10, 11]
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Ascendant: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Ascendant: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Ascendant: [1, 3, 4, 6, 10, 11]
  }
};

/**
 * Expected Classical Total Dots per Planet BAV
 */
export const EXPECTED_BAV_TOTALS: Record<AshtakavargaGraha, number> = {
  Sun: 48,
  Moon: 49,
  Mars: 39,
  Mercury: 54,
  Jupiter: 56,
  Venus: 52,
  Saturn: 39
};

/**
 * Classical Multipliers for Shodhya Pinda (Pinda Sadhana)
 */
export const RASHI_PINDA_MULTIPLIERS = [7, 10, 8, 4, 10, 6, 7, 8, 9, 5, 11, 12]; // Aries to Pisces (0 to 11)

export const GRAHA_PINDA_MULTIPLIERS: Record<AshtakavargaGraha, number> = {
  Sun: 5,
  Moon: 5,
  Mars: 8,
  Mercury: 5,
  Jupiter: 10,
  Venus: 7,
  Saturn: 5
};

/**
 * Kakshya Lords in ascending order of orbital speed within each sign (3°45' each)
 */
export const KAKSHYA_LORDS: ContributorName[] = [
  'Saturn',    // 0°00' - 3°45'
  'Jupiter',   // 3°45' - 7°30'
  'Mars',      // 7°30' - 11°15'
  'Sun',       // 11°15' - 15°00'
  'Venus',     // 15°00' - 18°45'
  'Mercury',   // 18°45' - 22°30'
  'Moon',      // 22°30' - 26°15'
  'Ascendant'  // 26°15' - 30°00'
];

export interface BAVSignDetail {
  signIndex: number;         // 0 to 11 (Aries to Pisces)
  signName: string;
  signHindi: string;
  houseFromLagna: number;    // 1 to 12
  pointsFrom: Record<ContributorName, number>; // 0 or 1 from each contributor
  totalBindus: number;       // Sum (0 to 8)
}

export interface BAVMatrix {
  graha: AshtakavargaGraha;
  totalPoints: number;       // Should match EXPECTED_BAV_TOTALS
  signs: BAVSignDetail[];    // Array of 12 signs
  bindusBySign: number[];    // Array of 12 integers [Aries..Pisces]
  bindusByHouse: number[];   // Array of 12 integers [House 1..House 12]
}

export interface SAVSignDetail {
  signIndex: number;         // 0 to 11
  signName: string;
  signHindi: string;
  houseFromLagna: number;    // 1 to 12
  grahaPoints: Record<AshtakavargaGraha, number>;
  totalBindus: number;       // Sum across 7 grahas
  evaluation: 'Very Auspicious' | 'Auspicious' | 'Average' | 'Challenging';
}

export interface SAVMatrix {
  totalPoints: number;       // Strictly 337
  signs: SAVSignDetail[];    // 12 signs
  bindusBySign: number[];    // 12 integers
  bindusByHouse: number[];   // 12 integers
  isInvariantValid: boolean; // true if sum == 337
}

export interface ShodhanaResult {
  graha: AshtakavargaGraha;
  originalBindus: number[];  // 12 signs
  trikonaShodhita: number[]; // After 1st reduction
  ekadhipatyaShodhita: number[]; // After 2nd reduction
  rashiPinda: number;
  grahaPinda: number;
  shodhyaPinda: number;      // rashiPinda + grahaPinda
}

export interface KakshyaTransitEvaluation {
  graha: AshtakavargaGraha;
  transitLongitude: number;
  signIndex: number;
  kakshyaIndex: number;      // 0 to 7
  kakshyaLord: ContributorName;
  degreeInSign: number;
  hasBeneficPoint: boolean;  // true if natal BAV has 1 from this lord in this sign
  isFavorableTransit: boolean;
}

export interface FullAshtakavargaReport {
  bav: Record<AshtakavargaGraha, BAVMatrix>;
  sav: SAVMatrix;
  shodhana: Record<AshtakavargaGraha, ShodhanaResult>;
  totalSAVPoints: number;
  isSAV337InvariantMet: boolean;
}

/**
 * Computes individual BAV for a specific Graha based on natal planet sign placements.
 */
export function calculateSingleBAV(
  targetGraha: AshtakavargaGraha,
  natalSignPlacements: Record<ContributorName, number>,
  lagnaSignIndex: number
): BAVMatrix {
  const rules = PARASHARA_BAV_RULES[targetGraha];
  const signs: BAVSignDetail[] = [];
  const bindusBySign: number[] = new Array(12).fill(0);
  const bindusByHouse: number[] = new Array(12).fill(0);
  let grandTotal = 0;

  for (let s = 0; s < 12; s++) {
    const pointsFrom: Record<ContributorName, number> = {} as any;
    let signTotal = 0;

    for (const contrib of ASHTAKAVARGA_CONTRIBUTORS) {
      const contribSign = natalSignPlacements[contrib];
      // House distance (1 to 12) from contributor to sign s
      const houseDistance = ((s - contribSign + 12) % 12) + 1;
      const isBenefic = rules[contrib].includes(houseDistance) ? 1 : 0;
      pointsFrom[contrib] = isBenefic;
      signTotal += isBenefic;
    }

    const houseFromLagna = ((s - lagnaSignIndex + 12) % 12) + 1;
    bindusBySign[s] = signTotal;
    bindusByHouse[houseFromLagna - 1] = signTotal;
    grandTotal += signTotal;

    signs.push({
      signIndex: s,
      signName: zodiacSigns[s].eng,
      signHindi: zodiacSigns[s].hin,
      houseFromLagna,
      pointsFrom,
      totalBindus: signTotal
    });
  }

  return {
    graha: targetGraha,
    totalPoints: grandTotal,
    signs,
    bindusBySign,
    bindusByHouse
  };
}

/**
 * Calculates Sarvashtakavarga (SAV) from 7 BAV matrices.
 */
export function calculateSAV(
  bavRecords: Record<AshtakavargaGraha, BAVMatrix>,
  lagnaSignIndex: number
): SAVMatrix {
  const signs: SAVSignDetail[] = [];
  const bindusBySign: number[] = new Array(12).fill(0);
  const bindusByHouse: number[] = new Array(12).fill(0);
  let totalPoints = 0;

  for (let s = 0; s < 12; s++) {
    const grahaPoints: Record<AshtakavargaGraha, number> = {} as any;
    let signSum = 0;

    for (const g of ASHTAKAVARGA_GRAHAS) {
      const gPoints = bavRecords[g].bindusBySign[s];
      grahaPoints[g] = gPoints;
      signSum += gPoints;
    }

    const houseFromLagna = ((s - lagnaSignIndex + 12) % 12) + 1;
    bindusBySign[s] = signSum;
    bindusByHouse[houseFromLagna - 1] = signSum;
    totalPoints += signSum;

    let evaluation: 'Very Auspicious' | 'Auspicious' | 'Average' | 'Challenging';
    if (signSum >= 33) evaluation = 'Very Auspicious';
    else if (signSum >= 28) evaluation = 'Auspicious';
    else if (signSum >= 24) evaluation = 'Average';
    else evaluation = 'Challenging';

    signs.push({
      signIndex: s,
      signName: zodiacSigns[s].eng,
      signHindi: zodiacSigns[s].hin,
      houseFromLagna,
      grahaPoints,
      totalBindus: signSum,
      evaluation
    });
  }

  return {
    totalPoints,
    signs,
    bindusBySign,
    bindusByHouse,
    isInvariantValid: totalPoints === 337
  };
}

/**
 * Classical Trikona Shodhana (1st Ashtakavarga Reduction)
 * Trines: 0-4-8 (Aries, Leo, Sag), 1-5-9 (Taurus, Virgo, Cap),
 * 2-6-10 (Gemini, Libra, Aqua), 3-7-11 (Cancer, Scorpio, Pisces).
 */
export function applyTrikonaShodhana(inputBindus: number[]): number[] {
  const result = [...inputBindus];
  const trines = [
    [0, 4, 8],   // Fire
    [1, 5, 9],   // Earth
    [2, 6, 10],  // Air
    [3, 7, 11]   // Water
  ];

  for (const trine of trines) {
    const [i1, i2, i3] = trine;
    const v1 = result[i1];
    const v2 = result[i2];
    const v3 = result[i3];

    // Case 1: All three are equal
    if (v1 === v2 && v2 === v3) {
      result[i1] = 0;
      result[i2] = 0;
      result[i3] = 0;
      continue;
    }

    // Case 2: One or more are zero
    const zeros = (v1 === 0 ? 1 : 0) + (v2 === 0 ? 1 : 0) + (v3 === 0 ? 1 : 0);
    if (zeros === 2) {
      // Two signs have zero: the third remains unchanged
      continue;
    }
    if (zeros === 1) {
      // Exactly one sign is zero
      // If the remaining two are equal, reduce both to zero
      // If unequal, they remain unchanged
      if (v1 === 0) {
        if (v2 === v3) {
          result[i2] = 0;
          result[i3] = 0;
        }
      } else if (v2 === 0) {
        if (v1 === v3) {
          result[i1] = 0;
          result[i3] = 0;
        }
      } else {
        // v3 === 0
        if (v1 === v2) {
          result[i1] = 0;
          result[i2] = 0;
        }
      }
      continue;
    }

    // Case 3: None are zero and not all are equal
    // Subtract minimum from all three
    const minVal = Math.min(v1, v2, v3);
    result[i1] -= minVal;
    result[i2] -= minVal;
    result[i3] -= minVal;
  }

  return result;
}

/**
 * Classical Ekadhipatya Shodhana (2nd Ashtakavarga Reduction)
 * Applied to dual-sign rulers:
 * - Mars: Aries (0) & Scorpio (7)
 * - Venus: Taurus (1) & Libra (6)
 * - Mercury: Gemini (2) & Virgo (5)
 * - Jupiter: Sagittarius (8) & Pisces (11)
 * - Saturn: Capricorn (9) & Aquarius (10)
 * Note: Sun (Leo 4) and Moon (Cancer 3) are single lords, exempt from Ekadhipatya Shodhana.
 */
export function applyEkadhipatyaShodhana(
  trikonaBindus: number[],
  planetOccupations: number[] // Planet count in each sign 0..11
): number[] {
  const result = [...trikonaBindus];
  const dualPairs = [
    [0, 7],   // Mars: Aries, Scorpio
    [1, 6],   // Venus: Taurus, Libra
    [2, 5],   // Mercury: Gemini, Virgo
    [8, 11],  // Jupiter: Sag, Pisces
    [9, 10]   // Saturn: Cap, Aqua
  ];

  for (const pair of dualPairs) {
    const [s1, s2] = pair;
    let v1 = result[s1];
    let v2 = result[s2];
    const o1 = planetOccupations[s1] || 0;
    const o2 = planetOccupations[s2] || 0;

    // If either sign is 0, no reduction is done
    if (v1 === 0 || v2 === 0) {
      continue;
    }

    // Scenario I: Both signs occupied by planets -> No reduction
    if (o1 > 0 && o2 > 0) {
      continue;
    }

    // Scenario II: One occupied, one unoccupied
    if (o1 > 0 && o2 === 0) {
      // s1 is occupied, s2 is unoccupied
      if (v1 >= v2) {
        result[s2] = 0;
      } else {
        result[s2] = v1;
      }
      continue;
    }

    if (o2 > 0 && o1 === 0) {
      // s2 is occupied, s1 is unoccupied
      if (v2 >= v1) {
        result[s1] = 0;
      } else {
        result[s1] = v2;
      }
      continue;
    }

    // Scenario III: Both unoccupied
    if (o1 === 0 && o2 === 0) {
      if (v1 === v2) {
        result[s1] = 0;
        result[s2] = 0;
      } else {
        // Larger is adjusted to match smaller
        const minVal = Math.min(v1, v2);
        result[s1] = minVal;
        result[s2] = minVal;
      }
    }
  }

  return result;
}

/**
 * Calculates Shodhya Pinda (Rashi Pinda + Graha Pinda) for a reduced BAV array.
 */
export function calculateShodhyaPinda(
  shodhitaBindus: number[],
  planetPlacements: Record<AshtakavargaGraha, number>
): { rashiPinda: number; grahaPinda: number; shodhyaPinda: number } {
  // 1. Rashi Pinda: Sum of (Shodhita Bindu * Rashi Multiplier) across 12 signs
  let rashiPinda = 0;
  for (let s = 0; s < 12; s++) {
    rashiPinda += shodhitaBindus[s] * RASHI_PINDA_MULTIPLIERS[s];
  }

  // 2. Graha Pinda: For each of the 7 Grahas, multiply shodhita bindu of its sign by its multiplier
  let grahaPinda = 0;
  for (const g of ASHTAKAVARGA_GRAHAS) {
    const sign = planetPlacements[g];
    const binduInSign = shodhitaBindus[sign];
    grahaPinda += binduInSign * GRAHA_PINDA_MULTIPLIERS[g];
  }

  return {
    rashiPinda,
    grahaPinda,
    shodhyaPinda: rashiPinda + grahaPinda
  };
}

/**
 * Evaluates transit of a planet through a Kakshya of a sign.
 */
export function evaluateKakshyaTransit(
  graha: AshtakavargaGraha,
  transitLongitude: number,
  natalBAV: BAVMatrix
): KakshyaTransitEvaluation {
  const normLon = ((transitLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLon / 30);
  const degreeInSign = normLon % 30;

  // Each kakshya is 3.75 degrees (3°45')
  const kakshyaIndex = Math.min(7, Math.floor(degreeInSign / 3.75));
  const kakshyaLord = KAKSHYA_LORDS[kakshyaIndex];

  // Check if natal BAV has a benefic point in this sign from this kakshya lord
  const signDetail = natalBAV.signs[signIndex];
  const hasBeneficPoint = (signDetail.pointsFrom[kakshyaLord] || 0) === 1;

  return {
    graha,
    transitLongitude: normLon,
    signIndex,
    kakshyaIndex,
    kakshyaLord,
    degreeInSign,
    hasBeneficPoint,
    isFavorableTransit: hasBeneficPoint
  };
}

/**
 * Main Orchestrator: Computes complete Ashtakavarga system for a Natal Chart.
 */
export function calculateAshtakavarga(natalChart: NatalChartData): FullAshtakavargaReport {
  // Extract sign placements for 7 planets and Lagna
  const natalSignPlacements: Record<ContributorName, number> = {} as any;
  const planetPlacements: Record<AshtakavargaGraha, number> = {} as any;
  const planetOccupations: number[] = new Array(12).fill(0);

  const lagnaSignIndex = natalChart.ascendant.signIndex;
  natalSignPlacements['Ascendant'] = lagnaSignIndex;

  for (const p of natalChart.planets) {
    if (ASHTAKAVARGA_GRAHAS.includes(p.name as AshtakavargaGraha)) {
      const gName = p.name as AshtakavargaGraha;
      natalSignPlacements[gName] = p.signIndex;
      planetPlacements[gName] = p.signIndex;
      planetOccupations[p.signIndex]++;
    }
  }

  // 1. Calculate BAV for each of the 7 Grahas
  const bav: Record<AshtakavargaGraha, BAVMatrix> = {} as any;
  for (const g of ASHTAKAVARGA_GRAHAS) {
    bav[g] = calculateSingleBAV(g, natalSignPlacements, lagnaSignIndex);
  }

  // 2. Calculate SAV Matrix
  const sav = calculateSAV(bav, lagnaSignIndex);

  // 3. Shodhana & Shodhya Pinda for all 7 Grahas
  const shodhana: Record<AshtakavargaGraha, ShodhanaResult> = {} as any;
  for (const g of ASHTAKAVARGA_GRAHAS) {
    const original = bav[g].bindusBySign;
    const trikona = applyTrikonaShodhana(original);
    const ekadhipatya = applyEkadhipatyaShodhana(trikona, planetOccupations);
    const pinda = calculateShodhyaPinda(ekadhipatya, planetPlacements);

    shodhana[g] = {
      graha: g,
      originalBindus: original,
      trikonaShodhita: trikona,
      ekadhipatyaShodhita: ekadhipatya,
      rashiPinda: pinda.rashiPinda,
      grahaPinda: pinda.grahaPinda,
      shodhyaPinda: pinda.shodhyaPinda
    };
  }

  return {
    bav,
    sav,
    shodhana,
    totalSAVPoints: sav.totalPoints,
    isSAV337InvariantMet: sav.isInvariantValid
  };
}
