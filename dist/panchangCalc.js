/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */
import { astronomicalEngine, registerPanchangCacheClearer } from './astronomicalEngine';
const panchangCache = new Map();
export function clearPanchangCache() {
    panchangCache.clear();
}
registerPanchangCacheClearer(clearPanchangCache);
/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */
export const INDIAN_CITIES = [
    { city: "New Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.209 },
    { city: "Mumbai", state: "Maharashtra", latitude: 19.076, longitude: 72.8777 },
    { city: "Varanasi", state: "Uttar Pradesh", latitude: 25.3176, longitude: 82.9739 },
    { city: "Haridwar", state: "Uttarakhand", latitude: 29.9457, longitude: 78.1642 },
    { city: "Bengaluru", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
    { city: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
    { city: "Ahmedabad", state: "Gujarat", latitude: 23.0225, longitude: 72.5714 },
    { city: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
    { city: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
    { city: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873 },
    { city: "Ujjain", state: "Madhya Pradesh", latitude: 23.176, longitude: 75.7885 },
    { city: "Patna", state: "Bihar", latitude: 25.5941, longitude: 85.1376 },
    { city: "Ayodhya", state: "Uttar Pradesh", latitude: 26.7956, longitude: 82.1944 },
    { city: "Guwahati", state: "Assam", latitude: 26.1158, longitude: 91.7086 },
    { city: "Srinagar", state: "Jammu & Kashmir", latitude: 34.0837, longitude: 74.7973 }
];
export const TITHI_DETAILS = [
    { name: "Pratipada", hindiName: "प्रतिपदा (1)", lord: "Agni", deity: "Agni" },
    { name: "Dwitiya", hindiName: "द्वितीया (2)", lord: "Brahma", deity: "Brahma" },
    { name: "Tritiya", hindiName: "तृतीया (3)", lord: "Gauri", deity: "Gauri" },
    { name: "Chaturthi", hindiName: "चतुर्थी (4)", lord: "Ganesha", deity: "Ganesha" },
    { name: "Panchami", hindiName: "पंचमी (5)", lord: "Lalita/Naga", deity: "Serpents" },
    { name: "Shashti", hindiName: "षष्ठी (6)", lord: "Kartikeya", deity: "Kartikeya" },
    { name: "Saptami", hindiName: "सप्तमी (7)", lord: "Surya", deity: "Surya" },
    { name: "Ashtami", hindiName: "अष्टमी (8)", lord: "Shiva", deity: "Durga/Rudras" },
    { name: "Navami", hindiName: "नवमी (9)", lord: "Durga", deity: "Durga" },
    { name: "Dashami", hindiName: "दशमी (10)", lord: "Yama", deity: "Ten Directions" },
    { name: "Ekadashi", hindiName: "एकादशी (11)", lord: "Vishnu", deity: "Kubera" },
    { name: "Dwadashi", hindiName: "द्वादशी (12)", lord: "Sun", deity: "Vishnu" },
    { name: "Trayodashi", hindiName: "त्रयोदशी (13)", lord: "Kama", deity: "Kama/Dharma" },
    { name: "Chaturdashi", hindiName: "चतुर्दशी (14)", lord: "Shiva", deity: "Shiva" },
    { name: "Purnima / Amavasya", hindiName: "पूर्णिमा / अमावस्या (15)", lord: "Moon", deity: "Moon/Pitrus" }
];
export const NAKSHATRA_DETAILS = [
    {
        name: "Ashwini",
        hindiName: "अश्विनी",
        lord: "Ketu",
        deity: "Ashwini Kumars (Prana)",
        symbol: "Horse Head",
        nature: "Light & Swift (Kshipra)",
        description: "First Nakshatra. Fast, active, representing initiation, healing, and quick movement.",
        suitableActivities: ["Starting medicine", "Travel", "Learning new skills", "Wearing jewelry", "Starting business"],
        avoidActivities: ["Ending contracts", "Marriages", "Completing long jobs"]
    },
    {
        name: "Bharani",
        hindiName: "भरणी",
        lord: "Venus",
        deity: "Yama (Justice)",
        symbol: "Yoni (Creativity)",
        nature: "Fierce (Ugra)",
        description: "Brings struggle but gives self-control, spiritual purification, and high resolve.",
        suitableActivities: ["Surgical acts", "Farming", "Demolition", "Laying fires", "Legal actions"],
        avoidActivities: ["Travel", "New business", "Financial transactions", "Peaceful ceremonies"]
    },
    {
        name: "Krittika",
        hindiName: "कृत्तिका",
        lord: "Sun",
        deity: "Agni (Fire)",
        symbol: "Knife/Razor",
        nature: "Mixed (Mridu-Teekshna)",
        description: "Represents fire, sharp speech, cooking, and purity. Highly intellectual and direct.",
        suitableActivities: ["Cooking", "Using fire or tools", "Debates", "Giving up bad habits", "Haircut"],
        avoidActivities: ["Water sports", "Travel", "Signing partnership agreements"]
    },
    {
        name: "Rohini",
        hindiName: "रोहिणी",
        lord: "Moon",
        deity: "Brahma (Creator)",
        symbol: "Cart/Chariot",
        nature: "Fixed (Dhruva)",
        description: "Most loved by the Moon. Represents beauty, culture, high artistic growth, and stable wealth.",
        suitableActivities: ["Marriage", "Agricultural works", "Construction", "Entering a new home", "Investments"],
        avoidActivities: ["Demolition", "Lending money", "Fierce challenges"]
    },
    {
        name: "Mrigashirsha",
        hindiName: "मृगशिरा",
        lord: "Mars",
        deity: "Soma (Moon God)",
        symbol: "Deer Head",
        nature: "Soft (Mridu)",
        description: "The searching Nakshatra. Represents curiosity, travel, beautiful clothing, and pure mind.",
        suitableActivities: ["Creative work", "Music", "Travel", "Beginning secondary studies", "Making friendship"],
        avoidActivities: ["Fierce operations", "Confrontation", "Legal suits"]
    },
    {
        name: "Ardra",
        hindiName: "आर्द्रा",
        lord: "Rahu",
        deity: "Rudra (Storm God)",
        symbol: "Tear-drop",
        nature: "Sharp (Teekshna)",
        description: "Represents moisture, tears, transformation, and finding calm after a devastating storm.",
        suitableActivities: ["Fasting", "Overcoming obstacles", "Repairs", "Deep cleaning", "Spiritual research"],
        avoidActivities: ["Marriage", "Journeys", "Opening a shop/Business"]
    },
    {
        name: "Punarvasu",
        hindiName: "पुनर्वसु",
        lord: "Jupiter",
        deity: "Aditi (Mother of Gods)",
        symbol: "Bow & Quiver",
        nature: "Movable (Chara)",
        description: "The return of the light. Bestows freedom, safety, recurrence of wealth, and safety.",
        suitableActivities: ["Starting studies", "Travel", "Purchasing cars", "Constructing gardens", "Medication"],
        avoidActivities: ["Lending cash", "Fierce debates", "Signing loans/debts"]
    },
    {
        name: "Pushya",
        hindiName: "पुष्य",
        lord: "Saturn",
        deity: "Brihaspati (Teacher)",
        symbol: "Flower/Cow Udder",
        nature: "Light & Swift (Kshipra)",
        description: "King of Nakshatras. Nourishing, giving luck, wisdom, spiritual prosperity. Extremely auspicious.",
        suitableActivities: ["Financial trading", "Gold purchase", "Signing business deals", "Treating chronic illness", "Prayers"],
        avoidActivities: ["Marriages (strictly avoided in Pushya due to old curse)"]
    },
    {
        name: "Ashlesha",
        hindiName: "अश्लेषा",
        lord: "Mercury",
        deity: "Sarpas (Nagas)",
        symbol: "Coiled Snake",
        nature: "Sharp (Teekshna)",
        description: "Deep intuition, secretive, great dynamic energy, but easily misunderstood and crafty.",
        suitableActivities: ["Yoga", "Filing law suits", "Pest control", "Leaving bad relationships", "Research"],
        avoidActivities: ["Starting new journeys", "Commercial partnerships", "Auspicious initiations"]
    },
    {
        name: "Magha",
        hindiName: "मघा",
        lord: "Ketu",
        deity: "Pitrus (Ancestors)",
        symbol: "Royal Throne",
        nature: "Fierce (Ugra)",
        description: "Represents royalty, power, family legacy, leadership, and deep connection with ancestors.",
        suitableActivities: ["Ancestral prayers", "Political power deeds", "Assuming leadership", "Donating items to poor"],
        avoidActivities: ["Lending money", "Starting modern contracts", "Marriage ceremonies"]
    },
    {
        name: "Purva Phalguni",
        hindiName: "पूर्वाफाल्गुनी",
        lord: "Venus",
        deity: "Bhaga (Fortune)",
        symbol: "Front Legs of Bed",
        nature: "Fierce (Ugra)",
        description: "Relaxation, love, marital bliss, music, fine drama, and fine luxuries of life.",
        suitableActivities: ["Art exhibitions", "Creative acts", "Proposals", "Amusement", "Going out on dates"],
        avoidActivities: ["Spiritual meditation", "Long diets", "Treating chronic sickness"]
    },
    {
        name: "Uttara Phalguni",
        hindiName: "उत्तराफाल्गुनी",
        lord: "Sun",
        deity: "Aryaman (Friendship)",
        symbol: "Back Legs of Bed",
        nature: "Fixed (Dhruva)",
        description: "Represent loyalty, marriage contracts, establishing permanent status, and social charity.",
        suitableActivities: ["Marriages", "Laying foundation", "Entering new organizations", "Starting public projects"],
        avoidActivities: ["Aggressive debates", "Lending items", "Ending ties"]
    },
    {
        name: "Hasta",
        hindiName: "हस्त",
        lord: "Moon",
        deity: "Savitr (Sun God)",
        symbol: "Clenched Fist",
        nature: "Light & Swift (Kshipra)",
        description: "Represents hand skill, tricks, dynamic crafts, intelligence, and playful learning.",
        suitableActivities: ["Crafts", "Painting", "Commerce", "Opening accounts", "Starting light exercise"],
        avoidActivities: ["Major rest or vacation", "Spiritual detachment sessions"]
    },
    {
        name: "Chitra",
        hindiName: "चित्रा",
        lord: "Mars",
        deity: "Vishwakarma (Architect)",
        symbol: "Bright Pearl/Gem",
        nature: "Soft (Mridu)",
        description: "The jewel of heaven. Artistic, structural creation, visual beauty, and architectural mastery.",
        suitableActivities: ["Architecture design", "Buying jewelry", "Music release", "Gardening", "Decorating room"],
        avoidActivities: ["Investigating crimes", "Legal debates"]
    },
    {
        name: "Swati",
        hindiName: "स्वाति",
        lord: "Rahu",
        deity: "Vayu (Wind God)",
        symbol: "Shoot of Plant/Sword",
        nature: "Movable (Chara)",
        description: "Brings independence, business savvy, versatility, and the soft movement of fresh breeze.",
        suitableActivities: ["Business launches", "Trading", "Public speaking", "Purchasing cars", "Seed sowing"],
        avoidActivities: ["Fixed construction", "Long-term investments"]
    },
    {
        name: "Vishakha",
        hindiName: "विशाखा",
        lord: "Jupiter",
        deity: "Indra-Agni (Alliance)",
        symbol: "Triumphal Arch",
        nature: "Mixed (Mridu-Teekshna)",
        description: "Goal-oriented, ambitious, single-minded focus. Brings late success after intense focus.",
        suitableActivities: ["Exam study", "Competitive activities", "Target setups", "Inaugurating buildings"],
        avoidActivities: ["Marriage rituals", "Routine travel", "Confronting family members"]
    },
    {
        name: "Anuradha",
        hindiName: "अनुराधा",
        lord: "Saturn",
        deity: "Mitra (Universal Friend)",
        symbol: "Lotus Flower",
        nature: "Soft (Mridu)",
        description: "Brings success in foreign lands, spiritual groups, loyalty, and loving connections.",
        suitableActivities: ["Sufi or spiritual singing", "Foreign journeys", "Social work", "Tying friendship bands"],
        avoidActivities: ["Opening law files", "Attacking enemies"]
    },
    {
        name: "Jyeshtha",
        hindiName: "ज्येष्ठा",
        lord: "Mercury",
        deity: "Indra (King of Gods)",
        symbol: "Umbrella/Round Amulet",
        nature: "Sharp (Teekshna)",
        description: "Seniority, protective power, magical abilities, family lordship, and mental strength.",
        suitableActivities: ["Filing applications", "Self defense studies", "Secret projects", "Engineering designs"],
        avoidActivities: ["Marriage contracts", "Warm familial events"]
    },
    {
        name: "Mula",
        hindiName: "मूल",
        lord: "Ketu",
        deity: "Nirriti (Dissolution)",
        symbol: "Tied Bunch of Roots",
        nature: "Sharp (Teekshna)",
        description: "Going to the root. Represents herbal discovery, researchers, high spiritual renunciation, and truth.",
        suitableActivities: ["Gardening", "Deep research", "Starting intense treatment", "Meditation", "Breaking habits"],
        avoidActivities: ["Financial loans", "Entering new properties"]
    },
    {
        name: "Purva Ashadha",
        hindiName: "पूर्वाषाढ़ा",
        lord: "Venus",
        deity: "Apah (Water Goddess)",
        symbol: "Winnowing Basket",
        nature: "Fierce (Ugra)",
        description: "Invulnerable success. Representing water flow, declaring victory, and constant exploration.",
        suitableActivities: ["Legal defense", "Water channels creation", "Voyages", "Filing trials", "Symphonies"],
        avoidActivities: ["Soil cultivation", "Signing peaceful treaties"]
    },
    {
        name: "Uttara Ashadha",
        hindiName: "उत्तराषाढ़ा",
        lord: "Sun",
        deity: "Visvadevas (All Gods)",
        symbol: "Elephant Tusk",
        nature: "Fixed (Dhruva)",
        description: "Durable victory, social responsibility, highest integrity, and massive organizational power.",
        suitableActivities: ["Signing land properties", "Political oath", "Constructing homes", "Establishing institutions"],
        avoidActivities: ["Criminal investigations", "Initiating quick gambles"]
    },
    {
        name: "Shravana",
        hindiName: "श्रवण",
        lord: "Moon",
        deity: "Vishnu (Preserver)",
        symbol: "Three Footprints",
        nature: "Movable (Chara)",
        description: "The listening star. Represents wisdom, speech, public relations, and universal learning.",
        suitableActivities: ["Learning languages", "Music auditions", "Travel", "Opening bank accounts", "Curing illnesses"],
        avoidActivities: ["Inaugurating heavy machines", "Combative operations"]
    },
    {
        name: "Dhanishta",
        hindiName: "धनिष्ठा",
        lord: "Mars",
        deity: "Eight Vasus (Abundance)",
        symbol: "Drum/Flute",
        nature: "Movable (Chara)",
        description: "Star of music and great wealth. Generosity, musical rhythm, and massive social influence.",
        suitableActivities: ["Releasing music track", "Public rallies", "Moving properties", "Starting a vehicle drive"],
        avoidActivities: ["New partnership splits", "Lending expensive objects"]
    },
    {
        name: "Shatabhisha",
        hindiName: "शतभिषा",
        lord: "Rahu",
        deity: "Varuna (Ocean Lord)",
        symbol: "Empty Circle/100 Stars",
        nature: "Movable (Chara)",
        description: "The star of 100 physicians. Mysticism, health healing, high secrecy, and deep astronomy.",
        suitableActivities: ["Taking herbal medicines", "Medical diagnosis", "Astrology studies", "Research", "Spa therapy"],
        avoidActivities: ["Marriage rituals", "Heavy home construction"]
    },
    {
        name: "Purva Bhadrapada",
        hindiName: "पूर्वाभाद्रपद",
        lord: "Jupiter",
        deity: "Aja Ekapada (Fire Dragon)",
        symbol: "Two-Faced Man",
        nature: "Fierce (Ugra)",
        description: "Passionate and fiery. Bestows huge occult experiences, heavy resolution, and deep charisma.",
        suitableActivities: ["Occult practices", "Fasting", "Spiritual deep dives", "Aggressive tasks"],
        avoidActivities: ["Marriages", "Buying brand new cars", "Long travels"]
    },
    {
        name: "Uttara Bhadrapada",
        hindiName: "उत्तराभाद्रपद",
        lord: "Saturn",
        deity: "Ahir Budhnya (Abyss Serpent)",
        symbol: "Twins in Back of Bed",
        nature: "Fixed (Dhruva)",
        description: "Serene wisdom, yoga mastery, deep containment, and unconditional love.",
        suitableActivities: ["Home construction", "Paving roads", "Investments", "Vows taking", "Starting meditation"],
        avoidActivities: ["Quick speculations", "Aggressive law-suits"]
    },
    {
        name: "Revati",
        hindiName: "रेवती",
        lord: "Mercury",
        deity: "Pushan (Protector of Animals)",
        symbol: "Fish/Drum",
        nature: "Soft (Mridu)",
        description: "Safe journeys, love for pets, highest pure beauty, sweet speech, and cosmic finality.",
        suitableActivities: ["Travel starts", "Adopting companion animals", "Designing clothes", "Treatments", "Weddings"],
        avoidActivities: ["Long term storage of items", "Fierce defense preparations"]
    }
];
export const YOGA_DETAILS = [
    "Vishkumbha (Pre-eminent)",
    "Preeti (Loving)",
    "Ayushman (Long-lived)",
    "Saubhagya (Good Fortune)",
    "Shobhana (Beautiful)",
    "Atiganda (Great Obstacle)",
    "Sukarma (Virtuous Creator)",
    "Dhriti (Patience)",
    "Shoola (Spear/Pain)",
    "Ganda (Knot/Obstacle)",
    "Vriddhi (Growth)",
    "Dhruva (Constant)",
    "Vyaghata (Smiter)",
    "Harshana (Joyous)",
    "Vajra (Thunderbolt)",
    "Siddhi (Success)",
    "Vyatipata (Calamity)",
    "Variyan (Excellent)",
    "Parigha (Obstacle/Gate)",
    "Shiva (Auspicious)",
    "Siddha (Perfected)",
    "Sadhya (Feasible)",
    "Shubha (Auspicious)",
    "Shukla (White/Bright)",
    "Brahma (Creator)",
    "Indra (Ruler)",
    "Vaidhriti (Dividing)"
];
export const KARANA_DETAILS = [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Garija",
    "Vanija",
    "Vishti (Bhadra)",
    "Shakuni",
    "Chatuspada",
    "Naga",
    "Kimstughna"
];
export const MONTHS_ENGLISH_HINDI = [
    { eng: "Chaitra", hin: "चैत्र", ritu: "Vasanta (Spring)" },
    { eng: "Vaisakha", hin: "वैशाख", ritu: "Vasanta (Spring)" },
    { eng: "Jyeshtha", hin: "ज्येष्ठ", ritu: "Grishma (Summer)" },
    { eng: "Ashadha", hin: "आषाढ़", ritu: "Grishma (Summer)" },
    { eng: "Shravana", hin: "श्रावण", ritu: "Varsha (Monsoon)" },
    { eng: "Bhadrapada", hin: "भाद्रपद", ritu: "Varsha (Monsoon)" },
    { eng: "Ashwin", hin: "आश्विन", ritu: "Sharad (Autumn)" },
    { eng: "Kartik", hin: "कार्तिक", ritu: "Sharad (Autumn)" },
    { eng: "Margashirsha", hin: "मार्गशीर्ष", ritu: "Hemant (Winter-pre)" },
    { eng: "Pausha", hin: "पौष", ritu: "Hemant (Winter-pre)" },
    { eng: "Maagha", hin: "माघ", ritu: "Shishir (Winter-peak)" },
    { eng: "Phalguna", hin: "फाल्गुन", ritu: "Shishir (Winter-peak)" }
];
export function calculateSolarTimes(lat, lon, date) {
    return astronomicalEngine.getSolarTimes(lat, lon, date);
}
export function calculatePaya(naksIdx) {
    // Vedic Partition Rule:
    // Revati (26), Ashwini (0), Bharani (1) -> Gold
    // Krittika (2), Rohini (3), Mrigashira (4) -> Iron
    // Ardra (5) to Anuradha (16) -> Silver
    // Jyeshta (17) to Uttara Bhadrapada (25) -> Copper
    if (naksIdx === 26 || naksIdx === 0 || naksIdx === 1) {
        return {
            name: 'Gold',
            hindiName: 'सोना',
            description: 'Swarna (Gold) Paya brings prosperity, honor, leadership, and a fortunate life journey.'
        };
    }
    else if (naksIdx >= 2 && naksIdx <= 4) {
        return {
            name: 'Iron',
            hindiName: 'लोहा',
            description: 'Loha (Iron) Paya indicates challenges and delays, requiring hard work and perseverance to build strength.'
        };
    }
    else if (naksIdx >= 5 && naksIdx <= 16) {
        return {
            name: 'Silver',
            hindiName: 'चांदी',
            description: 'Rajat (Silver) Paya is highly favorable, bringing emotional stability, mental peace, and steady growth.'
        };
    }
    else {
        return {
            name: 'Copper',
            hindiName: 'तांबा',
            description: 'Tamra (Copper) Paya brings mixed results, where success is achieved through consistent efforts and discipline.'
        };
    }
}
export function calculateDagdaTithi(dayOfWeek, tithiIdx) {
    const tithiVal = (tithiIdx % 15) + 1; // 1 to 15 (Pratipada to Purnima/Amavasya)
    // Weekday to Dagdha Tithi mapping
    // Sunday (0) -> Dwadashi (12)
    // Monday (1) -> Ekadashi (11)
    // Tuesday (2) -> Panchami (5)
    // Wednesday (3) -> Tritiya (3)
    // Thursday (4) -> Shashthi (6)
    // Friday (5) -> Ashtami (8)
    // Saturday (6) -> Navami (9)
    const dagdaMap = {
        0: 12,
        1: 11,
        2: 5,
        3: 3,
        4: 6,
        5: 8,
        6: 9
    };
    const isDagda = dagdaMap[dayOfWeek] === tithiVal;
    if (isDagda) {
        const tithiNamesHindi = {
            3: "तृतीया",
            5: "पंचमी",
            6: "षष्ठी",
            8: "अष्टमी",
            9: "नवमी",
            11: "एकादशी",
            12: "द्वादशी"
        };
        const tithiNameHindi = tithiNamesHindi[tithiVal] || "तिथि";
        return {
            isDagda: true,
            name: "Dagda Tithi",
            hindiName: "दग्ध तिथि",
            description: `Today is an inauspicious Dagda Tithi because it is ${tithiNameHindi} falling on a ${getWeekdayName(dayOfWeek)}. Avoid initiating important or new activities.`
        };
    }
    return {
        isDagda: false,
        name: "Not Dagda",
        hindiName: "दग्ध तिथि नहीं है",
        description: "Today is not a Dagda Tithi. General weekday-tithi combinations are favorable."
    };
}
function getWeekdayName(dayOfWeek) {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return names[dayOfWeek] || "";
}
export function calculateShivaVaas(tithiIdx) {
    const tithiVal = tithiIdx + 1; // 1 to 30
    const sum = (tithiVal * 2) + 5;
    const rem = sum % 7;
    if (rem === 1) {
        return {
            residence: 'Kailash',
            residenceHindi: 'कैलाश',
            isAuspicious: true,
            description: 'Lord Shiva resides on Kailash. Performing Rudrabhishek today is highly auspicious and brings joy, peace, and welfare.'
        };
    }
    else if (rem === 2) {
        return {
            residence: 'Gauri',
            residenceHindi: 'गौरी के साथ',
            isAuspicious: true,
            description: 'Lord Shiva resides with Goddess Gauri. Performing Rudrabhishek today is highly auspicious, bringing wealth and domestic happiness.'
        };
    }
    else if (rem === 3) {
        return {
            residence: 'Vrishabha',
            residenceHindi: 'वृषभ पर',
            isAuspicious: true,
            description: 'Lord Shiva is mounted on Nandi (Vrishabha). Performing Rudrabhishek today is auspicious, leading to the fulfillment of desires.'
        };
    }
    else if (rem === 4) {
        return {
            residence: 'Sabha',
            residenceHindi: 'सभा में',
            isAuspicious: false,
            description: 'Lord Shiva is in His Assembly (Sabha). Performing Sakaam Rudrabhishek today is considered inauspicious as it may bring grief or sorrow.'
        };
    }
    else if (rem === 5) {
        return {
            residence: 'Bhojan',
            residenceHindi: 'भोजन में',
            isAuspicious: false,
            description: 'Lord Shiva is feeding/dining (Bhojan). Performing Sakaam Rudrabhishek today is considered inauspicious, bringing pain or physical distress.'
        };
    }
    else if (rem === 6) {
        return {
            residence: 'Kreeda',
            residenceHindi: 'क्रीड़ा में',
            isAuspicious: false,
            description: 'Lord Shiva is playing (Kreeda). Performing Sakaam Rudrabhishek today is considered inauspicious, leading to difficulties or arguments.'
        };
    }
    else {
        return {
            residence: 'Shmashan',
            residenceHindi: 'श्मशान में',
            isAuspicious: false,
            description: 'Lord Shiva resides in the Crematory (Shmashan). Performing Sakaam Rudrabhishek today is highly inauspicious, bringing heavy losses.'
        };
    }
}
export function calculateAgniVaas(dayOfWeek, tithiIdx) {
    const tithiNum = tithiIdx + 1; // 1 to 30
    const dayNum = dayOfWeek + 1; // 1 to 7 (Sunday = 1, Saturday = 7)
    const sum = tithiNum + dayNum + 1;
    const rem = sum % 4;
    if (rem === 0 || rem === 3) {
        return {
            residence: 'Earth',
            residenceHindi: 'पृथ्वी',
            isAuspicious: true,
            description: 'Agni resides on Earth (Prithvi). Performing yajna/havan today is highly auspicious and brings health, prosperity, and success.'
        };
    }
    else if (rem === 1) {
        return {
            residence: 'Sky',
            residenceHindi: 'आकाश',
            isAuspicious: false,
            description: 'Agni resides in the Sky (Aakash). Performing yajna/havan today is inauspicious and may lead to health issues or unwanted expenses.'
        };
    }
    else {
        return {
            residence: 'Netherworld',
            residenceHindi: 'पाताल',
            isAuspicious: false,
            description: 'Agni resides in the Netherworld (Paataal). Performing yajna/havan today is inauspicious and may lead to loss of wealth or disputes.'
        };
    }
}
export function calculatePushkarYog(dayOfWeek, tithiIdx, naksIdx) {
    // Common Condition 1: Weekday must be Sunday (0), Tuesday (2), or Saturday (6)
    const isValidWeekday = dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 6;
    // Common Condition 2: Tithi must be 2, 7, or 12
    const tithiVal = (tithiIdx % 15) + 1;
    const isValidTithi = tithiVal === 2 || tithiVal === 7 || tithiVal === 12;
    if (isValidWeekday && isValidTithi) {
        // Check Dwipushkar Nakshatras: Mrigashirsha (4), Chitra (13), Dhanishta (22)
        const isDwipadaNaks = naksIdx === 4 || naksIdx === 13 || naksIdx === 22;
        // Check Tripushkar Nakshatras: Krittika (2), Punarvasu (6), Uttara Phalguni (11), Vishakha (15), Uttara Ashadha (20), Purva Bhadrapada (24)
        const isTripadaNaks = naksIdx === 2 || naksIdx === 6 || naksIdx === 11 || naksIdx === 15 || naksIdx === 20 || naksIdx === 24;
        if (isDwipadaNaks) {
            return {
                active: true,
                name: 'Dwipushkar Yoga',
                hindiName: 'द्विपुष्कर योग',
                type: 'Dwipushkar',
                description: 'Dwipushkar Yoga is formed today by the convergence of a Bhadra Tithi, an auspicious weekday, and a Dwipada Nakshatra. Any positive or negative event/action performed during this yoga repeats twice.',
                suitability: 'Highly auspicious for purchasing assets, starting investments, and doing deeds of growth. Strictly avoid loans, conflicts, or negative actions.'
            };
        }
        else if (isTripadaNaks) {
            return {
                active: true,
                name: 'Tripushkar Yoga',
                hindiName: 'त्रिपुष्कर योग',
                type: 'Tripushkar',
                description: 'Tripushkar Yoga is formed today by the convergence of a Bhadra Tithi, an auspicious weekday, and a Tripada Nakshatra. Any positive or negative event/action performed during this yoga repeats three times.',
                suitability: 'Highly auspicious for purchasing assets, starting investments, and doing deeds of growth. Strictly avoid loans, conflicts, or negative actions.'
            };
        }
    }
    return {
        active: false,
        name: 'None',
        hindiName: 'कोई नहीं',
        type: 'None',
        description: 'No Dwipushkar or Tripushkar Yoga is active today.',
        suitability: 'Standard Muhurtha considerations apply.'
    };
}
const GANA_MAPPING = [
    "Deva", "Deva", "Manushya", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",
    "Manushya", "Manushya", "Manushya", "Deva", "Deva", "Deva", "Rakshasa", "Rakshasa", "Rakshasa",
    "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"
];
const YONI_MAPPING = [
    "Horse (Ashwa)", "Elephant (Gaja)", "Sheep (Mesha)", "Serpent (Sarpa)", "Serpent (Sarpa)", "Dog (Shvana)", "Cat (Marjara)", "Cat (Marjara)", "Mongoose (Nakula)",
    "Tiger (Vyaghra)", "Tiger (Vyaghra)", "Cow (Gau)", "Buffalo (Mahisha)", "Buffalo (Mahisha)", "Tiger (Vyaghra)", "Deer (Mriga)", "Deer (Mriga)", "Dog (Shvana)",
    "Dog (Shvana)", "Monkey (Vanara)", "Monkey (Vanara)", "Lion (Simha)", "Lion (Simha)", "Horse (Ashwa)", "Lion (Simha)", "Cow (Gau)", "Elephant (Gaja)"
];
const NADI_MAPPING = [
    "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya",
    "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
    "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya"
];
const SOLAR_MONTHS = [
    "Mesha (Vaisakha)", "Vrishabha (Jyeshtha)", "Mithuna (Ashadha)", "Karka (Shravana)",
    "Simha (Bhadrapada)", "Kanya (Ashvina)", "Tula (Kartika)", "Vrischika (Margashirsha)",
    "Dhanu (Pausha)", "Makara (Magha)", "Kumbha (Phalguna)", "Meena (Chaitra)"
];
export function getPanchangForDate(lat, lon, date) {
    const cacheKey = `${lat.toFixed(4)}_${lon.toFixed(4)}_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${date.getHours()}_${date.getMinutes()}`;
    if (panchangCache.has(cacheKey)) {
        return panchangCache.get(cacheKey);
    }
    // Use passed date directly for real-time live computations
    const normalizedDate = date;
    const solarTimes = calculateSolarTimes(lat, lon, normalizedDate);
    const positions = astronomicalEngine.getPanchangPositions(normalizedDate);
    const EXPECTED_PLANET_COUNT = 9;
    const isSwiss = positions.planets &&
        positions.planets.length === EXPECTED_PLANET_COUNT &&
        !positions.planets.every(p => p.sign === 'Aries') &&
        !positions.planets.every(p => p.sign === 'Pisces') &&
        positions.planets.every(planet => planet &&
            Number.isFinite(planet.longitude) &&
            Number.isFinite(planet.speed) &&
            typeof planet.sign === 'string' &&
            planet.sign.length > 0);
    const rawTithiIdx = positions.tithiIdx;
    const tithiIdx = (typeof rawTithiIdx === 'number' && !isNaN(rawTithiIdx)) ? Math.max(0, Math.min(29, Math.floor(rawTithiIdx))) : 0;
    const paksha = tithiIdx < 15 ? "Shukla" : "Krishna";
    const displayTithiIdx = (tithiIdx % 15 + 15) % 15;
    const baseTithiObj = TITHI_DETAILS[displayTithiIdx] || TITHI_DETAILS[0];
    const fullTithiName = `${paksha} ${baseTithiObj.name}`;
    const fullTithiNameHindi = `${paksha === "Shukla" ? "शुक्ल" : "कृष्ण"} ${(baseTithiObj.hindiName || '').split(" ")[0]}`;
    const tithiEndTime = subHoursToTimeStr(normalizedDate, positions.tithiRemainingHours || 0, isSwiss);
    const tithiStartTime = subHoursToTimeStr(normalizedDate, -(positions.tithiPassedHours || 0), isSwiss);
    const tithi = {
        name: fullTithiName,
        hindiName: fullTithiNameHindi,
        value: tithiIdx + 1,
        startTime: tithiStartTime,
        endTime: tithiEndTime,
        percentPassed: positions.tithiPercent || 0,
        lord: baseTithiObj.lord,
        deity: baseTithiObj.deity,
        isKshaya: positions.tithiRemainingHours < 1.0 && positions.tithiPassedHours < 1.0,
        isVriddhi: false
    };
    const rawNaksIdx = positions.naksIdx;
    const naksIdx = (typeof rawNaksIdx === 'number' && !isNaN(rawNaksIdx)) ? Math.max(0, Math.min(26, Math.floor(rawNaksIdx))) : 0;
    const baseNaksObj = NAKSHATRA_DETAILS[naksIdx] || NAKSHATRA_DETAILS[0];
    const naksEndTime = subHoursToTimeStr(normalizedDate, positions.naksRemainingHours || 0, isSwiss);
    // Compute dynamic Pada/Charan details based on Moon longitude
    const relativeLon = (positions.moonSidereal || 0) % 13.333333333333334;
    const pada = Math.floor(relativeLon / 3.3333333333333335) + 1;
    const moonSpeed = positions.planets?.find(p => p && p.name === 'Moon')?.speed || 13.176;
    const remainingPadaLon = (pada * 3.3333333333333335) - relativeLon;
    const padaRemainingHours = remainingPadaLon / (moonSpeed / 24);
    const padaEndTime = subHoursToTimeStr(normalizedDate, padaRemainingHours, isSwiss);
    const nakshatra = {
        ...baseNaksObj,
        endTime: naksEndTime,
        value: naksIdx + 1,
        pada,
        padaEndTime,
        gana: GANA_MAPPING[naksIdx] || GANA_MAPPING[0],
        yoni: YONI_MAPPING[naksIdx] || YONI_MAPPING[0],
        nadi: NADI_MAPPING[naksIdx] || NADI_MAPPING[0]
    };
    const rawYogaIdx = positions.yogaIdx;
    const yogaIdx = (typeof rawYogaIdx === 'number' && !isNaN(rawYogaIdx)) ? Math.max(0, Math.min(26, Math.floor(rawYogaIdx))) : 0;
    const yogaEndTime = subHoursToTimeStr(normalizedDate, positions.yogaRemainingHours || 0, isSwiss);
    const yogaString = YOGA_DETAILS[yogaIdx] || YOGA_DETAILS[0];
    const yogaNameEng = yogaString.split(" ")[0];
    const yogaMeaning = yogaString.includes("(") ? yogaString.slice(yogaString.indexOf("(") + 1, -1) : "Peaceful";
    const ASHUBH_YOGA_INDICES = [0, 5, 8, 9, 12, 14, 16, 18, 26]; // Vishkumbha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti
    const isYogaAuspicious = !ASHUBH_YOGA_INDICES.includes(yogaIdx);
    const yogaType = isYogaAuspicious ? "Shubh" : "Ashubh";
    const yogaDescriptions = {
        0: "Vishkumbha Yoga is associated with challenges and obstacles. Best to avoid starting major new works.",
        1: "Preeti Yoga promotes mutual love, friendship, and positive communication.",
        2: "Ayushman Yoga grants longevity, good health, and stable achievements.",
        3: "Saubhagya Yoga brings good fortune, prosperity, and happy undertakings.",
        4: "Shobhana Yoga promotes beauty, design, decoration, and artistic works.",
        5: "Atiganda Yoga indicates deep emotional blockages and high risks. Avoid starting major journeys.",
        6: "Sukarma Yoga is highly favorable for charity, religious acts, and helpful deeds.",
        7: "Dhriti Yoga gives patience, resolve, and stability for long-term planning.",
        8: "Shoola Yoga brings sharp conflicts or delays. Avoid initiating new investments.",
        9: "Ganda Yoga indicates vulnerability or obstacles in early stages. Focus on routine work.",
        10: "Vriddhi Yoga brings expansion, business growth, and intellectual success.",
        11: "Dhruva Yoga is favorable for constructing foundations, building houses, and permanent works.",
        12: "Vyaghata Yoga indicates severe risks or sudden setbacks. Avoid starting travel or conflicts.",
        13: "Harshana Yoga brings happiness, celebration, humor, and joy.",
        14: "Vajra Yoga is harsh and rigid. Avoid delicate negotiations or signing agreements.",
        15: "Siddhi Yoga gives quick completion, success in targets, and perfection.",
        16: "Vyatipata Yoga is highly inauspicious. Avoid starting all positive energy tasks or new ventures.",
        17: "Variyan Yoga brings comfort, luxury, and success in trade and commerce.",
        18: "Parigha Yoga indicates blockages or defensive battles. Best for security setups.",
        19: "Shiva Yoga is highly spiritual and auspicious for meditation and devotion.",
        20: "Siddha Yoga gives accomplishment, yogic focus, and deep learning.",
        21: "Sadhya Yoga makes goals achievable through efforts, study, and practices.",
        22: "Shubha Yoga is highly auspicious, bringing goodness, purity, and light.",
        23: "Shukla Yoga represents clarity, bright prospects, and clean initiatives.",
        24: "Brahma Yoga is favorable for knowledge, wisdom, and intellectual creation.",
        25: "Indra Yoga brings power, administrative success, and leadership tasks.",
        26: "Vaidhriti Yoga is highly inauspicious, ruled by intense energies. Strictly avoid auspicious events."
    };
    const yogaDescription = yogaDescriptions[yogaIdx] || (isYogaAuspicious ? "Auspicious daily yoga." : "Inauspicious daily yoga.");
    const yoga = {
        name: yogaNameEng,
        hindiName: yogaString,
        value: yogaIdx + 1,
        endTime: yogaEndTime,
        meaning: yogaMeaning,
        isAuspicious: isYogaAuspicious,
        type: yogaType,
        description: yogaDescription
    };
    const karanaVal = positions.karanaVal;
    const karanaEndTime = subHoursToTimeStr(normalizedDate, positions.karanaRemainingHours, isSwiss);
    const karanaName = KARANA_DETAILS[karanaVal];
    const ASHUBH_KARANA_INDICES = [6, 7, 8, 9]; // Vishti (Bhadra), Shakuni, Chatushpada, Naga
    const STHIRA_KARANA_INDICES = [7, 8, 9, 10]; // Shakuni, Chatushpada, Naga, Kimstughna
    const isKaranaAuspicious = !ASHUBH_KARANA_INDICES.includes(karanaVal);
    const karanaClassification = isKaranaAuspicious ? "Shubh" : "Ashubh";
    const isSthira = STHIRA_KARANA_INDICES.includes(karanaVal);
    const karanaNature = isSthira ? "Fixed" : "Movable";
    const karanaNatureHindi = isSthira ? "स्थिर" : "चर";
    const karanaDescriptions = {
        0: "Bava Karana is highly auspicious. Favorable for starting new projects, health-related activities, and creative works.",
        1: "Balava Karana is auspicious. Best suited for study, ceremonies, and tasks requiring intellectual efforts.",
        2: "Kaulava Karana is auspicious. Favorable for building relations, marriage, and friendship acts.",
        3: "Taitila Karana is auspicious. Best for administrative actions, government works, and buying property.",
        4: "Gara Karana is favorable. Good for agricultural activities, building houses, and routine domestic works.",
        5: "Vanija Karana is auspicious. Highly recommended for trade, business transactions, and commercial operations.",
        6: "Vishti Karana (Bhadra) is highly inauspicious. Strictly avoid starting new projects, journeys, or ceremonies. Favorable only for defensive or destructive tasks.",
        7: "Shakuni Karana is a fixed inauspicious Karana. Avoid auspicious beginnings. Suitable for medicines, herbs, and resolving disputes.",
        8: "Chatushpada Karana is a fixed inauspicious Karana. Avoid auspicious beginnings. Good for cattle-related works, charity, and ancestral rites.",
        9: "Naga Karana is a fixed inauspicious Karana. Avoid auspicious beginnings. Good for activities involving minerals, metals, and strategic actions.",
        10: "Kimstughna Karana is a fixed auspicious Karana. Favorable for initiating ceremonies, new works, and charitable activities."
    };
    const karanaDescription = karanaDescriptions[karanaVal] || (isKaranaAuspicious ? "Auspicious daily karana." : "Inauspicious daily karana.");
    const karana = {
        name: karanaName,
        hindiName: karanaName,
        value: karanaVal + 1,
        endTime: karanaEndTime,
        type: karanaNature,
        isAuspicious: isKaranaAuspicious,
        classification: karanaClassification,
        nature: karanaNature,
        natureHindi: karanaNatureHindi,
        description: karanaDescription
    };
    const totalKaranaIdx1 = tithiIdx * 2;
    const totalKaranaIdx2 = tithiIdx * 2 + 1;
    const isFirstHalfActive = positions.tithiPercent < 0.5;
    let k1EndTime = '';
    let k2EndTime = '';
    if (isFirstHalfActive) {
        k1EndTime = subHoursToTimeStr(normalizedDate, positions.karanaRemainingHours, isSwiss) + " तक";
        k2EndTime = tithi.endTime;
    }
    else {
        const totalTithiHours = positions.tithiRemainingHours + positions.tithiPassedHours;
        const firstKaranaEndHoursAgo = positions.tithiPassedHours - totalTithiHours / 2;
        if (firstKaranaEndHoursAgo > 0) {
            k1EndTime = subHoursToTimeStr(normalizedDate, -firstKaranaEndHoursAgo, isSwiss) + " पर (समाप्त)";
        }
        else {
            k1EndTime = "व्यतीत";
        }
        k2EndTime = subHoursToTimeStr(normalizedDate, positions.karanaRemainingHours, isSwiss) + " तक";
    }
    const getKaranaObject = (totalIdx, endTimeStr) => {
        let val = 0;
        if (totalIdx === 0)
            val = 10;
        else if (totalIdx === 57)
            val = 7;
        else if (totalIdx === 58)
            val = 8;
        else if (totalIdx === 59)
            val = 9;
        else
            val = (totalIdx - 1) % 7;
        const name = KARANA_DETAILS[val];
        const isAusp = !ASHUBH_KARANA_INDICES.includes(val);
        const classif = isAusp ? "Shubh" : "Ashubh";
        const isSth = STHIRA_KARANA_INDICES.includes(val);
        const nat = isSth ? "Fixed" : "Movable";
        const natHindi = isSth ? "स्थिर" : "चर";
        const desc = karanaDescriptions[val] || (isAusp ? "Auspicious daily karana." : "Inauspicious daily karana.");
        return {
            name,
            hindiName: name,
            value: val + 1,
            endTime: endTimeStr,
            type: nat,
            isAuspicious: isAusp,
            classification: classif,
            nature: nat,
            natureHindi: natHindi,
            description: desc
        };
    };
    const karana1 = getKaranaObject(totalKaranaIdx1, k1EndTime);
    const karana2 = getKaranaObject(totalKaranaIdx2, k2EndTime);
    const monthIdx = (positions.monthsSinceEpoch % 12 + 12) % 12;
    const monthInfo = MONTHS_ENGLISH_HINDI[monthIdx];
    const baseYear = date.getFullYear();
    let samvatVikram = baseYear + 57;
    let samvatShaka = baseYear - 78;
    const currentYearEpochStart = new Date(`${baseYear}-03-18T00:00:00`);
    if (date < currentYearEpochStart) {
        samvatVikram--;
        samvatShaka--;
    }
    const samvatGujarati = monthIdx >= 7 ? samvatVikram : samvatVikram - 1;
    const solarMonthIdx = Math.floor((positions.sunSidereal || 0) / 30);
    const solarMonth = SOLAR_MONTHS[solarMonthIdx];
    const ayana = (positions.sunSidereal >= 90 && positions.sunSidereal < 270) ? "Dakshinayana" : "Uttarayana";
    let monthAmantaHindi = monthInfo.hin;
    const purnimantaMonthIdx = paksha === 'Krishna' ? (monthIdx + 1) % 12 : monthIdx;
    let monthPurnimantaHindi = MONTHS_ENGLISH_HINDI[purnimantaMonthIdx].hin;
    let monthEng = monthInfo.eng;
    let monthHin = monthInfo.hin;
    if (positions.isAdhik) {
        monthAmantaHindi = `अधिक ${monthAmantaHindi}`;
        monthPurnimantaHindi = `अधिक ${monthPurnimantaHindi}`;
        monthEng = `Adhik ${monthEng}`;
        monthHin = `अधिक ${monthHin}`;
    }
    const praviste = Math.floor((positions.sunSidereal || 0) % 30) + 1;
    const hinduDate = {
        tithi,
        nakshatra,
        yoga,
        karana,
        karana1,
        karana2,
        paksha,
        month: monthEng,
        monthHindi: monthHin,
        monthAmantaHindi,
        monthPurnimantaHindi,
        ritu: monthInfo.ritu,
        samvatVikram,
        samvatShaka,
        samvatGujarati,
        solarMonth,
        isLeapMonth: false,
        ayana,
        praviste
    };
    const day = date.getDay();
    const sunriseMin = solarTimes.sunriseRaw;
    const sunsetMin = solarTimes.sunsetRaw;
    const dayLength = sunsetMin - sunriseMin;
    const partLength = dayLength / 8;
    const rahuPartIndexMap = [8, 2, 7, 5, 6, 4, 3];
    const rahuPart = rahuPartIndexMap[day];
    const rahuStartMin = sunriseMin + (rahuPart - 1) * partLength;
    const rahuEndMin = sunriseMin + rahuPart * partLength;
    const gulikPartIndexMap = [7, 6, 5, 4, 3, 2, 1];
    const gulikPart = gulikPartIndexMap[day];
    const gulikStartMin = sunriseMin + (gulikPart - 1) * partLength;
    const gulikEndMin = sunriseMin + gulikPart * partLength;
    const yamaPartIndexMap = [6, 5, 4, 3, 2, 1, 7];
    const yamaPart = yamaPartIndexMap[day];
    const yamaStartMin = sunriseMin + (yamaPart - 1) * partLength;
    const yamaEndMin = sunriseMin + yamaPart * partLength;
    const formatRawMin = (m) => {
        const normM = (m % 1440 + 1440) % 1440;
        let hrs = Math.floor(normM / 60);
        let mins = Math.floor(normM % 60);
        const ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        if (hrs === 0)
            hrs = 12;
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${ampm}`;
    };
    const rahuKaal = { start: formatRawMin(rahuStartMin), end: formatRawMin(rahuEndMin) };
    const gulikKaal = { start: formatRawMin(gulikStartMin), end: formatRawMin(gulikEndMin) };
    const yamagandam = { start: formatRawMin(yamaStartMin), end: formatRawMin(yamaEndMin) };
    // 1. Varjyam Calculation
    const VARJYAM_START_GHATIS = [
        50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14, 56, 24, 20, 10, 10, 18, 16, 24, 30
    ];
    const varjyamGhati = VARJYAM_START_GHATIS[naksIdx];
    const naksDuration = 24.2;
    const naksStartOffset = -positions.naksPercent * naksDuration;
    const varjyamStartOffset = naksStartOffset + (varjyamGhati / 60) * naksDuration;
    const varjyamEndOffset = varjyamStartOffset + (4 / 60) * naksDuration;
    const varjyamList = [
        {
            start: subHoursToTimeStr(normalizedDate, varjyamStartOffset, isSwiss),
            end: subHoursToTimeStr(normalizedDate, varjyamEndOffset, isSwiss)
        }
    ];
    // 2. Durmuhurat Calculation
    const durmuhuratList = [];
    const durmuhuratMap = {
        0: [13], // Sunday: 14th Muhurat (index 13)
        1: [8, 11], // Monday: 9th & 12th Muhurat (indices 8, 11)
        2: [1, 3], // Tuesday: 2nd & 4th Muhurat (indices 1, 3)
        3: [7], // Wednesday: 8th Muhurat (index 7)
        4: [6], // Thursday: 7th Muhurat (index 6)
        5: [8, 11], // Friday: 9th & 12th Muhurat (indices 8, 11)
        6: [0] // Saturday: 1st Muhurat (index 0)
    };
    const durmuhuratIndices = durmuhuratMap[day] || [];
    const part15 = dayLength / 15;
    for (const idx of durmuhuratIndices) {
        const durStartMin = sunriseMin + idx * part15;
        const durEndMin = sunriseMin + (idx + 1) * part15;
        durmuhuratList.push({
            start: formatRawMin(durStartMin),
            end: formatRawMin(durEndMin)
        });
    }
    // 3. Shubh Yogas Calculation
    const shubhYogas = [];
    const baseHours = 0.0;
    const sunriseOffsetBase = (sunriseMin / 60) - baseHours;
    const nextSunriseOffsetBase = sunriseOffsetBase + 24;
    const naksEndOffset = (1 - positions.naksPercent) * naksDuration;
    // Helper to check overlap and format
    const getOverlapInterval = () => {
        const yogaStart = Math.max(sunriseOffsetBase, naksStartOffset);
        const yogaEnd = Math.min(nextSunriseOffsetBase, naksEndOffset);
        if (yogaStart < yogaEnd) {
            return {
                start: subHoursToTimeStr(normalizedDate, yogaStart, isSwiss),
                end: subHoursToTimeStr(normalizedDate, yogaEnd, isSwiss)
            };
        }
        return null;
    };
    // A. Sarvartha Siddhi Yoga
    const siddhiMap = {
        0: [12, 18, 11, 20, 25, 7, 8], // Sun: Hasta, Mula, U.Phalguni, U.Ashadha, U.Bhadrapada, Pushya, Ashlesha
        1: [21, 3, 4, 7, 16], // Mon: Shravana, Rohini, Mrigashira, Pushya, Anuradha
        2: [0, 25, 2, 8], // Tue: Ashvini, U.Bhadrapada, Krittika, Ashlesha
        3: [3, 16, 12, 2, 4], // Wed: Rohini, Anuradha, Hasta, Krittika, Mrigashira
        4: [26, 16, 0, 6, 7], // Thu: Revati, Anuradha, Ashvini, Punarvasu, Pushya
        5: [26, 16, 0, 6, 21], // Fri: Revati, Anuradha, Ashvini, Punarvasu, Shravana
        6: [21, 3, 14] // Sat: Shravana, Rohini, Swati
    };
    if ((siddhiMap[day] || []).includes(naksIdx)) {
        const interval = getOverlapInterval();
        if (interval) {
            shubhYogas.push({
                name: "Sarvartha Siddhi Yoga",
                hindiName: "सर्वार्थ सिद्धि योग",
                start: interval.start,
                end: interval.end
            });
        }
    }
    // B. Amrit Siddhi Yoga
    const amritSiddhiMap = {
        0: 12, // Sun + Hasta
        1: 4, // Mon + Mrigashira
        2: 0, // Tue + Ashvini
        3: 16, // Wed + Anuradha
        4: 7, // Thu + Pushya
        5: 26, // Fri + Revati
        6: 3 // Sat + Rohini
    };
    if (amritSiddhiMap[day] === naksIdx) {
        const interval = getOverlapInterval();
        if (interval) {
            shubhYogas.push({
                name: "Amrit Siddhi Yoga",
                hindiName: "अमृत सिद्धि योग",
                start: interval.start,
                end: interval.end
            });
        }
    }
    // C. Ravi Yoga
    const sunNaksIdx = Math.floor((positions.sunSidereal || 0) / (360 / 27));
    const moonNaksIdx = naksIdx;
    const distance = (moonNaksIdx - sunNaksIdx + 27) % 27 + 1;
    const raviYogaDistances = [4, 6, 9, 10, 13, 20];
    if (raviYogaDistances.includes(distance)) {
        const interval = getOverlapInterval();
        if (interval) {
            shubhYogas.push({
                name: "Ravi Yoga",
                hindiName: "रवि योग",
                start: interval.start,
                end: interval.end
            });
        }
    }
    // 4. Tara Ast-Uday (Planet Combustion Logic)
    const combustionList = [];
    const sunPlanet = positions.planets?.find(p => p.name === 'Sun');
    const jupiterPlanet = positions.planets?.find(p => p.name === 'Jupiter');
    const venusPlanet = positions.planets?.find(p => p.name === 'Venus');
    const getAngularDistance = (lon1, lon2) => {
        const diff = Math.abs(lon1 - lon2) % 360;
        return diff > 180 ? 360 - diff : diff;
    };
    if (sunPlanet) {
        if (jupiterPlanet) {
            const dist = getAngularDistance(sunPlanet.longitude, jupiterPlanet.longitude);
            const isCombust = dist <= 11;
            combustionList.push({
                name: "Jupiter",
                hindiName: "बृहस्पति (गुरु)",
                isCombust,
                angularDistance: Number(dist.toFixed(2))
            });
        }
        if (venusPlanet) {
            const dist = getAngularDistance(sunPlanet.longitude, venusPlanet.longitude);
            const threshold = venusPlanet.isRetrograde ? 8 : 10;
            const isCombust = dist <= threshold;
            combustionList.push({
                name: "Venus",
                hindiName: "शुक्र",
                isCombust,
                angularDistance: Number(dist.toFixed(2))
            });
        }
    }
    // 5. Panchak Logic Calculation
    let panchakObj = {
        active: false,
        name: "No Panchak",
        hindiName: "पंचक नहीं है",
        type: "None",
        typeHindi: "कोई नहीं",
        description: "Moon is not in the last five Nakshatras."
    };
    const isPanchak = (naksIdx === 22 && pada >= 3) || (naksIdx > 22 && naksIdx <= 26);
    if (isPanchak) {
        const panchakTypes = {
            0: { eng: "Rog Panchak", hin: "रोग पंचक", desc: "Rog Panchak leads to health issues and physical/mental stress. Avoid starting travel or healthcare therapies." },
            1: { eng: "Raj Panchak", hin: "राज पंचक", desc: "Raj Panchak is favorable for professional work, property transactions, government matters, and acquiring wealth." },
            2: { eng: "Agni Panchak", hin: "अग्नि पंचक", desc: "Agni Panchak is associated with risks of fire, disputes, and litigation. Avoid construction or machinery work." },
            3: { eng: "Samanya Panchak", hin: "सामान्य पंचक", desc: "Neutral Panchak. Exercise normal cautions for construction, purchasing cots, and traveling South." },
            4: { eng: "Samanya Panchak", hin: "सामान्य पंचक", desc: "Neutral Panchak. Exercise normal cautions for construction, purchasing cots, and traveling South." },
            5: { eng: "Chor Panchak", hin: "चोर पंचक", desc: "Chor Panchak is highly unfavorable for financial dealings, business investments, and long travels. Risk of loss." },
            6: { eng: "Mrityu Panchak", hin: "मृत्यु पंचक", desc: "Mrityu Panchak is highly inauspicious. Avoid starting new ventures, construction, or high-risk tasks." }
        };
        const pType = panchakTypes[day] || panchakTypes[3];
        panchakObj = {
            active: true,
            name: pType.eng,
            hindiName: pType.hin,
            type: pType.eng,
            typeHindi: pType.hin,
            description: pType.desc
        };
    }
    // 6. Gand Mool Nirnay Calculation
    let gandMoolObj = {
        isGandMool: false,
        nakshatraName: nakshatra.name,
        nakshatraHindiName: nakshatra.hindiName,
        rulingPlanet: "None",
        rulingPlanetHindi: "कोई नहीं",
        description: "Active Nakshatra is not a Gand Mool Nakshatra."
    };
    const GAND_MOOL_NAKSHATRAS = [0, 8, 9, 17, 18, 26]; // Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati
    if (GAND_MOOL_NAKSHATRAS.includes(naksIdx)) {
        const isKetuRuled = [0, 9, 18].includes(naksIdx);
        gandMoolObj = {
            isGandMool: true,
            nakshatraName: nakshatra.name,
            nakshatraHindiName: nakshatra.hindiName,
            rulingPlanet: isKetuRuled ? "Ketu" : "Mercury",
            rulingPlanetHindi: isKetuRuled ? "केतु" : "बुध",
            description: isKetuRuled
                ? `Gand Mool Nakshatra ruled by Ketu. Considered energetically sensitive. Performing Gand Mool Shanti Puja is traditionally recommended.`
                : `Gand Mool Nakshatra ruled by Mercury. Located at zodiac sandhi (junction). Considered energetically sensitive. Performing Gand Mool Shanti Puja is traditionally recommended.`
        };
    }
    // 7. Surya Nakshatra & Charan Calculation
    const rawSunSidereal = (positions.sunSidereal || 0) % 360;
    const normalizedSunSidereal = rawSunSidereal < 0 ? rawSunSidereal + 360 : rawSunSidereal;
    const sunNaksIdxVal = Math.max(0, Math.min(26, Math.floor(normalizedSunSidereal / 13.333333333333334)));
    const sunNaksRelativeLon = normalizedSunSidereal % 13.333333333333334;
    const sunNaksPada = Math.floor(sunNaksRelativeLon / 3.3333333333333335) + 1;
    const baseSunNaksObj = NAKSHATRA_DETAILS[sunNaksIdxVal] || NAKSHATRA_DETAILS[0];
    const suryaNakshatraObj = {
        name: baseSunNaksObj.name,
        hindiName: baseSunNaksObj.hindiName,
        pada: sunNaksPada,
        lord: baseSunNaksObj.lord,
        deity: baseSunNaksObj.deity
    };
    // 8. Chandra Nakshatra & Charan Calculation
    const baseMoonNaksObj = NAKSHATRA_DETAILS[naksIdx] || NAKSHATRA_DETAILS[0];
    const chandraNakshatraObj = {
        name: baseMoonNaksObj.name,
        hindiName: baseMoonNaksObj.hindiName,
        pada: pada,
        padaEndTime: padaEndTime,
        lord: baseMoonNaksObj.lord,
        deity: baseMoonNaksObj.deity
    };
    // 9. Ritu Calculation
    const sunSignIdx = Math.max(0, Math.min(11, Math.floor(normalizedSunSidereal / 30)));
    const rituMap = {
        11: { eng: "Vasanta", hin: "वसन्त", desc: "Vasanta Ritu represents Spring, characterized by blooming flowers and moderate climate. Ruled by Venus, it is ideal for festivals, marriages, and new beginnings." },
        0: { eng: "Vasanta", hin: "वसन्त", desc: "Vasanta Ritu represents Spring, characterized by blooming flowers and moderate climate. Ruled by Venus, it is ideal for festivals, marriages, and new beginnings." },
        1: { eng: "Grishma", hin: "ग्रीष्म", desc: "Grishma Ritu represents Summer, characterized by intense heat and longer days. Ruled by Sun and Mars, it is a period of high energy and physical efforts." },
        2: { eng: "Grishma", hin: "ग्रीष्म", desc: "Grishma Ritu represents Summer, characterized by intense heat and longer days. Ruled by Sun and Mars, it is a period of high energy and physical efforts." },
        3: { eng: "Varsha", hin: "वर्षा", desc: "Varsha Ritu represents Monsoon, bringing life-giving rain to the earth. Ruled by Moon, it is auspicious for agricultural planning and water purification." },
        4: { eng: "Varsha", hin: "वर्षा", desc: "Varsha Ritu represents Monsoon, bringing life-giving rain to the earth. Ruled by Moon, it is auspicious for agricultural planning and water purification." },
        5: { eng: "Sharad", hin: "शरद", desc: "Sharad Ritu represents Autumn, bringing clear skies and cool breezes after the rains. Ruled by Mercury, it is highly favorable for business, learning, and Navratri festivals." },
        6: { eng: "Sharad", hin: "शरद", desc: "Sharad Ritu represents Autumn, bringing clear skies and cool breezes after the rains. Ruled by Mercury, it is highly favorable for business, learning, and Navratri festivals." },
        7: { eng: "Hemanta", hin: "हेमन्त", desc: "Hemanta Ritu represents Pre-winter, bringing pleasant cool weather and harvest. Ruled by Jupiter, it is excellent for religious vows, health building, and charity." },
        8: { eng: "Hemanta", hin: "हेमन्त", desc: "Hemanta Ritu represents Pre-winter, bringing pleasant cool weather and harvest. Ruled by Jupiter, it is excellent for religious vows, health building, and charity." },
        9: { eng: "Shishira", hin: "शिशिर", desc: "Shishira Ritu represents Winter/Post-winter, bringing cold winds and shedding of leaves. Ruled by Saturn, it is a period of rest, rejuvenation, and inner spiritual focus." },
        10: { eng: "Shishira", hin: "शिशिर", desc: "Shishira Ritu represents Winter/Post-winter, bringing cold winds and shedding of leaves. Ruled by Saturn, it is a period of rest, rejuvenation, and inner spiritual focus." }
    };
    const solarRituData = rituMap[sunSignIdx] || rituMap[0];
    const lunarRituName = (monthInfo.ritu || "Vasanta").split(" ")[0];
    const lunarRituMap = {
        "Vasanta": { eng: "Vasanta", hin: "वसन्त" },
        "Grishma": { eng: "Grishma", hin: "ग्रीष्म" },
        "Varsha": { eng: "Varsha", hin: "वर्षा" },
        "Sharad": { eng: "Sharad", hin: "शरद" },
        "Hemant": { eng: "Hemanta", hin: "हेमन्त" },
        "Shishir": { eng: "Shishira", hin: "शिशिर" }
    };
    const lunarRituData = lunarRituMap[lunarRituName] || { eng: lunarRituName, hin: lunarRituName };
    const rituDetailsObj = {
        solarRitu: solarRituData.eng,
        solarRituHindi: solarRituData.hin,
        lunarRitu: lunarRituData.eng,
        lunarRituHindi: lunarRituData.hin,
        description: solarRituData.desc
    };
    const payaObj = calculatePaya(naksIdx);
    const dagdaTithiObj = calculateDagdaTithi(day, tithiIdx);
    const agniVaasObj = calculateAgniVaas(day, tithiIdx);
    const shivaVaasObj = calculateShivaVaas(tithiIdx);
    const pushkarYogObj = calculatePushkarYog(day, tithiIdx, naksIdx);
    const choghadiyaDaySeqs = [
        ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
        ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit"],
        ["Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
        ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh"],
        ["Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"],
        ["Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal"],
        ["Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal"]
    ];
    const choghadiyaNightSeqs = [
        ["Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh"], // Sunday (0)
        ["Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal"], // Monday (1)
        ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal"], // Tuesday (2)
        ["Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg"], // Wednesday (3)
        ["Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"], // Thursday (4)
        ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog"], // Friday (5)
        ["Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh"] // Saturday (6)
    ];
    const daySeq = choghadiyaDaySeqs[day];
    const nightSeq = choghadiyaNightSeqs[day];
    const nightPartLength = (1440 - dayLength) / 8;
    const getQualityAndName = (type) => {
        switch (type) {
            case "Amrit": return { name: "Amrit (Nectar)", hindiName: "अमृत", type: "Amrit", quality: "Excellent" };
            case "Shubh": return { name: "Shubh (Auspicious)", hindiName: "शुभ", type: "Shubh", quality: "Good" };
            case "Labh": return { name: "Labh (Gain)", hindiName: "लाभ", type: "Labh", quality: "Excellent" };
            case "Chal": return { name: "Chal (Neutral)", hindiName: "चल", type: "Chal", quality: "Neutral" };
            case "Kaal": return { name: "Kaal (Loss)", hindiName: "काल", type: "Kaal", quality: "Bad" };
            case "Rog": return { name: "Rog (Disease)", hindiName: "रोग", type: "Rog", quality: "Inauspicious" };
            default: return { name: "Udveg (Anxiety)", hindiName: "उद्वेग", type: "Udveg", quality: "Inauspicious" };
        }
    };
    const choghadiya = [];
    for (let i = 0; i < 8; i++) {
        const startM = sunriseMin + i * partLength;
        const endM = sunriseMin + (i + 1) * partLength;
        const item = getQualityAndName(daySeq[i]);
        choghadiya.push({
            name: item.name,
            hindiName: item.hindiName,
            type: item.type,
            quality: item.quality,
            startTime: formatRawMin(startM),
            endTime: formatRawMin(endM),
            isDay: true
        });
    }
    for (let i = 0; i < 8; i++) {
        const startM = (sunsetMin + i * nightPartLength) % 1440;
        const endM = (sunsetMin + (i + 1) * nightPartLength) % 1440;
        const item = getQualityAndName(nightSeq[i]);
        choghadiya.push({
            name: item.name,
            hindiName: item.hindiName,
            type: item.type,
            quality: item.quality,
            startTime: formatRawMin(startM),
            endTime: formatRawMin(endM),
            isDay: false
        });
    }
    const moonTimes = astronomicalEngine.getMoonTimes(solarTimes.sunriseRaw, solarTimes.sunsetRaw, tithiIdx, date, lat, lon);
    const moonriseRaw = moonTimes.moonriseRaw;
    const moonsetRaw = moonTimes.moonsetRaw;
    const dayHoraLength = (sunsetMin - sunriseMin) / 12;
    const nightHoraLength = (sunriseMin + 1440 - sunsetMin) / 12;
    const HORA_LORDS = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
    const weekdayToHoraStart = [0, 3, 6, 2, 5, 1, 4];
    const startIdx = weekdayToHoraStart[day];
    const HORA_INFO_MAP = {
        "Sun": { hindi: "सूर्य (Surya)", quality: "Neutral", qualityHindi: "सामान्य / मध्यम", color: "text-orange-650 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/15 border-orange-200/50 dark:border-orange-950/30", benefits: "प्रशासनिक कार्य, सरकारी काम, नौकरी, राजनीति और पदभार ग्रहण।" },
        "Venus": { hindi: "शुक्र (Shukra)", quality: "Auspicious", qualityHindi: "अत्यंत शुभ / अमृत", color: "text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-950/15 border-pink-200/50 dark:border-pink-950/30", benefits: "कला, संगीत, यात्रा, आभूषण व वस्त्र क्रय, सौंदर्य प्रसाधन, विवाह चर्चा।" },
        "Mercury": { hindi: "बुध (Budh)", quality: "Auspicious", qualityHindi: "शुभ", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-200/50 dark:border-emerald-950/30", benefits: "व्यापार, लेखन, शिक्षण, बैंक कार्य, नया निवेश और गणितीय कार्य।" },
        "Moon": { hindi: "चंद्र (Chandra)", quality: "Auspicious", qualityHindi: "शुभ", color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/15 border-cyan-200/50 dark:border-cyan-950/30", benefits: "यात्रा, गृह प्रवेश, जल/तरल व्यवसाय, नवीन योजनाएँ और संगीत।" },
        "Saturn": { hindi: "शनि (Shani)", quality: "Inauspicious", qualityHindi: "अशुभ", color: "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-zinc-900/30 border-slate-200/50 dark:border-slate-800/30", benefits: "लोहा, तेल, भूमि, निर्माण कार्य और पुरानी मशीनरी का लेन-देन।" },
        "Jupiter": { hindi: "गुरु (Guru)", quality: "Auspicious", qualityHindi: "अत्यंत शुभ / अमृत", color: "text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/15 border-amber-200/50 dark:border-amber-950/30", benefits: "धार्मिक कार्य, पूजा-अनुष्ठान, शिक्षा, गुरु दीक्षा, धन निवेश।" },
        "Mars": { hindi: "मंगल (Mangal)", quality: "Inauspicious", qualityHindi: "अशु्भ", color: "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/15 border-rose-200/50 dark:border-rose-950/30", benefits: "शारीरिक गतिविधि, साहस, भूमि या पराक्रम कार्य। गृह प्रवेश या विवाह वर्जित।" }
    };
    const horaList = [];
    for (let i = 0; i < 12; i++) {
        const startM = sunriseMin + i * dayHoraLength;
        const endM = sunriseMin + (i + 1) * dayHoraLength;
        const lordIdx = (startIdx + i) % 7;
        const lordName = HORA_LORDS[lordIdx];
        const info = HORA_INFO_MAP[lordName];
        horaList.push({
            number: i + 1,
            lord: lordName,
            lordHindi: info.hindi,
            startTime: formatRawMin(startM),
            endTime: formatRawMin(endM),
            isDay: true,
            quality: info.quality,
            qualityHindi: info.qualityHindi,
            colorClass: info.color,
            benefits: info.benefits
        });
    }
    for (let i = 0; i < 12; i++) {
        const startM = (sunsetMin + i * nightHoraLength) % 1440;
        const endM = (sunsetMin + (i + 1) * nightHoraLength) % 1440;
        const lordIdx = (startIdx + 12 + i) % 7;
        const lordName = HORA_LORDS[lordIdx];
        const info = HORA_INFO_MAP[lordName];
        horaList.push({
            number: i + 13,
            lord: lordName,
            lordHindi: info.hindi,
            startTime: formatRawMin(startM),
            endTime: formatRawMin(endM),
            isDay: false,
            quality: info.quality,
            qualityHindi: info.qualityHindi,
            colorClass: info.color,
            benefits: info.benefits
        });
    }
    // Bhadra (Vishti Karana) Engine calculations
    const isBhadraActive = karanaVal === 6;
    let bhadraObj = undefined;
    if (isBhadraActive) {
        // Bhadra resides in Swarga, Patal, or Prithvi based on Moon Sign
        const moonSignIdx = Math.floor((positions.moonSidereal || 0) / 30);
        let vas = "Prithvi (Earth) - Avoid major ceremonies!";
        let vasHindi = "मृत्युलोक / पृथ्वीलोक (अशुभ)";
        if ([0, 1, 2, 7].includes(moonSignIdx)) {
            vas = "Swarga (Heaven) - Auspicious for spiritual acts";
            vasHindi = "स्वर्गलोक (शुभ)";
        }
        else if ([5, 6, 8, 9].includes(moonSignIdx)) {
            vas = "Patal (Nadir) - Favorable for secrets/underground works";
            vasHindi = "पाताललोक (शुभ)";
        }
        const bhadraStartOffset = -positions.karanaPercent * 12;
        const bhadraStartTime = subHoursToTimeStr(normalizedDate, bhadraStartOffset, isSwiss);
        const bhadraEndTime = karanaEndTime;
        const mukhaTime = subHoursToTimeStr(normalizedDate, bhadraStartOffset + 5, isSwiss);
        const puchhaTime = subHoursToTimeStr(normalizedDate, bhadraStartOffset + 10, isSwiss);
        bhadraObj = {
            active: true,
            startTime: bhadraStartTime,
            endTime: bhadraEndTime,
            vas,
            vasHindi,
            mukha: mukhaTime,
            puchha: puchhaTime
        };
    }
    // 28 Anandadi Yogas Engine
    const ANANDADI_YOGAS = [
        { name: "Ananda", hindi: "आनन्द", isAuspicious: true, desc: "Auspicious yoga for initiating all positive endeavors." },
        { name: "Kaladanda", hindi: "कालदण्ड", isAuspicious: false, desc: "Inauspicious yoga. Avoid major decisions and ceremonies." },
        { name: "Dhumra", hindi: "धूम्र", isAuspicious: false, desc: "Inauspicious yoga. May bring confusion or obstruction." },
        { name: "Prajapati", hindi: "प्रजापति", isAuspicious: true, desc: "Auspicious yoga for progeny, rituals, and new beginnings." },
        { name: "Saubhagya", hindi: "सौभाग्य", isAuspicious: true, desc: "Brings immense good fortune, marital harmony, and prosperity." },
        { name: "Dhwanksha / Aadal", hindi: "ध्वंक्ष / आदल योग", isAuspicious: false, desc: "Special daily astrological combination (Aadal Yoga)." },
        { name: "Dhwaja", hindi: "ध्वज", isAuspicious: true, desc: "Favorable for victory, status elevation, and competition." },
        { name: "Shrivatsa", hindi: "श्रीवत्स", isAuspicious: true, desc: "Brings divine blessings of Goddess Lakshmi and wealth." },
        { name: "Vajra", hindi: "वज्र", isAuspicious: false, desc: "Requires caution. Avoid long travels and heavy investments." },
        { name: "Mudgara", hindi: "मुद्गर", isAuspicious: false, desc: "Inauspicious yoga. Delays in work are possible." },
        { name: "Chhatra", hindi: "छत्र", isAuspicious: true, desc: "Provides protection from adversaries and grants success." },
        { name: "Mitra", hindi: "मित्र", isAuspicious: true, desc: "Ideal for forming partnerships, friendships, and agreements." },
        { name: "Manasa", hindi: "मानस", isAuspicious: true, desc: "Grants mental peace, clarity, and intellectual fulfillment." },
        { name: "Padma", hindi: "पद्म", isAuspicious: true, desc: "Brings purity, spiritual growth, and material prosperity." },
        { name: "Lambaka", hindi: "लम्बक", isAuspicious: false, desc: "Inauspicious yoga. Exercise care during travel." },
        { name: "Utpata", hindi: "उत्पात", isAuspicious: false, desc: "Brings sudden hurdles. Postpone major celebrations." },
        { name: "Mrityu", hindi: "मृत्यु", isAuspicious: false, desc: "Highly inauspicious. Avoid all auspicious ceremonies." },
        { name: "Kaana", hindi: "काण", isAuspicious: false, desc: "Inauspicious yoga. Avoid signing important contracts." },
        { name: "Siddhi", hindi: "सिद्धि", isAuspicious: true, desc: "Ensures success in undertaken endeavors and goals." },
        { name: "Shubh", hindi: "शुभ", isAuspicious: true, desc: "Favorable yoga for general daily activities." },
        { name: "Amrita", hindi: "अमृत", isAuspicious: true, desc: "Nectar yoga. Grants longevity, health, and success." },
        { name: "Musala", hindi: "मुसल", isAuspicious: false, desc: "Inauspicious yoga. Avoid conflicts and litigation." },
        { name: "Gada", hindi: "गदा", isAuspicious: false, desc: "Inauspicious yoga. Avoid starting physical construction." },
        { name: "Matanga", hindi: "मातंग", isAuspicious: true, desc: "Grants royal favor, leadership, and public respect." },
        { name: "Rakshasa", hindi: "राक्षस", isAuspicious: false, desc: "Inauspicious yoga. Avoid auspicious domestic rites." },
        { name: "Chara", hindi: "चर", isAuspicious: true, desc: "Favorable for vehicle purchase, travel, and movement." },
        { name: "Sthira", hindi: "स्थिर", isAuspicious: true, desc: "Favorable for permanent investments, house entry, and foundation." },
        { name: "Vardhamana", hindi: "वर्धमान", isAuspicious: true, desc: "Brings growth, expansion, and continuous progress." }
    ];
    const WEEKDAY_START_NAKSHATRAS = [0, 4, 8, 12, 16, 19, 25];
    const dayOfWeek = normalizedDate.getDay();
    const startNaks = WEEKDAY_START_NAKSHATRAS[dayOfWeek];
    const curNaksIdx = positions.naksIdx;
    const anandadiIdx = (curNaksIdx - startNaks + 28) % 28;
    const anandadiItem = ANANDADI_YOGAS[anandadiIdx] || ANANDADI_YOGAS[0];
    const anandadiYoga = {
        name: anandadiItem.name,
        nameHindi: anandadiItem.hindi,
        isAuspicious: anandadiItem.isAuspicious,
        endTime: naksEndTime,
        description: anandadiItem.desc
    };
    const result = {
        date: date.toISOString().split("T")[0],
        hinduDate,
        sunrise: solarTimes.sunrise,
        sunset: solarTimes.sunset,
        moonrise: moonTimes.moonrise,
        moonset: moonTimes.moonset,
        rahuKaal,
        gulikKaal,
        yamagandam,
        choghadiya,
        hora: horaList,
        bhadra: bhadraObj,
        anandadiYoga,
        planets: positions.planets,
        varjyam: varjyamList,
        durmuhurat: durmuhuratList,
        shubhYogas: shubhYogas,
        combustion: combustionList,
        panchak: panchakObj,
        gandMool: gandMoolObj,
        suryaNakshatra: suryaNakshatraObj,
        chandraNakshatra: chandraNakshatraObj,
        rituDetails: rituDetailsObj,
        paya: payaObj,
        dagdaTithi: dagdaTithiObj,
        agniVaas: agniVaasObj,
        shivaVaas: shivaVaasObj,
        pushkarYog: pushkarYogObj,
        ishtakala: calculateIshtakala(date, solarTimes.sunriseRaw)
    };
    if (isSwiss) {
        panchangCache.set(cacheKey, result);
    }
    return result;
}
function subHoursToTimeStr(date, hours, isSwiss = false) {
    const baseHours = 0.0;
    const targetDate = new Date(date.getTime() + (baseHours + hours) * 36e5);
    let hrs = targetDate.getHours();
    const mins = targetDate.getMinutes();
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12;
    if (hrs === 0)
        hrs = 12;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${ampm}`;
}
export function getMuhuratsForPanchang(panchang) {
    const parseMin = (str) => {
        const [time, ampm] = str.split(" ");
        let [hrs, mins] = time.split(":").map(Number);
        if (ampm === "PM" && hrs !== 12)
            hrs += 12;
        if (ampm === "AM" && hrs === 12)
            hrs = 0;
        return hrs * 60 + mins;
    };
    const sMin = parseMin(panchang.sunrise);
    const eMin = parseMin(panchang.sunset);
    const dayLength = eMin - sMin;
    const part15 = dayLength / 15;
    const nightLength = 1440 - dayLength;
    const nightPart15 = nightLength / 15;
    const abhijitStart = sMin + 7 * part15;
    const abhijitEnd = sMin + 8 * part15;
    const formatMinStr = (m) => {
        let hrs = Math.floor(m / 60);
        let mins = Math.floor(m % 60);
        const ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        if (hrs === 0)
            hrs = 12;
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${ampm}`;
    };
    const brahmaStart = (sMin - 2 * nightPart15 + 1440) % 1440;
    const brahmaEnd = (sMin - nightPart15 + 1440) % 1440;
    const godhuliStart = (eMin - 1 + 1440) % 1440;
    const godhuliEnd = (eMin + 19) % 1440;
    const rahuStart = parseMin(panchang.rahuKaal.start);
    const rahuEnd = parseMin(panchang.rahuKaal.end);
    const amritChog = panchang.choghadiya.find((c) => c.isDay && c.type === "Amrit");
    const shubhChog = panchang.choghadiya.find((c) => c.isDay && c.type === "Shubh");
    const list = [
        {
            id: "brahma",
            name: "Brahma Muhurat",
            hindiName: "ब्रह्म मुहूर्त",
            startTime: formatMinStr(brahmaStart),
            endTime: formatMinStr(brahmaEnd),
            type: "Amrit",
            description: "Ideal for yoga, meditation, Vedic recitation, or initiating intellectual endeavors.",
            suitability: "Highly auspicious for spiritual and mental awakenings."
        },
        {
            id: "abhijit",
            name: "Abhijit Muhurat",
            hindiName: "अभिजीत मुहूर्त",
            startTime: formatMinStr(abhijitStart),
            endTime: formatMinStr(abhijitEnd),
            type: "Shubh",
            description: "The mid-day winner of all blocks. Destroys multiple planetary blockages instantly.",
            suitability: "Auspicious for launching business, starting trips, or financial deposits."
        },
        {
            id: "godhuli",
            name: "Godhuli Muhurat",
            hindiName: "गोधूलि मुहूर्त",
            startTime: formatMinStr(godhuliStart),
            endTime: formatMinStr(godhuliEnd),
            type: "Shubh",
            description: "Evening threshold. Peaceful, divine energy associated with Lord Krishna.",
            suitability: "Excellent for house contracts, marriage vows, or devotional singing."
        },
        {
            id: "rahu_kaal",
            name: "Rahu Kaal (Avoid)",
            hindiName: "राहुकाल (वर्जित)",
            startTime: panchang.rahuKaal.start,
            endTime: panchang.rahuKaal.end,
            type: "Ashubh",
            description: "Period under Rahu influence. Leads to delays, arguments, or bad outcomes.",
            suitability: "Strictly avoid starting any new venture, transaction, or ceremony."
        },
        {
            id: "yamagandam",
            name: "Yamagandam (Avoid)",
            hindiName: "यमगण्ड काल (वर्जित)",
            startTime: panchang.yamagandam.start,
            endTime: panchang.yamagandam.end,
            type: "Ashubh",
            description: "Inauspicious period under Jupiter's son Yamadev's influence. Traditionally considered bad for new beginnings.",
            suitability: "Strictly avoid starting journeys, financial transactions, or major events."
        },
        {
            id: "gulik_kaal",
            name: "Gulik Kaal (Avoid)",
            hindiName: "गुलिक काल (वर्जित)",
            startTime: panchang.gulikKaal.start,
            endTime: panchang.gulikKaal.end,
            type: "Ashubh",
            description: "Inauspicious period under Saturn's son Gulik's influence. Delay and obstacles are common.",
            suitability: "Avoid starting any new work; however, normal/routine tasks may continue."
        },
        {
            id: "amrit_chog",
            name: "Amrit Choghadiya",
            hindiName: "अमृत चौघड़िया",
            startTime: amritChog ? amritChog.startTime : "08:30 AM",
            endTime: amritChog ? amritChog.endTime : "10:00 AM",
            type: "Amrit",
            description: "Daytime nectar period. Blessed by divine planetary alignments.",
            suitability: "Highly suitable for buying precious gold, metals, and education initiations."
        },
        {
            id: "shubh_chog",
            name: "Shubh Choghadiya",
            hindiName: "शुभ चौघड़िया",
            startTime: shubhChog ? shubhChog.startTime : "11:30 AM",
            endTime: shubhChog ? shubhChog.endTime : "01:00 PM",
            type: "Shubh",
            description: "Daytime auspicious period, suitable for ongoing prosperity.",
            suitability: "Best for travel, social gatherings, signing agreements."
        }
    ];
    if (panchang.durmuhurat) {
        panchang.durmuhurat.forEach((dm, idx) => {
            list.push({
                id: `durmuhurat_${idx}`,
                name: "Durmuhurat (Avoid)",
                hindiName: "दुर्मुहूर्त (वर्जित)",
                startTime: dm.start,
                endTime: dm.end,
                type: "Ashubh",
                description: "Inauspicious time of the day based on planetary weekday configuration.",
                suitability: "Avoid initiating any positive energy works, signing contracts, or traveling."
            });
        });
    }
    return list;
}
export const FESTVALS_PRESETS = [
    {
        id: "f1",
        name: "Maha Shivratri",
        hindiName: "महाशिवरात्रि",
        date: "2026-02-15",
        month: "Phalguna",
        tithi: "Krishna Chaturdashi",
        description: "Devotees fast, meditate and offer prayers to Lord Shiva on this grand night of divine communion.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f2",
        name: "Holi (Dhulandi)",
        hindiName: "होली",
        date: "2026-03-04",
        month: "Phalguna",
        tithi: "Purnima",
        description: "The ancient festival of colors, celebrating the victory of good over evil, the arrival of spring, and loving play.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f3",
        name: "Rama Navami",
        hindiName: "राम नवमी",
        date: "2026-03-27",
        month: "Chaitra",
        tithi: "Shukla Navami",
        description: "Birth celebration of Lord Rama, the Seventh Avatar of Vishnu, practicing righteousness (Dharmic discipline).",
        type: "Jayanti",
        isAuspicious: true
    },
    {
        id: "f4",
        name: "Kamada Ekadashi",
        hindiName: "कामदा एकादशी",
        date: "2026-03-29",
        month: "Chaitra",
        tithi: "Shukla Ekadashi",
        description: "Fast to fulfill worldly wishes and purify karmic blocks on the day of Vishnu.",
        type: "Ekadashi",
        isAuspicious: true
    },
    {
        id: "f5",
        name: "Chaitra Purnima Yogi Fast",
        hindiName: "चैत्र पूर्णिमा",
        date: "2026-04-02",
        month: "Chaitra",
        tithi: "Purnima",
        description: "Beautiful full moon day associated with Hanuman Jayanti prayers and sacred baths.",
        type: "Purnima",
        isAuspicious: true
    },
    {
        id: "f6",
        name: "Akshaya Tritiya",
        hindiName: "अक्षय तृतीया",
        date: "2026-04-19",
        month: "Vaisakha",
        tithi: "Shukla Tritiya",
        description: "Day of eternal prosperity. Any gold purchase or asset investment today continuously grows forever.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f7",
        name: "Mohini Ekadashi",
        hindiName: "मोहिनी एकादशी",
        date: "2026-04-27",
        month: "Vaisakha",
        tithi: "Shukla Ekadashi",
        description: "Fasting dedicated to Mohini, the female dynamic avatar of Lord Vishnu to overcome attachments.",
        type: "Ekadashi",
        isAuspicious: true
    },
    {
        id: "f8",
        name: "Buddha Purnima",
        hindiName: "बुद्ध पूर्णिमा / बुद्ध जयंती",
        date: "2026-05-01",
        month: "Vaisakha",
        tithi: "Purnima",
        description: "Gautam Buddha Jayanti celebrating birth, enlightenment and final Mahaparinirvana.",
        type: "Jayanti",
        isAuspicious: true
    },
    {
        id: "f9",
        name: "Nirjala Ekadashi",
        hindiName: "निर्जला एकादशी",
        date: "2026-05-26",
        month: "Jyeshtha",
        tithi: "Shukla Ekadashi",
        description: "The toughest of 24 Ekadashis. Fasted strictly without drinking a single drop of water to secure maximum merit.",
        type: "Ekadashi",
        isAuspicious: true
    },
    {
        id: "f10",
        name: "Jyeshtha Purnima Snan",
        hindiName: "ज्येष्ठ पूर्णिमा",
        date: "2026-05-31",
        month: "Jyeshtha",
        tithi: "Purnima",
        description: "Sacred river baths and fasting for high spiritual clarity, dedicating vows of marital fidelity.",
        type: "Purnima",
        isAuspicious: true
    },
    {
        id: "f11",
        name: "Guru Purnima",
        hindiName: "गुरु पूर्णिमा",
        date: "2026-06-29",
        month: "Ashadha",
        tithi: "Purnima",
        description: "Festival honoring spiritual and academic teachers, historically associated with Sage Vyasa.",
        type: "Purnima",
        isAuspicious: true
    },
    {
        id: "f12",
        name: "Raksha Bandhan",
        hindiName: "रक्षा बंधन",
        date: "2026-08-28",
        month: "Shravana",
        tithi: "Purnima",
        description: "Celebrated bond of protection where sisters knot a sacred thread (rakhi) on their brothers wrist.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f13",
        name: "Krishna Janmashtami",
        hindiName: "कृष्ण जन्माष्टमी",
        date: "2026-09-04",
        month: "Bhadrapada",
        tithi: "Krishna Ashtami",
        description: "Birth of Lord Krishna with mid-night devotional bhajans, rocking the cradle, and grand delicious feasting.",
        type: "Jayanti",
        isAuspicious: true
    },
    {
        id: "f14",
        name: "Ganesh Chaturthi",
        hindiName: "गणेश चतुर्थी",
        date: "2026-09-15",
        month: "Bhadrapada",
        tithi: "Shukla Chaturthi",
        description: "Grand home-welcoming of Lord Vigneshwara, the destroyer of all obstacles, enjoying sweet Modaks.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f15",
        name: "Shardiya Navratri Begin",
        hindiName: "शारदीय नवरात्रि प्रारंभ",
        date: "2026-10-12",
        month: "Ashwin",
        tithi: "Shukla Pratipada",
        description: "Dandiya dances and clay pot garba, marking nine sacred nights of Goddess Durga armor and power.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f16",
        name: "Dussehra (Vijayadashami)",
        hindiName: "दशहरा / विजयादशमी",
        date: "2026-10-21",
        month: "Ashwin",
        tithi: "Shukla Dashami",
        description: "Effigy burning of demon Ravana to symbolize victory of Lord Ram, expressing ultimate universal truth.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f17",
        name: "Dhanteras Puja",
        hindiName: "धनतेरस",
        date: "2026-11-06",
        month: "Kartik",
        tithi: "Krishna Trayodashi",
        description: "Welcoming Goddess Lakshmi and Lord Dhanvantari (God of health) with fresh metal utensils or silver coins.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f18",
        name: "Diwali (Deepawali)",
        hindiName: "दीपावली",
        date: "2026-11-08",
        month: "Kartik",
        tithi: "Amavasya",
        description: "Festival of Lights, welcoming Rama back to Ayodhya. Rows of clay diyas, dynamic sweets, Lakshmi Puja.",
        type: "Major",
        isAuspicious: true
    },
    {
        id: "f19",
        name: "Dev Utthana Ekadashi",
        hindiName: "देवोत्थान एकादशी",
        date: "2026-11-20",
        month: "Kartik",
        tithi: "Shukla Ekadashi",
        description: "God Vishnu wakes up from four months of cosmic sleep, starting the auspicious Hindu marriage season.",
        type: "Ekadashi",
        isAuspicious: true
    },
    {
        id: "f20",
        name: "Kartik Purnima (Dev Deepawali)",
        hindiName: "कार्तिक पूर्णिमा (देव दीपावली)",
        date: "2026-11-24",
        month: "Kartik",
        tithi: "Purnima",
        description: "The gods celebrate Diwali in Varanasi. Sacred illuminated ghats are covered with millions of lamps.",
        type: "Purnima",
        isAuspicious: true
    }
];
export function getChoghadiyaPresentationData(panchang, currentTime) {
    const currentMin = currentTime.getHours() * 60 + currentTime.getMinutes();
    const parseTimeToMinutes = (timeStr) => {
        const [time, ampm] = timeStr.split(" ");
        if (!time || !ampm)
            return 0;
        let [hrs, mins] = time.split(":").map(Number);
        if (ampm === "PM" && hrs !== 12)
            hrs += 12;
        if (ampm === "AM" && hrs === 12)
            hrs = 0;
        return hrs * 60 + mins;
    };
    const isTimeInInterval = (currMin, startStr, endStr) => {
        const start = parseTimeToMinutes(startStr);
        const end = parseTimeToMinutes(endStr);
        if (start <= end) {
            return currMin >= start && currMin < end;
        }
        else {
            return currMin >= start || currMin < end;
        }
    };
    const sunriseMin = parseTimeToMinutes(panchang.sunrise);
    const sunsetMin = parseTimeToMinutes(panchang.sunset);
    let isDaytime = true;
    if (sunriseMin <= sunsetMin) {
        isDaytime = currentMin >= sunriseMin && currentMin < sunsetMin;
    }
    else {
        isDaytime = currentMin >= sunriseMin || currentMin < sunsetMin;
    }
    const getChoghadiyaColor = (type) => {
        switch (type) {
            case "Amrit":
                return "#10B981";
            case "Shubh":
                return "#059669";
            case "Labh":
                return "#34D399";
            case "Char":
            case "Chal":
                return "#E6DFD3";
            case "Udveg":
                return "#D97706";
            case "Kaal":
                return "#DC2626";
            case "Rog":
                return "#B91C1C";
            default:
                return "#C9A66B";
        }
    };
    const choghadiyaList = (panchang.choghadiya || []).map((ch) => ({
        ...ch,
        color: getChoghadiyaColor(ch.type)
    }));
    const activeChoghadiya = (panchang.choghadiya || []).find((ch) => isTimeInInterval(currentMin, ch.startTime, ch.endTime));
    const activeIndex = activeChoghadiya ? choghadiyaList.findIndex((ch) => ch.name === activeChoghadiya.name && ch.startTime === activeChoghadiya.startTime) : -1;
    const displayStartTime = activeChoghadiya?.startTime || "";
    const displayEndTime = activeChoghadiya?.endTime || "";
    return {
        choghadiyaList,
        activeIndex,
        displayStartTime,
        displayEndTime
    };
}
export function calculateIshtakala(date, sunriseRaw) {
    const currentMin = date.getHours() * 60 + date.getMinutes();
    let elapsedMinutes = currentMin - sunriseRaw;
    if (elapsedMinutes < 0) {
        elapsedMinutes += 1440;
    }
    const totalGhati = elapsedMinutes / 24;
    const ghati = Math.floor(totalGhati);
    const vighati = Math.floor((elapsedMinutes % 24) * 2.5);
    return {
        ghati,
        vighati,
        formatted: `${ghati} घटी, ${vighati} विघटी`
    };
}
