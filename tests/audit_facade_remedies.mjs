/**
 * AUDIT SUITE: MASTER HOROSCOPE FACADE & VEDIC REMEDIES ENGINE
 *
 * Evaluates the 5 mandatory test gates:
 * 1. Timezone Equivalence Gate (UTC Date vs Civil + Offset vs IANA)
 * 2. Input Guardrail Gate (Invalid coordinates, out-of-range dates, typed errors)
 * 3. Remedy Safety Gate (Strict prohibition: No 6th, 8th, or 12th house lords as gemstones)
 * 4. Invariant 337 Gate (Sarvashtakavarga exact sum 337 across all charts)
 * 5. Latency SLA Gate (Average calculation time < 10 ms across 10 consecutive full runs)
 */

import {
  calculateCompleteHoroscope,
  InvalidCoordinateError,
  InvalidDateError,
  SIGN_LORDS
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
console.log('  AUDIT GATE: MASTER FACADE & VEDIC REMEDIES TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// GATE 1: TIMEZONE EQUIVALENCE GATE
// -----------------------------------------------------------------------------
console.log('>>> TEST GATE 1: TIMEZONE EQUIVALENCE GATE');

// Case 1.1: New Delhi (IST +5.5)
const utcInstantDelhi = new Date('2026-10-19T06:30:00.000Z');
const chartFromUtc = calculateCompleteHoroscope({
  birthDate: utcInstantDelhi,
  latitude: 28.6139,
  longitude: 77.2090
});

const chartFromOffset = calculateCompleteHoroscope({
  date: '2026-10-19',
  time: '12:00:00',
  timezoneOffset: 5.5,
  latitude: 28.6139,
  longitude: 77.2090
});

const chartFromIana = calculateCompleteHoroscope({
  date: '2026-10-19',
  time: '12:00:00',
  ianaTimezone: 'Asia/Kolkata',
  latitude: 28.6139,
  longitude: 77.2090
});

// Assert Ascendant equivalence (< 0.0001 deg)
const ascDiffOffset = Math.abs(chartFromUtc.ascendant.degree - chartFromOffset.ascendant.degree);
const ascDiffIana = Math.abs(chartFromUtc.ascendant.degree - chartFromIana.ascendant.degree);
assert(ascDiffOffset < 0.0001, `Ascendant match between UTC Date and Offset: diff = ${ascDiffOffset.toFixed(7)}°`);
assert(ascDiffIana < 0.0001, `Ascendant match between UTC Date and IANA: diff = ${ascDiffIana.toFixed(7)}°`);

// Assert all 9 Grahas longitudes match exactly
for (let p = 0; p < chartFromUtc.planets.length; p++) {
  const pName = chartFromUtc.planets[p].name;
  const lonUtc = chartFromUtc.planets[p].longitude;
  const lonOffset = chartFromOffset.planets[p].longitude;
  const lonIana = chartFromIana.planets[p].longitude;

  const diff1 = Math.abs(lonUtc - lonOffset);
  const diff2 = Math.abs(lonUtc - lonIana);

  assert(diff1 < 0.0001, `${pName} longitude matches between UTC and Offset (< 0.0001°): diff = ${diff1.toFixed(7)}°`);
  assert(diff2 < 0.0001, `${pName} longitude matches between UTC and IANA (< 0.0001°): diff = ${diff2.toFixed(7)}°`);
}

// Case 1.2: New York (Negative offset -5.0 / IANA America/New_York)
const utcInstantNy = new Date('2026-10-19T16:00:00.000Z');
const chartNyUtc = calculateCompleteHoroscope({
  birthDate: utcInstantNy,
  latitude: 40.7128,
  longitude: -74.0060
});

const chartNyIana = calculateCompleteHoroscope({
  date: '2026-10-19',
  time: '12:00:00',
  ianaTimezone: 'America/New_York',
  latitude: 40.7128,
  longitude: -74.0060
});

const ascNyDiff = Math.abs(chartNyUtc.ascendant.degree - chartNyIana.ascendant.degree);
assert(ascNyDiff < 0.0001, `New York Ascendant match between UTC and IANA: diff = ${ascNyDiff.toFixed(7)}°`);

// -----------------------------------------------------------------------------
// GATE 2: INPUT GUARDRAIL GATE
// -----------------------------------------------------------------------------
console.log('\n>>> TEST GATE 2: INPUT GUARDRAIL GATE');

// 2.1: Invalid Latitude (> 90.0)
let latErrorThrown = false;
try {
  calculateCompleteHoroscope({
    date: '2026-10-19',
    time: '12:00:00',
    latitude: 95.0,
    longitude: 77.2
  });
} catch (e) {
  if (e instanceof InvalidCoordinateError) {
    latErrorThrown = true;
  }
}
assert(latErrorThrown, 'Latitude 95.0 triggers InvalidCoordinateError');

// 2.2: Invalid Longitude (< -180.0)
let lngErrorThrown = false;
try {
  calculateCompleteHoroscope({
    date: '2026-10-19',
    time: '12:00:00',
    latitude: 28.6,
    longitude: -195.0
  });
} catch (e) {
  if (e instanceof InvalidCoordinateError) {
    lngErrorThrown = true;
  }
}
assert(lngErrorThrown, 'Longitude -195.0 triggers InvalidCoordinateError');

// 2.3: Year out of bounds (1750 < 1800)
let yearEarlyErrorThrown = false;
try {
  calculateCompleteHoroscope({
    date: '1750-01-01',
    time: '12:00:00',
    latitude: 28.6,
    longitude: 77.2
  });
} catch (e) {
  if (e instanceof InvalidDateError) {
    yearEarlyErrorThrown = true;
  }
}
assert(yearEarlyErrorThrown, 'Year 1750 triggers InvalidDateError ([1800, 2100] bound)');

// 2.4: Year out of bounds (2150 > 2100)
let yearLateErrorThrown = false;
try {
  calculateCompleteHoroscope({
    date: '2150-01-01',
    time: '12:00:00',
    latitude: 28.6,
    longitude: 77.2
  });
} catch (e) {
  if (e instanceof InvalidDateError) {
    yearLateErrorThrown = true;
  }
}
assert(yearLateErrorThrown, 'Year 2150 triggers InvalidDateError ([1800, 2100] bound)');

// 2.5: Missing both birthDate and civil date/time
let missingDateErrorThrown = false;
try {
  calculateCompleteHoroscope({
    latitude: 28.6,
    longitude: 77.2
  });
} catch (e) {
  if (e instanceof InvalidDateError) {
    missingDateErrorThrown = true;
  }
}
assert(missingDateErrorThrown, 'Missing date input triggers InvalidDateError');

// -----------------------------------------------------------------------------
// GATE 3: REMEDY SAFETY GATE (STRICT DUSTHANA PROHIBITION)
// -----------------------------------------------------------------------------
console.log('\n>>> TEST GATE 3: REMEDY SAFETY GATE (STRICT DUSTHANA PROHIBITION)');

// We test 24 sample charts spanning different times of day to cover all 12 Lagnas
const testCharts = [];
for (let h = 0; h < 24; h += 2) {
  const chart = calculateCompleteHoroscope({
    date: '2026-05-15',
    time: `${String(h).padStart(2, '0')}:30:00`,
    timezoneOffset: 5.5,
    latitude: 28.6139,
    longitude: 77.2090
  });
  testCharts.push(chart);
}

for (let i = 0; i < testCharts.length; i++) {
  const c = testCharts[i];
  const lagnaSignIdx = c.ascendant.signIndex;
  const lagnaSignName = c.ascendant.sign;

  // Find lords of 6th, 8th, 12th houses
  const lord6 = SIGN_LORDS[(lagnaSignIdx + 5) % 12];
  const lord8 = SIGN_LORDS[(lagnaSignIdx + 7) % 12];
  const lord12 = SIGN_LORDS[(lagnaSignIdx + 11) % 12];
  const dusthanaLords = [lord6, lord8, lord12];

  const gems = c.remedies.gemstones;
  const recs = [gems.lifeStone, gems.luckyStone, gems.beneficStone].filter(Boolean);

  for (const r of recs) {
    const isLordOfDusthana = dusthanaLords.includes(r.rulingPlanet);
    assert(
      !isLordOfDusthana,
      `[Lagna: ${lagnaSignName}] ${r.type} (${r.name} - ${r.rulingPlanet}) is NOT a lord of 6th(${lord6}), 8th(${lord8}), or 12th(${lord12})`
    );
  }
}

// -----------------------------------------------------------------------------
// GATE 4: INVARIANT 337 GATE
// -----------------------------------------------------------------------------
console.log('\n>>> TEST GATE 4: INVARIANT 337 GATE');

for (let i = 0; i < testCharts.length; i++) {
  const c = testCharts[i];
  const savSum = c.ashtakavarga.sav.bindusBySign.reduce((a, b) => a + b, 0);
  assert(
    savSum === 337 && c.ashtakavarga.totalSAVPoints === 337 && c.ashtakavarga.isSAV337InvariantMet,
    `Chart #${i + 1} (Lagna: ${c.ascendant.sign}): SAV Total Points = ${c.ashtakavarga.totalSAVPoints} (Exact Invariant 337)`
  );
}

// -----------------------------------------------------------------------------
// GATE 5: LATENCY SLA GATE (< 10 ms AVERAGE)
// -----------------------------------------------------------------------------
console.log('\n>>> TEST GATE 5: LATENCY SLA GATE (< 10 ms)');

const timings = [];
// 10 consecutive full horoscope calculations
for (let i = 0; i < 10; i++) {
  const t0 = performance.now();
  calculateCompleteHoroscope({
    date: '2026-10-19',
    time: `${String((i * 2 + 1) % 24).padStart(2, '0')}:15:30`,
    timezoneOffset: 5.5,
    latitude: 28.6139,
    longitude: 77.2090
  });
  const t1 = performance.now();
  timings.push(t1 - t0);
}

const avgLatency = timings.reduce((a, b) => a + b, 0) / timings.length;
console.log(`  Timings across 10 runs (ms): [${timings.map(t => t.toFixed(2)).join(', ')}]`);
console.log(`  Average Latency: ${avgLatency.toFixed(2)} ms`);

assert(avgLatency < 10.0, `Average Latency per Full Horoscope calculation (${avgLatency.toFixed(2)} ms) is < 10.0 ms SLA`);

// -----------------------------------------------------------------------------
// ADDITIONAL STRUCTURAL & PRESENTATION INTEGRITY CHECKS
// -----------------------------------------------------------------------------
console.log('\n>>> ADDITIONAL STRUCTURAL CHECKS');

const sampleChart = testCharts[0];

// Check Dual House Classification
for (const p of sampleChart.planets) {
  assert(
    p.rashiHouse >= 1 && p.rashiHouse <= 12,
    `${p.name} rashiHouse (${p.rashiHouse}) is between 1 and 12`
  );
  assert(
    p.bhavaChalitHouse >= 1 && p.bhavaChalitHouse <= 12,
    `${p.name} bhavaChalitHouse (${p.bhavaChalitHouse}) is between 1 and 12`
  );
}

// Check Charts SVG output
assert(
  sampleChart.charts.northIndianSvg.startsWith('<svg') && sampleChart.charts.northIndianSvg.includes('</svg>'),
  'North Indian SVG generated successfully'
);
assert(
  sampleChart.charts.southIndianSvg.startsWith('<svg') && sampleChart.charts.southIndianSvg.includes('</svg>'),
  'South Indian SVG generated successfully'
);
assert(
  sampleChart.charts.eastIndianSvg.startsWith('<svg') && sampleChart.charts.eastIndianSvg.includes('</svg>'),
  'East Indian SVG generated successfully'
);

// Check Rudraksha & Mantras
assert(
  sampleChart.remedies.rudraksha.primary && sampleChart.remedies.rudraksha.primary.mukhi >= 1,
  `Primary Rudraksha assigned: ${sampleChart.remedies.rudraksha.primary.mukhiName}`
);
assert(
  sampleChart.remedies.mantras.length > 0,
  `Mantras populated (${sampleChart.remedies.mantras.length} mantras generated)`
);
assert(
  sampleChart.remedies.charities.length > 0,
  `Charity remedies populated (${sampleChart.remedies.charities.length} charities generated)`
);

// Summary Report
console.log('\n================================================================');
console.log('  AUDIT SUMMARY REPORT');
console.log('================================================================');
console.log(`  Total Checks Evaluated : ${totalChecks}`);
console.log(`  Passed Checks          : ${passedChecks}`);
console.log(`  Failed Checks          : ${failedChecks}`);
console.log(`  Status                 : ${failedChecks === 0 ? '[100% GREEN - ALL GATES PASSED]' : '[RED - AUDIT FAILED]'}`);
console.log('================================================================');

if (failedChecks > 0) {
  process.exit(1);
}
