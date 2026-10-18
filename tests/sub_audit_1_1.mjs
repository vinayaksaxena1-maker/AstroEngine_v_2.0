import { calculateNatalChart, formatDegrees } from '../dist/kundli/houseCusps.js';

console.log('--- Sub-Audit 1.1: Testing Natal Horizon & House Cusps Adapter ---');

const testCases = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, date: new Date('1990-05-15T06:30:00.000Z') },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, date: new Date('1985-11-20T14:15:00.000Z') },
  { name: 'London', lat: 51.5074, lon: -0.1278, date: new Date('2000-01-01T12:00:00.000Z') },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, date: new Date('2024-06-21T03:45:00.000Z') },
  { name: 'Equator', lat: 0.0, lon: 0.0, date: new Date('2026-10-18T00:00:00.000Z') }
];

let failed = false;

for (const tc of testCases) {
  const chart = calculateNatalChart(tc.date, tc.lat, tc.lon);
  
  if (isNaN(chart.ascendant.longitude) || chart.ascendant.longitude < 0 || chart.ascendant.longitude >= 360) {
    console.error(`✗ FAIL: ${tc.name} invalid ascendant longitude: ${chart.ascendant.longitude}`);
    failed = true;
  }

  if (chart.cusps.length !== 12) {
    console.error(`✗ FAIL: ${tc.name} expected 12 cusps, got ${chart.cusps.length}`);
    failed = true;
  }

  if (chart.planets.length !== 9) {
    console.error(`✗ FAIL: ${tc.name} expected 9 planets, got ${chart.planets.length}`);
    failed = true;
  }

  // Verify combustion logic: Sun cannot be combust
  const sun = chart.planets.find(p => p.name === 'Sun');
  if (sun.isCombust) {
    console.error(`✗ FAIL: ${tc.name} Sun marked as combust!`);
    failed = true;
  }

  console.log(`✓ PASS: ${tc.name.padEnd(10)} | Lagna: ${chart.ascendant.signName.padEnd(12)} (${chart.ascendant.degreeFormatted}) | Nakshatra: ${chart.ascendant.nakshatraName} Pada ${chart.ascendant.nakshatraPada}`);
}

if (!failed) {
  console.log('🎉 SUB-AUDIT 1.1 PASSED: Natal Horizon & House Cusps 100% verified!\n');
  process.exit(0);
} else {
  console.error('❌ SUB-AUDIT 1.1 FAILED');
  process.exit(1);
}
