import { PanchangInfo } from './types';

export interface MuhuratSuitability {
  type: string;
  name: string;
  hindiName: string;
  isSuitable: boolean;
  score: number; // 0 to 100
  reasons: string[];
}

/**
 * Evaluates auspiciousness score for major life events on a given Panchang day.
 * Implements 100% offline rule matching logic.
 */
export function checkMuhurats(panchang: PanchangInfo): MuhuratSuitability[] {
  const tithiName = panchang.hinduDate.tithi.name;
  const nakshatraName = panchang.hinduDate.nakshatra.name;
  const paksha = panchang.hinduDate.paksha;

  // Extract tithi name prefix (e.g. "Panchami")
  const tithiType = tithiName.replace(/(Shukla\s*|Krishna\s*)/, '').trim();

  const dateObj = new Date(panchang.date);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const suitabilities: MuhuratSuitability[] = [];

  const auspiciousTithis = ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi'];
  const avoidTithis = ['Amavasya', 'Chaturthi', 'Navami', 'Chaturdashi', 'Ashtami'];

  // 1. Griha Pravesh Muhurat
  {
    const gpNakshatras = ['Rohini', 'Mrigashirsha', 'Chitra', 'Anuradha', 'Uttaraphalguni', 'Uttarashadha', 'Uttarabhadrapada', 'Revati'];
    const gpDays = [1, 3, 4, 5]; // Mon, Wed, Thu, Fri
    const reasons: string[] = [];
    let score = 50;

    if (paksha === 'Shukla') {
      score += 15;
      reasons.push('Shukla Paksha is favorable.');
    } else {
      score -= 10;
      reasons.push('Krishna Paksha is generally avoided for entering new homes.');
    }

    if (gpNakshatras.includes(nakshatraName)) {
      score += 25;
      reasons.push(`Nakshatra ${nakshatraName} is excellent for new home entry.`);
    } else {
      score -= 20;
      reasons.push(`Nakshatra ${nakshatraName} is not recommended.`);
    }

    if (auspiciousTithis.includes(tithiType)) {
      score += 15;
      reasons.push(`Tithi ${tithiType} is highly auspicious.`);
    } else if (avoidTithis.includes(tithiType)) {
      score -= 25;
      reasons.push(`Tithi ${tithiType} should be avoided.`);
    }

    if (gpDays.includes(dayOfWeek)) {
      score += 10;
      reasons.push('Weekday is favorable.');
    } else {
      score -= 10;
      reasons.push('Weekday is not ideal.');
    }

    suitabilities.push({
      type: 'griha_pravesh',
      name: 'Griha Pravesh',
      hindiName: 'गृह प्रवेश मुहूर्त',
      isSuitable: score >= 65,
      score: Math.max(0, Math.min(100, score)),
      reasons
    });
  }

  // 2. Vivah Muhurat
  {
    const vNakshatras = ['Rohini', 'Mrigashirsha', 'Magha', 'Uttaraphalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttarashadha', 'Uttarabhadrapada', 'Revati'];
    const vDays = [1, 3, 4, 5]; // Mon, Wed, Thu, Fri
    const reasons: string[] = [];
    let score = 50;

    if (vNakshatras.includes(nakshatraName)) {
      score += 25;
      reasons.push(`Highly auspicious wedding Nakshatra: ${nakshatraName}.`);
    } else {
      score -= 20;
      reasons.push(`Nakshatra ${nakshatraName} is not preferred.`);
    }

    if (auspiciousTithis.includes(tithiType)) {
      score += 15;
      reasons.push(`Tithi ${tithiType} is highly favorable.`);
    } else if (avoidTithis.includes(tithiType)) {
      score -= 30;
      reasons.push(`Tithi ${tithiType} is inauspicious.`);
    }

    if (vDays.includes(dayOfWeek)) {
      score += 10;
    } else {
      score -= 5;
    }

    suitabilities.push({
      type: 'vivah',
      name: 'Marriage (Vivah)',
      hindiName: 'विवाह मुहूर्त',
      isSuitable: score >= 65,
      score: Math.max(0, Math.min(100, score)),
      reasons
    });
  }

  // 3. Vahan Khareedi
  {
    const vhNakshatras = ['Ashwini', 'Rohini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Revati'];
    const vhDays = [0, 1, 3, 4, 5]; // Sun, Mon, Wed, Thu, Fri
    const reasons: string[] = [];
    let score = 50;

    if (vhNakshatras.includes(nakshatraName)) {
      score += 25;
      reasons.push(`Nakshatra ${nakshatraName} is auspicious for vehicle purchases.`);
    } else {
      score -= 15;
      reasons.push(`Nakshatra ${nakshatraName} is neutral.`);
    }

    if (['Tritiya', 'Panchami', 'Ekadashi', 'Trayodashi', 'Purnima'].includes(tithiType)) {
      score += 15;
      reasons.push(`Tithi ${tithiType} supports major purchases.`);
    } else if (avoidTithis.includes(tithiType)) {
      score -= 25;
      reasons.push(`Avoid vehicle purchases on Tithi ${tithiType}.`);
    }

    if (vhDays.includes(dayOfWeek)) {
      score += 10;
    } else {
      score -= 15;
      reasons.push('Avoid purchasing vehicles on Tuesday or Saturday.');
    }

    suitabilities.push({
      type: 'vahan_purchase',
      name: 'Vehicle Purchase',
      hindiName: 'वाहन क्रय मुहूर्त',
      isSuitable: score >= 65,
      score: Math.max(0, Math.min(100, score)),
      reasons
    });
  }

  // 4. Namkaran
  {
    const nkNakshatras = ['Ashwini', 'Rohini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Uttaraphalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttarashadha', 'Uttarabhadrapada', 'Revati'];
    const reasons: string[] = [];
    let score = 50;

    if (nkNakshatras.includes(nakshatraName)) {
      score += 25;
      reasons.push(`Nakshatra ${nakshatraName} is favorable for naming ceremonies.`);
    } else {
      score -= 15;
      reasons.push(`Nakshatra ${nakshatraName} is neutral.`);
    }

    if (auspiciousTithis.includes(tithiType)) {
      score += 15;
      reasons.push(`Tithi ${tithiType} is supportive.`);
    } else if (avoidTithis.includes(tithiType)) {
      score -= 20;
      reasons.push(`Avoid naming ceremonies on Tithi ${tithiType}.`);
    }

    suitabilities.push({
      type: 'namkaran',
      name: 'Naming Ceremony',
      hindiName: 'नामकरण मुहूर्त',
      isSuitable: score >= 65,
      score: Math.max(0, Math.min(100, score)),
      reasons
    });
  }

  return suitabilities;
}
