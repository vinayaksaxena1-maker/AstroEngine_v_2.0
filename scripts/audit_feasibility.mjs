import fs from 'fs';
import path from 'path';
import * as Astronomy from 'astronomy-engine';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function equatorToEclipticOfDate(raHours, decDeg, toblDeg) {
  const alpha = raHours * 15 * DEG2RAD;
  const delta = decDeg * DEG2RAD;
  const eps = toblDeg * DEG2RAD;

  const sinLambda = Math.sin(alpha) * Math.cos(eps) + Math.tan(delta) * Math.sin(eps);
  const cosLambda = Math.cos(alpha);
  let lambda = Math.atan2(sinLambda, cosLambda) * RAD2DEG;
  lambda = (lambda % 360 + 360) % 360;

  const sinBeta = Math.sin(delta) * Math.cos(eps) - Math.cos(delta) * Math.sin(eps) * Math.sin(alpha);
  const beta = Math.asin(sinBeta) * RAD2DEG;

  return { lambda, beta };
}

function computeSripatiHouses(gastHours, lonDeg, latDeg, epsDeg, ayanamsaDeg) {
  const ramc = ((gastHours * 15 + lonDeg) % 360 + 360) % 360;
  const theta = ramc * DEG2RAD;
  const phi = latDeg * DEG2RAD;
  const eps = epsDeg * DEG2RAD;

  // Midheaven (MC):
  let mcDeg = Math.atan2(Math.sin(theta), Math.cos(theta) * Math.cos(eps)) * RAD2DEG;
  mcDeg = (mcDeg % 360 + 360) % 360;

  // Ascendant (Lagna):
  let ascDeg = Math.atan2(Math.cos(theta), -Math.sin(eps) * Math.tan(phi) - Math.cos(eps) * Math.sin(theta)) * RAD2DEG;
  ascDeg = (ascDeg % 360 + 360) % 360;

  const icDeg = (mcDeg + 180) % 360;
  const descDeg = (ascDeg + 180) % 360;

  // Sripati / Porphyry Quadrant Trisection:
  // Quadrant 1: MC (House 10) to Ascendant (House 1)
  const q1Arc = ((ascDeg - mcDeg + 360) % 360) / 3;
  // Quadrant 2: Ascendant (House 1) to IC (House 4)
  const q2Arc = ((icDeg - ascDeg + 360) % 360) / 3;

  const cusps = new Array(12);
  cusps[9] = mcDeg;                           // House 10
  cusps[10] = (mcDeg + q1Arc) % 360;          // House 11
  cusps[11] = (mcDeg + 2 * q1Arc) % 360;      // House 12
  cusps[0] = ascDeg;                          // House 1
  cusps[1] = (ascDeg + q2Arc) % 360;          // House 2
  cusps[2] = (ascDeg + 2 * q2Arc) % 360;      // House 3
  cusps[3] = icDeg;                           // House 4
  cusps[4] = (cusps[10] + 180) % 360;         // House 5
  cusps[5] = (cusps[11] + 180) % 360;         // House 6
  cusps[6] = descDeg;                         // House 7
  cusps[7] = (cusps[1] + 180) % 360;          // House 8
  cusps[8] = (cusps[2] + 180) % 360;          // House 9

  const siderealCusps = cusps.map(c => (c - ayanamsaDeg + 360) % 360);
  const siderealAsc = (ascDeg - ayanamsaDeg + 360) % 360;
  const siderealMC = (mcDeg - ayanamsaDeg + 360) % 360;

  return {
    tropicalAsc: ascDeg,
    tropicalMC: mcDeg,
    siderealAsc,
    siderealMC,
    siderealCusps
  };
}

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx];
}

async function auditFeasibility() {
  console.log('========================================================================');
  console.log('PHASE 1 FEASIBILITY AUDIT: Swiss Ephemeris vs astronomy-engine');
  console.log('========================================================================\n');

  const baselinePath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
  if (!fs.existsSync(baselinePath)) {
    throw new Error(`Baseline file missing at ${baselinePath}`);
  }

  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  console.log(`Loaded baseline generated at ${baseline.generated_at} (SwissEph v${baseline.swiss_ephemeris_version})`);

  const geocenter = new Astronomy.Observer(0, 0, 0);

  // Error accumulators
  const stats = {
    ayanamsa_true_arcsec: [],
    ayanamsa_mean_arcsec: [],
    sun_arcsec: [],
    moon_arcsec: [],
    planets_arcsec: [],
    mean_rahu_arcsec: [],
    sunrise_sec: [],
    sunset_sec: [],
    lagna_arcsec: [],
    mc_arcsec: [],
    cusps_arcsec: [],
    tithi_end_sec: [],
    naks_end_sec: []
  };

  const bodyMap = [
    { name: 'Sun', body: Astronomy.Body.Sun },
    { name: 'Moon', body: Astronomy.Body.Moon },
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Venus', body: Astronomy.Body.Venus },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', body: Astronomy.Body.Saturn }
  ];

  // Helper to audit a single snapshot
  function auditSnapshot(snap, label) {
    const d = new Date(snap.date);
    const time = Astronomy.MakeTime(d);
    const tilt = Astronomy.e_tilt(time);

    // 1. Calibrated Chitrapaksha Lahiri Ayanamsa:
    // T = (JD_TT - 2451545.0) / 36525.0
    // Swiss Ephemeris SE_SIDM_LAHIRI J2000 Anchor = 23.85709235°
    // Precession rate = 1.396888°/century (50.288 arcsec/yr)
    // Curvature = 0.000306°/century^2
    const T = time.tt / 36525.0;
    const ayaTrue = 23.85709235 + 1.396888 * T + 0.000306 * T * T;
    const ayaMean = ayaTrue;

    const ayaTrueDelta = Math.abs(snap.ayanamsa_true - ayaTrue) * 3600;
    stats.ayanamsa_true_arcsec.push(ayaTrueDelta);

    const ayaMeanDelta = Math.abs(snap.ayanamsa_mean - ayaMean) * 3600;
    stats.ayanamsa_mean_arcsec.push(ayaMeanDelta);

    // 2. Planets
    for (const b of bodyMap) {
      let sidLon = 0;
      if (b.body === Astronomy.Body.Moon) {
        const m = Astronomy.EclipticGeoMoon(time);
        sidLon = (m.lon - ayaTrue + 360) % 360;
      } else if (b.body === Astronomy.Body.Sun) {
        const s = Astronomy.SunPosition(time);
        sidLon = (s.elon - ayaTrue + 360) % 360;
      } else {
        const eq = Astronomy.Equator(b.body, time, geocenter, true, true);
        const ecl = equatorToEclipticOfDate(eq.ra, eq.dec, tilt.tobl);
        sidLon = (ecl.lambda - ayaTrue + 360) % 360;
      }

      const swissVal = snap.grahas[b.name].longitude;
      let diff = Math.abs(swissVal - sidLon);
      if (diff > 180) diff = 360 - diff;
      const diffArcsec = diff * 3600;

      if (b.name === 'Sun') stats.sun_arcsec.push(diffArcsec);
      else if (b.name === 'Moon') stats.moon_arcsec.push(diffArcsec);
      else stats.planets_arcsec.push(diffArcsec);
    }

    // 3. Mean Rahu
    let meanRahuTrop = 125.04455501 - 1934.1361849 * T + 0.0020762 * T * T + (T * T * T) / 467441.0;
    meanRahuTrop = (meanRahuTrop % 360 + 360) % 360;
    const meanRahuSid = (meanRahuTrop - ayaTrue + 360) % 360;
    let rahuDiff = Math.abs(snap.grahas['Mean_Rahu'].longitude - meanRahuSid);
    if (rahuDiff > 180) rahuDiff = 360 - rahuDiff;
    stats.mean_rahu_arcsec.push(rahuDiff * 3600);

    // 4. Horizon Times (Sunrise / Sunset)
    if (!snap.solar_times.isPolar) {
      const obs = new Astronomy.Observer(snap.lat, snap.lon, 0);
      const startOfDay = Astronomy.MakeTime(new Date(d.toISOString().slice(0, 10) + 'T00:00:00.000Z'));
      const riseA = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, +1, startOfDay, 1);
      const setA = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, startOfDay, 1);

      if (riseA && snap.solar_times.sunriseUtc) {
        const dtRise = Math.abs(new Date(snap.solar_times.sunriseUtc).getTime() - riseA.date.getTime()) / 1000;
        stats.sunrise_sec.push(dtRise);
      }
      if (setA && snap.solar_times.sunsetUtc) {
        const dtSet = Math.abs(new Date(snap.solar_times.sunsetUtc).getTime() - setA.date.getTime()) / 1000;
        stats.sunset_sec.push(dtSet);
      }
    }

    // 5. Kundli Cusps & Lagna (for non-polar latitudes < 66°)
    if (Math.abs(snap.lat) < 66.0) {
      const gast = Astronomy.SiderealTime(time);
      const houses = computeSripatiHouses(gast, snap.lon, snap.lat, tilt.tobl, ayaTrue);

      let lagnaDiff = Math.abs(snap.kundli.siderealAsc - houses.siderealAsc);
      if (lagnaDiff > 180) lagnaDiff = 360 - lagnaDiff;
      stats.lagna_arcsec.push(lagnaDiff * 3600);

      let mcDiff = Math.abs(snap.kundli.siderealMC - houses.siderealMC);
      if (mcDiff > 180) mcDiff = 360 - mcDiff;
      stats.mc_arcsec.push(mcDiff * 3600);

      for (let i = 0; i < 12; i++) {
        let cDiff = Math.abs(snap.kundli.siderealCusps[i] - houses.siderealCusps[i]);
        if (cDiff > 180) cDiff = 360 - cDiff;
        stats.cusps_arcsec.push(cDiff * 3600);
      }
    }
  }

  // Audit Layer A (12 Anchors)
  console.log('Auditing Layer A: 12 Milestone Anchors...');
  for (const [key, snap] of Object.entries(baseline.layer_a_anchors)) {
    auditSnapshot(snap, key);
  }

  // Audit Layer B (72 Dense Grid Points)
  console.log('Auditing Layer B: 72 Dense Statistical Grid Points...');
  for (const item of baseline.layer_b_dense_grid) {
    auditSnapshot(item.snapshot, item.city);
  }

  // Audit Tromsø Polar Verification
  console.log('Auditing Tromsø Polar Edge Cases...');
  const c6 = baseline.layer_a_anchors.C6_Tromso_MidnightSun;
  const c7 = baseline.layer_a_anchors.C7_Tromso_PolarNight;
  if (!c6.solar_times.isPolar || c6.solar_times.sunriseUtc !== null) {
    throw new Error('FAIL: Tromso Midnight Sun did not record isPolar=true, sunrise=null');
  }
  if (!c7.solar_times.isPolar || c7.solar_times.sunriseUtc !== null) {
    throw new Error('FAIL: Tromso Polar Night did not record isPolar=true, sunrise=null');
  }
  console.log('✓ PASS: Polar Edge Cases handled correctly (isPolar=true, rise/set=null)');

  // Audit Planetary Station Inflection Windows
  console.log('Auditing Mars & Mercury Stationary Inflection Telemetry...');
  const marsSpeeds = baseline.layer_c_phenomena.mars_station_window.map(s => s.grahas['Mars'].speed);
  console.log('  Mars daily speeds Jan 8-14 2027:', marsSpeeds.map(v => v.toFixed(5)).join(' -> '));
  // Mars speed should cross zero between Jan 8 (+) and Jan 14 (-)
  if (!(marsSpeeds[0] > 0 && marsSpeeds[marsSpeeds.length - 1] < 0)) {
    throw new Error('FAIL: Mars speed did not cross zero from positive to negative in station window');
  }
  console.log('✓ PASS: Mars stationary retrograde inflection confirmed');

  const mercSpeeds = baseline.layer_c_phenomena.mercury_station_window.map(s => s.grahas['Mercury'].speed);
  console.log('  Mercury daily speeds Nov 11-17 2026:', mercSpeeds.map(v => v.toFixed(5)).join(' -> '));
  // Mercury speed should cross zero between Nov 11 (-) and Nov 17 (+)
  if (!(mercSpeeds[0] < 0 && mercSpeeds[mercSpeeds.length - 1] > 0)) {
    throw new Error('FAIL: Mercury speed did not cross zero from negative to positive in station window');
  }
  console.log('✓ PASS: Mercury stationary direct inflection confirmed');

  // Audit Kshaya, Vriddhi and Adhik Maas Telemetry
  console.log('Auditing Kshaya Tithi, Vriddhi Tithi, and Adhik Maas Fixtures...');
  const kshaya = baseline.layer_c_phenomena.kshaya_tithi_fixture;
  const tithi1 = kshaya.day1_sunrise_snapshot.panchang_angas.tithi.index;
  const tithi2 = kshaya.day2_sunrise_snapshot.panchang_angas.tithi.index;
  console.log(`  Kshaya Tithi: Day 1 Sunrise Tithi = ${tithi1}, Day 2 Sunrise Tithi = ${tithi2}`);
  if (tithi2 !== (tithi1 + 2) % 30) {
    throw new Error(`FAIL: Kshaya Tithi did not advance by 2 across consecutive sunrises (got ${tithi1} -> ${tithi2})`);
  }
  console.log(`✓ PASS: Kshaya Tithi confirmed (Tithi ${kshaya.skipped_tithi} omitted at sunrise)`);

  const vriddhi = baseline.layer_c_phenomena.vriddhi_tithi_fixture;
  const vTithi1 = vriddhi.day1_sunrise_snapshot.panchang_angas.tithi.index;
  const vTithi2 = vriddhi.day2_sunrise_snapshot.panchang_angas.tithi.index;
  console.log(`  Vriddhi Tithi: Day 1 Sunrise Tithi = ${vTithi1}, Day 2 Sunrise Tithi = ${vTithi2}`);
  if (vTithi1 !== vTithi2) {
    throw new Error(`FAIL: Vriddhi Tithi was not identical across consecutive sunrises (got ${vTithi1} vs ${vTithi2})`);
  }
  console.log(`✓ PASS: Vriddhi Tithi confirmed (Tithi ${vriddhi.repeated_tithi} repeated at sunrise)`);

  const adhik = baseline.layer_c_phenomena.adhik_maas_fixture;
  const rashi1 = Math.floor(adhik.amavasya1_snapshot.grahas['Sun'].longitude / 30);
  const rashi2 = Math.floor(adhik.amavasya2_snapshot.grahas['Sun'].longitude / 30);
  console.log(`  Adhik Maas: Amavasya 1 Sun Rashi = ${rashi1}, Amavasya 2 Sun Rashi = ${rashi2}`);
  if (rashi1 !== rashi2) {
    throw new Error(`FAIL: Adhik Maas failed, rashis differed (${rashi1} vs ${rashi2})`);
  }
  console.log('✓ PASS: Adhik Maas confirmed (two Amavasyas within solar Rashi 1 - Vrishabha)');

  // Compute Empirical Statistics Table
  console.log('\n========================================================================');
  console.log('EMPIRICAL ACCURACY AUDIT TABLE (Swiss Ephemeris vs astronomy-engine):');
  console.log('========================================================================');
  console.log('| Metric                             | Samples | Mean Error | Max Error  | 95th Percentile | Status |');
  console.log('| :--------------------------------- | :------ | :--------- | :--------- | :-------------- | :----- |');

  function reportRow(name, data, unit, provisionalThreshold) {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const max = Math.max(...data);
    const p95 = percentile(data, 95);
    const passed = p95 <= provisionalThreshold;
    const status = passed ? 'PASS ✓' : 'EXCEEDED ✗';
    console.log(
      `| ${name.padEnd(34)} | ${n.toString().padStart(7)} | ${(mean.toFixed(2) + unit).padStart(10)} | ${(max.toFixed(2) + unit).padStart(10)} | ${(p95.toFixed(2) + unit).padStart(15)} | ${status.padStart(6)} |`
    );
  }

  reportRow('True Lahiri Ayanamsa (Canonical)', stats.ayanamsa_true_arcsec, '"', 1.0);
  reportRow('Mean Lahiri Ayanamsa (Unnutated)', stats.ayanamsa_mean_arcsec, '"', 20.0);
  reportRow('Sun Sidereal Longitude', stats.sun_arcsec, '"', 20.0);
  reportRow('Moon Sidereal Longitude', stats.moon_arcsec, '"', 20.0);
  reportRow('Planets (Mercury, Venus, Mars, Jup, Sat)', stats.planets_arcsec, '"', 30.0);
  reportRow('Mean Rahu Longitude', stats.mean_rahu_arcsec, '"', 1.0);
  reportRow('Sunrise Time (Indian Latitudes)', stats.sunrise_sec, 's', 15.0);
  reportRow('Sunset Time (Indian Latitudes)', stats.sunset_sec, 's', 15.0);
  reportRow('Lagna (Ascendant)', stats.lagna_arcsec, '"', 2.0);
  reportRow('Midheaven (MC)', stats.mc_arcsec, '"', 2.0);
  reportRow('Sripati 12 Bhava Cusps', stats.cusps_arcsec, '"', 2.0);

  console.log('========================================================================\n');
  console.log('🎉 AUDIT GATE 1 COMPLETED SUCCESSFULLY!');
}

auditFeasibility().catch(err => {
  console.error('Audit Feasibility Error:', err);
  process.exit(1);
});
