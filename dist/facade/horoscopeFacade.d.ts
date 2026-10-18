/**
 * Sanatan Astro Engine: Master Horoscope Facade
 *
 * Provides a single plug-and-play entrypoint (`calculateCompleteHoroscope`)
 * unifying Kundli casting, Shodashvarga, Shadbala, Ashtakavarga, Dashas,
 * Predictive synthesis, Classical Vedic remedies, and SVG chart rendering.
 */
import { HoroscopeInput, EngineMetadata } from './inputResolver';
import { NatalPlanetDetail, BhavaCuspDetail } from '../kundli/houseCusps';
import { ShodashvargaReport } from '../vargas/shodashvarga';
import { ShadbalaSummary } from '../shadbala/shadbalaEngine';
import { FullAshtakavargaReport } from '../ashtakavarga/ashtakavargaEngine';
import { FullDashaReport } from '../dasha/dashaEngine';
import { calculateKPSubLord, calculateJaiminiDetails, YogaEvaluation, DoshaEvaluation, VarshphalReport, LalKitabAnalysis } from '../synthesis/predictiveEngine';
import { VedicRemediesResult } from '../remedies/remedyEngine';
export type HouseCuspDetail = BhavaCuspDetail;
export interface ExtendedPlanetDetail extends NatalPlanetDetail {
    rashiHouse: number;
    bhavaChalitHouse: number;
}
export interface CompleteHoroscopeResult {
    metadata: EngineMetadata;
    ascendant: {
        sign: string;
        signIndex: number;
        degree: number;
        formatted: string;
        nakshatra: string;
        pada: number;
    };
    planets: Array<ExtendedPlanetDetail>;
    cusps: Array<HouseCuspDetail>;
    vargas: ShodashvargaReport;
    shadbala: ShadbalaSummary;
    ashtakavarga: FullAshtakavargaReport;
    dashas: {
        vimshottari: FullDashaReport['vimshottari'];
        yogini: FullDashaReport['yogini'];
        ashtottari: FullDashaReport['ashtottari'];
        chara: FullDashaReport['chara'];
    };
    predictive: {
        yogas: YogaEvaluation[];
        doshas: DoshaEvaluation[];
        kp: ReturnType<typeof calculateKPSubLord>;
        jaimini: ReturnType<typeof calculateJaiminiDetails>;
        tajik: VarshphalReport;
        lalKitab: LalKitabAnalysis;
    };
    remedies: VedicRemediesResult;
    charts: {
        northIndianSvg: string;
        southIndianSvg: string;
        eastIndianSvg: string;
    };
}
/**
 * Determines exact Bhava Chalit house (1 to 12) from Sripati/Placidus cusp sandhi boundaries.
 */
export declare function findBhavaChalitHouse(longitude: number, cusps: BhavaCuspDetail[]): number;
/**
 * Master Facade: Calculates a complete Vedic Horoscope in a single high-performance call.
 * Accepts either UTC Date or civil date/time with timezone and provides full calculations,
 * dual-house classifications, Vedic remedies, and SVG charts.
 */
export declare function calculateCompleteHoroscope(input: HoroscopeInput): CompleteHoroscopeResult;
//# sourceMappingURL=horoscopeFacade.d.ts.map