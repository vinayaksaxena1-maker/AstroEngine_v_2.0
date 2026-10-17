/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export interface TimeInterval {
    start: string;
    end: string;
}
export interface ShubhYogItem {
    name: string;
    hindiName: string;
    start: string;
    end: string;
}
export interface PlanetCombustion {
    name: string;
    hindiName: string;
    isCombust: boolean;
    angularDistance: number;
}
export interface PanchakDetail {
    active: boolean;
    name: string;
    hindiName: string;
    type: string;
    typeHindi: string;
    description: string;
}
export interface GandMoolDetail {
    isGandMool: boolean;
    nakshatraName: string;
    nakshatraHindiName: string;
    rulingPlanet: string;
    rulingPlanetHindi: string;
    description: string;
}
export interface SuryaNakshatraDetail {
    name: string;
    hindiName: string;
    pada: number;
    lord: string;
    deity: string;
}
export interface ChandraNakshatraDetail {
    name: string;
    hindiName: string;
    pada: number;
    padaEndTime?: string;
    lord: string;
    deity: string;
}
export interface RituDetail {
    solarRitu: string;
    solarRituHindi: string;
    lunarRitu: string;
    lunarRituHindi: string;
    description: string;
}
export interface PayaDetail {
    name: 'Gold' | 'Silver' | 'Copper' | 'Iron';
    hindiName: 'सोना' | 'चांदी' | 'तांबा' | 'लोहा';
    description: string;
}
export interface DagdaTithiDetail {
    isDagda: boolean;
    name: string;
    hindiName: string;
    description: string;
}
export interface AgniVaasDetail {
    residence: 'Earth' | 'Sky' | 'Netherworld';
    residenceHindi: 'पृथ्वी' | 'आकाश' | 'पाताल';
    isAuspicious: boolean;
    description: string;
}
export interface ShivaVaasDetail {
    residence: 'Kailash' | 'Gauri' | 'Vrishabha' | 'Sabha' | 'Bhojan' | 'Kreeda' | 'Shmashan';
    residenceHindi: 'कैलाश' | 'गौरी के साथ' | 'वृषभ पर' | 'सभा में' | 'भोजन में' | 'क्रीड़ा में' | 'श्मशान में';
    isAuspicious: boolean;
    description: string;
}
export interface PushkarYogDetail {
    active: boolean;
    name: 'None' | 'Dwipushkar Yoga' | 'Tripushkar Yoga';
    hindiName: 'कोई नहीं' | 'द्विपुष्कर योग' | 'त्रिपुष्कर योग';
    type: 'Dwipushkar' | 'Tripushkar' | 'None';
    description: string;
    suitability: string;
}
export interface Coords {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}
export type PakshaType = 'Shukla' | 'Krishna';
export type MuhuratType = 'Shubh' | 'Amrit' | 'Ashubh' | 'Samanya';
export interface Tithi {
    name: string;
    hindiName: string;
    value: number;
    startTime?: string;
    endTime: string;
    percentPassed?: number;
    lord: string;
    deity: string;
    isKshaya?: boolean;
    isVriddhi?: boolean;
}
export interface Nakshatra {
    name: string;
    hindiName: string;
    value: number;
    endTime: string;
    lord: string;
    deity: string;
    symbol: string;
    nature: string;
    description: string;
    suitableActivities: string[];
    avoidActivities: string[];
    pada?: number;
    padaEndTime?: string;
    gana?: string;
    yoni?: string;
    nadi?: string;
}
export interface Yoga {
    name: string;
    hindiName: string;
    value: number;
    endTime: string;
    meaning: string;
    isAuspicious?: boolean;
    type?: 'Shubh' | 'Ashubh';
    description?: string;
}
export interface Karana {
    name: string;
    hindiName: string;
    value: number;
    endTime: string;
    type: string;
    isAuspicious?: boolean;
    classification?: 'Shubh' | 'Ashubh';
    nature?: 'Movable' | 'Fixed';
    natureHindi?: 'चर' | 'स्थिर';
    description?: string;
}
export interface ChoghadiyaInterval {
    name: string;
    hindiName?: string;
    type: 'Shubh' | 'Amrit' | 'Labh' | 'Chal' | 'Kaal' | 'Rog' | 'Udveg';
    quality: 'Excellent' | 'Good' | 'Neutral' | 'Inauspicious' | 'Bad';
    startTime: string;
    endTime: string;
    isDay: boolean;
    color?: string;
}
export interface HoraInterval {
    number: number;
    lord: string;
    lordHindi: string;
    startTime: string;
    endTime: string;
    isDay: boolean;
    quality: 'Auspicious' | 'Inauspicious' | 'Neutral';
    qualityHindi: string;
    colorClass: string;
    benefits: string;
}
export interface MuhuratItem {
    id: string;
    name: string;
    hindiName: string;
    startTime: string;
    endTime: string;
    type: MuhuratType;
    description: string;
    suitability: string;
}
export interface HinduDate {
    tithi: Tithi;
    nakshatra: Nakshatra;
    yoga: Yoga;
    karana: Karana;
    karana1?: Karana;
    karana2?: Karana;
    paksha: PakshaType;
    month: string;
    monthHindi: string;
    monthAmantaHindi?: string;
    monthPurnimantaHindi?: string;
    ritu: string;
    samvatVikram: number;
    samvatShaka: number;
    samvatGujarati?: number;
    solarMonth?: string;
    isLeapMonth?: boolean;
    ayana?: string;
    praviste?: number;
}
import { PlanetPosition } from './astronomicalEngine';
export interface PanchangInfo {
    date: string;
    hinduDate: HinduDate;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    rahuKaal: {
        start: string;
        end: string;
    };
    gulikKaal: {
        start: string;
        end: string;
    };
    yamagandam: {
        start: string;
        end: string;
    };
    choghadiya: ChoghadiyaInterval[];
    hora: HoraInterval[];
    bhadra?: {
        active: boolean;
        startTime?: string;
        endTime?: string;
        vas?: string;
        vasHindi?: string;
        mukha?: string;
        puchha?: string;
    };
    anandadiYoga?: {
        name: string;
        nameHindi: string;
        isAuspicious: boolean;
        endTime: string;
        description: string;
    };
    planets?: PlanetPosition[];
    varjyam?: TimeInterval[];
    durmuhurat?: TimeInterval[];
    shubhYogas?: ShubhYogItem[];
    combustion?: PlanetCombustion[];
    panchak?: PanchakDetail;
    gandMool?: GandMoolDetail;
    suryaNakshatra?: SuryaNakshatraDetail;
    chandraNakshatra?: ChandraNakshatraDetail;
    rituDetails?: RituDetail;
    paya?: PayaDetail;
    dagdaTithi?: DagdaTithiDetail;
    agniVaas?: AgniVaasDetail;
    shivaVaas?: ShivaVaasDetail;
    pushkarYog?: PushkarYogDetail;
    ishtakala?: {
        ghati: number;
        vighati: number;
        formatted: string;
    };
}
export interface Festival {
    id: string;
    name: string;
    hindiName: string;
    date: string;
    month: string;
    tithi: string;
    description: string;
    type: 'Ekadashi' | 'Purnima' | 'Amavasya' | 'Sankashti' | 'Jayanti' | 'Major';
    isAuspicious: boolean;
}
export interface AppNotification {
    id: string;
    title: string;
    body: string;
    time: string;
    endTime?: string;
    type: 'morning' | 'festival' | 'muhurat' | 'custom';
    isRead: boolean;
    enabled?: boolean;
    ringtoneTitle?: string;
    ringtoneUri?: string;
    vibrate?: boolean;
    snoozeMinutes?: number;
}
export type SplashStyle = 'saffron' | 'golden' | 'crimson' | 'sanatan-video';
export type LogoStyle = 'om' | 'swastika' | 'trishul' | 'kalash' | 'diya';
export interface SettingsState {
    theme: 'light' | 'dark';
    language: 'English' | 'Hindi';
    fontSize?: 'small' | 'medium' | 'large';
    locationMode: 'GPS' | 'Manual';
    notifications: {
        morningPanchang: boolean;
        festivalReminder: boolean;
        ekadashiReminder: boolean;
        purnimaReminder: boolean;
        muhuratReminder: boolean;
    };
    monetizationUnlock: boolean;
    splashStyle?: SplashStyle;
    logoStyle?: LogoStyle;
    clockMode?: 'digital' | 'analog';
    customLogo?: string;
    customSplash?: string;
}
export interface ChoghadiyaPresentationData {
    choghadiyaList: ChoghadiyaInterval[];
    activeIndex: number;
    displayStartTime: string;
    displayEndTime: string;
}
declare global {
    interface Window {
        AndroidAlarm?: {
            scheduleAlarm: (id: string, label: string, triggerTimeMs: number, vibrate: boolean, snoozeMinutes: number, ringtoneUri: string) => void;
            cancelAlarm: (id: string) => void;
            selectRingtone: (alarmId: string) => void;
            getSystemWallpaperBase64?: () => string;
            updateWidgetData?: (tithi: string, nakshatra: string, choghadiya: string, choghadiyaTime: string, rahuKaal: string, brahma: string, abhijit: string, city: string) => void;
            setPermanentNotificationEnabled?: (enabled: boolean) => void;
            isPermanentNotificationEnabled?: () => boolean;
        };
        onRingtonePicked?: (alarmId: string, uri: string, title: string) => void;
    }
}
//# sourceMappingURL=types.d.ts.map