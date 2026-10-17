/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { astronomicalEngine } from './astronomicalEngine';
export const SIGN_MAP = {
    'Aries': 'मेष',
    'Taurus': 'वृषभ',
    'Gemini': 'मिथुन',
    'Cancer': 'कर्क',
    'Leo': 'सिंह',
    'Virgo': 'कन्या',
    'Libra': 'तुला',
    'Scorpio': 'वृश्चिक',
    'Sagittarius': 'धनु',
    'Capricorn': 'मकर',
    'Aquarius': 'कुम्भ',
    'Pisces': 'मीन'
};
export const PLANET_MAP = {
    'Sun': 'सूर्य',
    'Mars': 'मंगल',
    'Mercury': 'बुध',
    'Jupiter': 'गुरु',
    'Venus': 'शुक्र',
    'Saturn': 'शनि',
    'Rahu': 'राहु',
    'Ketu': 'केतु'
};
// Generic predictive texts for planet entering different signs
export const TRANSIT_PREDICTIONS = {
    'Sun': {
        'Aries': {
            en: 'Sun exalted. High energy, authority, leadership growth, and career success.',
            hi: 'सूर्य उच्च राशि में। उच्च ऊर्जा, अधिकार, नेतृत्व विकास और करियर में सफलता।',
            type: 'auspicious'
        },
        'Taurus': {
            en: 'Focus shifts to wealth accumulation, family matters, and stable financial planning.',
            hi: 'ध्यान धन संचय, पारिवारिक मामलों और स्थिर वित्तीय योजना पर केंद्रित होता है।',
            type: 'neutral'
        },
        'Gemini': {
            en: 'Favorable for communication, intellectual work, learning, and short travels.',
            hi: 'संचार, बौद्धिक कार्य, सीखने और छोटी यात्राओं के लिए अनुकूल समय।',
            type: 'auspicious'
        },
        'Cancer': {
            en: 'Dakshinayana begins. Focus on home, emotional peace, and mother\'s health.',
            hi: 'दक्षिणायण प्रारंभ। घर, भावनात्मक शांति और माता के स्वास्थ्य पर ध्यान दें।',
            type: 'neutral'
        },
        'Leo': {
            en: 'Sun in own sign. High self-confidence, power, and government-related gains.',
            hi: 'सूर्य स्वराशि में। उच्च आत्मविश्वास, शक्ति और सरकारी कार्यों में लाभ।',
            type: 'auspicious'
        },
        'Virgo': {
            en: 'Emphasis on analysis, detail-oriented work, service, and health improvement.',
            hi: 'विश्लेषण, विवरण-उन्मुख कार्य, सेवा और स्वास्थ्य सुधार पर जोर।',
            type: 'neutral'
        },
        'Libra': {
            en: 'Sun debilitated. Health caution is advised, avoid conflicts with authorities.',
            hi: 'सूर्य नीच राशि में। स्वास्थ्य का ध्यान रखें, वरिष्ठों या अधिकारियों के साथ विवाद से बचें।',
            type: 'inauspicious'
        },
        'Scorpio': {
            en: 'Deep transformation, interest in occult sciences, and intense research activities.',
            hi: 'गहन परिवर्तन, गुप्त विज्ञानों में रुचि और गहन शोध गतिविधियों का समय।',
            type: 'neutral'
        },
        'Sagittarius': {
            en: 'Spiritual inclination, focus on higher education, and guidance from mentors.',
            hi: 'आध्यात्मिक झुकाव, उच्च शिक्षा पर ध्यान और गुरुओं का मार्गदर्शन मिलेगा।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Makar Sankranti. Uttarayana starts. Progress in professional life through hard work.',
            hi: 'मकर संक्रांति। उत्तरायण प्रारंभ। कड़ी मेहनत से व्यावसायिक जीवन में प्रगति।',
            type: 'auspicious'
        },
        'Aquarius': {
            en: 'Social circles expand. Gains from elder siblings, focus on community welfare.',
            hi: 'सामाजिक दायरा बढ़ेगा। बड़े भाई-बहनों से लाभ और सामुदायिक कल्याण पर ध्यान।',
            type: 'neutral'
        },
        'Pisces': {
            en: 'Introspection, charity focus, foreign associations, and spiritual meditation.',
            hi: 'आत्मनिरीक्षण, दान पर ध्यान, विदेशी संपर्क और आध्यात्मिक ध्यान।',
            type: 'auspicious'
        }
    },
    'Mars': {
        'Aries': {
            en: 'Mars in own sign. Courage, physical vitality, leadership, and technical success.',
            hi: 'मंगल स्वराशि में। साहस, शारीरिक जीवन शक्ति, नेतृत्व और तकनीकी कार्यों में सफलता।',
            type: 'auspicious'
        },
        'Taurus': {
            en: 'Watch your speech. Expenditure might increase, focus on savings.',
            hi: 'वाणी पर नियंत्रण रखें। खर्च बढ़ सकता है, बचत पर ध्यान दें।',
            type: 'neutral'
        },
        'Gemini': {
            en: 'Sharp intellect, debate skills, but potential conflicts with siblings.',
            hi: 'तीव्र बुद्धि, वाद-विवाद कौशल, लेकिन भाई-बहनों के साथ संभावित मतभेद।',
            type: 'neutral'
        },
        'Cancer': {
            en: 'Mars debilitated. Control anger, take care of health and property disputes.',
            hi: 'मंगल नीच राशि में। क्रोध पर नियंत्रण रखें, स्वास्थ्य और संपत्ति विवादों से बचें।',
            type: 'inauspicious'
        },
        'Leo': {
            en: 'Excellent courage, dominance, administrative success, and high ambition.',
            hi: 'उत्कृष्ट साहस, वर्चस्व, प्रशासनिक सफलता और उच्च महत्वाकांक्षा।',
            type: 'auspicious'
        },
        'Virgo': {
            en: 'High analytical energy, victory over competitors, but control stress.',
            hi: 'उच्च विश्लेषणात्मक ऊर्जा, विरोधियों पर विजय, लेकिन तनाव पर नियंत्रण रखें।',
            type: 'neutral'
        },
        'Libra': {
            en: 'Focus on relationship balance, avoid impulsive financial partnerships.',
            hi: 'रिश्तों में संतुलन पर ध्यान दें, जल्दबाजी में वित्तीय साझेदारी से बचें।',
            type: 'neutral'
        },
        'Scorpio': {
            en: 'Mars in own sign. Intense willpower, deep research capabilities, occult interest.',
            hi: 'मंगल स्वराशि में। तीव्र इच्छाशक्ति, गहन शोध क्षमता और गुप्त विद्याओं में रुचि।',
            type: 'auspicious'
        },
        'Sagittarius': {
            en: 'Religious actions, travel for adventure, righteousness, and academic focus.',
            hi: 'धार्मिक कार्य, साहसिक यात्राएं, धार्मिकता और शैक्षणिक कार्यों पर ध्यान।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Mars exalted. Supreme energy, victory over enemies, professional rise, power.',
            hi: 'मंगल उच्च राशि में। परम ऊर्जा, शत्रुओं पर विजय, व्यावसायिक उन्नति और सत्ता लाभ।',
            type: 'auspicious'
        },
        'Aquarius': {
            en: 'Work with groups, interest in innovation, gains through collective efforts.',
            hi: 'समूहों के साथ काम करना, नवाचार में रुचि, सामूहिक प्रयासों से लाभ।',
            type: 'neutral'
        },
        'Pisces': {
            en: 'Spiritual actions, active charity, overseas travels, watch emotional energy.',
            hi: 'आध्यात्मिक कार्य, सक्रिय दान, विदेशी यात्राएं, भावनात्मक ऊर्जा का ध्यान रखें।',
            type: 'neutral'
        }
    },
    'Mercury': {
        'Aries': {
            en: 'Quick thinking, fast decisions, expressive speech, interest in novel ideas.',
            hi: 'त्वरित सोच, तेज निर्णय, अभिव्यंजक वाणी, नवीन विचारों में रुचि।',
            type: 'neutral'
        },
        'Taurus': {
            en: 'Sweet speech, artistic communication, stable financial planning, family discussions.',
            hi: 'मधुर वाणी, कलात्मक संचार, स्थिर वित्तीय योजना, पारिवारिक चर्चा।',
            type: 'auspicious'
        },
        'Gemini': {
            en: 'Mercury in own sign. Excellent intelligence, trading skills, and writing success.',
            hi: 'बुध स्वराशि में। उत्कृष्ट बुद्धि, व्यापारिक कौशल और लेखन में सफलता।',
            type: 'auspicious'
        },
        'Cancer': {
            en: 'Emotional communication, focus on home and writing, close family talks.',
            hi: 'भावनात्मक संचार, लेखन और घर पर ध्यान, पारिवारिक बातचीत।',
            type: 'neutral'
        },
        'Leo': {
            en: 'Expressive and authoritative speech, creative presentation, strong intellect.',
            hi: 'अभिव्यंजक और अधिकारपूर्ण वाणी, रचनात्मक प्रस्तुति, मजबूत बुद्धि।',
            type: 'neutral'
        },
        'Virgo': {
            en: 'Mercury exalted. Supreme analytical mind, success in accounts, calculations, logic.',
            hi: 'बुध उच्च राशि में। परम विश्लेषणात्मक मन, खातों, गणनाओं और तर्क में सफलता।',
            type: 'auspicious'
        },
        'Libra': {
            en: 'Diplomatic communication, business negotiation success, balanced view.',
            hi: 'राजनयिक संचार, व्यावसायिक बातचीत में सफलता, संतुलित दृष्टिकोण।',
            type: 'auspicious'
        },
        'Scorpio': {
            en: 'Secrets revealed, deep investigative intellect, sharp words, occult studies.',
            hi: 'रहस्य उजागर होंगे, गहन खोजी बुद्धि, तीखे शब्द, गुप्त अध्ययन।',
            type: 'neutral'
        },
        'Sagittarius': {
            en: 'Philosophical speech, focus on higher knowledge, counseling others.',
            hi: 'दार्शनिक वाणी, उच्च ज्ञान पर ध्यान, दूसरों को परामर्श देना।',
            type: 'neutral'
        },
        'Capricorn': {
            en: 'Practical communication, structured thoughts, business-like focus.',
            hi: 'व्यावहारिक संचार, संरचित विचार, व्यावसायिक दृष्टिकोण पर ध्यान।',
            type: 'neutral'
        },
        'Aquarius': {
            en: 'Out-of-box ideas, research, gains from social networks, technology interest.',
            hi: 'लीक से हटकर विचार, शोध, सामाजिक नेटवर्क से लाभ, प्रौद्योगिकी में रुचि।',
            type: 'auspicious'
        },
        'Pisces': {
            en: 'Mercury debilitated. Avoid confusion in contracts, double-check documents.',
            hi: 'बुध नीच राशि में। समझौतों में भ्रम से बचें, दस्तावेजों की दोबारा जांच करें।',
            type: 'inauspicious'
        }
    },
    'Jupiter': {
        'Aries': {
            en: 'High wisdom, spiritual growth, success in studies, benevolence.',
            hi: 'उच्च ज्ञान, आध्यात्मिक विकास, अध्ययन में सफलता, परोपकार।',
            type: 'auspicious'
        },
        'Taurus': {
            en: 'Gains in wealth, expansion of family assets, sweet speech, religious spending.',
            hi: 'धन में वृद्धि, पारिवारिक संपत्ति का विस्तार, मधुर वाणी, धार्मिक खर्च।',
            type: 'auspicious'
        },
        'Gemini': {
            en: 'Broad learning, communication skill enhancement, relations with teachers.',
            hi: 'व्यापक शिक्षा, संचार कौशल में वृद्धि, शिक्षकों के साथ बेहतर संबंध।',
            type: 'neutral'
        },
        'Cancer': {
            en: 'Jupiter exalted. Maximum wisdom, divine protection, happiness in home, success.',
            hi: 'गुरु उच्च राशि में। अधिकतम ज्ञान, ईश्वरीय सुरक्षा, घर में सुख-समृद्धि, सफलता।',
            type: 'auspicious'
        },
        'Leo': {
            en: 'Royal wisdom, high moral values, success in education and children matters.',
            hi: 'शाही ज्ञान, उच्च नैतिक मूल्य, शिक्षा और संतान संबंधी मामलों में सफलता।',
            type: 'auspicious'
        },
        'Virgo': {
            en: 'Focus on detailed education, service to society, health care counseling.',
            hi: 'विस्तृत शिक्षा पर ध्यान, समाज की सेवा, स्वास्थ्य संबंधी परामर्श।',
            type: 'neutral'
        },
        'Libra': {
            en: 'Balanced advice, fair business deals, counseling, social harmony.',
            hi: 'संतुलित सलाह, निष्पक्ष व्यापारिक सौदे, परामर्श, सामाजिक सद्भाव।',
            type: 'auspicious'
        },
        'Scorpio': {
            en: 'Interest in deep secrets, spiritual initiation, gains from inheritance.',
            hi: 'गहरे रहस्यों में रुचि, आध्यात्मिक दीक्षा, पैतृक संपत्ति से लाभ।',
            type: 'neutral'
        },
        'Sagittarius': {
            en: 'Jupiter in own sign. Dharma, high values, spiritual initiation, success in law/teaching.',
            hi: 'गुरु स्वराशि में। धर्म, उच्च मूल्य, आध्यात्मिक दीक्षा, कानून/शिक्षण में सफलता।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Jupiter debilitated. Keep patience in spiritual gains, work on ethical values.',
            hi: 'गुरु नीच राशि में। आध्यात्मिक लाभ में धैर्य रखें, नैतिक मूल्यों पर काम करें।',
            type: 'inauspicious'
        },
        'Aquarius': {
            en: 'Philanthropic actions, gains in long-term goals, social network blessings.',
            hi: 'परोपकारी कार्य, दीर्घकालिक लक्ष्यों में सफलता, सामाजिक नेटवर्क का आशीर्वाद।',
            type: 'auspicious'
        },
        'Pisces': {
            en: 'Jupiter in own sign. Intense meditation, spiritual growth, isolation peace, wisdom.',
            hi: 'गुरु स्वराशि में। गहन ध्यान, आध्यात्मिक विकास, एकांत में शांति, सर्वोच्च बुद्धि।',
            type: 'auspicious'
        }
    },
    'Venus': {
        'Aries': {
            en: 'Passionate relationships, spending on luxuries, creative impulse.',
            hi: 'उत्साही रिश्ते, विलासिता पर खर्च, रचनात्मक आवेग का अनुभव।',
            type: 'neutral'
        },
        'Taurus': {
            en: 'Venus in own sign. Luxury, comfort, accumulation of beautiful articles, stable love.',
            hi: 'शुक्र स्वराशि में$. विलासिता, आराम, सुंदर वस्तुओं का संचय, स्थिर प्रेम।',
            type: 'auspicious'
        },
        'Gemini': {
            en: 'Witty romance, love for music/literature, social gatherings, fun travels.',
            hi: 'रोमांचक रोमांस, संगीत/साहित्य के प्रति प्रेम, सामाजिक समारोह, मनोरंजक यात्राएं।',
            type: 'auspicious'
        },
        'Cancer': {
            en: 'Deep affection, love for home comfort, nurturing relationships.',
            hi: 'गहरा स्नेह, गृह सुख के प्रति प्रेम, रिश्तों को संवारना।',
            type: 'neutral'
        },
        'Leo': {
            en: 'Dramatic expression of love, attraction to royalty and art, creative fame.',
            hi: 'प्रेम की अभिव्यंजक शैली, शाही ठाट और कला के प्रति आकर्षण, रचनात्मक प्रसिद्धि।',
            type: 'neutral'
        },
        'Virgo': {
            en: 'Venus debilitated. Avoid critical behavior in relationships, focus on hygiene.',
            hi: 'शुक्र नीच राशि में। रिश्तों में आलोचनात्मक व्यवहार से बचें, स्वच्छता पर ध्यान दें।',
            type: 'inauspicious'
        },
        'Libra': {
            en: 'Venus in own sign. Harmony in marriage, beautiful partnerships, diplomatic charm.',
            hi: 'शुक्र स्वराशि में। विवाह में सामंजस्य, सुंदर साझेदारी, राजनयिक आकर्षण।',
            type: 'auspicious'
        },
        'Scorpio': {
            en: 'Intense and secretive romance, transformations in relationship values.',
            hi: 'तीव्र और गुप्त रोमांस, रिश्तों के मूल्यों में बड़ा परिवर्तन।',
            type: 'neutral'
        },
        'Sagittarius': {
            en: 'Love for philosophical and foreign cultures, travel with partner.',
            hi: 'दार्शनिक और विदेशी संस्कृतियों के प्रति प्रेम, साथी के साथ यात्रा।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Practical approach to love, professional arts, stable commitments.',
            hi: 'प्रेम के प्रति व्यावहारिक दृष्टिकोण, व्यावसायिक कला, स्थिर प्रतिबद्धताएं।',
            type: 'neutral'
        },
        'Aquarius': {
            en: 'Unconventional relationships, gains from female friends, technological art.',
            hi: 'अनूठे रिश्ते, महिला मित्रों से लाभ, तकनीकी कला में रुचि।',
            type: 'auspicious'
        },
        'Pisces': {
            en: 'Venus exalted. Divine self-less love, spiritual ecstasy, success in creative arts.',
            hi: 'शुक्र उच्च राशि में। दिव्य निःस्वार्थ प्रेम, आध्यात्मिक आनंद, रचनात्मक कला में सफलता।',
            type: 'auspicious'
        }
    },
    'Saturn': {
        'Aries': {
            en: 'Saturn debilitated. Hard work required, career challenges, take care of health.',
            hi: 'शनि नीच राशि में। कड़ी मेहनत की आवश्यकता, करियर में चुनौतियां, स्वास्थ्य का ध्यान रखें।',
            type: 'inauspicious'
        },
        'Taurus': {
            en: 'Stable professional growth through discipline, focus on long-term assets.',
            hi: 'अनुशासन के माध्यम से स्थिर व्यावसायिक विकास, दीर्घकालिक संपत्ति पर ध्यान।',
            type: 'neutral'
        },
        'Gemini': {
            en: 'Intellectual patience, structured study, careful communication required.',
            hi: 'बौद्धिक धैर्य, संरचित अध्ययन, सावधानीपूर्वक संचार की आवश्यकता।',
            type: 'neutral'
        },
        'Cancer': {
            en: 'Watch emotional coldness, focus on domestic responsibilities, patience.',
            hi: 'भावनात्मक उदासीनता से बचें, घरेलू जिम्मेदारियों पर ध्यान दें, धैर्य रखें।',
            type: 'inauspicious'
        },
        'Leo': {
            en: 'Discipline in leadership, hard work in administrative tasks, respect elders.',
            hi: 'नेतृत्व में अनुशासन, प्रशासनिक कार्यों में कड़ी मेहनत, बड़ों का सम्मान करें।',
            type: 'neutral'
        },
        'Virgo': {
            en: 'Discipline in daily routines, victory over disputes, attention to health.',
            hi: 'दैनिक दिनचर्या में अनुशासन, विवादों पर विजय, स्वास्थ्य पर ध्यान।',
            type: 'neutral'
        },
        'Libra': {
            en: 'Saturn exalted. Justice, political rise, success in labor, stable growth.',
            hi: 'शनि उच्च राशि में। न्याय, राजनीतिक उन्नति, श्रम कार्यों में सफलता, स्थिर विकास।',
            type: 'auspicious'
        },
        'Scorpio': {
            en: 'Deep transformation, control over fears, hard research tasks, caution.',
            hi: 'गहन परिवर्तन, भय पर नियंत्रण, कठिन शोध कार्य, सावधानी बरतें।',
            type: 'neutral'
        },
        'Sagittarius': {
            en: 'Focus on spiritual discipline, high moral ethics, structured higher education.',
            hi: 'आध्यात्मिक अनुशासन पर ध्यान, उच्च नैतिक मूल्य, संरचित उच्च शिक्षा।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Saturn in own sign. Extreme hard work rewarded, stable career progress.',
            hi: 'शनि स्वराशि में। अत्यधिक कड़ी मेहनत का फल मिलेगा, करियर में स्थिर प्रगति।',
            type: 'auspicious'
        },
        'Aquarius': {
            en: 'Saturn in own sign. Work for public welfare, philanthropy, large scale gains.',
            hi: 'शनि स्वराशि में। लोक कल्याण के लिए कार्य, परोपकार, बड़े पैमाने पर लाभ।',
            type: 'auspicious'
        },
        'Pisces': {
            en: 'Introspection, spiritual isolation, expenditure caution, foreign connections.',
            hi: 'आत्मनिरीक्षण, आध्यात्मिक एकांत, खर्चों में सावधानी, विदेशी संपर्क।',
            type: 'neutral'
        }
    },
    'Rahu': {
        'Aries': {
            en: 'Impatient desires, passion, sudden career moves, watch impulsiveness.',
            hi: 'अधीर इच्छाएं, जुनून, करियर में अचानक बड़े बदलाव, जल्दबाजी से बचें।',
            type: 'neutral'
        },
        'Taurus': {
            en: 'Rahu exalted (some traditions). Material gains, wealth creation, watch speech.',
            hi: 'राहु उच्च राशि में (कुछ मत)। भौतिक लाभ, धन सृजन, वाणी पर ध्यान दें।',
            type: 'auspicious'
        },
        'Gemini': {
            en: 'Rahu exalted. Technological communication, media success, unusual intellect.',
            hi: 'राहु उच्च राशि में। तकनीकी संचार, मीडिया में सफलता, असाधारण बुद्धि।',
            type: 'auspicious'
        },
        'Cancer': {
            en: 'Unstable home atmosphere, check emotional cravings, focus on meditation.',
            hi: 'अस्थिर घरेलू वातावरण, भावनात्मक लालसा पर नियंत्रण रखें, ध्यान पर ध्यान दें।',
            type: 'inauspicious'
        },
        'Leo': {
            en: 'Unusual leadership ambitions, sudden political rise, watch ego clash.',
            hi: 'असाधारण नेतृत्व महत्वाकांक्षाएं, अचानक राजनीतिक उन्नति, अहंकार के टकराव से बचें।',
            type: 'neutral'
        },
        'Virgo': {
            en: 'Analytical obsessiveness, success in competitive fields, health caution.',
            hi: 'विश्लेषणात्मक जूनून, प्रतिस्पर्धी क्षेत्रों में सफलता, स्वास्थ्य के प्रति सावधानी।',
            type: 'neutral'
        },
        'Libra': {
            en: 'Obsession with business relations, check partnership contracts carefully.',
            hi: 'व्यावसायिक संबंधों के प्रति जूनून, साझेदारी समझौतों की सावधानीपूर्वक जांच करें।',
            type: 'neutral'
        },
        'Scorpio': {
            en: 'Secret occult transformations, sudden financial moves, maintain ethics.',
            hi: 'गुप्त तांत्रिक परिवर्तन, अचानक वित्तीय बदलाव, नैतिक बने रहें।',
            type: 'inauspicious'
        },
        'Sagittarius': {
            en: 'Unorthodox spiritual views, foreign travel obsession, check belief systems.',
            hi: 'अपरंपरागत आध्यात्मिक विचार, विदेश यात्रा की इच्छा, विश्वास प्रणालियों की जांच करें।',
            type: 'neutral'
        },
        'Capricorn': {
            en: 'Professional obsession, sudden rise in work status, unconventional methods.',
            hi: 'काम के प्रति जूनून, काम की स्थिति में अचानक वृद्धि, अपरंपरागत तरीके।',
            type: 'neutral'
        },
        'Aquarius': {
            en: 'Sudden gains, technological breakthroughs, massive social networks.',
            hi: 'अचानक लाभ, तकनीकी सफलताएं, विशाल सामाजिक नेटवर्क।',
            type: 'auspicious'
        },
        'Pisces': {
            en: 'Mystical dreams, travel obsession, expenditure on unusual activities.',
            hi: 'रहस्यमय सपने, विदेश यात्रा की तीव्र इच्छा, असामान्य गतिविधियों पर खर्च।',
            type: 'neutral'
        }
    },
    'Ketu': {
        'Aries': {
            en: 'Detachment from physical action, focus on spiritual self-awareness.',
            hi: 'भौतिक क्रियाओं से अलगाव, आध्यात्मिक आत्म-जागरूकता पर ध्यान।',
            type: 'neutral'
        },
        'Taurus': {
            en: 'Detachment from material assets, search for inner wealth, watch diet.',
            hi: 'भौतिक संपत्ति से अलगाव, आंतरिक धन की खोज, खान-पान पर ध्यान दें।',
            type: 'neutral'
        },
        'Gemini': {
            en: 'Silent intellect, quiet communications, detachment from local siblings.',
            hi: 'मौन बुद्धि, शांत संचार, भाई-बहनों से लगाव की कमी।',
            type: 'neutral'
        },
        'Cancer': {
            en: 'Detachment from home cravings, search for emotional self-reliance.',
            hi: 'घरेलू लालसा से अलगाव, भावनात्मक आत्मनिर्भरता की खोज।',
            type: 'neutral'
        },
        'Leo': {
            en: 'Detachment from status/fame, spiritual leadership, watch ego.',
            hi: 'पद/प्रसिद्धि से विरक्ति, आध्यात्मिक नेतृत्व, अहंकार से बचें।',
            type: 'neutral'
        },
        'Virgo': {
            en: 'Intuitive problem solving, detachment from minor arguments, clean living.',
            hi: 'सहज ज्ञान युक्त समस्या समाधान, छोटे विवादों से अलगाव, स्वच्छ जीवन।',
            type: 'auspicious'
        },
        'Libra': {
            en: 'Detachment from relational bonds, search for inner balance in partners.',
            hi: 'पारस्परिक बंधनों से अलगाव, भागीदारों में आंतरिक संतुलन की खोज।',
            type: 'neutral'
        },
        'Scorpio': {
            en: 'Ketu exalted. Supreme mystical growth, deep occult insight, liberation gains.',
            hi: 'केतु उच्च राशि में। सर्वोच्च रहस्यमय विकास, गहरी गुप्त अंतर्दृष्टि, मोक्ष लाभ।',
            type: 'auspicious'
        },
        'Sagittarius': {
            en: 'Ketu exalted. Intense spiritual detachment, liberation research, guru search.',
            hi: 'केतु उच्च राशि में। तीव्र आध्यात्मिक विरक्ति, मोक्ष अनुसंधान, गुरु की खोज।',
            type: 'auspicious'
        },
        'Capricorn': {
            en: 'Detachment from career prestige, focus on work itself, ethical service.',
            hi: 'करियर की प्रतिष्ठा से अलगाव, स्वयं काम पर ध्यान, नैतिक सेवा।',
            type: 'neutral'
        },
        'Aquarius': {
            en: 'Detachment from social gains, working quietly, sudden spiritual networks.',
            hi: 'सामाजिक लाभ से अलगाव, चुपचाप काम करना, अचानक आध्यात्मिक नेटवर्क।',
            type: 'neutral'
        },
        'Pisces': {
            en: 'Highest spiritual liberation focus, deep meditation, active dreams.',
            hi: 'सर्वोच्च आध्यात्मिक मोक्ष पर ध्यान, गहन ध्यान, सक्रिय सपने।',
            type: 'auspicious'
        }
    }
};
/**
 * Calculates future transits (Gochar) for a range of dates.
 * Checks weekly intervals for sign changes to minimize Worker messages,
 * then queries intermediate days when a transition is detected.
 */
export function calculateFutureTransits(startDate, daysRange = 120) {
    return new Promise(async (resolve) => {
        const targetPlanets = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
        const transits = [];
        // Since Web Worker fetches asynchronously, we can query positions
        // We check every day in a sequential chain, or if mock/cache is available, it resolves immediately.
        // Let's query positions daily for the next 90 days. Daily is very accurate.
        // To completely avoid flooding React renders, we fetch them in a promise chain.
        const promises = [];
        for (let i = 0; i < daysRange; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            promises.push(new Promise((res) => {
                // Wrap inside a small timeout or microtask to yield main thread if needed
                const pos = astronomicalEngine.getPanchangPositions(date);
                res({ date, positions: pos });
            }));
        }
        const results = await Promise.all(promises);
        // Analyze transitions
        for (let i = 1; i < results.length; i++) {
            const prev = results[i - 1].positions;
            const curr = results[i].positions;
            const date = results[i].date;
            if (!prev?.planets || !curr?.planets)
                continue;
            targetPlanets.forEach((pName) => {
                const pPrev = prev.planets.find((p) => p.name === pName);
                const pCurr = curr.planets.find((p) => p.name === pName);
                if (pPrev && pCurr && pPrev.sign !== pCurr.sign) {
                    const predictionObj = TRANSIT_PREDICTIONS[pName]?.[pCurr.sign] || {
                        en: 'Planetary transition. Focus on discipline and growth.',
                        hi: 'ग्रह का राशि परिवर्तन। अनुशासन और विकास पर ध्यान केंद्रित करें।',
                        type: 'neutral'
                    };
                    const dateStr = date.toLocaleDateString('hi-IN', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    transits.push({
                        id: `${pName}_${pPrev.sign}_${pCurr.sign}_${date.getTime()}`,
                        planetName: pName,
                        planetHindi: PLANET_MAP[pName] || pName,
                        fromSign: pPrev.sign,
                        fromSignHindi: SIGN_MAP[pPrev.sign] || pPrev.sign,
                        toSign: pCurr.sign,
                        toSignHindi: SIGN_MAP[pCurr.sign] || pCurr.sign,
                        date: date,
                        dateStr: dateStr,
                        prediction: predictionObj.en,
                        predictionHindi: predictionObj.hi,
                        type: predictionObj.type
                    });
                }
            });
        }
        resolve(transits);
    });
}
export const getUpcomingTransits = calculateFutureTransits;
