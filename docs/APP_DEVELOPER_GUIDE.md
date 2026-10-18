# Sanatan Astro Engine: App Developer Integration Guide

A single-call, high-precision Vedic Panchang, Horoscope, and Astrological Engine powered by 100% Clean-Room MIT/JPL orbital physics.

---

## 1. Quickstart (One-Line Facade)

Install or import the engine:
```typescript
import { calculateCompleteHoroscope } from 'sanatan-astro-engine';

// Format A: Direct civil date, time, and timezone offset
const horoscope = calculateCompleteHoroscope({
  date: '1995-05-15',
  time: '14:30:00',
  timezoneOffset: 5.5, // Indian Standard Time (IST)
  latitude: 28.6139,   // New Delhi
  longitude: 77.2090
});

console.log('Ascendant Sign:', horoscope.ascendant.sign);
console.log('Life Gemstone:', horoscope.remedies.gemstones.lifeStone?.name);
console.log('SAV Invariant:', horoscope.ashtakavarga.totalSAVPoints); // 337
```

Or pass a direct UTC instant:
```typescript
const horoscope = calculateCompleteHoroscope({
  birthDate: new Date('1995-05-15T09:00:00.000Z'),
  latitude: 28.6139,
  longitude: 77.2090
});
```

---

## 2. Timezone & Civil Time Resolution

Mobile devices and web frontends capture user input as civil strings (e.g., date picker `1995-05-15` and time picker `14:30`).

### Option A: Explicit Numeric Offset (Recommended for India & Standard Zones)
Pass `timezoneOffset` in decimal hours:
* **IST (India):** `+5.5`
* **Nepal:** `+5.75`
* **EST (New York Standard):** `-5.0`
* **EDT (New York Daylight):** `-4.0`
* **UTC / GMT:** `0`

```typescript
const result = calculateCompleteHoroscope({
  date: '2026-10-19',
  time: '04:15:00',
  timezoneOffset: 5.5,
  latitude: 25.3176,
  longitude: 82.9739
});
```

### Option B: IANA Timezone Identifier (Recommended for Daylight Saving Zones)
Pass `ianaTimezone` (e.g. `'Asia/Kolkata'`, `'America/New_York'`, `'Europe/London'`). The engine uses native `Intl` resolution with iterative boundary convergence to handle daylight saving time (DST) shifts:

```typescript
const result = calculateCompleteHoroscope({
  date: '2026-03-08',
  time: '03:30:00',
  ianaTimezone: 'America/New_York', // Automatically resolves EDT/EST shift
  latitude: 40.7128,
  longitude: -74.0060
});
```

### Option C: Direct UTC Instant
If your backend or database stores ISO 8601 UTC dates:
```typescript
const result = calculateCompleteHoroscope({
  birthDate: new Date(userRecord.birth_instant_utc),
  latitude: userRecord.lat,
  longitude: userRecord.lng
});
```

---

## 3. Input Validation Checklist & Guardrails

The engine protects against invalid geographic and temporal inputs with typed error classes:

```typescript
import {
  calculateCompleteHoroscope,
  InvalidCoordinateError,
  InvalidDateError
} from 'sanatan-astro-engine';

try {
  const result = calculateCompleteHoroscope({
    date: '2026-10-19',
    time: '12:00',
    timezoneOffset: 5.5,
    latitude: 95.0, // Error: Exceeds 90.0
    longitude: 77.2
  });
} catch (err) {
  if (err instanceof InvalidCoordinateError) {
    console.error('Coordinate error:', err.message);
  } else if (err instanceof InvalidDateError) {
    console.error('Date error:', err.message);
  }
}
```

### Validation Rules:
1. **Latitude:** Must be a finite number between `-90.0` and `+90.0`.
2. **Longitude:** Must be a finite number between `-180.0` and `+180.0`.
3. **Temporal Span:** The birth year must fall within `[1800, 2100]`.
4. **Date Format:** `YYYY-MM-DD` (e.g. `2024-04-14`).
5. **Time Format:** `HH:mm` or `HH:mm:ss` (24-hour clock).

---

## 4. Complete Data Dictionary (`CompleteHoroscopeResult`)

The master call returns a single, rich object:

```typescript
interface CompleteHoroscopeResult {
  // Calculation audit metadata and exact parameters
  metadata: {
    engineName: 'Sanatan Astro Engine';
    engineVersion: '1.1.0';
    calculatedAt: string;         // ISO timestamp of calculation
    resolvedUtcInstant: string;   // ISO timestamp of resolved birth instant
    julianDayUT: number;          // Julian Day UT
    ayanamshaType: string;        // 'Lahiri' | 'KP' | 'Raman'
    ayanamshaValue: number;       // e.g. 24.2384°
    houseSystemUsed: string;      // 'Sripati' | 'Placidus' | 'EqualHouse'
    coordinates: { lat: number; lng: number };
  };

  // Ascendant (Lagna)
  ascendant: {
    sign: string;         // e.g. "Cancer"
    signIndex: number;    // 0 to 11
    degree: number;       // Degree in sign (0° to 30°)
    formatted: string;    // e.g. "14°25'12\""
    nakshatra: string;    // e.g. "Pushya"
    pada: number;         // 1 to 4
  };

  // 9 Navagrahas with dual-house placement
  planets: Array<{
    name: string;             // 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'
    hindiName: string;        // 'सूर्य', 'चन्द्र', etc.
    longitude: number;        // 0° to 360° sidereal
    speed: number;            // deg/day (negative = retrograde)
    isRetrograde: boolean;
    isCombust: boolean;
    signIndex: number;        // 0 to 11
    signName: string;         // 'Aries' ... 'Pisces'
    degreeInSign: number;     // 0° to 30°
    degreeFormatted: string;  // e.g. "04°12'08\""
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    rashiHouse: number;       // 1 to 12 (Position relative to Lagna Sign)
    bhavaChalitHouse: number; // 1 to 12 (Exact Sripati/Placidus cusp Sandhi placement)
  }>;

  // 12 House Cusps
  cusps: Array<{
    houseNumber: number;      // 1 to 12
    startLongitude: number;   // Bhava Sandhi start (0° to 360°)
    midLongitude: number;     // Bhava Madhya / Peak cusp (0° to 360°)
    endLongitude: number;     // Bhava Sandhi end (0° to 360°)
    signName: string;
    signLord: string;
  }>;

  // 16 Divisional Charts (Shodashvarga D1 to D60 + Vargottama)
  vargas: ShodashvargaReport;

  // 6-Fold Planetary Strength & Avasthas
  shadbala: {
    planets: Array<PlanetShadbalaResult>;
    strongestPlanet: string;
    weakestPlanet: string;
    bhavaBala: Array<{ houseNumber: number; virupas: number; rupas: number }>;
  };

  // Ashtakavarga Engine (BAV 8 tables + SAV 337 sum invariant)
  ashtakavarga: {
    bav: Record<string, BAVMatrix>;
    sav: SAVMatrix;
    totalSAVPoints: 337;
    isSAV337InvariantMet: boolean;
  };

  // Dasha Systems Engine (4-Level Vimshottari + Yogini)
  dashas: {
    vimshottari: {
      balance: VimshottariBalance;
      timeline: MahadashaEntry[]; // 120-year timeline down to Sookshma
    };
    yogini: YoginiDashaReport;   // 36-year cycle
  };

  // Predictive & Specialized Modules
  predictive: {
    yogas: YogaEvaluation[];      // 300+ Parashari yogas
    doshas: DoshaEvaluation[];    // Manglik, Kaal Sarp, Pitra, Sade Sati
    kp: KPDetail;                 // Sign/Star/Sub/Sub-sub lords
    jaimini: JaiminiResult;       // 7 Chara Karakas + 12 Arudha Padas
    tajik: VarshphalReport;       // Solar return & Muntha
    lalKitab: LalKitabAnalysis;   // Sleeping houses & Masnooi planets
  };

  // Classical Vedic Remedies
  remedies: {
    gemstones: {
      lifeStone?: GemstoneRecommendation;
      luckyStone?: GemstoneRecommendation;
      beneficStone?: GemstoneRecommendation;
      prohibitedPlanets: string[]; // Strict Maraka & Dusthana prohibition
      generalGuidance: string;
    };
    rudraksha: {
      primary: RudrakshaRecommendation;
      secondary: RudrakshaRecommendation[];
      generalGuidance: string;
    };
    mantras: MantraRemedy[];
    charities: CharityRemedy[];
  };

  // Visual SVG Charts
  charts: {
    northIndianSvg: string; // Ready-to-render SVG string
    southIndianSvg: string; // Ready-to-render SVG string
    eastIndianSvg: string;  // Ready-to-render SVG string
  };
}
```

---

## 5. UI Rendering Recipes

The engine returns ready-to-render, standalone, responsive `<svg>` chart markup in `result.charts`.

### React / Next.js
```tsx
import React, { useState } from 'react';
import { calculateCompleteHoroscope } from 'sanatan-astro-engine';

export function KundliViewer({ birthData }) {
  const [chartStyle, setChartStyle] = useState<'north' | 'south' | 'east'>('north');
  const horoscope = calculateCompleteHoroscope(birthData);

  const svgContent =
    chartStyle === 'north'
      ? horoscope.charts.northIndianSvg
      : chartStyle === 'south'
      ? horoscope.charts.southIndianSvg
      : horoscope.charts.eastIndianSvg;

  return (
    <div className="kundli-container">
      <div className="chart-tabs">
        <button onClick={() => setChartStyle('north')}>North Indian</button>
        <button onClick={() => setChartStyle('south')}>South Indian</button>
        <button onClick={() => setChartStyle('east')}>East Indian</button>
      </div>
      <div
        className="svg-wrapper"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
```

### Vue 3
```vue
<template>
  <div class="kundli-card">
    <div class="chart-selector">
      <button :class="{ active: style === 'north' }" @click="style = 'north'">North Indian</button>
      <button :class="{ active: style === 'south' }" @click="style = 'south'">South Indian</button>
      <button :class="{ active: style === 'east' }" @click="style = 'east'">East Indian</button>
    </div>
    <div class="chart-canvas" v-html="currentSvg"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateCompleteHoroscope } from 'sanatan-astro-engine';

const props = defineProps<{ input: any }>();
const style = ref<'north' | 'south' | 'east'>('north');

const horoscope = computed(() => calculateCompleteHoroscope(props.input));

const currentSvg = computed(() => {
  if (style.value === 'south') return horoscope.value.charts.southIndianSvg;
  if (style.value === 'east') return horoscope.value.charts.eastIndianSvg;
  return horoscope.value.charts.northIndianSvg;
});
</script>
```

### Capacitor / React Native (WebView)
```tsx
import { WebView } from 'react-native-webview';

export function NativeKundliView({ horoscope }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; background: #fffdfa; }
          svg { width: 100vw; height: 100vw; max-width: 450px; max-height: 450px; }
        </style>
      </head>
      <body>
        ${horoscope.charts.northIndianSvg}
      </body>
    </html>
  `;

  return <WebView originWhitelist={['*']} source={{ html }} />;
}
```

---

## 6. Dual House Classification: `rashiHouse` vs `bhavaChalitHouse`

In classical Vedic astrology, house placement differs depending on the perspective:
1. **`rashiHouse` (Whole Sign / D1 Rashi Chart):**
   * House 1 is the whole sign of the Lagna (e.g. Leo $0^\circ$ to $30^\circ$).
   * Planet in Leo is always House 1.
   * Standard for Yogas, Dasha results, and Divisional vargas.
2. **`bhavaChalitHouse` (Bhava Chalit / Sripati Cusp System):**
   * Uses unequal quadrant trisection and Bhava Sandhi boundaries.
   * If Lagna is at Leo $28^\circ$, a planet at Leo $2^\circ$ may slip into the 12th Bhava Chalit house.
   * Crucial for predicting actual physical events and directional effects.

The engine provides **both** properties on every planet in `horoscope.planets`:
```typescript
const jupiter = horoscope.planets.find(p => p.name === 'Jupiter');
console.log('Rashi House:', jupiter.rashiHouse);             // e.g. 1
console.log('Bhava Chalit House:', jupiter.bhavaChalitHouse); // e.g. 12
```

---

## 7. Classical Vedic Remedies: Gemstones, Rudraksha, Mantras & Charity

The remedies engine (`horoscope.remedies`) automatically assesses planetary strength, house lordships, and doshas:

### Gemstones:
* Recommends:
  * **Life Stone (`lifeStone`):** Lagnesh (1st lord) for vitality.
  * **Lucky Stone (`luckyStone`):** Bhagyesh (9th lord) for fortune.
  * **Benefic Stone (`beneficStone`):** Vidyapathi (5th lord) for intellect.
* **Strict Maraka & Dusthana Prohibition:**
  * If a planet rules 6th, 8th, or 12th (Dusthanas) or 2nd or 7th (Marakas), the engine **strictly bars** its gemstone, protecting clients from adverse energetic amplification.

### Rudraksha:
* Targets the planet with the lowest Shadbala virupa ratio or severe combustion.
* Includes Mukhi number (1-14), deity, beeja mantra, and wearing instructions.

### Mantras & Charity:
* Prescribes exact classical japa counts (e.g., Jupiter 19,000, Saturn 23,000) and specific sattvic items for donation for active Sade Sati, Manglik, or Kaal Sarp doshas.
