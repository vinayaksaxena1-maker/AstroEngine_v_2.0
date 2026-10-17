/**
 * Phase 2A: Swiss Ephemeris Core Integration (Part A)
 *
 * Exposes a Worker Proxy interface with isReady() checking
 * to block UI render during Web Worker compilation.
 */

// Dedicated External Web Worker (Part B) via standard Vite ES module worker instantiation
// This avoids Blob URL restrictions and memory crashes in mobile WebViews / Capacitor APK builds.
import { getSeplBuffer, getSemoBuffer } from './epheAssets';
import { EngineLogger } from './engineLogger';

let panchangCacheClearer: (() => void) | null = null;
export function registerPanchangCacheClearer(fn: () => void) {
  panchangCacheClearer = fn;
}

export interface SolarTimes {
  sunrise: string;
  sunset: string;
  sunriseRaw: number; // minutes since midnight
  sunsetRaw: number;  // minutes since midnight
}

export interface MoonTimes {
  moonrise: string;
  moonset: string;
  moonriseRaw: number; // minutes since midnight
  moonsetRaw: number;  // minutes since midnight
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
  tithiIdx: number;            // 0 to 29
  tithiPercent: number;        // fraction passed (0.0 to 1.0)
  tithiRemainingHours: number;
  tithiPassedHours: number;

  naksIdx: number;             // 0 to 26
  naksPercent: number;         // fraction passed (0.0 to 1.0)
  naksRemainingHours: number;

  yogaIdx: number;             // 0 to 26
  yogaPercent: number;         // fraction passed (0.0 to 1.0)
  yogaRemainingHours: number;

  karanaTotalSec: number;      // 0 to 59
  karanaVal: number;           // 0 to 10
  karanaPercent: number;       // fraction passed (0.0 to 1.0)
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

// ---------------------------------------------------------------------------
// Isolated Web Worker Integration (Part B Boundary)
// ---------------------------------------------------------------------------
let tWorkerCreated = performance.now();
let tInitStart = 0;
let tEngineReady = 0;

let lastErrorCode: string = 'ENG-006';
let failureTimestamp: string = '';

let cachedSeplBuf: ArrayBuffer | null = null;
let cachedSemoBuf: ArrayBuffer | null = null;

let worker: Worker | null = null;
try {
  worker = new Worker(new URL('./astroWorker.ts', import.meta.url), { type: 'module' });
  EngineLogger.pushLog('INFO', 'Dedicated ES Module Worker instantiated successfully');
  
  if (worker) {
    worker.onerror = (errEvent: ErrorEvent) => {
      EngineLogger.pushLog('ERROR', `Web Worker onerror event triggered: ${errEvent.message} in ${errEvent.filename}:${errEvent.lineno}:${errEvent.colno}`, {
        error: errEvent.error?.stack || errEvent.error?.message || String(errEvent.error || 'No error object stack')
      });
      lastErrorCode = 'ENG-004';
      failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    };

    worker.onmessageerror = (msgErrEvent: MessageEvent) => {
      EngineLogger.pushLog('ERROR', 'Web Worker onmessageerror event triggered', {
        data: msgErrEvent.data,
        origin: msgErrEvent.origin
      });
    };
  }
} catch (e: any) {
  lastErrorCode = 'ENG-001';
  failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  EngineLogger.pushLog('ERROR', 'Failed to instantiate Web Worker', e?.message || e);
}

const solarCache = new Map<string, SolarTimes>();
const moonCache = new Map<string, MoonTimes>();
const positionCache = new Map<string, PanchangPositions>();
const pendingQueries = new Set<string>();
const activeExpectedKeys = new Set<string>();

const EMPTY_SOLAR: SolarTimes = {
  sunrise: "06:00:00 AM",
  sunset: "06:00:00 PM",
  sunriseRaw: 360,
  sunsetRaw: 1080
};

const EMPTY_MOON: MoonTimes = {
  moonrise: "--:--",
  moonset: "--:--",
  moonriseRaw: 0,
  moonsetRaw: 0
};

const EMPTY_POSITIONS: PanchangPositions = {
  tithiIdx: 0,
  tithiPercent: 0,
  tithiRemainingHours: 0,
  tithiPassedHours: 0,
  naksIdx: 0,
  naksPercent: 0,
  naksRemainingHours: 0,
  yogaIdx: 0,
  yogaPercent: 0,
  yogaRemainingHours: 0,
  karanaTotalSec: 0,
  karanaVal: 0,
  karanaPercent: 0,
  karanaRemainingHours: 0,
  monthsSinceEpoch: 0,
  diffDays: 0,
  isAdhik: false,
  sunSidereal: 0,
  moonSidereal: 0,
  ayanamsa: 24.2,
  planets: []
};

let updateListener: (() => void) | null = null;
let isEngineReady = false;
let isInitialLoadComplete = false;
let isEngineTimeout = false;
let engineProgressStage: 'WORKER_CREATED' | 'WASM_COMPILED' | 'EPHEMERIS_READY' | 'PANCHANG_PREFETCH' | 'ENGINE_READY' = 'WORKER_CREATED';
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const initialKeys = new Set<string>();

export function registerEngineListener(callback: () => void) {
  updateListener = callback;
}

export function isReady(): boolean {
  return isEngineReady;
}

export function isEngineCalculating(): boolean {
  return !isReady() || pendingQueries.size > 0;
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
  return retryCount;
}

export function getLastDiagnosticInfo() {
  const elapsedSec = ((performance.now() - tWorkerCreated) / 1000).toFixed(1);
  return {
    errorCode: lastErrorCode,
    timestamp: failureTimestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
    elapsedTime: `${elapsedSec}s`
  };
}

export function isMaxRetriesReached(): boolean {
  return retryCount >= MAX_RETRIES;
}

export function extendInitializationTimeout() {
  EngineLogger.logDebug('Extending initialization timeout window by 30 seconds.');
  isEngineTimeout = false;
  start30SecTimeout();
  if (updateListener) {
    updateListener();
  }
}

export function retryEngineInitialization() {
  if (retryCount >= MAX_RETRIES) {
    lastErrorCode = 'ENG-003';
    failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    EngineLogger.logCriticalFailure('ENG-003', 'Maximum Retry Limit Reached', { retryCount });
    isEngineTimeout = true;
    if (updateListener) {
      updateListener();
    }
    return;
  }

  retryCount += 1;
  EngineLogger.logDebug(`Retry Attempt ${retryCount}`);

  isEngineTimeout = false;
  isEngineReady = false;
  isInitialLoadComplete = false;
  engineProgressStage = 'WORKER_CREATED';
  
  if (worker) {
    try {
      tInitStart = performance.now();
      if (!cachedSeplBuf || !cachedSemoBuf) {
        lastErrorCode = 'ENG-002';
        failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        EngineLogger.logCriticalFailure('ENG-002', 'Retry failed: cached ephemeris buffers unavailable', {});
        if (updateListener) updateListener();
        return;
      }
      const seplBuf = cachedSeplBuf.slice(0);
      const semoBuf = cachedSemoBuf.slice(0);
      worker.postMessage({
        type: 'INIT',
        seplBuf,
        semoBuf,
        appOrigin: window.location.origin
      }, [seplBuf, semoBuf]);
      start30SecTimeout();
    } catch (err: any) {
      lastErrorCode = 'ENG-002';
      failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      EngineLogger.logCriticalFailure('ENG-002', 'Retry init failed', { error: err });
    }
  }
  if (updateListener) {
    updateListener();
  }
}

function start30SecTimeout() {
  if (timeoutTimer) clearTimeout(timeoutTimer);
  timeoutTimer = setTimeout(() => {
    if (!isReady()) {
      lastErrorCode = 'ENG-006';
      failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      EngineLogger.logDebug('30-second initialization timeout reached before application readiness. Prompting user decision.');
      isEngineTimeout = true;
      if (updateListener) {
        updateListener();
      }
    }
  }, 30000);
}

if (typeof window !== 'undefined') {
  if (worker) {
    try {
      tInitStart = performance.now();
      // Cache buffers BEFORE first transfer so retry can reuse them
      cachedSeplBuf = getSeplBuffer().slice(0);
      cachedSemoBuf = getSemoBuffer().slice(0);
      const seplBuf = cachedSeplBuf.slice(0); // transfer a copy, keep cache intact
      const semoBuf = cachedSemoBuf.slice(0);
      
      EngineLogger.pushLog('INFO', `Posting INIT message to Worker (sepl: ${(seplBuf.byteLength/1024).toFixed(0)}KB, semo: ${(semoBuf.byteLength/1024).toFixed(0)}KB)`);
      worker.postMessage({
        type: 'INIT',
        seplBuf,
        semoBuf,
        appOrigin: window.location.origin
      }, [seplBuf, semoBuf]);
    } catch (err: any) {
      lastErrorCode = 'ENG-005';
      failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      EngineLogger.logCriticalFailure('ENG-005', 'Failed to load inline ephemeris buffers', { error: err });
      isEngineTimeout = true;
      if (updateListener) {
        updateListener();
      }
    }

    start30SecTimeout();
  } else {
    lastErrorCode = 'ENG-001';
    failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    EngineLogger.logCriticalFailure('ENG-001', 'Web Worker allocation blocked by browser/environment');
    isEngineTimeout = true;
  }
}

if (worker) {
  worker.onmessage = (event: MessageEvent) => {
    const { type, key, data, message, stage, timings } = event.data;

    if (type === 'PROGRESS') {
      if (stage === 'FETCHING_WASM') {
        EngineLogger.pushLog('INFO', `[Stage] Fetching WASM Binary...`, message);
      } else if (stage === 'WASM_FETCHED') {
        EngineLogger.pushLog('INFO', `[Stage] WASM Downloaded successfully`, message);
      } else if (stage === 'COMPILING_WASM') {
        engineProgressStage = 'WORKER_CREATED';
        EngineLogger.pushLog('INFO', `[Stage] Compiling WebAssembly module...`, message);
      } else if (stage === 'WASM_PRINT') {
        EngineLogger.pushLog('INFO', `[WASM Output] ${message}`);
      } else if (stage === 'WASM_PRINT_ERR') {
        EngineLogger.pushLog('WARN', `[WASM Err] ${message}`);
      } else if (stage === 'WASM_COMPILED') {
        engineProgressStage = 'WASM_COMPILED';
        EngineLogger.pushLog('INFO', `[Stage] WASM Compiled`, message || `${timings?.wasmTime?.toFixed(2) || 0}ms`);
      } else if (stage === 'WRITING_EPHEMERIS') {
        EngineLogger.pushLog('INFO', `[Stage] Writing Ephemeris Files`, message);
      } else if (stage === 'EPHEMERIS_READY') {
        engineProgressStage = 'EPHEMERIS_READY';
        EngineLogger.pushLog('INFO', `[Stage] Ephemeris Files Ready`, message || `${timings?.ephemerisTime?.toFixed(2) || 0}ms`);
      } else if (stage === 'ALLOCATING_POINTERS') {
        EngineLogger.pushLog('INFO', `[Stage] Allocating C Memory Pointers...`, message);
      } else {
        EngineLogger.pushLog('INFO', `[Stage] ${stage}`, message);
      }
      if (updateListener) {
        updateListener();
      }
      return;
    }

    if (type === 'READY') {
      tEngineReady = performance.now();
      isEngineReady = true;
      engineProgressStage = 'PANCHANG_PREFETCH';
      isEngineTimeout = false;
      retryCount = 0;

      const totalDuration = tEngineReady - tWorkerCreated;
      const workerCreationDuration = tInitStart - tWorkerCreated;
      const readyDuration = tEngineReady - tInitStart;

      EngineLogger.logDiagnostics({
        workerCreationTime: workerCreationDuration,
        wasmCompilationTime: timings?.wasmTime,
        ephemerisLoadingTime: timings?.ephemerisTime,
        engineReadyTime: readyDuration,
        totalDuration: totalDuration,
        retryCount: retryCount,
        result: 'SUCCESS'
      });

      const today = new Date();
      const lat = 28.6139; // New Delhi
      const lon = 77.2090;

      const cacheKeySolar = `SOLAR_${lat.toFixed(4)}_${lon.toFixed(4)}_${today.toDateString()}`;
      const cacheKeyMoon = `MOON_${lat.toFixed(4)}_${lon.toFixed(4)}_${today.toDateString()}`;
      const cacheKeyPos = getPositionCacheKey(today);

      pendingQueries.add(cacheKeySolar);
      pendingQueries.add(cacheKeyMoon);
      pendingQueries.add(cacheKeyPos);

      initialKeys.add(cacheKeySolar);
      initialKeys.add(cacheKeyMoon);
      initialKeys.add(cacheKeyPos);

      if (worker) {
        worker.postMessage({ type: 'CALCULATE_SOLAR', key: cacheKeySolar, lat, lon, date: today.toISOString() });
        worker.postMessage({ type: 'CALCULATE_MOON', key: cacheKeyMoon, lat, lon, date: today.toISOString() });
        worker.postMessage({ type: 'CALCULATE_COORDINATES', key: cacheKeyPos, date: today.toISOString() });
      }
      if (updateListener) {
        updateListener();
      }
      return;
    }

    if (type === 'ERROR') {
      if (message && message.includes('Engine not ready')) {
        EngineLogger.pushLog('INFO', `Worker queued pre-ready query for [${key || 'GENERAL'}]`);
        return;
      }
      lastErrorCode = 'ENG-004';
      failureTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      EngineLogger.logCriticalFailure('ENG-004', `Worker error for key: ${key || 'GENERAL'} [${message}]`, { message });
      if (key) {
        pendingQueries.delete(key);
      }
      if (updateListener) {
        updateListener();
      }
      return;
    }

    if (type === 'RESULT') {
      EngineLogger.pushLog('INFO', `Received RESULT for [${key}] -> Saved to Cache & Cleared PanchangCache`);
      if (key.startsWith('SOLAR_')) {
        solarCache.set(key, data);
      } else if (key.startsWith('MOON_')) {
        moonCache.set(key, data);
      } else if (key.startsWith('POS_')) {
        positionCache.set(key, data);
      }
      pendingQueries.delete(key);
      if (panchangCacheClearer) {
        try { panchangCacheClearer(); } catch {}
      }



      if (initialKeys.has(key)) {
        initialKeys.delete(key);
        if (initialKeys.size === 0) {
          isInitialLoadComplete = true;
          engineProgressStage = 'ENGINE_READY';
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
            timeoutTimer = null;
          }
          EngineLogger.logDebug('Initial calculations pre-fetch completed. Application is Ready. Clearing timeout.');
        }
      }

      if (updateListener) {
        setTimeout(updateListener, 0);
      }
    }
  };
}

function calculateTimezoneOffset(lat: number, lon: number): number {
  // India Bounding Box: Lat 8.0 to 37.0, Lon 68.0 to 97.0
  if (lat >= 8.0 && lat <= 37.0 && lon >= 68.0 && lon <= 97.0) {
    return 5.5; // IST
  }
  // Nepal check: Lat 26.0 to 31.0, Lon 80.0 to 89.0
  if (lat >= 26.0 && lat <= 31.0 && lon >= 80.0 && lon <= 89.0) {
    return 5.75; // Nepal Standard Time
  }
  // General longitude approximation rounded to nearest 0.5 hours
  return Math.round(lon / 15 * 2) / 2;
}

function getPositionCacheKey(date: Date): string {
  return `POS_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_H${date.getHours()}`;
}

class SwissEphemerisAstronomicalEngine implements AstronomicalEngine {
  isReady(): boolean {
    return isEngineReady;
  }

  getSolarTimes(lat: number, lon: number, date: Date): SolarTimes {
    const cacheKey = `SOLAR_${lat.toFixed(4)}_${lon.toFixed(4)}_${date.toDateString()}`;
    const cached = solarCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    if (!pendingQueries.has(cacheKey)) {
      pendingQueries.add(cacheKey);
      EngineLogger.pushLog('WARN', `Cache MISS [${cacheKey}] -> Sent CALCULATE_SOLAR to worker. Returning Sentinel Solar fallback temporarily.`);
      if (worker) {
        worker.postMessage({
          type: 'CALCULATE_SOLAR',
          key: cacheKey,
          lat,
          lon,
          date: date.toISOString(),
          offsetHours: calculateTimezoneOffset(lat, lon)
        });
      }
    }

    return EMPTY_SOLAR;
  }

  getMoonTimes(sunriseMin: number, sunsetMin: number, tithiIdx: number, date: Date, lat: number, lon: number): MoonTimes {
    const cacheKey = `MOON_${lat.toFixed(4)}_${lon.toFixed(4)}_${date.toDateString()}`;
    const cached = moonCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    if (!pendingQueries.has(cacheKey)) {
      pendingQueries.add(cacheKey);
      EngineLogger.pushLog('WARN', `Cache MISS [${cacheKey}] -> Sent CALCULATE_MOON to worker. Returning Sentinel Moon fallback temporarily.`);
      if (worker) {
        worker.postMessage({
          type: 'CALCULATE_MOON',
          key: cacheKey,
          lat,
          lon,
          date: date.toISOString(),
          sunriseMin,
          sunsetMin,
          tithiIdx,
          offsetHours: calculateTimezoneOffset(lat, lon)
        });
      }
    }

    return EMPTY_MOON;
  }

  getPanchangPositions(date: Date): PanchangPositions {
    const cacheKey = getPositionCacheKey(date);
    const cached = positionCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // Return latest cached valid positions entry if available
    if (positionCache.size > 0) {
      const latestCached = Array.from(positionCache.values()).pop();
      if (latestCached && latestCached.planets && latestCached.planets.length === 9) {
        if (!pendingQueries.has(cacheKey)) {
          pendingQueries.add(cacheKey);
          if (worker) {
            worker.postMessage({
              type: 'CALCULATE_COORDINATES',
              key: cacheKey,
              date: date.toISOString()
            });
          }
        }
        return latestCached;
      }
    }

    if (!pendingQueries.has(cacheKey)) {
      pendingQueries.add(cacheKey);
      EngineLogger.pushLog('WARN', `Cache MISS [${cacheKey}] -> Sent CALCULATE_COORDINATES to worker. Returning Sentinel Positions fallback temporarily.`);
      if (worker) {
        worker.postMessage({
          type: 'CALCULATE_COORDINATES',
          key: cacheKey,
          date: date.toISOString()
        });
      }
    }

    return EMPTY_POSITIONS;
  }
}

export const astronomicalEngine: AstronomicalEngine = new SwissEphemerisAstronomicalEngine();
