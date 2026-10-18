/**
 * East Indian (Bengali / Odia) Chart Presentation Engine
 *
 * Generates fixed-sign layout popular in Eastern India (Bengal, Odisha, Assam),
 * dynamic Ascendant markers, and normalized SVG/Canvas geometry.
 */
import { NatalChartData } from '../houseCusps';
export interface EastIndianSignBox {
    signNumber: number;
    signName: string;
    signHindi: string;
    isAscendant: boolean;
    houseNumber: number;
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
}
export interface EastIndianChartModel {
    chartType: 'EastIndian';
    viewBox: string;
    ascendantSignNumber: number;
    signBoxes: EastIndianSignBox[];
}
export declare function generateEastIndianChart(natalData: NatalChartData): EastIndianChartModel;
//# sourceMappingURL=eastIndianChart.d.ts.map