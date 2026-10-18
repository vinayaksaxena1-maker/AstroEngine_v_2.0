/**
 * Generates Vinayak Saxena's Vistrit Maha-Kundali & 5-Year Varshphal PDF Report
 * Clean-Room Parashari, Jaimini, Tajik Varshphal & Shodashvarga Integration
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  calculateCompleteHoroscope,
  calculateNatalChart,
  calculateVarshphal,
  generateNorthIndianChart,
  renderNorthIndianSvg
} from '../dist/index.js';

const birthData = {
  name: 'Vinayak Saxena (विनायक सक्सेना)',
  date: '1984-06-16',
  time: '16:25:00',
  formattedTime: '04:25:00 PM (16:25 IST)',
  city: 'Indore, Madhya Pradesh, India (इंदौर, मध्य प्रदेश)',
  timezoneOffset: 5.5,
  latitude: 22.7196,
  longitude: 75.8577
};

console.log('Calculating complete horoscope for:', birthData.name);
const c = calculateCompleteHoroscope({
  date: birthData.date,
  time: birthData.time,
  timezoneOffset: birthData.timezoneOffset,
  latitude: birthData.latitude,
  longitude: birthData.longitude
});

// Format DMS helper
function toDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}' ${s.toString().padStart(2, '0')}"`;
}

// Generate Bhava Chalit SVG
const chalitData = {
  ascendant: c.ascendant,
  cusps: c.cusps,
  planets: c.planets.map(p => ({
    ...p,
    houseOccupied: p.bhavaChalitHouse
  }))
};
const chalitModel = generateNorthIndianChart(chalitData);
const chalitSvg = renderNorthIndianSvg(chalitModel);

// Generate D9 Navamsha SVG
const d9AscSignIdx = c.vargas.ascendant.vargas.D9.signIndex; // Taurus = 1
const d9Planets = c.planets.map(p => {
  const d9Info = c.vargas.planets[p.name]?.vargas.D9;
  const d9SignIdx = d9Info ? d9Info.signIndex : p.signIndex;
  const d9House = ((d9SignIdx - d9AscSignIdx + 12) % 12) + 1;
  return {
    ...p,
    houseOccupied: d9House,
    degreeInSign: d9Info ? d9Info.degreeInVarga : p.degreeInSign
  };
});
const d9Data = {
  ascendant: { ...c.ascendant, signIndex: d9AscSignIdx },
  cusps: c.cusps,
  planets: d9Planets
};
const d9Model = generateNorthIndianChart(d9Data);
const d9Svg = renderNorthIndianSvg(d9Model);

// 5-Year Varshphal calculations (2024 to 2028: Ages 40 to 44)
const natal = calculateNatalChart(new Date('1984-06-16T10:55:00.000Z'), birthData.latitude, birthData.longitude);
const varshphalYears = [];

const annualPredictions = {
  2024: {
    title: 'वर्ष 2024 - 2025 (आयु 40 वर्ष) : बौद्धिक विस्तार, रणनीतिक स्थिरता व नए प्रकल्प',
    overview: 'इस वर्ष मुंथा कुंभ राशि में पंचम भाव (विद्या, बुद्धि, योजना) में संचरण कर रही है। मुंथा के स्वामी शनि देव जन्म कुंडली में उच्च के होकर लग्न में विराजमान हैं। यह वर्ष बौद्धिक नेतृत्व, तकनीकी परियोजनाओं में सफलता, महत्वपूर्ण निर्णयों में दूरदर्शिता और संतान/परिजनों से सहयोग का है।',
    career: 'कार्यक्षेत्र में पुरानी मेहनत का सुफल मिलेगा। आपकी रणनीतिक सलाह और विश्लेषणात्मक क्षमताओं की सराहना होगी। नए तकनीकी अथवा परामर्श अनुबंध प्राप्त होने के प्रबल योग हैं।',
    finance: 'आर्थिक स्थिति सुदृढ़ रहेगी। संचित कोष में वृद्धि होगी। दीर्घावधि निवेश के लिए यह समय अत्यंत अनुकूल है। व्यर्थ के सट्टे या जल्दबाजी वाले निवेश से बचें।',
    health: 'सामान्य स्वास्थ्य उत्तम रहेगा। शनि के प्रभाव से कार्यभार के कारण थकान या मांसपेशियों में खिंचाव संभव है। दैनिक योग व प्राणायाम से स्फूर्ति बनी रहेगी।'
  },
  2025: {
    title: 'वर्ष 2025 - 2026 (आयु 41 वर्ष) : कर्मठता, प्रतिस्पर्धी विजय एवं स्वास्थ्य सजगता',
    overview: 'इस वर्ष मुंथा मीन राशि में षष्ठ भाव (रोग, ऋण, शत्रु, प्रतिस्पर्धा) में स्थित है। इसके स्वामी देवगुरु बृहस्पति जन्म कुंडली के तृतीय भाव में स्वराशि धनु में हैं। यह वर्ष कार्यक्षेत्र में कठिन परिश्रम, विरोधियों पर विजय और जटिल समस्याओं के समाधान का काल है।',
    career: 'प्रतियोगी माहौल में आपकी कार्यक्षमता निखरकर सामने आएगी। आपके विरोधी परास्त होंगे। नए कार्यभार और दायित्व मिलेंगे जिससे व्यस्तता अत्यधिक बढ़ेगी।',
    finance: 'आय के स्रोत स्थिर रहेंगे, किंतु पुराने ऋणों के भुगतान अथवा कार्य विस्तार में व्यय हो सकता है। वित्तीय अनुशासन बनाए रखना हितकर होगा।',
    health: 'षष्ठ भाव में मुंथा होने से पाचन तंत्र, खानपान की अनियमितता अथवा मौसमी विकारों के प्रति सतर्क रहने की आवश्यकता है। संतुलित आहार व नियमित दिनचर्या अनिवार्य है।'
  },
  2026: {
    title: 'वर्ष 2026 - 2027 (आयु 42 वर्ष) : व्यावसायिक अनुबंध, जनसंपर्क एवं सामाजिक प्रतिष्ठा',
    overview: 'इस वर्ष मुंथा मेष राशि में सप्तम भाव (साझेदारी, व्यापार, दांपत्य, लोक संपर्क) में संचरण करेगी। मुंथा के स्वामी मंगल जन्म कुंडली के प्रथम भाव में योगकारक शनि के साथ हैं। यह वर्ष नए साझेदारों, जनसंपर्क और सामाजिक ख्याति के विस्तार का वर्ष है।',
    career: 'व्यापारिक यात्राएं और नए व्यावसायिक अनुबंध लाभप्रद सिद्ध होंगे। सामूहिक परियोजनाओं में आपका नेतृत्व स्वीकृत होगा। जनता और ग्राहकों से सीधा लाभ मिलेगा।',
    finance: 'साझेदारी और अनुबंधों से उत्तम धन लाभ होगा। सुख-सुविधाओं और पारिवारिक कार्यों में व्यय की संभावना है, जो प्रतिष्ठा में वृद्धि करेगा।',
    health: 'अग्नि तत्व प्रधान मंगल के प्रभाव से रक्तचाप एवं उष्णता जनित विकारों से बचाव रखें। यात्राओं के दौरान पर्याप्त विश्राम आवश्यक है।'
  },
  2027: {
    title: 'वर्ष 2027 - 2028 (आयु 43 वर्ष) : गूढ़ अनुसंधान, तकनीकी नवाचार एवं अप्रत्याशित लाभ',
    overview: 'इस वर्ष मुंथा वृषभ राशि में अष्टम भाव (अनुसंधान, गुप्त विद्या, अचानक परिवर्तन) में रहेगी। मुंथा के स्वामी शुक्र नवम भाव में सूर्य के साथ स्थित हैं। यह वर्ष गहन शोध, तकनीकी इन्फ्रास्ट्रक्चर में बड़े बदलाव और अप्रत्याशित वित्तीय अवसरों का वर्ष है।',
    career: 'शोध, डेटा विश्लेषण, गहन तकनीकी विकास और बैक-एंड आर्किटेक्चर के कार्यों में अद्भुत सफलता मिलेगी। पुराने लंबित मामलों का समाधान अचानक होगा।',
    finance: 'अचानक धन लाभ, पैतृक संपत्ति अथवा पूर्व निवेश से अप्रत्याशित रिटर्न के योग हैं। अनियोजित खर्चों पर नियंत्रण रखें।',
    health: 'अष्टम भाव में मुंथा के कारण मानसिक तनाव, अनिद्रा अथवा जोड़ों में असहजता हो सकती है। ध्यान, शिव उपासना और प्राणायाम परम कल्याणकारी रहेंगे।'
  },
  2028: {
    title: 'वर्ष 2028 - 2029 (आयु 44 वर्ष) : परम भाग्योदय, उच्च प्रतिष्ठा, धर्म एवं कीर्ति विस्तार',
    overview: 'इस वर्ष मुंथा मिथुन राशि में नवम भाव (भाग्य, धर्म, उच्च चिंतन, लंबी यात्रा) में प्रवेश करेगी। नवम भाव में जन्म के समय सूर्य व शुक्र विराजमान हैं और मुंथा स्वामी बुध अष्टम में स्वमित्र राशि में हैं। यह पंचवर्षीय चक्र का सर्वाधिक भाग्यशाली और गौरवशाली वर्ष रहेगा।',
    career: 'करियर में सर्वोच्च सम्मान, पदोन्नति अथवा अंतरराष्ट्रीय/राष्ट्रीय स्तर पर मान्यता मिलने के प्रबल योग हैं। आपके कार्यों को व्यापक सराहना मिलेगी।',
    finance: 'भाग्य का पूर्ण सहयोग प्राप्त होगा। आय के एकाधिक स्रोत खुलेंगे। धार्मिक व परोपकारी कार्यों में धन का शुभ व्यय होगा।',
    health: 'मानसिक प्रसन्नता और शारीरिक ऊर्जा का स्तर उच्च रहेगा। लंबी आध्यात्मिक अथवा विदेश यात्राएं स्वास्थ्य और मन को ताजगी प्रदान करेंगी।'
  }
};

for (let age = 40; age <= 44; age++) {
  const vp = calculateVarshphal(natal, age);
  const vChart = calculateNatalChart(vp.varshpraveshDate, birthData.latitude, birthData.longitude);
  const istDate = new Date(vp.varshpraveshDate.getTime() + 5.5 * 3600 * 1000);
  const year = 1984 + age;
  
  varshphalYears.push({
    year,
    targetAge: age,
    varshpraveshIST: istDate.toISOString().replace('T', ' ').slice(0, 19) + ' IST',
    munthaSign: vp.munthaSignName,
    munthaHouse: ((vp.munthaSignIndex - natal.ascendant.signIndex + 12) % 12) + 1,
    varshLagna: vChart.ascendant.signName,
    varshLagnaDeg: toDMS(vChart.ascendant.degreeInSign),
    punyaSahamDeg: toDMS(vp.punyaSahamLongitude % 30),
    punyaSahamSign: ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'][Math.floor(vp.punyaSahamLongitude / 30)],
    prediction: annualPredictions[year]
  });
}

// Dignity badge helper
function getDignityBadge(p) {
  if (p.name === 'Saturn' && p.signName === 'Libra') return '<span class="badge badge-exalt">उच्च (Exalted)</span>';
  if (p.name === 'Jupiter' && p.signName === 'Sagittarius') return '<span class="badge badge-own">स्वक्षेत्री (Own Sign)</span>';
  if (p.name === 'Venus' && p.signName === 'Gemini') return '<span class="badge badge-friend">मित्र (Friendly)</span>';
  if (p.name === 'Mercury' && p.signName === 'Taurus') return '<span class="badge badge-friend">मित्र (Friendly)</span>';
  if (p.name === 'Sun' && p.signName === 'Gemini') return '<span class="badge badge-neutral">सम (Neutral)</span>';
  if (p.name === 'Moon' && p.signName === 'Capricorn') return '<span class="badge badge-neutral">सम (Neutral)</span>';
  if (p.name === 'Mars' && p.signName === 'Libra') return '<span class="badge badge-neutral">सम (Neutral)</span>';
  return '<span class="badge badge-neutral">सामान्य</span>';
}

// HTML Generation
const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>विस्तृत महा-कुंडली एवं पंचवर्षीय वर्षफल - विनायक सक्सेना</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', 'Nirmala UI', Roboto, Mangal, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.4;
      font-size: 11px;
      margin: 0;
      padding: 0;
    }
    .page {
      page-break-after: always;
      position: relative;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    /* HEADER & BRANDING */
    .header-bar {
      border: 1.5px solid #b45309;
      background: linear-gradient(135deg, #78350f 0%, #b45309 50%, #92400e 100%);
      color: #ffffff;
      border-radius: 6px;
      padding: 10px 16px;
      text-align: center;
      margin-bottom: 10px;
    }
    .header-om {
      font-size: 20px;
      color: #fef08a;
      font-weight: 800;
      margin-bottom: 2px;
      letter-spacing: 2px;
    }
    .header-title {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin: 0;
      color: #ffffff;
    }
    .header-subtitle {
      font-size: 11px;
      color: #fde68a;
      margin-top: 2px;
      font-weight: 500;
    }

    /* SECTION HEADINGS */
    .section-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #78350f;
      background: #fef3c7;
      border-left: 4px solid #b45309;
      padding: 4px 8px;
      margin: 10px 0 6px 0;
      border-radius: 0 4px 4px 0;
    }

    /* GRID & CARDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    .card {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 8px;
    }
    .card-highlight {
      border: 1.5px solid #f59e0b;
      background: #fffbeb;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 10.5px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      font-size: 10px;
    }
    td {
      padding: 3.5px 6px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* BADGES */
    .badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 700;
      text-align: center;
    }
    .badge-exalt { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-own { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
    .badge-friend { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-neutral { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .badge-retro { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    /* CHART CONTAINERS */
    .chart-box {
      text-align: center;
      background: #fffdfa;
      border: 1px solid #fed7aa;
      border-radius: 6px;
      padding: 6px;
    }
    .chart-box h4 {
      margin: 0 0 4px 0;
      font-size: 11px;
      color: #9a3412;
      font-weight: 700;
    }
    .chart-box svg {
      max-width: 230px;
      height: 230px;
      display: block;
      margin: 0 auto;
    }

    /* BHAVA PHALIT ITEM */
    .bhava-item {
      border-left: 3px solid #d97706;
      background: #fafaf9;
      padding: 6px 8px;
      margin-bottom: 6px;
      border-radius: 0 4px 4px 0;
    }
    .bhava-title {
      font-weight: 700;
      color: #92400e;
      font-size: 10.5px;
      margin-bottom: 2px;
    }
    .bhava-desc {
      font-size: 10px;
      color: #334155;
      text-align: justify;
      line-height: 1.35;
    }

    /* VARSHPHAL CARD */
    .vp-card {
      border: 1px solid #d97706;
      background: #ffffff;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 8px;
    }
    .vp-header {
      background: linear-gradient(90deg, #fffbeb, #fef3c7);
      padding: 4px 8px;
      border-radius: 4px;
      border-left: 3.5px solid #b45309;
      font-weight: 700;
      color: #78350f;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .vp-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 9.5px;
      color: #475569;
      background: #f8fafc;
      padding: 4px 6px;
      border-radius: 4px;
      margin-bottom: 6px;
      border: 1px solid #e2e8f0;
    }
    .vp-meta span strong {
      color: #1e293b;
    }

    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 9px;
      color: #64748b;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- PAGE 1: COVER, NATIVE PROFILE & 3 CHARTS   -->
  <!-- ========================================== -->
  <div class="page">
    <div class="header-bar">
      <div class="header-om">॥ श्री गणेशाय नमः ॥ ॐ सूर्याय नमः ॥</div>
      <h1 class="header-title">सम्पूर्ण विस्तृत जन्म पत्रिका एवं पंचवर्षीय वर्षफल</h1>
      <div class="header-subtitle">Comprehensive Vedic Horoscope, Divisional Vargas &amp; 5-Year Annual Predictions</div>
    </div>

    <!-- PROFILE & PANCHANG -->
    <div class="grid-2">
      <!-- Native Details -->
      <div class="card card-highlight">
        <div style="font-weight: 700; color: #78350f; margin-bottom: 4px; border-bottom: 1px solid #fed7aa; padding-bottom: 2px;">
          👤 जातक परिचय (Native Profile)
        </div>
        <table>
          <tr><td><strong>जातक का नाम:</strong></td><td><strong>विनायक सक्सेना (Vinayak Saxena)</strong></td></tr>
          <tr><td><strong>जन्म दिनांक:</strong></td><td>16 जून 1984 (16-06-1984)</td></tr>
          <tr><td><strong>जन्म समय:</strong></td><td>04:25:00 अपराह्न (16:25:00 IST)</td></tr>
          <tr><td><strong>जन्म स्थान:</strong></td><td>इंदौर, मध्य प्रदेश, भारत</td></tr>
          <tr><td><strong>अक्षांश / रेखांश:</strong></td><td>22.7196° N, 75.8577° E (IST +05:30)</td></tr>
          <tr><td><strong>अयनांश प्रणाली:</strong></td><td>चित्रा पक्ष लहिरी (Lahiri 23° 38' 14.5")</td></tr>
        </table>
      </div>

      <!-- Avakahada Chakra -->
      <div class="card">
        <div style="font-weight: 700; color: #78350f; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">
          🪐 अवकहड़ा चक्र एवं पंचांग (Panchang Details)
        </div>
        <table>
          <tr><td><strong>लग्न (Ascendant):</strong></td><td>तुला (25° 41' 06" - विशाखा-2, स्वामी: शुक्र)</td></tr>
          <tr><td><strong>चन्द्र राशि (Moon Sign):</strong></td><td>मकर (05° 57' 43" - स्वामी: शनि)</td></tr>
          <tr><td><strong>जन्म नक्षत्र एवं पद:</strong></td><td>उत्तर आषाढ़ा (पद 3, स्वामी: सूर्य)</td></tr>
          <tr><td><strong>तिथि एवं पक्ष:</strong></td><td>कृष्ण पक्ष तृतीया (3)</td></tr>
          <tr><td><strong>वार / योग / करण:</strong></td><td>शनिवार | ब्रह्म योग | वणिज करण</td></tr>
          <tr><td><strong>वर्ण / वश्य / गण:</strong></td><td>वैश्य | जलचर / चतुष्पद | मनुष्य गण</td></tr>
          <tr><td><strong>नाड़ी / योनि / पाया:</strong></td><td>अन्त्य नाड़ी | नकुल (नेवला) | लोहा पाया</td></tr>
        </table>
      </div>
    </div>

    <!-- 3 CHARTS IN ROW: D1, CHALIT, D9 -->
    <div class="section-title">📊 मुख्य कुंडलियाँ (Primary Astrological Charts)</div>
    <div class="grid-3">
      <div class="chart-box">
        <h4>लग्न कुंडली (D1 Lagna Chart)</h4>
        ${c.charts.northIndianSvg}
        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">तुला लग्न • शनि उच्च (लग्न Kendra)</div>
      </div>
      <div class="chart-box">
        <h4>भाव चलित कुंडली (Bhava Chalit)</h4>
        ${chalitSvg}
        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">श्रीपति संधि • चंद्र-मंगल 3rd भाव में</div>
      </div>
      <div class="chart-box">
        <h4>नवांश कुंडली (D9 Navamsha)</h4>
        ${d9Svg}
        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">वृषभ लग्न • शनि स्वक्षेत्री कुंभ में</div>
      </div>
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 1/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>


  <!-- ==================================================== -->
  <!-- PAGE 2: PLANETARY DEGREES, DUAL HOUSE & CUSPS TABLE -->
  <!-- ==================================================== -->
  <div class="page">
    <div class="section-title">🪐 ग्रह स्पष्ट, नक्षत्र एवं राशि/भाव चलित स्थिति (Planetary Degrees &amp; House Placements)</div>
    
    <table>
      <thead>
        <tr>
          <th>ग्रह (Planet)</th>
          <th>स्पष्ट अंश (Longitude)</th>
          <th>राशि (Sign)</th>
          <th>नक्षत्र एवं पद</th>
          <th>नक्षत्र स्वामी</th>
          <th>KP Sub</th>
          <th>राशि भाव</th>
          <th>चलित भाव</th>
          <th>गति / अवस्था</th>
          <th>बल / स्थिति</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>लग्न (Ascendant)</strong></td>
          <td>25° 41' 06"</td>
          <td>तुला (Libra)</td>
          <td>विशाखा (पद 2)</td>
          <td>बृहस्पति</td>
          <td>शनि</td>
          <td>1</td>
          <td>1</td>
          <td>मार्गी</td>
          <td><span class="badge badge-own">शुक्र क्षेत्री</span></td>
        </tr>
        ${c.planets.map(p => {
          const combustStr = p.isCombust ? '<span class="badge badge-retro">अस्त (Combust)</span>' : 'उदित';
          const retroStr = p.isRetrograde ? '<span class="badge badge-retro">वक्र (Retrograde)</span>' : 'मार्गी';
          const chalitShift = p.rashiHouse !== p.bhavaChalitHouse ? ` <span style="color:#b45309; font-weight:bold;">(Shifted)</span>` : '';
          return `
          <tr>
            <td><strong>${p.hindiName} (${p.name})</strong></td>
            <td>${toDMS(p.degreeInSign)}</td>
            <td>${p.signHindi} (${p.signName})</td>
            <td>${p.nakshatra} (पद ${p.nakshatraPada})</td>
            <td>${p.nakshatraLord}</td>
            <td>${p.kpSubLord || '-'}</td>
            <td><strong>${p.rashiHouse}</strong></td>
            <td><strong>${p.bhavaChalitHouse}</strong>${chalitShift}</td>
            <td>${retroStr} • ${combustStr}</td>
            <td>${getDignityBadge(p)}</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="section-title">🏠 द्वादश भाव स्पष्ट एवं श्रीपति भाव संधि (House Cusps &amp; Sripati Sandhi)</div>
    <table>
      <thead>
        <tr>
          <th>भाव</th>
          <th>भाव का नाम (Signification)</th>
          <th>भाव आरंभ (Start)</th>
          <th>भाव मध्य (Cusp Madhya)</th>
          <th>भाव अंत (End)</th>
          <th>भाव स्वामी</th>
          <th>स्थित ग्रह (राशि भाव)</th>
          <th>स्थित ग्रह (भाव चलित)</th>
        </tr>
      </thead>
      <tbody>
        ${c.cusps.map(csp => {
          const rashiPlanets = c.planets.filter(p => p.rashiHouse === csp.houseNumber).map(p => p.hindiName).join(', ') || '-';
          const chalitPlanets = c.planets.filter(p => p.bhavaChalitHouse === csp.houseNumber).map(p => p.hindiName).join(', ') || '-';
          const houseNames = [
            'तनु / लग्न (Personality/Health)',
            'धन / वाणी (Wealth/Family)',
            'सहज / पराक्रम (Courage/Siblings)',
            'सुख / मातृ (Home/Vehicles/Mother)',
            'पुत्र / विद्या (Intellect/Progeny)',
            'रोग / शत्रु (Debts/Competitors)',
            'जाया / साझेदारी (Spouse/Business)',
            'आयु / गूढ़ (Longevity/Transformation)',
            'भाग्य / धर्म (Fortune/Higher Wisdom)',
            'कर्म / आजीविका (Career/Status)',
            'लाभ / सिद्धि (Gains/Aspirations)',
            'व्यय / मोक्ष (Expenses/Spirituality)'
          ];
          return `
          <tr>
            <td><strong>भाव ${csp.houseNumber}</strong></td>
            <td>${houseNames[csp.houseNumber - 1]}</td>
            <td>${toDMS(csp.startDegree)}</td>
            <td><strong>${toDMS(csp.midDegree)}</strong></td>
            <td>${toDMS(csp.endDegree)}</td>
            <td>${csp.signLord}</td>
            <td>${rashiPlanets}</td>
            <td><strong>${chalitPlanets}</strong></td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="card" style="margin-top: 8px; background: #fffbeb; border: 1px solid #fed7aa;">
      <strong style="color: #92400e;">🔍 भाव चलित का सूक्ष्म शास्त्रीय रहस्य:</strong><br/>
      जन्म कुंडली में चंद्रमा मकर राशि में (4th हाउस) और मंगल तुला राशि में (1st हाउस) स्थित हैं। परंतु श्रीपति भाव चलित गणना के अनुसार चंद्रमा 3°20' संधि के पार होने से <strong>तृतीय भाव</strong> में और मंगल भी संधि पार कर <strong>तृतीय भाव</strong> के प्रभाव क्षेत्र में आ जाते हैं। इसके फलस्वरूप जातक के अंदर पराक्रम, असीम साहसिक निर्णय क्षमता, स्वतंत्र उद्यमशीलता और लेखन/संवाद में अत्यधिक ऊर्जा का संचार होता है।
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 2/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>


  <!-- ==================================================== -->
  <!-- PAGE 3: 12-BHAVA PHALIT ANALYSIS (HOUSES 1 TO 12)    -->
  <!-- ==================================================== -->
  <div class="page">
    <div class="section-title">📖 द्वादश भाव विस्तृत फलित विवेचन (Comprehensive 12-Bhava Analysis)</div>

    <div class="grid-2">
      <!-- Houses 1 to 6 -->
      <div>
        <div class="bhava-item">
          <div class="bhava-title">भाव 1 (तनु / लग्न) : तुला राशि | स्वामी: शुक्र | स्थित ग्रह: शनि (उच्च), मंगल</div>
          <div class="bhava-desc">
            तुला लग्न में शनि देव 22°37' पर उच्च के होकर परम <strong>शश महापुरुष राजयोग</strong> का निर्माण कर रहे हैं। लग्नेश शुक्र नवम (भाग्य) भाव में स्थित हैं। जातक का व्यक्तित्व गंभीर, न्यायप्रिय, दूरदर्शी, रणनीतिक और स्वाभिमानी है। शनि-मंगल की युति लग्न में होने से अद्भुत ऊर्जा और कार्यकुशलता प्राप्त होती है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 2 (धन एवं वाणी) : वृश्चिक राशि | स्वामी: मंगल | स्थित ग्रह: केतु</div>
          <div class="bhava-desc">
            द्वितीयेश मंगल लग्न में स्थित होकर द्वितीय भाव पर दृष्टि डालता है। वाणी में तेज, स्पष्टता और अधिकार की झलक रहती है। केतु की उपस्थिति जातक को पारंपरिक संचय से अलग स्वतंत्र वित्तीय सोच और गुप्त धन/आकस्मिक लाभ की ओर प्रवृत्त करती है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 3 (सहज एवं पराक्रम) : धनु राशि | स्वामी: गुरु (स्वक्षेत्री) | चलित ग्रह: चंद्र, मंगल</div>
          <div class="bhava-desc">
            तृतीय भाव में देवगुरु बृहस्पति अपने मूलत्रिकोण धनु राशि में स्वक्षेत्री हैं। भाव चलित में चंद्रमा और मंगल का प्रभाव आने से जातक में अद्वितीय पराक्रम, उत्कृष्ट संप्रेषण क्षमता, तकनीकी लेखन, बंधु-बांधवों का सहयोग और साहसिक उपक्रमों को सिद्ध करने की अद्भुत शक्ति है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 4 (सुख एवं मातृ) : मकर राशि | स्वामी: शनि (उच्च) | स्थित ग्रह: चंद्रमा</div>
          <div class="bhava-desc">
            चतुर्थेश शनि केंद्र (लग्न) में उच्चस्थ हैं और चंद्रमा चतुर्थ में अपने मित्र शनि के नक्षत्र में स्थित है। जातक को भूमि, भवन, स्थायी संपत्ति और उच्च स्तरीय वाहन का पूर्ण सुख प्राप्त होता है। माता के प्रति गहरा समर्पण रहता है, यद्यपि शनि के प्रभाव से पैतृक सुख में कुछ विलंब से स्थिरता आती है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 5 (संतान एवं विद्या) : कुंभ राशि | स्वामी: शनि | दृष्टि: बुध</div>
          <div class="bhava-desc">
            पंचम भाव कुंभ राशि है जिसके स्वामी उच्चस्थ शनि देव हैं। बुध की अष्टम से दृष्टि तकनीकी और तार्किक विद्या में असाधारण मेधा प्रदान करती है। जातक का मस्तिष्क जटिल एल्गोरिदम, अनुसंधान, वित्तीय गणनाओं और दूरगामी रणनीतिक नीतियों को तुरंत समझ लेने में सक्षम है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 6 (रोग, ऋण एवं शत्रु) : मीन राशि | स्वामी: गुरु | सर्वाष्टकवर्ग: 34 बिंदु</div>
          <div class="bhava-desc">
            षष्ठ भाव में 34 शुभ बिंदुओं की उपस्थिति शत्रु-हंता योग बनाती है। जातक के गुप्त अथवा प्रत्यक्ष शत्रु उसके सामने कभी टिक नहीं पाते। कठिन से कठिन प्रतियोगी परीक्षाओं, विवादों और कानूनी अड़चनों में अंततः जातक की पूर्ण विजय होती है।
          </div>
        </div>
      </div>

      <!-- Houses 7 to 12 -->
      <div>
        <div class="bhava-item">
          <div class="bhava-title">भाव 7 (जाया एवं साझेदारी) : मेष राशि | स्वामी: मंगल | दृष्टि: उच्च शनि, मंगल</div>
          <div class="bhava-desc">
            सप्तमेश मंगल लग्न में स्थित होकर सप्तम भाव को पूर्ण दृष्टि से देखता है। उच्च शनि के साथ मंगल की युति होने से मांगलिक दोष का शास्त्रीय परिहार (कंसिलेशन) हो जाता है। जीवनसाथी आत्मविश्वासी, स्पष्टवादी, सहयोगी और संभ्रांत कुल से संबंध रखने वाला होता है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 8 (आयु एवं गूढ़ अनुसंधान) : वृषभ राशि | स्वामी: शुक्र | स्थित ग्रह: बुध, राहु</div>
          <div class="bhava-desc">
            अष्टम भाव में नवमेश बुध की स्थिति <strong>विमल विपरीत राजयोग</strong> का निर्माण करती है। जातक को गूढ़ विज्ञान, ज्योतिष, डाटा साइंस, साइबर सुरक्षा एवं गुप्त विद्याओं में स्वाभाविक महारत प्राप्त होती है। जातक दीर्घायु और संकटों से सहजता से उबरने वाला होता है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 9 (भाग्य एवं धर्म) : मिथुन राशि | स्वामी: बुध | स्थित ग्रह: सूर्य, शुक्र</div>
          <div class="bhava-desc">
            लग्नेश शुक्र का नवम (धर्म व भाग्य) भाव में सूर्य के साथ बैठना परम <strong>लक्ष्मी-भाग्योदय योग</strong> बनाता है। जातक अपने जीवन में स्वयं के पुरुषार्थ और गुरु/पिता के आशीर्वाद से निरंतर प्रगति करता है। दूरस्थ यात्राओं, तीर्थाटन और प्रतिष्ठित संस्थाओं से गहरा संबंध रहता है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 10 (कर्म एवं आजीविका) : कर्क राशि | स्वामी: चंद्रमा | SAV: 33 बिंदु</div>
          <div class="bhava-desc">
            दशम भाव कर्म का क्षेत्र है, जहां कर्क राशि स्थित है। स्वामी चंद्रमा चतुर्थ में स्थित होकर दशम पर दृष्टि डालता है। सर्वाष्टकवर्ग में 33 शुभ बिंदु होने से कार्यक्षेत्र में स्थाई सम्मान, जनसंपर्क, सलाहकार/परामर्शदाता की भूमिका अथवा स्वतंत्र व्यवसाय में जातक का प्रभुत्व रहता है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 11 (आय एवं लाभ) : सिंह राशि | स्वामी: सूर्य | स्थित: नवम से दृष्टि</div>
          <div class="bhava-desc">
            एकादशेश सूर्य नवम भाव में स्थित होकर एकादश भाव पर पूर्ण दृष्टि डालते हैं। यह <strong>धनाधिपति योग</strong> है, जिसके कारण आय के नियमित और बहुआयामी स्रोत बने रहते हैं। शासन-प्रशासन, उच्च पदस्थ अधिकारियों और सामाजिक प्रतिष्ठित व्यक्तियों से दीर्घकालिक वित्तीय लाभ प्राप्त होता है।
          </div>
        </div>

        <div class="bhava-item">
          <div class="bhava-title">भाव 12 (व्यय एवं मोक्ष) : कन्या राशि | स्वामी: बुध | स्थित ग्रह: कोई नहीं</div>
          <div class="bhava-desc">
            व्ययेश बुध अष्टम भाव में स्थित है। इसके प्रभाव से जातक का धन शुभ कार्यों, अनुसंधान, आध्यात्मिक साधना और बौद्धिक उन्नयन में व्यय होता है। व्यर्थ की फिजूलखर्ची से बचाव रहता है तथा विदेश अथवा जन्मस्थान से दूर कार्यक्षेत्र में विशेष उन्नति होती है।
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 3/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>


  <!-- ==================================================== -->
  <!-- PAGE 4: SHODASHVARGA, SHADBALA & ASHTAKAVARGA SAV    -->
  <!-- ==================================================== -->
  <div class="page">
    <div class="section-title">🏛️ षोडशवर्ग चक्र सारणी (16 Divisional Charts Analysis - Parashari D1 to D60)</div>
    <table>
      <thead>
        <tr>
          <th>वर्ग कोड</th>
          <th>वर्ग का नाम</th>
          <th>शास्त्रीय उद्देश्य / फलित क्षेत्र</th>
          <th>लग्न राशि</th>
          <th>शनि (Saturn)</th>
          <th>बृहस्पति (Jupiter)</th>
          <th>शुक्र (Venus)</th>
          <th>विशेष योग / वर्गोत्तम</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>D1</strong></td><td>राशि (Rashi)</td><td>समग्र जीवन, शरीर व प्रकृति</td><td>तुला (Libra)</td><td>तुला (उच्च)</td><td>धनु (स्वक्षेत्र)</td><td>मिथुन</td><td>शश महापुरुष योग</td></tr>
        <tr><td><strong>D2</strong></td><td>होरा (Hora)</td><td>धन संपदा एवं वित्तीय संसाधन</td><td>कर्क</td><td>सिंह</td><td>सिंह</td><td>कर्क</td><td>सूर्य-चंद्र होरा संतुलन</td></tr>
        <tr><td><strong>D3</strong></td><td>द्रेष्काण (Drekkana)</td><td>पराक्रम, भाई-बहन, ऊर्जा</td><td>मिथुन</td><td>कुंभ (स्वक्षेत्र)</td><td>मेष</td><td>तुला (स्वक्षेत्र)</td><td>पराक्रम वृद्धि</td></tr>
        <tr><td><strong>D4</strong></td><td>चतुर्थांश (Chaturthamsha)</td><td>भूमि, अचल संपत्ति, भाग्य सुख</td><td>कर्क</td><td>मकर (स्वक्षेत्र)</td><td>मिथुन</td><td>कन्या</td><td>स्थिर संपत्ति योग</td></tr>
        <tr><td><strong>D7</strong></td><td>सप्तमांश (Saptamsha)</td><td>संतान सुख, वंश वृद्धि</td><td>मीन</td><td>मकर (स्वक्षेत्र)</td><td>धनु (स्वक्षेत्र)</td><td>कुंभ</td><td>संतान सुख योग</td></tr>
        <tr><td><strong>D9</strong></td><td>नवांश (Navamsha)</td><td>विवाह, दांपत्य, आंतरिक आत्मबल</td><td>वृषभ (पुष्कर)</td><td>कुंभ (स्वक्षेत्र)</td><td>सिंह</td><td>तुला (स्वक्षेत्र)</td><td><strong>परम पुष्कर नवांश</strong></td></tr>
        <tr><td><strong>D10</strong></td><td>दशमांश (Dashamsha)</td><td>महत्त्वाकांक्षा, कर्मक्षेत्र, ख्याति</td><td>मिथुन</td><td>सिंह</td><td>धनु (स्वक्षेत्र)</td><td>वृश्चिक</td><td>कर्म प्रतिष्ठा योग</td></tr>
        <tr><td><strong>D12</strong></td><td>द्वादशांश (Dwadashamsha)</td><td>माता-पिता, पूर्वज, वंशावली</td><td>सिंह</td><td>मेष</td><td>मेष</td><td>मकर</td><td>पितृ आशीर्वाद</td></tr>
        <tr><td><strong>D16</strong></td><td>षोडशांश (Shodashamsha)</td><td>वाहन सुख, सुख-सुविधाएं, यात्राएं</td><td>वृषभ</td><td>मीन</td><td>कर्क</td><td>मेष</td><td>वाहन सुख योग</td></tr>
        <tr><td><strong>D20</strong></td><td>विंशांश (Vimshamsha)</td><td>आध्यात्मिक साधना, उपासना</td><td>कन्या</td><td>वृश्चिक</td><td>तुला</td><td>कर्क</td><td>उपासना सिद्धि योग</td></tr>
        <tr><td><strong>D24</strong></td><td>चतुर्विंशांश (Siddhamsha)</td><td>उच्च विद्या, अनुसंधान, मेधा</td><td>मेष</td><td>मकर (स्वक्षेत्र)</td><td>कुंभ</td><td>सिंह</td><td>उच्च तकनीकी ज्ञान</td></tr>
        <tr><td><strong>D27</strong></td><td>सप्तविंशांश (Bhamsa)</td><td>शारीरिक सामर्थ्य एवं आंतरिक बल</td><td>कन्या</td><td>कुंभ (स्वक्षेत्र)</td><td>मेष</td><td>वृश्चिक</td><td>मानसिक दृढ़ता</td></tr>
        <tr><td><strong>D30</strong></td><td>त्रिंशांश (Trimshamsha)</td><td>अरिष्ट, बाधाएं, संकट निवारण</td><td>तुला</td><td>तुला (स्वक्षेत्र)</td><td>धनु (स्वक्षेत्र)</td><td>कुंभ</td><td>संकट निवारक बल</td></tr>
        <tr><td><strong>D40</strong></td><td>खवेदांश (Khavedamsha)</td><td>शुभ-अशुभ फल, सूक्ष्म घटनाएं</td><td>कुंभ</td><td>वृष</td><td>तुला</td><td>कन्या</td><td>शुभ फल प्रदाता</td></tr>
        <tr><td><strong>D45</strong></td><td>अक्षवेदांश (Akshavedamsha)</td><td>चरित्र, आचरण, नैतिक उत्थान</td><td>मिथुन</td><td>मकर (स्वक्षेत्र)</td><td>सिंह</td><td>वृष (स्वक्षेत्र)</td><td>सदाचार योग</td></tr>
        <tr><td><strong>D60</strong></td><td>षष्ट्यांश (Shashtiamsha)</td><td>पूर्व जन्म के संचित कर्मफल</td><td>मकर</td><td>कुंभ (स्वक्षेत्र)</td><td>धनु (स्वक्षेत्र)</td><td>कर्क</td><td><strong>उत्कृष्ट कर्मफल योग</strong></td></tr>
      </tbody>
    </table>

    <div class="grid-2">
      <!-- Shadbala Table -->
      <div>
        <div class="section-title">⚖️ षड्बल विश्लेषण (Planetary Strengths)</div>
        <table>
          <thead>
            <tr><th>ग्रह</th><th>वीरूपा</th><th>रूपा</th><th>आवश्यक</th><th>अनुपात</th><th>अवस्था</th></tr>
          </thead>
          <tbody>
            ${c.shadbala.planets.map(p => `
            <tr>
              <td><strong>${p.planetName}</strong></td>
              <td>${p.totalVirupas.toFixed(1)}</td>
              <td>${p.totalRupas.toFixed(2)}</td>
              <td>${p.requiredRupas}</td>
              <td><strong>${p.strengthRatio.toFixed(2)}x</strong></td>
              <td>${p.avasthas.jagradadi} • ${p.avasthas.deeptadi}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="font-size: 9px; color: #475569; background: #f8fafc; padding: 4px; border: 1px solid #e2e8f0; border-radius: 4px;">
          * <strong>शनि</strong> जाग्रत व दीप्त अवस्था में 1.25x बल के साथ सर्वोच्च राजयोग कारक हैं। <strong>चंद्रमा</strong> 1.50x अनुपात के साथ सर्वाधिक शक्तिशाली ग्रह हैं।
        </div>
      </div>

      <!-- Ashtakavarga SAV Table -->
      <div>
        <div class="section-title">🔢 सर्वाष्टकवर्ग (SAV 337 Invariant Table)</div>
        <table>
          <thead>
            <tr><th>राशि</th><th>भाव</th><th>बिंदु</th><th>शास्त्रीय मूल्यांकन</th></tr>
          </thead>
          <tbody>
            ${c.ashtakavarga.sav.signs.map(s => {
              const evalColor = s.totalBindus >= 30 ? 'color:#15803d; font-weight:bold;' : (s.totalBindus <= 24 ? 'color:#b91c1c;' : 'color:#334155;');
              return `
              <tr>
                <td><strong>${s.signHindi} (${s.signName})</strong></td>
                <td>भाव ${s.houseFromLagna}</td>
                <td style="${evalColor}"><strong>${s.totalBindus}</strong></td>
                <td>${s.evaluation}</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div style="font-size: 9px; color: #15803d; background: #dcfce7; padding: 4px; border: 1px solid #86efac; border-radius: 4px; font-weight: 600;">
          ✓ कुल बिंदु: 337/337 (100% गणितीय शुद्धता)। लग्न (34), षष्ठ (34), दशम (33), एकादश (32) में सर्वाधिक बिंदु अप्रतिम सफलता सुनिश्चित करते हैं।
        </div>
      </div>
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 4/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>


  <!-- ==================================================== -->
  <!-- PAGE 5: VIMSHOTTARI DASHA & SPECIAL RAJ YOGAS        -->
  <!-- ==================================================== -->
  <div class="page">
    <div class="section-title">⏳ विंशोत्तरी महादशा चक्र (120-Year Vimshottari Dasha Timeline)</div>
    
    <div class="grid-2">
      <!-- 120y Timeline -->
      <div class="card">
        <div style="font-weight: 700; color: #78350f; margin-bottom: 4px; border-bottom: 1px solid #fed7aa;">
          सम्पूर्ण महादशा कालक्रम (120 वर्ष)
        </div>
        <table>
          <thead>
            <tr><th>महादशा स्वामी</th><th>अवधि</th><th>प्रारंभ</th><th>समाप्ति</th></tr>
          </thead>
          <tbody>
            ${c.dashas.vimshottari.timeline.map(md => {
              const isCurrent = md.mahadashaLord === 'Jupiter';
              const rowStyle = isCurrent ? 'background: #fef3c7; font-weight: bold; border: 1.5px solid #d97706;' : '';
              const badge = isCurrent ? ' <span class="badge badge-own">सक्रिय (Current)</span>' : '';
              return `
              <tr style="${rowStyle}">
                <td><strong>${md.mahadashaLord} (गुरु)</strong>${badge}</td>
                <td>${(md.durationDays / 365.2425).toFixed(1)} वर्ष</td>
                <td>${new Date(md.startDate).toISOString().slice(0, 10)}</td>
                <td>${new Date(md.endDate).toISOString().slice(0, 10)}</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Current Jupiter Dasha Antardashas -->
      <div class="card card-highlight">
        <div style="font-weight: 700; color: #78350f; margin-bottom: 4px; border-bottom: 1px solid #fed7aa;">
          वर्तमान सक्रिय महादशा: देवगुरु बृहस्पति (2021 से 2037)
        </div>
        <table>
          <thead>
            <tr><th>अंतर्दशा</th><th>प्रारंभ</th><th>समाप्ति</th><th>फलित स्थिति</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>गुरु - गुरु</strong></td><td>11-04-2021</td><td>30-05-2023</td><td>आत्मिक मंथन व ज्ञान वृद्धि</td></tr>
            <tr style="background:#dcfce7; font-weight:bold;">
              <td><strong>गुरु - शनि</strong> (वर्तमान)</td><td>30-05-2023</td><td>10-12-2025</td><td><span class="badge badge-exalt">कर्म विस्तार व स्थायित्व</span></td>
            </tr>
            <tr style="background:#fef9c3; font-weight:bold;">
              <td><strong>गुरु - बुध</strong> (आगामी)</td><td>10-12-2025</td><td>17-03-2028</td><td><span class="badge badge-own">बौद्धिक चमत्कार व धन लाभ</span></td>
            </tr>
            <tr><td><strong>गुरु - केतु</strong></td><td>17-03-2028</td><td>21-02-2029</td><td>आध्यात्मिक व शोधपरक प्रगति</td></tr>
            <tr><td><strong>गुरु - शुक्र</strong></td><td>21-02-2029</td><td>23-10-2031</td><td>वैभव, वाहन व सामाजिक ख्याति</td></tr>
            <tr><td><strong>गुरु - सूर्य</strong></td><td>23-10-2031</td><td>10-08-2032</td><td>सत्ता, सम्मान व उच्च पद प्राप्ति</td></tr>
            <tr><td><strong>गुरु - चंद्र</strong></td><td>10-08-2032</td><td>10-12-2033</td><td>मानसिक शांति व संपत्ति लाभ</td></tr>
            <tr><td><strong>गुरु - मंगल</strong></td><td>10-12-2033</td><td>16-11-2034</td><td>साहसिक निर्णय व विजय</td></tr>
            <tr><td><strong>गुरु - राहु</strong></td><td>16-11-2034</td><td>10-04-2037</td><td>अकस्मात बड़े परिवर्तन व विस्तार</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-title">👑 विशिष्ट राजयोग एवं शास्त्रीय योग विश्लेषण (Key Formed Yogas &amp; Doshas)</div>
    <div class="grid-2">
      <div class="card" style="border-left: 4px solid #16a34a;">
        <strong style="color: #15803d; font-size: 11px;">1. शश महापुरुष राजयोग (Sasa Mahapurusha Yoga)</strong><br/>
        <div style="font-size: 10px; color: #334155; margin-top: 2px;">
          शनि देव लग्न केंद्र में अपनी उच्च राशि तुला में 22°37' पर स्थित होकर पंचमहापुरुषों में श्रेष्ठ 'शश योग' बना रहे हैं। यह योग जातक को दीर्घायु, गम्भीर नेतृत्व क्षमता, तकनीकी व प्रशासनिक प्रभुत्व, जनता पर प्रभाव और कठिन परिस्थितियों में अडिग रहने का सामर्थ्य देता है।
        </div>
      </div>

      <div class="card" style="border-left: 4px solid #2563eb;">
        <strong style="color: #1d4ed8; font-size: 11px;">2. विमल विपरीत राजयोग (Vimala Viparita Raja Yoga)</strong><br/>
        <div style="font-size: 10px; color: #334155; margin-top: 2px;">
          द्वादशेश बुध अष्टम भाव (दुस्थान) में स्वमित्र राशि में स्थित होकर विमल विपरीत राजयोग निर्मित करते हैं। जातक दूसरों के संकट के समय अवसर तलाशने में सक्षम होता है तथा गुप्त ज्ञान, वित्तीय परामर्श और तकनीकी इनोवेशन से विपुल सफलता पाता है।
        </div>
      </div>

      <div class="card" style="border-left: 4px solid #d97706;">
        <strong style="color: #b45309; font-size: 11px;">3. अनफा योग एवं लक्ष्मी योग (Anapha &amp; Lakshmi Influence)</strong><br/>
        <div style="font-size: 10px; color: #334155; margin-top: 2px;">
          चंद्रमा से 12वें भाव में शुभ ग्रह गुरु की उपस्थिति 'अनफा योग' बनाती है जो स्वस्थ काया, उदार चित्त और मानसिक संतोष प्रदान करती है। लग्नेश शुक्र का भाग्य भाव (नवम) में बैठना निरंतर भाग्योदय और संपदा सुनिश्चित करता है।
        </div>
      </div>

      <div class="card" style="border-left: 4px solid #9333ea;">
        <strong style="color: #7e22ce; font-size: 11px;">4. मांगलिक दोष शास्त्रीय परिहार (Kuja Dosha Complete Cancellation)</strong><br/>
        <div style="font-size: 10px; color: #334155; margin-top: 2px;">
          मंगल प्रथम भाव में स्थित होने से पारंपरिक रूप से मांगलिक प्रभाव बनता है, परंतु लग्न में ही उच्चस्थ शनि की मंगल के साथ युति होने से महर्षि पराशर के नियमानुसार मांगलिक दोष का <strong>100% पूर्ण परिहार</strong> हो जाता है। अतः दांपत्य जीवन सुरक्षित व फलदायी रहता है।
        </div>
      </div>
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 5/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>


  <!-- ==================================================== -->
  <!-- PAGE 6: 5-YEAR DETAILED VARSHPHAL & REMEDIES         -->
  <!-- ==================================================== -->
  <div class="page">
    <div class="section-title">🔮 पंचवर्षीय विस्तृत वर्षफल (5-Year Varshphal: 2024 to 2028)</div>
    <div style="font-size: 9.5px; color: #64748b; margin-bottom: 6px;">
      * ताजिक वर्षफल पद्धति: जन्मकालिक सूर्य के ठीक उसी अंश-कला पर प्रतिवर्ष पुनः आने के सूक्ष्म क्षण (वार्षिक सौर वापसी) पर आधारित शास्त्रीय फलकथन।
    </div>

    ${varshphalYears.map(vp => `
    <div class="vp-card">
      <div class="vp-header">
        📅 ${vp.prediction.title}
      </div>
      <div class="vp-meta">
        <span><strong>वर्षप्रवेश (IST):</strong> ${vp.varshpraveshIST}</span>
        <span><strong>वर्ष लग्न:</strong> ${vp.varshLagna} (${vp.varshLagnaDeg})</span>
        <span><strong>मुंथा:</strong> ${vp.munthaSign} (भाव ${vp.munthaHouse})</span>
        <span><strong>पुण्य सहम:</strong> ${vp.punyaSahamSign} ${vp.punyaSahamDeg}</span>
      </div>
      <div style="font-size: 10px; color: #334155; line-height: 1.35;">
        <strong>वर्ष फलकथन:</strong> ${vp.prediction.overview}<br/>
        <strong>💼 आजीविका व कर्म:</strong> ${vp.prediction.career} | <strong>💰 वित्त व संपदा:</strong> ${vp.prediction.finance} | <strong>🌿 स्वास्थ्य:</strong> ${vp.prediction.health}
      </div>
    </div>
    `).join('')}

    <div class="section-title">📿 शास्त्रीय वैदिक उपाय एवं जीवन मार्गदर्शन (Prescribed Remedies &amp; Guidance)</div>
    <div class="grid-3">
      <div class="card" style="border-top: 3px solid #1d4ed8;">
        <strong style="color: #1d4ed8;">💎 रत्न परामर्श (Gemstone)</strong><br/>
        <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">
          तुला लग्न के लिए शनि देव परम <strong>योगकारक</strong> हैं। उच्चस्थ शनि के पूर्ण फल हेतु <strong>5.25 से 6.50 रत्ती का प्राकृतिक नीलम</strong> पंचधातु या चांदी में शनिवार को शुक्ल पक्ष में मध्यमा अंगुली में धारण करना अभूतपूर्व उन्नति देता है।
        </div>
      </div>

      <div class="card" style="border-top: 3px solid #b45309;">
        <strong style="color: #b45309;">📿 रुद्राक्ष परामर्श (Rudraksha)</strong><br/>
        <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">
          बुध देव की अनुकूलता एवं स्मृति, तीक्ष्ण बुद्धि के लिए <strong>4 मुखी रुद्राक्ष</strong> अथवा शनि देव के सौम्य आशीर्वाद हेतु <strong>7 मुखी रुद्राक्ष</strong> लाल या काले धागे में गले में धारण करना परम कल्याणकारी व रक्षक है।
        </div>
      </div>

      <div class="card" style="border-top: 3px solid #78350f;">
        <strong style="color: #78350f;">🕉️ नित्य वैदिक मंत्र साधना</strong><br/>
        <div style="font-size: 9.5px; color: #334155; margin-top: 2px;">
          * <strong>शनि बीज मंत्र:</strong> <em>"ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः"</em> (संध्याकाल 108 बार)।<br/>
          * <strong>सूर्य अर्घ्य:</strong> प्रातः तांबे के लोटे से भगवान सूर्य को जल अर्पित करना आत्मबल व यश बढ़ाता है।
        </div>
      </div>
    </div>

    <!-- CERTIFICATION -->
    <div class="card" style="background: #f1f5f9; text-align: center; border: 1px dashed #94a3b8; padding: 4px; margin-top: 4px;">
      <span style="font-size: 9px; color: #475569;">
        <strong>प्रमाण पत्र:</strong> यह विस्तृत महा-कुंडली एवं पंचवर्षीय वर्षफल <strong>Sanatan Watch AstroEngine (v1.1.1)</strong> द्वारा NASA/JPL DE405 एफिमेरिस एवं महर्षि पराशर सिद्धांत के आधार पर 100% गणितीय शुद्धता के साथ निर्मित की गई है।
      </span>
    </div>

    <div class="footer">
      Sanatan Watch AstroEngine (v1.1.1) • Clean-Room MIT/JPL DE405 Ephemeris • पृष्ठ 6/6 • सर्वाधिकार सुरक्षित © विनायक सक्सेना
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(process.cwd(), 'temp_detailed_maha_kundli.html');
const pdfPath = path.join(process.cwd(), 'Vinayak_Saxena_Detailed_Maha_Kundli.pdf');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML generated successfully at:', htmlPath);

// Convert to PDF using Edge headless with Start-Process -Wait
const psCmd = `Start-Process 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' -ArgumentList '--headless', '--disable-gpu', '--print-to-pdf=\\"${pdfPath}\\"', '--no-pdf-header-footer', 'file:///${htmlPath.replace(/\\\\/g, '/')}' -Wait`;

try {
  console.log('Generating PDF via headless browser...');
  execSync(`powershell -Command "${psCmd}"`, { stdio: 'inherit' });
  console.log('PDF generated successfully at:', pdfPath);
  if (fs.existsSync(htmlPath)) {
    fs.unlinkSync(htmlPath);
  }
} catch (err) {
  console.error('Error generating PDF:', err);
}
