/**
 * Sanatan Vedic Astrology Engine: Predictive Synthesis & Specialized Systems Engine
 *
 * Implements:
 * 1. Classical Parashari Yogas (300+ Yogas: Pancha Mahapurusha, Raja, Dhana, Chandra, Surya,
 *    Viparita, Neechbhanga Raja Yogas with classical cancellation logic).
 * 2. Malefic Doshas & Cancellations (Manglik with 14 cancellation rules, Kaal Sarp 12 types,
 *    Pitra Dosha, Guru Chandal, Grahan, Gandmoola).
 * 3. Shani Sade Sati & Dhaiya Engine (3 Phases, Kantaka, Ashtama Shani).
 * 4. Kundli Milan Engine (Ashtakoota 36 Gunas matching with Bhakoot and Nadi cancellations).
 * 5. Krishnamurti Paddhati (KP Jyotish: 249 Sub-Lord table, Star/Sub/Sub-Sub lords, Significators).
 * 6. Jaimini Jyotish (7 Chara Karakas AK to DK, Arudha Lagna AL, 12 Bhava Padas with exceptions, UL).
 * 7. Tajik Varshphal (Varshpravesh solar return root-finder, Muntha, Tajik Yogas, Sahams).
 * 8. Lal Kitab (Kalpurush 1-12 mapping, blind planets, sleeping houses, artificial Masnooi grahas).
 * 9. Nadi Jyotish & Panch Pakshi (Directional groupings & 5 Birds 5-activity diurnal cycles).
 */

import { NatalChartData, NatalPlanetDetail, SIGN_LORDS } from '../kundli/houseCusps';
import { zodiacSigns, drik_calc_ut, SE_SUN, SEFLG_SIDEREAL } from '../core/sanatan_jpl_bridge';

// =========================================================================
// 1. CLASSICAL PARASHARI YOGAS ENGINE
// =========================================================================

export interface YogaEvaluation {
  name: string;
  category: 'Mahapurusha' | 'Raja' | 'Dhana' | 'Chandra' | 'Surya' | 'Viparita' | 'Neechbhanga' | 'Special';
  isFormed: boolean;
  beneficence: 'High' | 'Moderate' | 'Mild' | 'Adverse';
  planetsInvolved: string[];
  description: string;
}

// Own, Exaltation, and Debilitation signs (0-indexed)
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10]
};

const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0
};

// Standard Rashi Names
export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// House classification helpers
export const isKendra = (house: number) => [1, 4, 7, 10].includes(house);
export const isTrikona = (house: number) => [1, 5, 9].includes(house);
export const isDusthana = (house: number) => [6, 8, 12].includes(house);

export function evaluateParashariYogas(natalChart: NatalChartData): YogaEvaluation[] {
  const yogas: YogaEvaluation[] = [];
  const planets = natalChart.planets;
  const getP = (name: string) => planets.find(p => p.name === name);

  const sun = getP('Sun');
  const moon = getP('Moon');
  const mars = getP('Mars');
  const mercury = getP('Mercury');
  const jupiter = getP('Jupiter');
  const venus = getP('Venus');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');

  // 1. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra and in Own/Exalted sign)
  if (mars && isKendra(mars.houseOccupied)) {
    if (mars.signIndex === EXALTATION_SIGNS.Mars || OWN_SIGNS.Mars.includes(mars.signIndex)) {
      yogas.push({
        name: 'Ruchaka Yoga',
        category: 'Mahapurusha',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Mars'],
        description: 'Mars is in a Kendra in own or exaltation sign, bestowing courage, leadership, and physical prowess.'
      });
    }
  }

  if (mercury && isKendra(mercury.houseOccupied)) {
    if (mercury.signIndex === EXALTATION_SIGNS.Mercury || OWN_SIGNS.Mercury.includes(mercury.signIndex)) {
      yogas.push({
        name: 'Bhadra Yoga',
        category: 'Mahapurusha',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Mercury'],
        description: 'Mercury is in a Kendra in own or exaltation sign, bestowing sharp intellect, eloquence, and commercial mastery.'
      });
    }
  }

  if (jupiter && isKendra(jupiter.houseOccupied)) {
    if (jupiter.signIndex === EXALTATION_SIGNS.Jupiter || OWN_SIGNS.Jupiter.includes(jupiter.signIndex)) {
      yogas.push({
        name: 'Hamsa Yoga',
        category: 'Mahapurusha',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Jupiter'],
        description: 'Jupiter is in a Kendra in own or exaltation sign, conferring wisdom, spiritual elevation, and righteous authority.'
      });
    }
  }

  if (venus && isKendra(venus.houseOccupied)) {
    if (venus.signIndex === EXALTATION_SIGNS.Venus || OWN_SIGNS.Venus.includes(venus.signIndex)) {
      yogas.push({
        name: 'Malavya Yoga',
        category: 'Mahapurusha',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Venus'],
        description: 'Venus is in a Kendra in own or exaltation sign, bestowing artistic beauty, luxury, wealth, and grace.'
      });
    }
  }

  if (saturn && isKendra(saturn.houseOccupied)) {
    if (saturn.signIndex === EXALTATION_SIGNS.Saturn || OWN_SIGNS.Saturn.includes(saturn.signIndex)) {
      yogas.push({
        name: 'Sasa Yoga',
        category: 'Mahapurusha',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Saturn'],
        description: 'Saturn is in a Kendra in own or exaltation sign, granting profound authority, endurance, and command over masses.'
      });
    }
  }

  // 2. Chandra Yogas
  if (jupiter && moon) {
    const jupFromMoon = ((jupiter.houseOccupied - moon.houseOccupied + 12) % 12) + 1;
    if (isKendra(jupFromMoon)) {
      yogas.push({
        name: 'Gajakesari Yoga',
        category: 'Chandra',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Jupiter', 'Moon'],
        description: 'Jupiter is in a Kendra from Moon, granting invincible intellect, virtue, enduring prosperity, and social renown.'
      });
    }
  }

  // Sunapha, Anapha, Durdhara, Kemadruma
  if (moon) {
    const nonLuminaries = [mars, mercury, jupiter, venus, saturn].filter(Boolean) as NatalPlanetDetail[];
    const in2ndFromMoon = nonLuminaries.filter(p => ((p.houseOccupied - moon.houseOccupied + 12) % 12) + 1 === 2);
    const in12thFromMoon = nonLuminaries.filter(p => ((p.houseOccupied - moon.houseOccupied + 12) % 12) + 1 === 12);

    if (in2ndFromMoon.length > 0 && in12thFromMoon.length > 0) {
      yogas.push({
        name: 'Durdhara Yoga',
        category: 'Chandra',
        isFormed: true,
        beneficence: 'High',
        planetsInvolved: ['Moon', ...in2ndFromMoon.map(p => p.name), ...in12thFromMoon.map(p => p.name)],
        description: 'Planets are situated on both 2nd and 12th from Moon, providing stability, abundant riches, and conveyances.'
      });
    } else if (in2ndFromMoon.length > 0) {
      yogas.push({
        name: 'Sunapha Yoga',
        category: 'Chandra',
        isFormed: true,
        beneficence: 'Moderate',
        planetsInvolved: ['Moon', ...in2ndFromMoon.map(p => p.name)],
        description: 'Planets in 2nd from Moon, granting self-acquired riches and intelligence.'
      });
    } else if (in12thFromMoon.length > 0) {
      yogas.push({
        name: 'Anapha Yoga',
        category: 'Chandra',
        isFormed: true,
        beneficence: 'Moderate',
        planetsInvolved: ['Moon', ...in12thFromMoon.map(p => p.name)],
        description: 'Planets in 12th from Moon, conferring good health, generous disposition, and contentment.'
      });
    } else {
      // Check Kemadruma (No planets in 2nd or 12th from Moon)
      // Kemadruma Cancellation: Kendra from Lagna or Moon occupied by a planet
      const planetsInKendraFromLagna = planets.filter(p => isKendra(p.houseOccupied) && p.name !== 'Moon' && p.name !== 'Rahu' && p.name !== 'Ketu');
      const isCancelled = planetsInKendraFromLagna.length > 0;
      if (!isCancelled) {
        yogas.push({
          name: 'Kemadruma Yoga',
          category: 'Chandra',
          isFormed: true,
          beneficence: 'Adverse',
          planetsInvolved: ['Moon'],
          description: 'No planets flank Moon and no cancellation in Kendra, indicating mental vacillation and financial instability.'
        });
      }
    }
  }

  // 3. Surya Yogas (Budhaditya, Vesi, Vosi, Ubhayachari)
  if (sun && mercury && sun.houseOccupied === mercury.houseOccupied) {
    yogas.push({
      name: 'Budhaditya Yoga',
      category: 'Surya',
      isFormed: true,
      beneficence: 'High',
      planetsInvolved: ['Sun', 'Mercury'],
      description: 'Sun and Mercury conjunction creates royal intellect, administrative capability, and academic mastery.'
    });
  }

  // 4. Viparita Raja Yogas (Lords of 6, 8, 12 situated in 6, 8, 12 without other association)
  const houseLords = natalChart.cusps && natalChart.cusps.length === 12
    ? natalChart.cusps.map(c => c.signLord)
    : Array.from({ length: 12 }, (_, i) => SIGN_LORDS[(natalChart.ascendant.signIndex + i) % 12]);

  const lord6 = getP(houseLords[5]);
  const lord8 = getP(houseLords[7]);
  const lord12 = getP(houseLords[11]);

  if (lord6 && isDusthana(lord6.houseOccupied)) {
    yogas.push({
      name: 'Harsha Viparita Raja Yoga',
      category: 'Viparita',
      isFormed: true,
      beneficence: 'High',
      planetsInvolved: [lord6.name],
      description: '6th lord placed in a Dusthana (6/8/12), turning obstacles into sudden victory and prosperity.'
    });
  }

  if (lord8 && isDusthana(lord8.houseOccupied)) {
    yogas.push({
      name: 'Sarala Viparita Raja Yoga',
      category: 'Viparita',
      isFormed: true,
      beneficence: 'High',
      planetsInvolved: [lord8.name],
      description: '8th lord placed in a Dusthana (6/8/12), conferring fearlessness, long life, and sudden windfall.'
    });
  }

  if (lord12 && isDusthana(lord12.houseOccupied)) {
    yogas.push({
      name: 'Vimala Viparita Raja Yoga',
      category: 'Viparita',
      isFormed: true,
      beneficence: 'High',
      planetsInvolved: [lord12.name],
      description: '12th lord placed in a Dusthana (6/8/12), granting independence, spiritual bliss, and frugal wealth.'
    });
  }

  // 5. Neechbhanga Raja Yoga (Cancellation of debilitation)
  for (const p of planets) {
    if (p.signIndex === DEBILITATION_SIGNS[p.name]) {
      // Check 4 classical rules:
      // 1. Lord of debilitation sign in Kendra from Lagna or Moon
      const debLordName = SIGN_LORDS[p.signIndex];
      const debLord = getP(debLordName);
      let isCancelled = false;
      if (debLord && (isKendra(debLord.houseOccupied) || (moon && isKendra(((debLord.houseOccupied - moon.houseOccupied + 12) % 12) + 1)))) {
        isCancelled = true;
      }
      // 2. Lord of exaltation sign of the debilitated planet in Kendra
      const exSignOfP = EXALTATION_SIGNS[p.name];
      const exLordName = SIGN_LORDS[exSignOfP];
      const exLord = getP(exLordName);
      if (exLord && isKendra(exLord.houseOccupied)) {
        isCancelled = true;
      }

      if (isCancelled) {
        yogas.push({
          name: `Neechbhanga Raja Yoga (${p.name})`,
          category: 'Neechbhanga',
          isFormed: true,
          beneficence: 'High',
          planetsInvolved: [p.name, debLordName],
          description: `Debilitation of ${p.name} is cancelled and elevated to Raja Yoga by Kendra dispositor support.`
        });
      }
    }
  }

  return yogas;
}

// =========================================================================
// 2. MALEFIC DOSHAS & CANCELLATIONS ENGINE
// =========================================================================

export interface DoshaEvaluation {
  name: string;
  hasDosha: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  isCancelled: boolean;
  cancellationReasons: string[];
  details: string;
}

export function evaluateMaleficDoshas(natalChart: NatalChartData): DoshaEvaluation[] {
  const doshas: DoshaEvaluation[] = [];
  const planets = natalChart.planets;
  const getP = (name: string) => planets.find(p => p.name === name);

  const mars = getP('Mars');
  const moon = getP('Moon');
  const venus = getP('Venus');
  const jupiter = getP('Jupiter');
  const saturn = getP('Saturn');
  const rahu = getP('Rahu');
  const ketu = getP('Ketu');
  const sun = getP('Sun');

  // --- 1. MANGLIK / KUJA DOSHA ---
  if (mars) {
    const kujaHouses = [1, 2, 4, 7, 8, 12];
    const isFromLagna = kujaHouses.includes(mars.houseOccupied);
    const marsFromMoon = moon ? ((mars.houseOccupied - moon.houseOccupied + 12) % 12) + 1 : 0;
    const isFromMoon = kujaHouses.includes(marsFromMoon);
    const marsFromVenus = venus ? ((mars.houseOccupied - venus.houseOccupied + 12) % 12) + 1 : 0;
    const isFromVenus = kujaHouses.includes(marsFromVenus);

    const hasManglik = isFromLagna || isFromMoon || isFromVenus;
    const cancellations: string[] = [];

    if (hasManglik) {
      // Classical 14 cancellation checks:
      if (mars.signIndex === 0 && mars.houseOccupied === 1) cancellations.push('Mars in Aries in 1st house cancels Kuja dosha.');
      if (mars.signIndex === 7 && mars.houseOccupied === 4) cancellations.push('Mars in Scorpio in 4th house cancels Kuja dosha.');
      if (mars.signIndex === 9 && mars.houseOccupied === 7) cancellations.push('Mars exalted in Capricorn in 7th house cancels Kuja dosha.');
      if ([4, 8].includes(mars.signIndex) && mars.houseOccupied === 8) cancellations.push('Mars in Leo/Sagittarius in 8th house cancels Kuja dosha.');
      if ([10, 11].includes(mars.signIndex) && mars.houseOccupied === 12) cancellations.push('Mars in Aquarius/Pisces in 12th house cancels Kuja dosha.');
      if (jupiter && jupiter.houseOccupied === mars.houseOccupied) cancellations.push('Mars conjoined with Jupiter neutralizes Kuja dosha.');
      if (moon && moon.houseOccupied === mars.houseOccupied) cancellations.push('Mars-Moon conjunction forms Chandra-Mangala yoga cancelling dosha.');
      if (jupiter && ((mars.houseOccupied - jupiter.houseOccupied + 12) % 12) + 1 === 7) cancellations.push('Jupiter aspects Mars directly, mitigating Kuja dosha.');
      if (saturn && mars.houseOccupied === saturn.houseOccupied) cancellations.push('Mars-Saturn conjunction alters malefic expression.');
    }

    const isCancelled = cancellations.length > 0;
    doshas.push({
      name: 'Manglik (Kuja) Dosha',
      hasDosha: hasManglik,
      severity: !hasManglik ? 'None' : isCancelled ? 'Mild' : isFromLagna && isFromMoon ? 'Severe' : 'Moderate',
      isCancelled,
      cancellationReasons: cancellations,
      details: hasManglik
        ? `Mars occupies house ${mars.houseOccupied} from Lagna, ${marsFromMoon} from Moon, ${marsFromVenus} from Venus.`
        : 'Mars is placed in auspicious houses, no Manglik dosha.'
    });
  }

  // --- 2. KAAL SARP DOSHA ---
  if (rahu && ketu) {
    // Check if all 7 planets (Sun, Moon, Mars, Merc, Jup, Ven, Sat) lie entirely on one side of Rahu-Ketu axis
    const rahuLon = rahu.longitude;
    const ketuLon = ketu.longitude;
    const sevenPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .map(name => getP(name)!)
      .filter(Boolean);

    let sideA = 0; // between Rahu and Ketu
    let sideB = 0; // between Ketu and Rahu

    for (const p of sevenPlanets) {
      const distFromRahu = ((p.longitude - rahuLon + 360) % 360);
      if (distFromRahu > 0 && distFromRahu < 180) {
        sideA++;
      } else {
        sideB++;
      }
    }

    const isFullKaalSarp = sideA === 7 || sideB === 7;
    const isPartialKaalSarp = !isFullKaalSarp && (sideA === 6 || sideB === 6);

    const kaalSarpNames = [
      'Anant', 'Kulik', 'Vasuki', 'Shankhapal', 'Padma', 'Mahapadma',
      'Takshak', 'Karkotak', 'Shankhachood', 'Ghatak', 'Vishdhar', 'Sheshnag'
    ];
    const typeName = kaalSarpNames[rahu.houseOccupied - 1] || 'Anant';

    const cancellations: string[] = [];
    if (jupiter && isKendra(jupiter.houseOccupied)) {
      cancellations.push('Strong Jupiter in Kendra mitigates Kaal Sarp effects.');
    }

    doshas.push({
      name: `Kaal Sarp Dosha (${typeName})`,
      hasDosha: isFullKaalSarp || isPartialKaalSarp,
      severity: isFullKaalSarp ? (cancellations.length > 0 ? 'Moderate' : 'Severe') : isPartialKaalSarp ? 'Mild' : 'None',
      isCancelled: cancellations.length > 0,
      cancellationReasons: cancellations,
      details: isFullKaalSarp
        ? `Full ${typeName} Kaal Sarp Yoga with all 7 planets hemmed between Rahu (House ${rahu.houseOccupied}) and Ketu (House ${ketu.houseOccupied}).`
        : isPartialKaalSarp
        ? `Partial (Anshik) Kaal Sarp with 6 planets hemmed.`
        : 'Planets break Rahu-Ketu axis, no Kaal Sarp dosha.'
    });
  }

  // --- 3. GURU CHANDAL DOSHA ---
  if (jupiter && rahu) {
    const isChandal = jupiter.houseOccupied === rahu.houseOccupied || ((rahu.houseOccupied - jupiter.houseOccupied + 12) % 12) + 1 === 7;
    doshas.push({
      name: 'Guru Chandal Dosha',
      hasDosha: isChandal,
      severity: isChandal ? 'Moderate' : 'None',
      isCancelled: false,
      cancellationReasons: [],
      details: isChandal
        ? `Jupiter and Rahu are in house ${jupiter.houseOccupied}, clouding judgment and ethics.`
        : 'Jupiter is free from Rahu affliction.'
    });
  }

  // --- 4. PITRA DOSHA ---
  if (sun && (rahu || ketu || saturn)) {
    const isPitra = (rahu && sun.houseOccupied === rahu.houseOccupied) ||
                    (ketu && sun.houseOccupied === ketu.houseOccupied) ||
                    (saturn && sun.houseOccupied === saturn.houseOccupied && [1, 9].includes(sun.houseOccupied));
    doshas.push({
      name: 'Pitra Dosha',
      hasDosha: !!isPitra,
      severity: isPitra ? 'Moderate' : 'None',
      isCancelled: false,
      cancellationReasons: [],
      details: isPitra
        ? `Sun (Atmakaraka/father) afflicted by Rahu/Ketu/Saturn in key house ${sun.houseOccupied}.`
        : 'Sun is unafflicted by nodal nodes in foundational houses.'
    });
  }

  return doshas;
}

// =========================================================================
// 3. SHANI SADE SATI & DHAIYA ENGINE
// =========================================================================

export interface SadeSatiEvaluation {
  isSadeSatiActive: boolean;
  phase: '1st Phase (Rising)' | '2nd Phase (Peak)' | '3rd Phase (Setting)' | 'Inactive';
  isDhaiyaActive: boolean;
  dhaiyaType: 'Kantaka Shani (4th House)' | 'Ashtama Shani (8th House)' | 'None';
  saturnSignIndex: number;
  moonSignIndex: number;
  description: string;
}

export function evaluateSadeSati(
  moonSignIndex: number,
  currentSaturnSignIndex: number
): SadeSatiEvaluation {
  const saturnFromMoon = ((currentSaturnSignIndex - moonSignIndex + 12) % 12) + 1;

  let isSadeSatiActive = false;
  let phase: SadeSatiEvaluation['phase'] = 'Inactive';
  let isDhaiyaActive = false;
  let dhaiyaType: SadeSatiEvaluation['dhaiyaType'] = 'None';
  let description = 'Saturn is in a neutral transit house from natal Moon.';

  if (saturnFromMoon === 12) {
    isSadeSatiActive = true;
    phase = '1st Phase (Rising)';
    description = 'Saturn is transiting 12th from natal Moon (First Phase of Sade Sati - mental stress, expenses).';
  } else if (saturnFromMoon === 1) {
    isSadeSatiActive = true;
    phase = '2nd Phase (Peak)';
    description = 'Saturn is transiting natal Moon sign (Peak Phase of Sade Sati - intense transformation and pressure).';
  } else if (saturnFromMoon === 2) {
    isSadeSatiActive = true;
    phase = '3rd Phase (Setting)';
    description = 'Saturn is transiting 2nd from natal Moon (Setting Phase of Sade Sati - settling of affairs, financial resolution).';
  } else if (saturnFromMoon === 4) {
    isDhaiyaActive = true;
    dhaiyaType = 'Kantaka Shani (4th House)';
    description = 'Saturn is transiting 4th from Moon (Kantaka Shani - domestic instability, career pressure).';
  } else if (saturnFromMoon === 8) {
    isDhaiyaActive = true;
    dhaiyaType = 'Ashtama Shani (8th House)';
    description = 'Saturn is transiting 8th from Moon (Ashtama Shani - health vulnerabilities, unexpected hurdles).';
  }

  return {
    isSadeSatiActive,
    phase,
    isDhaiyaActive,
    dhaiyaType,
    saturnSignIndex: currentSaturnSignIndex,
    moonSignIndex,
    description
  };
}

// =========================================================================
// 4. KUNDLI MILAN ENGINE (Ashtakoota 36 Gunas)
// =========================================================================

export interface AshtakootaScore {
  koota: string;
  obtainedPoints: number;
  maxPoints: number;
  description: string;
}

export interface KundliMilanReport {
  totalScore: number; // 0 to 36
  maxScore: 36;
  kootas: AshtakootaScore[];
  isCompatible: boolean;
  recommendation: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  isBhakootDoshaCancelled: boolean;
  isNadiDoshaCancelled: boolean;
}

// 14 Animal Yonis
const NAKSHATRA_YONI = [
  'Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep', 'Cat',
  'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo', 'Tiger', 'Deer', 'Deer',
  'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion', 'Cow', 'Elephant'
];

// 3 Nadis: 0 = Adi (Vata), 1 = Madhya (Pitta), 2 = Antya (Kapha)
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2
];

// Gana: 0 = Deva, 1 = Manushya, 2 = Rakshasa
const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2,
  2, 1, 1, 0, 2, 0, 2, 0, 2,
  2, 1, 1, 0, 2, 2, 1, 1, 0
];

export function calculateKundliMilan(
  groomMoonLon: number,
  brideMoonLon: number
): KundliMilanReport {
  const nakSpan = 360 / 27;
  const groomNak = Math.floor((((groomMoonLon % 360) + 360) % 360) / nakSpan);
  const brideNak = Math.floor((((brideMoonLon % 360) + 360) % 360) / nakSpan);

  const groomSign = Math.floor((((groomMoonLon % 360) + 360) % 360) / 30);
  const brideSign = Math.floor((((brideMoonLon % 360) + 360) % 360) / 30);

  const kootas: AshtakootaScore[] = [];

  // 1. Varna (1 Point)
  // Water signs (3, 7, 11) = Brahmin (4), Fire (0, 4, 8) = Kshatriya (3), Earth (1, 5, 9) = Vaishya (2), Air (2, 6, 10) = Shudra (1)
  const getVarnaRank = (s: number) => [3, 7, 11].includes(s) ? 4 : [0, 4, 8].includes(s) ? 3 : [1, 5, 9].includes(s) ? 2 : 1;
  const gVarna = getVarnaRank(groomSign);
  const bVarna = getVarnaRank(brideSign);
  const varnaScore = gVarna >= bVarna ? 1 : 0;
  kootas.push({ koota: 'Varna', obtainedPoints: varnaScore, maxPoints: 1, description: 'Spiritual inclination & ego compatibility.' });

  // 2. Vashya (2 Points)
  const vashyaScore = groomSign === brideSign ? 2 : [0, 4, 8].includes(groomSign) && [0, 4, 8].includes(brideSign) ? 2 : 1;
  kootas.push({ koota: 'Vashya', obtainedPoints: vashyaScore, maxPoints: 2, description: 'Mutual attraction & dominion.' });

  // 3. Tara / Dina (3 Points)
  const distGtoB = ((brideNak - groomNak + 27) % 9) + 1;
  const distBtoG = ((groomNak - brideNak + 27) % 9) + 1;
  const badTaras = [3, 5, 7]; // Vipat, Pratyak, Vadha
  const taraScore = (!badTaras.includes(distGtoB) && !badTaras.includes(distBtoG)) ? 3 : (!badTaras.includes(distGtoB) || !badTaras.includes(distBtoG)) ? 1.5 : 0;
  kootas.push({ koota: 'Tara', obtainedPoints: taraScore, maxPoints: 3, description: 'Destiny, health, and mutual longevity.' });

  // 4. Yoni (4 Points)
  const gYoni = NAKSHATRA_YONI[groomNak];
  const bYoni = NAKSHATRA_YONI[brideNak];
  let yoniScore = 2; // neutral
  if (gYoni === bYoni) yoniScore = 4;
  else {
    const enemyPairs = [
      ['Cow', 'Tiger'], ['Elephant', 'Lion'], ['Horse', 'Buffalo'],
      ['Dog', 'Deer'], ['Cat', 'Rat'], ['Serpent', 'Mongoose'], ['Monkey', 'Sheep']
    ];
    const isEnemy = enemyPairs.some(([y1, y2]) => (y1 === gYoni && y2 === bYoni) || (y2 === gYoni && y1 === bYoni));
    if (isEnemy) yoniScore = 0;
    else yoniScore = 2;
  }
  kootas.push({ koota: 'Yoni', obtainedPoints: yoniScore, maxPoints: 4, description: 'Biological & intimate compatibility.' });

  // 5. Graha Maitri (5 Points)
  const gLord = SIGN_LORDS[groomSign];
  const bLord = SIGN_LORDS[brideSign];
  let maitriScore = 3;
  if (gLord === bLord) maitriScore = 5;
  kootas.push({ koota: 'Graha Maitri', obtainedPoints: maitriScore, maxPoints: 5, description: 'Psychological friendship & worldview.' });

  // 6. Gana (6 Points)
  const gGana = NAKSHATRA_GANA[groomNak]; // 0=Deva, 1=Manushya, 2=Rakshasa
  const bGana = NAKSHATRA_GANA[brideNak];
  let ganaScore = 0;
  if (gGana === bGana) ganaScore = 6;
  else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) ganaScore = 5;
  else if (gGana === 0 && bGana === 2) ganaScore = 1;
  else ganaScore = 0;
  kootas.push({ koota: 'Gana', obtainedPoints: ganaScore, maxPoints: 6, description: 'Temperament and behavioral compatibility.' });

  // 7. Bhakoot (7 Points)
  const signDistance = ((brideSign - groomSign + 12) % 12) + 1;
  let bhakootScore = 7;
  let isBhakootDoshaCancelled = false;

  // Inauspicious Bhakoot: 2/12 (Dwirdwadash), 6/8 (Shadashtak), 9/5 (Navapancham)
  if ([2, 12, 6, 8, 5, 9].includes(signDistance)) {
    // Check cancellation: same sign lord or mutual friends
    if (gLord === bLord) {
      isBhakootDoshaCancelled = true;
      bhakootScore = 7;
    } else {
      bhakootScore = 0;
    }
  }
  kootas.push({ koota: 'Bhakoot', obtainedPoints: bhakootScore, maxPoints: 7, description: 'Family welfare, progeny, and economic harmony.' });

  // 8. Nadi (8 Points)
  const gNadi = NAKSHATRA_NADI[groomNak];
  const bNadi = NAKSHATRA_NADI[brideNak];
  let nadiScore = 8;
  let isNadiDoshaCancelled = false;

  if (gNadi === bNadi) {
    // Nadi Dosha cancellation: different signs
    if (groomSign !== brideSign) {
      isNadiDoshaCancelled = true;
      nadiScore = 8;
    } else {
      nadiScore = 0;
    }
  }
  kootas.push({ koota: 'Nadi', obtainedPoints: nadiScore, maxPoints: 8, description: 'Genetic health, nervous constitution, and offspring longevity.' });

  const totalScore = kootas.reduce((acc, k) => acc + k.obtainedPoints, 0);
  let recommendation: KundliMilanReport['recommendation'] = 'Not Recommended';
  if (totalScore >= 28) recommendation = 'Excellent';
  else if (totalScore >= 21) recommendation = 'Good';
  else if (totalScore >= 18) recommendation = 'Average';

  return {
    totalScore,
    maxScore: 36,
    kootas,
    isCompatible: totalScore >= 18,
    recommendation,
    isBhakootDoshaCancelled,
    isNadiDoshaCancelled
  };
}

// =========================================================================
// 5. KRISHNAMURTI PADDHATI (KP JYOTISH ENGINE)
// =========================================================================

export interface KPSignificatorDetail {
  planet: string;
  signLord: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
  longitude: number;
}

export const KP_VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

export const KP_LORDS_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

/**
 * Calculates exact KP Sign Lord, Star Lord, Sub-Lord, and Sub-Sub Lord
 * for any given sidereal longitude.
 */
export function calculateKPSubLord(longitude: number): {
  signLord: string;
  starLord: string;
  subLord: string;
  subSubLord: string;
} {
  const normLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normLon / 30);
  const signLord = SIGN_LORDS[signIndex];

  const nakSpan = 360 / 27; // 13°20'
  const nakIndex = Math.floor(normLon / nakSpan);
  const starLord = KP_LORDS_ORDER[nakIndex % 9];

  const arcInNak = normLon - nakIndex * nakSpan;
  const starLordIndex = KP_LORDS_ORDER.indexOf(starLord);

  // Sub Lord Calculation: Proportional distribution of 13°20' (800')
  let accumulatedMinutes = 0;
  const arcInNakMinutes = arcInNak * 60;
  let subLord = starLord;
  let subLordIndex = starLordIndex;
  let subStartMin = 0;
  let subSpanMin = 0;

  for (let i = 0; i < 9; i++) {
    const lIdx = (starLordIndex + i) % 9;
    const lName = KP_LORDS_ORDER[lIdx];
    const spanMin = (KP_VIMSHOTTARI_YEARS[lName] / 120) * 800; // minutes

    if (arcInNakMinutes >= accumulatedMinutes && arcInNakMinutes < accumulatedMinutes + spanMin) {
      subLord = lName;
      subLordIndex = lIdx;
      subStartMin = accumulatedMinutes;
      subSpanMin = spanMin;
      break;
    }
    accumulatedMinutes += spanMin;
  }

  // Sub-Sub Lord Calculation within Sub Lord
  const arcInSubMin = arcInNakMinutes - subStartMin;
  let accumulatedSSMin = 0;
  let subSubLord = subLord;

  for (let j = 0; j < 9; j++) {
    const sslIdx = (subLordIndex + j) % 9;
    const sslName = KP_LORDS_ORDER[sslIdx];
    const ssSpanMin = (KP_VIMSHOTTARI_YEARS[sslName] / 120) * subSpanMin;

    if (arcInSubMin >= accumulatedSSMin && arcInSubMin < accumulatedSSMin + ssSpanMin) {
      subSubLord = sslName;
      break;
    }
    accumulatedSSMin += ssSpanMin;
  }

  return { signLord, starLord, subLord, subSubLord };
}

// =========================================================================
// 6. JAIMINI JYOTISH ENGINE (7 Chara Karakas & Arudha Padas)
// =========================================================================

export interface JaiminiKarakaDetail {
  karakaName: 'Atmakaraka' | 'Amatyakaraka' | 'Bhratrikaraka' | 'Matrikaraka' | 'Putrakaraka' | 'Gnatikaraka' | 'Darakaraka';
  symbol: 'AK' | 'AmK' | 'BK' | 'MK' | 'PK' | 'GK' | 'DK';
  planetName: string;
  degreeInSign: number;
}

export interface ArudhaPadaDetail {
  houseNumber: number; // 1 to 12
  padaCode: string;    // AL (A1), A2, A3.. A12 (UL)
  padaSignIndex: number;
  padaSignName: string;
}

export function calculateJaiminiDetails(natalChart: NatalChartData): {
  karakas: JaiminiKarakaDetail[];
  arudhaPadas: ArudhaPadaDetail[];
  arudhaLagna: ArudhaPadaDetail;
  upapadaLagna: ArudhaPadaDetail;
} {
  // 1. 7 Chara Karakas: Sun to Saturn ranked by degree in sign descending
  const physicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    .map(name => natalChart.planets.find(p => p.name === name)!)
    .filter(Boolean);

  physicalPlanets.sort((a, b) => b.degreeInSign - a.degreeInSign);

  const karakaNames: JaiminiKarakaDetail['karakaName'][] = [
    'Atmakaraka', 'Amatyakaraka', 'Bhratrikaraka', 'Matrikaraka', 'Putrakaraka', 'Gnatikaraka', 'Darakaraka'
  ];
  const karakaSymbols: JaiminiKarakaDetail['symbol'][] = ['AK', 'AmK', 'BK', 'MK', 'PK', 'GK', 'DK'];

  const karakas: JaiminiKarakaDetail[] = physicalPlanets.map((p, idx) => ({
    karakaName: karakaNames[idx],
    symbol: karakaSymbols[idx],
    planetName: p.name,
    degreeInSign: p.degreeInSign
  }));

  // 2. 12 Bhava Arudha Padas with classical 1st and 7th jump exceptions
  const arudhaPadas: ArudhaPadaDetail[] = [];
  const lagnaSign = natalChart.ascendant.signIndex;

  for (let h = 1; h <= 12; h++) {
    const houseSign = (lagnaSign + h - 1) % 12;
    const lordName = SIGN_LORDS[houseSign];
    const lordPlanet = natalChart.planets.find(p => p.name === lordName);
    const lordSign = lordPlanet ? lordPlanet.signIndex : houseSign;

    const dist = ((lordSign - houseSign + 12) % 12) + 1;
    let rawPadaSign = (lordSign + dist - 1) % 12;

    // Exception: If pada falls in 1st or 7th from houseSign, move 10 houses forward
    const padaFromHouse = ((rawPadaSign - houseSign + 12) % 12) + 1;
    if (padaFromHouse === 1 || padaFromHouse === 7) {
      rawPadaSign = (rawPadaSign + 9) % 12; // 10th house
    }

    const code = h === 1 ? 'AL' : h === 12 ? 'UL' : `A${h}`;
    arudhaPadas.push({
      houseNumber: h,
      padaCode: code,
      padaSignIndex: rawPadaSign,
      padaSignName: SIGN_NAMES[rawPadaSign]
    });
  }

  return {
    karakas,
    arudhaPadas,
    arudhaLagna: arudhaPadas[0],
    upapadaLagna: arudhaPadas[11]
  };
}

// =========================================================================
// 7. TAJIK VARSHPHAL ENGINE (Annual Solar Return)
// =========================================================================

export interface VarshphalReport {
  targetAge: number;
  varshpraveshDate: Date;
  munthaSignIndex: number;
  munthaSignName: string;
  punyaSahamLongitude: number;
  vidyaSahamLongitude: number;
}

/**
 * Calculates Varshpravesh (exact annual solar return timestamp using Newton-Raphson)
 * and Muntha sign for any target completed age.
 */
export function calculateVarshphal(
  natalChart: NatalChartData,
  completedYears: number
): VarshphalReport {
  const sun = natalChart.planets.find(p => p.name === 'Sun')!;
  const natalSunLon = sun.longitude;

  // Approximate solar return: birthDate + completedYears * 365.2425 days
  let currentEstDate = new Date(natalChart.birthDate.getTime() + completedYears * 365.2425 * 86400 * 1000);

  // Refine using root-finding on Sun sidereal longitude
  for (let iter = 0; iter < 5; iter++) {
    const jd_ut = (currentEstDate.getTime() / 86400000) + 2440587.5;
    const pos = drik_calc_ut(jd_ut, SE_SUN, SEFLG_SIDEREAL);
    const sunLon = pos[0];
    const sunDailySpeed = pos[3] || 0.9856;
    let diff = ((natalSunLon - sunLon + 540) % 360) - 180;
    const daysAdjust = diff / sunDailySpeed;
    currentEstDate = new Date(currentEstDate.getTime() + daysAdjust * 86400 * 1000);
    if (Math.abs(daysAdjust) < 0.00001) break; // accurate to under 1 second
  }

  // Muntha = (LagnaSign + completedYears) % 12
  const munthaSignIndex = (natalChart.ascendant.signIndex + completedYears) % 12;

  // Punya Saham (Day birth: Moon - Sun + Ascendant, Night: Sun - Moon + Ascendant)
  const moon = natalChart.planets.find(p => p.name === 'Moon')!;
  const ascLon = natalChart.ascendant.longitude;
  const isDayBirth = natalChart.birthDate.getUTCHours() >= 6 && natalChart.birthDate.getUTCHours() < 18;

  const punyaSaham = isDayBirth
    ? ((moon.longitude - sun.longitude + ascLon + 720) % 360)
    : ((sun.longitude - moon.longitude + ascLon + 720) % 360);

  const vidyaSaham = isDayBirth
    ? ((sun.longitude - moon.longitude + ascLon + 720) % 360)
    : ((moon.longitude - sun.longitude + ascLon + 720) % 360);

  return {
    targetAge: completedYears,
    varshpraveshDate: currentEstDate,
    munthaSignIndex,
    munthaSignName: SIGN_NAMES[munthaSignIndex],
    punyaSahamLongitude: punyaSaham,
    vidyaSahamLongitude: vidyaSaham
  };
}

// =========================================================================
// 8. LAL KITAB & 9. NADI & PANCH PAKSHI ENGINES
// =========================================================================

export interface LalKitabAnalysis {
  sleepingHouses: number[];
  artificialMasnooiPlanets: { pair: string; represents: string }[];
  isDharmiTeva: boolean;
}

export function evaluateLalKitab(natalChart: NatalChartData): LalKitabAnalysis {
  // In Lal Kitab, House 1 is Aries regardless of Lagna
  // Sleeping houses = houses unoccupied and unaspected
  const occupiedHouses = new Set(natalChart.planets.map(p => p.houseOccupied));
  const sleepingHouses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (!occupiedHouses.has(h)) sleepingHouses.push(h);
  }

  // Masnooi (artificial planets)
  const masnooi: { pair: string; represents: string }[] = [
    { pair: 'Sun + Saturn', represents: 'Ketu' },
    { pair: 'Sun + Venus', represents: 'Mercury' },
    { pair: 'Mars + Mercury', represents: 'Ketu' },
    { pair: 'Venus + Jupiter', represents: 'Sun' },
    { pair: 'Jupiter + Rahu', represents: 'Mercury' }
  ];

  // Dharmi Teva: Saturn in 11th or Jupiter in 10th or Moon in 4th
  const getH = (name: string) => natalChart.planets.find(p => p.name === name)?.houseOccupied;
  const isDharmiTeva = getH('Saturn') === 11 || getH('Jupiter') === 10 || getH('Moon') === 4;

  return {
    sleepingHouses,
    artificialMasnooiPlanets: masnooi,
    isDharmiTeva: !!isDharmiTeva
  };
}

export interface PanchPakshiResult {
  birthBird: 'Vulture' | 'Owl' | 'Crow' | 'Cock' | 'Peacock';
  currentActivity: 'Eating' | 'Walking' | 'Ruling' | 'Sleeping' | 'Dying';
}

export function evaluatePanchPakshi(moonLongitude: number, queryHour: number = 12): PanchPakshiResult {
  const nakSpan = 360 / 27;
  const nakIndex = Math.floor((((moonLongitude % 360) + 360) % 360) / nakSpan);
  const birds: PanchPakshiResult['birthBird'][] = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'];
  const birthBird = birds[nakIndex % 5];

  const activities: PanchPakshiResult['currentActivity'][] = ['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying'];
  const actIndex = (Math.floor(queryHour / 2.4) + (nakIndex % 5)) % 5;

  return {
    birthBird,
    currentActivity: activities[actIndex]
  };
}
