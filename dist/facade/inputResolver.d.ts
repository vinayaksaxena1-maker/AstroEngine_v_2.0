/**
 * Sanatan Astro Engine: Input & Time Resolver
 *
 * Implements bulletproof input validation guardrails and dual-format time resolution
 * (unambiguous UTC instant OR civil date/time + timezoneOffset/ianaTimezone).
 */
import { AyanamshaSystem } from '../core/sanatan_jpl_bridge';
export declare class InvalidCoordinateError extends Error {
    constructor(message: string);
}
export declare class InvalidDateError extends Error {
    constructor(message: string);
}
export interface HoroscopeInput {
    birthDate?: Date;
    date?: string;
    time?: string;
    timezoneOffset?: number;
    ianaTimezone?: string;
    dstDisambiguation?: 'earlier' | 'later';
    latitude: number;
    longitude: number;
    altitudeMeters?: number;
    houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse';
    ayanamshaSystem?: 'Lahiri' | 'KP' | 'Raman';
}
export interface EngineMetadata {
    engineName: 'Sanatan Astro Engine';
    engineVersion: '1.1.1';
    calculatedAt: string;
    resolvedUtcInstant: string;
    julianDayUT: number;
    ayanamshaType: AyanamshaSystem;
    ayanamshaValue: number;
    houseSystemUsed: 'Sripati' | 'Placidus' | 'EqualHouse';
    coordinates: {
        lat: number;
        lng: number;
    };
}
export interface ResolvedInputResult {
    resolvedDate: Date;
    metadata: EngineMetadata;
    houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse';
    ayanamshaSystem: AyanamshaSystem;
}
/**
 * Validates HoroscopeInput and resolves exact UTC date, Julian Day, and calculation metadata.
 */
export declare function resolveHoroscopeInput(input: HoroscopeInput): ResolvedInputResult;
//# sourceMappingURL=inputResolver.d.ts.map