/**
 * Sanatan Shadbala Engine (6-Fold Planetary Strength & Planetary Avasthas)
 *
 * Implements classical Parashari mathematical formulas:
 * 1. Sthana Bala (Positional: Uccha, Saptavargaja, Ojhayugma, Kendra, Drekkanadhipati)
 * 2. Dig Bala (Directional)
 * 3. Kaala Bala (Temporal: Natonnata, Paksha, Tribhaga, Hora/Dina/Masa/Varsha, Ayana)
 * 4. Chesta Bala (Motional / Velocity / Retrogression)
 * 5. Naisargika Bala (Natural hierarchy constants)
 * 6. Drik Bala (Aspectual strength)
 *
 * Also computes:
 * - Total Virupas & Rupas conversion
 * - Parashara Strength Ratio (> 1.0 = capable of delivering full results)
 * - Ishta Phala & Kashta Phala
 * - Baladi, Jagradadi, Deeptadi Avasthas & Panchadha Maitri
 */
import { NatalChartData } from '../kundli/houseCusps';
export interface PlanetShadbalaResult {
    planetName: string;
    sthanaBala: {
        ucchaBala: number;
        saptavargajaBala: number;
        ojhayugmaBala: number;
        kendraBala: number;
        drekkanaBala: number;
        total: number;
    };
    digBala: number;
    kaalaBala: {
        natonnataBala: number;
        pakshaBala: number;
        tribhagaBala: number;
        varshaMasaDinaHoraBala: number;
        ayanaBala: number;
        total: number;
    };
    chestaBala: number;
    naisargikaBala: number;
    drikBala: number;
    totalVirupas: number;
    totalRupas: number;
    requiredRupas: number;
    strengthRatio: number;
    isStrong: boolean;
    ishtaPhala: number;
    kashtaPhala: number;
    avasthas: {
        baladi: 'Bala' | 'Kumara' | 'Yuva' | 'Vriddha' | 'Mrita';
        jagradadi: 'Jagrat' | 'Swapna' | 'Sushupti';
        deeptadi: 'Deepta' | 'Svastha' | 'Mudita' | 'Shanta' | 'Shakta' | 'Peedita' | 'Deena' | 'Vikala' | 'Khala';
    };
}
export interface ShadbalaSummary {
    planets: PlanetShadbalaResult[];
    strongestPlanet: string;
    weakestPlanet: string;
    bhavaBala: {
        houseNumber: number;
        virupas: number;
        rupas: number;
    }[];
}
export declare function calculateShadbala(natalData: NatalChartData): ShadbalaSummary;
//# sourceMappingURL=shadbalaEngine.d.ts.map