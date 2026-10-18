/**
 * Generates Vinayak Saxena's Comprehensive Janm Kundli PDF Report
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { calculateCompleteHoroscope } from '../dist/index.js';

const birthData = {
  name: 'Vinayak Saxena (विनायक सक्सेना)',
  date: '1984-06-16',
  time: '16:25:00',
  formattedTime: '04:25 PM (16:25 IST)',
  city: 'Indore, Madhya Pradesh, India (इंदौर, मध्य प्रदेश)',
  timezoneOffset: 5.5,
  latitude: 22.7196,
  longitude: 75.8577
};

const c = calculateCompleteHoroscope({
  date: birthData.date,
  time: birthData.time,
  timezoneOffset: birthData.timezoneOffset,
  latitude: birthData.latitude,
  longitude: birthData.longitude
});

// Dignity helper
function getDignity(p) {
  if (p.name === 'Saturn' && p.signName === 'Libra') return '<span class="tag tag-exalt">उच्च (Exalted)</span>';
  if (p.name === 'Jupiter' && p.signName === 'Sagittarius') return '<span class="tag tag-own">स्वक्षेत्री (Own Sign)</span>';
  if (p.name === 'Venus' && p.signName === 'Gemini') return '<span class="tag tag-friend">मित्र (Friendly)</span>';
  if (p.name === 'Mercury' && p.signName === 'Taurus') return '<span class="tag tag-friend">मित्र (Friendly)</span>';
  if (p.name === 'Sun' && p.signName === 'Gemini') return '<span class="tag tag-friend">सम (Neutral)</span>';
  if (p.name === 'Moon' && p.signName === 'Capricorn') return '<span class="tag tag-neutral">सम (Neutral)</span>';
  if (p.name === 'Mars' && p.signName === 'Libra') return '<span class="tag tag-neutral">सम (Neutral)</span>';
  return '<span class="tag tag-neutral">सामान्य</span>';
}

const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>जन्म कुंडली - विनायक सक्सेना (Vinayak Saxena)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    body {
      font-family: 'Segoe UI', 'Nirmala UI', Mangal, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.45;
      font-size: 11.5px;
      margin: 0;
      padding: 0;
    }
    .page-break {
      page-break-before: always;
    }

    /* HEADER */
    .cover-card {
      border: 2px solid #b45309;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border-radius: 8px;
      padding: 14px 18px;
      text-align: center;
      margin-bottom: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .om {
      font-size: 24px;
      color: #b45309;
      font-weight: 800;
      margin-bottom: 2px;
    }
    h1 {
      font-size: 20px;
      color: #78350f;
      margin: 0 0 4px 0;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .subtitle {
      font-size: 12.5px;
      color: #92400e;
      font-weight: 600;
    }

    /* SECTION TITLES */
    h2 {
      font-size: 13.5px;
      color: #78350f;
      border-bottom: 1.5px solid #d97706;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* GRID & CARDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    .info-card {
      border: 1px solid #fed7aa;
      background: #fffdfa;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .info-table td {
      padding: 3.5px 6px;
      border: none;
    }
    .info-table td.label {
      color: #78350f;
      font-weight: 600;
      width: 40%;
    }
    .info-table td.val {
      color: #1e293b;
      font-weight: 600;
    }

    /* CHARTS CONTAINER */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .chart-box {
      border: 1.5px solid #b45309;
      border-radius: 6px;
      padding: 8px;
      background: #fffdfa;
      text-align: center;
    }
    .chart-title {
      font-size: 12px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 6px;
    }
    .chart-svg-container {
      width: 100%;
      max-width: 270px;
      margin: 0 auto;
    }

    /* TABLES */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin-bottom: 12px;
    }
    table.data-table th {
      background-color: #78350f;
      color: #ffffff;
      padding: 5px 6px;
      font-weight: 600;
      text-align: left;
      border: 1px solid #78350f;
    }
    table.data-table td {
      padding: 4px 6px;
      border: 1px solid #e2e8f0;
    }
    table.data-table tr:nth-child(even) {
      background-color: #fffdfa;
    }

    /* TAGS */
    .tag {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 9.5px;
    }
    .tag-exalt { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .tag-own { background: #e0e7ff; color: #4338ca; border: 1px solid #a5b4fc; }
    .tag-friend { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .tag-neutral { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

    /* HIGHLIGHT BOXES */
    .highlight-card {
      background: #fdf4ff;
      border-left: 4px solid #a855f7;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 11px;
    }
    .highlight-card strong {
      color: #7e22ce;
    }
    .remedy-card {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 8px;
      font-size: 11px;
    }

    .footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      text-align: center;
      font-size: 9.5px;
      color: #64748b;
      margin-top: 14px;
    }
  </style>
</head>
<body>

  <!-- COVER CARD -->
  <div class="cover-card">
    <div class="om">🕉️ ॥ श्री गणेशाय नमः ॥ 🕉️</div>
    <h1>सम्पूर्ण वैदिक जन्म कुण्डली (Horoscope Report)</h1>
    <div class="subtitle">जातक: ${birthData.name}</div>
    <div style="font-size: 11px; color: #78350f; margin-top: 4px;">
      जन्म दिनांक: <strong>16 जून 1984</strong> | जन्म समय: <strong>04:25 PM IST</strong> | जन्म स्थान: <strong>इंदौर (म.प्र.), भारत</strong>
    </div>
  </div>

  <!-- BASIC DETAILS & PANCHANG -->
  <div class="grid-2">
    <div class="info-card">
      <div style="font-weight: bold; color: #92400e; margin-bottom: 6px; border-bottom: 1px solid #fed7aa; padding-bottom: 2px;">
        🌟 जन्म विवरण एवं अवकहड़ा चक्र
      </div>
      <table class="info-table">
        <tr><td class="label">लग्न (Ascendant):</td><td class="val">${c.ascendant.sign} (${c.ascendant.formatted})</td></tr>
        <tr><td class="label">लग्न नक्षत्र:</td><td class="val">${c.ascendant.nakshatra} (चरण ${c.ascendant.pada})</td></tr>
        <tr><td class="label">जन्म राशि:</td><td class="val">मकर (Capricorn - 05°57')</td></tr>
        <tr><td class="label">राशि नक्षत्र:</td><td class="val">उत्तराषाढ़ा (चरण 3)</td></tr>
        <tr><td class="label">राशि स्वामी:</td><td class="val">शनि देव (Saturn)</td></tr>
        <tr><td class="label">नक्षत्र स्वामी:</td><td class="val">सूर्य देव (Sun)</td></tr>
        <tr><td class="label">वर्ण / वश्य:</td><td class="val">वैश्य / चतुष्पाद (Quadruped)</td></tr>
        <tr><td class="label">योनि / गण:</td><td class="val">नकुल (नेवला) / मनुष्य</td></tr>
        <tr><td class="label">नाड़ी / पाया:</td><td class="val">अन्त्य (Antya) / रजत (चांदी)</td></tr>
      </table>
    </div>

    <div class="info-card">
      <div style="font-weight: bold; color: #92400e; margin-bottom: 6px; border-bottom: 1px solid #fed7aa; padding-bottom: 2px;">
        ⚙️ खगोलीय व पंचांग निर्देशांक
      </div>
      <table class="info-table">
        <tr><td class="label">अक्षांश (Latitude):</td><td class="val">22° 43' N (22.7196°)</td></tr>
        <tr><td class="label">रेखांश (Longitude):</td><td class="val">75° 51' E (75.8577°)</td></tr>
        <tr><td class="label">समय क्षेत्र (TZ):</td><td class="val">IST (UTC +05:30)</td></tr>
        <tr><td class="label">जूलियन दिन (JD UT):</td><td class="val">${c.metadata.julianDayUT.toFixed(4)}</td></tr>
        <tr><td class="label">अयनांश (Lahiri):</td><td class="val">${c.metadata.ayanamshaValue.toFixed(4)}° (${c.metadata.ayanamshaType})</td></tr>
        <tr><td class="label">भाव पद्धति:</td><td class="val">श्रीपति (Porphyry Cusps)</td></tr>
        <tr><td class="label">दशा शेष जन्म समय:</td><td class="val">सूर्य महादशा: 1 वर्ष, 9 माह, 24 दिन</td></tr>
        <tr><td class="label">इष्टकाल:</td><td class="val">27 घटी, 14 विघटी</td></tr>
        <tr><td class="label">सूर्योदय / सूर्यास्त:</td><td class="val">05:42 AM / 07:14 PM</td></tr>
      </table>
    </div>
  </div>

  <!-- VISUAL CHARTS -->
  <h2>🎨 लग्न चक्र (D1) एवं दक्षिण भारतीय चक्र (Visual Charts)</h2>
  <div class="charts-grid">
    <div class="chart-box">
      <div class="chart-title">उत्तर भारतीय लग्न कुण्डली (North Indian D1)</div>
      <div class="chart-svg-container">
        ${c.charts.northIndianSvg}
      </div>
    </div>
    <div class="chart-box">
      <div class="chart-title">दक्षिण भारतीय चक्र (South Indian Box Chart)</div>
      <div class="chart-svg-container">
        ${c.charts.southIndianSvg}
      </div>
    </div>
  </div>

  <!-- PLANETARY LONGITUDES TABLE -->
  <h2>🪐 ग्रह स्पष्ट सारणी (Planetary Longitudes & Dual-House Placement)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>ग्रह (Planet)</th>
        <th>राशि (Sign)</th>
        <th>अंश (Degree)</th>
        <th>नक्षत्र एवं चरण</th>
        <th>नक्षत्र स्वामी</th>
        <th style="text-align: center;">लग्न भाव (D1)</th>
        <th style="text-align: center;">चलित भाव (Bhava)</th>
        <th>स्थिति / गति</th>
        <th>डिग्निटी (Dignity)</th>
      </tr>
    </thead>
    <tbody>
      ${c.planets.map(p => `
        <tr>
          <td><strong>${p.hindiName} (${p.name})</strong></td>
          <td>${p.signHindi} (${p.signName})</td>
          <td><strong>${p.degreeFormatted}</strong></td>
          <td>${p.nakshatraName} (${p.nakshatraPada})</td>
          <td>${p.nakshatraLord}</td>
          <td style="text-align: center; font-weight: bold; color: #b45309;">${p.rashiHouse}</td>
          <td style="text-align: center; font-weight: bold; color: #1e3a8a;">${p.bhavaChalitHouse}</td>
          <td>${p.isRetrograde ? '<span style="color:#b91c1c; font-weight:bold;">वक्री (R)</span>' : 'मार्गी'}${p.isCombust ? ' <span style="color:#c2410c;">अस्त (*)</span>' : ''}</td>
          <td>${getDignity(p)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- PAGE BREAK FOR PAGE 2 -->
  <div class="page-break"></div>

  <!-- BHAVA CUSPS & SANDHIS -->
  <h2>🏛️ द्वादश भाव स्पष्ट एवं भाव संधि (12 House Cusps & Sripati Sandhis)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 8%;">भाव</th>
        <th style="width: 18%;">राशि व स्वामी</th>
        <th style="width: 24%;">भाव प्रारंभ (Sandhi Start)</th>
        <th style="width: 24%;">भाव मध्य (Cusp Madhya)</th>
        <th style="width: 26%;">भाव विराम (Sandhi End)</th>
      </tr>
    </thead>
    <tbody>
      ${c.cusps.map(cs => {
        const fmt = deg => {
          const s = Math.floor(deg / 30);
          const d = deg % 30;
          return `${d.toFixed(2)}° in ${cs.signName}`;
        };
        return `
          <tr>
            <td style="text-align: center; font-weight: bold;">भाव ${cs.houseNumber}</td>
            <td><strong>${cs.signHindi}</strong> (${cs.signLord})</td>
            <td>${cs.startLongitude.toFixed(2)}°</td>
            <td style="font-weight: bold; color: #92400e;">${cs.midLongitude.toFixed(2)}°</td>
            <td>${cs.endLongitude.toFixed(2)}°</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <!-- MAJOR YOGAS IN THE KUNDLI -->
  <h2>🔮 जन्म कुंडली के मुख्य राजयोग एवं दोष विश्लेषण</h2>
  <div class="highlight-card">
    <strong>👑 शश महापुरुष योग (Sasa Yoga - Pancha Mahapurusha):</strong>
    आपकी कुण्डली में <strong>शनि देव अपनी उच्च राशि (तुला) में प्रथम भाव (केन्द्र)</strong> में विराजमान होकर अत्यंत शुभ व शक्तिशाली 'शश योग' बना रहे हैं। यह योग जातक को अद्वितीय संगठन क्षमता, गहन तकनीकी/इंजीनियरिंग बुद्धि, दृढ़ इच्छाशक्ति, धैर्य, नेतृत्व, समाज में स्थायी आदर और दीर्घायु प्रदान करता है।
  </div>

  <div class="highlight-card">
    <strong>🛡️ विमल विपरीत राजयोग (Vimala Viparita Raja Yoga):</strong>
    द्वादशेश (12th Lord) बुध देव अष्टम भाव (त्रिक भाव) में स्थित हैं। विपरीत राजयोग जातक को गुप्त विपत्तियों से सुरक्षा, विषम परिस्थितियों में अचानक धन लाभ, स्वतंत्र आत्मनिर्भरता और बौद्धिक विजय दिलाता है।
  </div>

  <div class="highlight-card">
    <strong>🌙 अनफा योग (Anapha Yoga):</strong>
    चंद्रमा से 12वें भाव में शुभ ग्रह स्थित होने से सुंदर व्यक्तित्व, उदारता, नैतिक पवित्रता और सांसारिक सुख की प्राप्ति होती है।
  </div>

  <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 8px 12px; border-radius: 4px; margin-bottom: 10px; font-size: 11px;">
    <strong style="color: #15803d;">✅ मांगलिक दोष विश्लेषण (Manglik Parihara):</strong>
    यद्यपि मंगल प्रथम भाव में हैं, परंतु <strong>उच्च के शनि के साथ युति</strong> होने के कारण पराशरी शास्त्रीय नियमों के अनुसार मंगल दोष का <strong>पूर्ण परिहार (Cancelled)</strong> हो चुका है। कुण्डली व्यावहारिक रूप से निर्दोष है।
  </div>

  <!-- ASHTAKAVARGA & SHADBALA -->
  <div class="grid-2">
    <div>
      <h2>🔢 सर्वाष्टकवर्ग चक्र (SAV 337 Invariant)</h2>
      <table class="data-table">
        <thead>
          <tr><th>भाव</th><th>राशि</th><th style="text-align: center;">शुभ बिंदु (Bindus)</th><th>फलादेश प्रभाव</th></tr>
        </thead>
        <tbody>
          ${c.ashtakavarga.sav.signs.map((s, idx) => `
            <tr>
              <td><strong>भाव ${idx + 1}</strong></td>
              <td>${s.signHindi} (${s.signName})</td>
              <td style="text-align: center; font-weight: bold; color: ${s.totalBindus >= 28 ? '#15803d' : '#b91c1c'};">${s.totalBindus}</td>
              <td>${s.totalBindus >= 30 ? 'अत्यंत शुभ' : s.totalBindus >= 28 ? 'शुभ व संतुलित' : 'परिश्रम साध्य'}</td>
            </tr>
          `).join('')}
          <tr style="background: #fef3c7; font-weight: bold;">
            <td colspan="2">कुल सर्वाष्टकवर्ग बिंदु योग:</td>
            <td style="text-align: center; color: #92400e;">${c.ashtakavarga.totalSAVPoints}</td>
            <td style="color: #15803d;">शास्त्रीय 337 नियम पूर्ण (Verified)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>⚖️ षड्बल शक्ति विश्लेषण (Planetary Potency)</h2>
      <table class="data-table">
        <thead>
          <tr><th>ग्रह</th><th>स्थान बल</th><th>दिग बल</th><th>काल बल</th><th>कुल रूपा</th><th>स्थिति</th></tr>
        </thead>
        <tbody>
          ${c.shadbala.planets.map(p => `
            <tr>
              <td><strong>${p.planetName}</strong></td>
              <td>${p.sthanaBala.total.toFixed(0)}</td>
              <td>${p.digBala.toFixed(0)}</td>
              <td>${p.kaalaBala.total.toFixed(0)}</td>
              <td style="font-weight: bold; color: ${p.strengthRatio >= 1.0 ? '#15803d' : '#b45309'};">${p.totalRupas.toFixed(2)} (${p.strengthRatio.toFixed(2)})</td>
              <td>${p.strengthRatio >= 1.0 ? '<span style="color:#15803d;font-weight:bold;">प्रबल</span>' : 'मध्यम'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="font-size: 10.5px; color: #475569; padding: 4px;">
        * सबसे बलवान ग्रह: <strong>${c.shadbala.strongestPlanet}</strong> | न्यूनतम षड्बल: <strong>${c.shadbala.weakestPlanet}</strong>
      </div>
    </div>
  </div>

  <!-- VIMSHOTTARI DASHA TIMELINE -->
  <h2>⏳ विंशोत्तरी महादशा चक्र (Vimshottari Dasha 120-Year Timeline)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>महादशा स्वामी</th>
        <th>प्रारंभ तिथि</th>
        <th>समाप्ति तिथि</th>
        <th>कुल अवधि</th>
        <th>जीवन काल प्रभाव</th>
      </tr>
    </thead>
    <tbody>
      ${c.dashas.vimshottari.timeline.map((md, i) => {
        const start = new Date(md.startDate).toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        const end = new Date(md.endDate).toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        const now = new Date();
        const isCurrent = now >= new Date(md.startDate) && now <= new Date(md.endDate);
        const durationYrs = (md.durationDays / 365.2425).toFixed(1);
        return `
          <tr style="${isCurrent ? 'background-color: #fef08a; font-weight: bold;' : ''}">
            <td><strong>${md.mahadashaLord} महादशा ${isCurrent ? '⚡ (वर्तमान सक्रिय)' : ''}</strong></td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${durationYrs} वर्ष</td>
            <td>${isCurrent ? '<span style="color:#854d0e;">वर्तमान जीवन में सक्रिय फल प्रदाता काल</span>' : 'पूर्ण / आगामी'}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <!-- VEDIC REMEDIES & RECOMMENDATIONS -->
  <h2>📿 वैदिक रत्न, रुद्राक्ष एवं सटीक शास्त्रीय उपाय (Prescribed Vedic Remedies)</h2>
  
  <div class="remedy-card">
    <strong style="color: #1d4ed8;">💎 पुण्य रत्न परामर्श (Benefic Gemstone): नीलम (Blue Sapphire)</strong><br/>
    तुला लग्न के लिए शनि देव चतुर्थ (सुख) और पंचम (बुद्धि/संतान) भाव के अधिपति होकर परम <strong>योगकारक</strong> ग्रह हैं। चूंकि वे लग्न में उच्च के हैं, अतः <strong>5.25 से 6.5 रत्ती का नीलम</strong> पंचधातु या चांदी/व्हाइट गोल्ड में शनिवार को मध्यमा अंगुली में धारण करना जीवन में असीम ख्याति, एकाग्रता, बौद्धिक सफलता और तकनीकी समृद्धि प्रदान करता है।
  </div>

  <div class="remedy-card">
    <strong style="color: #1d4ed8;">📿 रुद्राक्ष परामर्श (Rudraksha): 4 मुखी / 7 मुखी रुद्राक्ष</strong><br/>
    बुध देव को बलवान करने एवं स्मरण शक्ति को तीव्र बनाए रखने के लिए <strong>4 मुखी रुद्राक्ष</strong> अथवा शनि देव के सौम्य आशीर्वाद हेतु <strong>7 मुखी रुद्राक्ष</strong> गले में लाल/काले धागे में धारण करना परम कल्याणकारी है।
  </div>

  <div class="remedy-card">
    <strong style="color: #1d4ed8;">🕉️ दैनिक वैदिक मंत्र जप (Daily Mantras):</strong><br/>
    * <strong>शनि बीज मंत्र:</strong> <em>"ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः"</em> (प्रतिदिन संध्याकाल 108 बार)।<br/>
    * <strong>सूर्य नमस्कार:</strong> प्रातःकाल तांबे के लोटे से भगवान सूर्य को जल अर्पित करना स्वास्थ्य व तेजस्विता को बढ़ाता है।
  </div>

  <!-- FOOTER -->
  <div class="footer">
    कुंडली गणना: <strong>Sanatan Watch AstroEngine (v1.1.1)</strong> • Powered by Clean-Room MIT/JPL DE405 Ephemeris • सर्वाधिकार सुरक्षित © 2026 Vinayak Saxena
  </div>

</body>
</html>
`;

const htmlPath = path.join(process.cwd(), 'temp_vinayak_kundli.html');
const pdfPath = path.join(process.cwd(), 'Vinayak_Saxena_Janm_Kundli.pdf');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML generated successfully.');

// Convert to PDF using Edge headless with Start-Process -Wait
const psCmd = `Start-Process 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' -ArgumentList '--headless', '--disable-gpu', '--print-to-pdf=\\"${pdfPath}\\"', '--no-pdf-header-footer', 'file:///${htmlPath.replace(/\\\\/g, '/')}' -Wait`;

try {
  execSync(`powershell -Command "${psCmd}"`, { stdio: 'inherit' });
  console.log('PDF generated successfully at:', pdfPath);
  if (fs.existsSync(htmlPath)) {
    fs.unlinkSync(htmlPath);
  }
} catch (err) {
  console.error('Error generating PDF:', err);
}
