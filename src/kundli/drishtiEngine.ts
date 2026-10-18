/**
 * Sanatan Drishti & Planetary Aspect Engine
 *
 * Implements Parashari mutual drishti (7th aspect for all, special aspects for Mars 4/8,
 * Jupiter 5/9, Saturn 3/10, Rahu/Ketu 5/9) and conjunction orbs.
 */

import { NatalPlanetDetail } from './houseCusps';

export interface AspectDetail {
  aspectingPlanet: string;
  aspectedPlanet: string;
  aspectType: '7th' | 'Special_4th' | 'Special_8th' | 'Special_5th' | 'Special_9th' | 'Special_3rd' | 'Special_10th' | 'Conjunction';
  separationDegrees: number;
  orbDegrees: number;
  strengthPercent: number;    // 0 to 100%
  isBenefic: boolean;
}

export interface ConjunctionDetail {
  planet1: string;
  planet2: string;
  signIndex: number;
  houseOccupied: number;
  separationDegrees: number;
  isClose: boolean;           // <= 8 degrees
  isGrahaYuddha: boolean;     // <= 1 degree between non-luminaries
  warWinner?: string;         // Higher latitude / north winner
}

export interface DrishtiMatrix {
  aspects: AspectDetail[];
  conjunctions: ConjunctionDetail[];
}

export function calculateDrishtiAndConjunctions(planets: NatalPlanetDetail[]): DrishtiMatrix {
  const aspects: AspectDetail[] = [];
  const conjunctions: ConjunctionDetail[] = [];

  const naturalBenefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];

  for (let i = 0; i < planets.length; i++) {
    const p1 = planets[i];

    for (let j = 0; j < planets.length; j++) {
      if (i === j) continue;
      const p2 = planets[j];

      // Circular angular separation from p1 to p2 (0 to 360)
      const forwardDist = (p2.longitude - p1.longitude + 360) % 360;
      const houseDistance = Math.floor(forwardDist / 30) + 1; // 1 to 12

      // Check Conjunction (same house or forwardDist < 12)
      if (i < j && (p1.houseOccupied === p2.houseOccupied || forwardDist <= 12.0 || forwardDist >= 348.0)) {
        let sep = Math.abs(p1.longitude - p2.longitude);
        if (sep > 180) sep = 360 - sep;

        const isClose = sep <= 8.0;
        const isYuddha = sep <= 1.0 &&
          !['Sun', 'Moon', 'Rahu', 'Ketu'].includes(p1.name) &&
          !['Sun', 'Moon', 'Rahu', 'Ketu'].includes(p2.name);

        let winner: string | undefined;
        if (isYuddha) {
          // In Graha Yuddha (planetary war), northern latitude wins
          winner = p1.latitude >= p2.latitude ? p1.name : p2.name;
        }

        conjunctions.push({
          planet1: p1.name,
          planet2: p2.name,
          signIndex: p1.signIndex,
          houseOccupied: p1.houseOccupied,
          separationDegrees: sep,
          isClose,
          isGrahaYuddha: isYuddha,
          warWinner: winner
        });
      }

      // Check Aspects
      let aspectType: AspectDetail['aspectType'] | null = null;
      let targetDeg = 180;

      // 1. All planets cast 7th aspect (houseDistance == 7)
      if (houseDistance === 7) {
        aspectType = '7th';
        targetDeg = 180;
      }
      // 2. Mars special aspects: 4th and 8th
      else if (p1.name === 'Mars') {
        if (houseDistance === 4) { aspectType = 'Special_4th'; targetDeg = 90; }
        else if (houseDistance === 8) { aspectType = 'Special_8th'; targetDeg = 210; }
      }
      // 3. Jupiter, Rahu, Ketu special aspects: 5th and 9th
      else if (['Jupiter', 'Rahu', 'Ketu'].includes(p1.name)) {
        if (houseDistance === 5) { aspectType = 'Special_5th'; targetDeg = 120; }
        else if (houseDistance === 9) { aspectType = 'Special_9th'; targetDeg = 240; }
      }
      // 4. Saturn special aspects: 3rd and 10th
      else if (p1.name === 'Saturn') {
        if (houseDistance === 3) { aspectType = 'Special_3rd'; targetDeg = 60; }
        else if (houseDistance === 10) { aspectType = 'Special_10th'; targetDeg = 270; }
      }

      if (aspectType) {
        let diff = Math.abs(forwardDist - targetDeg);
        if (diff > 180) diff = 360 - diff;
        // Strength: max 100% at exact aspect, dropping linearly over 15° orb
        const strength = Math.max(0, Math.min(100, Math.round((1 - (diff / 15.0)) * 100)));

        aspects.push({
          aspectingPlanet: p1.name,
          aspectedPlanet: p2.name,
          aspectType,
          separationDegrees: forwardDist,
          orbDegrees: diff,
          strengthPercent: strength,
          isBenefic: naturalBenefics.includes(p1.name)
        });
      }
    }
  }

  return { aspects, conjunctions };
}
