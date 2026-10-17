import fs from 'fs';
import path from 'path';
import {
  drik_calc_ut,
  drik_get_ayanamsa_ut,
  calculateSolarTimesCore,
  calculateMoonTimesCore,
  calculatePanchangPositionsCore,
  findBoundaryCrossing,
  findNewMoonJd
} from '../dist/core/sanatan_jpl_bridge.js';

console.log('================================================================');
console.log('PHASE 4 AUDIT GATE: Panchang Root-Finder & Anga Verification');
console.log('Comparing Sanatan JPL Engine against Swiss Ephemeris Baseline');
console.log('================================================================\n');

const fixturePath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
if (!fs.existsSync(fixturePath)) {
  console.error(`Missing fixture file: ${fixturePath}`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const anchors = baseline.layer_a_anchors;

let totalEvaluations = 0;
let passedEvaluations = 0;

const tithiErrorsSec = [];
const naksErrorsSec = [];
const yogaErrorsSec = [];
const karanaErrorsSec = [];

let indexMismatches = 0;

console.log('1. Evaluating Panchang Angas across 12 Milestone Anchors (C1-C12):');
console.log('--------------------------------------------------------------------------------------------------');
console.log('Anchor'.padEnd(24) + 'Tithi Err (s)'.padStart(14) + 'Naks Err (s)'.padStart(14) + 'Yoga Err (s)'.padStart(14) + 'Karana Err (s)'.padStart(15) + 'Idx Match'.padStart(12));
console.log('--------------------------------------------------------------------------------------------------');

for (const [anchorKey, anchorData] of Object.entries(anchors)) {
  totalEvaluations++;
  const date = new Date(anchorData.date);
  const jdQuery = anchorData.jd_ut;
  const jdMidnight = Math.floor(jdQuery - 0.5) + 0.5;

  const refAngas = anchorData.panchang_angas;
  const pos = calculatePanchangPositionsCore(date);

  // 1. Tithi End Time
  const nextTithiTarget = (refAngas.tithi.index + 1) * 12;
  const computedTithiEndJd = findBoundaryCrossing(jdMidnight, 'tithi', nextTithiTarget);
  const tithiErrSec = Math.abs((computedTithiEndJd - refAngas.tithi.endJd) * 86400.0);
  tithiErrorsSec.push(tithiErrSec);

  // 2. Nakshatra End Time
  const nextNaksTarget = (refAngas.nakshatra.index + 1) * 13.333333333333334;
  const computedNaksEndJd = findBoundaryCrossing(jdMidnight, 'nakshatra', nextNaksTarget);
  const naksErrSec = Math.abs((computedNaksEndJd - refAngas.nakshatra.endJd) * 86400.0);
  naksErrorsSec.push(naksErrSec);

  // 3. Yoga End Time
  const nextYogaTarget = (refAngas.yoga.index + 1) * 13.333333333333334;
  const computedYogaEndJd = findBoundaryCrossing(jdMidnight, 'yoga', nextYogaTarget);
  const yogaErrSec = Math.abs((computedYogaEndJd - refAngas.yoga.endJd) * 86400.0);
  yogaErrorsSec.push(yogaErrSec);

  // 4. Karana End Time
  const nextKaranaTarget = (refAngas.karana.sec + 1) * 6;
  const computedKaranaEndJd = findBoundaryCrossing(jdMidnight, 'karana', nextKaranaTarget);
  const karanaErrSec = Math.abs((computedKaranaEndJd - refAngas.karana.endJd) * 86400.0);
  karanaErrorsSec.push(karanaErrSec);

  // Index Matches
  const tithiMatch = pos.tithiIdx === refAngas.tithi.index;
  const naksMatch = pos.naksIdx === refAngas.nakshatra.index;
  const yogaMatch = pos.yogaIdx === refAngas.yoga.index;
  const karanaMatch = pos.karanaTotalSec === refAngas.karana.sec;

  const allIndicesMatch = tithiMatch && naksMatch && yogaMatch && karanaMatch;
  if (!allIndicesMatch) {
    indexMismatches++;
  }

  const pass = (
    tithiErrSec <= 30.0 &&
    naksErrSec <= 30.0 &&
    yogaErrSec <= 30.0 &&
    karanaErrSec <= 30.0 &&
    allIndicesMatch
  );

  if (pass) {
    passedEvaluations++;
  }

  console.log(
    anchorKey.padEnd(24) +
    tithiErrSec.toFixed(2).padStart(14) +
    naksErrSec.toFixed(2).padStart(14) +
    yogaErrSec.toFixed(2).padStart(14) +
    karanaErrSec.toFixed(2).padStart(15) +
    (allIndicesMatch ? 'PASS ✓' : 'MISMATCH ✗').padStart(12)
  );
}

function stats(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  const mean = sum / arr.length;
  const max = Math.max(...arr);
  const sorted = [...arr].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || max;
  return { mean, max, p95 };
}

const tithiStats = stats(tithiErrorsSec);
const naksStats = stats(naksErrorsSec);
const yogaStats = stats(yogaErrorsSec);
const karanaStats = stats(karanaErrorsSec);

console.log('\n2. Aggregate Statistical Distribution:');
console.log('--------------------------------------------------------------------------------------------------');
console.log('Anga Parameter'.padEnd(24) + 'Mean Error'.padStart(14) + 'Max Error'.padStart(14) + 'P95 Error'.padStart(14) + 'Threshold'.padStart(14) + 'Status'.padStart(10));
console.log('--------------------------------------------------------------------------------------------------');

const printRow = (name, s, threshold) => {
  const ok = s.max <= threshold;
  console.log(
    name.padEnd(24) +
    `${s.mean.toFixed(2)}s`.padStart(14) +
    `${s.max.toFixed(2)}s`.padStart(14) +
    `${s.p95.toFixed(2)}s`.padStart(14) +
    `<=${threshold}s`.padStart(14) +
    (ok ? 'PASS ✓' : 'FAIL ✗').padStart(10)
  );
};

printRow('Tithi End-Time', tithiStats, 30.0);
printRow('Nakshatra End-Time', naksStats, 30.0);
printRow('Yoga End-Time', yogaStats, 30.0);
printRow('Karana End-Time', karanaStats, 30.0);

console.log('\n3. Adhik Maas Verification (2026-05-17 to 2026-06-15):');
const adhikTestDate = new Date('2026-05-25T00:00:00.000Z');
const adhikPos = calculatePanchangPositionsCore(adhikTestDate);
const nonAdhikTestDate = new Date('2026-10-18T00:00:00.000Z');
const nonAdhikPos = calculatePanchangPositionsCore(nonAdhikTestDate);

console.log(`- 2026-05-25 (Jyeshtha Adhik Maas period): isAdhik = ${adhikPos.isAdhik} (Expected: true) -> ${adhikPos.isAdhik === true ? 'PASS ✓' : 'FAIL ✗'}`);
console.log(`- 2026-10-18 (Standard Ashwin period): isAdhik = ${nonAdhikPos.isAdhik} (Expected: false) -> ${nonAdhikPos.isAdhik === false ? 'PASS ✓' : 'FAIL ✗'}`);

console.log('\n================================================================');
const allPass = (
  passedEvaluations === totalEvaluations &&
  indexMismatches === 0 &&
  adhikPos.isAdhik === true &&
  nonAdhikPos.isAdhik === false
);

if (allPass) {
  console.log('🎉 AUDIT GATE 4: PASSED (100% PARITY ON PANCHANG ANGAS & TIMING) 🎉');
  console.log('================================================================');
  process.exit(0);
} else {
  console.error('❌ AUDIT GATE 4: FAILED');
  console.log('================================================================');
  process.exit(1);
}
