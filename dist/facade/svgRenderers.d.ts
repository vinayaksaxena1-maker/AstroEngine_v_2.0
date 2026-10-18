/**
 * Visual Presentation Engine: SVG Generators for Vedic Astrology Charts
 *
 * Generates standalone, production-ready, responsive SVGs for:
 * 1. North Indian (Diamond / Kendra-centric) Chart
 * 2. South Indian (Fixed-Zodiac / Box-centric) Chart
 * 3. East Indian (Bengali / Odia) Chart
 */
import { NorthIndianChartModel } from '../kundli/charts/northIndianChart';
import { SouthIndianChartModel } from '../kundli/charts/southIndianChart';
import { EastIndianChartModel } from '../kundli/charts/eastIndianChart';
/**
 * Renders a full standalone SVG string for North Indian Diamond Chart
 */
export declare function renderNorthIndianSvg(model: NorthIndianChartModel): string;
/**
 * Renders a full standalone SVG string for South Indian Box Chart
 */
export declare function renderSouthIndianSvg(model: SouthIndianChartModel): string;
/**
 * Renders a full standalone SVG string for East Indian (Bengali/Odia) Chart
 */
export declare function renderEastIndianSvg(model: EastIndianChartModel): string;
//# sourceMappingURL=svgRenderers.d.ts.map