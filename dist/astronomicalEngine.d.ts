/**
 * Sanatan Astronomical Engine (100% Closed-Source / Proprietary Engine)
 *
 * Drop-in MIT/JPL replacement for Swiss Ephemeris WASM.
 * Powered by astronomy-engine (MIT License) with JPL-calibrated models.
 * Provides synchronous, instantaneous Vedic Panchang & Astronomical calculations.
 */
import { SolarTimesResult, MoonTimesResult, PanchangPositionsResult, PlanetPositionResult } from './core/sanatan_jpl_bridge';
export declare function registerPanchangCacheClearer(fn: () => void): void;
export type SolarTimes = SolarTimesResult;
export type MoonTimes = MoonTimesResult;
export type PlanetPosition = PlanetPositionResult;
export type PanchangPositions = PanchangPositionsResult;
export interface AstronomicalEngine {
    getSolarTimes(lat: number, lon: number, date: Date): SolarTimes;
    getMoonTimes(sunriseMin: number, sunsetMin: number, tithiIdx: number, date: Date, lat: number, lon: number): MoonTimes;
    getPanchangPositions(date: Date): PanchangPositions;
    isReady(): boolean;
}
export declare function registerEngineListener(callback: () => void): void;
export declare function isReady(): boolean;
export declare function isEngineCalculating(): boolean;
export declare function registerActiveExpectedKeys(keys: string[]): void;
export declare function isTimeoutTriggered(): boolean;
export declare function getEngineProgressStage(): "ENGINE_READY" | "WORKER_CREATED" | "WASM_COMPILED" | "EPHEMERIS_READY" | "PANCHANG_PREFETCH";
export declare function getRetryCount(): number;
export declare function getLastDiagnosticInfo(): {
    errorCode: string;
    timestamp: string;
    elapsedTime: string;
};
export declare function isMaxRetriesReached(): boolean;
export declare function extendInitializationTimeout(): void;
export declare function retryEngineInitialization(): void;
export declare const astronomicalEngine: AstronomicalEngine;
//# sourceMappingURL=astronomicalEngine.d.ts.map