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

// src/vargas/shodashvarga.ts
var SHASHTIAMSHA_DATA = [
  { name: "Ghora", nature: "Malefic" },
  { name: "Rakshasa", nature: "Malefic" },
  { name: "Deva", nature: "Benefic" },
  { name: "Kubera", nature: "Benefic" },
  { name: "Yaksha", nature: "Benefic" },
  { name: "Kinnara", nature: "Benefic" },
  { name: "Bhrashta", nature: "Malefic" },
  { name: "Kulaghna", nature: "Malefic" },
  { name: "Garala", nature: "Malefic" },
  { name: "Vahni", nature: "Malefic" },
  { name: "Maya", nature: "Malefic" },
  { name: "Purishaka", nature: "Malefic" },
  { name: "Apampati", nature: "Benefic" },
  { name: "Marutvan", nature: "Benefic" },
  { name: "Kaala", nature: "Malefic" },
  { name: "Sarpa", nature: "Malefic" },
  { name: "Amrita", nature: "Benefic" },
  { name: "Indu", nature: "Benefic" },
  { name: "Mridu", nature: "Benefic" },
  { name: "Komala", nature: "Benefic" },
  { name: "Heramba", nature: "Benefic" },
  { name: "Brahma", nature: "Benefic" },
  { name: "Vishnu", nature: "Benefic" },
  { name: "Maheshwara", nature: "Benefic" },
  { name: "Deva", nature: "Benefic" },
  { name: "Ardra", nature: "Benefic" },
  { name: "Kalinasa", nature: "Benefic" },
  { name: "Kshiteesha", nature: "Benefic" },
  { name: "Kamalakara", nature: "Benefic" },
  { name: "Gulika", nature: "Malefic" },
  { name: "Mrityu", nature: "Malefic" },
  { name: "Kaala", nature: "Malefic" },
  { name: "Davagni", nature: "Malefic" },
  { name: "Ghora", nature: "Malefic" },
  { name: "Adhama", nature: "Malefic" },
  { name: "Kantaka", nature: "Malefic" },
  { name: "Sudha", nature: "Benefic" },
  { name: "Amrita", nature: "Benefic" },
  { name: "Purnachandra", nature: "Benefic" },
  { name: "Vishadagdha", nature: "Malefic" },
  { name: "Kulanasa", nature: "Malefic" },
  { name: "Vamshakshaya", nature: "Malefic" },
  { name: "Utpata", nature: "Malefic" },
  { name: "Kaala", nature: "Malefic" },
  { name: "Saumya", nature: "Benefic" },
  { name: "Komala", nature: "Benefic" },
  { name: "Sheetala", nature: "Benefic" },
  { name: "Karaladamshtra", nature: "Malefic" },
  { name: "Chandramukhi", nature: "Benefic" },
  { name: "Praveena", nature: "Benefic" },
  { name: "Kaalapavaka", nature: "Malefic" },
  { name: "Dandashuka", nature: "Malefic" },
  { name: "Nirmala", nature: "Benefic" },
  { name: "Shubha", nature: "Benefic" },
  { name: "Ashubha", nature: "Malefic" },
  { name: "Atishubha", nature: "Benefic" },
  { name: "Sudhasangyaka", nature: "Benefic" },
  { name: "Payodhi", nature: "Benefic" },
  { name: "Bhramana", nature: "Malefic" },
  { name: "Indurekha", nature: "Benefic" }
];
var EXALTATION_SIGNS = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6
};
var OWN_SIGNS = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10]
};
function calculateVarga(longitude, varga) {
  const norm = (longitude % 360 + 360) % 360;
  const rashiIdx = Math.floor(norm / 30);
  const degInRashi = norm % 30;
  const isOdd = rashiIdx % 2 === 0;
  let targetSign = rashiIdx;
  let part = 0;
  let degreeInVarga = 0;
  let shashtiData;
  switch (varga) {
    case "D1":
      targetSign = rashiIdx;
      part = 0;
      degreeInVarga = degInRashi;
      break;
    case "D2": {
      part = Math.floor(degInRashi / 15);
      degreeInVarga = degInRashi % 15 * 2;
      if (isOdd) {
        targetSign = part === 0 ? 4 : 3;
      } else {
        targetSign = part === 0 ? 3 : 4;
      }
      break;
    }
    case "D3": {
      part = Math.floor(degInRashi / 10);
      degreeInVarga = degInRashi % 10 * 3;
      targetSign = (rashiIdx + part * 4) % 12;
      break;
    }
    case "D4": {
      part = Math.floor(degInRashi / 7.5);
      degreeInVarga = degInRashi % 7.5 * 4;
      targetSign = (rashiIdx + part * 3) % 12;
      break;
    }
    case "D7": {
      const span = 30 / 7;
      part = Math.min(6, Math.floor(degInRashi / span));
      degreeInVarga = degInRashi % span * 7;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 6 + part) % 12;
      }
      break;
    }
    case "D9": {
      const span = 30 / 9;
      part = Math.min(8, Math.floor(degInRashi / span));
      degreeInVarga = degInRashi % span * 9;
      const triplicity = rashiIdx % 4;
      const startSign = [0, 9, 6, 3][triplicity];
      targetSign = (startSign + part) % 12;
      break;
    }
    case "D10": {
      part = Math.min(9, Math.floor(degInRashi / 3));
      degreeInVarga = degInRashi % 3 * 10;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 8 + part) % 12;
      }
      break;
    }
    case "D12": {
      part = Math.min(11, Math.floor(degInRashi / 2.5));
      degreeInVarga = degInRashi % 2.5 * 12;
      targetSign = (rashiIdx + part) % 12;
      break;
    }
    case "D16": {
      part = Math.min(15, Math.floor(degInRashi / 1.875));
      degreeInVarga = degInRashi % 1.875 * 16;
      const modality = rashiIdx % 3;
      const startSign = [0, 4, 8][modality];
      targetSign = (startSign + part) % 12;
      break;
    }
    case "D20": {
      part = Math.min(19, Math.floor(degInRashi / 1.5));
      degreeInVarga = degInRashi % 1.5 * 20;
      const modality = rashiIdx % 3;
      const startSign = [0, 8, 4][modality];
      targetSign = (startSign + part) % 12;
      break;
    }
    case "D24": {
      part = Math.min(23, Math.floor(degInRashi / 1.25));
      degreeInVarga = degInRashi % 1.25 * 24;
      if (isOdd) {
        targetSign = (4 + part) % 12;
      } else {
        targetSign = (3 + part) % 12;
      }
      break;
    }
    case "D27": {
      const span = 30 / 27;
      part = Math.min(26, Math.floor(degInRashi / span));
      degreeInVarga = degInRashi % span * 27;
      const triplicity = rashiIdx % 4;
      const startSign = [0, 3, 6, 9][triplicity];
      targetSign = (startSign + part) % 12;
      break;
    }
    case "D30": {
      if (isOdd) {
        if (degInRashi < 5) {
          targetSign = 0;
          part = 0;
        } else if (degInRashi < 10) {
          targetSign = 10;
          part = 1;
        } else if (degInRashi < 18) {
          targetSign = 8;
          part = 2;
        } else if (degInRashi < 25) {
          targetSign = 2;
          part = 3;
        } else {
          targetSign = 6;
          part = 4;
        }
      } else {
        if (degInRashi < 5) {
          targetSign = 1;
          part = 0;
        } else if (degInRashi < 12) {
          targetSign = 5;
          part = 1;
        } else if (degInRashi < 20) {
          targetSign = 11;
          part = 2;
        } else if (degInRashi < 25) {
          targetSign = 9;
          part = 3;
        } else {
          targetSign = 7;
          part = 4;
        }
      }
      degreeInVarga = degInRashi % 5 * 6;
      break;
    }
    case "D40": {
      part = Math.min(39, Math.floor(degInRashi / 0.75));
      degreeInVarga = degInRashi % 0.75 * 40;
      targetSign = (isOdd ? 0 + part : 6 + part) % 12;
      break;
    }
    case "D45": {
      const span = 30 / 45;
      part = Math.min(44, Math.floor(degInRashi / span));
      degreeInVarga = degInRashi % span * 45;
      const modality = rashiIdx % 3;
      const startSign = [0, 4, 8][modality];
      targetSign = (startSign + part) % 12;
      break;
    }
    case "D60": {
      part = Math.min(59, Math.floor(degInRashi / 0.5));
      degreeInVarga = degInRashi % 0.5 * 60;
      if (isOdd) {
        targetSign = (rashiIdx + part) % 12;
      } else {
        targetSign = (rashiIdx + 6 + part) % 12;
      }
      shashtiData = SHASHTIAMSHA_DATA[part];
      break;
    }
  }
  const signObj = zodiacSigns[targetSign];
  const isVargottama = varga === "D9" && targetSign === rashiIdx;
  let isPushkar = false;
  if (varga === "D9") {
    const triplicity = rashiIdx % 4;
    if (triplicity === 0 && (part === 6 || part === 8)) isPushkar = true;
    if (triplicity === 1 && (part === 2 || part === 4)) isPushkar = true;
    if (triplicity === 2 && (part === 5 || part === 7)) isPushkar = true;
    if (triplicity === 3 && (part === 0 || part === 2)) isPushkar = true;
  }
  return {
    varga,
    signIndex: targetSign,
    signName: signObj.eng,
    signHindi: signObj.hin,
    degreeInVarga,
    partIndex: part,
    isVargottama,
    isPushkar,
    shashtiamshaDeity: shashtiData?.name,
    shashtiamshaNature: shashtiData?.nature
  };
}
function calculateAllVargasForPlanet(planetName, longitude) {
  const vargasList = [
    "D1",
    "D2",
    "D3",
    "D4",
    "D7",
    "D9",
    "D10",
    "D12",
    "D16",
    "D20",
    "D24",
    "D27",
    "D30",
    "D40",
    "D45",
    "D60"
  ];
  const vargasMap = {};
  for (const v of vargasList) {
    vargasMap[v] = calculateVarga(longitude, v);
  }
  const isOwnOrExalted = (signIdx) => {
    const exalted = EXALTATION_SIGNS[planetName];
    if (exalted !== void 0 && signIdx === exalted) return true;
    const owns = OWN_SIGNS[planetName];
    if (owns && owns.includes(signIdx)) return true;
    return false;
  };
  const shadvargaList = ["D1", "D2", "D3", "D9", "D12", "D30"];
  const saptavargaList = [...shadvargaList, "D7"];
  const dashavargaList = [...saptavargaList, "D10", "D16", "D60"];
  let shadvargaScore = 0;
  for (const v of shadvargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) shadvargaScore++;
  let saptavargaScore = 0;
  for (const v of saptavargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) saptavargaScore++;
  let dashavargaScore = 0;
  for (const v of dashavargaList) if (isOwnOrExalted(vargasMap[v].signIndex)) dashavargaScore++;
  let shodashvargaScore = 0;
  for (const v of vargasList) if (isOwnOrExalted(vargasMap[v].signIndex)) shodashvargaScore++;
  let vaisheshikamsaTitle = "Sadharana (Ordinary)";
  if (dashavargaScore >= 10) vaisheshikamsaTitle = "Shridhamamsa (Supreme)";
  else if (dashavargaScore === 9) vaisheshikamsaTitle = "Iravatamsa";
  else if (dashavargaScore === 8) vaisheshikamsaTitle = "Vaishnavamsa";
  else if (dashavargaScore === 7) vaisheshikamsaTitle = "Devalokamsa";
  else if (dashavargaScore === 6) vaisheshikamsaTitle = "Paravatamsa";
  else if (dashavargaScore === 5) vaisheshikamsaTitle = "Simhasanamsa";
  else if (dashavargaScore === 4) vaisheshikamsaTitle = "Gopuramsa";
  else if (dashavargaScore === 3) vaisheshikamsaTitle = "Uttamamsa";
  else if (dashavargaScore === 2) vaisheshikamsaTitle = "Parijatamsa";
  return {
    planetName,
    longitude,
    vargas: vargasMap,
    dignityScore: {
      shadvargaScore,
      saptavargaScore,
      dashavargaScore,
      shodashvargaScore,
      vaisheshikamsaTitle
    }
  };
}

// src/shadbala/shadbalaEngine.ts
var DEEP_EXALTATION = {
  Sun: 10,
  // Aries 10°
  Moon: 33,
  // Taurus 3°
  Mars: 298,
  // Capricorn 28°
  Mercury: 165,
  // Virgo 15°
  Jupiter: 95,
  // Cancer 5°
  Venus: 357,
  // Pisces 27°
  Saturn: 200
  // Libra 20°
};
var REQUIRED_RUPAS = {
  Sun: 6.5,
  Moon: 6,
  Mars: 5,
  Mercury: 7,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5
};
var NAISARGIKA_BALA = {
  Sun: 60,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57
};
var DIG_ZERO_POINTS = {
  Sun: 3,
  // IC (4th house) is zero, 10th is max
  Mars: 3,
  Jupiter: 6,
  // 7th house is zero, 1st is max
  Mercury: 6,
  Moon: 9,
  // 10th house is zero, 4th is max
  Venus: 9,
  Saturn: 0
  // 1st house is zero, 7th is max
};
function calculateShadbala(natalData) {
  const sevenPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const results = [];
  const sun = natalData.planets.find((p) => p.name === "Sun");
  const moon = natalData.planets.find((p) => p.name === "Moon");
  const ascLon = natalData.ascendant.longitude;
  const isDayBirth = sun.houseOccupied >= 7 && sun.houseOccupied <= 12;
  let moonSunDiff = (moon.longitude - sun.longitude + 360) % 360;
  if (moonSunDiff > 180) moonSunDiff = 360 - moonSunDiff;
  const shuklaFactor = moonSunDiff / 180;
  for (const pName of sevenPlanets) {
    const p = natalData.planets.find((item) => item.name === pName);
    const vargas = calculateAllVargasForPlanet(pName, p.longitude);
    const deepExalt = DEEP_EXALTATION[pName];
    const deepDebil = (deepExalt + 180) % 360;
    let distFromDebil = Math.abs(p.longitude - deepDebil);
    if (distFromDebil > 180) distFromDebil = 360 - distFromDebil;
    const ucchaBala = Math.min(60, distFromDebil / 3);
    const saptavargaKeys = ["D1", "D2", "D3", "D7", "D9", "D12", "D30"];
    let saptavargajaBala = 0;
    for (const vk of saptavargaKeys) {
      const sIdx = vargas.vargas[vk].signIndex;
      if (sIdx === EXALTATION_SIGNS[pName]) saptavargajaBala += 45;
      else if (sIdx === p.signIndex) saptavargajaBala += 30;
      else saptavargajaBala += 15;
    }
    saptavargajaBala = saptavargajaBala / 7;
    const isOddSign = p.signIndex % 2 === 0;
    let ojhayugmaBala = 0;
    if (["Sun", "Mars", "Jupiter"].includes(pName) && isOddSign) ojhayugmaBala = 15;
    if (["Moon", "Venus"].includes(pName) && !isOddSign) ojhayugmaBala = 15;
    if (["Mercury", "Saturn"].includes(pName) && isOddSign) ojhayugmaBala = 15;
    let kendraBala = 15;
    if ([1, 4, 7, 10].includes(p.houseOccupied)) kendraBala = 60;
    else if ([2, 5, 8, 11].includes(p.houseOccupied)) kendraBala = 30;
    const drekkanaPart = Math.floor(p.degreeInSign / 10);
    let drekkanaBala = 0;
    if (["Sun", "Mars", "Jupiter"].includes(pName) && drekkanaPart === 0) drekkanaBala = 15;
    if (["Mercury", "Saturn"].includes(pName) && drekkanaPart === 1) drekkanaBala = 15;
    if (["Moon", "Venus"].includes(pName) && drekkanaPart === 2) drekkanaBala = 15;
    const sthanaTotal = ucchaBala + saptavargajaBala + ojhayugmaBala + kendraBala + drekkanaBala;
    const zeroHouse = DIG_ZERO_POINTS[pName];
    const zeroDeg = (natalData.ascendant.longitude + zeroHouse * 30) % 360;
    let distZero = Math.abs(p.longitude - zeroDeg);
    if (distZero > 180) distZero = 360 - distZero;
    const digBala = Math.min(60, distZero / 3);
    let natonnataBala = 30;
    if (pName === "Mercury") natonnataBala = 60;
    else if (isDayBirth && ["Sun", "Jupiter", "Venus"].includes(pName)) natonnataBala = 60;
    else if (!isDayBirth && ["Moon", "Mars", "Saturn"].includes(pName)) natonnataBala = 60;
    let pakshaBala = 30;
    if (["Jupiter", "Venus"].includes(pName)) pakshaBala = shuklaFactor * 60;
    else if (["Sun", "Mars", "Saturn"].includes(pName)) pakshaBala = (1 - shuklaFactor) * 60;
    else if (pName === "Moon") pakshaBala = shuklaFactor * 60 * 2;
    else pakshaBala = 30;
    const tribhagaBala = 20;
    const varshaMasaBala = 30;
    const ayanaBala = 30;
    const kaalaTotal = natonnataBala + pakshaBala + tribhagaBala + varshaMasaBala + ayanaBala;
    let chestaBala = 30;
    if (p.isRetrograde) chestaBala = 60;
    else if (pName === "Sun" || pName === "Moon") chestaBala = pakshaBala;
    else {
      const speedNorm = Math.abs(p.speed);
      chestaBala = Math.min(60, Math.max(15, speedNorm * 30));
    }
    const naisargikaBala = NAISARGIKA_BALA[pName];
    let drikBala = 15;
    const totalVirupas = sthanaTotal + digBala + kaalaTotal + chestaBala + naisargikaBala + drikBala;
    const totalRupas = totalVirupas / 60;
    const reqRupas = REQUIRED_RUPAS[pName];
    const ratio = totalRupas / reqRupas;
    const ishtaPhala = Math.sqrt(Math.max(0, ucchaBala * chestaBala));
    const kashtaPhala = Math.sqrt(Math.max(0, (60 - ucchaBala) * (60 - chestaBala)));
    const degInSign = p.degreeInSign;
    let baladi = "Yuva";
    const fiveParts = Math.min(4, Math.floor(degInSign / 6));
    const baladiOdd = ["Bala", "Kumara", "Yuva", "Vriddha", "Mrita"];
    const baladiEven = ["Mrita", "Vriddha", "Yuva", "Kumara", "Bala"];
    baladi = isOddSign ? baladiOdd[fiveParts] : baladiEven[fiveParts];
    let jagradadi = "Swapna";
    if (p.signIndex === EXALTATION_SIGNS[pName]) jagradadi = "Jagrat";
    else if (p.signIndex === (EXALTATION_SIGNS[pName] + 6) % 12) jagradadi = "Sushupti";
    let deeptadi = "Shanta";
    if (p.signIndex === EXALTATION_SIGNS[pName]) deeptadi = "Deepta";
    else if (p.isRetrograde) deeptadi = "Shakta";
    else if (p.isCombust) deeptadi = "Vikala";
    else if (p.signIndex === (EXALTATION_SIGNS[pName] + 6) % 12) deeptadi = "Khala";
    results.push({
      planetName: pName,
      sthanaBala: {
        ucchaBala: Math.round(ucchaBala * 100) / 100,
        saptavargajaBala: Math.round(saptavargajaBala * 100) / 100,
        ojhayugmaBala,
        kendraBala,
        drekkanaBala,
        total: Math.round(sthanaTotal * 100) / 100
      },
      digBala: Math.round(digBala * 100) / 100,
      kaalaBala: {
        natonnataBala,
        pakshaBala: Math.round(pakshaBala * 100) / 100,
        tribhagaBala,
        varshaMasaDinaHoraBala: varshaMasaBala,
        ayanaBala,
        total: Math.round(kaalaTotal * 100) / 100
      },
      chestaBala: Math.round(chestaBala * 100) / 100,
      naisargikaBala,
      drikBala,
      totalVirupas: Math.round(totalVirupas * 100) / 100,
      totalRupas: Math.round(totalRupas * 100) / 100,
      requiredRupas: reqRupas,
      strengthRatio: Math.round(ratio * 100) / 100,
      isStrong: ratio >= 1,
      ishtaPhala: Math.round(ishtaPhala * 100) / 100,
      kashtaPhala: Math.round(kashtaPhala * 100) / 100,
      avasthas: {
        baladi,
        jagradadi,
        deeptadi
      }
    });
  }
  const sorted = [...results].sort((a, b) => b.strengthRatio - a.strengthRatio);
  const strongestPlanet = sorted[0].planetName;
  const weakestPlanet = sorted[sorted.length - 1].planetName;
  const bhavaBala = natalData.cusps.map((c) => {
    const lord = c.signLord;
    const lordShadbala = results.find((r) => r.planetName === lord);
    const virupas = lordShadbala ? lordShadbala.totalVirupas * 0.75 + c.houseNumber * 10 : 350;
    return {
      houseNumber: c.houseNumber,
      virupas: Math.round(virupas * 100) / 100,
      rupas: Math.round(virupas / 60 * 100) / 100
    };
  });
  return {
    planets: results,
    strongestPlanet,
    weakestPlanet,
    bhavaBala
  };
}
export {
  calculateShadbala
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
