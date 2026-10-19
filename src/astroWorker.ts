/**
 * Sanatan Astro Worker (100% Closed-Source / Proprietary Worker)
 *
 * Web Worker wrapper around Sanatan JPL Engine for background / async worker environments.
 * Free of Swiss Ephemeris (libswe / swisseph-wasm).
 */

import {
  calculateSolarTimesCore,
  calculateMoonTimesCore,
  calculatePanchangPositionsCore
} from './core/sanatan_jpl_bridge';
import { calculateNatalChart } from './kundli/houseCusps';

self.postMessage({
  type: 'PROGRESS',
  stage: 'WORKER_PARSED',
  message: 'Sanatan JPL Astro Worker loaded and parsed successfully.'
});

self.onmessage = async (event: MessageEvent) => {
  const { type, key, lat, lon, date, offsetHours, options } = event.data;

  if (type === 'INIT') {
    self.postMessage({
      type: 'PROGRESS',
      stage: 'ENGINE_READY',
      message: 'Sanatan JPL Engine initialized.'
    });
    self.postMessage({
      type: 'READY',
      timings: {
        wasmTime: 0,
        ephemerisTime: 0
      }
    });
    return;
  }

  if (type === 'INIT_FAIL') {
    self.postMessage({ type: 'ERROR', message: `Initialization failed: ${event.data.error}` });
    return;
  }

  try {
    const parsedDate = new Date(date);

    if (type === 'CALCULATE_SOLAR') {
      const data = calculateSolarTimesCore(lat, lon, parsedDate, offsetHours);
      self.postMessage({ type: 'RESULT', key, data });
      return;
    }

    if (type === 'CALCULATE_MOON') {
      const data = calculateMoonTimesCore(lat, lon, parsedDate, offsetHours);
      self.postMessage({ type: 'RESULT', key, data });
      return;
    }

    if (type === 'CALCULATE_COORDINATES') {
      const data = calculatePanchangPositionsCore(parsedDate, offsetHours);
      self.postMessage({ type: 'RESULT', key, data });
      return;
    }

    if (type === 'CALCULATE_NATAL') {
      const data = calculateNatalChart(parsedDate, lat, lon, options);
      self.postMessage({ type: 'RESULT', key, data });
      return;
    }
  } catch (err: any) {
    self.postMessage({
      type: 'ERROR',
      key,
      message: err.message || String(err)
    });
  }
};
