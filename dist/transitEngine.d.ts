/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export interface TransitItem {
    id: string;
    planetName: string;
    planetHindi: string;
    fromSign: string;
    fromSignHindi: string;
    toSign: string;
    toSignHindi: string;
    date: Date;
    dateStr: string;
    prediction: string;
    predictionHindi: string;
    type: 'auspicious' | 'inauspicious' | 'neutral';
}
export declare const SIGN_MAP: Record<string, string>;
export declare const PLANET_MAP: Record<string, string>;
export declare const TRANSIT_PREDICTIONS: Record<string, Record<string, {
    en: string;
    hi: string;
    type: 'auspicious' | 'inauspicious' | 'neutral';
}>>;
/**
 * Calculates future transits (Gochar) for a range of dates.
 * Checks weekly intervals for sign changes to minimize Worker messages,
 * then queries intermediate days when a transition is detected.
 */
export declare function calculateFutureTransits(startDate: Date, daysRange?: number): Promise<TransitItem[]>;
export declare const getUpcomingTransits: typeof calculateFutureTransits;
//# sourceMappingURL=transitEngine.d.ts.map