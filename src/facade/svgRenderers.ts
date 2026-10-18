/**
 * Visual Presentation Engine: SVG Generators for Vedic Astrology Charts
 *
 * Generates standalone, production-ready, responsive SVGs for:
 * 1. North Indian (Diamond / Kendra-centric) Chart
 * 2. South Indian (Fixed-Zodiac / Box-centric) Chart
 * 3. East Indian (Bengali / Odia) Chart
 */

import { NorthIndianChartModel } from '../kundli/charts/northIndianChart';
import { SouthIndianChartModel } from '../kundli/charts/southIndianChart';
import { EastIndianChartModel } from '../kundli/charts/eastIndianChart';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Renders a full standalone SVG string for North Indian Diamond Chart
 */
export function renderNorthIndianSvg(model: NorthIndianChartModel): string {
  let housesMarkup = '';

  for (const h of model.houses) {
    // Polygon outline for the house
    housesMarkup += `  <polygon points="${h.polygonPoints}" fill="none" stroke="#b45309" stroke-width="1.5" />\n`;

    // House sign number label
    housesMarkup += `  <text x="${h.labelPosition.x}" y="${h.labelPosition.y}" fill="#92400e" font-size="11" font-family="system-ui, sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="central">${h.signNumber}</text>\n`;

    // House occupied planets
    if (h.planets && h.planets.length > 0) {
      const startX = h.planetArea.x + h.planetArea.width / 2;
      const totalP = h.planets.length;
      const lineHeight = Math.min(13, h.planetArea.height / Math.max(1, totalP));
      const startY = h.planetArea.y + (h.planetArea.height - (totalP - 1) * lineHeight) / 2;

      h.planets.forEach((p, idx) => {
        const y = startY + idx * lineHeight;
        const retroStr = p.isRetrograde ? '(R)' : '';
        const combustStr = p.isCombust ? '*' : '';
        const deg = Math.floor(p.degreeInSign);
        const label = `${p.name.substring(0, 2)}${retroStr}${combustStr} ${deg}°`;

        housesMarkup += `  <text x="${startX}" y="${y}" fill="#1e293b" font-size="9.5" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle" dominant-baseline="central">${escapeXml(label)}</text>\n`;
      });
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%" style="background-color: #fffdfa;">
  <!-- Chart Border -->
  <rect x="0" y="0" width="400" height="400" fill="#fffdfa" stroke="#b45309" stroke-width="2.5" />
  <!-- House Polygons & Labels -->
${housesMarkup}
</svg>`;
}

/**
 * Renders a full standalone SVG string for South Indian Box Chart
 */
export function renderSouthIndianSvg(model: SouthIndianChartModel): string {
  let boxesMarkup = '';

  for (const b of model.signBoxes) {
    const { x, y, width, height } = b.boxRect;
    // Box rectangle
    boxesMarkup += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="#b45309" stroke-width="1.5" />\n`;

    // Sign Name & Ascendant Flag
    const ascText = b.isAscendant ? ' [ASC]' : '';
    const signHeader = `${b.signName.substring(0, 3).toUpperCase()}${ascText}`;
    const headerColor = b.isAscendant ? '#dc2626' : '#92400e';

    boxesMarkup += `  <text x="${x + 6}" y="${y + 14}" fill="${headerColor}" font-size="10" font-family="system-ui, sans-serif" font-weight="bold">${escapeXml(signHeader)}</text>\n`;

    // If Ascendant, draw traditional diagonal Lagna line across corner
    if (b.isAscendant) {
      boxesMarkup += `  <line x1="${x}" y1="${y}" x2="${x + 24}" y2="${y + 24}" stroke="#dc2626" stroke-width="1.5" />\n`;
    }

    // Planets inside box
    if (b.planets && b.planets.length > 0) {
      const startX = x + width / 2;
      const totalP = b.planets.length;
      const lineHeight = Math.min(13, (height - 24) / Math.max(1, totalP));
      const startY = y + 26 + lineHeight / 2;

      b.planets.forEach((p, idx) => {
        const py = startY + idx * lineHeight;
        const retroStr = p.isRetrograde ? '(R)' : '';
        const combustStr = p.isCombust ? '*' : '';
        const deg = Math.floor(p.degreeInSign);
        const label = `${p.name.substring(0, 2)}${retroStr}${combustStr} ${deg}°`;

        boxesMarkup += `  <text x="${startX}" y="${py}" fill="#1e293b" font-size="9.5" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle" dominant-baseline="central">${escapeXml(label)}</text>\n`;
      });
    }
  }

  // Hollow Center Box
  const centerMarkup = `  <rect x="100" y="100" width="200" height="200" fill="#fef3c7" fill-opacity="0.25" stroke="#b45309" stroke-width="1.5" />
  <text x="200" y="195" fill="#b45309" font-size="14" font-family="system-ui, sans-serif" font-weight="bold" text-anchor="middle">SANATAN KUNDLI</text>
  <text x="200" y="215" fill="#78350f" font-size="11" font-family="system-ui, sans-serif" text-anchor="middle">South Indian Chart</text>\n`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%" style="background-color: #fffdfa;">
  <!-- Chart Border -->
  <rect x="0" y="0" width="400" height="400" fill="#fffdfa" stroke="#b45309" stroke-width="2.5" />
  <!-- Center Area -->
${centerMarkup}
  <!-- Outer Sign Boxes -->
${boxesMarkup}
</svg>`;
}

/**
 * Renders a full standalone SVG string for East Indian (Bengali/Odia) Chart
 */
export function renderEastIndianSvg(model: EastIndianChartModel): string {
  let boxesMarkup = '';

  for (const b of model.signBoxes) {
    // Polygon geometry for East Indian chart
    boxesMarkup += `  <polygon points="${b.polygonPoints}" fill="none" stroke="#b45309" stroke-width="1.5" />\n`;

    // Sign label
    const ascText = b.isAscendant ? ' [ASC]' : '';
    const label = `${b.signName.substring(0, 3)}${ascText}`;
    const headerColor = b.isAscendant ? '#dc2626' : '#92400e';

    boxesMarkup += `  <text x="${b.labelPosition.x}" y="${b.labelPosition.y}" fill="${headerColor}" font-size="10" font-family="system-ui, sans-serif" font-weight="bold" text-anchor="middle">${escapeXml(label)}</text>\n`;

    // Planets
    if (b.planets && b.planets.length > 0) {
      b.planets.forEach((p, idx) => {
        const py = b.labelPosition.y + 12 + idx * 11;
        const retroStr = p.isRetrograde ? '(R)' : '';
        const combustStr = p.isCombust ? '*' : '';
        const deg = Math.floor(p.degreeInSign);
        const pLabel = `${p.name.substring(0, 2)}${retroStr}${combustStr} ${deg}°`;

        boxesMarkup += `  <text x="${b.labelPosition.x}" y="${py}" fill="#1e293b" font-size="9" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">${escapeXml(pLabel)}</text>\n`;
      });
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%" style="background-color: #fffdfa;">
  <!-- Chart Border -->
  <rect x="0" y="0" width="400" height="400" fill="#fffdfa" stroke="#b45309" stroke-width="2.5" />
  <!-- Sign Areas & Planets -->
${boxesMarkup}
</svg>`;
}
