/**
 * East Indian (Bengali / Odia) Chart Presentation Engine
 *
 * Generates fixed-sign layout popular in Eastern India (Bengal, Odisha, Assam),
 * dynamic Ascendant markers, and normalized SVG/Canvas geometry.
 */

import { NatalChartData } from '../houseCusps';
import { zodiacSigns } from '../../core/sanatan_jpl_bridge';

export interface EastIndianSignBox {
  signNumber: number;         // 1 to 12
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
  polygonPoints: string;
  labelPosition: { x: number; y: number };
}

export interface EastIndianChartModel {
  chartType: 'EastIndian';
  viewBox: string;
  ascendantSignNumber: number;
  signBoxes: EastIndianSignBox[];
}

// 400x400 normalized East Indian geometry
// Signs are fixed: Aries (1) is top diamond, Taurus (2) is top-left, etc.
const EAST_INDIAN_GEOMETRY: { [signNumber: number]: { points: string; label: { x: number; y: number } } } = {
  1:  { points: '100,0 200,100 300,0', label: { x: 200, y: 35 } },             // Aries (Top)
  2:  { points: '0,0 100,0 200,100 100,200 0,100', label: { x: 80, y: 50 } },   // Taurus (Top-Left)
  3:  { points: '0,100 100,200 0,300', label: { x: 30, y: 200 } },             // Gemini (Left)
  4:  { points: '0,300 100,200 200,300 100,400 0,400', label: { x: 80, y: 350 } }, // Cancer (Bottom-Left)
  5:  { points: '100,400 200,300 300,400', label: { x: 200, y: 375 } },         // Leo (Bottom)
  6:  { points: '300,400 200,300 300,200 400,300 400,400', label: { x: 320, y: 350 } }, // Virgo (Bottom-Right)
  7:  { points: '300,200 400,100 400,300', label: { x: 370, y: 200 } },         // Libra (Right)
  8:  { points: '300,0 400,0 400,100 300,200 200,100', label: { x: 320, y: 50 } },  // Scorpio (Top-Right)
  9:  { points: '200,100 300,200 200,200', label: { x: 230, y: 160 } },        // Sagittarius
  10: { points: '100,200 200,100 200,200', label: { x: 170, y: 160 } },        // Capricorn
  11: { points: '100,200 200,300 200,200', label: { x: 170, y: 240 } },        // Aquarius
  12: { points: '200,200 300,200 200,300', label: { x: 230, y: 240 } }         // Pisces
};

export function generateEastIndianChart(natalData: NatalChartData): EastIndianChartModel {
  const ascSignIdx = natalData.ascendant.signIndex;
  const ascSignNumber = ascSignIdx + 1;
  const signBoxes: EastIndianSignBox[] = [];

  for (let s = 1; s <= 12; s++) {
    const signIdx = s - 1;
    const signObj = zodiacSigns[signIdx];
    const geo = EAST_INDIAN_GEOMETRY[s] || { points: '', label: { x: 0, y: 0 } };
    const houseNumber = ((signIdx - ascSignIdx + 12) % 12) + 1;

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
      polygonPoints: geo.points,
      labelPosition: geo.label
    });
  }

  return {
    chartType: 'EastIndian',
    viewBox: '0 0 400 400',
    ascendantSignNumber: ascSignNumber,
    signBoxes
  };
}
