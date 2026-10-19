/**
 * AUDIT SUITE: ASTROENGINE v2.0 CORE REMEDIATION VERIFICATION (E1 - E6)
 *
 * Evaluates the 5 mandatory verification gates:
 * 1. Timezone & Nepal Dead-Code Gate (E3)
 * 2. Instant Cache Key & Minute Sensitivity Gate (E1, E2)
 * 3. Public Lagna & 12 Bhava Cusps API Gate (E4)
 * 4. Hybrid Newton Solver Boundary Accuracy Gate (E5)
 * 5. Input Safety & Zero Dummy Defaults Gate (E6)
 */

import {
  astronomicalEngine,
  calculateTimezoneOffset,
  findBoundaryCrossing,
  drik_calc_ut,
  drik_get_ayanamsa_ut,
  SE_SUN,
  SE_MOON
} from '../dist/index.js';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS ✓] ${message}`);
  } else {
    failedChecks++;
    failures.push(message);
    console.error(`  [FAIL ✗] ${message}`);
  }
}

console.log('================================================================');
console.log('  AUDIT GATE: ASTROENGINE v2.0 REMEDIATION SUITE (E1 - E6)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// GATE 1: TIMEZONE & NEPAL DEAD-CODE RESOLUTION (E3)
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 1: TIMEZONE & NEPAL RESOLUTION GATE (E3)');

// 1.1 Nepal cities MUST return 5.75 (NPT), NOT 5.5 (IST)
const kathmanduTz = calculateTimezoneOffset(27.7172, 85.3240);
assert(kathmanduTz === 5.75, `Kathmandu (Nepal) returns +5.75 NPT (received: ${kathmanduTz})`);

const pokharaTz = calculateTimezoneOffset(28.2096, 83.9856);
assert(pokharaTz === 5.75, `Pokhara (Nepal) returns +5.75 NPT (received: ${pokharaTz})`);

const lalitpurTz = calculateTimezoneOffset(27.6710, 85.3262);
assert(lalitpurTz === 5.75, `Lalitpur (Nepal) returns +5.75 NPT (received: ${lalitpurTz})`);

// 1.2 Indian cities MUST return 5.5 (IST)
const delhiTz = calculateTimezoneOffset(28.6139, 77.2090);
assert(delhiTz === 5.5, `New Delhi (India) returns +5.5 IST (received: ${delhiTz})`);

const mumbaiTz = calculateTimezoneOffset(19.0760, 72.8777);
assert(mumbaiTz === 5.5, `Mumbai (India) returns +5.5 IST (received: ${mumbaiTz})`);

// 1.3 IANA Timezone & DST Resolution
const summerDate = new Date('2026-07-01T12:00:00Z');
const winterDate = new Date('2026-01-01T12:00:00Z');

const nySummerTz = calculateTimezoneOffset(40.7128, -74.0060, 'America/New_York', summerDate);
assert(nySummerTz === -4, `New York in Summer returns -4 EDT (received: ${nySummerTz})`);

const nyWinterTz = calculateTimezoneOffset(40.7128, -74.0060, 'America/New_York', winterDate);
assert(nyWinterTz === -5, `New York in Winter returns -5 EST (received: ${nyWinterTz})`);

const londonSummerTz = calculateTimezoneOffset(51.5074, -0.1278, 'Europe/London', summerDate);
assert(londonSummerTz === 1, `London in Summer returns +1 BST (received: ${londonSummerTz})`);

const londonWinterTz = calculateTimezoneOffset(51.5074, -0.1278, 'Europe/London', winterDate);
assert(londonWinterTz === 0, `London in Winter returns 0 GMT (received: ${londonWinterTz})`);

console.log('');

// -----------------------------------------------------------------------------
// GATE 2: INSTANT CACHE KEY & MINUTE SENSITIVITY (E1, E2)
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 2: INSTANT CACHE KEY & MINUTE SENSITIVITY (E1, E2)');

const birthDateA = new Date('2026-10-19T14:05:00.000Z');
const birthDateB = new Date('2026-10-19T14:55:00.000Z'); // 50 mins later in same hour

const posA = astronomicalEngine.getPanchangPositions(birthDateA);
const posB = astronomicalEngine.getPanchangPositions(birthDateB);

assert(posA.moonSidereal !== posB.moonSidereal, 'Different minutes in same hour yield distinct Moon positions');

const moonShiftDeg = (posB.moonSidereal - posA.moonSidereal + 360) % 360;
assert(
  moonShiftDeg >= 0.35 && moonShiftDeg <= 0.55,
  `Moon shift over 50 minutes is physically realistic: ${moonShiftDeg.toFixed(4)}° (~25-27 arcmin)`
);

// Verify solar times precision
const solarA = astronomicalEngine.getSolarTimes(28.6139, 77.2090, birthDateA);
const solarB = astronomicalEngine.getSolarTimes(28.6139, 77.2090, birthDateB);
assert(solarA.sunrise === solarB.sunrise, 'Solar times for same day match correctly');

console.log('');

// -----------------------------------------------------------------------------
// GATE 3: PUBLIC LAGNA & 12 BHAVA CUSPS API (E4)
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 3: PUBLIC LAGNA & 12 BHAVA CUSPS API (E4)');

const ascendant = astronomicalEngine.getAscendant(28.6139, 77.2090, birthDateA, 'Lahiri');
assert(typeof ascendant.longitude === 'number' && ascendant.longitude >= 0 && ascendant.longitude < 360,
  `Ascendant longitude is valid: ${ascendant.longitude.toFixed(2)}°`
);
assert(ascendant.signIndex >= 0 && ascendant.signIndex <= 11, `Ascendant sign index is valid: ${ascendant.signIndex} (${ascendant.signName})`);
assert(typeof ascendant.signLord === 'string' && ascendant.signLord.length > 0, `Ascendant sign lord populated: ${ascendant.signLord}`);
assert(typeof ascendant.nakshatraLord === 'string' && ascendant.nakshatraLord.length > 0, `Ascendant nakshatra lord populated: ${ascendant.nakshatraLord}`);

const cusps = astronomicalEngine.getHouseCusps(28.6139, 77.2090, birthDateA, 'Sripati', 'Lahiri');
assert(cusps.length === 12, `Exactly 12 Bhava cusps returned (received: ${cusps.length})`);

const cusp1Mid = cusps[0].midLongitude;
const ascDiff = Math.abs((cusp1Mid - ascendant.longitude + 360) % 360);
assert(ascDiff < 0.001 || Math.abs(ascDiff - 360) < 0.001, `Cusp 1 midpoint matches Ascendant: diff=${ascDiff.toFixed(6)}°`);

for (let h = 0; h < 12; h++) {
  const cusp = cusps[h];
  assert(cusp.houseNumber === h + 1, `House ${h + 1} has correct number`);
  assert(cusp.signIndex >= 0 && cusp.signIndex <= 11, `House ${h + 1} has valid sign index: ${cusp.signName}`);
  assert(cusp.signLord.length > 0, `House ${h + 1} has sign lord: ${cusp.signLord}`);
}

const fullNatal = astronomicalEngine.getNatalChart(28.6139, 77.2090, birthDateA, 'Placidus', 'KP');
assert(fullNatal.planets.length === 9, `Natal chart has 9 Grahas (received: ${fullNatal.planets.length})`);
assert(fullNatal.houseSystem === 'Placidus', `Natal chart requested Placidus house system correctly`);
assert(fullNatal.ayanamshaSystem === 'KP', `Natal chart KP ayanamsha applied correctly`);

console.log('');

// -----------------------------------------------------------------------------
// GATE 4: HYBRID NEWTON SOLVER BOUNDARY ACCURACY (E5)
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 4: HYBRID NEWTON SOLVER BOUNDARY ACCURACY (E5)');

// Test 10 consecutive tithi boundaries (every 12 degrees)
const testMidnightJd = 2460235.5; // ~Oct 2026

for (let t = 0; t < 10; t++) {
  const targetDeg = (t * 36) % 360;
  const tithiCrossingJd = findBoundaryCrossing(testMidnightJd, 'tithi', targetDeg);

  assert(typeof tithiCrossingJd === 'number' && !isNaN(tithiCrossingJd), `Tithi crossing JD is valid number for target ${targetDeg}°`);

  // Verify accuracy at the resolved instant
  const sun = drik_calc_ut(tithiCrossingJd, SE_SUN);
  const moon = drik_calc_ut(tithiCrossingJd, SE_MOON);
  const actualVal = (moon[0] - sun[0] + 360) % 360;

  let err = targetDeg - actualVal;
  err = ((err + 180) % 360 + 360) % 360 - 180;

  assert(
    Math.abs(err) < 0.00001,
    `Tithi target ${targetDeg}° crossover error is negligible: ${Math.abs(err).toFixed(8)}° (< 0.036 arcsec)`
  );
}

// Test 5 nakshatra boundaries (every 13.3333 degrees)
for (let n = 0; n < 5; n++) {
  const targetDeg = (n * 13.333333333333334) % 360;
  const naksCrossingJd = findBoundaryCrossing(testMidnightJd, 'nakshatra', targetDeg);

  const moon = drik_calc_ut(naksCrossingJd, SE_MOON);
  const ayanamsa = drik_get_ayanamsa_ut(naksCrossingJd);
  const actualVal = (moon[0] - ayanamsa + 360) % 360;

  let err = targetDeg - actualVal;
  err = ((err + 180) % 360 + 360) % 360 - 180;

  assert(
    Math.abs(err) < 0.00001,
    `Nakshatra target ${targetDeg.toFixed(2)}° crossover error is negligible: ${Math.abs(err).toFixed(8)}°`
  );
}

console.log('');

// -----------------------------------------------------------------------------
// GATE 5: INPUT SAFETY & ZERO DUMMY DEFAULTS (E6)
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 5: INPUT SAFETY & ZERO DUMMY DEFAULTS (E6)');

let threwInvalidLat = false;
try {
  astronomicalEngine.getSolarTimes(999, 77.2090, new Date());
} catch {
  threwInvalidLat = true;
}
assert(threwInvalidLat, 'Calling getSolarTimes with invalid latitude throws error instead of returning 06:00 AM dummy');

let threwInvalidDate = false;
try {
  astronomicalEngine.getPanchangPositions(new Date('invalid-date'));
} catch {
  threwInvalidDate = true;
}
assert(threwInvalidDate, 'Calling getPanchangPositions with invalid Date throws error instead of returning 0° dummy planets');

let threwInvalidNatalLon = false;
try {
  astronomicalEngine.getNatalChart(28.6139, -500, new Date());
} catch {
  threwInvalidNatalLon = true;
}
assert(threwInvalidNatalLon, 'Calling getNatalChart with invalid longitude throws error');

// -----------------------------------------------------------------------------
// AUDIT SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log('  AUDIT SUMMARY REPORT');
console.log('================================================================');
console.log(`  Total Checks Evaluated : ${totalChecks}`);
console.log(`  Passed Checks          : ${passedChecks}`);
console.log(`  Failed Checks          : ${failedChecks}`);
console.log(`  Status                 : [${failedChecks === 0 ? '100% GREEN - ALL GATES PASSED' : 'RED - FAILURES DETECTED'}]`);
console.log('================================================================\n');

if (failedChecks > 0) {
  process.exit(1);
}
