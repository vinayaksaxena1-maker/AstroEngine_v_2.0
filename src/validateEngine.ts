import { getPanchangForDate } from './panchangCalc';
import { astronomicalEngine } from './astronomicalEngine';

export async function runBulkValidation() {
  console.log('[Validation Suite] Starting bulk validation of 500 random dates (2026-2030)...');

  const startDate = new Date('2026-01-01T00:00:00Z');
  const endDate = new Date('2030-12-31T23:59:59Z');
  const startMs = startDate.getTime();
  const rangeMs = endDate.getTime() - startMs;

  const testDates: Date[] = [];
  for (let i = 0; i < 500; i++) {
    const randomMs = startMs + Math.random() * rangeMs;
    testDates.push(new Date(randomMs));
  }

  let successCount = 0;
  let assertionFailCount = 0;
  const lat = 28.6139; // New Delhi
  const lon = 77.2090;


  // Process sequentially to let the worker resolve caches and trigger React renders safely
  for (let i = 0; i < testDates.length; i++) {
    const date = testDates[i];
    
    // Slight delay to allow Web Worker message serialization loop to catch up
    await new Promise((resolve) => setTimeout(resolve, 15));

    try {
      const panchang = getPanchangForDate(lat, lon, date);
      const realPos = astronomicalEngine.getPanchangPositions(date);

      
      // Assertion 1: Verify basic schema structure is correctly populated
      if (
        !panchang.sunrise || 
        !panchang.sunset || 
        !panchang.hinduDate.tithi.endTime || 
        !panchang.hinduDate.nakshatra.endTime
      ) {
        throw new Error('Panchang basic fields are missing or unpopulated.');
      }

      // Assertion 2: Verify indices are within strict boundaries
      if (realPos.tithiIdx < 0 || realPos.tithiIdx >= 30) {
        throw new Error(`Tithi index out of bounds: ${realPos.tithiIdx}`);
      }
      if (realPos.naksIdx < 0 || realPos.naksIdx >= 27) {
        throw new Error(`Nakshatra index out of bounds: ${realPos.naksIdx}`);
      }
      if (realPos.yogaIdx < 0 || realPos.yogaIdx >= 27) {
        throw new Error(`Yoga index out of bounds: ${realPos.yogaIdx}`);
      }
      if (realPos.karanaVal < 0 || realPos.karanaVal > 10) {
        throw new Error(`Karana value out of bounds: ${realPos.karanaVal}`);
      }

      // Assertion 3: Verify planetary longitude boundaries (0-360)
      for (const planet of realPos.planets) {
        if (planet.longitude < 0 || planet.longitude >= 360) {
          throw new Error(`Planet ${planet.name} longitude out of bounds: ${planet.longitude}°`);
        }
      }

      // Assertion 4: Verify Rahu and Ketu are in 180° opposition
      const rahu = realPos.planets.find(p => p.name === 'Rahu');
      const ketu = realPos.planets.find(p => p.name === 'Ketu');
      if (rahu && ketu) {
        const diff = Math.abs(rahu.longitude - ketu.longitude);
        const oppositeDiff = Math.abs((diff + 180) % 360 - 180);
        if (oppositeDiff > 0.05) {
          throw new Error(`Rahu and Ketu are not in 180° opposition. Difference is ${diff.toFixed(2)}°`);
        }
      }

      // Assertion 5: Verify realistic planetary speeds
      const sun = realPos.planets.find(p => p.name === 'Sun');
      const moon = realPos.planets.find(p => p.name === 'Moon');
      if (sun && (sun.speed < 0.95 || sun.speed > 1.02)) {
        throw new Error(`Sun speed is physically unrealistic: ${sun.speed.toFixed(4)}°/day`);
      }
      if (moon && (moon.speed < 11.5 || moon.speed > 15.5)) {
        throw new Error(`Moon speed is physically unrealistic: ${moon.speed.toFixed(4)}°/day`);
      }



      successCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`[Validation Suite] Processed ${i + 1}/500 cases...`);
      }
    } catch (e) {
      assertionFailCount++;
      console.error(`[Validation Suite] Assertion failed at index ${i} on date ${date}:`, e);
    }
  }

  const isSuiteSuccess = assertionFailCount === 0 && successCount === testDates.length;

  console.log('==================================================');
  console.log('=== BULK VALIDATION REPORT ===');
  console.log(`Total Cases Tested: ${testDates.length}`);
  console.log(`Successful Computations & Assertions: ${successCount} (${(successCount / testDates.length * 100).toFixed(1)}%)`);
  console.log(`Failed Assertions/Errors: ${assertionFailCount}`);
  console.log(`Status: ${isSuiteSuccess ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log('==================================================');
}
