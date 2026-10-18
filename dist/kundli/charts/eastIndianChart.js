// node_modules/astronomy-engine/esm/astronomy.js
var KM_PER_AU = 14959787069098932e-8;
var PI2 = 2 * Math.PI;
var ARC = 3600 * (180 / Math.PI);
var ASEC180 = 180 * 60 * 60;
var ASEC360 = 2 * ASEC180;
var AU_PER_PARSEC = ASEC180 / Math.PI;
var SUN_MAG_1AU = -0.17 - 5 * Math.log10(AU_PER_PARSEC);
var SECONDS_PER_DAY = 24 * 3600;
var MILLIS_PER_DAY = SECONDS_PER_DAY * 1e3;
var SUN_RADIUS_KM = 695700;
var SUN_RADIUS_AU = SUN_RADIUS_KM / KM_PER_AU;
var EARTH_FLATTENING = 0.996647180302104;
var EARTH_FLATTENING_SQUARED = EARTH_FLATTENING * EARTH_FLATTENING;
var EARTH_EQUATORIAL_RADIUS_KM = 6378.1366;
var EARTH_EQUATORIAL_RADIUS_AU = EARTH_EQUATORIAL_RADIUS_KM / KM_PER_AU;
var EARTH_POLAR_RADIUS_KM = EARTH_EQUATORIAL_RADIUS_KM * EARTH_FLATTENING;
var EARTH_MEAN_RADIUS_KM = 6371;
var EARTH_ATMOSPHERE_KM = 88;
var EARTH_ECLIPSE_RADIUS_KM = EARTH_MEAN_RADIUS_KM + EARTH_ATMOSPHERE_KM;
var MOON_EQUATORIAL_RADIUS_KM = 1738.1;
var MOON_EQUATORIAL_RADIUS_AU = MOON_EQUATORIAL_RADIUS_KM / KM_PER_AU;
var MOON_POLAR_RADIUS_KM = 1736;
var MOON_POLAR_RADIUS_AU = MOON_POLAR_RADIUS_KM / KM_PER_AU;
var REFRACTION_NEAR_HORIZON = 34 / 60;
var EARTH_MOON_MASS_RATIO = 81.30056;
var EARTH_GM = 8887692390113509e-25;
var MOON_GM = EARTH_GM / EARTH_MOON_MASS_RATIO;
function VerifyNumber(x) {
  if (!Number.isFinite(x)) {
    console.trace();
    throw `Value is not a finite number: ${x}`;
  }
  return x;
}
var Body;
(function(Body2) {
  Body2["Sun"] = "Sun";
  Body2["Moon"] = "Moon";
  Body2["Mercury"] = "Mercury";
  Body2["Venus"] = "Venus";
  Body2["Earth"] = "Earth";
  Body2["Mars"] = "Mars";
  Body2["Jupiter"] = "Jupiter";
  Body2["Saturn"] = "Saturn";
  Body2["Uranus"] = "Uranus";
  Body2["Neptune"] = "Neptune";
  Body2["Pluto"] = "Pluto";
  Body2["SSB"] = "SSB";
  Body2["EMB"] = "EMB";
  Body2["Star1"] = "Star1";
  Body2["Star2"] = "Star2";
  Body2["Star3"] = "Star3";
  Body2["Star4"] = "Star4";
  Body2["Star5"] = "Star5";
  Body2["Star6"] = "Star6";
  Body2["Star7"] = "Star7";
  Body2["Star8"] = "Star8";
})(Body || (Body = {}));
var StarList = [
  Body.Star1,
  Body.Star2,
  Body.Star3,
  Body.Star4,
  Body.Star5,
  Body.Star6,
  Body.Star7,
  Body.Star8
];
var PrecessDirection;
(function(PrecessDirection2) {
  PrecessDirection2[PrecessDirection2["From2000"] = 0] = "From2000";
  PrecessDirection2[PrecessDirection2["Into2000"] = 1] = "Into2000";
})(PrecessDirection || (PrecessDirection = {}));
var RotationMatrix = class {
  constructor(rot) {
    this.rot = rot;
  }
};
function VerifyObserver(observer) {
  if (!(observer instanceof Observer)) {
    throw `Not an instance of the Observer class: ${observer}`;
  }
  VerifyNumber(observer.latitude);
  VerifyNumber(observer.longitude);
  VerifyNumber(observer.height);
  if (observer.latitude < -90 || observer.latitude > 90) {
    throw `Latitude ${observer.latitude} is out of range. Must be -90..+90.`;
  }
  return observer;
}
var Observer = class {
  constructor(latitude, longitude, height) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.height = height;
    VerifyObserver(this);
  }
};
var Rotation_JUP_EQJ = new RotationMatrix([
  [0.999432765338654, -0.0336771074697641, 0],
  [0.0303959428906285, 0.902057912352809, 0.430543388542295],
  [-0.0144994559663353, -0.430299169409101, 0.902569881273754]
]);
var ApsisKind;
(function(ApsisKind2) {
  ApsisKind2[ApsisKind2["Pericenter"] = 0] = "Pericenter";
  ApsisKind2[ApsisKind2["Apocenter"] = 1] = "Apocenter";
})(ApsisKind || (ApsisKind = {}));
var EclipseKind;
(function(EclipseKind2) {
  EclipseKind2["Penumbral"] = "penumbral";
  EclipseKind2["Partial"] = "partial";
  EclipseKind2["Annular"] = "annular";
  EclipseKind2["Total"] = "total";
})(EclipseKind || (EclipseKind = {}));
var NodeEventKind;
(function(NodeEventKind2) {
  NodeEventKind2[NodeEventKind2["Invalid"] = 0] = "Invalid";
  NodeEventKind2[NodeEventKind2["Ascending"] = 1] = "Ascending";
  NodeEventKind2[NodeEventKind2["Descending"] = -1] = "Descending";
})(NodeEventKind || (NodeEventKind = {}));

// src/core/sanatan_jpl_bridge.ts
var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;
var geocenter = new Observer(0, 0, 0);
var zodiacSigns = [
  { eng: "Aries", hin: "\u092E\u0947\u0937" },
  { eng: "Taurus", hin: "\u0935\u0943\u0937\u092D" },
  { eng: "Gemini", hin: "\u092E\u093F\u0925\u0941\u0928" },
  { eng: "Cancer", hin: "\u0915\u0930\u094D\u0915" },
  { eng: "Leo", hin: "\u0938\u093F\u0902\u0939" },
  { eng: "Virgo", hin: "\u0915\u0928\u094D\u092F\u093E" },
  { eng: "Libra", hin: "\u0924\u0941\u0932\u093E" },
  { eng: "Scorpio", hin: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915" },
  { eng: "Sagittarius", hin: "\u0927\u0928\u0941" },
  { eng: "Capricorn", hin: "\u092E\u0915\u0930" },
  { eng: "Aquarius", hin: "\u0915\u0941\u092E\u094D\u092D" },
  { eng: "Pisces", hin: "\u092E\u0940\u0928" }
];

// src/kundli/charts/eastIndianChart.ts
var EAST_INDIAN_GEOMETRY = {
  1: { points: "100,0 200,100 300,0", label: { x: 200, y: 35 } },
  // Aries (Top)
  2: { points: "0,0 100,0 200,100 100,200 0,100", label: { x: 80, y: 50 } },
  // Taurus (Top-Left)
  3: { points: "0,100 100,200 0,300", label: { x: 30, y: 200 } },
  // Gemini (Left)
  4: { points: "0,300 100,200 200,300 100,400 0,400", label: { x: 80, y: 350 } },
  // Cancer (Bottom-Left)
  5: { points: "100,400 200,300 300,400", label: { x: 200, y: 375 } },
  // Leo (Bottom)
  6: { points: "300,400 200,300 300,200 400,300 400,400", label: { x: 320, y: 350 } },
  // Virgo (Bottom-Right)
  7: { points: "300,200 400,100 400,300", label: { x: 370, y: 200 } },
  // Libra (Right)
  8: { points: "300,0 400,0 400,100 300,200 200,100", label: { x: 320, y: 50 } },
  // Scorpio (Top-Right)
  9: { points: "200,100 300,200 200,200", label: { x: 230, y: 160 } },
  // Sagittarius
  10: { points: "100,200 200,100 200,200", label: { x: 170, y: 160 } },
  // Capricorn
  11: { points: "100,200 200,300 200,200", label: { x: 170, y: 240 } },
  // Aquarius
  12: { points: "200,200 300,200 200,300", label: { x: 230, y: 240 } }
  // Pisces
};
function generateEastIndianChart(natalData) {
  const ascSignIdx = natalData.ascendant.signIndex;
  const ascSignNumber = ascSignIdx + 1;
  const signBoxes = [];
  for (let s = 1; s <= 12; s++) {
    const signIdx = s - 1;
    const signObj = zodiacSigns[signIdx];
    const geo = EAST_INDIAN_GEOMETRY[s] || { points: "", label: { x: 0, y: 0 } };
    const houseNumber = (signIdx - ascSignIdx + 12) % 12 + 1;
    const signPlanets = natalData.planets.filter((p) => p.signIndex === signIdx).map((p) => ({
      name: p.name,
      hindiName: p.hindiName,
      degreeInSign: p.degreeInSign,
      degreeFormatted: p.degreeFormatted,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust
    }));
    signBoxes.push({
      signNumber: s,
      signName: signObj.eng,
      signHindi: signObj.hin,
      isAscendant: s === ascSignNumber,
      houseNumber,
      planets: signPlanets,
      polygonPoints: geo.points,
      labelPosition: geo.label
    });
  }
  return {
    chartType: "EastIndian",
    viewBox: "0 0 400 400",
    ascendantSignNumber: ascSignNumber,
    signBoxes
  };
}
export {
  generateEastIndianChart
};
/*! Bundled license information:

astronomy-engine/esm/astronomy.js:
  (**
      @preserve
  
      Astronomy library for JavaScript (browser and Node.js).
      https://github.com/cosinekitty/astronomy
  
      MIT License
  
      Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>
  
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
  
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.
  
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
  *)
  (**
   * @fileoverview Astronomy calculation library for browser scripting and Node.js.
   * @author Don Cross <cosinekitty@gmail.com>
   * @license MIT
   *)
*/
