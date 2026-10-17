import citiesData from './cities.json';

interface CityEntry {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

const cities = citiesData as CityEntry[];

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Finds the closest city to a given latitude and longitude using the Haversine formula.
 * Works 100% offline using the embedded cities database.
 */
export function findClosestCity(lat: number, lon: number): { name: string; state: string } {
  let closest: CityEntry | null = null;
  let minDistance = Infinity;

  const R = 6371; // Earth's radius in km

  for (const city of cities) {
    const dLat = toRad(city.lat - lat);
    const dLon = toRad(city.lon - lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(city.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    if (d < minDistance) {
      minDistance = d;
      closest = city;
    }
  }

  if (closest) {
    return { name: closest.name, state: closest.state };
  }
  return { name: 'Unknown City', state: 'Unknown State' };
}
