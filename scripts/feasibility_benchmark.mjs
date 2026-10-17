import SwissEph from 'swisseph-wasm';
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

async function runBenchmark() {
  const swe = new SwissEph();
  await swe.initSwissEph();
  swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

  const testDates = [
    new Date('1956-03-21T00:00:00Z'),
    new Date('2000-01-01T12:00:00Z'),
    new Date('2026-10-18T00:00:00Z'),
    new Date('2026-11-08T12:30:00Z'),
    new Date('2027-04-14T00:30:00Z')
  ];

  console.log('========================================================================');
  console.log('FEASIBILITY BENCHMARK: Swiss Ephemeris vs astronomy-engine');
  console.log('========================================================================\n');

  const geocenter = new Astronomy.Observer(0, 0, 0);

  const planetStats = {};

  for (const date of testDates) {
    const jd_ut = swe.julday(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
    );

    const astroTime = Astronomy.MakeTime(date);
    const ayanamsaSwiss = swe.get_ayanamsa(jd_ut);
    const tilt = Astronomy.e_tilt(astroTime);

    // Saha 1956 Chitrapaksha:
    // T = (JD_TT - 2451545.0) / 36525.0
    const jd_tt = astroTime.tt + 2451545.0;
    const T = (jd_tt - 2451545.0) / 36525.0;
    const ayanamsaPoly = 23.8530556 + 1.39604167 * T + 0.00030861 * T * T;
    const ayanDelta = Math.abs(ayanamsaSwiss - ayanamsaPoly) * 3600;

    console.log(`\n======================================================`);
    console.log(`Date: ${date.toISOString()}`);
    console.log(`JD_UT: ${jd_ut.toFixed(4)} | JD_TT: ${jd_tt.toFixed(4)} | DeltaT: ${(astroTime.tt - astroTime.ut)*86400}s`);
    console.log(`Ayanamsa (Lahiri): Swiss=${ayanamsaSwiss.toFixed(6)}° | Poly=${ayanamsaPoly.toFixed(6)}° | Diff=${ayanDelta.toFixed(2)}"`);

    const bodies = [
      { name: 'Sun', sweId: swe.SE_SUN, astroBody: Astronomy.Body.Sun },
      { name: 'Moon', sweId: swe.SE_MOON, astroBody: Astronomy.Body.Moon },
      { name: 'Mercury', sweId: swe.SE_MERCURY, astroBody: Astronomy.Body.Mercury },
      { name: 'Venus', sweId: swe.SE_VENUS, astroBody: Astronomy.Body.Venus },
      { name: 'Mars', sweId: swe.SE_MARS, astroBody: Astronomy.Body.Mars },
      { name: 'Jupiter', sweId: swe.SE_JUPITER, astroBody: Astronomy.Body.Jupiter },
      { name: 'Saturn', sweId: swe.SE_SATURN, astroBody: Astronomy.Body.Saturn },
    ];

    for (const b of bodies) {
      if (!planetStats[b.name]) planetStats[b.name] = [];

      // Swiss Sidereal Longitude:
      const sweRes = swe.calc_ut(jd_ut, b.sweId, 2 | 256 | 65536);
      const sweSidLon = sweRes[0];
      const sweSpeed = sweRes[3];

      let astroSidLon = 0;
      if (b.astroBody === Astronomy.Body.Moon) {
        const ecl = Astronomy.EclipticGeoMoon(astroTime);
        astroSidLon = (ecl.elon - ayanamsaSwiss + 360) % 360;
      } else {
        const eq = Astronomy.Equator(b.astroBody, astroTime, geocenter, true, true);
        const ecl = equatorToEclipticOfDate(eq.ra, eq.dec, tilt.tobl);
        astroSidLon = (ecl.lambda - ayanamsaSwiss + 360) % 360;
      }

      let diffDeg = Math.abs(sweSidLon - astroSidLon);
      if (diffDeg > 180) diffDeg = 360 - diffDeg;
      const diffArcsec = diffDeg * 3600;
      planetStats[b.name].push(diffArcsec);

      console.log(`  ${b.name.padEnd(8)}: Swiss=${sweSidLon.toFixed(4)}° | Astro=${astroSidLon.toFixed(4)}° | Delta=${diffArcsec.toFixed(2)}" (${(diffArcsec/60).toFixed(2)}') | SweSpeed=${sweSpeed.toFixed(4)}°/d`);
    }

    // Nodes
    const sweMeanNode = swe.calc_ut(jd_ut, swe.SE_MEAN_NODE, 2 | 65536);
    const sweTrueNode = swe.calc_ut(jd_ut, swe.SE_TRUE_NODE, 2 | 65536);

    // Polynomial Mean Rahu:
    // Omega = 125.04455501 - 1934.1361849 * T + 0.0020762 * T^2 + T^3 / 467441.0
    let meanRahuTrop = 125.04455501 - 1934.1361849 * T + 0.0020762 * T * T + (T * T * T) / 467441.0;
    meanRahuTrop = (meanRahuTrop % 360 + 360) % 360;
    const meanRahuSid = (meanRahuTrop - ayanamsaSwiss + 360) % 360;
    let nodeDiff = Math.abs(sweMeanNode[0] - meanRahuSid);
    if (nodeDiff > 180) nodeDiff = 360 - nodeDiff;
    console.log(`  MeanRahu: Swiss=${sweMeanNode[0].toFixed(4)}° | Poly=${meanRahuSid.toFixed(4)}° | Diff=${(nodeDiff*3600).toFixed(2)}"`);
    console.log(`  TrueRahu: Swiss=${sweTrueNode[0].toFixed(4)}°`);
  }

  console.log('\n======================================================');
  console.log('SUMMARY OF PLANETARY POSITION DELTAS (Arcseconds):');
  console.log('======================================================');
  for (const [name, deltas] of Object.entries(planetStats)) {
    const max = Math.max(...deltas);
    const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    console.log(`  ${name.padEnd(8)}: Max = ${max.toFixed(2)}" (${(max/60).toFixed(2)}'), Avg = ${avg.toFixed(2)}" (${(avg/60).toFixed(2)}')`);
  }

  swe.close();
}

runBenchmark().catch(console.error);
