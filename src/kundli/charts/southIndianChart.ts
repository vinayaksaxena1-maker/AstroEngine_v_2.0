/**
 * South Indian Box Chart Presentation Engine
 *
 * Generates fixed-sign 12 outer boxes (clockwise from Pisces/Aries),
 * dynamic Ascendant (Lagna) markers, and exact polygon coordinates for rendering in SVG/Canvas.
 */

import { NatalChartData, NatalPlanetDetail } from '../houseCusps';
import { zodiacSigns } from '../../core/sanatan_jpl_bridge';

export interface SouthIndianSignBox {
  signNumber: number;         // 1 to 12 (Aries=1 ... Pisces=12)
  signName: string;
  signHindi: string;
  isAscendant: boolean;
  houseNumber: number;        // House from Lagna (1 to 12)
  planets: {
    name: string;
    hindiName: string;
    degreeInSign: number;
    degreeFormatted: string;
    isRetrograde: boolean;
    isCombust: boolean;
  }[];
  // 400x400 SVG box rect geometry: { x, y, width, height }
  boxRect: { x: number; y: number; width: number; height: number };
  labelPosition: { x: number; y: number };
}

export interface SouthIndianChartModel {
  chartType: 'SouthIndian';
  viewBox: string;
  ascendantSignNumber: number;
  signBoxes: SouthIndianSignBox[];
}

// Fixed 4x4 grid coordinates with hollow center (2x2)
// Outer ring has 12 boxes, each 100x100 in 400x400 canvas
const SOUTH_INDIAN_FIXED_POSITIONS: { [signNumber: number]: { x: number; y: number } } = {
  12: { x: 0,   y: 0 },   // Pisces (Row 0, Col 0)
  1:  { x: 100, y: 0 },   // Aries (Row 0, Col 1)
  2:  { x: 200, y: 0 },   // Taurus (Row 0, Col 2)
  3:  { x: 300, y: 0 },   // Gemini (Row 0, Col 3)
  4:  { x: 300, y: 100 }, // Cancer (Row 1, Col 3)
  5:  { x: 300, y: 200 }, // Leo (Row 2, Col 3)
  6:  { x: 300, y: 300 }, // Virgo (Row 3, Col 3)
  7:  { x: 200, y: 300 }, // Libra (Row 3, Col 2)
  8:  { x: 100, y: 300 }, // Scorpio (Row 3, Col 1)
  9:  { x: 0,   y: 300 }, // Sagittarius (Row 3, Col 0)
  10: { x: 0,   y: 200 }, // Capricorn (Row 2, Col 0)
  11: { x: 0,   y: 100 }  // Aquarius (Row 1, Col 0)
};

export function generateSouthIndianChart(natalData: NatalChartData): SouthIndianChartModel {
  const ascSignIdx = natalData.ascendant.signIndex; // 0 to 11
  const ascSignNumber = ascSignIdx + 1;
  const signBoxes: SouthIndianSignBox[] = [];

  for (let s = 1; s <= 12; s++) {
    const signIdx = s - 1;
    const signObj = zodiacSigns[signIdx];
    const pos = SOUTH_INDIAN_FIXED_POSITIONS[s];

    // House counted clockwise from Lagna sign
    const houseNumber = ((signIdx - ascSignIdx + 12) % 12) + 1;

    // Find all planets in this sign
    const signPlanets = natalData.planets
      .filter(p => p.signIndex === signIdx)
      .map(p => ({
        name: p.name,
        hindiName: p.hindiName,
        degreeInSign: p.degreeInSign,
        degreeFormatted: p.degreeFormatted,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust
      }));

    signBoxes.push({
      signNumber: s,
      signName: signObj.eng,
      signHindi: signObj.hin,
      isAscendant: s === ascSignNumber,
      houseNumber,
      planets: signPlanets,
      boxRect: { x: pos.x, y: pos.y, width: 100, height: 100 },
      labelPosition: { x: pos.x + 8, y: pos.y + 18 }
    });
  }

  return {
    chartType: 'SouthIndian',
    viewBox: '0 0 400 400',
    ascendantSignNumber: ascSignNumber,
    signBoxes
  };
}
