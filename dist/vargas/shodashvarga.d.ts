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
export type VargaType = 'D1' | 'D2' | 'D3' | 'D4' | 'D7' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';
export interface VargaPosition {
    varga: VargaType;
    signIndex: number;
    signName: string;
    signHindi: string;
    degreeInVarga: number;
    partIndex: number;
    isVargottama?: boolean;
    isPushkar?: boolean;
    shashtiamshaDeity?: string;
    shashtiamshaNature?: 'Benefic' | 'Malefic';
}
export interface PlanetVargaMap {
    planetName: string;
    longitude: number;
    vargas: {
        [key in VargaType]: VargaPosition;
    };
    dignityScore: {
        shadvargaScore: number;
        saptavargaScore: number;
        dashavargaScore: number;
        shodashvargaScore: number;
        vaisheshikamsaTitle: string;
    };
}
export declare const SHASHTIAMSHA_DATA: {
    name: string;
    nature: 'Benefic' | 'Malefic';
}[];
export declare const EXALTATION_SIGNS: {
    [planet: string]: number;
};
export declare const OWN_SIGNS: {
    [planet: string]: number[];
};
export declare function calculateVarga(longitude: number, varga: VargaType): VargaPosition;
/**
 * Calculates all 16 divisional charts for a planet and computes Vaisheshikamsa dignity
 */
export declare function calculateAllVargasForPlanet(planetName: string, longitude: number): PlanetVargaMap;
export interface ShodashvargaReport {
    ascendant: PlanetVargaMap;
    planets: Record<string, PlanetVargaMap>;
    divisionalCharts: VargaType[];
    vaisheshikamsa: PlanetVargaMap[];
}
/**
 * Calculates complete Shodashvarga (all 16 divisional charts) for all planets and ascendant in a chart.
 */
export declare function calculateShodashvarga(natalChart: {
    ascendant: {
        longitude: number;
    };
    planets: {
        name: string;
        longitude: number;
    }[];
}): ShodashvargaReport;
//# sourceMappingURL=shodashvarga.d.ts.map