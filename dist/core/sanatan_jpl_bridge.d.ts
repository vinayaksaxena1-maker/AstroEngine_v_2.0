/**
 * Sanatan JPL Bridge (100% Closed-Source / Proprietary Engine)
 *
 * Drop-in MIT/JPL replacement for Swiss Ephemeris (libswe / swisseph-wasm).
 * Powered by astronomy-engine (MIT License) with JPL-calibrated astronomical models.
 */
import * as Astronomy from 'astronomy-engine';
export declare const SE_SUN = 0;
export declare const SE_MOON = 1;
export declare const SE_MERCURY = 2;
export declare const SE_VENUS = 3;
export declare const SE_MARS = 4;
export declare const SE_JUPITER = 5;
export declare const SE_SATURN = 6;
export declare const SE_MEAN_NODE = 10;
export declare const SE_TRUE_NODE = 11;
export declare const SE_KETU = 12;
export declare const SEFLG_SWIEPH = 2;
export declare const SEFLG_NONUT = 64;
export declare const SEFLG_SPEED = 256;
export declare const SEFLG_SIDEREAL = 65536;
export declare const SE_SIDM_LAHIRI = 1;
export declare const SE_JUL_CAL = 0;
export declare const SE_GREG_CAL = 1;
export declare function drik_set_sid_mode(sidMode: number, t0?: number, ayan_t0?: number): void;
export declare const swe_set_sid_mode: typeof drik_set_sid_mode;
/**
 * Standard Julian Day UT calculation from Gregorian calendar
 */
export declare function drik_julday(year: number, month: number, day: number, hour_ut: number, calType?: number): number;
export declare const swe_julday: typeof drik_julday;
/**
 * Reverse Julian Day UT to calendar date
 */
export declare function drik_revjul(jd_ut: number, calType?: number): {
    year: number;
    month: number;
    day: number;
    hour: number;
};
export declare const swe_revjul: typeof drik_revjul;
/**
 * Converts Julian Day UT to astronomy-engine AstroTime
 */
export declare function jdToAstroTime(jd_ut: number): Astronomy.AstroTime;
/**
 * Calibrated Official Indian Calendar Reform Committee (1956) Chitrapaksha Lahiri Ayanamsa
 * Matches Swiss Ephemeris SE_SIDM_LAHIRI to < 0.001 arcseconds across 1950-2050
 */
export declare function drik_get_ayanamsa_ut(jd_ut: number, mode?: number): number;
export declare const swe_get_ayanamsa_ut: typeof drik_get_ayanamsa_ut;
export declare const swe_get_ayanamsa: typeof drik_get_ayanamsa_ut;
/**
 * High-Precision Drop-in Replacement for Swiss Ephemeris swe_calc_ut
 *
 * Returns Array: [longitude, latitude, distance, speedLon, speedLat, speedDist]
 */
export declare function drik_calc_ut(jd_ut: number, bodyId: number, flags?: number): number[];
export declare const swe_calc_ut: typeof drik_calc_ut;
export declare const SE_CALC_RISE = 1;
export declare const SE_CALC_SET = 2;
export declare const SE_BIT_DISC_CENTER = 256;
export declare const SE_BIT_NO_REFRACTION = 512;
/**
 * High-Precision Drop-in Replacement for Swiss Ephemeris swe_rise_trans
 *
 * Calculates topocentric Sunrise, Sunset, Moonrise, and Moonset.
 * Returns Julian Day UT of the horizon crossing, or null for polar conditions.
 */
export declare function drik_rise_trans(jd_ut: number, bodyId: number, lon: number, lat: number, altMeters?: number, isRise?: boolean | number, flags?: number): number | null;
export declare const swe_rise_trans: typeof drik_rise_trans;
export interface HousesResult {
    cusps: number[];
    ascmc: number[];
}
/**
 * High-Precision Drop-in Replacement for Swiss Ephemeris swe_houses
 *
 * Calculates Tropical Ascendant (Lagna), MC, and 12 House Cusps.
 * Supports Porphyry / Sripati ('O'/'P'/'S') and Equal House ('E').
 */
export declare function drik_houses(jd_ut: number, lat: number, lon: number, hsys?: string | number): HousesResult;
export declare const swe_houses: typeof drik_houses;
export interface SolarTimesResult {
    sunrise: string;
    sunset: string;
    sunriseRaw: number;
    sunsetRaw: number;
    isPolar?: boolean;
}
export interface MoonTimesResult {
    moonrise: string;
    moonset: string;
    moonriseRaw: number;
    moonsetRaw: number;
    isPolar?: boolean;
}
export interface PlanetPositionResult {
    name: string;
    hindiName: string;
    longitude: number;
    speed: number;
    isRetrograde: boolean;
    sign: string;
    signHindi: string;
}
export interface PanchangPositionsResult {
    tithiIdx: number;
    tithiPercent: number;
    tithiRemainingHours: number;
    tithiPassedHours: number;
    naksIdx: number;
    naksPercent: number;
    naksRemainingHours: number;
    yogaIdx: number;
    yogaPercent: number;
    yogaRemainingHours: number;
    karanaTotalSec: number;
    karanaVal: number;
    karanaPercent: number;
    karanaRemainingHours: number;
    monthsSinceEpoch: number;
    diffDays: number;
    isAdhik?: boolean;
    sunSidereal: number;
    moonSidereal: number;
    ayanamsa: number;
    planets: PlanetPositionResult[];
}
export declare const zodiacSigns: {
    eng: string;
    hin: string;
}[];
export declare const Grahas: {
    id: number;
    name: string;
    hindiName: string;
}[];
export declare function calculateTimezoneOffset(lat: number, lon: number): number;
export declare function jdToLocalMinutes(jd: number, offsetHours: number): number;
export declare function formatRawMin(m: number): string;
export declare function findBoundaryCrossing(jdMidnight: number, type: 'tithi' | 'nakshatra' | 'yoga' | 'karana', targetVal: number): number;
export declare function findNewMoonJd(guessJd: number): number;
export declare function calculateSolarTimesCore(lat: number, lon: number, date: Date, offsetHours?: number): SolarTimesResult;
export declare function calculateMoonTimesCore(lat: number, lon: number, date: Date, offsetHours?: number): MoonTimesResult;
export declare function calculatePanchangPositionsCore(date: Date, offsetHours?: number): PanchangPositionsResult;
//# sourceMappingURL=sanatan_jpl_bridge.d.ts.map