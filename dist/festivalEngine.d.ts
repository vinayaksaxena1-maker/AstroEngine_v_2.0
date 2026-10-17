import { PanchangInfo, Festival } from './types';
/**
 * Calculates Hindu festivals and vrats dynamically for a given Panchang day
 * based on Tithi, Month, and specific Vedic Vrat Time Windows (Moonrise, Madhyahna, Sunset, Nishita).
 * Runs 100% offline.
 */
export declare function getFestivalsForDay(panchang: PanchangInfo): Festival[];
export declare function getPanchangForFestivalDay(date: Date): PanchangInfo;
/**
 * Dynamically computes all major festivals and fasting vrats for a given year
 * by evaluating the astronomical rules day-by-day.
 * Runs 100% offline.
 */
export declare function getFestivalsForYear(year: number, lat: number, lon: number): Festival[];
/**
 * Dynamically computes all major festivals and fasting vrats for a given month.
 * monthIndex is 0-indexed (0 = January, 11 = December).
 */
export declare function getFestivalsForMonth(year: number, monthIndex: number): Festival[];
//# sourceMappingURL=festivalEngine.d.ts.map