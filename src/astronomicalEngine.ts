/**
 * Sanatan Astronomical Engine (100% Closed-Source / Proprietary Engine)
 *
 * Drop-in MIT/JPL replacement for Swiss Ephemeris WASM.
 * Powered by astronomy-engine (MIT License) with JPL-calibrated models.
 * Provides synchronous, instantaneous Vedic Panchang & Astronomical calculations.
 */

import { EngineLogger } from './engineLogger';
import {
  calculateSolarTimesCore,
  calculateMoonTimesCore,
  calculatePanchangPositionsCore,
  calculateTimezoneOffset,
  SolarTimesResult,
  MoonTimesResult,
  PanchangPositionsResult,
  PlanetPositionResult
} from './core/sanatan_jpl_bridge';

let panchangCacheClearer: (() => void) | null = null;
export function registerPanchangCacheClearer(fn: () => void) {
  panchangCacheClearer = fn;
}

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

// ---------------------------------------------------------------------------
// Engine State & Cache Management
// ---------------------------------------------------------------------------
const solarCache = new Map<string, SolarTimes>();
const moonCache = new Map<string, MoonTimes>();
const positionCache = new Map<string, PanchangPositions>();
const pendingQueries = new Set<string>();
const activeExpectedKeys = new Set<string>();

let updateListener: (() => void) | null = null;
const isEngineReady = true;
const isEngineTimeout = false;
let engineProgressStage: 'WORKER_CREATED' | 'WASM_COMPILED' | 'EPHEMERIS_READY' | 'PANCHANG_PREFETCH' | 'ENGINE_READY' = 'ENGINE_READY';

export function registerEngineListener(callback: () => void) {
  updateListener = callback;
  // Trigger callback asynchronously once registered so listeners receive readiness
  if (typeof setTimeout !== 'undefined') {
    setTimeout(callback, 0);
  }
}

export function isReady(): boolean {
  return isEngineReady;
}

export function isEngineCalculating(): boolean {
  return pendingQueries.size > 0;
}

export function registerActiveExpectedKeys(keys: string[]) {
  activeExpectedKeys.clear();
  keys.forEach(k => activeExpectedKeys.add(k));
}

export function isTimeoutTriggered(): boolean {
  return isEngineTimeout;
}

export function getEngineProgressStage() {
  return engineProgressStage;
}

export function getRetryCount(): number {
  return 0;
}

export function getLastDiagnosticInfo() {
  return {
    errorCode: 'NONE',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    elapsedTime: '0.0s'
  };
}

export function isMaxRetriesReached(): boolean {
  return false;
}

export function extendInitializationTimeout() {
  // No-op: Engine initializes synchronously in 0 ms
}

export function retryEngineInitialization() {
  if (updateListener) {
    updateListener();
  }
}

function getPositionCacheKey(date: Date): string {
  return `POS_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_H${date.getHours()}`;
}

// ---------------------------------------------------------------------------
// Synchronous High-Precision Engine Implementation
// ---------------------------------------------------------------------------
class SanatanProprietaryAstronomicalEngine implements AstronomicalEngine {
  isReady(): boolean {
    return isEngineReady;
  }

  getSolarTimes(lat: number, lon: number, date: Date): SolarTimes {
    const cacheKey = `SOLAR_${lat.toFixed(4)}_${lon.toFixed(4)}_${date.toDateString()}`;
    const cached = solarCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculateSolarTimesCore(lat, lon, date);
    solarCache.set(cacheKey, result);
    return result;
  }

  getMoonTimes(sunriseMin: number, sunsetMin: number, tithiIdx: number, date: Date, lat: number, lon: number): MoonTimes {
    const cacheKey = `MOON_${lat.toFixed(4)}_${lon.toFixed(4)}_${date.toDateString()}`;
    const cached = moonCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculateMoonTimesCore(lat, lon, date);
    moonCache.set(cacheKey, result);
    return result;
  }

  getPanchangPositions(date: Date): PanchangPositions {
    const cacheKey = getPositionCacheKey(date);
    const cached = positionCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = calculatePanchangPositionsCore(date);
    positionCache.set(cacheKey, result);
    return result;
  }
}

export const astronomicalEngine: AstronomicalEngine = new SanatanProprietaryAstronomicalEngine();
