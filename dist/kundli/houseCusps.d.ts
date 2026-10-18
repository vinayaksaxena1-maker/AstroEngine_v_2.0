/**
 * Sanatan Kundli Engine: Natal Horizon & House Cusps Adapter
 *
 * Computes exact Sidereal Ascendant (Lagna), 12 Bhava Cusps (Sripati, Placidus, Equal),
 * Bhava Sandhis, and complete Natal Planetary Longitudes with Combustion & Retrogrades.
 */
export interface BhavaCuspDetail {
    houseNumber: number;
    startLongitude: number;
    midLongitude: number;
    endLongitude: number;
    signIndex: number;
    signName: string;
    signHindi: string;
    signLord: string;
}
export interface NatalPlanetDetail {
    id: number;
    name: string;
    hindiName: string;
    longitude: number;
    latitude: number;
    speed: number;
    isRetrograde: boolean;
    isCombust: boolean;
    signIndex: number;
    signName: string;
    signHindi: string;
    degreeInSign: number;
    degreeFormatted: string;
    nakshatraIndex: number;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    houseOccupied: number;
}
export interface NatalChartData {
    birthDate: Date;
    latitude: number;
    longitude: number;
    jd_ut: number;
    ayanamsa: number;
    ascendant: {
        longitude: number;
        signIndex: number;
        signName: string;
        signHindi: string;
        degreeInSign: number;
        degreeFormatted: string;
        nakshatraIndex: number;
        nakshatraName: string;
        nakshatraPada: number;
        nakshatraLord: string;
        signLord: string;
    };
    midheaven: {
        longitude: number;
        signIndex: number;
        signName: string;
    };
    houseSystem: 'Sripati' | 'Placidus' | 'EqualHouse';
    cusps: BhavaCuspDetail[];
    planets: NatalPlanetDetail[];
}
export declare const NAKSHATRA_NAMES: string[];
export declare const NAKSHATRA_LORDS: string[];
export declare const SIGN_LORDS: string[];
export declare function formatDegrees(deg: number): string;
export declare function getNakshatraInfo(longitude: number): {
    index: number;
    name: string;
    pada: number;
    lord: string;
};
/**
 * Computes complete Natal Kundli data including Ascendant, Cusps, and Grahas
 */
export declare function calculateNatalChart(birthDate: Date, latitude: number, longitude: number, options?: {
    houseSystem?: 'Sripati' | 'Placidus' | 'EqualHouse';
}): NatalChartData;
//# sourceMappingURL=houseCusps.d.ts.map