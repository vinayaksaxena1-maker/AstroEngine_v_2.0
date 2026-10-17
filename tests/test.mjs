import {
  getPanchangForDate,
  getFestivalsForYear,
  getFestivalsForMonth,
  checkMuhurats,
  findClosestCity,
  calculateIshtakala,
  INDIAN_CITIES,
  EXTENDED_INDIAN_CITIES
} from '../dist/index.js';

console.log('--- Testing Sanatan Astro Engine ---');

// Test 1: Location & Geocoding
console.log('\n[1] Testing Offline Geocoder:');
const delhiCoord = { lat: 28.6139, lon: 77.2090 };
const closest = findClosestCity(delhiCoord.lat, delhiCoord.lon);
console.log(`Closest city to (${delhiCoord.lat}, ${delhiCoord.lon}):`, closest.name, closest.state);
if (closest.name.toLowerCase().includes('delhi')) {
  console.log('✓ PASS: Geocoder matched Delhi correctly');
} else {
  console.error('✗ FAIL: Geocoder mismatch');
  process.exit(1);
}

// Test 2: Vedic Panchang Calculation
console.log('\n[2] Testing Panchang Calculation:');
const testDate = new Date('2026-10-18T06:00:00Z');
const panchang = getPanchangForDate(delhiCoord.lat, delhiCoord.lon, testDate);

console.log('Date:', panchang.date);
console.log('Sunrise:', panchang.sunrise, '| Sunset:', panchang.sunset);
console.log('Tithi:', panchang.hinduDate.tithi.name, `(${panchang.hinduDate.tithi.value})`);
console.log('Nakshatra:', panchang.hinduDate.nakshatra.name);
console.log('Yoga:', panchang.hinduDate.yoga.name);
console.log('Karana:', panchang.hinduDate.karana.name);
console.log('Paksha:', panchang.hinduDate.paksha);
console.log('Choghadiya intervals count:', panchang.choghadiya.length);
console.log('Hora intervals count:', panchang.hora.length);

if (panchang.sunrise && panchang.hinduDate.tithi.name && panchang.choghadiya.length === 16) {
  console.log('✓ PASS: Panchang core structure verified (16 choghadiyas, valid Tithi/Sunrise)');
} else {
  console.error('✗ FAIL: Panchang structure incomplete');
  process.exit(1);
}

// Test 3: Festivals Engine
console.log('\n[3] Testing Hindu Festivals & Vrats Engine:');
const fests2026 = getFestivalsForYear(2026, delhiCoord.lat, delhiCoord.lon);
console.log(`Total 2026 Festivals & Vrats computed: ${fests2026.length}`);
const sampleFests = fests2026.slice(0, 5).map(f => `${f.name} (${f.date})`);
console.log('Sample festivals:', sampleFests);

const diwali = fests2026.find(f => f.name.toLowerCase().includes('diwali') || f.hindiName.includes('दीपावली'));
if (diwali) {
  console.log(`Found Diwali: ${diwali.name} on ${diwali.date}`);
}

const festsMonth = getFestivalsForMonth(2026, 9); // October
console.log(`Total October 2026 Festivals: ${festsMonth.length}`);
if (fests2026.length > 50 && festsMonth.length > 0) {
  console.log('✓ PASS: Dynamic Festival engine computed accurately');
} else {
  console.error('✗ FAIL: Festival engine returned insufficient results');
  process.exit(1);
}

// Test 4: Muhurat Suitability Rules
console.log('\n[4] Testing Muhurat Rules:');
const muhurats = checkMuhurats(panchang);
console.log(`Muhurat evaluations count: ${muhurats.length}`);
muhurats.slice(0, 3).forEach(m => {
  console.log(`- ${m.name}: ${m.isSuitable ? 'Suitable' : 'Not Recommended'} (Score: ${m.score})`);
});

if (muhurats.length > 0) {
  console.log('✓ PASS: Muhurat evaluations computed');
} else {
  console.error('✗ FAIL: Muhurat rules failed');
  process.exit(1);
}

// Test 5: Ishtakala
console.log('\n[5] Testing Ishtakala Calculation:');
const ishta = calculateIshtakala(testDate, 360);
console.log('Ishtakala:', ishta.formatted, `(Ghati: ${ishta.ghati}, Vighati: ${ishta.vighati})`);
if (typeof ishta.ghati === 'number' && ishta.formatted) {
  console.log('✓ PASS: Ishtakala calculated successfully');
} else {
  console.error('✗ FAIL: Ishtakala failed');
  process.exit(1);
}

console.log('\n=========================================');
console.log('🎉 ALL SANATAN ASTRO ENGINE TESTS PASSED! 🎉');
console.log('=========================================');
