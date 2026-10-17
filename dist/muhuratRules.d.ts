import { PanchangInfo } from './types';
export interface MuhuratSuitability {
    type: string;
    name: string;
    hindiName: string;
    isSuitable: boolean;
    score: number;
    reasons: string[];
}
/**
 * Evaluates auspiciousness score for major life events on a given Panchang day.
 * Implements 100% offline rule matching logic.
 */
export declare function checkMuhurats(panchang: PanchangInfo): MuhuratSuitability[];
//# sourceMappingURL=muhuratRules.d.ts.map