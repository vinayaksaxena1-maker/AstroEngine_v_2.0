import SwissEph from 'swisseph-wasm';

let swe: any = null;
let isReady = false;

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

function jdToLocalMinutes(jd: number, offsetHours: number = 5.5): number {
  const utHours = (jd - Math.floor(jd) - 0.5) * 24;
  const localHours = ((utHours + offsetHours) % 24 + 24) % 24;
  return localHours * 60;
}

function formatRawMin(m: number): string {
  let hrs = Math.floor(m / 60);
  let mins = Math.floor(m % 60);
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

// ---------------------------------------------------------------------------
// Rise / Set calculation helper
// ---------------------------------------------------------------------------
function getRiseTrans(swe: any, jd: number, planet: number, lon: number, lat: number, alt: number, isRise: boolean): number {
  const flags = isRise ? 1 : 2; // SE_CALC_RISE = 1, SE_CALC_SET = 2
  // Strictly use Swiss Ephemeris (2 = SEFLG_SWIEPH). No Moshier fallback.
  const res = swe.rise_trans(jd, planet, lon, lat, alt, flags | 2);
  if (res && res.length > 0) return res[0];
  throw new Error('Rise/trans calculation failed or returned empty.');
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

  // Maximum 5 iterations of Newton's method for rapid convergence
  for (let iter = 0; iter < 5; iter++) {
    const sun = swe.calc_ut(jd, 0, ephFlag | 256); // 256 = SEFLG_SPEED
    const moon = swe.calc_ut(jd, 1, ephFlag | 256);
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
    // Normalize angular difference to shortest arc [-180, 180]
    err = (err + 180) % 360 - 180;

    if (Math.abs(err) < 0.0001) { // Error under 1 second of time
      return jd;
    }

    jd += err / currentSpeed;
  }
  return jd;
}

// ---------------------------------------------------------------------------
// Worker initialization
// ---------------------------------------------------------------------------
async function initWorker(origin: string) {
  try {
    const [seplRes, semoRes] = await Promise.all([
      fetch(`${origin}/ephe/sepl_18.se1`),
      fetch(`${origin}/ephe/semo_18.se1`)
    ]);

    if (!seplRes.ok || !semoRes.ok) {
      throw new Error(`Failed to fetch ephemeris files: sepl_18.se1 (${seplRes.status}), semo_18.se1 (${semoRes.status})`);
    }

    const [seplBuf, semoBuf] = await Promise.all([
      seplRes.arrayBuffer(),
      semoRes.arrayBuffer()
    ]);

    swe = new SwissEph();
    await swe.initSwissEph();

    try {
      swe.SweModule.FS.mkdir('/sweph');
    } catch (e) {
      // Ignore if exists
    }

    swe.SweModule.FS.writeFile('/sweph/sepl_18.se1', new Uint8Array(seplBuf));
    swe.SweModule.FS.writeFile('/sweph/semo_18.se1', new Uint8Array(semoBuf));

    isReady = true;
    self.postMessage({ type: 'READY' });
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', message: error.message || String(error) });
  }
}

// ---------------------------------------------------------------------------
// Worker Message Handler
// ---------------------------------------------------------------------------
self.onmessage = async (event: MessageEvent) => {
  const { type, key, origin, lat, lon, date } = event.data;

  if (type === 'INIT') {
    await initWorker(origin);
    return;
  }

  if (!isReady || !swe) {
    self.postMessage({ type: 'ERROR', message: 'Engine not ready' });
    return;
  }

  const parsedDate = new Date(date);
  const today0h = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0));
  const jdMidnight = dateToJulianDay(today0h);

  try {
    if (type === 'CALCULATE_SOLAR') {
      const sunriseJd = getRiseTrans(swe, jdMidnight, 0, lon, lat, 0, true);
      const sunsetJd = getRiseTrans(swe, jdMidnight, 0, lon, lat, 0, false);

      const sunriseRaw = jdToLocalMinutes(sunriseJd);
      const sunsetRaw = jdToLocalMinutes(sunsetJd);

      self.postMessage({
        type: 'RESULT',
        key,
        data: {
          sunrise: formatRawMin(sunriseRaw),
          sunset: formatRawMin(sunsetRaw),
          sunriseRaw,
          sunsetRaw
        }
      });
      return;
    }

    if (type === 'CALCULATE_MOON') {
      const moonriseJd = getRiseTrans(swe, jdMidnight, 1, lon, lat, 0, true);
      const moonsetJd = getRiseTrans(swe, jdMidnight, 1, lon, lat, 0, false);

      const moonriseRaw = jdToLocalMinutes(moonriseJd);
      const moonsetRaw = jdToLocalMinutes(moonsetJd);

      self.postMessage({
        type: 'RESULT',
        key,
        data: {
          moonrise: formatRawMin(moonriseRaw),
          moonset: formatRawMin(moonsetRaw),
          moonriseRaw,
          moonsetRaw
        }
      });
      return;
    }

    if (type === 'CALCULATE_COORDINATES') {
      // 0 = SE_SUN, 1 = SE_MOON, 2 = SEFLG_SWIEPH, 256 = SEFLG_SPEED
      const sunPos = swe.calc_ut(jdMidnight, 0, 2 | 256);
      const moonPos = swe.calc_ut(jdMidnight, 1, 2 | 256);
      const ayanamsa = swe.get_ayanamsa(jdMidnight);

      const sunLon = sunPos[0];
      const moonLon = moonPos[0];

      const sunSidereal = (sunLon - ayanamsa + 360) % 360;
      const moonSidereal = (moonLon - ayanamsa + 360) % 360;

      // 1. Tithi Index & Crossover Solver
      const diffNorm = (moonSidereal - sunSidereal + 360) % 360;
      let tithiIdx = Math.floor(diffNorm / 12);
      if (tithiIdx < 0) tithiIdx += 30;
      if (tithiIdx >= 30) tithiIdx = 29;
      const tithiPercent = (diffNorm % 12) / 12;
      const tithiPassedHours = tithiPercent * 23.6;

      const nextTithiTarget = (Math.floor(diffNorm / 12) + 1) * 12;
      const tithiCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'tithi', nextTithiTarget, 2);
      const tithiRemainingHours = (tithiCrossingJd - jdMidnight) * 24;

      // 2. Nakshatra Index & Crossover Solver
      let naksIdx = Math.floor(moonSidereal / 13.333333333333334);
      if (naksIdx < 0) naksIdx += 27;
      if (naksIdx >= 27) naksIdx = 26;
      const naksPercent = (moonSidereal % 13.333333333333334) / 13.333333333333334;

      const nextNaksTarget = (Math.floor(moonSidereal / 13.333333333333334) + 1) * 13.333333333333334;
      const naksCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'nakshatra', nextNaksTarget, 2);
      const naksRemainingHours = (naksCrossingJd - jdMidnight) * 24;

      // 3. Yoga Index & Crossover Solver
      const yogaLon = (moonSidereal + sunSidereal) % 360;
      let yogaIdx = Math.floor(yogaLon / 13.333333333333334);
      if (yogaIdx < 0) yogaIdx += 27;
      if (yogaIdx >= 27) yogaIdx = 26;
      const yogaPercent = (yogaLon % 13.333333333333334) / 13.333333333333334;

      const nextYogaTarget = (Math.floor(yogaLon / 13.333333333333334) + 1) * 13.333333333333334;
      const yogaCrossingJd = findBoundaryCrossing(swe, jdMidnight, 'yoga', nextYogaTarget, 2);
      const yogaRemainingHours = (yogaCrossingJd - jdMidnight) * 24;

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
      const karanaRemainingHours = (karanaCrossingJd - jdMidnight) * 24;

      // 5. Month Index derivation
      const daysSinceNewMoon = diffNorm / 12.190749;
      const sunLonAtNewMoon = (sunSidereal - daysSinceNewMoon + 360) % 360;
      const monthIdx = Math.floor(sunLonAtNewMoon / 30);

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
          diffDays: 0
        }
      });
      return;
    }
  } catch (err: any) {
    self.postMessage({ type: 'ERROR', message: err.message || String(err) });
  }
};
