import fs from 'fs';
import path from 'path';
import {
  getPanchangForDate,
  calculateSolarTimesCore,
  calculatePanchangPositionsCore,
  findBoundaryCrossing,
  checkMuhurats,
  getFestivalsForYear
} from '../dist/index.js';

console.log('================================================================');
console.log('PHASE 6 DEEP AUDIT: Phenomenon Verification & 365-Day Stress Test');
console.log('Proprietary Sanatan JPL Astronomical & Vedic Engine');
console.log('================================================================\n');

// ---------------------------------------------------------------------------
// 1. Dedicated Phenomenon Verification
// ---------------------------------------------------------------------------
console.log('1. Verifying Specialized Astronomical Phenomenon Fixtures:');
console.log('----------------------------------------------------------------');

const fixturePath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
const baseline = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const phenomena = baseline.layer_c_phenomena;

// 1.1 Kshaya Tithi Verification
const kshaya = phenomena.kshaya_tithi_fixture;
const kshayaDay1Date = new Date(kshaya.day1_sunrise_snapshot.date);
const kshayaDay2Date = new Date(kshaya.day2_sunrise_snapshot.date);

const kshayaPos1 = calculatePanchangPositionsCore(kshayaDay1Date);
const kshayaPos2 = calculatePanchangPositionsCore(kshayaDay2Date);

console.log(`- Kshaya Tithi Fixture (Skipped Tithi: ${kshaya.skipped_tithi}):`);
console.log(`  Day 1 (${kshaya.day1_sunrise_snapshot.date}) Sunrise Tithi Index: ${kshayaPos1.tithiIdx} (Expected: ${kshaya.day1_sunrise_snapshot.panchang_angas.tithi.index})`);
console.log(`  Day 2 (${kshaya.day2_sunrise_snapshot.date}) Sunrise Tithi Index: ${kshayaPos2.tithiIdx} (Expected: ${kshaya.day2_sunrise_snapshot.panchang_angas.tithi.index})`);

const kshayaPass = (
  kshayaPos1.tithiIdx === kshaya.day1_sunrise_snapshot.panchang_angas.tithi.index &&
  kshayaPos2.tithiIdx === kshaya.day2_sunrise_snapshot.panchang_angas.tithi.index &&
  kshayaPos2.tithiIdx - kshayaPos1.tithiIdx === 2
);
console.log(`  Status: ${kshayaPass ? 'PASS ✓ (Tithi skipped as expected)' : 'FAIL ✗'}`);

// 1.2 Vriddhi Tithi Verification
const vriddhi = phenomena.vriddhi_tithi_fixture;
const vriddhiDay1Date = new Date(vriddhi.day1_sunrise_snapshot.date);
const vriddhiDay2Date = new Date(vriddhi.day2_sunrise_snapshot.date);

const vriddhiPos1 = calculatePanchangPositionsCore(vriddhiDay1Date);
const vriddhiPos2 = calculatePanchangPositionsCore(vriddhiDay2Date);

console.log(`- Vriddhi Tithi Fixture (Repeated Tithi: ${vriddhi.repeated_tithi}):`);
console.log(`  Day 1 (${vriddhi.day1_sunrise_snapshot.date}) Sunrise Tithi Index: ${vriddhiPos1.tithiIdx} (Expected: ${vriddhi.day1_sunrise_snapshot.panchang_angas.tithi.index})`);
console.log(`  Day 2 (${vriddhi.day2_sunrise_snapshot.date}) Sunrise Tithi Index: ${vriddhiPos2.tithiIdx} (Expected: ${vriddhi.day2_sunrise_snapshot.panchang_angas.tithi.index})`);

const vriddhiPass = (
  vriddhiPos1.tithiIdx === vriddhi.repeated_tithi &&
  vriddhiPos2.tithiIdx === vriddhi.repeated_tithi
);
console.log(`  Status: ${vriddhiPass ? 'PASS ✓ (Tithi repeated across consecutive sunrises)' : 'FAIL ✗'}`);

// 1.3 Adhik Maas Verification
console.log(`- Adhik Maas Fixture (2026 Jyeshtha Adhik Maas):`);
const midAdhikDate = new Date('2026-05-30T12:00:00.000Z');
const preAdhikDate = new Date('2026-04-15T12:00:00.000Z');
const postAdhikDate = new Date('2026-07-15T12:00:00.000Z');

const midAdhikPos = calculatePanchangPositionsCore(midAdhikDate);
const preAdhikPos = calculatePanchangPositionsCore(preAdhikDate);
const postAdhikPos = calculatePanchangPositionsCore(postAdhikDate);

console.log(`  Pre-Adhik (April 2026): isAdhik = ${preAdhikPos.isAdhik} (Expected: false)`);
console.log(`  Mid-Adhik (May 30, 2026): isAdhik = ${midAdhikPos.isAdhik} (Expected: true)`);
console.log(`  Post-Adhik (July 2026): isAdhik = ${postAdhikPos.isAdhik} (Expected: false)`);

const adhikPass = (preAdhikPos.isAdhik === false && midAdhikPos.isAdhik === true && postAdhikPos.isAdhik === false);
console.log(`  Status: ${adhikPass ? 'PASS ✓' : 'FAIL ✗'}`);

// ---------------------------------------------------------------------------
// 2. 365-Day Continuous Simulation (Kanpur 2026)
// ---------------------------------------------------------------------------
console.log('\n2. Executing 365-Day Continuous Panchang Simulation (Kanpur 2026):');
console.log('----------------------------------------------------------------');

const kanpurLat = 26.4499;
const kanpurLon = 80.3319;
let daysTested = 0;
let errorsEncountered = 0;

const tStart = performance.now();
const dailyLatencies = [];

for (let day = 0; day < 365; day++) {
  const curDate = new Date(Date.UTC(2026, 0, 1 + day, 6, 0, 0));
  const tDayStart = performance.now();

  try {
    const panchang = getPanchangForDate(kanpurLat, kanpurLon, curDate);

    // Validation Assertions
    if (!panchang.sunrise || !panchang.sunrise.includes('AM')) {
      throw new Error(`Invalid sunrise: ${panchang.sunrise}`);
    }

    if (!panchang.sunset || !panchang.sunset.includes('PM')) {
      throw new Error(`Invalid sunset: ${panchang.sunset}`);
    }

    if (!panchang.hinduDate || typeof panchang.hinduDate.tithi.value !== 'number') {
      throw new Error(`Missing or invalid Tithi value`);
    }

    if (!panchang.hinduDate.nakshatra || !panchang.hinduDate.nakshatra.name) {
      throw new Error(`Missing Nakshatra name`);
    }

    if (panchang.choghadiya.length !== 16) {
      throw new Error(`Expected 16 Choghadiya intervals, got ${panchang.choghadiya.length}`);
    }

    if (panchang.hora.length !== 24) {
      throw new Error(`Expected 24 Hora intervals, got ${panchang.hora.length}`);
    }

    // Check for any NaN or undefined in planetary coordinates
    if (panchang.planetaryPositions) {
      for (const p of panchang.planetaryPositions) {
        if (isNaN(p.longitude) || isNaN(p.speed)) {
          throw new Error(`NaN in planet ${p.name}`);
        }
      }
    }

    daysTested++;
  } catch (err) {
    errorsEncountered++;
    console.error(`Error on day ${day} (${curDate.toISOString()}): ${err.message}`);
    if (errorsEncountered > 5) break;
  }

  const tDayEnd = performance.now();
  dailyLatencies.push(tDayEnd - tDayStart);
}

const tTotal = performance.now() - tStart;
const avgLatency = tTotal / daysTested;
const maxLatency = Math.max(...dailyLatencies);
const throughputDaysPerSec = (daysTested / (tTotal / 1000)).toFixed(1);

console.log(`- Total Days Evaluated: ${daysTested} / 365`);
console.log(`- Simulation Errors / Crashes: ${errorsEncountered}`);
console.log(`- Total Simulation Time: ${tTotal.toFixed(1)} ms`);
console.log(`- Average Single-Day Latency: ${avgLatency.toFixed(3)} ms (Target: < 15 ms)`);
console.log(`- Max Single-Day Latency: ${maxLatency.toFixed(3)} ms`);
console.log(`- Calculation Throughput: ${throughputDaysPerSec} days/sec (Target: > 100 days/sec)`);

const simPass = (errorsEncountered === 0 && daysTested === 365 && avgLatency < 15.0);
console.log(`- Simulation Status: ${simPass ? 'PASS ✓' : 'FAIL ✗'}`);

// ---------------------------------------------------------------------------
// 3. Complete Annual Festival Engine Stress Check
// ---------------------------------------------------------------------------
console.log('\n3. Evaluating Hindu Festival Engine for 2026:');
console.log('----------------------------------------------------------------');
const tFestStart = performance.now();
const festivals = getFestivalsForYear(2026, kanpurLat, kanpurLon);
const tFestEnd = performance.now();

console.log(`- Total Festivals & Vrats Computed: ${festivals.length}`);
console.log(`- Festival Engine Runtime: ${(tFestEnd - tFestStart).toFixed(1)} ms`);

const keyFestivals = ['Diwali (Deepawali)', 'Maha Shivratri', 'Krishna Janmashtami', 'Holi'];
let allKeyFound = true;
for (const kf of keyFestivals) {
  const f = festivals.find(item => item.name.toLowerCase().includes(kf.toLowerCase()) || item.hindiName.includes(kf));
  if (f) {
    console.log(`  ✓ Found ${kf} on ${f.date}`);
  } else {
    console.error(`  ✗ Missing key festival: ${kf}`);
    allKeyFound = false;
  }
}

console.log('\n================================================================');
const allGate6Pass = kshayaPass && vriddhiPass && adhikPass && simPass && allKeyFound;

if (allGate6Pass) {
  console.log('🎉 AUDIT GATE 6: PASSED (ALL DEEP STRESS & AUDIT GATES 100% GREEN) 🎉');
  console.log('================================================================');
  process.exit(0);
} else {
  console.error('❌ AUDIT GATE 6: FAILED');
  console.log('================================================================');
  process.exit(1);
}
