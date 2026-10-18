// src/kundli/drishtiEngine.ts
function calculateDrishtiAndConjunctions(planets) {
  const aspects = [];
  const conjunctions = [];
  const naturalBenefics = ["Jupiter", "Venus", "Mercury", "Moon"];
  for (let i = 0; i < planets.length; i++) {
    const p1 = planets[i];
    for (let j = 0; j < planets.length; j++) {
      if (i === j) continue;
      const p2 = planets[j];
      const forwardDist = (p2.longitude - p1.longitude + 360) % 360;
      const houseDistance = Math.floor(forwardDist / 30) + 1;
      if (i < j && (p1.houseOccupied === p2.houseOccupied || forwardDist <= 12 || forwardDist >= 348)) {
        let sep = Math.abs(p1.longitude - p2.longitude);
        if (sep > 180) sep = 360 - sep;
        const isClose = sep <= 8;
        const isYuddha = sep <= 1 && !["Sun", "Moon", "Rahu", "Ketu"].includes(p1.name) && !["Sun", "Moon", "Rahu", "Ketu"].includes(p2.name);
        let winner;
        if (isYuddha) {
          winner = p1.latitude >= p2.latitude ? p1.name : p2.name;
        }
        conjunctions.push({
          planet1: p1.name,
          planet2: p2.name,
          signIndex: p1.signIndex,
          houseOccupied: p1.houseOccupied,
          separationDegrees: sep,
          isClose,
          isGrahaYuddha: isYuddha,
          warWinner: winner
        });
      }
      let aspectType = null;
      let targetDeg = 180;
      if (houseDistance === 7) {
        aspectType = "7th";
        targetDeg = 180;
      } else if (p1.name === "Mars") {
        if (houseDistance === 4) {
          aspectType = "Special_4th";
          targetDeg = 90;
        } else if (houseDistance === 8) {
          aspectType = "Special_8th";
          targetDeg = 210;
        }
      } else if (["Jupiter", "Rahu", "Ketu"].includes(p1.name)) {
        if (houseDistance === 5) {
          aspectType = "Special_5th";
          targetDeg = 120;
        } else if (houseDistance === 9) {
          aspectType = "Special_9th";
          targetDeg = 240;
        }
      } else if (p1.name === "Saturn") {
        if (houseDistance === 3) {
          aspectType = "Special_3rd";
          targetDeg = 60;
        } else if (houseDistance === 10) {
          aspectType = "Special_10th";
          targetDeg = 270;
        }
      }
      if (aspectType) {
        let diff = Math.abs(forwardDist - targetDeg);
        if (diff > 180) diff = 360 - diff;
        const strength = Math.max(0, Math.min(100, Math.round((1 - diff / 15) * 100)));
        aspects.push({
          aspectingPlanet: p1.name,
          aspectedPlanet: p2.name,
          aspectType,
          separationDegrees: forwardDist,
          orbDegrees: diff,
          strengthPercent: strength,
          isBenefic: naturalBenefics.includes(p1.name)
        });
      }
    }
  }
  return { aspects, conjunctions };
}
export {
  calculateDrishtiAndConjunctions
};
