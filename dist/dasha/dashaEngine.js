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

// src/dasha/dashaEngine.ts
var VIMSHOTTARI_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury"
];
var VIMSHOTTARI_YEARS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};
var TOTAL_VIMSHOTTARI_YEARS = 120;
var MS_PER_YEAR = 365.2425 * 86400 * 1e3;
var NAKSHATRA_TO_VIMSHOTTARI_LORD = [
  "Ketu",
  // 0: Ashwini
  "Venus",
  // 1: Bharani
  "Sun",
  // 2: Krittika
  "Moon",
  // 3: Rohini
  "Mars",
  // 4: Mrigashira
  "Rahu",
  // 5: Ardra
  "Jupiter",
  // 6: Punarvasu
  "Saturn",
  // 7: Pushya
  "Mercury",
  // 8: Ashlesha
  "Ketu",
  // 9: Magha
  "Venus",
  // 10: Purva Phalguni
  "Sun",
  // 11: Uttara Phalguni
  "Moon",
  // 12: Hasta
  "Mars",
  // 13: Chitra
  "Rahu",
  // 14: Swati
  "Jupiter",
  // 15: Vishakha
  "Saturn",
  // 16: Anuradha
  "Mercury",
  // 17: Jyeshtha
  "Ketu",
  // 18: Moola
  "Venus",
  // 19: Purva Ashadha
  "Sun",
  // 20: Uttara Ashadha
  "Moon",
  // 21: Shravana
  "Mars",
  // 22: Dhanishta
  "Rahu",
  // 23: Shatabhisha
  "Jupiter",
  // 24: Purva Bhadrapada
  "Saturn",
  // 25: Uttara Bhadrapada
  "Mercury"
  // 26: Revati
];
var YOGINI_NAMES = [
  "Mangla",
  "Pingla",
  "Dhanya",
  "Bhramari",
  "Bhadrika",
  "Ulka",
  "Siddha",
  "Sankata"
];
var YOGINI_DETAILS = {
  Mangla: { lord: "Moon", years: 1 },
  Pingla: { lord: "Sun", years: 2 },
  Dhanya: { lord: "Jupiter", years: 3 },
  Bhramari: { lord: "Mars", years: 4 },
  Bhadrika: { lord: "Mercury", years: 5 },
  Ulka: { lord: "Saturn", years: 6 },
  Siddha: { lord: "Venus", years: 7 },
  Sankata: { lord: "Rahu", years: 8 }
};
var TOTAL_YOGINI_YEARS = 36;
var ASHTOTTARI_LORDS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Saturn",
  "Jupiter",
  "Rahu",
  "Venus"
];
var ASHTOTTARI_YEARS = {
  Sun: 6,
  Moon: 15,
  Mars: 8,
  Mercury: 17,
  Saturn: 10,
  Jupiter: 19,
  Rahu: 12,
  Venus: 21
};
var TOTAL_ASHTOTTARI_YEARS = 108;
function addYearsToDate(baseDate, fractionalYears) {
  const ms = Math.round(fractionalYears * MS_PER_YEAR);
  return new Date(baseDate.getTime() + ms);
}
var EXALTATION_SIGNS = {
  Sun: 0,
  // Aries
  Moon: 1,
  // Taurus
  Mars: 9,
  // Capricorn
  Mercury: 5,
  // Virgo
  Jupiter: 3,
  // Cancer
  Venus: 11,
  // Pisces
  Saturn: 6
  // Libra
};
var DEBILITATION_SIGNS = {
  Sun: 6,
  // Libra
  Moon: 7,
  // Scorpio
  Mars: 3,
  // Cancer
  Mercury: 11,
  // Pisces
  Jupiter: 9,
  // Capricorn
  Venus: 5,
  // Virgo
  Saturn: 0
  // Aries
};
var SIGN_LORDS = [
  "Mars",
  // 0: Aries
  "Venus",
  // 1: Taurus
  "Mercury",
  // 2: Gemini
  "Moon",
  // 3: Cancer
  "Sun",
  // 4: Leo
  "Mercury",
  // 5: Virgo
  "Venus",
  // 6: Libra
  "Mars",
  // 7: Scorpio
  "Jupiter",
  // 8: Sagittarius
  "Saturn",
  // 9: Capricorn
  "Saturn",
  // 10: Aquarius
  "Jupiter"
  // 11: Pisces
];
var JAIMINI_DIRECT_SIGNS = [0, 1, 2, 6, 7, 8];
function calculateVimshottariBalance(moonLongitude) {
  const nakshatraSpan = 360 / 27;
  const normLon = (moonLongitude % 360 + 360) % 360;
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan);
  const degreeInNakshatra = normLon - nakshatraIndex * nakshatraSpan;
  const fractionElapsed = degreeInNakshatra / nakshatraSpan;
  const fractionRemaining = 1 - fractionElapsed;
  const birthLord = NAKSHATRA_TO_VIMSHOTTARI_LORD[nakshatraIndex];
  const totalYears = VIMSHOTTARI_YEARS[birthLord];
  const balanceDecimalYears = fractionRemaining * totalYears;
  const balanceYears = Math.floor(balanceDecimalYears);
  const balanceMonths = Math.floor((balanceDecimalYears - balanceYears) * 12);
  const balanceDays = Math.floor(
    ((balanceDecimalYears - balanceYears) * 12 - balanceMonths) * 30.4375
  );
  return {
    birthLord,
    balanceYears,
    balanceMonths,
    balanceDays,
    fractionRemaining
  };
}
function generateVimshottariTimeline(birthDate, moonLongitude, generateSookshma = false) {
  const balance = calculateVimshottariBalance(moonLongitude);
  const birthLordIndex = VIMSHOTTARI_LORDS.indexOf(balance.birthLord);
  const timeline = [];
  let currentMDStartDate = new Date(birthDate.getTime());
  for (let m = 0; m < 9; m++) {
    const lordIndex = (birthLordIndex + m) % 9;
    const mdLord = VIMSHOTTARI_LORDS[lordIndex];
    const fullMDYears = VIMSHOTTARI_YEARS[mdLord];
    const mdDurationYears = m === 0 ? fullMDYears * balance.fractionRemaining : fullMDYears;
    const currentMDEndDate = addYearsToDate(currentMDStartDate, mdDurationYears);
    const antardashas = [];
    let currentADStartDate = new Date(currentMDStartDate.getTime());
    const mdBaseLordIndex = lordIndex;
    let adStartIndex = 0;
    let elapsedInFirstMDYears = m === 0 ? fullMDYears * (1 - balance.fractionRemaining) : 0;
    let accumulatedADYears = 0;
    for (let a = 0; a < 9; a++) {
      const adLordIndex = (mdBaseLordIndex + a) % 9;
      const adLord = VIMSHOTTARI_LORDS[adLordIndex];
      const adFullYears = fullMDYears * VIMSHOTTARI_YEARS[adLord] / TOTAL_VIMSHOTTARI_YEARS;
      if (m === 0) {
        if (accumulatedADYears + adFullYears <= elapsedInFirstMDYears) {
          accumulatedADYears += adFullYears;
          continue;
        }
      }
      let adDurationYears = adFullYears;
      if (m === 0 && antardashas.length === 0 && accumulatedADYears < elapsedInFirstMDYears) {
        const alreadyElapsedInAD = elapsedInFirstMDYears - accumulatedADYears;
        adDurationYears = adFullYears - alreadyElapsedInAD;
      }
      let currentADEndDate = addYearsToDate(currentADStartDate, adDurationYears);
      if (a === 8 || m === 0 && currentADEndDate.getTime() > currentMDEndDate.getTime()) {
        currentADEndDate = new Date(currentMDEndDate.getTime());
      }
      const pratyantardashas = [];
      let currentPDStartDate = new Date(currentADStartDate.getTime());
      for (let p = 0; p < 9; p++) {
        const pdLordIndex = (adLordIndex + p) % 9;
        const pdLord = VIMSHOTTARI_LORDS[pdLordIndex];
        const pdDurationYears = adDurationYears * VIMSHOTTARI_YEARS[pdLord] / TOTAL_VIMSHOTTARI_YEARS;
        let currentPDEndDate = addYearsToDate(currentPDStartDate, pdDurationYears);
        if (p === 8) {
          currentPDEndDate = new Date(currentADEndDate.getTime());
        }
        const pdEntry = {
          pratyantardashaLord: pdLord,
          antardashaLord: adLord,
          mahadashaLord: mdLord,
          startDate: new Date(currentPDStartDate.getTime()),
          endDate: new Date(currentPDEndDate.getTime()),
          durationDays: (currentPDEndDate.getTime() - currentPDStartDate.getTime()) / (86400 * 1e3)
        };
        if (generateSookshma) {
          const sookshmas = [];
          let currentSDStartDate = new Date(currentPDStartDate.getTime());
          for (let s = 0; s < 9; s++) {
            const sdLordIndex = (pdLordIndex + s) % 9;
            const sdLord = VIMSHOTTARI_LORDS[sdLordIndex];
            const sdDurationYears = pdDurationYears * VIMSHOTTARI_YEARS[sdLord] / TOTAL_VIMSHOTTARI_YEARS;
            let currentSDEndDate = addYearsToDate(currentSDStartDate, sdDurationYears);
            if (s === 8) {
              currentSDEndDate = new Date(currentPDEndDate.getTime());
            }
            sookshmas.push({
              sookshmaLord: sdLord,
              pratyantardashaLord: pdLord,
              antardashaLord: adLord,
              mahadashaLord: mdLord,
              startDate: new Date(currentSDStartDate.getTime()),
              endDate: new Date(currentSDEndDate.getTime()),
              durationDays: (currentSDEndDate.getTime() - currentSDStartDate.getTime()) / (86400 * 1e3)
            });
            currentSDStartDate = new Date(currentSDEndDate.getTime());
          }
          pdEntry.sookshmas = sookshmas;
        }
        pratyantardashas.push(pdEntry);
        currentPDStartDate = new Date(currentPDEndDate.getTime());
      }
      antardashas.push({
        antardashaLord: adLord,
        mahadashaLord: mdLord,
        startDate: new Date(currentADStartDate.getTime()),
        endDate: new Date(currentADEndDate.getTime()),
        durationDays: (currentADEndDate.getTime() - currentADStartDate.getTime()) / (86400 * 1e3),
        pratyantardashas
      });
      currentADStartDate = new Date(currentADEndDate.getTime());
      if (currentADStartDate.getTime() >= currentMDEndDate.getTime()) {
        break;
      }
    }
    timeline.push({
      mahadashaLord: mdLord,
      startDate: new Date(currentMDStartDate.getTime()),
      endDate: new Date(currentMDEndDate.getTime()),
      durationDays: (currentMDEndDate.getTime() - currentMDStartDate.getTime()) / (86400 * 1e3),
      antardashas
    });
    currentMDStartDate = new Date(currentMDEndDate.getTime());
  }
  return { balance, timeline };
}
function findCurrentVimshottari(timeline, targetDate) {
  const t = targetDate.getTime();
  for (const md of timeline) {
    if (t >= md.startDate.getTime() && t < md.endDate.getTime()) {
      for (const ad of md.antardashas) {
        if (t >= ad.startDate.getTime() && t < ad.endDate.getTime()) {
          for (const pd of ad.pratyantardashas) {
            if (t >= pd.startDate.getTime() && t < pd.endDate.getTime()) {
              let sookshmaLord = pd.pratyantardashaLord;
              if (pd.sookshmas && pd.sookshmas.length > 0) {
                for (const sd of pd.sookshmas) {
                  if (t >= sd.startDate.getTime() && t < sd.endDate.getTime()) {
                    sookshmaLord = sd.sookshmaLord;
                    break;
                  }
                }
              }
              return {
                mahadasha: md.mahadashaLord,
                antardasha: ad.antardashaLord,
                pratyantardasha: pd.pratyantardashaLord,
                sookshma: sookshmaLord,
                startDate: pd.startDate,
                endDate: pd.endDate
              };
            }
          }
        }
      }
    }
  }
  return null;
}
function calculateYoginiDasha(birthDate, moonLongitude) {
  const nakshatraSpan = 360 / 27;
  const normLon = (moonLongitude % 360 + 360) % 360;
  const nakshatraIndex = Math.floor(normLon / nakshatraSpan);
  const nakshatraNum = nakshatraIndex + 1;
  const degreeInNakshatra = normLon - nakshatraIndex * nakshatraSpan;
  const fractionRemaining = 1 - degreeInNakshatra / nakshatraSpan;
  let remainder = (nakshatraNum + 3) % 8;
  if (remainder === 0) remainder = 8;
  const startingYoginiIndex = remainder - 1;
  const startingYoginiName = YOGINI_NAMES[startingYoginiIndex];
  const fullFirstYoginiYears = YOGINI_DETAILS[startingYoginiName].years;
  const birthBalanceYears = fractionRemaining * fullFirstYoginiYears;
  const timeline = [];
  let currentStartDate = new Date(birthDate.getTime());
  for (let i = 0; i < 8; i++) {
    const yIdx = (startingYoginiIndex + i) % 8;
    const yName = YOGINI_NAMES[yIdx];
    const fullYears = YOGINI_DETAILS[yName].years;
    const actualYears = i === 0 ? birthBalanceYears : fullYears;
    const currentEndDate = addYearsToDate(currentStartDate, actualYears);
    const antardashas = [];
    let adStart = new Date(currentStartDate.getTime());
    for (let a = 0; a < 8; a++) {
      const adYIdx = (yIdx + a) % 8;
      const adName = YOGINI_NAMES[adYIdx];
      const adLord = YOGINI_DETAILS[adName].lord;
      const adYears = actualYears * YOGINI_DETAILS[adName].years / TOTAL_YOGINI_YEARS;
      let adEnd = addYearsToDate(adStart, adYears);
      if (a === 7) adEnd = new Date(currentEndDate.getTime());
      antardashas.push({
        yoginiName: adName,
        lord: adLord,
        startDate: new Date(adStart.getTime()),
        endDate: new Date(adEnd.getTime()),
        durationDays: (adEnd.getTime() - adStart.getTime()) / (86400 * 1e3)
      });
      adStart = new Date(adEnd.getTime());
    }
    timeline.push({
      yoginiName: yName,
      lord: YOGINI_DETAILS[yName].lord,
      startDate: new Date(currentStartDate.getTime()),
      endDate: new Date(currentEndDate.getTime()),
      durationDays: (currentEndDate.getTime() - currentStartDate.getTime()) / (86400 * 1e3),
      antardashas
    });
    currentStartDate = new Date(currentEndDate.getTime());
  }
  return {
    birthYogini: startingYoginiName,
    birthBalanceYears,
    timeline
  };
}
function calculateAshtottariDasha(natalChart) {
  const lagnaLordName = natalChart.ascendant.signLord;
  const lagnaLord = natalChart.planets.find((p) => p.name === lagnaLordName);
  const rahu = natalChart.planets.find((p) => p.name === "Rahu");
  let isApplicable = false;
  let applicabilityReason = "Rahu is not in Kendra or Trikona from Lagna Lord.";
  if (lagnaLord && rahu) {
    const houseFromLord = (rahu.houseOccupied - lagnaLord.houseOccupied + 12) % 12 + 1;
    if ([1, 4, 7, 10, 5, 9].includes(houseFromLord)) {
      isApplicable = true;
      applicabilityReason = `Rahu is in house ${houseFromLord} (Kendra/Trikona) from Lagna Lord (${lagnaLordName}).`;
    }
  }
  const moon = natalChart.planets.find((p) => p.name === "Moon");
  const nakshatraSpan = 360 / 27;
  const normLon = (moon.longitude % 360 + 360) % 360;
  const nakIndex = Math.floor(normLon / nakshatraSpan);
  const fracRemaining = 1 - (normLon - nakIndex * nakshatraSpan) / nakshatraSpan;
  const nakToAshtottariLord = [
    "Rahu",
    // 0: Ashwini
    "Rahu",
    // 1: Bharani
    "Rahu",
    // 2: Krittika
    "Venus",
    // 3: Rohini
    "Venus",
    // 4: Mrigashira
    "Sun",
    // 5: Ardra
    "Sun",
    // 6: Punarvasu
    "Sun",
    // 7: Pushya
    "Sun",
    // 8: Ashlesha
    "Moon",
    // 9: Magha
    "Moon",
    // 10: Purva Phalguni
    "Moon",
    // 11: Uttara Phalguni
    "Mars",
    // 12: Hasta
    "Mars",
    // 13: Chitra
    "Mars",
    // 14: Swati
    "Mars",
    // 15: Vishakha
    "Mercury",
    // 16: Anuradha
    "Mercury",
    // 17: Jyeshtha
    "Mercury",
    // 18: Moola
    "Saturn",
    // 19: Purva Ashadha
    "Saturn",
    // 20: Uttara Ashadha
    "Saturn",
    // 21: Shravana
    "Saturn",
    // 22: Dhanishta
    "Jupiter",
    // 23: Shatabhisha
    "Jupiter",
    // 24: Purva Bhadrapada
    "Jupiter",
    // 25: Uttara Bhadrapada
    "Rahu"
    // 26: Revati
  ];
  const birthLord = nakToAshtottariLord[nakIndex];
  const birthLordIndex = ASHTOTTARI_LORDS.indexOf(birthLord);
  const birthBalanceYears = fracRemaining * ASHTOTTARI_YEARS[birthLord];
  const timeline = [];
  let currentStart = new Date(natalChart.birthDate.getTime());
  for (let i = 0; i < 8; i++) {
    const lIdx = (birthLordIndex + i) % 8;
    const lord = ASHTOTTARI_LORDS[lIdx];
    const fullYears = ASHTOTTARI_YEARS[lord];
    const actualYears = i === 0 ? birthBalanceYears : fullYears;
    const currentEnd = addYearsToDate(currentStart, actualYears);
    const antardashas = [];
    let adStart = new Date(currentStart.getTime());
    for (let a = 0; a < 8; a++) {
      const adLord = ASHTOTTARI_LORDS[(lIdx + a) % 8];
      const adYears = actualYears * ASHTOTTARI_YEARS[adLord] / TOTAL_ASHTOTTARI_YEARS;
      let adEnd = addYearsToDate(adStart, adYears);
      if (a === 7) adEnd = new Date(currentEnd.getTime());
      antardashas.push({
        lord: adLord,
        startDate: new Date(adStart.getTime()),
        endDate: new Date(adEnd.getTime())
      });
      adStart = new Date(adEnd.getTime());
    }
    timeline.push({
      lord,
      startDate: new Date(currentStart.getTime()),
      endDate: new Date(currentEnd.getTime()),
      durationDays: (currentEnd.getTime() - currentStart.getTime()) / (86400 * 1e3),
      antardashas
    });
    currentStart = new Date(currentEnd.getTime());
  }
  return {
    isApplicable,
    applicabilityReason,
    birthLord,
    birthBalanceYears,
    timeline
  };
}
function calculateCharaDasha(natalChart) {
  const lagnaSign = natalChart.ascendant.signIndex;
  const isDirectProgression = JAIMINI_DIRECT_SIGNS.includes(lagnaSign);
  const orderOfSigns = [];
  for (let i = 0; i < 12; i++) {
    const s = isDirectProgression ? (lagnaSign + i) % 12 : ((lagnaSign - i) % 12 + 12) % 12;
    orderOfSigns.push(s);
  }
  const timeline = [];
  let currentStart = new Date(natalChart.birthDate.getTime());
  for (const s of orderOfSigns) {
    const signLord = SIGN_LORDS[s];
    const lordPlanet = natalChart.planets.find((p) => p.name === signLord);
    const lordSign = lordPlanet ? lordPlanet.signIndex : s;
    let duration;
    if (lordSign === s) {
      duration = 12;
    } else {
      const isSignDirect = JAIMINI_DIRECT_SIGNS.includes(s);
      const dist = isSignDirect ? (lordSign - s + 12) % 12 + 1 : (s - lordSign + 12) % 12 + 1;
      duration = dist - 1;
      if (duration === 0) duration = 12;
    }
    if (lordPlanet) {
      if (lordSign === EXALTATION_SIGNS[signLord]) {
        duration = Math.min(12, duration + 1);
      } else if (lordSign === DEBILITATION_SIGNS[signLord]) {
        duration = Math.max(1, duration - 1);
      }
    }
    const currentEnd = addYearsToDate(currentStart, duration);
    timeline.push({
      signIndex: s,
      signName: zodiacSigns[s].name,
      signHindi: zodiacSigns[s].hindi,
      signLord,
      durationYears: duration,
      startDate: new Date(currentStart.getTime()),
      endDate: new Date(currentEnd.getTime()),
      durationDays: (currentEnd.getTime() - currentStart.getTime()) / (86400 * 1e3)
    });
    currentStart = new Date(currentEnd.getTime());
  }
  return {
    lagnaSignIndex: lagnaSign,
    isDirectProgression,
    orderOfSigns,
    timeline
  };
}
function calculateAllDashas(natalChart, queryDate = /* @__PURE__ */ new Date()) {
  const moon = natalChart.planets.find((p) => p.name === "Moon");
  const vimshottariData = generateVimshottariTimeline(
    natalChart.birthDate,
    moon.longitude,
    true
  );
  const currentVim = findCurrentVimshottari(vimshottariData.timeline, queryDate) || {
    mahadasha: vimshottariData.timeline[0].mahadashaLord,
    antardasha: vimshottariData.timeline[0].antardashas[0].antardashaLord,
    pratyantardasha: vimshottariData.timeline[0].antardashas[0].pratyantardashas[0].pratyantardashaLord,
    sookshma: vimshottariData.timeline[0].antardashas[0].pratyantardashas[0].pratyantardashaLord,
    startDate: vimshottariData.timeline[0].startDate,
    endDate: vimshottariData.timeline[0].endDate
  };
  const yogini = calculateYoginiDasha(natalChart.birthDate, moon.longitude);
  const ashtottari = calculateAshtottariDasha(natalChart);
  const chara = calculateCharaDasha(natalChart);
  return {
    vimshottari: {
      balance: vimshottariData.balance,
      timeline: vimshottariData.timeline,
      current: currentVim
    },
    yogini,
    ashtottari,
    chara
  };
}
export {
  ASHTOTTARI_LORDS,
  ASHTOTTARI_YEARS,
  MS_PER_YEAR,
  NAKSHATRA_TO_VIMSHOTTARI_LORD,
  TOTAL_ASHTOTTARI_YEARS,
  TOTAL_VIMSHOTTARI_YEARS,
  TOTAL_YOGINI_YEARS,
  VIMSHOTTARI_LORDS,
  VIMSHOTTARI_YEARS,
  YOGINI_DETAILS,
  YOGINI_NAMES,
  calculateAllDashas,
  calculateAshtottariDasha,
  calculateCharaDasha,
  calculateVimshottariBalance,
  calculateYoginiDasha,
  findCurrentVimshottari,
  generateVimshottariTimeline
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
