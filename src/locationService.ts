import { findClosestCity } from './geocoder';
import { Coords } from './types';

/**
 * Robust location detection utility supporting Browser Geolocation and optional Capacitor Geolocation.
 * Automatically handles permissions and reverse geocoding to the nearest Indian city.
 */
export async function detectDeviceLocation(): Promise<Coords> {
  // 1. If Capacitor Geolocation is injected globally on window
  const globalCapacitor = typeof window !== 'undefined' ? (window as any).Capacitor : undefined;
  if (globalCapacitor?.Plugins?.Geolocation) {
    try {
      const Geolocation = globalCapacitor.Plugins.Geolocation;
      const permStatus = await Geolocation.checkPermissions();
      if (permStatus.location === 'denied' || permStatus.coarseLocation === 'denied') {
        const requested = await Geolocation.requestPermissions();
        if (requested.location === 'denied' && requested.coarseLocation === 'denied') {
          throw new Error('PERMISSION_DENIED');
        }
      } else if (permStatus.location === 'prompt' || permStatus.location === 'prompt-with-rationale') {
        const requested = await Geolocation.requestPermissions();
        if (requested.location === 'denied' && requested.coarseLocation === 'denied') {
          throw new Error('PERMISSION_DENIED');
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const lat = parseFloat(position.coords.latitude.toFixed(4));
      const lon = parseFloat(position.coords.longitude.toFixed(4));
      const matched = findClosestCity(lat, lon);

      return {
        latitude: lat,
        longitude: lon,
        city: matched.name,
        state: matched.state
      };
    } catch (err: any) {
      if (err?.message === 'PERMISSION_DENIED' || err?.code === 1) {
        throw new Error('PERMISSION_DENIED');
      }
    }
  }

  // 2. Standard Web navigator.geolocation
  return new Promise<Coords>((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        const matched = findClosestCity(lat, lon);
        resolve({
          latitude: lat,
          longitude: lon,
          city: matched.name,
          state: matched.state
        });
      },
      (error) => {
        if (error.code === 1) {
          reject(new Error('PERMISSION_DENIED'));
        } else if (error.code === 3) {
          reject(new Error('TIMEOUT'));
        } else {
          reject(new Error('UNKNOWN_ERROR'));
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    );
  });
}
