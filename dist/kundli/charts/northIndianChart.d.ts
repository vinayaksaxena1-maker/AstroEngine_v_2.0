/**
 * North Indian Diamond Chart Presentation Engine
 *
 * Generates normalized 1-12 house nodes, rashi mappings (counter-clockwise),
 * planetary placements, and exact polygon coordinates for rendering in SVG/Canvas.
 */
import { NatalChartData } from '../houseCusps';
export interface ChartHouseNode {
    houseNumber: number;
    signNumber: number;
    signName: string;
    signHindi: string;
    signLord: string;
    planets: {
        name: string;
        hindiName: string;
        degreeInSign: number;
        degreeFormatted: string;
        isRetrograde: boolean;
        isCombust: boolean;
    }[];
    polygonPoints: string;
    labelPosition: {
        x: number;
        y: number;
    };
    planetArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface NorthIndianChartModel {
    chartType: 'NorthIndian';
    viewBox: string;
    ascendantSignNumber: number;
    houses: ChartHouseNode[];
}
export declare function generateNorthIndianChart(natalData: NatalChartData): NorthIndianChartModel;
//# sourceMappingURL=northIndianChart.d.ts.map