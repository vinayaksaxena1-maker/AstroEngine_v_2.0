/**
 * Sanatan Astro Engine
 * High-precision Vedic Panchang, Astronomical, and Hindu Festival Calculation Engine
 * Powered by 100% Closed-Source Proprietary Sanatan JPL Bridge & MIT astronomy-engine.
 *
 * @license UNLICENSED (Proprietary / All Rights Reserved)
 * @author Vinayak Saxena
 */

// 1. Core Data Models and Types
export * from './types';

// 2. High-Precision Proprietary JPL Astronomical Engine & Compatibility Proxy
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

// 3. Low-Level Astronomical & Ephemeris Bridge
export {
  drik_calc_ut,
  drik_rise_trans,
  drik_houses,
  drik_get_ayanamsa_ut,
  drik_julday,
  drik_revjul,
  drik_set_sid_mode,
  swe_calc_ut,
  swe_rise_trans,
  swe_houses,
  swe_get_ayanamsa_ut,
  swe_get_ayanamsa,
  swe_julday,
  swe_revjul,
  swe_set_sid_mode,
  calculateSolarTimesCore,
  calculateMoonTimesCore,
  calculatePanchangPositionsCore,
  calculateTimezoneOffset,
  findBoundaryCrossing,
  findNewMoonJd,
  SE_SUN,
  SE_MOON,
  SE_MERCURY,
  SE_VENUS,
  SE_MARS,
  SE_JUPITER,
  SE_SATURN,
  SE_MEAN_NODE,
  SE_TRUE_NODE,
  SE_KETU,
  SEFLG_SWIEPH,
  SEFLG_SPEED,
  SEFLG_SIDEREAL,
  SE_SIDM_LAHIRI
} from './core/sanatan_jpl_bridge';

// 4. Complete Vedic Panchang Calculations
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

// 5. Hindu Festivals and Vrats Engine (100+ dynamic festival & vrat rules)
export {
  getFestivalsForDay,
  getFestivalsForYear,
  getFestivalsForMonth,
  getPanchangForFestivalDay
} from './festivalEngine';

// 6. Muhurat and Auspicious Event Timing Rules
export {
  checkMuhurats
} from './muhuratRules';
export type {
  MuhuratSuitability
} from './muhuratRules';

// 7. Planetary Transits and Gochar Calculations
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

// 8. Geographic Databases & Offline Reverse Geocoding
export {
  EXTENDED_INDIAN_CITIES
} from './indianCities';
export {
  findClosestCity
} from './geocoder';
export {
  detectDeviceLocation
} from './locationService';

// 9. Bilingual Dictionaries and Translations (Hindi / English)
export {
  translations
} from './translations';

// 10. Diagnostic Logger & Engine Benchmarks
export {
  EngineLogger
} from './engineLogger';

// 11. Automated Validation Suite
export {
  runBulkValidation
} from './validateEngine';

// 12. Kundli Core & Multi-Style Presentation Charts
export * from './kundli/houseCusps';
export * from './kundli/charts/northIndianChart';
export * from './kundli/charts/southIndianChart';
export * from './kundli/charts/eastIndianChart';
export * from './kundli/drishtiEngine';

// 13. Shodashvarga (16 Divisional Charts) Engine
export * from './vargas/shodashvarga';

// 14. Shadbala & Planetary Avasthas Engine
export * from './shadbala/shadbalaEngine';

// 15. Ashtakavarga Engine
export * from './ashtakavarga/ashtakavargaEngine';

// 16. Dasha Systems Engine (Vimshottari, Yogini, Ashtottari, Chara)
export * from './dasha/dashaEngine';

// 17. Predictive Synthesis & Specialized Systems (KP, Jaimini, Tajik, Lal Kitab, Panch Pakshi)
export * from './synthesis/predictiveEngine';

// 18. Master Plug-and-Play Facade, Input Resolver & Vedic Remedies Engine
export * from './facade/inputResolver';
export * from './facade/svgRenderers';
export * from './facade/horoscopeFacade';
export * from './remedies/remedyEngine';

