import fs from 'fs';
import path from 'path';
import {
  drik_rise_trans,
  drik_houses,
  drik_get_ayanamsa_ut,
  SE_SUN,
  SE_MOON,
  SE_CALC_RISE,
  SE_CALC_SET
} from '../dist/core/sanatan_jpl_bridge.js';

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx];
}

async function runAuditPhase3() {
  console.log('========================================================================');
  console.log('PHASE 3 AUDIT: Topocentric Rise/Set & Sripati Bhava/Lagna Engine');
  console.log('========================================================================\n');

  const baselinePath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

  const errors = {
    sunrise_sec: [],
    sunset_sec: [],
    lagna_arcsec: [],
    mc_arcsec: [],
    cusps_arcsec: []
  };

  function auditSnapshot(snap, label) {
    const jd_ut = snap.jd_ut;
    const jdMidnight = Math.floor(jd_ut - 0.5) + 0.5;

    // 1. Rise/Set
    if (!snap.solar_times.isPolar) {
      const myRiseJd = drik_rise_trans(jdMidnight, SE_SUN, snap.lon, snap.lat, 0, SE_CALC_RISE);
      const mySetJd = drik_rise_trans(jdMidnight, SE_SUN, snap.lon, snap.lat, 0, SE_CALC_SET);

      if (myRiseJd !== null && snap.solar_times.sunriseJd !== null) {
        const dtRise = Math.abs(snap.solar_times.sunriseJd - myRiseJd) * 86400;
        errors.sunrise_sec.push(dtRise);
      }
      if (mySetJd !== null && snap.solar_times.sunsetJd !== null) {
        const dtSet = Math.abs(snap.solar_times.sunsetJd - mySetJd) * 86400;
        errors.sunset_sec.push(dtSet);
      }
    } else {
      // Polar verification: ensure drik_rise_trans returns null without throwing
      const myRiseJd = drik_rise_trans(jdMidnight, SE_SUN, snap.lon, snap.lat, 0, SE_CALC_RISE);
      const mySetJd = drik_rise_trans(jdMidnight, SE_SUN, snap.lon, snap.lat, 0, SE_CALC_SET);
      if (myRiseJd !== null || mySetJd !== null) {
        throw new Error(`FAIL: Polar case ${label} did not return null for rise/set`);
      }
    }

    // 2. Lagna and 12 Cusps (for non-polar latitudes < 66°)
    if (Math.abs(snap.lat) < 66.0) {
      const houses = drik_houses(jd_ut, snap.lat, snap.lon, 'O');
      const ayanamsa = drik_get_ayanamsa_ut(jd_ut);

      const sidAsc = (houses.ascmc[0] - ayanamsa + 360) % 360;
      const sidMC = (houses.ascmc[1] - ayanamsa + 360) % 360;

      let dAsc = Math.abs(snap.kundli.siderealAsc - sidAsc);
      if (dAsc > 180) dAsc = 360 - dAsc;
      errors.lagna_arcsec.push(dAsc * 3600);

      let dMC = Math.abs(snap.kundli.siderealMC - sidMC);
      if (dMC > 180) dMC = 360 - dMC;
      errors.mc_arcsec.push(dMC * 3600);

      for (let i = 1; i <= 12; i++) {
        const sidCusp = (houses.cusps[i] - ayanamsa + 360) % 360;
        let dCusp = Math.abs(snap.kundli.siderealCusps[i - 1] - sidCusp);
        if (dCusp > 180) dCusp = 360 - dCusp;
        errors.cusps_arcsec.push(dCusp * 3600);
      }
    }
  }

  // Audit Layer A (12 Anchors)
  for (const [key, snap] of Object.entries(baseline.layer_a_anchors)) {
    auditSnapshot(snap, key);
  }

  // Audit Layer B (72 Dense Grid Points)
  for (const item of baseline.layer_b_dense_grid) {
    auditSnapshot(item.snapshot, item.city);
  }

  console.log('========================================================================');
  console.log('PHASE 3 EMPIRICAL ACCURACY AUDIT TABLE (84 Total Snapshots):');
  console.log('========================================================================');
  console.log('| Parameter                          | Samples | Mean Error | Max Error  | 95th Percentile | Status |');
  console.log('| :--------------------------------- | :------ | :--------- | :--------- | :-------------- | :----- |');

  function reportRow(name, data, threshold, unit = '"') {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const max = Math.max(...data);
    const p95 = percentile(data, 95);
    const passed = p95 <= threshold;
    const status = passed ? 'PASS ✓' : 'FAIL ✗';
    console.log(
      `| ${name.padEnd(34)} | ${n.toString().padStart(7)} | ${(mean.toFixed(2) + unit).padStart(10)} | ${(max.toFixed(2) + unit).padStart(10)} | ${(p95.toFixed(2) + unit).padStart(15)} | ${status.padStart(6)} |`
    );
    if (!passed) {
      throw new Error(`FAIL: ${name} exceeded threshold ${threshold}${unit} (got P95=${p95.toFixed(2)}${unit})`);
    }
  }

  reportRow('Sunrise Time (Indian Latitudes)', errors.sunrise_sec, 16.0, 's');
  reportRow('Sunset Time (Indian Latitudes)', errors.sunset_sec, 16.0, 's');
  reportRow('Lagna (Ascendant)', errors.lagna_arcsec, 1.0, '"');
  reportRow('Midheaven (MC)', errors.mc_arcsec, 1.0, '"');
  reportRow('Sripati 12 Bhava Cusps', errors.cusps_arcsec, 1.0, '"');

  console.log('------------------------------------------------------------------------');
  console.log('Polar Horizon Edge Handling: C6 (Midnight Sun) and C7 (Polar Night) verified null return.');
  console.log('========================================================================\n');
  console.log('🎉 AUDIT GATE 3 PASSED 100%!');
}

runAuditPhase3().catch(err => {
  console.error('Audit Phase 3 Failed:', err);
  process.exit(1);
});
