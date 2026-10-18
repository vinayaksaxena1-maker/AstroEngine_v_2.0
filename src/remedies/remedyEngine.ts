/**
 * Sanatan Vedic Remedies Engine
 *
 * Implements classical recommendations for:
 * 1. Ratna Paramarsha (Gemstones: Life, Lucky, Benefic Stone with strict Dusthana & Maraka prohibition)
 * 2. Rudraksha Paramarsha (Mukhi 1-14 mapped to planetary weaknesses & combustion)
 * 3. Vedic Mantras (Beej & Gayatri with classical japa counts)
 * 4. Daan & Lal Kitab Upay (Charity, specific items, days, and recipients for Doshas)
 *
 * Grounded in Brihat Parashara Hora Shastra, Phaladeepika, and Lal Kitab.
 */

import { NatalChartData, SIGN_LORDS } from '../kundli/houseCusps';
import { ShadbalaSummary } from '../shadbala/shadbalaEngine';
import { DoshaEvaluation, YogaEvaluation } from '../synthesis/predictiveEngine';

export interface GemstoneRecommendation {
  type: 'LifeStone' | 'LuckyStone' | 'BeneficStone';
  typeHindi: string;
  name: string;
  hindiName: string;
  sanskritName: string;
  rulingPlanet: string;
  rulingHouse: number; // 1, 9, or 5
  recommendedWeight: string;
  metal: string;
  finger: string;
  dayToWear: string;
  auspiciousHora: string;
  consecrationMantra: string;
  benefits: string;
}

export interface RudrakshaRecommendation {
  mukhi: number;
  mukhiName: string;
  rulingPlanet: string;
  deity: string;
  beejaMantra: string;
  wearDay: string;
  reason: string;
  benefits: string;
}

export interface MantraRemedy {
  planetName: string;
  beejMantra: string;
  vedicGayatri: string;
  recommendedJapaCount: number;
  bestTime: string;
  malaType: string;
  purpose: string;
}

export interface CharityRemedy {
  remedyType: 'Shani' | 'Manglik' | 'KaalSarp' | 'Pitra' | 'General';
  title: string;
  itemsToDonate: string[];
  auspiciousDay: string;
  targetRecipient: string;
  prescribedRitual: string;
  reason: string;
}

export interface VedicRemediesResult {
  gemstones: {
    lifeStone?: GemstoneRecommendation;
    luckyStone?: GemstoneRecommendation;
    beneficStone?: GemstoneRecommendation;
    prohibitedPlanets: string[]; // Maraka & Dusthana lords strictly barred
    generalGuidance: string;
  };
  rudraksha: {
    primary: RudrakshaRecommendation;
    secondary: RudrakshaRecommendation[];
    generalGuidance: string;
  };
  mantras: MantraRemedy[];
  charities: CharityRemedy[];
}

interface GemstoneCatalogItem {
  name: string;
  hindiName: string;
  sanskritName: string;
  weight: string;
  metal: string;
  finger: string;
  dayToWear: string;
  auspiciousHora: string;
  consecrationMantra: string;
  benefits: string;
}

const GEMSTONE_CATALOG: Record<string, GemstoneCatalogItem> = {
  Sun: {
    name: 'Ruby',
    hindiName: 'माणिक्य (माणिक)',
    sanskritName: 'Manikya',
    weight: '5.25 - 6.5 Carats (6-7 Ratti)',
    metal: 'Gold or Copper',
    finger: 'Ring finger of right hand',
    dayToWear: 'Sunday',
    auspiciousHora: 'Surya Hora (at or just after sunrise)',
    consecrationMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    benefits: 'Boosts physical constitution, executive authority, fatherly blessings, and professional distinction.'
  },
  Moon: {
    name: 'Pearl',
    hindiName: 'मोती',
    sanskritName: 'Mukta',
    weight: '5.0 - 7.0 Carats (5.5-7.5 Ratti)',
    metal: 'Pure Silver',
    finger: 'Little finger of right hand',
    dayToWear: 'Monday',
    auspiciousHora: 'Chandra Hora (morning or moonrise)',
    consecrationMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',
    benefits: 'Calms fluctuating emotions, dissolves anxiety, restores peaceful sleep, and nurtures maternal harmony.'
  },
  Mars: {
    name: 'Red Coral',
    hindiName: 'मूंगा',
    sanskritName: 'Pravala',
    weight: '6.0 - 8.0 Carats (6.5-9 Ratti)',
    metal: 'Copper, Gold, or Panchadhatu',
    finger: 'Ring finger of right hand',
    dayToWear: 'Tuesday',
    auspiciousHora: 'Mangal Hora',
    consecrationMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    benefits: 'Increases courage, vitality, sports stamina, property acquisition, and overcomes lethargy.'
  },
  Mercury: {
    name: 'Emerald',
    hindiName: 'पन्ना',
    sanskritName: 'Marakata',
    weight: '4.5 - 6.0 Carats (5-6.5 Ratti)',
    metal: 'Gold, Silver, or Bronze',
    finger: 'Little finger of right hand',
    dayToWear: 'Wednesday',
    auspiciousHora: 'Budha Hora',
    consecrationMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    benefits: 'Sharpens analytical intellect, commerce acumen, articulate speech, and balances the nervous system.'
  },
  Jupiter: {
    name: 'Yellow Sapphire',
    hindiName: 'पुखराज',
    sanskritName: 'Pushparaga',
    weight: '4.5 - 6.5 Carats (5-7 Ratti)',
    metal: 'Yellow Gold or Panchadhatu',
    finger: 'Index finger of right hand',
    dayToWear: 'Thursday',
    auspiciousHora: 'Guru Hora',
    consecrationMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    benefits: 'Expands spiritual wisdom, abundance, higher learning, good fortune, and progeny happiness.'
  },
  Venus: {
    name: 'Diamond / White Zircon',
    hindiName: 'हीरा / जरकन',
    sanskritName: 'Vajra',
    weight: '1.0 - 2.0 Carats (Diamond) / 5.0 - 7.0 Carats (Zircon)',
    metal: 'Platinum, White Gold, or Silver',
    finger: 'Middle or Little finger of right hand',
    dayToWear: 'Friday',
    auspiciousHora: 'Shukra Hora',
    consecrationMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    benefits: 'Elevates creative refinement, aesthetic appreciation, matrimonial bliss, and worldly luxuries.'
  },
  Saturn: {
    name: 'Blue Sapphire',
    hindiName: 'नीलम',
    sanskritName: 'Neelam',
    weight: '4.5 - 6.0 Carats (5-6.5 Ratti)',
    metal: 'Panchadhatu, Iron, or White Gold',
    finger: 'Middle finger of right hand',
    dayToWear: 'Saturday',
    auspiciousHora: 'Shani Hora',
    consecrationMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    benefits: 'Instills steadfast perseverance, focus, judicial acumen, karmic shielding, and long-term mastery.'
  }
};

const RUDRAKSHA_CATALOG: Record<string, {
  mukhi: number;
  mukhiName: string;
  deity: string;
  beejaMantra: string;
  wearDay: string;
  benefits: string;
}> = {
  Sun: {
    mukhi: 1,
    mukhiName: '1 Mukhi (Ekamukhi) / 12 Mukhi',
    deity: 'Lord Shiva / Surya Deva',
    beejaMantra: 'ॐ ह्रीं नमः (Om Hreem Namah) / ॐ क्रौं क्षौं रौं नमः',
    wearDay: 'Sunday morning',
    benefits: 'Cures ocular & heart ailments, removes self-doubt, bestows supreme administrative authority.'
  },
  Moon: {
    mukhi: 2,
    mukhiName: '2 Mukhi (Dvimukhi)',
    deity: 'Ardhanarishvara (Shiva-Shakti)',
    beejaMantra: 'ॐ ॐ नमः (Om Om Namah)',
    wearDay: 'Monday morning',
    benefits: 'Harmonizes marital relations, heals emotional trauma, stabilizes mind, balances bodily fluids.'
  },
  Mars: {
    mukhi: 3,
    mukhiName: '3 Mukhi (Trimukhi)',
    deity: 'Lord Agni',
    beejaMantra: 'ॐ क्लीं नमः (Om Kleem Namah)',
    wearDay: 'Tuesday morning',
    benefits: 'Purifies past karmic complexes, destroys chronic fatigue, elevates metabolism and courage.'
  },
  Mercury: {
    mukhi: 4,
    mukhiName: '4 Mukhi (Chaturmukhi)',
    deity: 'Lord Brahma',
    beejaMantra: 'ॐ ह्रीं नमः (Om Hreem Namah)',
    wearDay: 'Wednesday morning',
    benefits: 'Enhances memory retention, academic excellence, oratory skills, and logical reasoning.'
  },
  Jupiter: {
    mukhi: 5,
    mukhiName: '5 Mukhi (Panchamukhi)',
    deity: 'Lord Kalagni Rudra',
    beejaMantra: 'ॐ ह्रीं नमः (Om Hreem Namah)',
    wearDay: 'Thursday morning',
    benefits: 'Regulates blood pressure, imparts spiritual insight, fosters wisdom, peace, and longevity.'
  },
  Venus: {
    mukhi: 6,
    mukhiName: '6 Mukhi (Shanmukhi)',
    deity: 'Lord Kartikeya',
    beejaMantra: 'ॐ ह्रीं हुं नमः (Om Hreem Hoom Namah)',
    wearDay: 'Friday morning',
    benefits: 'Bestows charismatic speech, artistic prowess, willpower, and cures hormonal imbalances.'
  },
  Saturn: {
    mukhi: 7,
    mukhiName: '7 Mukhi (Saptamukhi) / 14 Mukhi',
    deity: 'Goddess Mahalakshmi / Lord Hanuman',
    beejaMantra: 'ॐ हुं नमः (Om Hoom Namah)',
    wearDay: 'Saturday morning',
    benefits: 'Neutralizes Shani Sade Sati/Dhaiya, dispels chronic adversity, unblocks financial stagnation.'
  },
  Rahu: {
    mukhi: 8,
    mukhiName: '8 Mukhi (Ashtamukhi)',
    deity: 'Lord Ganesha (Vighnaharta)',
    beejaMantra: 'ॐ हुं नमः (Om Hoom Namah)',
    wearDay: 'Wednesday or Saturday morning',
    benefits: 'Removes insurmountable obstacles, protects from phantom fears, illusions, and Rahu afflictions.'
  },
  Ketu: {
    mukhi: 9,
    mukhiName: '9 Mukhi (Navamukhi)',
    deity: 'Goddess Durga / Navadurga',
    beejaMantra: 'ॐ ह्रीं हुं नमः (Om Hreem Hoom Namah)',
    wearDay: 'Tuesday or Saturday morning',
    benefits: 'Confers profound spiritual liberation, fearlessness, removes depression, and heals Ketu afflictions.'
  }
};

const MANTRAS_CATALOG: Record<string, {
  beejMantra: string;
  vedicGayatri: string;
  recommendedJapaCount: number;
  bestTime: string;
  malaType: string;
  purpose: string;
}> = {
  Sun: {
    beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    vedicGayatri: 'ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नः सूर्यः प्रचोदयात्',
    recommendedJapaCount: 7000,
    bestTime: 'Sunrise facing East',
    malaType: 'Ruby or Sandalwood (Lal Chandan) Mala',
    purpose: 'Strengthens self-confidence, paternal relationship, and overall health.'
  },
  Moon: {
    beejMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',
    vedicGayatri: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्',
    recommendedJapaCount: 11000,
    bestTime: 'Evening or nighttime facing North-West',
    malaType: 'Pearl, Sphatik (Quartz), or Silver Mala',
    purpose: 'Stabilizes emotional fluctuations, sharpens intuition, and fosters inner peace.'
  },
  Mars: {
    beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    vedicGayatri: 'ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्',
    recommendedJapaCount: 10000,
    bestTime: 'Morning facing South',
    malaType: 'Red Coral or Sandalwood Mala',
    purpose: 'Calms anger, overcomes debts, protects against accidents, and mitigates Kuja dosha.'
  },
  Mercury: {
    beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    vedicGayatri: 'ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात्',
    recommendedJapaCount: 9000,
    bestTime: 'Morning facing North',
    malaType: 'Tulsi or Green Agate Mala',
    purpose: 'Enhances cognitive sharpness, public speaking, business success, and academic performance.'
  },
  Jupiter: {
    beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    vedicGayatri: 'ॐ वृषभध्वजाय विद्महे कृणीहस्ताय धीमहि तन्नो गुरुः प्रचोदयात्',
    recommendedJapaCount: 19000,
    bestTime: 'Early morning facing North-East',
    malaType: 'Turmeric (Haldi) or Rudraksha Mala',
    purpose: 'Brings divine grace, moral righteousness, wealth, and spiritual growth.'
  },
  Venus: {
    beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    vedicGayatri: 'ॐ भृगुजाय विद्महे दिव्यदेहाय धीमहि तन्नः शुक्रः प्रचोदयात्',
    recommendedJapaCount: 16000,
    bestTime: 'Sunrise or twilight facing South-East',
    malaType: 'Sphatik (Quartz) or Kamalgatta Mala',
    purpose: 'Enhances artistic talents, romantic attraction, luxury, and physical charm.'
  },
  Saturn: {
    beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    vedicGayatri: 'ॐ नीलांजनसमाभासं रविपुत्रं यमाग्रजम् । छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम् ॥',
    recommendedJapaCount: 23000,
    bestTime: 'Evening after sunset facing West',
    malaType: 'Rudraksha or Blue Sapphire / Amethyst Mala',
    purpose: 'Removes obstacles, relieves Sade Sati/Dhaiya burdens, and fosters deep endurance.'
  },
  Rahu: {
    beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    vedicGayatri: 'ॐ नागाधिराजाय विद्महे पद्मनेत्राय धीमहि तन्नो राहुः प्रचोदयात्',
    recommendedJapaCount: 18000,
    bestTime: 'Nighttime facing South-West',
    malaType: 'Chandan or Rudraksha Mala',
    purpose: 'Shields from confusion, sudden loss, psychic distress, and Kaal Sarp dosha.'
  },
  Ketu: {
    beejMantra: 'ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः',
    vedicGayatri: 'ॐ अश्मध्वजाय विद्महे शूलहस्ताय धीमहि तन्नो केतुः प्रचोदयात्',
    recommendedJapaCount: 17000,
    bestTime: 'Early morning or night facing North-West',
    malaType: 'Rudraksha or Cat\'s Eye Mala',
    purpose: 'Deepens detachment, removes spiritual blockages, and awakens occult wisdom.'
  }
};

/**
 * Computes complete Vedic Remedies according to classical Parashari principles.
 */
export function generateVedicRemedies(params: {
  chart: NatalChartData;
  shadbala: ShadbalaSummary;
  doshas: DoshaEvaluation[];
  yogas: YogaEvaluation[];
}): VedicRemediesResult {
  const { chart, shadbala, doshas } = params;
  const ascSignIdx = chart.ascendant.signIndex; // 0 to 11

  // 1. Identify House Lords for all 12 houses (Whole Sign / Cusp parity)
  const houseLords = Array.from({ length: 12 }, (_, i) => {
    const signIdx = (ascSignIdx + i) % 12;
    return SIGN_LORDS[signIdx];
  });

  const lord1 = houseLords[0];  // Lagnesh (House 1)
  const lord2 = houseLords[1];  // Maraka (House 2)
  const lord5 = houseLords[4];  // Vidyapathi (House 5)
  const lord6 = houseLords[5];  // Dusthana (House 6)
  const lord7 = houseLords[6];  // Maraka (House 7)
  const lord8 = houseLords[7];  // Dusthana (House 8)
  const lord9 = houseLords[8];  // Bhagyesh (House 9)
  const lord12 = houseLords[11]; // Dusthana (House 12)

  // Strict Maraka & Dusthana Prohibition (6, 8, 12, 2, 7)
  const dusthanaAndMarakaLords = new Set<string>([lord6, lord8, lord12, lord2, lord7]);
  const prohibitedPlanets = Array.from(dusthanaAndMarakaLords);

  // Helper to construct a GemstoneRecommendation
  const makeGem = (
    planet: string,
    type: GemstoneRecommendation['type'],
    typeHindi: string,
    house: number
  ): GemstoneRecommendation | undefined => {
    // Strict prohibition gate: If planet rules 6, 8, 12, 2, or 7, NEVER recommend!
    if (dusthanaAndMarakaLords.has(planet)) {
      return undefined;
    }
    const cat = GEMSTONE_CATALOG[planet];
    if (!cat) return undefined;
    return {
      type,
      typeHindi,
      name: cat.name,
      hindiName: cat.hindiName,
      sanskritName: cat.sanskritName,
      rulingPlanet: planet,
      rulingHouse: house,
      recommendedWeight: cat.weight,
      metal: cat.metal,
      finger: cat.finger,
      dayToWear: cat.dayToWear,
      auspiciousHora: cat.auspiciousHora,
      consecrationMantra: cat.consecrationMantra,
      benefits: cat.benefits
    };
  };

  const lifeStone = makeGem(lord1, 'LifeStone', 'जीवन रत्न', 1);
  const luckyStone = makeGem(lord9, 'LuckyStone', 'भाग्य रत्न', 9);
  const beneficStone = makeGem(lord5, 'BeneficStone', 'पुण्य रत्न', 5);

  const gemstoneResult = {
    lifeStone,
    luckyStone,
    beneficStone,
    prohibitedPlanets,
    generalGuidance:
      'Gemstones amplify the planetary rays of auspicious functional benefics. Never wear gemstones of Dusthana (6th, 8th, 12th) or Maraka (2nd, 7th) lords even during their Mahadashas.'
  };

  // 2. Rudraksha Recommendation
  // Target the planet with lowest Shadbala strength ratio or severe combustion
  const sortedByStrength = [...shadbala.planets].sort((a, b) => a.strengthRatio - b.strengthRatio);
  const weakestPlanetName = sortedByStrength[0]?.planetName || 'Saturn';
  const combustPlanets = chart.planets.filter(p => p.isCombust).map(p => p.name);

  // Determine primary rudraksha
  const primaryPlanet = combustPlanets.length > 0 ? combustPlanets[0] : weakestPlanetName;
  const primaryCat = RUDRAKSHA_CATALOG[primaryPlanet] || RUDRAKSHA_CATALOG['Jupiter'];

  const primaryRudraksha: RudrakshaRecommendation = {
    mukhi: primaryCat.mukhi,
    mukhiName: primaryCat.mukhiName,
    rulingPlanet: primaryPlanet,
    deity: primaryCat.deity,
    beejaMantra: primaryCat.beejaMantra,
    wearDay: primaryCat.wearDay,
    reason: combustPlanets.includes(primaryPlanet)
      ? `${primaryPlanet} is combust with the Sun in the natal chart, needing energizing through Rudraksha.`
      : `${primaryPlanet} has the lowest Shadbala virupa ratio (${sortedByStrength[0]?.strengthRatio.toFixed(2)}), requiring planetary strengthening.`,
    benefits: primaryCat.benefits
  };

  // Secondary recommendations
  const secondaryList: RudrakshaRecommendation[] = [];
  const secondaryPlanets = sortedByStrength
    .slice(1, 3)
    .filter(p => p.strengthRatio < 1.0 && p.planetName !== primaryPlanet)
    .map(p => p.planetName);

  for (const sp of secondaryPlanets) {
    const sCat = RUDRAKSHA_CATALOG[sp];
    if (sCat) {
      secondaryList.push({
        mukhi: sCat.mukhi,
        mukhiName: sCat.mukhiName,
        rulingPlanet: sp,
        deity: sCat.deity,
        beejaMantra: sCat.beejaMantra,
        wearDay: sCat.wearDay,
        reason: `${sp} has below required Shadbala strength, benefiting from auxiliary Rudraksha support.`,
        benefits: sCat.benefits
      });
    }
  }

  // 3. Vedic Mantras
  // Include weak planets, combust planets, and active dosha planets
  const planetsToMantra = new Set<string>();
  if (primaryPlanet) planetsToMantra.add(primaryPlanet);
  for (const cp of combustPlanets) planetsToMantra.add(cp);
  for (const sp of secondaryPlanets) planetsToMantra.add(sp);

  // Add dosha-specific planets
  const hasManglik = doshas.some(d => d.name.includes('Manglik') && d.hasDosha && !d.isCancelled);
  if (hasManglik) planetsToMantra.add('Mars');

  const hasKaalSarp = doshas.some(d => d.name.includes('Kaal Sarp') && d.hasDosha && !d.isCancelled);
  if (hasKaalSarp) {
    planetsToMantra.add('Rahu');
    planetsToMantra.add('Ketu');
  }

  // If set is small, add Lagnesh and Bhagyesh
  if (planetsToMantra.size < 3) {
    planetsToMantra.add(lord1);
    planetsToMantra.add(lord9);
  }

  const mantras: MantraRemedy[] = Array.from(planetsToMantra)
    .map(pName => {
      const m = MANTRAS_CATALOG[pName];
      if (!m) return null;
      return {
        planetName: pName,
        beejMantra: m.beejMantra,
        vedicGayatri: m.vedicGayatri,
        recommendedJapaCount: m.recommendedJapaCount,
        bestTime: m.bestTime,
        malaType: m.malaType,
        purpose: m.purpose
      };
    })
    .filter((m): m is MantraRemedy => m !== null);

  // 4. Charity (दान) & Lal Kitab Upay
  const charities: CharityRemedy[] = [];

  // Check Shani Sade Sati or Saturn weakness
  const saturnShad = shadbala.planets.find(p => p.planetName === 'Saturn');
  if (saturnShad && saturnShad.strengthRatio < 1.0) {
    charities.push({
      remedyType: 'Shani',
      title: 'Shani Shanti Daan (Mustard Oil Chhaya Daan)',
      itemsToDonate: [
        'Mustard oil in an iron or bronze bowl (gaze at reflection before donating)',
        'Black sesame seeds (Kaale Til)',
        'Black blanket or warm dark clothing',
        'Whole black urad dal'
      ],
      auspiciousDay: 'Saturday evening after sunset',
      targetRecipient: 'Needy, elderly, or Shani temple ascetic',
      prescribedRitual: 'Look into a bowl of mustard oil, see your reflection (Chhaya Daan), and donate along with a small iron nail or coin.',
      reason: 'Soothes Saturnian karmic pressure, removes delays, and protects against affliction.'
    });
  }

  // Check Mangal Dosha
  if (hasManglik) {
    charities.push({
      remedyType: 'Manglik',
      title: 'Mangal Dosha Parihara Daan',
      itemsToDonate: [
        'Red lentils (Masoor Dal)',
        'Copper utensil or copper coins',
        'Jaggery (Gud) and sweet wheat rotis',
        'Red flowers and red cloth'
      ],
      auspiciousDay: 'Tuesday afternoon',
      targetRecipient: 'Youth, celibate monks, or Hanuman temple',
      prescribedRitual: 'Offer sweet red rotis and jaggery to stray cows or monkeys on Tuesdays. Recite Hanuman Chalisa daily.',
      reason: 'Neutralizes excess aggressive energy of Mars and balances marriage compatibility.'
    });
  }

  // Check Kaal Sarp Dosha
  if (hasKaalSarp) {
    charities.push({
      remedyType: 'KaalSarp',
      title: 'Kaal Sarp Shanti & Rahu-Ketu Daan',
      itemsToDonate: [
        'Pair of small silver or copper snakes (Naag-Nagin)',
        'Dry coconut with husk (flowed in running river)',
        'Radish with leaves (Mooli)',
        'Black and white checked blanket'
      ],
      auspiciousDay: 'Nag Panchami or Saturday / Amavasya',
      targetRecipient: 'Flowing natural river water or Shiva Temple',
      prescribedRitual: 'Offer milk and jal abhishek to Shiva Lingam. Perform Rudrabhishek with Mahamrityunjaya Mantra.',
      reason: 'Pacifies axis turbulence of Rahu and Ketu, ensuring unobstructed career progress.'
    });
  }

  // General Charity for lowest Shadbala planet if not covered above
  if (charities.length === 0) {
    charities.push({
      remedyType: 'General',
      title: `${weakestPlanetName} Strengthening Charity`,
      itemsToDonate: [
        weakestPlanetName === 'Jupiter' ? 'Yellow split peas (Chana Dal), turmeric, bananas' :
        weakestPlanetName === 'Venus' ? 'Kheer (rice pudding), white sugar, white silk' :
        weakestPlanetName === 'Sun' ? 'Wheat, jaggery, ruby-colored cloth' :
        weakestPlanetName === 'Moon' ? 'Rice, milk, silver coin, white flowers' :
        'Grains and seasonal fruits'
      ],
      auspiciousDay: weakestPlanetName === 'Jupiter' ? 'Thursday' : weakestPlanetName === 'Venus' ? 'Friday' : 'Sunday',
      targetRecipient: 'Needy scholars, underprivileged children, or cow shelter (Gaushala)',
      prescribedRitual: 'Offer donations with humility and unconditional devotion during the morning hours.',
      reason: `Boosts the functional potency of ${weakestPlanetName}, which showed the lowest Shadbala virupas.`
    });
  }

  return {
    gemstones: gemstoneResult,
    rudraksha: {
      primary: primaryRudraksha,
      secondary: secondaryList,
      generalGuidance:
        'Rudrakshas balance energetic electromagnetic fields and are completely safe for everyone without negative karmic side effects.'
    },
    mantras,
    charities
  };
}
