import SwissEph from 'swisseph-wasm';
import WasmSwissEph from '../node_modules/swisseph-wasm/wasm/swisseph.js';
import swissephWasmUrl from '../node_modules/swisseph-wasm/wasm/swisseph.wasm?url';

let swe: any = null;
self.postMessage({ type: 'PROGRESS', stage: 'WORKER_PARSED', message: 'astroWorker.ts script loaded and parsed successfully. Imports resolved.' });
let isReady = false;
const pendingWorkerQueue: any[] = [];

// Global persistent pointers to avoid malloc/free overhead in getRiseTrans
let globalGeoposPtr = 0;
let globalTretPtr = 0;
let globalSerrPtr = 0;

// ---------------------------------------------------------------------------
// Julian Day Helpers
// ---------------------------------------------------------------------------
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return julDayUT(year, month, day, hour);
}

function julDayUT(year: number, month: number, day: number, hour: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24.0 + B - 1524.5;
}

function jdToLocalMinutes(jd: number, offsetHours: number = -new Date().getTimezoneOffset() / 60): number {
  const utHours = (jd - Math.floor(jd) - 0.5) * 24;
  const localHours = ((utHours + offsetHours) % 24 + 24) % 24;
  return localHours * 60;
}

function formatRawMin(m: number): string {
  const normM = (m % 1440 + 1440) % 1440;
  let hrs = Math.floor(normM / 60);
  let mins = Math.floor(normM % 60);
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

const Grahas = [
  { id: 0, name: 'Sun', hindiName: 'सूर्य' },
  { id: 1, name: 'Moon', hindiName: 'चन्द्र' },
  { id: 4, name: 'Mars', hindiName: 'मंगल' },
  { id: 2, name: 'Mercury', hindiName: 'बुध' },
  { id: 5, name: 'Jupiter', hindiName: 'गुरु' },
  { id: 3, name: 'Venus', hindiName: 'शुक्र' },
  { id: 6, name: 'Saturn', hindiName: 'शनि' },
  { id: 10, name: 'Rahu', hindiName: 'राहु' }
];

const zodiacSigns = [
  { eng: 'Aries', hin: 'मेष' },
  { eng: 'Taurus', hin: 'वृषभ' },
  { eng: 'Gemini', hin: 'मिथुन' },
  { eng: 'Cancer', hin: 'कर्क' },
  { eng: 'Leo', hin: 'सिंह' },
  { eng: 'Virgo', hin: 'कन्या' },
  { eng: 'Libra', hin: 'तुला' },
  { eng: 'Scorpio', hin: 'वृश्चिक' },
  { eng: 'Sagittarius', hin: 'धनु' },
  { eng: 'Capricorn', hin: 'मकर' },
  { eng: 'Aquarius', hin: 'कुम्भ' },
  { eng: 'Pisces', hin: 'मीन' }
];

// ---------------------------------------------------------------------------
// Rise / Set calculation helper
// ---------------------------------------------------------------------------
function getRiseTrans(swe: any, jd: number, planet: number, lon: number, lat: number, alt: number, isRise: boolean): number {
  // Set geopos [lon, lat, alt]
  swe.SweModule.HEAPF64[globalGeoposPtr / 8] = lon;
  swe.SweModule.HEAPF64[globalGeoposPtr / 8 + 1] = lat;
  swe.SweModule.HEAPF64[globalGeoposPtr / 8 + 2] = alt;

  const epheflag = 2; // SEFLG_SWIEPH (Strictly use Swiss Ephemeris)
  const rsmi = isRise ? 1 : 2; // 1 = SE_CALC_RISE, 2 = SE_CALC_SET

  const retFlag = swe.SweModule.ccall(
    'swe_rise_trans',
    'number',
    ['number', 'number', 'pointer', 'number', 'number', 'pointer', 'number', 'number', 'pointer', 'pointer'],
    [jd, planet, 0, epheflag, rsmi, globalGeoposPtr, 0, 0, globalTretPtr, globalSerrPtr]
  );

  const start = globalTretPtr / 8;
  const results = swe.SweModule.HEAPF64.slice(start, start + 4);

  if (retFlag < 0) {
    throw new Error(`Swiss Ephemeris rise_trans failed with code ${retFlag}`);
  }
  return results[0];
}

function safeCalcUt(sweInst: any, jd: number, body: number, flags: number = 2 | 4 | 256): number[] {
  try {
    let res = sweInst.calc_ut(jd, body, flags);
    if (res && typeof res[0] === 'number' && !isNaN(res[0])) {
      return res;
    }
    res = sweInst.calc_ut(jd, body, (flags & ~2) | 4);
    if (res && typeof res[0] === 'number' && !isNaN(res[0])) {
      return res;
    }
  } catch (e: any) {
    try {
      const res = sweInst.calc_ut(jd, body, 4 | 256);
      if (res && typeof res[0] === 'number' && !isNaN(res[0])) {
        return res;
      }
    } catch (e2) {}
    throw new Error(`Swiss Ephemeris calculation failed for body ${body}: ${e?.message || e}`);
  }
  throw new Error(`Swiss Ephemeris returned invalid coordinates for body ${body}`);
}

function findNewMoonJd(swe: any, guessJd: number): number {
  let jd = guessJd;
  for (let iter = 0; iter < 5; iter++) {
    const sun = safeCalcUt(swe, jd, 0, 2 | 4 | 256);
    const moon = safeCalcUt(swe, jd, 1, 2 | 4 | 256);
    const val = (moon[0] - sun[0] + 360) % 360;
    const currentSpeed = moon[3] - sun[3];
    
    let err = 0 - val;
    err = ((err + 180) % 360 + 360) % 360 - 180;
    
    if (Math.abs(err) < 0.0001) {
      return jd;
    }
    jd += err / currentSpeed;
  }
  return jd;
}

// ---------------------------------------------------------------------------
// High-Performance Iterative Boundary Crossing Solver
// ---------------------------------------------------------------------------
function findBoundaryCrossing(
  swe: any,
  jdMidnight: number,
  type: 'tithi' | 'nakshatra' | 'yoga',
  targetVal: number,
  ephFlag: number
): number {
  let jd = jdMidnight + 0.5; // Start search at local noon
  let speed = 12.0; // Default degrees/day estimate
  if (type === 'nakshatra') speed = 13.176;
  if (type === 'yoga') speed = 14.176;

  // Maximum 10 iterations of Newton's method for high precision
  for (let iter = 0; iter < 10; iter++) {
    const sun = safeCalcUt(swe, jd, 0, 2 | 4 | 256);
    const moon = safeCalcUt(swe, jd, 1, 2 | 4 | 256);
    const ayanamsa = swe.get_ayanamsa(jd);

    let val = 0;
    let currentSpeed = speed;

    if (type === 'tithi') {
      val = (moon[0] - sun[0] + 360) % 360;
      currentSpeed = moon[3] - sun[3];
    } else if (type === 'nakshatra') {
      val = (moon[0] - ayanamsa + 360) % 360;
      currentSpeed = moon[3];
    } else if (type === 'yoga') {
      val = (moon[0] - ayanamsa + sun[0] - ayanamsa + 720) % 360;
      currentSpeed = moon[3] + sun[3];
    }

    let err = targetVal - val;
    // Normalize angular difference to shortest arc [-180, 180] with JS modulo safety
    err = ((err + 180) % 360 + 360) % 360 - 180;

    if (Math.abs(err) < 0.00001) { // High precision threshold
      return jd;
    }

    if (Math.abs(currentSpeed) < 0.0001) break;
    jd += err / currentSpeed;
  }
  return jd;
}

// ---------------------------------------------------------------------------
// Worker initialization
// ---------------------------------------------------------------------------
async function initWorker(seplBuf: ArrayBuffer, semoBuf: ArrayBuffer, appOrigin?: string) {
  try {
    const tWasmStart = performance.now();

    const cleanPath = swissephWasmUrl.startsWith('/') ? swissephWasmUrl : '/' + swissephWasmUrl;
    const targetWasmUrl = appOrigin ? `${appOrigin}${cleanPath}` : cleanPath;

    self.postMessage({ type: 'PROGRESS', stage: 'FETCHING_WASM', message: `Fetching ${targetWasmUrl}` });

    // 1. Explicitly fetch WASM binary into ArrayBuffer in memory
    const wasmResponse = await fetch(targetWasmUrl);
    if (!wasmResponse.ok) {
      throw new Error(`Failed to fetch WASM binary from ${targetWasmUrl}: ${wasmResponse.status} ${wasmResponse.statusText}`);
    }
    const wasmBinary = await wasmResponse.arrayBuffer();
    self.postMessage({ type: 'PROGRESS', stage: 'WASM_FETCHED', message: `WASM binary downloaded (${(wasmBinary.byteLength / 1024).toFixed(1)} KB)` });

    // 2. Initialize SwissEph directly using pre-loaded in-memory WASM binary
    self.postMessage({ type: 'PROGRESS', stage: 'COMPILING_WASM', message: 'Compiling WebAssembly module...' });
    
    swe = new SwissEph();
    const moduleFactory = typeof WasmSwissEph === 'function' ? WasmSwissEph : (WasmSwissEph as any).default || WasmSwissEph;

    swe.SweModule = await new Promise<any>((resolve, reject) => {
      try {
        const config: any = {
          wasmBinary,
          getPreloadedPackage: () => new ArrayBuffer(0),
          locateFile: (path: string) => path.endsWith('.wasm') ? targetWasmUrl : path,
          print: (text: string) => self.postMessage({ type: 'PROGRESS', stage: 'WASM_PRINT', message: text }),
          printErr: (text: string) => self.postMessage({ type: 'PROGRESS', stage: 'WASM_PRINT_ERR', message: text }),
          onAbort: (what: any) => {
            reject(new Error(`WASM Emscripten Aborted: ${what}`));
          },
          onRuntimeInitialized: function() {
            self.postMessage({ type: 'PROGRESS', stage: 'WASM_RUNTIME_INIT', message: 'Emscripten onRuntimeInitialized fired successfully!' });
            resolve(this);
          }
        };

        const inst = moduleFactory(config);
        if (inst && typeof inst.then !== 'function') {
          resolve(inst);
        }
      } catch (err) {
        reject(err);
      }
    });

    if (!swe.SweModule || !swe.SweModule.FS) {
      throw new Error("WASM FS object not available on SweModule");
    }

    if (!swe.SweModule.HEAP32) {
      swe.SweModule.HEAP32 = new Int32Array(swe.SweModule.HEAPF64.buffer);
    }

    const tWasmEnd = performance.now();
    const wasmTime = tWasmEnd - tWasmStart;

    self.postMessage({ type: 'PROGRESS', stage: 'WASM_COMPILED', wasmTime, message: `WASM compiled in ${wasmTime.toFixed(1)}ms` });

    swe.set_sid_mode(1, 0, 0);

    const tEphStart = performance.now();
    self.postMessage({ type: 'PROGRESS', stage: 'WRITING_EPHEMERIS', message: 'Writing ephemeris files to Virtual Filesystem (/sweph)...' });
    try {
      swe.SweModule.FS.mkdir('/sweph');
    } catch (e) {
      // Ignore if exists
    }

    swe.SweModule.FS.writeFile('/sweph/sepl_18.se1', new Uint8Array(seplBuf));
    swe.SweModule.FS.writeFile('/sweph/semo_18.se1', new Uint8Array(semoBuf));
    swe.set_ephe_path('/sweph');
    const tEphEnd = performance.now();
    const ephemerisTime = tEphEnd - tEphStart;

    self.postMessage({ type: 'PROGRESS', stage: 'EPHEMERIS_READY', ephemerisTime, message: `Ephemeris files written in ${ephemerisTime.toFixed(1)}ms` });

    self.postMessage({ type: 'PROGRESS', stage: 'ALLOCATING_POINTERS', message: 'Allocating persistent C memory pointers...' });
    globalGeoposPtr = swe.SweModule._malloc(3 * 8);
    globalTretPtr   = swe.SweModule._malloc(4 * 8);
    globalSerrPtr   = swe.SweModule._malloc(256);

    isReady = true;
    self.postMessage({ 
      type: 'READY',
      timings: {
        wasmTime,
        ephemerisTime
      }
    });

    // Flush all calculation requests that arrived while WASM was initializing
    while (pendingWorkerQueue.length > 0) {
      const queuedData = pendingWorkerQueue.shift();
      await processWorkerQuery(queuedData);
    }
  } catch (error: any) {
    const errorDetails = error.stack || error.message || String(error);
    self.postMessage({ type: 'ERROR', message: `Init Error: ${errorDetails}` });
  }
}

async function processWorkerQuery(queryData: any) {
  const { type, key, lat, lon, date, offsetHours } = queryData;
  const parsedDate = new Date(date);
  const tzOffset = typeof offsetHours === 'number' ? offsetHours : 5.5;
  const jdQuery = (parsedDate.getTime() / 86400000) + 2440587.5;
  
  // Calculate local midnight JD
  const localMs = parsedDate.getTime() + (tzOffset * 3600000);
  const localDate = new Date(localMs);
  const today0hUT = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 0, 0, 0));
  const today0hMs = today0hUT.getTime() - (tzOffset * 3600000);
  const jdMidnight = (today0hMs / 86400000) + 2440587.5;

  try {
    if (type === 'CALCULATE_SOLAR') {
      let sunriseJd = 0;
      let sunsetJd = 0;
      let isPolar = false;
      try {
        sunriseJd = getRiseTrans(swe, jdMidnight, 0, lon, lat, 0, true);
        sunsetJd = getRiseTrans(swe, jdMidnight, 0, lon, lat, 0, false);
      } catch (e) {
        isPolar = true;
      }

      const sunriseRaw = isPolar ? 0 : jdToLocalMinutes(sunriseJd, offsetHours);
      const sunsetRaw = isPolar ? 0 : jdToLocalMinutes(sunsetJd, offsetHours);

      self.postMessage({
        type: 'RESULT',
        key,
        data: {
          sunrise: isPolar ? 'No Sunrise' : formatRawMin(sunriseRaw),
          sunset: isPolar ? 'No Sunset' : formatRawMin(sunsetRaw),
          sunriseRaw,
          sunsetRaw,
          isPolar
        }
      });
      return;
    }

    if (type === 'CALCULATE_MOON') {
      let moonriseJd = 0;
      let moonsetJd = 0;
      let isPolar = false;
      try {
        moonriseJd = getRiseTrans(swe, jdMidnight, 1, lon, lat, 0, true);
        moonsetJd = getRiseTrans(swe, jdMidnight, 1, lon, lat, 0, false);
      } catch (e) {
        isPolar = true;
      }

      const moonriseRaw = isPolar ? 0 : jdToLocalMinutes(moonriseJd, offsetHours);
      const moonsetRaw = isPolar ? 0 : jdToLocalMinutes(moonsetJd, offsetHours);

      self.postMessage({
        type: 'RESULT',
        key,
        data: {
          moonrise: isPolar ? 'No Moonrise' : formatRawMin(moonriseRaw),
          moonset: isPolar ? 'No Moonset' : formatRawMin(moonsetRaw),
          moonriseRaw,
          moonsetRaw,
          isPolar
        }
      });
      return;
    }


    if (type === 'CALCULATE_COORDINATES') {
      // 0 = SE_SUN, 1 = SE_MOON, 2 = SEFLG_SWIEPH, 256 = SEFLG_SPEED
      const sunPos = safeCalcUt(swe, jdQuery, 0, 2 | 256);
      const moonPos = safeCalcUt(swe, jdQuery, 1, 2 | 256);
      const ayanamsa = swe.get_ayanamsa(jdQuery);

      const sunLon = (sunPos && typeof sunPos[0] === 'number' && !isNaN(sunPos[0])) ? sunPos[0] : 0;
      const moonLon = (moonPos && typeof moonPos[0] === 'number' && !isNaN(moonPos[0])) ? moonPos[0] : 0;

      const sunSidereal = ((sunLon - ayanamsa) % 360 + 360) % 360;
      const moonSidereal = ((moonLon - ayanamsa) % 360 + 360) % 360;

      // 1. Tithi Index & Crossover Solver
      const diffNorm = (moonSidereal - sunSidereal + 360) % 360;
      let tithiIdx = Math.floor(diffNorm / 12);
      if (isNaN(tithiIdx) || tithiIdx < 0) tithiIdx = (tithiIdx + 30) % 30 || 0;
      if (tithiIdx >= 30) tithiIdx = 29;
      const tithiPercent = (diffNorm % 12) / 12;
      const nextTithiTarget = (Math.floor(diffNorm / 12) + 1) * 12;
      const prevTithiTarget = Math.floor(diffNorm / 12) * 12;

      const tithiCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'tithi', nextTithiTarget, 2);
      const tithiRemainingHours = (tithiCrossingJd - jdQuery) * 24;

      const tithiStartJd = findBoundaryCrossing(swe, jdMidnight, 'tithi', prevTithiTarget, 2);
      const tithiPassedHours = Math.max(0, (jdQuery - tithiStartJd) * 24);

      // 2. Nakshatra Index & Crossover Solver
      let naksIdx = Math.floor(moonSidereal / 13.333333333333334);
      if (naksIdx < 0) naksIdx += 27;
      if (naksIdx >= 27) naksIdx = 26;
      const naksPercent = (moonSidereal % 13.333333333333334) / 13.333333333333334;

      const nextNaksTarget = (Math.floor(moonSidereal / 13.333333333333334) + 1) * 13.333333333333334;
      const naksCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'nakshatra', nextNaksTarget, 2);
      const naksRemainingHours = (naksCrossingJd - jdQuery) * 24;

      // 3. Yoga Index & Crossover Solver
      const yogaLon = (moonSidereal + sunSidereal) % 360;
      let yogaIdx = Math.floor(yogaLon / 13.333333333333334);
      if (yogaIdx < 0) yogaIdx += 27;
      if (yogaIdx >= 27) yogaIdx = 26;
      const yogaPercent = (yogaLon % 13.333333333333334) / 13.333333333333334;

      const nextYogaTarget = (Math.floor(yogaLon / 13.333333333333334) + 1) * 13.333333333333334;
      const yogaCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'yoga', nextYogaTarget, 2);
      const yogaRemainingHours = (yogaCrossingJd - jdQuery) * 24;

      // 4. Karana Index & Crossover Solver
      let karanaTotalSec = Math.floor(diffNorm / 6);
      if (karanaTotalSec < 0) karanaTotalSec += 60;
      if (karanaTotalSec >= 60) karanaTotalSec = 59;

      let karanaVal = 0;
      if (karanaTotalSec === 0) {
        karanaVal = 10;
      } else if (karanaTotalSec >= 57) {
        if (karanaTotalSec === 57) karanaVal = 7;
        else if (karanaTotalSec === 58) karanaVal = 8;
        else karanaVal = 9;
      } else {
        karanaVal = ((karanaTotalSec - 1) % 7);
      }
      const karanaPercent = (diffNorm % 6) / 6;

      const nextKaranaTarget = (Math.floor(diffNorm / 6) + 1) * 6;
      const karanaCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'tithi', nextKaranaTarget, 2);
      const karanaRemainingHours = (karanaCrossingJd - jdQuery) * 24;

      // 5. Precise Month Index & Adhik Maas derivation
      const approxDaysAgo = diffNorm / 12.190749;
      const prevNewMoonJd = findNewMoonJd(swe, jdQuery - approxDaysAgo);
      const nextNewMoonJd = findNewMoonJd(swe, prevNewMoonJd + 29.530589);

      const sunPosPrev = safeCalcUt(swe, prevNewMoonJd, 0, 2 | 4 | 256);
      const ayanamsaPrev = swe.get_ayanamsa(prevNewMoonJd);
      const sunLonPrev = ((sunPosPrev[0] - ayanamsaPrev) % 360 + 360) % 360;
      const rashiPrev = Math.max(0, Math.min(11, Math.floor(sunLonPrev / 30)));

      const sunPosNext = safeCalcUt(swe, nextNewMoonJd, 0, 2 | 4 | 256);
      const ayanamsaNext = swe.get_ayanamsa(nextNewMoonJd);
      const sunLonNext = ((sunPosNext[0] - ayanamsaNext) % 360 + 360) % 360;
      const rashiNext = Math.max(0, Math.min(11, Math.floor(sunLonNext / 30)));

      const isAdhik = (rashiPrev === rashiNext);
      const monthIdx = (rashiPrev + 1) % 12;

      // 6. Calculate Navagraha Positions
      const planetsResult: any[] = [];
      for (const g of Grahas) {
        const pos = safeCalcUt(swe, jdQuery, g.id, 2 | 256);
        const lon = (pos && typeof pos[0] === 'number' && !isNaN(pos[0])) ? pos[0] : 0;
        const speed = (pos && typeof pos[3] === 'number' && !isNaN(pos[3])) ? pos[3] : 0;
        const siderealLon = ((lon - ayanamsa) % 360 + 360) % 360;
        
        const signIdx = Math.max(0, Math.min(11, Math.floor(siderealLon / 30)));
        const sign = zodiacSigns[signIdx] || zodiacSigns[0];
        
        planetsResult.push({
          name: g.name,
          hindiName: g.hindiName,
          longitude: siderealLon,
          speed: speed,
          isRetrograde: speed < 0,
          sign: sign.eng,
          signHindi: sign.hin
        });
      }

      // Add Ketu (Ketu is always opposite to Rahu, meaning Rahu + 180 degrees)
      const rahu = planetsResult.find(p => p && p.name === 'Rahu') || planetsResult[0];
      const ketuLon = ((rahu.longitude + 180) % 360 + 360) % 360;
      const ketuSignIdx = Math.max(0, Math.min(11, Math.floor(ketuLon / 30)));
      const ketuSign = zodiacSigns[ketuSignIdx] || zodiacSigns[0];
      
      planetsResult.push({
        name: 'Ketu',
        hindiName: 'केतु',
        longitude: ketuLon,
        speed: rahu.speed || 0,
        isRetrograde: true,
        sign: ketuSign.eng,
        signHindi: ketuSign.hin
      });

      self.postMessage({
        type: 'RESULT',
        key,
        data: {
          tithiIdx,
          tithiPercent,
          tithiRemainingHours,
          tithiPassedHours,
          naksIdx,
          naksPercent,
          naksRemainingHours,
          yogaIdx,
          yogaPercent,
          yogaRemainingHours,
          karanaTotalSec,
          karanaVal,
          karanaPercent,
          karanaRemainingHours,
          monthsSinceEpoch: monthIdx,
          diffDays: 0,
          isAdhik,
          sunSidereal,
          moonSidereal,
          ayanamsa,
          planets: planetsResult
        }
      });
      return;
    }
  } catch (err: any) {
    console.error('ORIGINAL WORKER EXCEPTION', err);
    console.error(err?.stack);
    self.postMessage({ type: 'ERROR', key, message: err.message || String(err) });
  }
}

// ---------------------------------------------------------------------------
// Worker Message Handler
// ---------------------------------------------------------------------------
self.onmessage = async (event: MessageEvent) => {
  const { type, key, seplBuf, semoBuf, appOrigin, error } = event.data;

  if (type === 'INIT') {
    self.postMessage({ type: 'PROGRESS', stage: 'INIT_RECEIVED', message: 'astroWorker.ts received INIT event from main thread.' });
    await initWorker(seplBuf, semoBuf, appOrigin);
    return;
  }

  if (type === 'INIT_FAIL') {
    self.postMessage({ type: 'ERROR', message: `Main thread fetch failed: ${error}` });
    return;
  }

  if (!isReady || !swe) {
    pendingWorkerQueue.push(event.data);
    self.postMessage({ type: 'PROGRESS', stage: 'QUEUED_CALCULATION', key, message: `Worker initializing, queued request [${key}]` });
    return;
  }

  await processWorkerQuery(event.data);
};
