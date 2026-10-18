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
import { NatalChartData } from '../kundli/houseCusps';
export declare const ASHTAKAVARGA_CONTRIBUTORS: readonly ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Ascendant"];
export type ContributorName = (typeof ASHTAKAVARGA_CONTRIBUTORS)[number];
export declare const ASHTAKAVARGA_GRAHAS: readonly ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
export type AshtakavargaGraha = (typeof ASHTAKAVARGA_GRAHAS)[number];
/**
 * Classical Parashari Benefic House Positions (1-indexed house distance)
 * for each Graha BAV from the 8 contributors.
 */
export declare const PARASHARA_BAV_RULES: Record<AshtakavargaGraha, Record<ContributorName, number[]>>;
/**
 * Expected Classical Total Dots per Planet BAV
 */
export declare const EXPECTED_BAV_TOTALS: Record<AshtakavargaGraha, number>;
/**
 * Classical Multipliers for Shodhya Pinda (Pinda Sadhana)
 */
export declare const RASHI_PINDA_MULTIPLIERS: number[];
export declare const GRAHA_PINDA_MULTIPLIERS: Record<AshtakavargaGraha, number>;
/**
 * Kakshya Lords in ascending order of orbital speed within each sign (3°45' each)
 */
export declare const KAKSHYA_LORDS: ContributorName[];
export interface BAVSignDetail {
    signIndex: number;
    signName: string;
    signHindi: string;
    houseFromLagna: number;
    pointsFrom: Record<ContributorName, number>;
    totalBindus: number;
}
export interface BAVMatrix {
    graha: AshtakavargaGraha;
    totalPoints: number;
    signs: BAVSignDetail[];
    bindusBySign: number[];
    bindusByHouse: number[];
}
export interface SAVSignDetail {
    signIndex: number;
    signName: string;
    signHindi: string;
    houseFromLagna: number;
    grahaPoints: Record<AshtakavargaGraha, number>;
    totalBindus: number;
    evaluation: 'Very Auspicious' | 'Auspicious' | 'Average' | 'Challenging';
}
export interface SAVMatrix {
    totalPoints: number;
    signs: SAVSignDetail[];
    bindusBySign: number[];
    bindusByHouse: number[];
    isInvariantValid: boolean;
}
export interface ShodhanaResult {
    graha: AshtakavargaGraha;
    originalBindus: number[];
    trikonaShodhita: number[];
    ekadhipatyaShodhita: number[];
    rashiPinda: number;
    grahaPinda: number;
    shodhyaPinda: number;
}
export interface KakshyaTransitEvaluation {
    graha: AshtakavargaGraha;
    transitLongitude: number;
    signIndex: number;
    kakshyaIndex: number;
    kakshyaLord: ContributorName;
    degreeInSign: number;
    hasBeneficPoint: boolean;
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
export declare function calculateSingleBAV(targetGraha: AshtakavargaGraha, natalSignPlacements: Record<ContributorName, number>, lagnaSignIndex: number): BAVMatrix;
/**
 * Calculates Sarvashtakavarga (SAV) from 7 BAV matrices.
 */
export declare function calculateSAV(bavRecords: Record<AshtakavargaGraha, BAVMatrix>, lagnaSignIndex: number): SAVMatrix;
/**
 * Classical Trikona Shodhana (1st Ashtakavarga Reduction)
 * Trines: 0-4-8 (Aries, Leo, Sag), 1-5-9 (Taurus, Virgo, Cap),
 * 2-6-10 (Gemini, Libra, Aqua), 3-7-11 (Cancer, Scorpio, Pisces).
 */
export declare function applyTrikonaShodhana(inputBindus: number[]): number[];
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
export declare function applyEkadhipatyaShodhana(trikonaBindus: number[], planetOccupations: number[]): number[];
/**
 * Calculates Shodhya Pinda (Rashi Pinda + Graha Pinda) for a reduced BAV array.
 */
export declare function calculateShodhyaPinda(shodhitaBindus: number[], planetPlacements: Record<AshtakavargaGraha, number>): {
    rashiPinda: number;
    grahaPinda: number;
    shodhyaPinda: number;
};
/**
 * Evaluates transit of a planet through a Kakshya of a sign.
 */
export declare function evaluateKakshyaTransit(graha: AshtakavargaGraha, transitLongitude: number, natalBAV: BAVMatrix): KakshyaTransitEvaluation;
/**
 * Main Orchestrator: Computes complete Ashtakavarga system for a Natal Chart.
 */
export declare function calculateAshtakavarga(natalChart: NatalChartData): FullAshtakavargaReport;
//# sourceMappingURL=ashtakavargaEngine.d.ts.map