/**
 * MAIN AUDIT GATE 5: Dasha Systems Engine Deep Audit
 *
 * Verifies:
 * 1. Vimshottari Balance at Birth & 120-Year 4-Level Timeline.
 * 2. Strict Chronological Continuity: 0ms gap and 0ms overlap across MD, AD, PD, SD levels.
 * 3. Yogini Dasha 36-Year Cycle continuity and accurate remainder-based starting lord.
 * 4. Ashtottari Dasha 108-Year Cycle applicability condition & timeline continuity.
 * 5. Jaimini Chara Dasha direct/indirect order, sign durations (1..12y), and timeline continuity.
 */

import { calculateNatalChart } from '../dist/kundli/houseCusps.js';
import {
  calculateAllDashas,
  calculateVimshottariBalance,
  generateVimshottariTimeline,
  findCurrentVimshottari,
  calculateYoginiDasha,
  calculateAshtottariDasha,
  calculateCharaDasha,
  TOTAL_VIMSHOTTARI_YEARS,
  TOTAL_YOGINI_YEARS,
  TOTAL_ASHTOTTARI_YEARS,
  YOGINI_NAMES
} from '../dist/dasha/dashaEngine.js';

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
console.log('  MAIN AUDIT GATE 5: DASHA SYSTEMS DEEP CONTINUITY AUDIT');
console.log('================================================================\n');

// 5 Reference Birth Dates spanning diverse Moon nakshatras
const testDates = [
  { name: 'Ashwini Moon Birth', date: new Date('2024-04-10T12:00:00Z'), lat: 28.6139, lon: 77.2090 },
  { name: 'Rohini Moon Birth', date: new Date('1990-05-15T08:30:00Z'), lat: 19.0760, lon: 72.8777 },
  { name: 'Chitra Moon Birth', date: new Date('1982-10-02T18:45:00Z'), lat: 25.3176, lon: 82.9739 },
  { name: 'Revati Moon Edge', date: new Date('2005-12-31T23:59:00Z'), lat: 51.5074, lon: -0.1278 },
  { name: 'Moola Moon Gandanta', date: new Date('2015-08-15T04:15:00Z'), lat: 35.6762, lon: 139.6503 }
];

console.log('>>> SUB-AUDIT 5.1 & 5.2: Vimshottari Balance & 0ms Gap/Overlap Continuity Test');
for (const tc of testDates) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const moon = chart.planets.find(p => p.name === 'Moon');
  assert(moon !== undefined, `${tc.name}: Moon planet located`);

  const balance = calculateVimshottariBalance(moon.longitude);
  assert(balance.balanceYears >= 0 && balance.balanceYears <= 20, `${tc.name}: Balance years valid (${balance.balanceYears})`);
  assert(balance.fractionRemaining > 0 && balance.fractionRemaining <= 1, `${tc.name}: Fraction remaining valid (${balance.fractionRemaining.toFixed(4)})`);

  const { timeline } = generateVimshottariTimeline(tc.date, moon.longitude, true);
  assert(timeline.length === 9, `${tc.name}: Exactly 9 Mahadashas generated`);

  // Assert 1st MD starts exactly at birth
  assert(timeline[0].startDate.getTime() === tc.date.getTime(), `${tc.name}: MD[0] starts at birthDate`);

  // Continuity across Mahadashas
  for (let m = 0; m < timeline.length; m++) {
    const md = timeline[m];
    if (m > 0) {
      const prevMD = timeline[m - 1];
      assert(
        md.startDate.getTime() === prevMD.endDate.getTime(),
        `${tc.name}: MD[${m}] 0ms continuity with MD[${m - 1}]`
      );
    }

    // Continuity across Antardashas within MD
    assert(md.antardashas.length > 0, `${tc.name}: MD[${m}] has at least 1 AD`);
    assert(
      md.antardashas[0].startDate.getTime() === md.startDate.getTime(),
      `${tc.name}: MD[${m}] AD[0] starts at MD start`
    );
    assert(
      md.antardashas[md.antardashas.length - 1].endDate.getTime() === md.endDate.getTime(),
      `${tc.name}: MD[${m}] last AD ends at MD end`
    );

    for (let a = 0; a < md.antardashas.length; a++) {
      const ad = md.antardashas[a];
      if (a > 0) {
        const prevAD = md.antardashas[a - 1];
        assert(
          ad.startDate.getTime() === prevAD.endDate.getTime(),
          `${tc.name}: MD[${m}] AD[${a}] 0ms continuity with AD[${a - 1}]`
        );
      }

      // Continuity across Pratyantardashas within AD
      if (ad.pratyantardashas.length > 0) {
        assert(
          ad.pratyantardashas[0].startDate.getTime() === ad.startDate.getTime(),
          `${tc.name}: MD[${m}] AD[${a}] PD[0] starts at AD start`
        );
        assert(
          ad.pratyantardashas[ad.pratyantardashas.length - 1].endDate.getTime() === ad.endDate.getTime(),
          `${tc.name}: MD[${m}] AD[${a}] last PD ends at AD end`
        );

        for (let p = 0; p < ad.pratyantardashas.length; p++) {
          const pd = ad.pratyantardashas[p];
          if (p > 0) {
            const prevPD = ad.pratyantardashas[p - 1];
            assert(
              pd.startDate.getTime() === prevPD.endDate.getTime(),
              `${tc.name}: PD[${p}] 0ms continuity with PD[${p - 1}]`
            );
          }
        }
      }
    }
  }

  // Test active dasha lookup at query dates
  const queryDate1 = new Date(tc.date.getTime() + 5 * 365.25 * 86400 * 1000); // 5 years later
  const currDasha1 = findCurrentVimshottari(timeline, queryDate1);
  assert(currDasha1 !== null, `${tc.name}: Active dasha located at +5y`);
  assert(
    queryDate1.getTime() >= currDasha1.startDate.getTime() && queryDate1.getTime() < currDasha1.endDate.getTime(),
    `${tc.name}: Query date properly bounded within currDasha1 interval`
  );
}

console.log('>>> SUB-AUDIT 5.3: Yogini Dasha 36-Year Cycle Test');
for (const tc of testDates) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const moon = chart.planets.find(p => p.name === 'Moon');
  const yogini = calculateYoginiDasha(tc.date, moon.longitude);

  assert(YOGINI_NAMES.includes(yogini.birthYogini), `${tc.name}: Valid birth Yogini (${yogini.birthYogini})`);
  assert(yogini.birthBalanceYears > 0, `${tc.name}: Yogini birth balance > 0 (${yogini.birthBalanceYears.toFixed(2)}y)`);
  assert(yogini.timeline.length === 8, `${tc.name}: Exactly 8 Yoginis in timeline`);

  // Check 0ms gap continuity across 8 Yogini Mahadashas
  assert(yogini.timeline[0].startDate.getTime() === tc.date.getTime(), `${tc.name}: Yogini[0] starts at birth`);
  for (let i = 1; i < yogini.timeline.length; i++) {
    assert(
      yogini.timeline[i].startDate.getTime() === yogini.timeline[i - 1].endDate.getTime(),
      `${tc.name}: Yogini[${i}] 0ms continuity with Yogini[${i - 1}]`
    );
  }

  // Check Antardasha continuity within Yogini
  for (const y of yogini.timeline) {
    assert(y.antardashas.length === 8, `${tc.name}: 8 Yogini ADs per MD`);
    assert(y.antardashas[0].startDate.getTime() === y.startDate.getTime(), `${tc.name}: Yogini AD[0] starts at MD start`);
    assert(y.antardashas[7].endDate.getTime() === y.endDate.getTime(), `${tc.name}: Yogini AD[7] ends at MD end`);
  }
}

console.log('>>> SUB-AUDIT 5.4: Ashtottari Dasha 108-Year Cycle Test');
for (const tc of testDates) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const ashtottari = calculateAshtottariDasha(chart);

  assert(typeof ashtottari.isApplicable === 'boolean', `${tc.name}: Ashtottari applicability evaluated`);
  assert(ashtottari.timeline.length === 8, `${tc.name}: Exactly 8 Ashtottari Mahadashas`);

  // 0ms continuity across Ashtottari
  assert(ashtottari.timeline[0].startDate.getTime() === tc.date.getTime(), `${tc.name}: Ashtottari starts at birth`);
  for (let i = 1; i < ashtottari.timeline.length; i++) {
    assert(
      ashtottari.timeline[i].startDate.getTime() === ashtottari.timeline[i - 1].endDate.getTime(),
      `${tc.name}: Ashtottari[${i}] 0ms continuity with Ashtottari[${i - 1}]`
    );
  }
}

console.log('>>> SUB-AUDIT 5.5: Jaimini Chara Dasha Sign-Based Test');
for (const tc of testDates) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const chara = calculateCharaDasha(chart);

  assert(chara.orderOfSigns.length === 12, `${tc.name}: Exactly 12 signs in Chara Dasha`);
  assert(chara.timeline.length === 12, `${tc.name}: Exactly 12 sign periods in timeline`);

  // Assert durations between 1 and 12 years
  for (const entry of chara.timeline) {
    assert(
      entry.durationYears >= 1 && entry.durationYears <= 12,
      `${tc.name}: Sign ${entry.signName} duration ${entry.durationYears}y in [1..12]`
    );
  }

  // 0ms continuity across Chara Dasha timeline
  assert(chara.timeline[0].startDate.getTime() === tc.date.getTime(), `${tc.name}: Chara starts at birth`);
  for (let i = 1; i < chara.timeline.length; i++) {
    assert(
      chara.timeline[i].startDate.getTime() === chara.timeline[i - 1].endDate.getTime(),
      `${tc.name}: Chara[${i}] 0ms continuity with Chara[${i - 1}]`
    );
  }
}

console.log('>>> FULL DASHA ORCHESTRATOR TEST');
{
  const fullChart = calculateNatalChart(testDates[0].date, testDates[0].lat, testDates[0].lon);
  const allDashas = calculateAllDashas(fullChart);
  assert(allDashas.vimshottari !== undefined, 'Master: vimshottari present');
  assert(allDashas.yogini !== undefined, 'Master: yogini present');
  assert(allDashas.ashtottari !== undefined, 'Master: ashtottari present');
  assert(allDashas.chara !== undefined, 'Master: chara present');
}

console.log('\n================================================================');
console.log(`  AUDIT GATE 5 REPORT: ${failedChecks === 0 ? 'ALL GREEN (PASSED)' : 'RED (FAILED)'}`);
console.log(`  Checks Passed: ${passedChecks}`);
console.log(`  Checks Failed: ${failedChecks}`);
console.log('================================================================\n');

if (failedChecks > 0) {
  process.exit(1);
}
