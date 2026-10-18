/**
 * Sanatan Drishti & Planetary Aspect Engine
 *
 * Implements Parashari mutual drishti (7th aspect for all, special aspects for Mars 4/8,
 * Jupiter 5/9, Saturn 3/10, Rahu/Ketu 5/9) and conjunction orbs.
 */
import { NatalPlanetDetail } from './houseCusps';
export interface AspectDetail {
    aspectingPlanet: string;
    aspectedPlanet: string;
    aspectType: '7th' | 'Special_4th' | 'Special_8th' | 'Special_5th' | 'Special_9th' | 'Special_3rd' | 'Special_10th' | 'Conjunction';
    separationDegrees: number;
    orbDegrees: number;
    strengthPercent: number;
    isBenefic: boolean;
}
export interface ConjunctionDetail {
    planet1: string;
    planet2: string;
    signIndex: number;
    houseOccupied: number;
    separationDegrees: number;
    isClose: boolean;
    isGrahaYuddha: boolean;
    warWinner?: string;
}
export interface DrishtiMatrix {
    aspects: AspectDetail[];
    conjunctions: ConjunctionDetail[];
}
export declare function calculateDrishtiAndConjunctions(planets: NatalPlanetDetail[]): DrishtiMatrix;
//# sourceMappingURL=drishtiEngine.d.ts.map