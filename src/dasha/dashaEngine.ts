/**
 * Sanatan Vedic Astrology Engine: Dasha Systems Engine (Timing of Events)
 *
 * Implements:
 * 1. Vimshottari Dasha: Exact Moon nakshatra elapsed percentage, birth balance,
 *    4-level hierarchical timeline (Mahadasha, Antardasha, Pratyantardasha, Sookshma Dasha)
 *    spanning 120 years with zero millisecond gap or overlap continuity.
 * 2. Yogini Dasha: 36-year cycle (Mangla to Sankata), birth balance, 2 levels (MD + AD).
 * 3. Ashtottari Dasha: 108-year cycle, Kendra/Trikona Rahu applicability evaluation,
 *    28-nakshatra alternating mapping, birth balance & timeline.
 * 4. Jaimini Chara Dasha: Sign-based dasha, direct/indirect progression,
 *    sign-to-lord directional counting, exaltation/debilitation modifications.
 */

import { NatalChartData, NatalPlanetDetail } from '../kundli/houseCusps';
import { zodiacSigns } from '../core/sanatan_jpl_bridge';

// --- VIMSHOTTARI DASHA CONSTANTS ---
export const VIMSHOTTARI_LORDS = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury'
] as const;

export type VimshottariLord = (typeof VIMSHOTTARI_LORDS)[number];

export const VIMSHOTTARI_YEARS: Record<VimshottariLord, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export const TOTAL_VIMSHOTTARI_YEARS = 120;
export const MS_PER_YEAR = 365.2425 * 86400 * 1000; // Exact solar Gregorian year in milliseconds

// Map Nakshatra index (0 to 26) to Vimshottari Lord
export const NAKSHATRA_TO_VIMSHOTTARI_LORD: VimshottariLord[] = [
  'Ketu',    // 0: Ashwini
  'Venus',   // 1: Bharani
  'Sun',     // 2: Krittika
  'Moon',    // 3: Rohini
  'Mars',    // 4: Mrigashira
  'Rahu',    // 5: Ardra
  'Jupiter', // 6: Punarvasu
  'Saturn',  // 7: Pushya
  'Mercury', // 8: Ashlesha
  'Ketu',    // 9: Magha
  'Venus',   // 10: Purva Phalguni
  'Sun',     // 11: Uttara Phalguni
  'Moon',    // 12: Hasta
  'Mars',    // 13: Chitra
  'Rahu',    // 14: Swati
  'Jupiter', // 15: Vishakha
  'Saturn',  // 16: Anuradha
  'Mercury', // 17: Jyeshtha
  'Ketu',    // 18: Moola
  'Venus',   // 19: Purva Ashadha
  'Sun',     // 20: Uttara Ashadha
  'Moon',    // 21: Shravana
  'Mars',    // 22: Dhanishta
  'Rahu',    // 23: Shatabhisha
  'Jupiter', // 24: Purva Bhadrapada
  'Saturn',  // 25: Uttara Bhadrapada
  'Mercury'  // 26: Revati
];

// --- YOGINI DASHA CONSTANTS ---
export const YOGINI_NAMES = [
  'Mangla',
  'Pingla',
  'Dhanya',
  'Bhramari',
  'Bhadrika',
  'Ulka',
  'Siddha',
  'Sankata'
] as const;

export type YoginiName = (typeof YOGINI_NAMES)[number];

export const YOGINI_DETAILS: Record<
  YoginiName,
  { lord: string; years: number }
> = {
  Mangla: { lord: 'Moon', years: 1 },
  Pingla: { lord: 'Sun', years: 2 },
  Dhanya: { lord: 'Jupiter', years: 3 },
  Bhramari: { lord: 'Mars', years: 4 },
  Bhadrika: { lord: 'Mercury', years: 5 },
  Ulka: { lord: 'Saturn', years: 6 },
  Siddha: { lord: 'Venus', years: 7 },
  Sankata: { lord: 'Rahu', years: 8 }
};

export const TOTAL_YOGINI_YEARS = 36;

// --- ASHTOTTARI DASHA CONSTANTS ---
export const ASHTOTTARI_LORDS = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Saturn',
  'Jupiter',
  'Rahu',
  'Venus'
] as const;

export type AshtottariLord = (typeof ASHTOTTARI_LORDS)[number];

export const ASHTOTTARI_YEARS: Record<AshtottariLord, number> = {
  Sun: 6,
  Moon: 15,
  Mars: 8,
  Mercury: 17,
  Saturn: 10,
  Jupiter: 19,
  Rahu: 12,
  Venus: 21
};

export const TOTAL_ASHTOTTARI_YEARS = 108;

// --- INTERFACES ---

export interface DashaTimeSpan {
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

export interface SookshmaDashaEntry extends DashaTimeSpan {
  sookshmaLord: VimshottariLord;
  pratyantardashaLord: VimshottariLord;
  antardashaLord: VimshottariLord;
  mahadashaLord: VimshottariLord;
}

export interface PratyantardashaEntry extends DashaTimeSpan {
  pratyantardashaLord: VimshottariLord;
  antardashaLord: VimshottariLord;
  mahadashaLord: VimshottariLord;
  sookshmas?: SookshmaDashaEntry[];
}

export interface AntardashaEntry extends DashaTimeSpan {
  antardashaLord: VimshottariLord;
  mahadashaLord: VimshottariLord;
  pratyantardashas: PratyantardashaEntry[];
}

export interface MahadashaEntry extends DashaTimeSpan {
  mahadashaLord: VimshottariLord;
  antardashas: AntardashaEntry[];
}

export interface VimshottariBalance {
  birthLord: VimshottariLord;
  balanceYears: number;
  balanceMonths: number;
  balanceDays: number;
  fractionRemaining: number;
}

export interface CurrentVimshottariPosition {
  mahadasha: VimshottariLord;
  antardasha: VimshottariLord;
  pratyantardasha: VimshottariLord;
  sookshma: VimshottariLord;
  startDate: Date;
  endDate: Date;
}

export interface YoginiAntardashaEntry extends DashaTimeSpan {
  yoginiName: YoginiName;
  lord: string;
}

export interface YoginiMahadashaEntry extends DashaTimeSpan {
  yoginiName: YoginiName;
  lord: string;
  antardashas: YoginiAntardashaEntry[];
}

export interface YoginiDashaReport {
  birthYogini: YoginiName;
  birthBalanceYears: number;
  timeline: YoginiMahadashaEntry[];
}

export interface AshtottariDashaEntry extends DashaTimeSpan {
  lord: AshtottariLord;
  antardashas: {
    lord: AshtottariLord;
    startDate: Date;
    endDate: Date;
  }[];
}

export interface AshtottariDashaReport {
  isApplicable: boolean;
  applicabilityReason: string;
  birthLord: AshtottariLord;
  birthBalanceYears: number;
  timeline: AshtottariDashaEntry[];
}

export interface CharaDashaEntry extends DashaTimeSpan {
  signIndex: number; // 0 to 11
  signName: string;
  signHindi: string;
  signLord: string;
  durationYears: number;
}

export interface CharaDashaReport {
  lagnaSignIndex: number;
  isDirectProgression: boolean;
  orderOfSigns: number[]; // sign indices
  timeline: CharaDashaEntry[];
}

export interface FullDashaReport {
  vimshottari: {
    balance: VimshottariBalance;
    timeline: MahadashaEntry[];
    current: CurrentVimshottariPosition;
  };
  yogini: YoginiDashaReport;
  ashtottari: AshtottariDashaReport;
  chara: CharaDashaReport;
}

// --- HELPER FUNCTIONS ---

function addYearsToDate(baseDate: Date, fractionalYears: number): Date {
  const ms = Math.round(fractionalYears * MS_PER_YEAR);
  return new Date(baseDate.getTime() + ms);
}

// Exaltation and debilitation signs (0-indexed) for 7 grahas
const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0,     // Aries
  Moon: 1,    // Taurus
  Mars: 9,    // Capricorn
  Mercury: 5, // Virgo
  Jupiter: 3, // Cancer
  Venus: 11,  // Pisces
  Saturn: 6   // Libra
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6,     // Libra
  Moon: 7,    // Scorpio
  Mars: 3,    // Cancer
  Mercury: 11,// Pisces
  Jupiter: 9, // Capricorn
  Venus: 5,   // Virgo
  Saturn: 0   // Aries
};

// Sign Lord mapping (0 to 11)
const SIGN_LORDS = [
  'Mars',    // 0: Aries
  'Venus',   // 1: Taurus
  'Mercury', // 2: Gemini
  'Moon',    // 3: Cancer
  'Sun',     // 4: Leo
  'Mercury', // 5: Virgo
  'Venus',   // 6: Libra
  'Mars',    // 7: Scorpio
  'Jupiter', // 8: Sagittarius
  'Saturn',  // 9: Capricorn
  'Saturn',  // 10: Aquarius
  'Jupiter'  // 11: Pisces
];

// Direct signs in Jaimini (Meshadi): 0, 1, 2, 6, 7, 8
const JAIMINI_DIRECT_SIGNS = [0, 1, 2, 6, 7, 8];

// =========================================================================
// 1. VIMSHOTTARI DASHA IMPLEMENTATION
// =========================================================================

/**
 * Calculates birth Vimshottari balance from Moon's sidereal longitude.
 */
export function calculateVimshottariBalance(moonLongitude: number): VimshottariBalance {
  const nakshatraSpan = 360 / 27; // 13°20' = 13.333333333333334°
  const normLon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan);
  const degreeInNakshatra = normLon - nakshatraIndex * nakshatraSpan;

  const fractionElapsed = degreeInNakshatra / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;

  const birthLord = NAKSHATRA_TO_VIMSHOTTARI_LORD[nakshatraIndex];
  const totalYears = VIMSHOTTARI_YEARS[birthLord];
  const balanceDecimalYears = fractionRemaining * totalYears;

  const balanceYears = Math.floor(balanceDecimalYears);
  const balanceMonths = Math.floor((balanceDecimalYears - balanceYears) * 12);
  const balanceDays = Math.floor(
    ((balanceDecimalYears - balanceYears) * 12 - balanceMonths) * 30.4375
  );

  return {
    birthLord,
    balanceYears,
    balanceMonths,
    balanceDays,
    fractionRemaining
  };
}

/**
 * Generates the complete 120-year Vimshottari timeline down to 4 levels.
 * Guarantees 0ms gap and 0ms overlap continuity across all segments.
 */
export function generateVimshottariTimeline(
  birthDate: Date,
  moonLongitude: number,
  generateSookshma: boolean = false
): { balance: VimshottariBalance; timeline: MahadashaEntry[] } {
  const balance = calculateVimshottariBalance(moonLongitude);
  const birthLordIndex = VIMSHOTTARI_LORDS.indexOf(balance.birthLord);

  const timeline: MahadashaEntry[] = [];
  let currentMDStartDate = new Date(birthDate.getTime());

  // Loop through 9 Mahadashas (first one has balance applied, followed by subsequent 8)
  for (let m = 0; m < 9; m++) {
    const lordIndex = (birthLordIndex + m) % 9;
    const mdLord = VIMSHOTTARI_LORDS[lordIndex];
    const fullMDYears = VIMSHOTTARI_YEARS[mdLord];
    
    // For 1st Mahadasha at birth, only the remaining fraction is experienced
    const mdDurationYears = (m === 0) ? fullMDYears * balance.fractionRemaining : fullMDYears;
    const currentMDEndDate = addYearsToDate(currentMDStartDate, mdDurationYears);

    // Generate Antardashas within this Mahadasha
    const antardashas: AntardashaEntry[] = [];
    let currentADStartDate = new Date(currentMDStartDate.getTime());

    // In Vimshottari, Antardashas always start from the Mahadasha lord itself
    const mdBaseLordIndex = lordIndex;
    
    // For the birth Mahadasha, calculate which AD is running at birth
    let adStartIndex = 0;
    let elapsedInFirstMDYears = (m === 0) ? fullMDYears * (1 - balance.fractionRemaining) : 0;
    let accumulatedADYears = 0;

    for (let a = 0; a < 9; a++) {
      const adLordIndex = (mdBaseLordIndex + a) % 9;
      const adLord = VIMSHOTTARI_LORDS[adLordIndex];
      const adFullYears = (fullMDYears * VIMSHOTTARI_YEARS[adLord]) / TOTAL_VIMSHOTTARI_YEARS;

      if (m === 0) {
        if (accumulatedADYears + adFullYears <= elapsedInFirstMDYears) {
          accumulatedADYears += adFullYears;
          continue; // Already elapsed prior to birth
        }
      }

      let adDurationYears = adFullYears;
      if (m === 0 && antardashas.length === 0 && accumulatedADYears < elapsedInFirstMDYears) {
        // First active AD at birth
        const alreadyElapsedInAD = elapsedInFirstMDYears - accumulatedADYears;
        adDurationYears = adFullYears - alreadyElapsedInAD;
      }

      let currentADEndDate = addYearsToDate(currentADStartDate, adDurationYears);
      // Ensure the last AD ends exactly at currentMDEndDate to prevent drift
      if (a === 8 || (m === 0 && currentADEndDate.getTime() > currentMDEndDate.getTime())) {
        currentADEndDate = new Date(currentMDEndDate.getTime());
      }

      // Generate Pratyantardashas (PD)
      const pratyantardashas: PratyantardashaEntry[] = [];
      let currentPDStartDate = new Date(currentADStartDate.getTime());

      for (let p = 0; p < 9; p++) {
        const pdLordIndex = (adLordIndex + p) % 9;
        const pdLord = VIMSHOTTARI_LORDS[pdLordIndex];
        const pdDurationYears = (adDurationYears * VIMSHOTTARI_YEARS[pdLord]) / TOTAL_VIMSHOTTARI_YEARS;
        let currentPDEndDate = addYearsToDate(currentPDStartDate, pdDurationYears);
        if (p === 8) {
          currentPDEndDate = new Date(currentADEndDate.getTime());
        }

        const pdEntry: PratyantardashaEntry = {
          pratyantardashaLord: pdLord,
          antardashaLord: adLord,
          mahadashaLord: mdLord,
          startDate: new Date(currentPDStartDate.getTime()),
          endDate: new Date(currentPDEndDate.getTime()),
          durationDays: (currentPDEndDate.getTime() - currentPDStartDate.getTime()) / (86400 * 1000)
        };

        // Optionally generate Sookshma Dashas (SD)
        if (generateSookshma) {
          const sookshmas: SookshmaDashaEntry[] = [];
          let currentSDStartDate = new Date(currentPDStartDate.getTime());

          for (let s = 0; s < 9; s++) {
            const sdLordIndex = (pdLordIndex + s) % 9;
            const sdLord = VIMSHOTTARI_LORDS[sdLordIndex];
            const sdDurationYears = (pdDurationYears * VIMSHOTTARI_YEARS[sdLord]) / TOTAL_VIMSHOTTARI_YEARS;
            let currentSDEndDate = addYearsToDate(currentSDStartDate, sdDurationYears);
            if (s === 8) {
              currentSDEndDate = new Date(currentPDEndDate.getTime());
            }

            sookshmas.push({
              sookshmaLord: sdLord,
              pratyantardashaLord: pdLord,
              antardashaLord: adLord,
              mahadashaLord: mdLord,
              startDate: new Date(currentSDStartDate.getTime()),
              endDate: new Date(currentSDEndDate.getTime()),
              durationDays: (currentSDEndDate.getTime() - currentSDStartDate.getTime()) / (86400 * 1000)
            });

            currentSDStartDate = new Date(currentSDEndDate.getTime());
          }
          pdEntry.sookshmas = sookshmas;
        }

        pratyantardashas.push(pdEntry);
        currentPDStartDate = new Date(currentPDEndDate.getTime());
      }

      antardashas.push({
        antardashaLord: adLord,
        mahadashaLord: mdLord,
        startDate: new Date(currentADStartDate.getTime()),
        endDate: new Date(currentADEndDate.getTime()),
        durationDays: (currentADEndDate.getTime() - currentADStartDate.getTime()) / (86400 * 1000),
        pratyantardashas
      });

      currentADStartDate = new Date(currentADEndDate.getTime());
      if (currentADStartDate.getTime() >= currentMDEndDate.getTime()) {
        break;
      }
    }

    timeline.push({
      mahadashaLord: mdLord,
      startDate: new Date(currentMDStartDate.getTime()),
      endDate: new Date(currentMDEndDate.getTime()),
      durationDays: (currentMDEndDate.getTime() - currentMDStartDate.getTime()) / (86400 * 1000),
      antardashas
    });

    currentMDStartDate = new Date(currentMDEndDate.getTime());
  }

  return { balance, timeline };
}

/**
 * Finds the currently active Vimshottari Dasha at any specified query date.
 */
export function findCurrentVimshottari(
  timeline: MahadashaEntry[],
  targetDate: Date
): CurrentVimshottariPosition | null {
  const t = targetDate.getTime();
  for (const md of timeline) {
    if (t >= md.startDate.getTime() && t < md.endDate.getTime()) {
      for (const ad of md.antardashas) {
        if (t >= ad.startDate.getTime() && t < ad.endDate.getTime()) {
          for (const pd of ad.pratyantardashas) {
            if (t >= pd.startDate.getTime() && t < pd.endDate.getTime()) {
              let sookshmaLord = pd.pratyantardashaLord;
              if (pd.sookshmas && pd.sookshmas.length > 0) {
                for (const sd of pd.sookshmas) {
                  if (t >= sd.startDate.getTime() && t < sd.endDate.getTime()) {
                    sookshmaLord = sd.sookshmaLord;
                    break;
                  }
                }
              }
              return {
                mahadasha: md.mahadashaLord,
                antardasha: ad.antardashaLord,
                pratyantardasha: pd.pratyantardashaLord,
                sookshma: sookshmaLord,
                startDate: pd.startDate,
                endDate: pd.endDate
              };
            }
          }
        }
      }
    }
  }
  return null;
}

// =========================================================================
// 2. YOGINI DASHA IMPLEMENTATION (36-Year Cycle)
// =========================================================================

/**
 * Calculates Yogini Dasha:
 * Formula: Starting Yogini = (NakshatraNumber [1..27] + 3) % 8.
 * (Remainder 1: Mangla, 2: Pingla, ... 7: Siddha, 0/8: Sankata).
 */
export function calculateYoginiDasha(
  birthDate: Date,
  moonLongitude: number
): YoginiDashaReport {
  const nakshatraSpan = 360 / 27;
  const normLon = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan); // 0 to 26
  const nakshatraNum = nakshatraIndex + 1; // 1 to 27

  const degreeInNakshatra = normLon - nakshatraIndex * nakshatraSpan;
  const fractionRemaining = 1 - degreeInNakshatra / nakshatraSpan;

  // Remainder: (NakshatraNum + 3) % 8. If 0 -> 8 (Sankata)
  let remainder = (nakshatraNum + 3) % 8;
  if (remainder === 0) remainder = 8;
  const startingYoginiIndex = remainder - 1; // 0 to 7
  const startingYoginiName = YOGINI_NAMES[startingYoginiIndex];

  const fullFirstYoginiYears = YOGINI_DETAILS[startingYoginiName].years;
  const birthBalanceYears = fractionRemaining * fullFirstYoginiYears;

  const timeline: YoginiMahadashaEntry[] = [];
  let currentStartDate = new Date(birthDate.getTime());

  // Generate 8 Yogini cycles covering 36 years
  for (let i = 0; i < 8; i++) {
    const yIdx = (startingYoginiIndex + i) % 8;
    const yName = YOGINI_NAMES[yIdx];
    const fullYears = YOGINI_DETAILS[yName].years;
    const actualYears = i === 0 ? birthBalanceYears : fullYears;
    const currentEndDate = addYearsToDate(currentStartDate, actualYears);

    // Generate Antardashas within this Yogini Mahadasha
    const antardashas: YoginiAntardashaEntry[] = [];
    let adStart = new Date(currentStartDate.getTime());

    for (let a = 0; a < 8; a++) {
      const adYIdx = (yIdx + a) % 8;
      const adName = YOGINI_NAMES[adYIdx];
      const adLord = YOGINI_DETAILS[adName].lord;
      const adYears = (actualYears * YOGINI_DETAILS[adName].years) / TOTAL_YOGINI_YEARS;
      let adEnd = addYearsToDate(adStart, adYears);
      if (a === 7) adEnd = new Date(currentEndDate.getTime());

      antardashas.push({
        yoginiName: adName,
        lord: adLord,
        startDate: new Date(adStart.getTime()),
        endDate: new Date(adEnd.getTime()),
        durationDays: (adEnd.getTime() - adStart.getTime()) / (86400 * 1000)
      });
      adStart = new Date(adEnd.getTime());
    }

    timeline.push({
      yoginiName: yName,
      lord: YOGINI_DETAILS[yName].lord,
      startDate: new Date(currentStartDate.getTime()),
      endDate: new Date(currentEndDate.getTime()),
      durationDays: (currentEndDate.getTime() - currentStartDate.getTime()) / (86400 * 1000),
      antardashas
    });

    currentStartDate = new Date(currentEndDate.getTime());
  }

  return {
    birthYogini: startingYoginiName,
    birthBalanceYears,
    timeline
  };
}

// =========================================================================
// 3. ASHTOTTARI DASHA IMPLEMENTATION (108-Year Cycle)
// =========================================================================

/**
 * Evaluates Ashtottari Dasha applicability and calculates 108-year timeline.
 * Classical rule: Recommended when Rahu is in Kendra (1, 4, 7, 10) or Trikona (5, 9)
 * from the Lagna Lord.
 */
export function calculateAshtottariDasha(natalChart: NatalChartData): AshtottariDashaReport {
  const lagnaLordName = natalChart.ascendant.signLord;
  const lagnaLord = natalChart.planets.find(p => p.name === lagnaLordName);
  const rahu = natalChart.planets.find(p => p.name === 'Rahu');

  let isApplicable = false;
  let applicabilityReason = 'Rahu is not in Kendra or Trikona from Lagna Lord.';

  if (lagnaLord && rahu) {
    const houseFromLord = ((rahu.houseOccupied - lagnaLord.houseOccupied + 12) % 12) + 1;
    if ([1, 4, 7, 10, 5, 9].includes(houseFromLord)) {
      isApplicable = true;
      applicabilityReason = `Rahu is in house ${houseFromLord} (Kendra/Trikona) from Lagna Lord (${lagnaLordName}).`;
    }
  }

  // Determine starting lord: Alternating 3-4 nakshatra grouping starting from Ardra (index 5)
  // Standard Ardra-adi Ashtottari:
  // Ardra(5), Punarvasu(6), Pushya(7), Ashlesha(8) -> Sun (4)
  // Magha(9), P.Phalguni(10), U.Phalguni(11) -> Moon (3)
  // Hasta(12), Chitra(13), Swati(14), Vishakha(15) -> Mars (4)
  // Anuradha(16), Jyeshtha(17), Moola(18) -> Mercury (3)
  // P.Ashadha(19), U.Ashadha(20), Shravana(21), Dhanishta(22) -> Saturn (4)
  // Shatabhisha(23), P.Bhadrapada(24), U.Bhadrapada(25) -> Jupiter (3)
  // Revati(26), Ashwini(0), Bharani(1), Krittika(2) -> Rahu (4)
  // Rohini(3), Mrigashira(4) -> Venus (2, total 27 nakshatras)

  const moon = natalChart.planets.find(p => p.name === 'Moon')!;
  const nakshatraSpan = 360 / 27;
  const normLon = ((moon.longitude % 360) + 360) % 360;
  const nakIndex = Math.floor(normLon / nakshatraSpan);
  const fracRemaining = 1 - (normLon - nakIndex * nakshatraSpan) / nakshatraSpan;

  // Map 27 nakshatras to Ashtottari Lords
  const nakToAshtottariLord: AshtottariLord[] = [
    'Rahu',    // 0: Ashwini
    'Rahu',    // 1: Bharani
    'Rahu',    // 2: Krittika
    'Venus',   // 3: Rohini
    'Venus',   // 4: Mrigashira
    'Sun',     // 5: Ardra
    'Sun',     // 6: Punarvasu
    'Sun',     // 7: Pushya
    'Sun',     // 8: Ashlesha
    'Moon',    // 9: Magha
    'Moon',    // 10: Purva Phalguni
    'Moon',    // 11: Uttara Phalguni
    'Mars',    // 12: Hasta
    'Mars',    // 13: Chitra
    'Mars',    // 14: Swati
    'Mars',    // 15: Vishakha
    'Mercury', // 16: Anuradha
    'Mercury', // 17: Jyeshtha
    'Mercury', // 18: Moola
    'Saturn',  // 19: Purva Ashadha
    'Saturn',  // 20: Uttara Ashadha
    'Saturn',  // 21: Shravana
    'Saturn',  // 22: Dhanishta
    'Jupiter', // 23: Shatabhisha
    'Jupiter', // 24: Purva Bhadrapada
    'Jupiter', // 25: Uttara Bhadrapada
    'Rahu'     // 26: Revati
  ];

  const birthLord = nakToAshtottariLord[nakIndex];
  const birthLordIndex = ASHTOTTARI_LORDS.indexOf(birthLord);
  const birthBalanceYears = fracRemaining * ASHTOTTARI_YEARS[birthLord];

  const timeline: AshtottariDashaEntry[] = [];
  let currentStart = new Date(natalChart.birthDate.getTime());

  for (let i = 0; i < 8; i++) {
    const lIdx = (birthLordIndex + i) % 8;
    const lord = ASHTOTTARI_LORDS[lIdx];
    const fullYears = ASHTOTTARI_YEARS[lord];
    const actualYears = i === 0 ? birthBalanceYears : fullYears;
    const currentEnd = addYearsToDate(currentStart, actualYears);

    // Antardashas
    const antardashas: { lord: AshtottariLord; startDate: Date; endDate: Date }[] = [];
    let adStart = new Date(currentStart.getTime());

    for (let a = 0; a < 8; a++) {
      const adLord = ASHTOTTARI_LORDS[(lIdx + a) % 8];
      const adYears = (actualYears * ASHTOTTARI_YEARS[adLord]) / TOTAL_ASHTOTTARI_YEARS;
      let adEnd = addYearsToDate(adStart, adYears);
      if (a === 7) adEnd = new Date(currentEnd.getTime());

      antardashas.push({
        lord: adLord,
        startDate: new Date(adStart.getTime()),
        endDate: new Date(adEnd.getTime())
      });
      adStart = new Date(adEnd.getTime());
    }

    timeline.push({
      lord,
      startDate: new Date(currentStart.getTime()),
      endDate: new Date(currentEnd.getTime()),
      durationDays: (currentEnd.getTime() - currentStart.getTime()) / (86400 * 1000),
      antardashas
    });

    currentStart = new Date(currentEnd.getTime());
  }

  return {
    isApplicable,
    applicabilityReason,
    birthLord,
    birthBalanceYears,
    timeline
  };
}

// =========================================================================
// 4. JAIMINI CHARA DASHA IMPLEMENTATION (Sign-Based)
// =========================================================================

/**
 * Calculates Jaimini Chara Dasha:
 * - Direct progression for Meshadi signs (Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius).
 * - Indirect progression for other signs.
 * - Duration of each sign = count from sign to its lord minus 1 (or 12 if lord is in own sign).
 * - Exaltation (+1) / Debilitation (-1) adjustments.
 */
export function calculateCharaDasha(natalChart: NatalChartData): CharaDashaReport {
  const lagnaSign = natalChart.ascendant.signIndex;
  const isDirectProgression = JAIMINI_DIRECT_SIGNS.includes(lagnaSign);

  const orderOfSigns: number[] = [];
  for (let i = 0; i < 12; i++) {
    const s = isDirectProgression
      ? (lagnaSign + i) % 12
      : ((lagnaSign - i) % 12 + 12) % 12;
    orderOfSigns.push(s);
  }

  const timeline: CharaDashaEntry[] = [];
  let currentStart = new Date(natalChart.birthDate.getTime());

  for (const s of orderOfSigns) {
    const signLord = SIGN_LORDS[s];
    const lordPlanet = natalChart.planets.find(p => p.name === signLord);
    const lordSign = lordPlanet ? lordPlanet.signIndex : s;

    let duration: number;
    if (lordSign === s) {
      duration = 12;
    } else {
      const isSignDirect = JAIMINI_DIRECT_SIGNS.includes(s);
      const dist = isSignDirect
        ? ((lordSign - s + 12) % 12) + 1
        : ((s - lordSign + 12) % 12) + 1;
      duration = dist - 1;
      if (duration === 0) duration = 12;
    }

    // Exaltation / Debilitation modifications
    if (lordPlanet) {
      if (lordSign === EXALTATION_SIGNS[signLord]) {
        duration = Math.min(12, duration + 1);
      } else if (lordSign === DEBILITATION_SIGNS[signLord]) {
        duration = Math.max(1, duration - 1);
      }
    }

    const currentEnd = addYearsToDate(currentStart, duration);

    timeline.push({
      signIndex: s,
      signName: zodiacSigns[s].eng,
      signHindi: zodiacSigns[s].hin,
      signLord,
      durationYears: duration,
      startDate: new Date(currentStart.getTime()),
      endDate: new Date(currentEnd.getTime()),
      durationDays: (currentEnd.getTime() - currentStart.getTime()) / (86400 * 1000)
    });

    currentStart = new Date(currentEnd.getTime());
  }

  return {
    lagnaSignIndex: lagnaSign,
    isDirectProgression,
    orderOfSigns,
    timeline
  };
}

// =========================================================================
// 5. MASTER ORCHESTRATOR
// =========================================================================

export function calculateAllDashas(
  natalChart: NatalChartData,
  queryDate: Date = new Date()
): FullDashaReport {
  const moon = natalChart.planets.find(p => p.name === 'Moon')!;
  const vimshottariData = generateVimshottariTimeline(
    natalChart.birthDate,
    moon.longitude,
    true
  );
  const currentVim = findCurrentVimshottari(vimshottariData.timeline, queryDate) || {
    mahadasha: vimshottariData.timeline[0].mahadashaLord,
    antardasha: vimshottariData.timeline[0].antardashas[0].antardashaLord,
    pratyantardasha: vimshottariData.timeline[0].antardashas[0].pratyantardashas[0].pratyantardashaLord,
    sookshma: vimshottariData.timeline[0].antardashas[0].pratyantardashas[0].pratyantardashaLord,
    startDate: vimshottariData.timeline[0].startDate,
    endDate: vimshottariData.timeline[0].endDate
  };

  const yogini = calculateYoginiDasha(natalChart.birthDate, moon.longitude);
  const ashtottari = calculateAshtottariDasha(natalChart);
  const chara = calculateCharaDasha(natalChart);

  return {
    vimshottari: {
      balance: vimshottariData.balance,
      timeline: vimshottariData.timeline,
      current: currentVim
    },
    yogini,
    ashtottari,
    chara
  };
}
