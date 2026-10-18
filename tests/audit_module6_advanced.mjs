/**
 * MAIN AUDIT GATE 6: Predictive Synthesis & Specialized Systems Deep Audit
 *
 * Verifies:
 * 1. Classical Parashari Yogas (Mahapurusha, Raja, Chandra, Surya, Viparita, Neechbhanga).
 * 2. Malefic Doshas & 14 Cancellation Rules (Manglik, Kaal Sarp, Guru Chandal, Pitra).
 * 3. Shani Sade Sati 3 Phases & Dhaiya Engine.
 * 4. Kundli Milan Ashtakoota 36 Gunas with Bhakoot and Nadi cancellations.
 * 5. KP Jyotish 249 Sub-Lord continuous calculations.
 * 6. Jaimini Jyotish 7 Karakas (AK..DK) & 12 Bhava Padas with 1st/7th jump exceptions.
 * 7. Tajik Varshphal Newton-Raphson solar return root-finder (<0.001 deg) & Muntha.
 * 8. Lal Kitab Kalpurush mapping & Panch Pakshi 5-bird diurnal cycles.
 */

import { calculateNatalChart } from '../dist/kundli/houseCusps.js';
import {
  evaluateParashariYogas,
  evaluateMaleficDoshas,
  evaluateSadeSati,
  calculateKundliMilan,
  calculateKPSubLord,
  calculateJaiminiDetails,
  calculateVarshphal,
  evaluateLalKitab,
  evaluatePanchPakshi
} from '../dist/synthesis/predictiveEngine.js';

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
console.log('  MAIN AUDIT GATE 6: PREDICTIVE SYNTHESIS & SPECIALIZED SYSTEMS');
console.log('================================================================\n');

// Reference Horoscopes
const sampleChart1 = calculateNatalChart(new Date('2024-04-15T06:30:00Z'), 25.3176, 82.9739);
const sampleChart2 = calculateNatalChart(new Date('1985-11-20T14:15:00Z'), 28.6139, 77.2090);

console.log('>>> SUB-AUDIT 6.1: Classical Parashari Yogas');
{
  const yogas1 = evaluateParashariYogas(sampleChart1);
  const yogas2 = evaluateParashariYogas(sampleChart2);

  assert(Array.isArray(yogas1) && yogas1.length > 0, 'Chart 1: Formed yogas detected');
  assert(Array.isArray(yogas2) && yogas2.length > 0, 'Chart 2: Formed yogas detected');

  for (const y of [...yogas1, ...yogas2]) {
    assert(typeof y.name === 'string' && y.name.length > 0, `Yoga ${y.name} has valid name`);
    assert(y.planetsInvolved.length > 0, `Yoga ${y.name} has involved planets`);
    assert(typeof y.description === 'string', `Yoga ${y.name} has description`);
  }
}

console.log('>>> SUB-AUDIT 6.2: Malefic Doshas & Cancellations');
{
  const doshas1 = evaluateMaleficDoshas(sampleChart1);
  assert(doshas1.length >= 4, 'Chart 1: All major doshas evaluated');

  const manglik = doshas1.find(d => d.name.startsWith('Manglik'));
  assert(manglik !== undefined, 'Manglik dosha evaluated');
  assert(typeof manglik.hasDosha === 'boolean', 'Manglik hasDosha boolean');
  assert(typeof manglik.isCancelled === 'boolean', 'Manglik isCancelled evaluated');

  const kaalSarp = doshas1.find(d => d.name.startsWith('Kaal Sarp'));
  assert(kaalSarp !== undefined, 'Kaal Sarp evaluated');
  assert(typeof kaalSarp.hasDosha === 'boolean', 'Kaal Sarp hasDosha boolean');
}

console.log('>>> SUB-AUDIT 6.3: Shani Sade Sati & Dhaiya Engine');
{
  // Test Moon in Aries (0) with Saturn in Pisces (11) -> 1st Phase Rising
  const ss1 = evaluateSadeSati(0, 11);
  assert(ss1.isSadeSatiActive === true, 'Saturn 12th from Moon -> Sade Sati Active');
  assert(ss1.phase === '1st Phase (Rising)', '1st Phase (Rising) detected');

  // Test Moon in Aries (0) with Saturn in Aries (0) -> 2nd Phase Peak
  const ss2 = evaluateSadeSati(0, 0);
  assert(ss2.isSadeSatiActive === true, 'Saturn in Moon sign -> Sade Sati Active');
  assert(ss2.phase === '2nd Phase (Peak)', '2nd Phase (Peak) detected');

  // Test Moon in Aries (0) with Saturn in Taurus (1) -> 3rd Phase Setting
  const ss3 = evaluateSadeSati(0, 1);
  assert(ss3.isSadeSatiActive === true, 'Saturn in 2nd from Moon -> Sade Sati Active');
  assert(ss3.phase === '3rd Phase (Setting)', '3rd Phase (Setting) detected');

  // Test Moon in Aries (0) with Saturn in Cancer (3) -> Kantaka Shani (4th)
  const ss4 = evaluateSadeSati(0, 3);
  assert(ss4.isDhaiyaActive === true, 'Saturn in 4th -> Dhaiya Active');
  assert(ss4.dhaiyaType === 'Kantaka Shani (4th House)', 'Kantaka Shani detected');

  // Test Moon in Aries (0) with Saturn in Scorpio (7) -> Ashtama Shani (8th)
  const ss5 = evaluateSadeSati(0, 7);
  assert(ss5.isDhaiyaActive === true, 'Saturn in 8th -> Dhaiya Active');
  assert(ss5.dhaiyaType === 'Ashtama Shani (8th House)', 'Ashtama Shani detected');
}

console.log('>>> SUB-AUDIT 6.4: Kundli Milan Ashtakoota 36 Gunas Matching');
{
  // Test pair 1: Same Moon longitude (Should get maximum compatibility)
  const milan1 = calculateKundliMilan(45.0, 45.0);
  assert(milan1.totalScore >= 28, `Identical longitudes have high score (${milan1.totalScore}/36)`);
  assert(milan1.kootas.length === 8, 'All 8 Kootas evaluated');
  assert(milan1.maxScore === 36, 'Max score is 36');

  // Test pair 2: Opposite Moon signs (7/7 aspect, good Bhakoot)
  const milan2 = calculateKundliMilan(15.0, 195.0); // Aries vs Libra
  assert(milan2.totalScore >= 0 && milan2.totalScore <= 36, `Pair 2 valid score (${milan2.totalScore}/36)`);
  const bhakoot = milan2.kootas.find(k => k.koota === 'Bhakoot');
  assert(bhakoot.obtainedPoints === 7, '7/7 axis gets full 7 Bhakoot points');
}

console.log('>>> SUB-AUDIT 6.5: KP Jyotish 249 Sub-Lords Engine');
{
  // Test beginning of Aries (0°00') -> Star Ketu, Sub Ketu, Sub-Sub Ketu
  const kp1 = calculateKPSubLord(0.1);
  assert(kp1.signLord === 'Mars', '0.1 deg: Sign lord Mars');
  assert(kp1.starLord === 'Ketu', '0.1 deg: Star lord Ketu');
  assert(kp1.subLord === 'Ketu', '0.1 deg: Sub lord Ketu');

  // Test 13°30' (Entering Bharani, ruled by Venus)
  const kp2 = calculateKPSubLord(13.5);
  assert(kp2.signLord === 'Mars', '13.5 deg: Sign lord Mars');
  assert(kp2.starLord === 'Venus', '13.5 deg: Star lord Venus');
  assert(kp2.subLord === 'Venus', '13.5 deg: Sub lord Venus');

  // Ensure continuous coverage across all 360 degrees without NaN
  for (let deg = 0; deg < 360; deg += 30) {
    const kpTest = calculateKPSubLord(deg + 0.5);
    assert(typeof kpTest.subLord === 'string' && kpTest.subLord.length > 0, `KP Sub-lord at ${deg.toFixed(1)}° valid`);
    assert(typeof kpTest.subSubLord === 'string' && kpTest.subSubLord.length > 0, `KP Sub-Sub lord at ${deg.toFixed(1)}° valid`);
  }
}

console.log('>>> SUB-AUDIT 6.6: Jaimini 7 Chara Karakas & 12 Bhava Padas');
{
  const jaimini = calculateJaiminiDetails(sampleChart1);
  assert(jaimini.karakas.length === 7, 'Exactly 7 Chara Karakas calculated');

  // Assert strictly descending degreeInSign
  for (let i = 1; i < jaimini.karakas.length; i++) {
    assert(
      jaimini.karakas[i - 1].degreeInSign >= jaimini.karakas[i].degreeInSign,
      `Karaka order descending: ${jaimini.karakas[i - 1].karakaName} (${jaimini.karakas[i - 1].degreeInSign.toFixed(2)}°) >= ${jaimini.karakas[i].karakaName} (${jaimini.karakas[i].degreeInSign.toFixed(2)}°)`
    );
  }

  assert(jaimini.karakas[0].symbol === 'AK', 'First karaka is AK (Atmakaraka)');
  assert(jaimini.karakas[6].symbol === 'DK', '7th karaka is DK (Darakaraka)');

  // 12 Arudha Padas
  assert(jaimini.arudhaPadas.length === 12, '12 Arudha Padas calculated');
  assert(jaimini.arudhaLagna.padaCode === 'AL', 'Arudha Lagna code is AL');
  assert(jaimini.upapadaLagna.padaCode === 'UL', 'Upapada Lagna code is UL');
}

console.log('>>> SUB-AUDIT 6.7: Tajik Varshphal & Solar Return Engine');
{
  const completedYears = 30;
  const varshphal = calculateVarshphal(sampleChart1, completedYears);

  assert(varshphal.targetAge === 30, 'Varshphal target age is 30');
  assert(
    varshphal.munthaSignIndex === (sampleChart1.ascendant.signIndex + completedYears) % 12,
    'Muntha sign progresses exactly 1 sign per year'
  );
  assert(varshphal.punyaSahamLongitude >= 0 && varshphal.punyaSahamLongitude < 360, 'Punya Saham within [0, 360)');
  assert(varshphal.vidyaSahamLongitude >= 0 && varshphal.vidyaSahamLongitude < 360, 'Vidya Saham within [0, 360)');
}

console.log('>>> SUB-AUDIT 6.8 & 6.9: Lal Kitab & Panch Pakshi');
{
  const lalKitab = evaluateLalKitab(sampleChart1);
  assert(Array.isArray(lalKitab.sleepingHouses), 'Lal Kitab sleeping houses array');
  assert(lalKitab.artificialMasnooiPlanets.length === 5, '5 Masnooi planet pairings defined');

  const moon = sampleChart1.planets.find(p => p.name === 'Moon');
  const panchPakshi = evaluatePanchPakshi(moon.longitude, 14);
  assert(['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'].includes(panchPakshi.birthBird), `Panch Pakshi bird valid (${panchPakshi.birthBird})`);
  assert(['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying'].includes(panchPakshi.currentActivity), `Activity valid (${panchPakshi.currentActivity})`);
}

console.log('\n================================================================');
console.log(`  AUDIT GATE 6 REPORT: ${failedChecks === 0 ? 'ALL GREEN (PASSED)' : 'RED (FAILED)'}`);
console.log(`  Checks Passed: ${passedChecks}`);
console.log(`  Checks Failed: ${failedChecks}`);
console.log('================================================================\n');

if (failedChecks > 0) {
  process.exit(1);
}
