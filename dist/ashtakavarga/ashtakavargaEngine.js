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

// src/ashtakavarga/ashtakavargaEngine.ts
var ASHTAKAVARGA_CONTRIBUTORS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Ascendant"
];
var ASHTAKAVARGA_GRAHAS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn"
];
var PARASHARA_BAV_RULES = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [3, 4, 6, 10, 11, 12]
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Ascendant: [3, 6, 10, 11]
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 3, 6, 10, 11]
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 2, 4, 6, 8, 10, 11]
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Ascendant: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Ascendant: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Ascendant: [1, 3, 4, 6, 10, 11]
  }
};
var EXPECTED_BAV_TOTALS = {
  Sun: 48,
  Moon: 49,
  Mars: 39,
  Mercury: 54,
  Jupiter: 56,
  Venus: 52,
  Saturn: 39
};
var RASHI_PINDA_MULTIPLIERS = [7, 10, 8, 4, 10, 6, 7, 8, 9, 5, 11, 12];
var GRAHA_PINDA_MULTIPLIERS = {
  Sun: 5,
  Moon: 5,
  Mars: 8,
  Mercury: 5,
  Jupiter: 10,
  Venus: 7,
  Saturn: 5
};
var KAKSHYA_LORDS = [
  "Saturn",
  // 0°00' - 3°45'
  "Jupiter",
  // 3°45' - 7°30'
  "Mars",
  // 7°30' - 11°15'
  "Sun",
  // 11°15' - 15°00'
  "Venus",
  // 15°00' - 18°45'
  "Mercury",
  // 18°45' - 22°30'
  "Moon",
  // 22°30' - 26°15'
  "Ascendant"
  // 26°15' - 30°00'
];
function calculateSingleBAV(targetGraha, natalSignPlacements, lagnaSignIndex) {
  const rules = PARASHARA_BAV_RULES[targetGraha];
  const signs = [];
  const bindusBySign = new Array(12).fill(0);
  const bindusByHouse = new Array(12).fill(0);
  let grandTotal = 0;
  for (let s = 0; s < 12; s++) {
    const pointsFrom = {};
    let signTotal = 0;
    for (const contrib of ASHTAKAVARGA_CONTRIBUTORS) {
      const contribSign = natalSignPlacements[contrib];
      const houseDistance = (s - contribSign + 12) % 12 + 1;
      const isBenefic = rules[contrib].includes(houseDistance) ? 1 : 0;
      pointsFrom[contrib] = isBenefic;
      signTotal += isBenefic;
    }
    const houseFromLagna = (s - lagnaSignIndex + 12) % 12 + 1;
    bindusBySign[s] = signTotal;
    bindusByHouse[houseFromLagna - 1] = signTotal;
    grandTotal += signTotal;
    signs.push({
      signIndex: s,
      signName: zodiacSigns[s].name,
      signHindi: zodiacSigns[s].hindi,
      houseFromLagna,
      pointsFrom,
      totalBindus: signTotal
    });
  }
  return {
    graha: targetGraha,
    totalPoints: grandTotal,
    signs,
    bindusBySign,
    bindusByHouse
  };
}
function calculateSAV(bavRecords, lagnaSignIndex) {
  const signs = [];
  const bindusBySign = new Array(12).fill(0);
  const bindusByHouse = new Array(12).fill(0);
  let totalPoints = 0;
  for (let s = 0; s < 12; s++) {
    const grahaPoints = {};
    let signSum = 0;
    for (const g of ASHTAKAVARGA_GRAHAS) {
      const gPoints = bavRecords[g].bindusBySign[s];
      grahaPoints[g] = gPoints;
      signSum += gPoints;
    }
    const houseFromLagna = (s - lagnaSignIndex + 12) % 12 + 1;
    bindusBySign[s] = signSum;
    bindusByHouse[houseFromLagna - 1] = signSum;
    totalPoints += signSum;
    let evaluation;
    if (signSum >= 33) evaluation = "Very Auspicious";
    else if (signSum >= 28) evaluation = "Auspicious";
    else if (signSum >= 24) evaluation = "Average";
    else evaluation = "Challenging";
    signs.push({
      signIndex: s,
      signName: zodiacSigns[s].name,
      signHindi: zodiacSigns[s].hindi,
      houseFromLagna,
      grahaPoints,
      totalBindus: signSum,
      evaluation
    });
  }
  return {
    totalPoints,
    signs,
    bindusBySign,
    bindusByHouse,
    isInvariantValid: totalPoints === 337
  };
}
function applyTrikonaShodhana(inputBindus) {
  const result = [...inputBindus];
  const trines = [
    [0, 4, 8],
    // Fire
    [1, 5, 9],
    // Earth
    [2, 6, 10],
    // Air
    [3, 7, 11]
    // Water
  ];
  for (const trine of trines) {
    const [i1, i2, i3] = trine;
    const v1 = result[i1];
    const v2 = result[i2];
    const v3 = result[i3];
    if (v1 === v2 && v2 === v3) {
      result[i1] = 0;
      result[i2] = 0;
      result[i3] = 0;
      continue;
    }
    const zeros = (v1 === 0 ? 1 : 0) + (v2 === 0 ? 1 : 0) + (v3 === 0 ? 1 : 0);
    if (zeros === 2) {
      continue;
    }
    if (zeros === 1) {
      if (v1 === 0) {
        if (v2 === v3) {
          result[i2] = 0;
          result[i3] = 0;
        }
      } else if (v2 === 0) {
        if (v1 === v3) {
          result[i1] = 0;
          result[i3] = 0;
        }
      } else {
        if (v1 === v2) {
          result[i1] = 0;
          result[i2] = 0;
        }
      }
      continue;
    }
    const minVal = Math.min(v1, v2, v3);
    result[i1] -= minVal;
    result[i2] -= minVal;
    result[i3] -= minVal;
  }
  return result;
}
function applyEkadhipatyaShodhana(trikonaBindus, planetOccupations) {
  const result = [...trikonaBindus];
  const dualPairs = [
    [0, 7],
    // Mars: Aries, Scorpio
    [1, 6],
    // Venus: Taurus, Libra
    [2, 5],
    // Mercury: Gemini, Virgo
    [8, 11],
    // Jupiter: Sag, Pisces
    [9, 10]
    // Saturn: Cap, Aqua
  ];
  for (const pair of dualPairs) {
    const [s1, s2] = pair;
    let v1 = result[s1];
    let v2 = result[s2];
    const o1 = planetOccupations[s1] || 0;
    const o2 = planetOccupations[s2] || 0;
    if (v1 === 0 || v2 === 0) {
      continue;
    }
    if (o1 > 0 && o2 > 0) {
      continue;
    }
    if (o1 > 0 && o2 === 0) {
      if (v1 >= v2) {
        result[s2] = 0;
      } else {
        result[s2] = v1;
      }
      continue;
    }
    if (o2 > 0 && o1 === 0) {
      if (v2 >= v1) {
        result[s1] = 0;
      } else {
        result[s1] = v2;
      }
      continue;
    }
    if (o1 === 0 && o2 === 0) {
      if (v1 === v2) {
        result[s1] = 0;
        result[s2] = 0;
      } else {
        const minVal = Math.min(v1, v2);
        result[s1] = minVal;
        result[s2] = minVal;
      }
    }
  }
  return result;
}
function calculateShodhyaPinda(shodhitaBindus, planetPlacements) {
  let rashiPinda = 0;
  for (let s = 0; s < 12; s++) {
    rashiPinda += shodhitaBindus[s] * RASHI_PINDA_MULTIPLIERS[s];
  }
  let grahaPinda = 0;
  for (const g of ASHTAKAVARGA_GRAHAS) {
    const sign = planetPlacements[g];
    const binduInSign = shodhitaBindus[sign];
    grahaPinda += binduInSign * GRAHA_PINDA_MULTIPLIERS[g];
  }
  return {
    rashiPinda,
    grahaPinda,
    shodhyaPinda: rashiPinda + grahaPinda
  };
}
function evaluateKakshyaTransit(graha, transitLongitude, natalBAV) {
  const normLon = (transitLongitude % 360 + 360) % 360;
  const signIndex = Math.floor(normLon / 30);
  const degreeInSign = normLon % 30;
  const kakshyaIndex = Math.min(7, Math.floor(degreeInSign / 3.75));
  const kakshyaLord = KAKSHYA_LORDS[kakshyaIndex];
  const signDetail = natalBAV.signs[signIndex];
  const hasBeneficPoint = (signDetail.pointsFrom[kakshyaLord] || 0) === 1;
  return {
    graha,
    transitLongitude: normLon,
    signIndex,
    kakshyaIndex,
    kakshyaLord,
    degreeInSign,
    hasBeneficPoint,
    isFavorableTransit: hasBeneficPoint
  };
}
function calculateAshtakavarga(natalChart) {
  const natalSignPlacements = {};
  const planetPlacements = {};
  const planetOccupations = new Array(12).fill(0);
  const lagnaSignIndex = natalChart.ascendant.signIndex;
  natalSignPlacements["Ascendant"] = lagnaSignIndex;
  for (const p of natalChart.planets) {
    if (ASHTAKAVARGA_GRAHAS.includes(p.name)) {
      const gName = p.name;
      natalSignPlacements[gName] = p.signIndex;
      planetPlacements[gName] = p.signIndex;
      planetOccupations[p.signIndex]++;
    }
  }
  const bav = {};
  for (const g of ASHTAKAVARGA_GRAHAS) {
    bav[g] = calculateSingleBAV(g, natalSignPlacements, lagnaSignIndex);
  }
  const sav = calculateSAV(bav, lagnaSignIndex);
  const shodhana = {};
  for (const g of ASHTAKAVARGA_GRAHAS) {
    const original = bav[g].bindusBySign;
    const trikona = applyTrikonaShodhana(original);
    const ekadhipatya = applyEkadhipatyaShodhana(trikona, planetOccupations);
    const pinda = calculateShodhyaPinda(ekadhipatya, planetPlacements);
    shodhana[g] = {
      graha: g,
      originalBindus: original,
      trikonaShodhita: trikona,
      ekadhipatyaShodhita: ekadhipatya,
      rashiPinda: pinda.rashiPinda,
      grahaPinda: pinda.grahaPinda,
      shodhyaPinda: pinda.shodhyaPinda
    };
  }
  return {
    bav,
    sav,
    shodhana,
    totalSAVPoints: sav.totalPoints,
    isSAV337InvariantMet: sav.isInvariantValid
  };
}
export {
  ASHTAKAVARGA_CONTRIBUTORS,
  ASHTAKAVARGA_GRAHAS,
  EXPECTED_BAV_TOTALS,
  GRAHA_PINDA_MULTIPLIERS,
  KAKSHYA_LORDS,
  PARASHARA_BAV_RULES,
  RASHI_PINDA_MULTIPLIERS,
  applyEkadhipatyaShodhana,
  applyTrikonaShodhana,
  calculateAshtakavarga,
  calculateSAV,
  calculateShodhyaPinda,
  calculateSingleBAV,
  evaluateKakshyaTransit
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
