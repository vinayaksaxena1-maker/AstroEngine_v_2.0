# Sanatan Astro Engine 🕉️⏱️

> **100% Proprietary High-Precision Vedic Panchang, Astronomical & Hindu Festival Engine**  
> Powered by JPL-calibrated planetary models and the MIT-licensed `astronomy-engine`. 100% free of copyleft (AGPLv3 / Swiss Ephemeris) code, zero WebAssembly overhead, sub-millisecond synchronous execution, and designed for closed-source commercial applications across web, mobile, smartwatches, and servers.

---

## 🌟 Key Highlights

- **100% Proprietary & Commercial Ready:** Fully closed-source proprietary codebase with zero AGPLv3 or copyleft dependencies. Safe for embedded systems, mobile apps, and proprietary SaaS.
- **Microsecond Synchronous Latency:** No WebAssembly compilation delays, no external ephemeris binary files, and zero thread-marshalling lag. Computations run synchronously in under 1 millisecond.
- **Master Plug-and-Play Facade (`calculateCompleteHoroscope`):** Single entrypoint delivering Kundli, Shodashvarga (D1-D60), Shadbala, Ashtakavarga SAV 337, Dashas, Parashari Yogas/Doshas, Classical Vedic Remedies, and multi-style SVG charts.
- **Classical Vedic Remedies Engine:** Automated prescription of Ratna (Life/Lucky/Benefic stones with strict Dusthana/Maraka prohibitions), 1-14 Mukhi Rudrakshas, Beej/Gayatri Mantras, and Charity/Daan Upay.
- **Calibrated Chitrapaksha Lahiri Ayanamsa:** Calibrated official Indian Calendar Reform Committee (1956) Lahiri Ayanamsa matching Swiss Ephemeris within 0.00 arcseconds (< 1 milli-arcsecond).
- **Vedic Panchang Essentials:** Instant calculation of **Tithi**, **Nakshatra**, **Yoga**, **Karana**, **Paksha**, **Samvat** (Vikram, Shaka, Gujarati), **Ritu**, **Ayana**, and **Praviste**.
- **Special Yogas:** 28 Anandadi Yogas (*Anand, Siddhi, Amrita, Aadal, etc.*), Dwipushkar / Tripushkar Yoga, Dagda Tithi, Agni Vaas, and Shiva Vaas.
- **Rhythms of Time:** Complete day & night **Chaughadiya** (16 intervals) and **Hora** (24 intervals) timelines with auspiciousness classifications.
- **Inauspicious Periods:** Precise calculation of **Rahu Kaal**, **Yamagandam**, **Gulik Kaal**, **Varjyam**, **Durmuhurat**, and **Bhadra** (Mukha, Puchha, Vaas).
- **100+ Dynamic Hindu Festivals & Vrats:** 100% rule-based calculation for all 12 monthly Vrats (*Ekadashi, Pradosh, Sankashti, Vinayaka, Kalashtami, Masik Shivaratri, Purnima, Amavasya*) and major annual festivals (*Diwali, Janmashtami, Raksha Bandhan, Mahashivratri, Holi, Navratri, Makar Sankranti, etc.*).
- **Auspicious Muhurat Evaluation:** Automated suitability scoring (0-100) for major life milestones (*Griha Pravesh, Vivah, Vehicle Purchase, Property/Business*).
- **Planetary Transits (Gochar):** High-precision sidereal planetary longitude calculations and sign-change transit forecasts.
- **Offline Reverse Geocoder:** Embedded coordinate database for hundreds of Indian cities with offline Haversine proximity lookup.

---

## 📖 App Developer Guide
For complete integration documentation, timezone best practices, data dictionary, and React/Vue/Mobile UI recipes, see [docs/APP_DEVELOPER_GUIDE.md](docs/APP_DEVELOPER_GUIDE.md).

---

## 📦 Installation

```bash
npm install github:vinayaksaxena1-maker/Sanatan_Watch_AstroEngine
```

---

## 🚀 Quick Start Examples

### 0. Complete Horoscope Facade & Vedic Remedies (One-Line Call)

```typescript
import { calculateCompleteHoroscope } from 'sanatan-astro-engine';

const horoscope = calculateCompleteHoroscope({
  date: '1995-05-15',
  time: '14:30:00',
  timezoneOffset: 5.5, // IST (+5.5) or pass ianaTimezone: 'Asia/Kolkata'
  latitude: 28.6139,
  longitude: 77.2090
});

console.log('Lagna Sign:', horoscope.ascendant.sign);
console.log('Recommended Gemstone:', horoscope.remedies.gemstones.lifeStone?.name);
console.log('Target Rudraksha:', horoscope.remedies.rudraksha.primary.mukhiName);
console.log('North Indian SVG Chart:\n', horoscope.charts.northIndianSvg);
```

### 1. Compute Full Vedic Panchang for Any Location & Date

```typescript
import { getPanchangForDate, findClosestCity } from 'sanatan-astro-engine';

// 1. Locate city or provide custom coordinates
const coords = findClosestCity(28.6139, 77.2090); // New Delhi
console.log(`Panchang for: ${coords.name}, ${coords.state}`);

// 2. Calculate Panchang for today
const today = new Date();
const panchang = getPanchangForDate(28.6139, 77.2090, today);

console.log('Date:', panchang.date);
console.log('Sunrise:', panchang.sunrise, '| Sunset:', panchang.sunset);
console.log('Tithi:', panchang.hinduDate.tithi.name, `(${panchang.hinduDate.tithi.value})`);
console.log('Nakshatra:', panchang.hinduDate.nakshatra.name);
console.log('Yoga:', panchang.hinduDate.yoga.name);
console.log('Karana:', panchang.hinduDate.karana.name);
console.log('Rahu Kaal:', `${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}`);
console.log('Current Anandadi Yoga:', panchang.anandadiYoga?.nameHindi);
```

---

### 2. Hindu Festivals & Vrats Engine

```typescript
import { getFestivalsForYear, getFestivalsForMonth } from 'sanatan-astro-engine';

// Compute all Hindu festivals for year 2026
const festivals2026 = getFestivalsForYear(2026, 28.6139, 77.2090);
console.log(`Found ${festivals2026.length} festivals and vrats in 2026`);

// Get festivals for a specific month (e.g. October 2026)
const octoberFestivals = getFestivalsForMonth(2026, 9); // month index 0-11
octoberFestivals.forEach(fest => {
  console.log(`${fest.name} (${fest.hindiName}) -> ${fest.date}`);
});
```

---

### 3. Auspicious Muhurat Suitability

```typescript
import { getPanchangForDate, checkMuhurats } from 'sanatan-astro-engine';

const panchang = getPanchangForDate(28.6139, 77.2090, new Date());
const suitability = checkMuhurats(panchang);

suitability.forEach(m => {
  console.log(`${m.name}: ${m.isSuitable ? '✅ Suitable' : '❌ Avoid'} (Score: ${m.score}/100)`);
  m.reasons.forEach(r => console.log(`  - ${r}`));
});
```

---

### 4. Chaughadiya & Hora Timelines

```typescript
import { getPanchangForDate, getChoghadiyaPresentationData } from 'sanatan-astro-engine';

const panchang = getPanchangForDate(28.6139, 77.2090, new Date());

// Inspect Day & Night Chaughadiya intervals (16 intervals total)
panchang.choghadiya.forEach(ch => {
  console.log(`${ch.name} (${ch.type}) [${ch.quality}]: ${ch.startTime} - ${ch.endTime}`);
});

// Real-time active Choghadiya highlight
const activeChoghadiya = getChoghadiyaPresentationData(panchang, new Date());
console.log(`Active Period: ${activeChoghadiya.displayStartTime} - ${activeChoghadiya.displayEndTime}`);
```

---

## 🛠️ Build and Verify

```bash
# Install dependencies
npm install

# Build bundles and declaration files
npm run build

# Run automated tests
npm test

# Run audit verification gates
npm run audit:phase2
npm run audit:phase3
npm run audit:phase4
npm run audit:phase6
```

---

## ⚖️ License

**Proprietary & Confidential.**  
Copyright (c) 2026 Vinayak Saxena. All Rights Reserved.  
Third-party permissive licenses and notices are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
