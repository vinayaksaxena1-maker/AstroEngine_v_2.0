/**
 * North Indian Diamond Chart Presentation Engine
 *
 * Generates normalized 1-12 house nodes, rashi mappings (counter-clockwise),
 * planetary placements, and exact polygon coordinates for rendering in SVG/Canvas.
 */

import { NatalChartData, NatalPlanetDetail } from '../houseCusps';
import { zodiacSigns } from '../../core/sanatan_jpl_bridge';

export interface ChartHouseNode {
  houseNumber: number;        // 1 to 12
  signNumber: number;         // 1 to 12 (Aries=1 ... Pisces=12)
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
  // Standardized SVG Polygon vertices for a 400x400 viewBox
  polygonPoints: string;
  labelPosition: { x: number; y: number };
  planetArea: { x: number; y: number; width: number; height: number };
}

export interface NorthIndianChartModel {
  chartType: 'NorthIndian';
  viewBox: string;
  ascendantSignNumber: number;
  houses: ChartHouseNode[];
}

// 400x400 normalized diamond chart geometry coordinates
const NORTH_INDIAN_GEOMETRY = [
  // House 1 (Top Center Diamond)
  {
    points: '200,0 300,100 200,200 100,100',
    label: { x: 200, y: 35 },
    planetArea: { x: 130, y: 70, width: 140, height: 90 }
  },
  // House 2 (Top Left Triangle)
  {
    points: '0,0 200,0 100,100',
    label: { x: 110, y: 25 },
    planetArea: { x: 20, y: 20, width: 90, height: 60 }
  },
  // House 3 (Far Left Top Triangle)
  {
    points: '0,0 100,100 0,200',
    label: { x: 25, y: 110 },
    planetArea: { x: 10, y: 50, width: 70, height: 100 }
  },
  // House 4 (Left Center Diamond)
  {
    points: '0,200 100,100 200,200 100,300',
    label: { x: 35, y: 200 },
    planetArea: { x: 70, y: 130, width: 90, height: 140 }
  },
  // House 5 (Far Left Bottom Triangle)
  {
    points: '0,200 100,300 0,400',
    label: { x: 25, y: 290 },
    planetArea: { x: 10, y: 250, width: 70, height: 100 }
  },
  // House 6 (Bottom Left Triangle)
  {
    points: '0,400 100,300 200,400',
    label: { x: 110, y: 375 },
    planetArea: { x: 20, y: 320, width: 90, height: 60 }
  },
  // House 7 (Bottom Center Diamond)
  {
    points: '200,200 300,300 200,400 100,300',
    label: { x: 200, y: 365 },
    planetArea: { x: 130, y: 240, width: 140, height: 90 }
  },
  // House 8 (Bottom Right Triangle)
  {
    points: '200,400 300,300 400,400',
    label: { x: 290, y: 375 },
    planetArea: { x: 290, y: 320, width: 90, height: 60 }
  },
  // House 9 (Far Right Bottom Triangle)
  {
    points: '300,300 400,200 400,400',
    label: { x: 375, y: 290 },
    planetArea: { x: 320, y: 250, width: 70, height: 100 }
  },
  // House 10 (Right Center Diamond)
  {
    points: '200,200 300,100 400,200 300,300',
    label: { x: 365, y: 200 },
    planetArea: { x: 240, y: 130, width: 90, height: 140 }
  },
  // House 11 (Far Right Top Triangle)
  {
    points: '400,0 400,200 300,100',
    label: { x: 375, y: 110 },
    planetArea: { x: 320, y: 50, width: 70, height: 100 }
  },
  // House 12 (Top Right Triangle)
  {
    points: '200,0 400,0 300,100',
    label: { x: 290, y: 25 },
    planetArea: { x: 290, y: 20, width: 90, height: 60 }
  }
];

export function generateNorthIndianChart(natalData: NatalChartData): NorthIndianChartModel {
  const ascSignIdx = natalData.ascendant.signIndex; // 0 to 11
  const houses: ChartHouseNode[] = [];

  for (let h = 1; h <= 12; h++) {
    // In North Indian, sign rotates counter-clockwise:
    // House 1 gets Lagna sign, House 2 gets Lagna+1, etc.
    const signIdx = (ascSignIdx + (h - 1)) % 12;
    const signNumber = signIdx + 1;
    const signObj = zodiacSigns[signIdx];
    const geo = NORTH_INDIAN_GEOMETRY[h - 1];

    // Find all planets occupying this house
    const housePlanets = natalData.planets
      .filter(p => p.houseOccupied === h)
      .map(p => ({
        name: p.name,
        hindiName: p.hindiName,
        degreeInSign: p.degreeInSign,
        degreeFormatted: p.degreeFormatted,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust
      }));

    houses.push({
      houseNumber: h,
      signNumber,
      signName: signObj.eng,
      signHindi: signObj.hin,
      signLord: natalData.cusps[h - 1]?.signLord || '',
      planets: housePlanets,
      polygonPoints: geo.points,
      labelPosition: geo.label,
      planetArea: geo.planetArea
    });
  }

  return {
    chartType: 'NorthIndian',
    viewBox: '0 0 400 400',
    ascendantSignNumber: ascSignIdx + 1,
    houses
  };
}
