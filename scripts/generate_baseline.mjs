import SwissEph from 'swisseph-wasm';
import fs from 'fs';
import path from 'path';

// Helper: Boundary Crossing Solver for Tithi, Nakshatra, Yoga, Karana
function safeCalcUt(swe, jd, body, flags) {
  try {
    const res = swe.calc_ut(jd, body, flags);
    if (res && typeof res[0] === 'number' && !isNaN(res[0])) {
      return res;
    }
  } catch (e) {}
  throw new Error(`Swiss Ephemeris calculation failed for body ${body} at JD ${jd}`);
}

function findBoundaryCrossing(swe, jdMidnight, type, targetVal) {
  let jd = jdMidnight + 0.5;
  let speed = 12.0;
  if (type === 'nakshatra') speed = 13.176;
  if (type === 'yoga') speed = 14.176;

  for (let iter = 0; iter < 12; iter++) {
    // 2 = SEFLG_SWIEPH, 4 = SEFLG_SPEED
    const sun = safeCalcUt(swe, jd, 0, 2 | 256);
    const moon = safeCalcUt(swe, jd, 1, 2 | 256);
    const ayanamsa = swe.get_ayanamsa_ut(jd);

    let val = 0;
    let currentSpeed = speed;

    if (type === 'tithi' || type === 'karana') {
      val = (moon[0] - sun[0] + 360) % 360;
      currentSpeed = moon[3] - sun[3];
    } else if (type === 'nakshatra') {
      val = (moon[0] - ayanamsa + 360) % 360;
      currentSpeed = moon[3];
    } else if (type === 'yoga') {
      val = (moon[0] - ayanamsa + sun[0] - ayanamsa + 720) % 360;
      currentSpeed = moon[3] + sun[3];
    }

    let err = targetVal - val;
    err = ((err + 180) % 360 + 360) % 360 - 180;

    if (Math.abs(err) < 0.000005) {
      return jd;
    }
    if (Math.abs(currentSpeed) < 0.0001) break;
    jd += err / currentSpeed;
  }
  return jd;
}

async function generateBaseline() {
  console.log('--- Initializing Swiss Ephemeris WASM ---');
  const swe = new SwissEph();
  await swe.initSwissEph();
  swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

  // Allocate C memory pointers for swe_rise_trans and swe_houses
  const geoposPtr = swe.SweModule._malloc(3 * 8);
  const tretPtr = swe.SweModule._malloc(4 * 8);
  const serrPtr = swe.SweModule._malloc(256);
  const cuspsPtr = swe.SweModule._malloc(13 * 8);
  const ascmcPtr = swe.SweModule._malloc(10 * 8);

  function getRiseTrans(jd, planet, lon, lat, alt, isRise) {
    swe.SweModule.HEAPF64[geoposPtr / 8] = lon;
    swe.SweModule.HEAPF64[geoposPtr / 8 + 1] = lat;
    swe.SweModule.HEAPF64[geoposPtr / 8 + 2] = alt;

    const epheflag = 2; // SEFLG_SWIEPH
    const rsmi = isRise ? 1 : 2;

    const retFlag = swe.SweModule.ccall(
      'swe_rise_trans',
      'number',
      ['number', 'number', 'pointer', 'number', 'number', 'pointer', 'number', 'number', 'pointer', 'pointer'],
      [jd, planet, 0, epheflag, rsmi, geoposPtr, 0, 0, tretPtr, serrPtr]
    );

    if (retFlag < 0) {
      return null;
    }
    return swe.SweModule.HEAPF64[tretPtr / 8];
  }

  function getHouses(jd, lat, lon) {
    // Porphyry: 'O' (Note: 'P' in SwissEph is Placidus)
    swe.SweModule.ccall(
      'swe_houses',
      'number',
      ['number', 'number', 'number', 'number', 'pointer', 'pointer'],
      [jd, lat, lon, 'O'.charCodeAt(0), cuspsPtr, ascmcPtr]
    );

    const cusps = [];
    for (let i = 1; i <= 12; i++) {
      cusps.push(swe.SweModule.HEAPF64[cuspsPtr / 8 + i]);
    }
    const ascmc = [];
    for (let i = 0; i < 10; i++) {
      ascmc.push(swe.SweModule.HEAPF64[ascmcPtr / 8 + i]);
    }
    return {
      cusps,
      ascendant: ascmc[0],
      mc: ascmc[1]
    };
  }

  function evaluateSnapshot(dateStr, lat, lon, options = {}) {
    const date = new Date(dateStr);
    const jd_ut = swe.julday(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
    );

    // Exact Ayanamsa: Mean (without nutation) & True (with nutation)
    // 2 = SEFLG_SWIEPH, 64*1024 = SEFLG_SIDEREAL, 1024 = SEFLG_NONUT
    const ayanamsa_true = swe.get_ayanamsa_ut(jd_ut);
    let ayanamsa_mean = ayanamsa_true;
    try {
      ayanamsa_mean = swe.get_ayanamsa_ex_ut(jd_ut, 2 | 1024);
    } catch (e) {
      // Fallback if ex is not available
      ayanamsa_mean = ayanamsa_true;
    }

    // Navagrahas Sidereal Longitudes & Speeds
    const bodies = [
      { id: swe.SE_SUN, name: 'Sun' },
      { id: swe.SE_MOON, name: 'Moon' },
      { id: swe.SE_MERCURY, name: 'Mercury' },
      { id: swe.SE_VENUS, name: 'Venus' },
      { id: swe.SE_MARS, name: 'Mars' },
      { id: swe.SE_JUPITER, name: 'Jupiter' },
      { id: swe.SE_SATURN, name: 'Saturn' },
      { id: swe.SE_MEAN_NODE, name: 'Mean_Rahu' },
      { id: swe.SE_TRUE_NODE, name: 'True_Rahu' }
    ];

    const grahas = {};
    for (const b of bodies) {
      const res = swe.calc_ut(jd_ut, b.id, 2 | 256 | 65536);
      grahas[b.name] = {
        longitude: res[0],
        speed: res[3],
        isRetrograde: res[3] < 0
      };
    }

    // Ketu is always Rahu + 180°
    grahas['Ketu'] = {
      longitude: (grahas['Mean_Rahu'].longitude + 180) % 360,
      speed: grahas['Mean_Rahu'].speed,
      isRetrograde: true
    };
    grahas['True_Ketu'] = {
      longitude: (grahas['True_Rahu'].longitude + 180) % 360,
      speed: grahas['True_Rahu'].speed,
      isRetrograde: true
    };

    // Horizon calculation (Sunrise, Sunset, Moonrise, Moonset)
    const jdMidnight = Math.floor(jd_ut - 0.5) + 0.5;
    const sunriseJd = getRiseTrans(jdMidnight, 0, lon, lat, 0, true);
    const sunsetJd = getRiseTrans(jdMidnight, 0, lon, lat, 0, false);
    const moonriseJd = getRiseTrans(jdMidnight, 1, lon, lat, 0, true);
    const moonsetJd = getRiseTrans(jdMidnight, 1, lon, lat, 0, false);

    const isPolar = (sunriseJd === null || sunsetJd === null);

    // Kundli / Bhava Cusps
    const houses = getHouses(jd_ut, lat, lon);
    const siderealCusps = houses.cusps.map(c => (c - ayanamsa_true + 360) % 360);
    const siderealAsc = (houses.ascendant - ayanamsa_true + 360) % 360;
    const siderealMC = (houses.mc - ayanamsa_true + 360) % 360;

    // Panchang Angas
    const sunSid = grahas['Sun'].longitude;
    const moonSid = grahas['Moon'].longitude;
    const diffNorm = (moonSid - sunSid + 360) % 360;

    const tithiIdx = Math.floor(diffNorm / 12);
    const nextTithiTarget = (tithiIdx + 1) * 12;
    const tithiEndJd = findBoundaryCrossing(swe, jdMidnight, 'tithi', nextTithiTarget);

    const naksIdx = Math.floor(moonSid / 13.333333333333334);
    const nextNaksTarget = (naksIdx + 1) * 13.333333333333334;
    const naksEndJd = findBoundaryCrossing(swe, jdMidnight, 'nakshatra', nextNaksTarget);

    const yogaLon = (moonSid + sunSid) % 360;
    const yogaIdx = Math.floor(yogaLon / 13.333333333333334);
    const nextYogaTarget = (yogaIdx + 1) * 13.333333333333334;
    const yogaEndJd = findBoundaryCrossing(swe, jdMidnight, 'yoga', nextYogaTarget);

    const karanaSec = Math.floor(diffNorm / 6);
    const nextKaranaTarget = (karanaSec + 1) * 6;
    const karanaEndJd = findBoundaryCrossing(swe, jdMidnight, 'karana', nextKaranaTarget);

    return {
      date: dateStr,
      lat,
      lon,
      jd_ut,
      ayanamsa_mean,
      ayanamsa_true,
      grahas,
      solar_times: {
        sunriseJd,
        sunsetJd,
        isPolar,
        sunriseUtc: sunriseJd ? new Date((sunriseJd - 2440587.5) * 86400000).toISOString() : null,
        sunsetUtc: sunsetJd ? new Date((sunsetJd - 2440587.5) * 86400000).toISOString() : null
      },
      moon_times: {
        moonriseJd,
        moonsetJd,
        moonriseUtc: moonriseJd ? new Date((moonriseJd - 2440587.5) * 86400000).toISOString() : null,
        moonsetUtc: moonsetJd ? new Date((moonsetJd - 2440587.5) * 86400000).toISOString() : null
      },
      kundli: {
        tropicalAsc: houses.ascendant,
        tropicalMC: houses.mc,
        siderealAsc,
        siderealMC,
        siderealCusps
      },
      panchang_angas: {
        tithi: { index: tithiIdx, endJd: tithiEndJd, endUtc: new Date((tithiEndJd - 2440587.5) * 86400000).toISOString() },
        nakshatra: { index: naksIdx, endJd: naksEndJd, endUtc: new Date((naksEndJd - 2440587.5) * 86400000).toISOString() },
        yoga: { index: yogaIdx, endJd: yogaEndJd, endUtc: new Date((yogaEndJd - 2440587.5) * 86400000).toISOString() },
        karana: { sec: karanaSec, endJd: karanaEndJd, endUtc: new Date((karanaEndJd - 2440587.5) * 86400000).toISOString() }
      }
    };
  }

  // Layer A: 12 Milestone Anchor Fixtures
  console.log('Generating Layer A: 12 Milestone Anchor Fixtures...');
  const anchors = {
    C1_Lahiri_1956: evaluateSnapshot('1956-03-21T00:00:00.000Z', 26.4499, 80.3319),
    C2_J2000_Epoch: evaluateSnapshot('2000-01-01T12:00:00.000Z', 25.3176, 82.9739),
    C3_Standard_2026: evaluateSnapshot('2026-10-18T00:00:00.000Z', 23.1765, 75.7885),
    C4_Amavasya_Wrap: evaluateSnapshot('2026-11-08T12:30:00.000Z', 28.6139, 77.2090),
    C5_Kanyakumari_Equinox: evaluateSnapshot('2026-03-20T00:30:00.000Z', 8.0883, 77.5385),
    C6_Tromso_MidnightSun: evaluateSnapshot('2026-06-21T12:00:00.000Z', 69.6492, 18.9553),
    C7_Tromso_PolarNight: evaluateSnapshot('2026-12-21T12:00:00.000Z', 69.6492, 18.9553),
    C8_Mars_Station: evaluateSnapshot('2027-01-11T00:00:00.000Z', 26.4499, 80.3319),
    C9_Mercury_Station: evaluateSnapshot('2026-11-14T00:00:00.000Z', 26.4499, 80.3319),
    C10_Solar_Eclipse: evaluateSnapshot('2026-02-17T12:00:00.000Z', 26.4499, 80.3319),
    C11_Lunar_Eclipse: evaluateSnapshot('2026-03-03T11:30:00.000Z', 25.3176, 82.9739),
    C12_Leap_Year: evaluateSnapshot('2024-02-29T23:59:00.000Z', 28.6139, 77.2090)
  };

  // Layer B: 72 Dense Statistical Grid Points (1st & 15th of each month 2025-2027 across 4 latitudes)
  console.log('Generating Layer B: 72 Dense Statistical Grid Points...');
  const denseGrid = [];
  const sampleCities = [
    { name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
    { name: 'Kanyakumari', lat: 8.0883, lon: 77.5385 },
    { name: 'New_Delhi', lat: 28.6139, lon: 77.2090 },
    { name: 'Srinagar', lat: 34.0837, lon: 74.7973 }
  ];

  let cityIndex = 0;
  for (let year of [2025, 2026, 2027]) {
    for (let month = 1; month <= 12; month++) {
      for (let day of [1, 15]) {
        const city = sampleCities[cityIndex % sampleCities.length];
        cityIndex++;
        const mStr = month.toString().padStart(2, '0');
        const dStr = day.toString().padStart(2, '0');
        const dateStr = `${year}-${mStr}-${dStr}T06:00:00.000Z`;
        denseGrid.push({
          city: city.name,
          snapshot: evaluateSnapshot(dateStr, city.lat, city.lon)
        });
      }
    }
  }

  // Layer C: Phenomenon Telemetry Fixtures
  console.log('Generating Layer C: Dedicated Phenomenon Fixtures with full telemetry...');
  
  // 1. Stationary Inflection Windows (7 daily steps)
  const marsStationWindow = [];
  for (let d = 8; d <= 14; d++) {
    const dStr = d.toString().padStart(2, '0');
    marsStationWindow.push(evaluateSnapshot(`2027-01-${dStr}T00:00:00.000Z`, 26.4499, 80.3319));
  }

  const mercuryStationWindow = [];
  for (let d = 11; d <= 17; d++) {
    const dStr = d.toString().padStart(2, '0');
    mercuryStationWindow.push(evaluateSnapshot(`2026-11-${dStr}T00:00:00.000Z`, 26.4499, 80.3319));
  }

  // 2. Kshaya Tithi Telemetry (Kanpur Jan 6-7: Tithi 18 omitted at sunrise)
  const kshaya_2026 = {
    day1_sunrise_snapshot: evaluateSnapshot('2026-01-06T01:27:33.601Z', 26.4499, 80.3319),
    day2_sunrise_snapshot: evaluateSnapshot('2026-01-07T01:27:42.499Z', 26.4499, 80.3319),
    skipped_tithi: 18,
    description: 'Tithi 18 started after Jan 6 sunrise and ended before Jan 7 sunrise'
  };

  // 3. Vriddhi Tithi Telemetry (Kanpur Jan 8-9: Tithi 20 repeated at sunrise)
  const vriddhi_2026 = {
    day1_sunrise_snapshot: evaluateSnapshot('2026-01-08T01:27:49.931Z', 26.4499, 80.3319),
    day2_sunrise_snapshot: evaluateSnapshot('2026-01-09T01:27:55.886Z', 26.4499, 80.3319),
    repeated_tithi: 20,
    description: 'Tithi 20 touched both Jan 8 and Jan 9 sunrises'
  };

  // 4. Adhik Maas Telemetry (2026-05-17 to 2026-06-15)
  // Record New Moon 1, New Moon 2, and Sun rashi transitions
  const adhik_maas_2026 = {
    amavasya1_snapshot: evaluateSnapshot('2026-05-16T19:01:00.000Z', 26.4499, 80.3319),
    amavasya2_snapshot: evaluateSnapshot('2026-06-15T04:54:00.000Z', 26.4499, 80.3319),
    description: 'Adhik Jyeshtha Maas with two Amavasyas in Vrishabha Solar Rashi'
  };

  const fullBaseline = {
    generated_at: new Date().toISOString(),
    swiss_ephemeris_version: swe.version(),
    swisseph_configuration: {
      epheflag: 'SEFLG_SWIEPH (2)',
      ayanamsa_mode: 'SE_SIDM_LAHIRI (1)',
      house_system: 'Porphyry/Sripati (P)'
    },
    layer_a_anchors: anchors,
    layer_b_dense_grid: denseGrid,
    layer_c_phenomena: {
      mars_station_window: marsStationWindow,
      mercury_station_window: mercuryStationWindow,
      kshaya_tithi_fixture: kshaya_2026,
      vriddhi_tithi_fixture: vriddhi_2026,
      adhik_maas_fixture: adhik_maas_2026
    }
  };

  const outPath = path.resolve('tests/fixtures/swiss_golden_baseline.json');
  fs.writeFileSync(outPath, JSON.stringify(fullBaseline, null, 2), 'utf8');
  console.log(`✓ SUCCESS: Baseline saved to ${outPath}`);
  console.log(`- Layer A Anchors count: ${Object.keys(anchors).length}`);
  console.log(`- Layer B Dense Grid count: ${denseGrid.length}`);
  console.log(`- Mars inflection steps: ${marsStationWindow.length}`);
  console.log(`- Mercury inflection steps: ${mercuryStationWindow.length}`);

  swe.close();
}

generateBaseline().catch(err => {
  console.error('FAILED to generate baseline:', err);
  process.exit(1);
});
