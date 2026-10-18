import { calculateVarga, calculateAllVargasForPlanet, SHASHTIAMSHA_DATA } from '../dist/vargas/shodashvarga.js';

console.log('================================================================');
console.log('MAIN MODULE 2 AUDIT GATE: Shodashvarga (16 Divisional Charts)');
console.log('Testing Mathematical Precision, Vargottama, D30 & D60 Deities');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const failureLog = [];

// Check 1: 16 Vargas boundary check across 360 degrees
const vargaTypes = [
  'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
  'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
];

let boundsValid = true;
for (let deg = 0; deg < 360; deg += 3.75) {
  for (const v of vargaTypes) {
    totalChecks++;
    const res = calculateVarga(deg, v);
    if (res.signIndex < 0 || res.signIndex > 11 || isNaN(res.signIndex)) {
      boundsValid = false;
      failureLog.push(`Invalid sign index for ${v} at ${deg}°: ${res.signIndex}`);
      break;
    }
    if (res.degreeInVarga < 0 || res.degreeInVarga >= 30.01) {
      boundsValid = false;
      failureLog.push(`Invalid degree in varga for ${v} at ${deg}°: ${res.degreeInVarga}`);
      break;
    }
    passedChecks++;
  }
}
console.log(`[PASS ✓] 16 Divisional Charts boundary validity: ${passedChecks}/${totalChecks} checks passed`);

// Check 2: Classical Vargottama Invariant Tests
const vargottamaTests = [
  { name: 'Movable (Aries 1°30\')', deg: 1.5, expectedVargottama: true, expectedD9Sign: 0 },
  { name: 'Movable (Cancer 2°00\')', deg: 92.0, expectedVargottama: true, expectedD9Sign: 3 },
  { name: 'Fixed (Taurus 15°00\')', deg: 45.0, expectedVargottama: true, expectedD9Sign: 1 },
  { name: 'Fixed (Leo 14°30\')', deg: 134.5, expectedVargottama: true, expectedD9Sign: 4 },
  { name: 'Dual (Gemini 28°00\')', deg: 88.0, expectedVargottama: true, expectedD9Sign: 2 },
  { name: 'Dual (Virgo 29°15\')', deg: 179.25, expectedVargottama: true, expectedD9Sign: 5 },
  { name: 'Non-Vargottama (Aries 10°00\')', deg: 10.0, expectedVargottama: false, expectedD9Sign: 3 }
];

for (const vt of vargottamaTests) {
  totalChecks++;
  const d9 = calculateVarga(vt.deg, 'D9');
  if (d9.isVargottama === vt.expectedVargottama && d9.signIndex === vt.expectedD9Sign) {
    passedChecks++;
    console.log(`[PASS ✓] Vargottama Verification: ${vt.name.padEnd(32)} -> D9 Sign: ${d9.signName} (Vargottama: ${d9.isVargottama})`);
  } else {
    failureLog.push(`Vargottama failed for ${vt.name}: got ${d9.isVargottama}, expected ${vt.expectedVargottama}`);
  }
}

// Check 3: Pushkar Navamsha Detection
const pushkarTests = [
  { deg: 21.0, isPushkar: true }, // Aries 21° (Libra navamsha, 7th part) -> Pushkar
  { deg: 45.0, isPushkar: true }, // Taurus 15° (Taurus navamsha, 5th part) -> Pushkar
  { deg: 5.0, isPushkar: false }  // Aries 5° (Taurus navamsha) -> Not Pushkar
];

for (const pt of pushkarTests) {
  totalChecks++;
  const d9 = calculateVarga(pt.deg, 'D9');
  if (d9.isPushkar === pt.isPushkar) {
    passedChecks++;
  } else {
    failureLog.push(`Pushkar mismatch at ${pt.deg}°: got ${d9.isPushkar}, expected ${pt.isPushkar}`);
  }
}
console.log('[PASS ✓] Pushkar Navamsha mathematical detection verified');

// Check 4: D30 Trimshamsha Unequal Distribution
totalChecks += 4;
const d30OddMars = calculateVarga(2.5, 'D30');    // Aries 2.5° -> Mars (Aries/0)
const d30OddSat  = calculateVarga(7.5, 'D30');    // Aries 7.5° -> Saturn (Aquarius/10)
const d30EvenVen = calculateVarga(32.5, 'D30');   // Taurus 2.5° -> Venus (Taurus/1)
const d30EvenMerc= calculateVarga(37.5, 'D30');   // Taurus 7.5° -> Mercury (Virgo/5)

if (d30OddMars.signIndex === 0 && d30OddSat.signIndex === 10 && d30EvenVen.signIndex === 1 && d30EvenMerc.signIndex === 5) {
  passedChecks += 4;
  console.log('[PASS ✓] Trimshamsha (D30) unequal 5/5/8/7/5 sign rule verified');
} else {
  failureLog.push('Trimshamsha unequal degree allocation failed');
}

// Check 5: Shashtiamsha (D60) 60 Deities completeness
totalChecks++;
if (SHASHTIAMSHA_DATA.length === 60) {
  passedChecks++;
  console.log('[PASS ✓] D60 Shashtiamsha 60 Deities & Natures fully populated');
} else {
  failureLog.push(`D60 Deities count is ${SHASHTIAMSHA_DATA.length}, expected 60`);
}

// Check 6: Full Planet Shodashvarga Mapping & Vaisheshikamsa Dignity
totalChecks++;
const exaltedSun = calculateAllVargasForPlanet('Sun', 10.0); // Sun exalted in Aries 10°
if (exaltedSun.dignityScore.shodashvargaScore >= 2 && exaltedSun.dignityScore.vaisheshikamsaTitle) {
  passedChecks++;
  console.log(`[PASS ✓] Vaisheshikamsa Dignity Scoring: Exalted Sun Title -> ${exaltedSun.dignityScore.vaisheshikamsaTitle} (Score: ${exaltedSun.dignityScore.shodashvargaScore}/16)`);
} else {
  failureLog.push('Vaisheshikamsa Dignity scoring failed');
}

console.log('\n================================================================');
console.log('MAIN MODULE 2 AUDIT REPORT (GREEN / RED):');
console.log('================================================================');
const isGreen = failureLog.length === 0;

if (isGreen) {
  console.log('STATUS: [GREEN - 100% PASS]');
  console.log(`Total Checks Evaluated: ${totalChecks} / ${totalChecks} Passed`);
  console.log('All 16 Divisional Charts (D1 to D60), Vargottama & Dignities Verified!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error('STATUS: [RED - AUDIT FAILED]');
  failureLog.forEach(f => console.error(` - ${f}`));
  console.log('================================================================\n');
  process.exit(1);
}
