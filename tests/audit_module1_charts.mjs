import { calculateNatalChart } from '../dist/kundli/houseCusps.js';
import { generateNorthIndianChart } from '../dist/kundli/charts/northIndianChart.js';
import { generateSouthIndianChart } from '../dist/kundli/charts/southIndianChart.js';
import { generateEastIndianChart } from '../dist/kundli/charts/eastIndianChart.js';
import { calculateDrishtiAndConjunctions } from '../dist/kundli/drishtiEngine.js';

console.log('================================================================');
console.log('MAIN MODULE 1 AUDIT GATE: Kundli Casting & Multi-Style Charts');
console.log('Testing Parity across North, South, East Indian & Drishti Models');
console.log('================================================================\n');

const testCities = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, date: new Date('1990-05-15T06:30:00.000Z') },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, date: new Date('1985-11-20T14:15:00.000Z') },
  { name: 'Ujjain', lat: 23.1765, lon: 75.7885, date: new Date('1975-03-21T00:00:00.000Z') },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, date: new Date('2000-01-01T12:00:00.000Z') },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, date: new Date('1995-08-15T09:00:00.000Z') },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, date: new Date('1988-10-24T18:30:00.000Z') },
  { name: 'Srinagar', lat: 34.0837, lon: 74.7973, date: new Date('2010-04-14T05:00:00.000Z') },
  { name: 'London', lat: 51.5074, lon: -0.1278, date: new Date('1980-07-04T12:00:00.000Z') },
  { name: 'New York', lat: 40.7128, lon: -74.0060, date: new Date('1965-11-12T03:30:00.000Z') },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, date: new Date('2024-06-21T03:45:00.000Z') }
];

let totalChecks = 0;
let passedChecks = 0;
const failureLog = [];

for (const tc of testCities) {
  totalChecks++;
  const natal = calculateNatalChart(tc.date, tc.lat, tc.lon);
  const north = generateNorthIndianChart(natal);
  const south = generateSouthIndianChart(natal);
  const east = generateEastIndianChart(natal);
  const drishti = calculateDrishtiAndConjunctions(natal.planets);

  let cityPassed = true;

  // Check 1: North Indian House 1 sign must match Ascendant
  if (north.houses[0].signNumber !== natal.ascendant.signIndex + 1) {
    failureLog.push(`${tc.name}: North Indian House 1 sign (${north.houses[0].signNumber}) does not match Ascendant (${natal.ascendant.signIndex + 1})`);
    cityPassed = false;
  }

  // Check 2: South Indian Ascendant marker must match Ascendant sign
  const southAscBox = south.signBoxes.find(b => b.isAscendant);
  if (!southAscBox || southAscBox.signNumber !== natal.ascendant.signIndex + 1) {
    failureLog.push(`${tc.name}: South Indian Ascendant sign marker mismatch`);
    cityPassed = false;
  }

  // Check 3: East Indian Ascendant marker must match Ascendant sign
  const eastAscBox = east.signBoxes.find(b => b.isAscendant);
  if (!eastAscBox || eastAscBox.signNumber !== natal.ascendant.signIndex + 1) {
    failureLog.push(`${tc.name}: East Indian Ascendant sign marker mismatch`);
    cityPassed = false;
  }

  // Check 4: Cross-format planetary distribution parity
  for (let s = 1; s <= 12; s++) {
    const northHouseForSign = north.houses.find(h => h.signNumber === s);
    const southBoxForSign = south.signBoxes.find(b => b.signNumber === s);
    const eastBoxForSign = east.signBoxes.find(b => b.signNumber === s);

    const countNorth = northHouseForSign?.planets.length || 0;
    const countSouth = southBoxForSign?.planets.length || 0;
    const countEast = eastBoxForSign?.planets.length || 0;

    if (countNorth !== countSouth || countSouth !== countEast) {
      failureLog.push(`${tc.name}: Planet count mismatch for sign ${s}: North=${countNorth}, South=${countSouth}, East=${countEast}`);
      cityPassed = false;
      break;
    }
  }

  // Check 5: Drishti matrix must have aspects
  if (drishti.aspects.length === 0) {
    failureLog.push(`${tc.name}: Drishti matrix returned zero aspects`);
    cityPassed = false;
  }

  if (cityPassed) {
    passedChecks++;
    console.log(`[PASS ✓] ${tc.name.padEnd(12)} | Lagna: ${natal.ascendant.signName.padEnd(12)} | North/South/East Parity: 100% | Aspects: ${drishti.aspects.length} | Conjunctions: ${drishti.conjunctions.length}`);
  } else {
    console.error(`[FAIL ✗] ${tc.name.padEnd(12)} Failed checks`);
  }
}

console.log('\n================================================================');
console.log('MAIN MODULE 1 AUDIT REPORT (GREEN / RED):');
console.log('================================================================');
const isGreen = passedChecks === totalChecks && failureLog.length === 0;

if (isGreen) {
  console.log('STATUS: [GREEN - 100% PASS]');
  console.log(`Verified Cities: ${passedChecks} / ${totalChecks} (100% Parity)`);
  console.log('North Indian, South Indian, East Indian Charts & Drishti Engine are 100% Synchronized!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error('STATUS: [RED - AUDIT FAILED]');
  console.error('Failures encountered:');
  failureLog.forEach(f => console.error(` - ${f}`));
  console.log('================================================================\n');
  process.exit(1);
}
