/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */
import { PanchangInfo, MuhuratItem, ChoghadiyaPresentationData, PayaDetail, DagdaTithiDetail, AgniVaasDetail, ShivaVaasDetail, PushkarYogDetail } from './types';
export declare function clearPanchangCache(): void;
/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */
export declare const INDIAN_CITIES: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}[];
export declare const TITHI_DETAILS: {
    name: string;
    hindiName: string;
    lord: string;
    deity: string;
}[];
export declare const NAKSHATRA_DETAILS: {
    name: string;
    hindiName: string;
    lord: string;
    deity: string;
    symbol: string;
    nature: string;
    description: string;
    suitableActivities: string[];
    avoidActivities: string[];
}[];
export declare const YOGA_DETAILS: string[];
export declare const KARANA_DETAILS: string[];
export declare const MONTHS_ENGLISH_HINDI: {
    eng: string;
    hin: string;
    ritu: string;
}[];
export declare function calculateSolarTimes(lat: number, lon: number, date: Date): import("./astronomicalEngine").SolarTimes;
export declare function calculatePaya(naksIdx: number): PayaDetail;
export declare function calculateDagdaTithi(dayOfWeek: number, tithiIdx: number): DagdaTithiDetail;
export declare function calculateShivaVaas(tithiIdx: number): ShivaVaasDetail;
export declare function calculateAgniVaas(dayOfWeek: number, tithiIdx: number): AgniVaasDetail;
export declare function calculatePushkarYog(dayOfWeek: number, tithiIdx: number, naksIdx: number): PushkarYogDetail;
export declare function getPanchangForDate(lat: number, lon: number, date: Date): PanchangInfo;
export declare function getMuhuratsForPanchang(panchang: PanchangInfo): MuhuratItem[];
export declare const FESTVALS_PRESETS: {
    id: string;
    name: string;
    hindiName: string;
    date: string;
    month: string;
    tithi: string;
    description: string;
    type: string;
    isAuspicious: boolean;
}[];
export declare function getChoghadiyaPresentationData(panchang: PanchangInfo, currentTime: Date): ChoghadiyaPresentationData;
export declare function calculateIshtakala(date: Date, sunriseRaw: number): {
    ghati: number;
    vighati: number;
    formatted: string;
};
//# sourceMappingURL=panchangCalc.d.ts.map