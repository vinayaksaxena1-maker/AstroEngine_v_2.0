/**
 * Sanatan Astro Engine
 * High-precision Vedic Panchang, Astronomical, and Hindu Festival Calculation Engine
 * Powered by Swiss Ephemeris WASM & AGPL v3 compliant architecture.
 *
 * @license AGPL-3.0-or-later
 * @author Vinayak Saxena
 */

// 1. Core Data Models and Types
export * from './types';

// 2. High-Precision Swiss Ephemeris Astronomical Engine & Worker Proxy
export {
  astronomicalEngine,
  registerEngineListener,
  isReady,
  isEngineCalculating,
  registerActiveExpectedKeys,
  isTimeoutTriggered,
  getEngineProgressStage,
  getRetryCount,
  getLastDiagnosticInfo,
  isMaxRetriesReached,
  extendInitializationTimeout,
  retryEngineInitialization,
  registerPanchangCacheClearer
} from './astronomicalEngine';
export type {
  SolarTimes,
  MoonTimes,
  PlanetPosition,
  PanchangPositions,
  AstronomicalEngine
} from './astronomicalEngine';

// 3. Complete Vedic Panchang Calculations
export {
  getPanchangForDate,
  clearPanchangCache,
  getMuhuratsForPanchang,
  getChoghadiyaPresentationData,
  calculateIshtakala,
  calculatePaya,
  calculateDagdaTithi,
  calculateShivaVaas,
  calculateAgniVaas,
  calculatePushkarYog,
  calculateSolarTimes,
  TITHI_DETAILS,
  NAKSHATRA_DETAILS,
  YOGA_DETAILS,
  KARANA_DETAILS,
  MONTHS_ENGLISH_HINDI,
  INDIAN_CITIES,
  FESTVALS_PRESETS
} from './panchangCalc';

// 4. Hindu Festivals and Vrats Engine (100+ dynamic festival & vrat rules)
export {
  getFestivalsForDay,
  getFestivalsForYear,
  getFestivalsForMonth,
  getPanchangForFestivalDay
} from './festivalEngine';

// 5. Muhurat and Auspicious Event Timing Rules
export {
  checkMuhurats
} from './muhuratRules';
export type {
  MuhuratSuitability
} from './muhuratRules';

// 6. Planetary Transits and Gochar Calculations
export {
  calculateFutureTransits,
  getUpcomingTransits,
  SIGN_MAP,
  PLANET_MAP,
  TRANSIT_PREDICTIONS
} from './transitEngine';
export type {
  TransitItem
} from './transitEngine';

// 7. Geographic Databases & Offline Reverse Geocoding
export {
  EXTENDED_INDIAN_CITIES
} from './indianCities';
export {
  findClosestCity
} from './geocoder';
export {
  detectDeviceLocation
} from './locationService';

// 8. Bilingual Dictionaries and Translations (Hindi / English)
export {
  translations
} from './translations';

// 9. Diagnostic Logger & Engine Benchmarks
export {
  EngineLogger
} from './engineLogger';

// 10. Automated Validation Suite
export {
  runBulkValidation
} from './validateEngine';
