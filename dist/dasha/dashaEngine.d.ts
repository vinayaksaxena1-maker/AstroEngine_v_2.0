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
import { NatalChartData } from '../kundli/houseCusps';
export declare const VIMSHOTTARI_LORDS: readonly ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export type VimshottariLord = (typeof VIMSHOTTARI_LORDS)[number];
export declare const VIMSHOTTARI_YEARS: Record<VimshottariLord, number>;
export declare const TOTAL_VIMSHOTTARI_YEARS = 120;
export declare const MS_PER_YEAR: number;
export declare const NAKSHATRA_TO_VIMSHOTTARI_LORD: VimshottariLord[];
export declare const YOGINI_NAMES: readonly ["Mangla", "Pingla", "Dhanya", "Bhramari", "Bhadrika", "Ulka", "Siddha", "Sankata"];
export type YoginiName = (typeof YOGINI_NAMES)[number];
export declare const YOGINI_DETAILS: Record<YoginiName, {
    lord: string;
    years: number;
}>;
export declare const TOTAL_YOGINI_YEARS = 36;
export declare const ASHTOTTARI_LORDS: readonly ["Sun", "Moon", "Mars", "Mercury", "Saturn", "Jupiter", "Rahu", "Venus"];
export type AshtottariLord = (typeof ASHTOTTARI_LORDS)[number];
export declare const ASHTOTTARI_YEARS: Record<AshtottariLord, number>;
export declare const TOTAL_ASHTOTTARI_YEARS = 108;
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
    signIndex: number;
    signName: string;
    signHindi: string;
    signLord: string;
    durationYears: number;
}
export interface CharaDashaReport {
    lagnaSignIndex: number;
    isDirectProgression: boolean;
    orderOfSigns: number[];
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
/**
 * Calculates birth Vimshottari balance from Moon's sidereal longitude.
 */
export declare function calculateVimshottariBalance(moonLongitude: number): VimshottariBalance;
/**
 * Generates the complete 120-year Vimshottari timeline down to 4 levels.
 * Guarantees 0ms gap and 0ms overlap continuity across all segments.
 */
export declare function generateVimshottariTimeline(birthDate: Date, moonLongitude: number, generateSookshma?: boolean): {
    balance: VimshottariBalance;
    timeline: MahadashaEntry[];
};
/**
 * Finds the currently active Vimshottari Dasha at any specified query date.
 */
export declare function findCurrentVimshottari(timeline: MahadashaEntry[], targetDate: Date): CurrentVimshottariPosition | null;
/**
 * Calculates Yogini Dasha:
 * Formula: Starting Yogini = (NakshatraNumber [1..27] + 3) % 8.
 * (Remainder 1: Mangla, 2: Pingla, ... 7: Siddha, 0/8: Sankata).
 */
export declare function calculateYoginiDasha(birthDate: Date, moonLongitude: number): YoginiDashaReport;
/**
 * Evaluates Ashtottari Dasha applicability and calculates 108-year timeline.
 * Classical rule: Recommended when Rahu is in Kendra (1, 4, 7, 10) or Trikona (5, 9)
 * from the Lagna Lord.
 */
export declare function calculateAshtottariDasha(natalChart: NatalChartData): AshtottariDashaReport;
/**
 * Calculates Jaimini Chara Dasha:
 * - Direct progression for Meshadi signs (Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius).
 * - Indirect progression for other signs.
 * - Duration of each sign = count from sign to its lord minus 1 (or 12 if lord is in own sign).
 * - Exaltation (+1) / Debilitation (-1) adjustments.
 */
export declare function calculateCharaDasha(natalChart: NatalChartData): CharaDashaReport;
export declare function calculateAllDashas(natalChart: NatalChartData, queryDate?: Date): FullDashaReport;
//# sourceMappingURL=dashaEngine.d.ts.map