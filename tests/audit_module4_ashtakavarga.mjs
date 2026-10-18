/**
 * MAIN AUDIT GATE 4: Ashtakavarga Engine Deep Audit
 *
 * Verifies:
 * 1. BAV Invariants: Sun=48, Moon=49, Mars=39, Mercury=54, Jupiter=56, Venus=52, Saturn=39.
 * 2. SAV Invariant: Sum of 12 signs in SAV == 337 across all 10 benchmark horoscopes.
 * 3. Trikona Shodhana reduction rules under all boundary conditions.
 * 4. Ekadhipatya Shodhana under all occupation and dot disparity conditions.
 * 5. Shodhya Pinda (Rashi Pinda, Graha Pinda, Shodhya Pinda) validity & Kakshya transit triggers.
 */

import { calculateNatalChart } from '../dist/kundli/houseCusps.js';
import {
  calculateAshtakavarga,
  applyTrikonaShodhana,
  applyEkadhipatyaShodhana,
  calculateShodhyaPinda,
  evaluateKakshyaTransit,
  EXPECTED_BAV_TOTALS,
  ASHTAKAVARGA_GRAHAS,
  KAKSHYA_LORDS
} from '../dist/ashtakavarga/ashtakavargaEngine.js';

let passedChecks = 0;
let failedChecks = 0;
const errors = [];

function assert(condition, message) {
  if (condition) {
    passedChecks++;
  } else {
    failedChecks++;
    errors.push(message);
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('  MAIN AUDIT GATE 4: ASHTAKAVARGA & SHODHANA DEEP AUDIT');
console.log('================================================================\n');

// 10 Diverse Benchmark Horoscopes
const benchmarkCharts = [
  { name: 'Varanasi 2026 Normal', date: new Date('2026-04-15T06:30:00Z'), lat: 25.3176, lon: 82.9739 },
  { name: 'Delhi 1985 Classic', date: new Date('1985-11-20T14:15:00Z'), lat: 28.6139, lon: 77.2090 },
  { name: 'London 1999 Solar Eclipse', date: new Date('1999-08-11T11:03:00Z'), lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo 2000 Equinox', date: new Date('2000-03-20T07:35:00Z'), lat: 35.6762, lon: 139.6503 },
  { name: 'Ujjain 2024 Makar Sankranti', date: new Date('2024-01-15T02:45:00Z'), lat: 23.1765, lon: 75.7885 },
  { name: 'Mumbai 1975 Midnight', date: new Date('1975-06-25T18:30:00Z'), lat: 18.9220, lon: 72.8347 },
  { name: 'Sydney 2012 Solstice', date: new Date('2012-12-21T11:12:00Z'), lat: -33.8688, lon: 151.2093 },
  { name: 'Kolkata 1947 Independence', date: new Date('1947-08-15T00:00:00Z'), lat: 22.5726, lon: 88.3639 },
  { name: 'New York 2030 Leap Year', date: new Date('2030-02-29T10:00:00Z'), lat: 40.7128, lon: -74.0060 },
  { name: 'Equator Singapore 2021', date: new Date('2021-09-23T12:00:00Z'), lat: 1.3521, lon: 103.8198 }
];

console.log('>>> SUB-AUDIT 4.1 & 4.2: BAV Classical Totals & SAV 337 Invariant across 10 Horoscopes');
for (const tc of benchmarkCharts) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const av = calculateAshtakavarga(chart);

  // Check SAV 337 Invariant
  assert(av.isSAV337InvariantMet, `${tc.name}: SAV total must be exactly 337, got ${av.totalSAVPoints}`);
  assert(av.sav.totalPoints === 337, `${tc.name}: sav.totalPoints === 337`);

  // Verify all 7 BAV totals match classical values
  for (const g of ASHTAKAVARGA_GRAHAS) {
    const expected = EXPECTED_BAV_TOTALS[g];
    const actual = av.bav[g].totalPoints;
    assert(actual === expected, `${tc.name} ${g} BAV total must be ${expected}, got ${actual}`);
    
    // Ensure 12 signs bindus sum to expected
    const signSum = av.bav[g].bindusBySign.reduce((a, b) => a + b, 0);
    assert(signSum === expected, `${tc.name} ${g} BAV sign array sum must be ${expected}, got ${signSum}`);

    // Ensure 12 houses bindus sum to expected
    const houseSum = av.bav[g].bindusByHouse.reduce((a, b) => a + b, 0);
    assert(houseSum === expected, `${tc.name} ${g} BAV house array sum must be ${expected}, got ${houseSum}`);
  }
}

console.log('>>> SUB-AUDIT 4.3: Trikona Shodhana Boundary Tests');
{
  // Test case 1: Equal in trine [4, 4, 4] -> [0, 0, 0]
  const in1 = [4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0];
  const out1 = applyTrikonaShodhana(in1);
  assert(out1[0] === 0 && out1[4] === 0 && out1[8] === 0, 'Trikona: Equal trine [4,4,4] reduces to [0,0,0]');

  // Test case 2: Unequal non-zero [6, 4, 2] -> [4, 2, 0]
  const in2 = [6, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0];
  const out2 = applyTrikonaShodhana(in2);
  assert(out2[0] === 4 && out2[4] === 2 && out2[8] === 0, 'Trikona: Unequal trine [6,4,2] min 2 subtracted -> [4,2,0]');

  // Test case 3: One zero, two equal [0, 5, 5] -> [0, 0, 0]
  const in3 = [0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0];
  const out3 = applyTrikonaShodhana(in3);
  assert(out3[0] === 0 && out3[4] === 0 && out3[8] === 0, 'Trikona: One zero, two equal [0,5,5] reduces to [0,0,0]');

  // Test case 4: One zero, two unequal [0, 3, 5] -> [0, 3, 5] (no change)
  const in4 = [0, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0];
  const out4 = applyTrikonaShodhana(in4);
  assert(out4[0] === 0 && out4[4] === 3 && out4[8] === 5, 'Trikona: One zero, two unequal [0,3,5] unchanged');

  // Test case 5: Two zeros [0, 0, 7] -> [0, 0, 7] (no change)
  const in5 = [0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0];
  const out5 = applyTrikonaShodhana(in5);
  assert(out5[0] === 0 && out5[4] === 0 && out5[8] === 7, 'Trikona: Two zeros [0,0,7] unchanged');
}

console.log('>>> SUB-AUDIT 4.4: Ekadhipatya Shodhana Boundary Tests');
{
  // Mars: Aries (0) and Scorpio (7)
  // Test Scenario I: Both signs occupied -> No reduction
  const inOcc = [5, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0];
  const occ1 = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]; // both occupied
  const outOcc = applyEkadhipatyaShodhana(inOcc, occ1);
  assert(outOcc[0] === 5 && outOcc[7] === 3, 'Ekadhipatya: Both occupied -> no reduction');

  // Test Scenario II-A: One occupied (v1=5), one unoccupied (v2=3), Occ >= Unocc -> Unocc becomes 0
  const occ2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Aries occupied, Scorpio empty
  const outOcc2 = applyEkadhipatyaShodhana(inOcc, occ2);
  assert(outOcc2[0] === 5 && outOcc2[7] === 0, 'Ekadhipatya: Occ >= Unocc -> Unocc becomes 0');

  // Test Scenario II-B: One occupied (v1=2), one unoccupied (v2=6), Occ < Unocc -> Unocc reduced to Occ
  const inOcc3 = [2, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0];
  const occ3 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const outOcc3 = applyEkadhipatyaShodhana(inOcc3, occ3);
  assert(outOcc3[0] === 2 && outOcc3[7] === 2, 'Ekadhipatya: Occ < Unocc -> Unocc equals Occ (2, 2)');

  // Test Scenario III-A: Both unoccupied, equal dots [4, 4] -> [0, 0]
  const inUnoccEq = [4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0];
  const unocc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const outUnoccEq = applyEkadhipatyaShodhana(inUnoccEq, unocc);
  assert(outUnoccEq[0] === 0 && outUnoccEq[7] === 0, 'Ekadhipatya: Both unoccupied & equal -> [0,0]');

  // Test Scenario III-B: Both unoccupied, unequal dots [5, 2] -> [2, 2]
  const inUnoccUneq = [5, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0];
  const outUnoccUneq = applyEkadhipatyaShodhana(inUnoccUneq, unocc);
  assert(outUnoccUneq[0] === 2 && outUnoccUneq[7] === 2, 'Ekadhipatya: Both unoccupied & unequal -> larger adjusted to smaller [2,2]');
}

console.log('>>> SUB-AUDIT 4.5: Shodhya Pinda & Kakshya Transit Engine');
{
  const testChart = calculateNatalChart(benchmarkCharts[0].date, benchmarkCharts[0].lat, benchmarkCharts[0].lon);
  const av = calculateAshtakavarga(testChart);

  for (const g of ASHTAKAVARGA_GRAHAS) {
    const sh = av.shodhana[g];
    assert(!isNaN(sh.rashiPinda) && sh.rashiPinda >= 0, `${g} Rashi Pinda >= 0 (${sh.rashiPinda})`);
    assert(!isNaN(sh.grahaPinda) && sh.grahaPinda >= 0, `${g} Graha Pinda >= 0 (${sh.grahaPinda})`);
    assert(sh.shodhyaPinda === sh.rashiPinda + sh.grahaPinda, `${g} Shodhya Pinda == Rashi + Graha (${sh.shodhyaPinda})`);
  }

  // Kakshya transit test
  assert(KAKSHYA_LORDS.length === 8, '8 Kakshya lords configured');
  assert(KAKSHYA_LORDS[0] === 'Saturn' && KAKSHYA_LORDS[7] === 'Ascendant', 'First is Saturn, 8th is Ascendant');

  const transitEval1 = evaluateKakshyaTransit('Jupiter', 1.5, av.bav.Jupiter); // 1.5 deg = Kakshya 0 (Saturn)
  assert(transitEval1.kakshyaIndex === 0, 'Transit 1.5 deg in Kakshya index 0');
  assert(transitEval1.kakshyaLord === 'Saturn', 'Transit 1.5 deg lord is Saturn');

  const transitEval2 = evaluateKakshyaTransit('Jupiter', 28.0, av.bav.Jupiter); // 28.0 deg = Kakshya 7 (Ascendant)
  assert(transitEval2.kakshyaIndex === 7, 'Transit 28.0 deg in Kakshya index 7');
  assert(transitEval2.kakshyaLord === 'Ascendant', 'Transit 28.0 deg lord is Ascendant');
}

console.log('\n================================================================');
console.log(`  AUDIT GATE 4 REPORT: ${failedChecks === 0 ? 'ALL GREEN (PASSED)' : 'RED (FAILED)'}`);
console.log(`  Checks Passed: ${passedChecks}`);
console.log(`  Checks Failed: ${failedChecks}`);
console.log('================================================================\n');

if (failedChecks > 0) {
  process.exit(1);
}
