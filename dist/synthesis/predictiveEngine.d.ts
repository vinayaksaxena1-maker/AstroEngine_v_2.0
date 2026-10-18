/**
 * Sanatan Vedic Astrology Engine: Predictive Synthesis & Specialized Systems Engine
 *
 * Implements:
 * 1. Classical Parashari Yogas (300+ Yogas: Pancha Mahapurusha, Raja, Dhana, Chandra, Surya,
 *    Viparita, Neechbhanga Raja Yogas with classical cancellation logic).
 * 2. Malefic Doshas & Cancellations (Manglik with 14 cancellation rules, Kaal Sarp 12 types,
 *    Pitra Dosha, Guru Chandal, Grahan, Gandmoola).
 * 3. Shani Sade Sati & Dhaiya Engine (3 Phases, Kantaka, Ashtama Shani).
 * 4. Kundli Milan Engine (Ashtakoota 36 Gunas matching with Bhakoot and Nadi cancellations).
 * 5. Krishnamurti Paddhati (KP Jyotish: 249 Sub-Lord table, Star/Sub/Sub-Sub lords, Significators).
 * 6. Jaimini Jyotish (7 Chara Karakas AK to DK, Arudha Lagna AL, 12 Bhava Padas with exceptions, UL).
 * 7. Tajik Varshphal (Varshpravesh solar return root-finder, Muntha, Tajik Yogas, Sahams).
 * 8. Lal Kitab (Kalpurush 1-12 mapping, blind planets, sleeping houses, artificial Masnooi grahas).
 * 9. Nadi Jyotish & Panch Pakshi (Directional groupings & 5 Birds 5-activity diurnal cycles).
 */
import { NatalChartData } from '../kundli/houseCusps';
export interface YogaEvaluation {
    name: string;
    category: 'Mahapurusha' | 'Raja' | 'Dhana' | 'Chandra' | 'Surya' | 'Viparita' | 'Neechbhanga' | 'Special';
    isFormed: boolean;
    beneficence: 'High' | 'Moderate' | 'Mild' | 'Adverse';
    planetsInvolved: string[];
    description: string;
}
export declare const SIGN_NAMES: string[];
export declare const isKendra: (house: number) => boolean;
export declare const isTrikona: (house: number) => boolean;
export declare const isDusthana: (house: number) => boolean;
export declare function evaluateParashariYogas(natalChart: NatalChartData): YogaEvaluation[];
export interface DoshaEvaluation {
    name: string;
    hasDosha: boolean;
    severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
    isCancelled: boolean;
    cancellationReasons: string[];
    details: string;
}
export declare function evaluateMaleficDoshas(natalChart: NatalChartData): DoshaEvaluation[];
export interface SadeSatiEvaluation {
    isSadeSatiActive: boolean;
    phase: '1st Phase (Rising)' | '2nd Phase (Peak)' | '3rd Phase (Setting)' | 'Inactive';
    isDhaiyaActive: boolean;
    dhaiyaType: 'Kantaka Shani (4th House)' | 'Ashtama Shani (8th House)' | 'None';
    saturnSignIndex: number;
    moonSignIndex: number;
    description: string;
}
export declare function evaluateSadeSati(moonSignIndex: number, currentSaturnSignIndex: number): SadeSatiEvaluation;
export interface AshtakootaScore {
    koota: string;
    obtainedPoints: number;
    maxPoints: number;
    description: string;
}
export interface KundliMilanReport {
    totalScore: number;
    maxScore: 36;
    kootas: AshtakootaScore[];
    isCompatible: boolean;
    recommendation: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
    isBhakootDoshaCancelled: boolean;
    isNadiDoshaCancelled: boolean;
}
export declare function calculateKundliMilan(groomMoonLon: number, brideMoonLon: number): KundliMilanReport;
export interface KPSignificatorDetail {
    planet: string;
    signLord: string;
    starLord: string;
    subLord: string;
    subSubLord: string;
    longitude: number;
}
export declare const KP_VIMSHOTTARI_YEARS: Record<string, number>;
export declare const KP_LORDS_ORDER: string[];
/**
 * Calculates exact KP Sign Lord, Star Lord, Sub-Lord, and Sub-Sub Lord
 * for any given sidereal longitude.
 */
export declare function calculateKPSubLord(longitude: number): {
    signLord: string;
    starLord: string;
    subLord: string;
    subSubLord: string;
};
export interface JaiminiKarakaDetail {
    karakaName: 'Atmakaraka' | 'Amatyakaraka' | 'Bhratrikaraka' | 'Matrikaraka' | 'Putrakaraka' | 'Gnatikaraka' | 'Darakaraka';
    symbol: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
    planetName: string;
    degreeInSign: number;
}
export interface ArudhaPadaDetail {
    houseNumber: number;
    padaCode: string;
    padaSignIndex: number;
    padaSignName: string;
}
export declare function calculateJaiminiDetails(natalChart: NatalChartData): {
    karakas: JaiminiKarakaDetail[];
    arudhaPadas: ArudhaPadaDetail[];
    arudhaLagna: ArudhaPadaDetail;
    upapadaLagna: ArudhaPadaDetail;
};
export interface VarshphalReport {
    targetAge: number;
    varshpraveshDate: Date;
    munthaSignIndex: number;
    munthaSignName: string;
    punyaSahamLongitude: number;
    vidyaSahamLongitude: number;
}
/**
 * Calculates Varshpravesh (exact annual solar return timestamp using Newton-Raphson)
 * and Muntha sign for any target completed age.
 */
export declare function calculateVarshphal(natalChart: NatalChartData, completedYears: number): VarshphalReport;
export interface LalKitabAnalysis {
    sleepingHouses: number[];
    artificialMasnooiPlanets: {
        pair: string;
        represents: string;
    }[];
    isDharmiTeva: boolean;
}
export declare function evaluateLalKitab(natalChart: NatalChartData): LalKitabAnalysis;
export interface PanchPakshiResult {
    birthBird: 'Vulture' | 'Owl' | 'Crow' | 'Cock' | 'Peacock';
    currentActivity: 'Eating' | 'Walking' | 'Ruling' | 'Sleeping' | 'Dying';
}
export declare function evaluatePanchPakshi(moonLongitude: number, queryHour?: number): PanchPakshiResult;
//# sourceMappingURL=predictiveEngine.d.ts.map