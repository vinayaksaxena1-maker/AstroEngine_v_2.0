# Samay Ghadi - Astro Worker Engine (Part B)

This directory contains the standalone, isolated **Vedic Panchang & Astronomical calculation Web Worker** (Part B) for the Samay Ghadi project.

## AGPL v3 Licensing & Open Source Compliance
To comply with the GNU Affero General Public License (AGPL) v3 while allowing the main application interface (Part A) to remain closed-source and proprietary, this calculation engine operates inside a fully isolated background thread (Web Worker). 
Communication between the main application and this worker occurs exclusively via asynchronous serializable JSON message payloads (`postMessage`). There is no static code linking between Part A and Part B.

## Contents
* `astroWorker.ts`: The standalone Web Worker script performing high-precision Swiss Ephemeris calculations.
* `LICENSE`: The GNU AGPL v3 license copy.

## Calculations Covered
1. **Solar Times:** Sunrise and Sunset times using official Swiss Ephemeris horizontal limb and atmospheric refraction standards (`swe_rise_trans`).
2. **Moon Times:** Moonrise and Moonset times (`swe_rise_trans`).
3. **Panchang Coordinates:** High-precision Sun and Moon sidereal coordinates used to derive Tithi, Nakshatra, Yoga, and Karana indices.

## Compilation and Deployment
To compile this worker standalone:
1. Ensure Node.js and npm are installed.
2. Install dependencies:
   ```bash
   npm install swisseph-wasm
   ```
3. Compile using Vite, Rollup, or any standard TypeScript compiler supporting ES module workers.
