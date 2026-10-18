/**
 * Sanatan Vedic Remedies Engine
 *
 * Implements classical recommendations for:
 * 1. Ratna Paramarsha (Gemstones: Life, Lucky, Benefic Stone with strict Dusthana & Maraka prohibition)
 * 2. Rudraksha Paramarsha (Mukhi 1-14 mapped to planetary weaknesses & combustion)
 * 3. Vedic Mantras (Beej & Gayatri with classical japa counts)
 * 4. Daan & Lal Kitab Upay (Charity, specific items, days, and recipients for Doshas)
 *
 * Grounded in Brihat Parashara Hora Shastra, Phaladeepika, and Lal Kitab.
 */
import { NatalChartData } from '../kundli/houseCusps';
import { ShadbalaSummary } from '../shadbala/shadbalaEngine';
import { DoshaEvaluation, YogaEvaluation } from '../synthesis/predictiveEngine';
export interface GemstoneRecommendation {
    type: 'LifeStone' | 'LuckyStone' | 'BeneficStone';
    typeHindi: string;
    name: string;
    hindiName: string;
    sanskritName: string;
    rulingPlanet: string;
    rulingHouse: number;
    recommendedWeight: string;
    metal: string;
    finger: string;
    dayToWear: string;
    auspiciousHora: string;
    consecrationMantra: string;
    benefits: string;
}
export interface RudrakshaRecommendation {
    mukhi: number;
    mukhiName: string;
    rulingPlanet: string;
    deity: string;
    beejaMantra: string;
    wearDay: string;
    reason: string;
    benefits: string;
}
export interface MantraRemedy {
    planetName: string;
    beejMantra: string;
    vedicGayatri: string;
    recommendedJapaCount: number;
    bestTime: string;
    malaType: string;
    purpose: string;
}
export interface CharityRemedy {
    remedyType: 'Shani' | 'Manglik' | 'KaalSarp' | 'Pitra' | 'General';
    title: string;
    itemsToDonate: string[];
    auspiciousDay: string;
    targetRecipient: string;
    prescribedRitual: string;
    reason: string;
}
export interface VedicRemediesResult {
    gemstones: {
        lifeStone?: GemstoneRecommendation;
        luckyStone?: GemstoneRecommendation;
        beneficStone?: GemstoneRecommendation;
        prohibitedPlanets: string[];
        generalGuidance: string;
    };
    rudraksha: {
        primary: RudrakshaRecommendation;
        secondary: RudrakshaRecommendation[];
        generalGuidance: string;
    };
    mantras: MantraRemedy[];
    charities: CharityRemedy[];
}
/**
 * Computes complete Vedic Remedies according to classical Parashari principles.
 */
export declare function generateVedicRemedies(params: {
    chart: NatalChartData;
    shadbala: ShadbalaSummary;
    doshas: DoshaEvaluation[];
    yogas: YogaEvaluation[];
}): VedicRemediesResult;
//# sourceMappingURL=remedyEngine.d.ts.map