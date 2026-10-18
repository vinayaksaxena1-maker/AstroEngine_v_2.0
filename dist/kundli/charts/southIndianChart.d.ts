/**
 * South Indian Box Chart Presentation Engine
 *
 * Generates fixed-sign 12 outer boxes (clockwise from Pisces/Aries),
 * dynamic Ascendant (Lagna) markers, and exact polygon coordinates for rendering in SVG/Canvas.
 */
import { NatalChartData } from '../houseCusps';
export interface SouthIndianSignBox {
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
    boxRect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    labelPosition: {
        x: number;
        y: number;
    };
}
export interface SouthIndianChartModel {
    chartType: 'SouthIndian';
    viewBox: string;
    ascendantSignNumber: number;
    signBoxes: SouthIndianSignBox[];
}
export declare function generateSouthIndianChart(natalData: NatalChartData): SouthIndianChartModel;
//# sourceMappingURL=southIndianChart.d.ts.map