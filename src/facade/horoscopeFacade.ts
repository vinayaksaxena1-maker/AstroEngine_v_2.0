/**
 * Sanatan Astro Engine: Master Horoscope Facade
 *
 * Provides a single plug-and-play entrypoint (`calculateCompleteHoroscope`)
 * unifying Kundli casting, Shodashvarga, Shadbala, Ashtakavarga, Dashas,
 * Predictive synthesis, Classical Vedic remedies, and SVG chart rendering.
 */

import {
  HoroscopeInput,
  EngineMetadata,
  resolveHoroscopeInput
} from './inputResolver';
import {
  calculateNatalChart,
  NatalChartData,
  NatalPlanetDetail,
  BhavaCuspDetail
} from '../kundli/houseCusps';
import {
  calculateShodashvarga,
  ShodashvargaReport
} from '../vargas/shodashvarga';
import {
  calculateShadbala,
  ShadbalaSummary
} from '../shadbala/shadbalaEngine';
import {
  calculateAshtakavarga,
  FullAshtakavargaReport
} from '../ashtakavarga/ashtakavargaEngine';
import {
  calculateAllDashas,
  FullDashaReport
} from '../dasha/dashaEngine';
import {
  evaluateParashariYogas,
  evaluateMaleficDoshas,
  calculateKPSubLord,
  calculateJaiminiDetails,
  calculateVarshphal,
  evaluateLalKitab,
  YogaEvaluation,
  DoshaEvaluation,
  VarshphalReport,
  LalKitabAnalysis
} from '../synthesis/predictiveEngine';
import {
  generateVedicRemedies,
  VedicRemediesResult
} from '../remedies/remedyEngine';
import {
  generateNorthIndianChart
} from '../kundli/charts/northIndianChart';
import {
  generateSouthIndianChart
} from '../kundli/charts/southIndianChart';
import {
  generateEastIndianChart
} from '../kundli/charts/eastIndianChart';
import {
  renderNorthIndianSvg,
  renderSouthIndianSvg,
  renderEastIndianSvg
} from './svgRenderers';

export type HouseCuspDetail = BhavaCuspDetail;

export interface ExtendedPlanetDetail extends NatalPlanetDetail {
  rashiHouse: number;        // 1 to 12 (Position relative to Lagna Sign / Whole Sign)
  bhavaChalitHouse: number;  // 1 to 12 (Determined by Sripati/Placidus cusp Sandhi boundaries)
}

export interface CompleteHoroscopeResult {
  metadata: EngineMetadata;
  ascendant: {
    sign: string;
    signIndex: number;
    degree: number;
    formatted: string;
    nakshatra: string;
    pada: number;
  };
  planets: Array<ExtendedPlanetDetail>;
  cusps: Array<HouseCuspDetail>;
  vargas: ShodashvargaReport;
  shadbala: ShadbalaSummary;
  ashtakavarga: FullAshtakavargaReport;
  dashas: {
    vimshottari: FullDashaReport['vimshottari'];
    yogini: FullDashaReport['yogini'];
    ashtottari: FullDashaReport['ashtottari'];
    chara: FullDashaReport['chara'];
  };
  predictive: {
    yogas: YogaEvaluation[];
    doshas: DoshaEvaluation[];
    kp: ReturnType<typeof calculateKPSubLord>;
    jaimini: ReturnType<typeof calculateJaiminiDetails>;
    tajik: VarshphalReport;
    lalKitab: LalKitabAnalysis;
  };
  remedies: VedicRemediesResult;
  charts: {
    northIndianSvg: string;
    southIndianSvg: string;
    eastIndianSvg: string;
  };
}

/**
 * Determines exact Bhava Chalit house (1 to 12) from Sripati/Placidus cusp sandhi boundaries.
 */
export function findBhavaChalitHouse(longitude: number, cusps: BhavaCuspDetail[]): number {
  const normLon = (longitude % 360 + 360) % 360;

  for (const c of cusps) {
    const start = (c.startLongitude % 360 + 360) % 360;
    const end = (c.endLongitude % 360 + 360) % 360;

    if (start < end) {
      if (normLon >= start && normLon < end) {
        return c.houseNumber;
      }
    } else {
      // Spans across 0° Aries
      if (normLon >= start || normLon < end) {
        return c.houseNumber;
      }
    }
  }

  // Fallback: Closest Bhava Madhya
  let closestHouse = 1;
  let minDiff = 360;
  for (const c of cusps) {
    const diff = Math.min(
      Math.abs(normLon - c.midLongitude),
      360 - Math.abs(normLon - c.midLongitude)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closestHouse = c.houseNumber;
    }
  }
  return closestHouse;
}

/**
 * Master Facade: Calculates a complete Vedic Horoscope in a single high-performance call.
 * Accepts either UTC Date or civil date/time with timezone and provides full calculations,
 * dual-house classifications, Vedic remedies, and SVG charts.
 */
export function calculateCompleteHoroscope(input: HoroscopeInput): CompleteHoroscopeResult {
  // 1. Resolve and validate input coordinates, timestamps, and metadata
  const { resolvedDate, metadata, houseSystem, ayanamshaSystem } = resolveHoroscopeInput(input);

  // 2. Compute Natal Horizons, Cusps, and Graha Positions
  const chart: NatalChartData = calculateNatalChart(
    resolvedDate,
    metadata.coordinates.lat,
    metadata.coordinates.lng,
    { houseSystem, ayanamshaSystem }
  );

  // 3. Classify dual house placements: rashiHouse vs bhavaChalitHouse
  const extendedPlanets: ExtendedPlanetDetail[] = chart.planets.map(p => {
    const rashiHouse = p.houseOccupied; // Whole sign from Lagna
    const bhavaChalitHouse = findBhavaChalitHouse(p.longitude, chart.cusps);
    return {
      ...p,
      rashiHouse,
      bhavaChalitHouse
    };
  });

  // 4. Compute Shodashvarga (16 Divisional Charts D1 to D60 + Vargottama)
  const vargas = calculateShodashvarga(chart);

  // 5. Compute Shadbala (6-fold virupas, Rupas, Avasthas, Bhava Balas)
  const shadbala = calculateShadbala(chart);

  // 6. Compute Ashtakavarga (BAV 8 tables, SAV 337 Invariant, Shodhana)
  const ashtakavarga = calculateAshtakavarga(chart);

  // 7. Compute Multi-System Dashas (Vimshottari 4 levels, Yogini, Ashtottari, Chara)
  const allDashas = calculateAllDashas(chart);

  // 8. Compute Predictive Syntheses
  const yogas = evaluateParashariYogas(chart);
  const doshas = evaluateMaleficDoshas(chart);
  const kp = calculateKPSubLord(chart.ascendant.longitude);
  const jaimini = calculateJaiminiDetails(chart);
  const tajik = calculateVarshphal(chart, 1);
  const lalKitab = evaluateLalKitab(chart);

  // 9. Classical Vedic Remedies (Gemstones, Rudraksha, Mantras, Charity)
  const remedies = generateVedicRemedies({
    chart,
    shadbala,
    doshas,
    yogas
  });

  // 10. Generate Multi-Style Presentation Charts & Render SVGs
  const northChart = generateNorthIndianChart(chart);
  const southChart = generateSouthIndianChart(chart);
  const eastChart = generateEastIndianChart(chart);

  const northIndianSvg = renderNorthIndianSvg(northChart);
  const southIndianSvg = renderSouthIndianSvg(southChart);
  const eastIndianSvg = renderEastIndianSvg(eastChart);

  return {
    metadata,
    ascendant: {
      sign: chart.ascendant.signName,
      signIndex: chart.ascendant.signIndex,
      degree: chart.ascendant.degreeInSign,
      formatted: chart.ascendant.degreeFormatted,
      nakshatra: chart.ascendant.nakshatraName,
      pada: chart.ascendant.nakshatraPada
    },
    planets: extendedPlanets,
    cusps: chart.cusps,
    vargas,
    shadbala,
    ashtakavarga,
    dashas: {
      vimshottari: allDashas.vimshottari,
      yogini: allDashas.yogini,
      ashtottari: allDashas.ashtottari,
      chara: allDashas.chara
    },
    predictive: {
      yogas,
      doshas,
      kp,
      jaimini,
      tajik,
      lalKitab
    },
    remedies,
    charts: {
      northIndianSvg,
      southIndianSvg,
      eastIndianSvg
    }
  };
}
