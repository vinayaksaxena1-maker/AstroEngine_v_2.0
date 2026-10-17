import fs from 'fs';
import path from 'path';
import {
  drik_calc_ut,
  drik_get_ayanamsa_ut,
  SE_SUN,
  SE_MOON,
  SE_MERCURY,
  SE_VENUS,
  SE_MARS,
  SE_JUPITER,
  SE_SATURN,
  SE_MEAN_NODE,
  SEFLG_SWIEPH,
  SEFLG_SPEED,
  SEFLG_SIDEREAL
} from '../dist/core/sanatan_jpl_bridge.js';

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx];
}

async function runAuditPhase2() {
  console.log('========================================================================');
  console.log('PHASE 2 AUDIT: sanatan_jpl_bridge.ts vs swiss_golden_baseline.json');
  console.log('========================================================================\n');

  const baselinePath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

  const bodies = [
    { id: SE_SUN, name: 'Sun', maxThreshold: 20.0 },
    { id: SE_MOON, name: 'Moon', maxThreshold: 20.0 },
    { id: SE_MERCURY, name: 'Mercury', maxThreshold: 35.0 },
    { id: SE_VENUS, name: 'Venus', maxThreshold: 35.0 },
    { id: SE_MARS, name: 'Mars', maxThreshold: 35.0 },
    { id: SE_JUPITER, name: 'Jupiter', maxThreshold: 35.0 },
    { id: SE_SATURN, name: 'Saturn', maxThreshold: 35.0 },
    { id: SE_MEAN_NODE, name: 'Mean_Rahu', maxThreshold: 1.0 }
  ];

  const errors = {
    ayanamsa: [],
    retrogradeMismatches: 0,
    totalRetrogradeChecks: 0
  };
  for (const b of bodies) {
    errors[b.name] = [];
  }

  function auditSnapshot(snap, label) {
    const jd_ut = snap.jd_ut;

    // 1. Ayanamsa
    const aya = drik_get_ayanamsa_ut(jd_ut);
    const ayaDiff = Math.abs(snap.ayanamsa_true - aya) * 3600;
    errors.ayanamsa.push(ayaDiff);

    // 2. Grahas
    for (const b of bodies) {
      const res = drik_calc_ut(jd_ut, b.id, SEFLG_SWIEPH | SEFLG_SPEED | SEFLG_SIDEREAL);
      const myLon = res[0];
      const mySpeed = res[3];

      const swissLon = snap.grahas[b.name].longitude;
      const swissSpeed = snap.grahas[b.name].speed;

      let lonDiff = Math.abs(swissLon - myLon);
      if (lonDiff > 180) lonDiff = 360 - lonDiff;
      errors[b.name].push(lonDiff * 3600);

      // Retrograde check with 0.005 deg/day deadband near stations
      errors.totalRetrogradeChecks++;
      if (Math.abs(swissSpeed) >= 0.005) {
        const swissRetro = swissSpeed < 0;
        const myRetro = mySpeed < 0;
        if (swissRetro !== myRetro) {
          console.error(`Retrograde mismatch on ${label} for ${b.name}: Swiss=${swissSpeed}, My=${mySpeed}`);
          errors.retrogradeMismatches++;
        }
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
  console.log('PHASE 2 EMPIRICAL ACCURACY AUDIT TABLE (84 Total Snapshots):');
  console.log('========================================================================');
  console.log('| Parameter                          | Samples | Mean Error | Max Error  | 95th Percentile | Status |');
  console.log('| :--------------------------------- | :------ | :--------- | :--------- | :-------------- | :----- |');

  function reportRow(name, data, threshold) {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const max = Math.max(...data);
    const p95 = percentile(data, 95);
    const passed = p95 <= threshold;
    const status = passed ? 'PASS ✓' : 'FAIL ✗';
    console.log(
      `| ${name.padEnd(34)} | ${n.toString().padStart(7)} | ${(mean.toFixed(2) + '"').padStart(10)} | ${(max.toFixed(2) + '"').padStart(10)} | ${(p95.toFixed(2) + '"').padStart(15)} | ${status.padStart(6)} |`
    );
    if (!passed) {
      throw new Error(`FAIL: ${name} exceeded threshold ${threshold}" (got P95=${p95.toFixed(2)}")`);
    }
  }

  reportRow('True Lahiri Ayanamsa', errors.ayanamsa, 1.0);
  for (const b of bodies) {
    reportRow(`${b.name} Sidereal Longitude`, errors[b.name], b.maxThreshold);
  }

  console.log('------------------------------------------------------------------------');
  console.log(`Retrograde Sign Check: ${errors.totalRetrogradeChecks} evaluations, Mismatches = ${errors.retrogradeMismatches}`);
  if (errors.retrogradeMismatches > 0) {
    throw new Error(`FAIL: ${errors.retrogradeMismatches} retrograde sign mismatches detected`);
  }
  console.log('✓ PASS: Retrograde / Direct sign matches 100%');
  console.log('========================================================================\n');
  console.log('🎉 AUDIT GATE 2 PASSED 100%!');
}

runAuditPhase2().catch(err => {
  console.error('Audit Phase 2 Failed:', err);
  process.exit(1);
});
