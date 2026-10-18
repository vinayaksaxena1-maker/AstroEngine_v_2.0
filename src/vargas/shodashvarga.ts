/**
 * Sanatan Shodashvarga Engine (16 Divisional Charts)
 *
 * Implements complete Brihat Parashara Hora Shastra mathematical algorithms:
 * D1 (Rashi), D2 (Hora), D3 (Drekkana), D4 (Chaturthamsha), D7 (Saptamsha),
 * D9 (Navamsha), D10 (Dashamsha), D12 (Dwadashamsha), D16 (Shodashamsha),
 * D20 (Vimshamsha), D24 (Chaturvimshamsha), D27 (Saptavimshamsha),
 * D30 (Trimshamsha), D40 (Khavedamsha), D45 (Akshavedamsha), D60 (Shashtiamsha).
 *
 * Also provides:
 * - Vargottama Detection (D1 & D9 in same sign)
 * - Pushkar Navamsha & Pushkar Bhaga
 * - Vaisheshikamsa Dignity Scoring (Parijata to Shridhama)
 */

import { zodiacSigns } from '../core/sanatan_jpl_bridge';

export type VargaType =
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12'
  | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

export interface VargaPosition {
  varga: VargaType;
  signIndex: number;          // 0 to 11
  signName: string;
  signHindi: string;
  degreeInVarga: number;      // 0 to 30
  partIndex: number;          // 0 to N-1
  isVargottama?: boolean;     // For D9
  isPushkar?: boolean;        // For D9
  shashtiamshaDeity?: string; // For D60
  shashtiamshaNature?: 'Benefic' | 'Malefic';
}

export interface PlanetVargaMap {
  planetName: string;
  longitude: number;
  vargas: { [key in VargaType]: VargaPosition };
  dignityScore: {
    shadvargaScore: number;    // Own/Exalted count in D1, D2, D3, D9, D12, D30
    saptavargaScore: number;   // + D7
    dashavargaScore: number;   // + D10, D16, D60
    shodashvargaScore: number; // All 16
    vaisheshikamsaTitle: string; // e.g. "Gopuramsa", "Simhasanamsa", etc.
  };
}

// 60 Shashtiamsha Deities & Natures
export const SHASHTIAMSHA_DATA: { name: string; nature: 'Benefic' | 'Malefic' }[] = [
  { name: 'Ghora', nature: 'Malefic' }, { name: 'Rakshasa', nature: 'Malefic' },
  { name: 'Deva', nature: 'Benefic' }, { name: 'Kubera', nature: 'Benefic' },
  { name: 'Yaksha', nature: 'Benefic' }, { name: 'Kinnara', nature: 'Benefic' },
  { name: 'Bhrashta', nature: 'Malefic' }, { name: 'Kulaghna', nature: 'Malefic' },
  { name: 'Garala', nature: 'Malefic' }, { name: 'Vahni', nature: 'Malefic' },
  { name: 'Maya', nature: 'Malefic' }, { name: 'Purishaka', nature: 'Malefic' },
  { name: 'Apampati', nature: 'Benefic' }, { name: 'Marutvan', nature: 'Benefic' },
  { name: 'Kaala', nature: 'Malefic' }, { name: 'Sarpa', nature: 'Malefic' },
  { name: 'Amrita', nature: 'Benefic' }, { name: 'Indu', nature: 'Benefic' },
  { name: 'Mridu', nature: 'Benefic' }, { name: 'Komala', nature: 'Benefic' },
  { name: 'Heramba', nature: 'Benefic' }, { name: 'Brahma', nature: 'Benefic' },
  { name: 'Vishnu', nature: 'Benefic' }, { name: 'Maheshwara', nature: 'Benefic' },
  { name: 'Deva', nature: 'Benefic' }, { name: 'Ardra', nature: 'Benefic' },
  { name: 'Kalinasa', nature: 'Benefic' }, { name: 'Kshiteesha', nature: 'Benefic' },
  { name: 'Kamalakara', nature: 'Benefic' }, { name: 'Gulika', nature: 'Malefic' },
  { name: 'Mrityu', nature: 'Malefic' }, { name: 'Kaala', nature: 'Malefic' },
  { name: 'Davagni', nature: 'Malefic' }, { name: 'Ghora', nature: 'Malefic' },
  { name: 'Adhama', nature: 'Malefic' }, { name: 'Kantaka', nature: 'Malefic' },
  { name: 'Sudha', nature: 'Benefic' }, { name: 'Amrita', nature: 'Benefic' },
  { name: 'Purnachandra', nature: 'Benefic' }, { name: 'Vishadagdha', nature: 'Malefic' },
  { name: 'Kulanasa', nature: 'Malefic' }, { name: 'Vamshakshaya', nature: 'Malefic' },
  { name: 'Utpata', nature: 'Malefic' }, { name: 'Kaala', nature: 'Malefic' },
  { name: 'Saumya', nature: 'Benefic' }, { name: 'Komala', nature: 'Benefic' },
  { name: 'Sheetala', nature: 'Benefic' }, { name: 'Karaladamshtra', nature: 'Malefic' },
  { name: 'Chandramukhi', nature: 'Benefic' }, { name: 'Praveena', nature: 'Benefic' },
  { name: 'Kaalapavaka', nature: 'Malefic' }, { name: 'Dandashuka', nature: 'Malefic' },
  { name: 'Nirmala', nature: 'Benefic' }, { name: 'Shubha', nature: 'Benefic' },
  { name: 'Ashubha', nature: 'Malefic' }, { name: 'Atishubha', nature: 'Benefic' },
  { name: 'Sudhasangyaka', nature: 'Benefic' }, { name: 'Payodhi', nature: 'Benefic' },
  { name: 'Bhramana', nature: 'Malefic' }, { name: 'Indurekha', nature: 'Benefic' }
];

export const EXALTATION_SIGNS: { [planet: string]: number } = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6
};

export const OWN_SIGNS: { [planet: string]: number[] } = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10]
};

// ---------------------------------------------------------------------------
// Varga Calculation Core
// ---------------------------------------------------------------------------

export function calculateVarga(longitude: number, varga: VargaType): VargaPosition {
  const norm = (longitude % 360 + 360) % 360;
  const rashiIdx = Math.floor(norm / 30); // 0 to 11
  const degInRashi = norm % 30;
  const isOdd = (rashiIdx % 2 === 0); // 0 (Aries) is odd sign, 1 (Taurus) is even

  let targetSign = rashiIdx;
  let part = 0;
  let degreeInVarga = 0;
  let shashtiData: (typeof SHASHTIAMSHA_DATA)[0] | undefined;

  switch (varga) {
    case 'D1': // Rashi (30°)
      targetSign = rashiIdx;
      part = 0;
      degreeInVarga = degInRashi;
      break;

    case 'D2': { // Hora (15°)
      part = Math.floor(degInRashi / 15);
      degreeInVarga = (degInRashi % 15) * 2;
      if (isOdd) {
        targetSign = part === 0 ? 4 : 3; // 4=Leo, 3=Cancer
      } else {
        targetSign = part === 0 ? 3 : 4;
      }
      break;
    }

    case 'D3': { // Drekkana (10°)
      part = Math.floor(degInRashi / 10);
      degreeInVarga = (degInRashi % 10) * 3;
      targetSign = (rashiIdx + part * 4) % 12; // 1st=self, 2nd=5th, 3rd=9th
      break;
    }

    case 'D4': { // Chaturthamsha (7°30')
      part = Math.floor(degInRashi / 7.5);
      degreeInVarga = (degInRashi % 7.5) * 4;
      targetSign = (rashiIdx + part * 3) % 12; // Kendra progression (1, 4, 7, 10)
      break;
    }

    case 'D7': { // Saptamsha (4°17'08.57'')
      const span = 30.0 / 7.0;
      part = Math.min(6, Math.floor(degInRashi / span));
      degreeInVarga = (degInRashi % span) * 7;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 6 + part) % 12; // Starts from 7th
      }
      break;
    }

    case 'D9': { // Navamsha (3°20')
      const span = 30.0 / 9.0;
      part = Math.min(8, Math.floor(degInRashi / span));
      degreeInVarga = (degInRashi % span) * 9;
      // Movable/Fiery starts Aries, Earthy starts Capricorn, Airy starts Libra, Watery starts Cancer
      const triplicity = rashiIdx % 4;
      const startSign = [0, 9, 6, 3][triplicity];
      targetSign = (startSign + part) % 12;
      break;
    }

    case 'D10': { // Dashamsha (3°00')
      part = Math.min(9, Math.floor(degInRashi / 3.0));
      degreeInVarga = (degInRashi % 3.0) * 10;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 8 + part) % 12; // Starts from 9th
      }
      break;
    }

    case 'D12': { // Dwadashamsha (2°30')
      part = Math.min(11, Math.floor(degInRashi / 2.5));
      degreeInVarga = (degInRashi % 2.5) * 12;
      targetSign = (rashiIdx + part) % 12;
      break;
    }

    case 'D16': { // Shodashamsha (1°52'30'' = 1.875°)
      part = Math.min(15, Math.floor(degInRashi / 1.875));
      degreeInVarga = (degInRashi % 1.875) * 16;
      const modality = rashiIdx % 3; // 0=Movable, 1=Fixed, 2=Dual
      const startSign = [0, 4, 8][modality]; // Aries, Leo, Sag
      targetSign = (startSign + part) % 12;
      break;
    }

    case 'D20': { // Vimshamsha (1°30' = 1.5°)
      part = Math.min(19, Math.floor(degInRashi / 1.5));
      degreeInVarga = (degInRashi % 1.5) * 20;
      const modality = rashiIdx % 3;
      const startSign = [0, 8, 4][modality]; // Aries, Sag, Leo
      targetSign = (startSign + part) % 12;
      break;
    }

    case 'D24': { // Chaturvimshamsha (1°15' = 1.25°)
      part = Math.min(23, Math.floor(degInRashi / 1.25));
      degreeInVarga = (degInRashi % 1.25) * 24;
      if (isOdd) {
        targetSign = (4 + part) % 12; // Starts Leo
      } else {
        targetSign = (3 + part) % 12; // Starts Cancer
      }
      break;
    }

    case 'D27': { // Saptavimshamsha (1°06'40'' = 30/27)
      const span = 30.0 / 27.0;
      part = Math.min(26, Math.floor(degInRashi / span));
      degreeInVarga = (degInRashi % span) * 27;
      const triplicity = rashiIdx % 4;
      const startSign = [0, 3, 6, 9][triplicity]; // Aries, Cancer, Libra, Cap
      targetSign = (startSign + part) % 12;
      break;
    }

    case 'D30': { // Trimshamsha (Unequal degree distribution)
      // Odd signs: Mars (0-5), Saturn (5-10), Jupiter (10-18), Mercury (18-25), Venus (25-30)
      // Even signs: Venus (0-5), Mercury (5-12), Jupiter (12-20), Saturn (20-25), Mars (25-30)
      if (isOdd) {
        if (degInRashi < 5.0)       { targetSign = 0; part = 0; }  // Aries
        else if (degInRashi < 10.0) { targetSign = 10; part = 1; } // Aquarius
        else if (degInRashi < 18.0) { targetSign = 8; part = 2; }  // Sagittarius
        else if (degInRashi < 25.0) { targetSign = 2; part = 3; }  // Gemini
        else                        { targetSign = 6; part = 4; }  // Libra
      } else {
        if (degInRashi < 5.0)       { targetSign = 1; part = 0; }  // Taurus
        else if (degInRashi < 12.0) { targetSign = 5; part = 1; }  // Virgo
        else if (degInRashi < 20.0) { targetSign = 11; part = 2; } // Pisces
        else if (degInRashi < 25.0) { targetSign = 9; part = 3; }  // Capricorn
        else                        { targetSign = 7; part = 4; }  // Scorpio
      }
      degreeInVarga = (degInRashi % 5.0) * 6;
      break;
    }

    case 'D40': { // Khavedamsha (0°45' = 0.75°)
      part = Math.min(39, Math.floor(degInRashi / 0.75));
      degreeInVarga = (degInRashi % 0.75) * 40;
      targetSign = (isOdd ? 0 + part : 6 + part) % 12; // Aries or Libra
      break;
    }

    case 'D45': { // Akshavedamsha (0°40' = 2/3°)
      const span = 30.0 / 45.0;
      part = Math.min(44, Math.floor(degInRashi / span));
      degreeInVarga = (degInRashi % span) * 45;
      const modality = rashiIdx % 3;
      const startSign = [0, 4, 8][modality]; // Aries, Leo, Sag
      targetSign = (startSign + part) % 12;
      break;
    }

    case 'D60': { // Shashtiamsha (0°30' = 0.5°)
      part = Math.min(59, Math.floor(degInRashi / 0.5));
      degreeInVarga = (degInRashi % 0.5) * 60;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 6 + part) % 12;
      }
      shashtiData = SHASHTIAMSHA_DATA[part];
      break;
    }
  }

  const signObj = zodiacSigns[targetSign];
  const isVargottama = (varga === 'D9' && targetSign === rashiIdx);

  // Pushkar Navamsha Check
  let isPushkar = false;
  if (varga === 'D9') {
    const triplicity = rashiIdx % 4;
    // Fire (0): parts 6 & 8 (Libra & Sag navamshas)
    // Earth (1): parts 2 & 4 (Pisces & Taurus navamshas)
    // Air (2): parts 5 & 7 (Pisces & Taurus navamshas)
    // Water (3): parts 0 & 2 (Cancer & Virgo navamshas)
    if (triplicity === 0 && (part === 6 || part === 8)) isPushkar = true;
    if (triplicity === 1 && (part === 2 || part === 4)) isPushkar = true;
    if (triplicity === 2 && (part === 5 || part === 7)) isPushkar = true;
    if (triplicity === 3 && (part === 0 || part === 2)) isPushkar = true;
  }

  return {
    varga,
    signIndex: targetSign,
    signName: signObj.eng,
    signHindi: signObj.hin,
    degreeInVarga,
    partIndex: part,
    isVargottama,
    isPushkar,
    shashtiamshaDeity: shashtiData?.name,
    shashtiamshaNature: shashtiData?.nature
  };
}

/**
 * Calculates all 16 divisional charts for a planet and computes Vaisheshikamsa dignity
 */
export function calculateAllVargasForPlanet(planetName: string, longitude: number): PlanetVargaMap {
  const vargasList: VargaType[] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
    'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];

  const vargasMap: any = {};
  for (const v of vargasList) {
    vargasMap[v] = calculateVarga(longitude, v);
  }

  // Calculate Dignity Scores (Count how many vargas planet is in Own or Exalted sign)
  const isOwnOrExalted = (signIdx: number): boolean => {
    const exalted = EXALTATION_SIGNS[planetName];
    if (exalted !== undefined && signIdx === exalted) return true;
    const owns = OWN_SIGNS[planetName];
    if (owns && owns.includes(signIdx)) return true;
    return false;
  };

  const shadvargaList: VargaType[] = ['D1', 'D2', 'D3', 'D9', 'D12', 'D30'];
  const saptavargaList: VargaType[] = [...shadvargaList, 'D7'];
  const dashavargaList: VargaType[] = [...saptavargaList, 'D10', 'D16', 'D60'];

  let shadvargaScore = 0;
  for (const v of shadvargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) shadvargaScore++;

  let saptavargaScore = 0;
  for (const v of saptavargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) saptavargaScore++;

  let dashavargaScore = 0;
  for (const v of dashavargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) dashavargaScore++;

  let shodashvargaScore = 0;
  for (const v of vargasList) if (isOwnOrExalted(vargasMap[v].signIndex)) shodashvargaScore++;

  // Vaisheshikamsa Title
  let vaisheshikamsaTitle = 'Sadharana (Ordinary)';
  if (dashavargaScore >= 10) vaisheshikamsaTitle = 'Shridhamamsa (Supreme)';
  else if (dashavargaScore === 9) vaisheshikamsaTitle = 'Iravatamsa';
  else if (dashavargaScore === 8) vaisheshikamsaTitle = 'Vaishnavamsa';
  else if (dashavargaScore === 7) vaisheshikamsaTitle = 'Devalokamsa';
  else if (dashavargaScore === 6) vaisheshikamsaTitle = 'Paravatamsa';
  else if (dashavargaScore === 5) vaisheshikamsaTitle = 'Simhasanamsa';
  else if (dashavargaScore === 4) vaisheshikamsaTitle = 'Gopuramsa';
  else if (dashavargaScore === 3) vaisheshikamsaTitle = 'Uttamamsa';
  else if (dashavargaScore === 2) vaisheshikamsaTitle = 'Parijatamsa';

  return {
    planetName,
    longitude,
    vargas: vargasMap,
    dignityScore: {
      shadvargaScore,
      saptavargaScore,
      dashavargaScore,
      shodashvargaScore,
      vaisheshikamsaTitle
    }
  };
}

export interface ShodashvargaReport {
  ascendant: PlanetVargaMap;
  planets: Record<string, PlanetVargaMap>;
  divisionalCharts: VargaType[];
  vaisheshikamsa: PlanetVargaMap[];
}

/**
 * Calculates complete Shodashvarga (all 16 divisional charts) for all planets and ascendant in a chart.
 */
export function calculateShodashvarga(natalChart: {
  ascendant: { longitude: number };
  planets: { name: string; longitude: number }[];
}): ShodashvargaReport {
  const divisionalCharts: VargaType[] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
    'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];

  const ascVarga = calculateAllVargasForPlanet('Ascendant', natalChart.ascendant.longitude);
  const planetsMap: Record<string, PlanetVargaMap> = {};
  const vaisheshikamsa: PlanetVargaMap[] = [];

  const sevenGrahas = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  for (const p of natalChart.planets) {
    const vMap = calculateAllVargasForPlanet(p.name, p.longitude);
    planetsMap[p.name] = vMap;
    if (sevenGrahas.includes(p.name)) {
      vaisheshikamsa.push(vMap);
    }
  }

  return {
    ascendant: ascVarga,
    planets: planetsMap,
    divisionalCharts,
    vaisheshikamsa
  };
}
