# Sanatan Astro Engine 🕉️⏱️

> **High-Precision Vedic Panchang, Astronomical & Hindu Festival Calculation Engine**  
> Powered by C-WASM compiled **Swiss Ephemeris** and high-precision Meeus astronomical algorithms. Designed for complete offline execution, extreme speed, and modular reuse across web, mobile, and server applications.

---

## 🌟 Key Highlights

- **Vedic Panchang Essentials:** Instant calculation of **Tithi**, **Nakshatra**, **Yoga**, **Karana**, **Paksha**, **Samvat** (Vikram, Shaka, Gujarati), **Ritu**, **Ayana**, and **Praviste**.
- **Special Yogas:** 28 Anandadi Yogas (*Anand, Siddhi, Amrita, Aadal, etc.*), Dwipushkar / Tripushkar Yoga, Dagda Tithi, Agni Vaas, and Shiva Vaas.
- **Rhythms of Time:** Complete day & night **Chaughadiya** (16 intervals) and **Hora** (24 intervals) timelines with auspiciousness classifications.
- **Inauspicious Periods:** Precise calculation of **Rahu Kaal**, **Yamagandam**, **Gulik Kaal**, **Varjyam**, **Durmuhurat**, and **Bhadra** (Mukha, Puchha, Vaas).
- **100+ Dynamic Hindu Festivals & Vrats:** 100% rule-based calculation for all 12 monthly Vrats (*Ekadashi, Pradosh, Sankashti, Vinayaka, Kalashtami, Masik Shivaratri, Purnima, Amavasya*) and major annual festivals (*Diwali, Janmashtami, Raksha Bandhan, Mahashivratri, Holi, Navratri, Makar Sankranti, etc.*).
- **Auspicious Muhurat Evaluation:** Automated suitability scoring (0-100) for major life milestones (*Griha Pravesh, Vivah, Vehicle Purchase, Property/Business*).
- **Planetary Transits (Gochar):** High-precision sidereal planetary longitude calculations and sign-change transit forecasts.
- **Offline Reverse Geocoder:** Embedded coordinate database for hundreds of Indian cities with offline Haversine proximity lookup.
- **Dual Licensing & AGPL v3 Isolation:** Complete Web Worker isolation layer compliant with AGPL v3 boundaries.

---

## 📦 Installation

You can install this engine directly into any Node.js, Vite, React, React Native, or Next.js project using Git:

```bash
npm install github:vinayaksaxena1-maker/Sanatan_Watch_AstroEngine
```

Or using Yarn / PNPM:

```bash
yarn add github:vinayaksaxena1-maker/Sanatan_Watch_AstroEngine
# or
pnpm add github:vinayaksaxena1-maker/Sanatan_Watch_AstroEngine
```

---

## 🚀 Quick Start Examples

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

To build the package and execute the full test suite locally:

```bash
# Install dependencies
npm install

# Build bundles and declaration files
npm run build

# Run automated tests
npm test
```

---

## ⚖️ License & Open-Source Compliance

This engine utilizes the high-precision Swiss Ephemeris (`swisseph-wasm`) which is licensed under the **GNU AGPL v3**.

When incorporating this engine in proprietary commercial applications, ensure compliance by consuming it through isolated background execution (such as Web Workers or microservices) via decoupled message serialization.
