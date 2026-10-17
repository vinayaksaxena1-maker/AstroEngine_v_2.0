/**
 * Phase 2A: Swiss Ephemeris Core Integration (Part A)
 *
 * Exposes a Worker Proxy interface with isReady() checking
 * to block UI render during Web Worker compilation.
 */
export declare function registerPanchangCacheClearer(fn: () => void): void;
export interface SolarTimes {
    sunrise: string;
    sunset: string;
    sunriseRaw: number;
    sunsetRaw: number;
}
export interface MoonTimes {
    moonrise: string;
    moonset: string;
    moonriseRaw: number;
    moonsetRaw: number;
}
export interface PlanetPosition {
    name: string;
    hindiName: string;
    longitude: number;
    speed: number;
    isRetrograde: boolean;
    sign: string;
    signHindi: string;
}
export interface PanchangPositions {
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
    planets: PlanetPosition[];
}
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
export declare function getEngineProgressStage(): "WASM_COMPILED" | "EPHEMERIS_READY" | "WORKER_CREATED" | "PANCHANG_PREFETCH" | "ENGINE_READY";
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