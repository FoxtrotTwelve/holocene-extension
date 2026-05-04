
//The Era Tag pattern options to search for - variable used throughout 
const ERA_PATTERN = "BCE|BC|CE|AD|BP|A\\.D\\.|B\\.C\\.E\\.|B\\.C\\.|C\\.E\\.|B\\.P\\.";

//The most likely strings to find around uncertain dates
const FUZZY_MODIFIER = "(?:early|mid-|late|c\\.|ca\\.|circa|~|around)\\s*";

//Oridinal number variables:
const ORDINAL_ONES = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
  sixth: 6, seventh: 7, eighth: 8, ninth: 9
};
const ORDINAL_TEENS = {
  tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13,
  fourteenth: 14, fifteenth: 15, sixteenth: 16,
  seventeenth: 17, eighteenth: 18, nineteenth: 19
};
const ORDINAL_TENS = {
  twentieth: 20, thirtieth: 30, fortieth: 40,
  fiftieth: 50, sixtieth: 60, seventieth: 70,
  eightieth: 80, ninetieth: 90
};
const TENS_BASE = {
  twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90
};
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

//The main Regex to search for already converted dates (for protection so there isn't a double processing)
const masterConvertedRegex = /\b(?:early|mid-|late|c\.|ca\.|circa|~|around)?\s*\d+(?:s)?(?:–\d+(?:s)?)?\s+H\.E\.[^\[]*\[converted from [^\]]+\]/gi;
        //   /\(Holocene Era\) \[converted from .*?\]/;

//Regex for single year dates:
const yearRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +      // group 1: fuzzy prefix (optional)
  `(?:(AD|A\\.D\\.)\\s*)?` +      // group 2: prefix era (optional)
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` + // group 3: year
  //`(?:\\s*(${ERA_PATTERN}))\\b`,       // group 4: suffix era
  //`\\s*(${ERA_PATTERN})(?=\\b|[^a-zA-Z])`,
  `\\s*(${ERA_PATTERN})(\\.)?`,           // group 4: suffix era, group 5: trailing period
  "gi"
);

//Old Regex:
            // const yearRegex = new RegExp(
            //   `\\b(${FUZZY_MODIFIER})?` +        // group 1: fuzzy prefix (optional)
            //   `(?:(AD|A\\.D\\.)\\s*)?` +        // group 2: prefix era (optional)
            //   `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` + // group 3: year
            //   `\\s*(${ERA_PATTERN})\\.?\\b`,     // group 4: suffix era, with word boundary
            //   "gi"
            // );

            // const yearRegex = new RegExp(
            //   `\\b(${FUZZY_MODIFIER})?` +               // group 1: fuzzy prefix (optional)
            //   `(?:(AD|A\\.D\\.)\\s*)?` +               // group 2: prefix era (optional)
            //   `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +      // group 3: year
            //   `(?:\\s*(${ERA_PATTERN}))?\\b`, // group 4: optional suffix era
            //   "gi"
            // );

//Regex for year ranges:
const rangeRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +             // group 1: fuzzy prefix
  `(?:(AD|A\\.D\\.)\\s*)?` +             // group 2: prefix era
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +    // group 3: start year
  `(?:\\s*(${ERA_PATTERN}))?` +           // group 4: start era (optional)
  `\\s*(?:-|–|to)\\s*` +
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +    // group 5: end year
  `(?:\\s*(${ERA_PATTERN}))?` +           // group 6: end era (optional)
  //`\\b`,
  `(?=\\s|$|[.,;:])`,
  "gi"
);

//Regex for Century references (e.g., "15th century BCE"):
// const centuryRegex = new RegExp(
//   `\\b(${FUZZY_MODIFIER})?(\\d+)(st|nd|rd|th)\\s+century\\s*(${ERA_PATTERN})?\\b`,
//   "gi"
// );
const centuryRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?(\\d+)(st|nd|rd|th)\\s+century(?:\\s+(${ERA_PATTERN}))?(\\s*)`,
  "gi"
);
console.log("UPDATED CENTURY REGEX ACTIVE");

//Regex for Plural references (e.g., "1800s BCE"):
//const pluralRegex = /\b(\d{1,4})s(?!\s*H\.E\.)\s*(${ERA_PATTERN})?\b/gi;
//const pluralRegex = new RegExp( `\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?`, "gi" );
const pluralRegex = new RegExp(
    `\\b(${FUZZY_MODIFIER})?(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, 
    "gi"
);

//Regex for written centuries:
const writtenCenturyRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +
  `((?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-\\w+)?|` +
  `first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|` +
  `tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|` +
  `sixteenth|seventeenth|eighteenth|nineteenth|` +
  `twentieth|thirtieth|fortieth|fiftieth|sixtieth|seventieth|eightieth|ninetieth)` +
  `\\s+century\\s*(${ERA_PATTERN})?\\b`,
  "gi"
);

//Regex for written hundreds:
const writtenHundredsRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +
  `(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\\s+hundreds` +
  `(?:\\s*(${ERA_PATTERN}))?\\b`,
  "gi"
);


//Regex for decades:
    //const decadeRegex = /\b(\d{3,4})s?(?:\s*(?:–|-|to)\s*(\d{2,4})s?)?\b/g;
    //const decadeRegex = /\b(\d{3,4})s?(?:[-–](\d{2,4})s?)?\b/g;
    //const decadeRegex = /\b(\d{4})s?(?:\s*[-–]\s*(\d{2,4})s?)?\b/g;
    //const decadeRegex = /\b(\d{4})s(?:\s*[-–]\s*(\d{2,4})s?)?\b/g;
    //const decadeRegex = /\b(\d{2}[1-9]0)s(?:\s*[-–]\s*(\d{2,3}[0-9]?0)s?)?\b/g;
    //const decadeRegex = /\b(\d{4}0?s?)\s*(?:[-–]\s*(\d{2,4}s?))?\b/g;
    //const decadeRegex = /\b(\d{2}[1-9]0s?)\s*(?:[-–]\s*(\d{2,4}s?))?\b/g;
    //const decadeRegex = /\b(\d{2}[1-9]0s?)\s*(?:[-–]\s*(\d{2,4}s?|\d{2}))?\b/g;
    //const decadeRegex = /\b(\d{2}[1-9]0s?)\s*(?:[-–]\s*(\d{2,4}s?))?\b/g;

const decadeRegex = /\b(\d{2}[1-9]0s?)\s*(?:[-–]\s*(\d{2,4}s?|\d{2}))?\b/g; //(This doesn't break any previous test!)

    //const decadeRegex = /\b(\d{2}[0-9]0s?)\s*(?:[-–]\s*(\d{2,4}s?))?\b/g;
    //const decadeRegex = /\b(\d{2,4}s?)(?:[–-](\d{2,4}s?))?\b/g;



//Regex for abbreviated decades:
//const abbreviatedDecadeRegex = /\b(\d{4}s?)[-–](\d{2}s?)\b/g;
const abbreviatedDecadeRegex = /\b(\d{4}s?)\s*[-–]\s*(\d{2}s?)\b/g;






//-----------HELPER METHODS-----------------

//Removes any commas you might find in numbers 4 digits or more.
//Returns number without punctuation
function parseYear(yearStr) {
    return parseInt(yearStr.replace(/,/g, ""), 10);
}

//Normalizes the Era tag to not contain punctuation
//e.g. C.E. => CE
function normalizeEra(era) {
    if (!era || typeof era !== "string") return "CE";

    era = era.replace(/\./g, "").toUpperCase();

    if (era === "AD") {
        era = "CE";
    } else if (era === "BC") {
        era = "BCE";
    }

    return era;
}

/**
 * Returns a properly formatted prefix for converted dates.
 * Preserves hyphens without adding extra space, adds space for word prefixes.
 * 
 * Examples:
 *   "mid-"   -> "mid-"
 *   "early"  -> "early "
 *   ""       -> ""
 */
function formatPrefix(prefix) {
    if (!prefix) return "";
    prefix = prefix.trim();
    return prefix.endsWith("-") ? prefix : prefix + " ";
}

//Returns the correct ordinal suffix for appending in final string
function getOrdinalSuffix(n) {
    const j = n % 10;
    const k = n % 100;

    if (k >= 11 && k <= 13) return "th";

    if (j === 1) return "st";
    if (j === 2) return "nd";
    if (j === 3) return "rd";

    return "th";
}

//Converts from BP to BCE
function convertFromBPToBC(year){
    return year - 1950 + 1;
}

//Converts from BP to CE
function convertFromBPToAD(year){
    return 1950-year;
}

//Handles year conversion from BC/BCE, AD/CE, and BP into Holocene Era
function convertYear(year, era) {
    if (typeof year === "string" && year.includes("H.E.")) {
        return year;
    }

    if (!era) era = "CE";

    if (era === "BP") {
        if (1950 - year > 0) {
            return (1950 - year) + 10000; // CE → HE
        } else {
            return 10001 - (year - 1950 + 1); // BCE → HE
        }
    }

    if (era === "BC" || era === "BCE") {
        return 10001 - year;
    }

    return year + 10000;
}

//Converts year like above but this method is used by the written hundreds function
function convertHundredYear(year, era) {
    if (typeof year === "string" && year.includes("H.E.")) {
        return year;
    }

    if (era === "BC" || era === "BCE") {
        return 10001 - year;
    } else {
        return year + 10000; // AD / CE
    }
}

//Check for strings that might be non-dates
function isLikelyUnlabeledYear(match, nodeValue, index) {
    const year = parseInt(match, 10);

    //Plausible year range
    if (year < 100 || year > 3000) return false;

    //Avoid times (e.g., 12:30)
    if (nodeValue[index - 1] === ":" || nodeValue[index + match.length] === ":") return false;

    //Avoid being part of a longer number with punctuation
    if (nodeValue[index - 1] && /\d/.test(nodeValue[index - 1])) return false;
    if (nodeValue[index + match.length] && /\d/.test(nodeValue[index + match.length])) return false;

    //Avoid currency symbols immediately before ($100, €100, £100, etc.)
    if ("$€£¥₹₩₽฿₺₦₫₱¢₴₿".includes(nodeValue[index - 1])) return false;
    //Avoid percent sign immediately after (100%)
    if (nodeValue[index + match.length] === "%") return false;
    // Multiplication sign — dimension/resolution patterns (1920×1080)
    if (nodeValue[index + match.length] === '×') return false;
    if (nodeValue[index - 1] === '×') return false;

    // Get sentence-bounded context windows (same approach as isLikelyYearRange)
    const rawBefore = nodeValue.slice(Math.max(0, index - 60), index);
    const rawAfter  = nodeValue.slice(index + match.length,
                                      Math.min(nodeValue.length, index + match.length + 60));

    const sentenceBoundaryRegex = /[.!?]\s*(?=[A-Z])/g;
    let lastBoundary = 0;
    let bm;
    while ((bm = sentenceBoundaryRegex.exec(rawBefore)) !== null) {
        lastBoundary = bm.index + bm[0].length;
    }
    const before = rawBefore.slice(lastBoundary).toLowerCase();

    const firstSentenceEnd = /[.!?]\s*(?=[A-Z])/.exec(rawAfter);
    const after = (firstSentenceEnd
        ? rawAfter.slice(0, firstSentenceEnd.index + 1)
        : rawAfter
    ).toLowerCase();

    // Single-letter designator + hyphen prefix (I-495, A-320, etc.)
    if (/\b[A-Za-z]-$/.test(rawBefore)) return false;

    // Strong indicators — if present anywhere in the sentence, definitely a year.
    // Fuzzy modifiers (around, circa, etc.) are intentionally NOT in this list because
    // they also modify quantities ("Around 1400 ships sailed"). They are handled below.
    const strongIndicators = [
        "ce", "bce", "bc", "ad", "bp", "h.e.",
        "c.e.", "b.c.e", "b.c.", "a.d.", "b.p.",
        "century", "centuries", "decade", "era", "epoch",
        "born", "died", "death", "birth", "lived", "lifespan", "lifetime",
        "reign", "reigned", "ruled", "governed",
        "conquered", "invaded", "defeated", "fought",
        "existed", "survived", "flourished", "declined", "collapsed",
        "founded", "established", "built", "constructed", "destroyed",
        "explored", "discovered", "settled", "migrated"
    ];

    const hasStrongIndicator = strongIndicators.some(indicator => {
        const escaped = indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const endBoundary = /\w$/.test(indicator) ? '\\b' : '';
        const pattern = new RegExp(`\\b${escaped}${endBoundary}`, 'i');
        return pattern.test(before) || pattern.test(after);
    });

    if (hasStrongIndicator) return true;

    // Fiscal period notation: Q3 2024, H1 2023 — treat the following year as temporal
    const fiscalPrecedingMatch = rawBefore.match(/\b(Q[1-4]|H[12])\s*$/i);
    if (fiscalPrecedingMatch) return true;

    // Words immediately before the number that mark it as a non-year identifier
    const precedingInhibitors = new Set([
        // Road / transportation
        'highway', 'hwy', 'route', 'rte', 'freeway', 'expressway', 'interstate',
        // Network / tech standards
        'port', 'rfc', 'isbn', 'issn', 'sku',
        // Legal / administrative
        'patent', 'law', 'ordinance', 'statute', 'regulation',
        // HTTP / error codes
        'http', 'error', 'status',
        // Document references
        'page', 'p.', 'figure', 'fig', 'exhibit', 'appendix', 'chapter', 'article', 'section', 'number',
        // Score / rating context
        'score', 'scored', 'scoring', 'rating', 'rated', 'ranked', 'ranking',
        // Misc designators
        'form', 'episode', 'ep', 'channel', 'track', 'gate', 'exit', 'room', 'floor', 'code',
    ]);
    const immPrecMatch = before.match(/\b([a-z.]+)\s*$/);
    const immPrecWord = immPrecMatch ? immPrecMatch[1] : '';
    if (precedingInhibitors.has(immPrecWord)) return false;

    // If a count noun follows the number, it is likely a quantity, not a year.
    // Applies to all unlabeled years (not just fuzzy-prefixed ones).
    // Bare years with nothing after ("1948") are safe — afterWordMatch will be null.
    const verbsEndingInS = [
        "is", "was", "has", "does", "goes", "says", "comes",
        "seems", "appears", "means", "remains", "starts", "begins", "ends",
        "takes", "makes", "gives", "gets", "becomes", "proves", "shows",
        "includes", "contains", "runs", "leads", "marks", "occurs", "follows",
        // Common perception / cognition
        "sees", "feels", "knows", "thinks", "hears", "believes", "notices",
        // Common action
        "uses", "needs", "wants", "keeps", "puts", "turns", "calls", "moves",
        "works", "finds", "tells", "helps", "holds", "plays", "reads", "writes",
        "lives", "stands", "looks", "lets", "sets", "brings", "leaves", "sends",
        "wins", "adds", "builds", "opens", "closes", "breaks", "grows", "pays",
        "asks", "sits", "cuts", "hits", "buys", "changes",
        // Common formal / technical
        "creates", "provides", "requires", "allows", "expects", "suggests",
        "returns", "produces", "applies", "defines", "describes",
        // State / existence
        "exists", "concerns", "matters", "happens", "differs", "relates",
        // Cognition / communication
        "imagines", "assumes", "argues", "mentions", "declares", "compares",
        "refers", "prefers", "listens", "acknowledges", "recommends", "announces",
        // Emotion / social
        "loves", "cares", "shares", "deserves", "engages", "challenges", "encourages",
        // Change / process
        "combines", "determines", "examines", "evolves", "resolves", "reduces",
        "introduces", "improves", "removes", "approves", "advances", "expands",
        "extends", "replaces", "converts", "enhances", "continues", "involves",
        // Motion / physical
        "drives", "carries", "flies", "falls", "rises", "guides", "wears",
        "raises", "dies", "tries",
        // Interaction / general action
        "covers", "discovers", "offers", "serves", "saves", "spends", "attends",
        "tends", "responds", "manages", "fixes", "mixes", "depends", "intends",
        "defends", "pretends", "prepares", "handles", "feeds", "gathers",
        // Result / achievement
        "succeeds", "proceeds", "receives", "achieves", "supports", "connects",
        "protects", "affects", "reflects", "selects", "collects", "directs",
        "detects", "corrects", "counts", "reports", "observes",
        // Other common
        "survives", "earns", "learns", "solves", "exchanges", "arranges",
        "traces", "causes", "decides"
    ];
    const adjectivesEndingInS = [
        // -ous adjectives
        "ambitious", "analogous", "anonymous", "anxious", "atrocious", "audacious", "auspicious",
        "boisterous", "callous", "capricious", "carnivorous", "cautious", "ceremonious",
        "conspicuous", "contagious", "contentious", "continuous", "copious", "courageous",
        "courteous", "credulous", "curious", "dangerous", "dexterous", "dubious", "egregious",
        "enormous", "erroneous", "fabulous", "facetious", "fallacious", "famous", "ferocious",
        "fictitious", "furious", "garrulous", "generous", "glorious", "gorgeous", "gracious",
        "gratuitous", "gregarious", "grievous", "harmonious", "hazardous", "heinous", "hideous",
        "hilarious", "humongous", "humorous", "ignominious", "illustrious", "impervious",
        "indigenous", "industrious", "infamous", "ingenious", "injurious", "innocuous",
        "instantaneous", "jealous", "joyous", "laborious", "ludicrous", "luminous", "luxurious",
        "malicious", "marvelous", "melodious", "meticulous", "miraculous", "miscellaneous",
        "mischievous", "monotonous", "monstrous", "murderous", "mysterious", "nauseous",
        "nefarious", "nervous", "notorious", "noxious", "numerous", "oblivious", "obvious",
        "odious", "ominous", "omnivorous", "outrageous", "pernicious", "pious", "piteous",
        "pompous", "populous", "portentous", "precious", "preposterous", "prestigious",
        "previous", "prodigious", "promiscuous", "prosperous", "raucous", "rebellious",
        "religious", "ridiculous", "rigorous", "righteous", "ruinous", "scandalous",
        "scrupulous", "sensuous", "serious", "simultaneous", "sinuous", "specious",
        "spontaneous", "spurious", "strenuous", "studious", "sumptuous", "synonymous",
        "tempestuous", "tenacious", "treacherous", "tumultuous", "ubiquitous", "unanimous",
        "unconscious", "unctuous", "various", "venomous", "vicious", "virtuous", "vivacious",
        "vociferous", "zealous",
        // -less adjectives
        "aimless", "artless", "baseless", "blameless", "breathless", "careless", "ceaseless",
        "childless", "clueless", "cloudless", "countless", "dauntless", "defenseless",
        "effortless", "endless", "expressionless", "faultless", "fearless", "flawless",
        "formless", "groundless", "guiltless", "guileless", "hapless", "harmless", "heartless",
        "helpless", "homeless", "hopeless", "humorless", "jobless", "lawless", "lifeless",
        "limitless", "listless", "loveless", "matchless", "meaningless", "merciless", "mindless",
        "motionless", "nameless", "needless", "noiseless", "painless", "peerless", "pitiless",
        "pointless", "powerless", "purposeless", "reckless", "regardless", "relentless",
        "remorseless", "restless", "ruthless", "seamless", "senseless", "shameless", "shapeless",
        "sleepless", "speechless", "spineless", "spotless", "stainless", "stateless", "tasteless",
        "thankless", "thoughtless", "timeless", "trackless", "useless", "voiceless", "weightless",
        "wireless", "witless", "worthless",
        // ordinal-style and other adjectives ending in s
        "bogus", "express", "gross", "surplus", "plus", "minus"
    ];
    const irregularPlurals = [
        // Original
        "men", "women", "children", "people",
        "mice", "geese", "teeth", "feet", "oxen", "lice",
        "sheep", "deer", "fish", "moose", "bison",
        // Zero-change animals
        "cattle", "elk", "buffalo", "swine",
        "trout", "salmon", "carp", "cod", "herring", "tuna", "shrimp", "squid",
        "quail", "grouse",
        // Zero-change other
        "aircraft", "spacecraft", "offspring", "dice",
        // Latin -um → -a plurals
        "data", "media", "bacteria", "curricula", "spectra", "strata",
        "larvae", "errata", "formulae", "antennae", "vertebrae",
        // Latin -us → -i plurals
        "alumni", "fungi", "cacti", "nuclei", "stimuli",
        "radii", "syllabi", "octopi", "hippopotami",
        // Greek -on → -a plurals
        "criteria", "phenomena", "automata",
        // Other
        "dormice", "brethren", "kine",
        // Latin -um/-us/-a variants (less common)
        "corpora", "genera", "addenda", "memoranda", "referenda",
        // Latin -a/-ae feminines
        "alumnae", "nebulae", "algae", "minutiae", "ova",
        // Greek -a plurals
        "stigmata", "schemata",
        // Latin -us → -i (additional)
        "foci", "loci", "calculi", "moduli", "bronchi",
        // Loanwords with zero-change or foreign plural
        "magi", "paparazzi", "graffiti", "samurai",
        // Zero-change fish (additional)
        "pike", "mackerel", "perch", "bream", "plaice", "flounder",
        // Zero-change animals (additional)
        "wildebeest", "gnu", "ibis",
        // Nationality words — lowercase because `after` is always .toLowerCase()'d before matching
        "japanese", "chinese", "vietnamese", "portuguese",
        "swiss", "lebanese", "thai", "norse",
        // Religious/mythological
        "seraphim", "cherubim",
        // Nationality -ese
        "sudanese", "taiwanese", "congolese", "senegalese", "maltese", "nepalese", "burmese",
        "faroese", "javanese", "balinese", "cantonese", "togolese", "gabonese", "timorese",
        "guyanese", "sinhalese", "bhutanese", "milanese", "viennese", "sundanese", "assamese", "ceylonese",
        // Nationality -ish
        "english", "irish", "british", "welsh", "scottish", "danish", "swedish", "polish",
        "turkish", "kurdish", "flemish", "cornish", "amish", "spanish", "finnish",
        // Nationality -ch
        "french", "dutch",
        // Indigenous / ethnic peoples — zero-change
        "hmong", "inuit", "maori", "maasai", "sioux", "iroquois", "cherokee", "navajo", "apache", "lakota",
        "zulu", "maya", "hausa", "yoruba", "tuareg", "berber", "fulani", "bedouin", "romani", "quechua",
        "aymara", "ojibwe", "delaware", "hopi", "zuni", "shawnee", "seminole", "cree", "yupik", "aleut",
        "hui", "miao", "yi", "bantu", "khoisan", "ndebele", "shona", "xhosa", "sotho", "tswana",
        "lenape", "anishinaabe",
        // Historical peoples / dynasties — zero-change
        "ninja", "ronin", "shogun", "ming", "tang", "qing", "zhou", "shang", "song", "sui", "yuan", "han", "manchu",
        // Science — Biology
        "protozoa", "mitochondria", "cilia", "flagella", "septa", "spermatozoa", "ganglia", "atria",
        "foramina", "viscera", "stomata", "mycelia", "thalli", "sporangia", "villi", "glomeruli",
        "medusae", "archaea", "rhizobia",
        // Science — Physics / Astronomy / Mathematics
        "quanta", "maxima", "minima", "extrema", "optima", "novae", "supernovae", "coronae", "aurorae",
        "equilibria", "polyhedra", "tetrahedra", "hexahedra", "octahedra", "dodecahedra", "icosahedra",
        "lemmata", "rhombi", "nimbi", "cumulonimbi",
        // Historical Latin terms
        "denarii", "sestertii", "aurei", "solidi", "gladii", "ballistae", "scuta", "pila", "hastae", "loricae",
        "drachmae", "oboli", "tesserae", "insulae", "tabernae", "thermae", "centuriae", "stipendia",
        "tributa", "symposia", "auditoria", "desiderata", "corrigenda", "agenda", "insignia",
        "emporia", "gymnasia", "colloquia", "trivia", "consortia",
        // Zero-change animals — additional
        "reindeer", "caribou", "char", "dace", "roach", "rudd", "chub", "tench", "turbot", "halibut",
        "sprat", "sole", "walleye", "lungfish", "impala", "kudu", "springbok", "eland", "gemsbok", "oryx",
        "yak", "swordfish", "starfish", "crayfish", "catfish", "goldfish", "jellyfish", "cuttlefish",
        "bluefish", "dogfish", "pufferfish", "clownfish", "angelfish", "needlefish",
        // Italian loanwords
        "panini", "ravioli", "tortellini", "biscotti", "cannoli", "gelati", "zucchini", "gnocchi",
        "broccoli", "linguine", "rigatoni", "arancini", "cappuccini",
        // Hebrew / Semitic plurals
        "kibbutzim", "moshavim", "midrashim", "elohim",
        // Other loanwords and irregular forms
        "watercraft", "hovercraft", "manx", "moorish", "frankish", "lacunae", "fasciae", "sequelae",
        "laminae", "papillae", "bursae", "scapulae", "sarissae", "hakka", "hokkien",
        // Latin -um → -a (additional)
        "millennia", "aquaria", "crania", "stadia", "opera",
        // Latin -us → -i (additional)
        "bacilli", "cocci", "termini", "tori",
        // Zero-change animals (additional)
        "ibex", "chamois", "mink", "lynx", "ptarmigan", "teal", "pheasant", "snipe", "woodcock", "capercaillie",
        "mullet", "whitefish", "rockfish", "sockeye", "coho", "steelhead",
        // Japanese / East Asian zero-change loanwords
        "geisha", "haiku", "sensei", "manga", "anime", "emoji",
        // Ethnic / national (additional)
        "basque", "sami",
        // Italian / Latin cultural plurals
        "illuminati", "literati", "cognoscenti"
    ];

    const units = [
        // Length
        "m", "km", "cm", "mm", "nm", "pm", "um", "dm", "mi", "ft", "yd", "au",
        // Mass / weight
        "kg", "g", "mg", "ug", "ng", "lb", "oz", "t", "ton",
        // Time (ms/s already caught by count noun check)
        "min", "hr", "h", "wk", "mo",
        // Electrical / energy
        "v", "kv", "mv", "w", "kw", "mw", "gw",
        "j", "kj", "mj", "wh", "kwh", "mwh", "gwh",
        "n", "kn", "pa", "kpa", "mpa", "gpa",
        "hz", "khz", "mhz", "ghz", "thz",
        "ma", "ah", "nf", "pf", "uf", "mh",
        // Volume
        "l", "ml", "dl", "cl", "cc", "qt", "gal",
        // Temperature
        "k", "c", "f",
        // Area
        "ha",
        // Computing / data
        "kb", "mb", "gb", "tb", "pb", "bps", "kbps", "mbps", "gbps",
        "bit", "byte", "mp", "dpi",
        // Physics / science
        "ev", "kev", "mev", "gev", "mol", "sr", "bq", "sv",
        "rad", "bar", "mbar", "torr", "mmhg", "hpa", "atm",
        // Other common
        "rpm", "mph", "kph", "kt", "psi", "btu",
        "cal", "kcal", "db", "lm", "lx",
        "ppm", "ppb",
        // Power / electrical mode
        "hp", "bhp", "ac", "dc",
        // Rate abbreviations
        "bpm", "mpg", "baud",
        // Ordinal suffixes (400th, 1200th, etc.)
        "st", "nd", "rd", "th",
        // Medical
        "mcg", "iu",
        // Currency codes (ISO 4217 + common crypto)
        "usd", "eur", "gbp", "jpy", "chf", "cad", "aud", "nzd", "cny", "inr",
        "brl", "mxn", "krw", "sgd", "hkd", "nok", "sek", "dkk", "rub", "try",
        "zar", "pln", "huf", "czk", "aed", "sar", "cop", "ars", "clp", "pen",
        "egp", "ngn", "pkr", "vnd", "thb", "myr", "idr", "php", "btc", "eth", "xrp",
        // Percentage
        "percent", "pct",
        // Rate indicator
        "per",
        // Multipliers
        "dozen", "score", "hundred", "thousand", "million", "billion", "trillion"
    ];

    const singularUnits = [
        // Length
        "meter", "kilometer", "centimeter", "millimeter", "nanometer", "foot", "yard", "mile", "inch",
        // Mass
        "gram", "kilogram", "milligram", "microgram", "pound", "ounce", "tonne", "ton", "megaton",
        // Time
        "second", "minute", "hour", "day", "week", "month",
        // Electrical / energy
        "volt", "kilowatt", "megawatt", "gigawatt", "watt", "ampere", "ohm",
        "joule", "kilojoule", "newton", "hertz", "kilohertz", "megahertz", "gigahertz",
        "pascal", "farad", "kelvin",
        // Volume
        "liter", "milliliter", "gallon", "quart", "pint",
        // Temperature
        "celsius", "fahrenheit",
        // Area
        "hectare", "acre",
        // Computing
        "kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte", "megapixel",
        // Pressure / atmosphere
        "atmosphere", "millibar",
        // Physics
        "electronvolt", "sievert", "becquerel",
        // Light
        "lumen", "lux",
        // Other
        "kilocalorie", "calorie", "mole", "decibel", "radian", "knot",
        "degree", "gauge", "proof", "karat", "carat", "horsepower",
        // Temporal duration (singular — "400 year reign", "400 year period")
        "year", "fold",
        // Quantifying adjectives ("400 strong", "400 odd")
        "strong", "odd",
        // Singular count-noun modifiers ("400 page book", "400 piece set")
        "page", "piece", "person", "part",
        // Measurement geometry modifiers ("400 square meters", "400 cubic feet")
        "square", "cubic", "linear", "metric", "imperial",
        "rectangular", "circular", "spherical", "cylindrical", "triangular",
        // Quantity (gross = 144 units, point = finance/sports)
        "gross", "point",
        // Capacity / venue ("400 seat theater", "400 bed hospital", "400 room hotel")
        "seat", "room", "bed", "floor", "unit", "slot", "space", "spot", "suite", "berth",
        // Text / document ("400 word essay", "400 page chapter")
        "word", "line", "chapter", "volume", "paragraph", "sentence",
        // Data / computing ("400 row table", "400 node cluster")
        "row", "entry", "record", "field", "file", "node", "link", "edge", "error", "packet",
        // Political / organizational ("400 vote margin", "400 member panel")
        "vote", "member", "delegate", "representative", "deputy",
        // Sports ("400 goal season", "400 game streak")
        "goal", "game", "round", "match", "win", "loss", "lap", "set",
        // Military / historical ("400 soldier garrison", "400 ship fleet")
        "soldier", "troop", "warrior", "vessel", "ship", "plane", "tank", "cannon", "knight",
        // Scientific ("400 sample study", "400 patient trial")
        "sample", "specimen", "subject", "patient", "case", "trial", "observation",
        "gene", "cell", "species", "strain",
        // Financial / real estate ("400 share block", "400 home development")
        "share", "bond", "lot", "job", "home", "house", "apartment",
        // General structure ("400 step process", "400 layer stack")
        "step", "stage", "phase", "level", "tier", "layer", "block",
        "section", "segment", "module", "component", "element", "factor", "version", "edition",
        // Currency names
        "dollar", "euro", "yen", "franc", "ruble", "rupee", "yuan", "dinar", "dirham", "peso"
    ];

    const isCountNoun = w => {
        if (!w) return false;
        if (irregularPlurals.includes(w)) return true;
        if (w.endsWith("s")) {
            const isTemporalWord = strongIndicators.some(ind => {
                const escaped = ind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`^${escaped}$`, 'i').test(w);
            });
            const singularsEndingInS = [
                // Greek/Latin -is forms (singular, not plural)
                'crisis', 'basis', 'thesis', 'hypothesis', 'analysis', 'synthesis',
                'diagnosis', 'prognosis', 'emphasis', 'genesis', 'nemesis',
                // Latin -us forms (singular)
                'status', 'bonus', 'campus', 'circus', 'focus', 'nexus', 'radius', 'virus',
                // Abstract nouns
                'progress', 'success', 'access', 'excess', 'process', 'stress',
                // Common singulars ending in s
                'class', 'glass', 'mass', 'brass', 'gas', 'plus',
            ];
            return !isTemporalWord && !verbsEndingInS.includes(w) && !adjectivesEndingInS.includes(w) && !singularsEndingInS.includes(w);
        }
        return false;
    };

    const temporalBefore = /\b(?:year|century|decade|era|period|age)\b/.test(before);

    // Block "word of N" patterns (e.g., "score of 750", "chapter of 247")
    const precOfMatch = before.match(/\b(\w+)\s+of\s*$/);
    if (precOfMatch && !temporalBefore) {
        const wordBeforeOf = precOfMatch[1];
        const ofNonYearContext = new Set([
            'score', 'rating', 'fico', 'credit', 'iq', 'gpa', 'grade', 'rank',
            'page', 'chapter', 'section', 'figure', 'number',
        ]);
        if (ofNonYearContext.has(wordBeforeOf)) return false;
    }
    // Block "word to/at N" patterns (e.g., "rating to 780")
    const precPrepMatch = before.match(/\b(\w+)\s+(?:to|at)\s*$/);
    if (precPrepMatch && !temporalBefore) {
        const wordBeforePrep = precPrepMatch[1];
        const prepNonYearContext = new Set(['score', 'rating', 'fico', 'credit', 'iq', 'gpa', 'grade', 'rank']);
        if (prepNonYearContext.has(wordBeforePrep)) return false;
    }

    const nearbyMatch = after.match(/^\s*([a-z]+)(?:\s+([a-z]+))?/);
    if (nearbyMatch) {
        const [, word1, word2] = nearbyMatch;
        if (isCountNoun(word1)) return false;
        if (units.includes(word1)) return false;
        if (singularUnits.includes(word1)) return false;
        if (word1 === "of" && !temporalBefore) return false;
        // Look past a single adjective/modifier (ends in -ing, -ed, -ly) to the next word
        if (/(?:ing|ed|ly)$/.test(word1) && isCountNoun(word2)) return false;
        if (adjectivesEndingInS.includes(word1) && isCountNoun(word2)) return false;
    }

    return true;
}

//Checks for existence of "fuzzy modifiers" or other context clues that it is a date range
function isLikelyYearRange(y1, y2, prefixEra, era1, era2, text, offset, matchLength, fuzzyPrefix) {
    const hasEra = prefixEra || era1 || era2;
    if (hasEra) return true; // marked era → definitely a date

    // short numbers <100 → not a date
    if (y1 < 100 && y2 < 100) return false;

    // descending without era → ambiguous → don't convert
    if (y1 > y2) return false;

    // fuzzy modifiers like "c.", "ca.", "circa" indicate a date
    if (fuzzyPrefix) {
        const lower = fuzzyPrefix.toLowerCase();
        if (["c.", "ca.", "circa"].some(f => lower.includes(f))) return true;
    }

    // Look at surrounding words, clipped to the current sentence
    const rawBefore = text.slice(Math.max(0, offset - 60), offset);
    const rawAfter  = text.slice(offset + matchLength, Math.min(text.length, offset + matchLength + 60));

    // Trim before: keep only text from the start of the most recent sentence
    const sentenceBoundaryRegex = /[.!?]\s*(?=[A-Z])/g;
    let lastBoundary = 0;
    let bm;
    while ((bm = sentenceBoundaryRegex.exec(rawBefore)) !== null) {
        lastBoundary = bm.index + bm[0].length;
    }
    const before = rawBefore.slice(lastBoundary).toLowerCase();

    // Trim after: keep only text up to the end of the current sentence
    const firstSentenceEnd = /[.!?]\s*(?=[A-Z])/.exec(rawAfter);
    const after = (firstSentenceEnd
        ? rawAfter.slice(0, firstSentenceEnd.index + 1)
        : rawAfter
    ).toLowerCase();

    const dateIndicators = [
        // Era labels
        "ad", "ce", "bce", "bc", "bp",
        "a.d.", "c.e.", "b.c.e", "b.c.", "b.p.", "h.e.",
        // Fuzzy/approximation markers
        "c.", "ca.", "circa", "around", "approximately",
        // Temporal qualifiers
        "early", "mid-", "late", "during", "since",
        // Temporal units
        "year", "years", "century", "centuries", "decade", "era", "epoch",
        // Biographical context
        "born", "died", "death", "birth", "lived", "lifespan", "lifetime",
        // Historical governance/military
        "reign", "reigned", "ruled", "governed",
        "conquered", "invaded", "defeated", "fought",
        // Historical existence/activity
        "existed", "survived", "flourished", "declined", "collapsed",
        "founded", "established", "built", "constructed", "destroyed",
        // Historical exploration/movement
        "sailed", "explored", "discovered", "settled", "migrated",
        // Range connectors
        "through", "spanning", "in"
    ];

    // Use word-boundary matching to avoid false positives from substrings
    // (e.g. "ce" inside "centimeters", "in" inside "interesting")
    // Indicators ending in a word char get \b on both sides; those ending in punctuation only at start.
    return dateIndicators.some(indicator => {
        const escaped = indicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const endBoundary = /\w$/.test(indicator) ? '\\b' : '';
        const pattern = new RegExp(`\\b${escaped}${endBoundary}`, 'i');
        return pattern.test(before) || pattern.test(after);
    });
}

//Checks to make sure it isn't within [converted from ... ]
function isInsideConvertedText(text, offset) {
    if (!text || typeof text !== "string") return false;

    const before = text.slice(0, offset);
    const lastOpen = before.lastIndexOf("[converted from");
    const lastClose = before.lastIndexOf("]");

    return lastOpen > lastClose;
}

//Normalizes ordinal spacing
function normalizeOrdinalSpacing(text) {
  return text.replace(
    /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)\b/gi,
    (_, tens, ones) => `${tens}-${ones}`
  );
}

//Aids determining written ordinal for use in conversion
function parseWrittenOrdinal(word) {
  word = word.toLowerCase();

  if (ORDINAL_ONES[word]) return ORDINAL_ONES[word];
  if (ORDINAL_TEENS[word]) return ORDINAL_TEENS[word];
  if (ORDINAL_TENS[word]) return ORDINAL_TENS[word];

  const parts = word.split("-");
  if (parts.length === 2) {
    const [tens, ones] = parts;
    if (TENS_BASE[tens] && ORDINAL_ONES[ones]) {
      return TENS_BASE[tens] + ORDINAL_ONES[ones];
    }
  }

  return null;
}

//Checks written "hundreds" numbers for use in conversion
function parseWrittenHundreds(word) {
    word = word.toLowerCase();
    const mapping = {
        one: 100,
        two: 200,
        three: 300,
        four: 400,
        five: 500,
        six: 600,
        seven: 700,
        eight: 800,
        nine: 900,
        ten: 1000,
        eleven: 1100,
        twelve: 1200,
        thirteen: 1300,
        fourteen: 1400,
        fifteen: 1500,
        sixteen: 1600,
        seventeen: 1700,
        eighteen: 1800,
        nineteen: 1900,
        twenty: 2000
    };
    return mapping[word] || null;
}

//--------------------------------------------------------------




//----------------CORE TEXT PROCESSING-----------------

function processRanges(text, outerSurrounding = null, outerMatchOffset = 0) {
    return text.replace(rangeRegex, (match, fuzzyPrefix, prefixEra, y1, era1, y2, era2, offset, string) => {
        const before = string[offset - 1];
        const after = string[offset + match.length];

        //Checks to make sure it doesn't have a dash before/after, isn't already converted, and has 2 years.
        if (before === "-" || before === "–" || after === "-" || after === "–") return match;
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;
        if (!y1 || !y2) return match;

        const year1 = parseYear(y1);
        const year2 = parseYear(y2);

        //Uses stored outer context when available (for ranges restored from placeholders)
        const surroundingText = outerSurrounding ?? string;
        const matchOffsetInContext = outerSurrounding != null ? outerMatchOffset : offset;

        //Checks to make sure it's likely a year range
        if (!isLikelyYearRange(year1, year2, prefixEra, era1, era2, surroundingText, matchOffsetInContext, match.length, fuzzyPrefix)) {
            return match; // leave as-is if not likely a year
        }

        const hasEra = prefixEra || era1 || era2;

        // --- EARLY EXIT CHECKS ---
        // 1. Short numeric ranges (<100) without era → do not convert
        if (!hasEra && year1 < 100 && year2 < 100) return match;

        // 2. Ambiguous descending range without era → do not convert
        if (!hasEra && year1 > year2) return match;

        // --- Proceed with conversion ---
        const formattedPrefix = formatPrefix(fuzzyPrefix);

        const normPrefix = normalizeEra(prefixEra);
        const normEra1 = normalizeEra(era1);
        const normEra2 = normalizeEra(era2);

        let finalEra1, finalEra2;

        // Handle BP ranges first
        if (normEra1 === "BP" || normEra2 === "BP") {
            finalEra1 = "BP";
            finalEra2 = "BP";
        } 
        // Then handle BCE ranges
        else if (normEra2 === "BCE") {
            finalEra1 = "BCE";
            finalEra2 = "BCE";
        } 
        // Fully unlabeled range (ascending order)
        else if (!normEra1 && !normEra2 && !normPrefix) {
            finalEra1 = "CE";
            finalEra2 = "CE";
        } 
        // Mixed cases
        else {
            finalEra2 = normEra2 || normEra1 || normPrefix || "CE";
            finalEra1 = normEra1 || normPrefix || finalEra2;
        }

        const converted1 = convertYear(year1, finalEra1);
        const converted2 = convertYear(year2, finalEra2);

        // Unlabeled ranges (no era in input) use "year–year ERA"; labeled use "year ERA–year ERA"
        const fromLabel = hasEra
            ? `${year1} ${finalEra1}–${year2} ${finalEra2}`
            : `${year1}–${year2} ${finalEra2}`;
        console.log("Processed in RANGES");
        return `${formattedPrefix}${converted1}–${converted2} H.E. (Holocene Era) [converted from ${fromLabel}]`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, fuzzyPrefix, prefixEra, yearStr, suffixEra, trailingPeriod, offset, string) => {
        const before = string[offset - 1];
        const after = string[offset + match.length];

        //Checks to make sure it doesn't have a dash (making it a range or something else)
        if (before === "-" || before === "–" || after === "-" || after === "–") {
            return match;
        }


        if (!yearStr) return match;

        //Checks to make sure it's not already converted
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;
        if (match.includes("BP") && match.includes("H.E.")) return match; //Why is this line here again?

        //Formats the prefix (if there is one) and normalizes years and eras without punctuation
        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const year = parseYear(yearStr);
        const era = normalizeEra(suffixEra || prefixEra || "CE");

        const converted = convertYear(year, era);

        // Dotted eras (B.C.E., A.D., etc.) have their trailing period consumed by ERA_PATTERN.
        // If the next word is capitalised, that period was also a sentence-ender — re-append it.
        const eraConsumedPeriod = suffixEra && /\.$/.test(suffixEra);
        const afterText = string.slice(offset + match.length);
        const appendPeriod = (eraConsumedPeriod && (/^\s+[A-Z]/.test(afterText) || afterText.trim() === '')) ? '.' : '';

        console.log("YEAR IS: " + year + " | ERA IS: " + era);

        console.log("Processed in SINGLE YEARS");
        return `${formattedPrefix}${converted} H.E. (Holocene Era) [converted from ${year} ${era}]${appendPeriod}${trailingPeriod || ''}`;
    });
}

function processUnlabeledYears(text) {
    // Handle fiscal year prefix notation where no word boundary exists (FY2025 → FY + 2025)
    text = text.replace(/\b(FY)(\d{4})\b/gi, (match, prefix, yearStr, offset, string) => {
        if (isInsideConvertedText(string, offset)) return match;
        const year = parseInt(yearStr, 10);
        if (year < 100 || year > 3000) return match;
        const converted = convertYear(year, 'CE');
        console.log("Processed in UNLABELED YEARS");
        return `${prefix}${converted} H.E. (Holocene Era) [converted from ${year} CE]`;
    });

    return text.replace(/\b(\d{3,4})\b/g, (match, p1, offset, string) => {

        //Checks to make sure it isn't an already converted date
        if (isInsideConvertedText(string, offset)) return match;
        const after = string.slice(offset, offset + 20);
        if (after.includes("H.E.")) return match;

        //Checks to see if it is likely an unlabeled year and not some other number
        if (!isLikelyUnlabeledYear(match, string, offset)) return match;

        //Normalizes year, assumes CE, converts year
        const year = parseInt(match, 10);
        const era = "CE";
        const converted = convertYear(year, era);

        console.log("Processed in UNLABELED YEARS");
        return `${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
    });
}

function processPluralReferences(text) {
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, "gi");
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s(?!\\s*H\\.E\\.)\\s*(${ERA_PATTERN})?\\b`, "gi");
    return text.replace(pluralRegex, (match, fuzzyPrefix, numberStr, eraStr, offset, fullText) => {
        //Checks to make sure it isn't already converted year
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Normalizes year and era to remove punctuation
        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const number = parseInt(numberStr.replace(/,/g, ""), 10);
        const era = normalizeEra(eraStr || "CE");  // default CE if no era

        let convertedNumber = convertYear(number, era);

        //Adjusts year according to BCE/BC rules (because there is no year 0)
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1; // BCE adjustment for broad centuries
        }

        //Only add 's' if original match had an 's' (indicating a plural/decade)
        const hasS = /\ds\b/.test(match);

        console.log("Processed in PLURAL REF");
        return `${formattedPrefix}${convertedNumber}${hasS ? "s" : ""} H.E. (Holocene Era) [converted from ${numberStr}s ${eraStr || "CE"}]`;
    });
}

//Turns "13th century" into plural form "1400s" since century references is confusing
function processCenturyReferences(text) {
    return text.replace(centuryRegex, (match, fuzzyPrefix, centuryNumberStr, ordinal, eraStr, trailingSpace, offset, fullText) => {
        //Checks to make sure the year isn't part of an already converted year
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Figures out prefix, correct number for century, and normalizes era
        const formattedPrefix = formatPrefix(fuzzyPrefix);  // preserve the original modifier
        const centuryNumber = parseInt(centuryNumberStr, 10);
        const era = normalizeEra(eraStr || "CE"); // default CE

        //Converts century to "hundreds" number
        let baseNumber;
        if (era === "BCE") {
            baseNumber = (centuryNumber+1) * 100;
        } else {
            baseNumber = (centuryNumber-1) * 100;
        }

        //Converts to HE
        let convertedNumber = convertYear(baseNumber, era);

        //BCE/BC adjustment for broad centuries (because the first century CE and BC cause confusion)
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1;
        }

        console.log("Processed in CENTURY REF");
        console.log("UPDATED CENTURY REGEX ACTIVE");
        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${centuryNumberStr}${ordinal} century${eraStr ? " " + eraStr : ""}]${trailingSpace}`;
    });
}

//Turns written out ordinal numbers into numerals, then process Century References will turn them into plural form
function processWrittenCenturies(text) {
    //Normalizes the spacing of ordinal numbers that have dashes or spaces
    text = normalizeOrdinalSpacing(text);

    return text.replace(
        writtenCenturyRegex,
        (match, fuzzy, word, era, offset, fullText) => {

        //Checks to make sure year isn't one that's already converted
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Turns ordinal into a number
        const num = parseWrittenOrdinal(word);
        if (!num) return match;

        const prefix = formatPrefix(fuzzy);
        const suffix = getOrdinalSuffix(num);

        console.log("Processed in WRITTEN CENTURIES");
        return `${prefix}${num}${suffix} century${era ? " " + era : ""}`;
    }
  );
}

function processWrittenHundreds(text) {
    return text.replace(writtenHundredsRegex, (match, fuzzy, word, era, offset, fullText) => {
        //Checks to make sure the year isn't one that's already converted
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Turns written number into numeral
        const baseNumber = parseWrittenHundreds(word);
        if (!baseNumber) return match;

        //Normalizes era and finds prefix if there
        const formattedPrefix = formatPrefix(fuzzy);
        const normalizedEra = normalizeEra(era || "CE"); // default CE if no era

        //Passes number through convertHundredYear for H.E. conversion
        let convertedNumber = convertHundredYear(baseNumber, normalizedEra);

        //BCE adjustment
        if (normalizedEra === "BCE" || normalizedEra === "BC") {
            convertedNumber -= 1;
        }

        console.log("Processed in WRITTEN HUNDREDS");
        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${baseNumber} ${normalizedEra}]`;
    });
}

//Protects decades (singular years or ranges with "s" with 1-9 in second to last digit) before other processes
function protectDecades(text, decadePlaceholders){
    return text.replace(decadeRegex, (match, first, second, offset, string) => {

        // Don't protect resolution/dimension patterns where × is adjacent (1920×1080)
        const charAfter = string[offset + match.length];
        const charBefore = offset > 0 ? string[offset - 1] : '';
        if (charAfter === '×' || charBefore === '×') return match;

        // Don't protect when a preceding word marks this as a non-year identifier
        const rawBefore = string.slice(Math.max(0, offset - 60), offset);
        const before = rawBefore.slice(rawBefore.search(/\S/)).toLowerCase();
        const immPrecMatch = before.match(/\b([a-z.]+)\s*$/);
        const immPrecWord = immPrecMatch ? immPrecMatch[1] : '';
        const decadeInhibitors = new Set([
            'highway', 'hwy', 'route', 'rte', 'freeway', 'expressway', 'interstate',
            'port', 'rfc', 'isbn', 'issn', 'sku',
            'patent', 'law', 'ordinance', 'statute', 'regulation',
            'http', 'error', 'status',
            'page', 'p.', 'figure', 'fig', 'exhibit', 'appendix', 'chapter', 'article', 'section', 'number',
            'score', 'scored', 'scoring', 'rating', 'rated', 'ranked', 'ranking',
            'form', 'episode', 'ep', 'channel', 'track', 'gate', 'exit', 'room', 'floor', 'code',
        ]);
        if (decadeInhibitors.has(immPrecWord)) return match;

        //Detect era context - make sure it's not a BP
        const after = string.slice(offset, offset + match.length + 10);
        if (new RegExp(`\\b(BP|B\\.P\\.)\\b`, "i").test(after)) {
            return match;
        }

        const id = decadePlaceholders.length;
        decadePlaceholders.push(match);
        return `__DECADE_${id}__`;
    });
}
function processDecadeRanges(text) {
    return text.replace(decadeRegex, (match, first, second, offset, string) => {
        //Checks to make sure year is not already converted
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Looks for era and normalizes
        const eraMatch = match.match(new RegExp(`(${ERA_PATTERN})`, "i"));
        const era = eraMatch ? normalizeEra(eraMatch[0]) : "CE";

        //First decade year check - does it have an "s"
        const hasSFirst = /s$/.test(first);
        const firstYear = parseInt(first.replace(/s$/, ""), 10);

        //Skips centuries like 1800s, 1500s, etc.
        if (firstYear % 100 === 0) {
            return match;
        }

        //Converts first year
        const convertedFirst = convertYear(firstYear, era);
        let result = convertedFirst + (hasSFirst ? "s" : "");

        //Second decade year check (if exists)
        if (second) {
            const hasSSecond = /s$/.test(second);
            let strippedSecond = second.replace(/s$/, "");
            let secondYear;

            //Checks if it's 2 or 4 digits
            if (strippedSecond.length === 2) {
                const century = Math.floor(firstYear / 100);
                secondYear = parseInt(century.toString() + strippedSecond, 10);
            } else {
                secondYear = parseInt(strippedSecond, 10);
            }

            const convertedSecond = convertYear(secondYear, era);

            //Keeps original style: 's' if present, abbreviated if originally 2 digits
            let secondDisplay;
            if (strippedSecond.length === 2 && !hasSSecond) {
                secondDisplay = strippedSecond; // keep '90' as-is
            } else {
                secondDisplay = hasSSecond ? convertedSecond + "s" : convertedSecond;
            }

            result += "–" + secondDisplay;
        }

        console.log("Processed in DECADES");
        return `${result} H.E. (Holocene Era) [converted from ${match} ${era}]`;
    });
}

//Protects decades (singular years or ranges with "s" with 1-9 in second to last digit) 
//and which have abbreviated second years. Protects before other processes
function protectAbbreviatedDecades(text, abbreviatedDecadePlaceholders) {
    return text.replace(abbreviatedDecadeRegex, (match, first, second, offset, string) => {

        //Detects era context
        const after = string.slice(offset, offset + match.length + 10);
        if (new RegExp(`\\b(${ERA_PATTERN})\\b`, "i").test(after)) {
            return match;
        }

        const id = abbreviatedDecadePlaceholders.length;
        abbreviatedDecadePlaceholders.push(match);
        return `__ABBR_DECADE_${id}__`;
    });
}
function processDecadeAbbreviatedRanges(text) {
    return text.replace(abbreviatedDecadeRegex, (match, first, second, offset, string) => {
        //Checks to make sure year isn't already converted
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        //Normalize era
        const eraMatch = match.match(new RegExp(`(${ERA_PATTERN})`, "i"));
        const era = eraMatch ? normalizeEra(eraMatch[0]) : "CE";

        //Checks to see if first year has "s"
        const hasSFirst = /s$/.test(first);
        const firstYear = parseInt(first.replace(/s$/, ""), 10);

        //Converts
        const convertedFirst = convertYear(firstYear, era);
        let result = convertedFirst + (hasSFirst ? "s" : "");

        const hasSSecond = /s$/.test(second);

        //Doesn't convert abbreviated second year (i.e. 2 digits) - appends second year onto end of result as is
        result += "–" + second;

        console.log("Processed in ABBREVIATED DECADES");
        return `${result} H.E. (Holocene Era) [converted from ${match} ${era}]`;
    });
}

function processText(text) {
    const chainPlaceholders = [];
    const rangePlaceholders = [];
    const decadePlaceholders = [];
    const abbreviatedDecadePlaceholders = [];
    
    //Protects numeric chains
    text = text.replace(/\b\d+(?:[-–]\d+){2,}\b/g, (match) => {
        const id = chainPlaceholders.length;
        chainPlaceholders.push(match);
        return `__CHAIN_${id}__`;
    });

    //Protects abbreviated decades
    text = protectAbbreviatedDecades(text, abbreviatedDecadePlaceholders);
    
    //Extracts ranges and replace with placeholders, storing surrounding context
    text = text.replace(rangeRegex, (match, _1, _2, _3, _4, _5, _6, offset, string) => {
        const id = rangePlaceholders.length;
        const ctxStart = Math.max(0, offset - 80);
        rangePlaceholders.push({
            match,
            surrounding: string.slice(ctxStart, offset + match.length + 80),
            matchOffset: offset - ctxStart
        });
        return `__RANGE_${id}__`;
    });

    //Protects decades before any conversion
    text = protectDecades(text, decadePlaceholders);

    //Processes single years
    text = processSingleYears(text);
    const singleYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = singleYearsConvertedTagSafeBox.length;
        singleYearsConvertedTagSafeBox.push(match);
        return `__SINGLE_YEARS_TAG_${id}__`;
    });

    //Processes unlabeled years (i.e. without an era tag)
    text = processUnlabeledYears(text);
    const unlabeledYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = unlabeledYearsConvertedTagSafeBox.length;
        unlabeledYearsConvertedTagSafeBox.push(match);
        return `__UNLABELED_YEARS_TAG_${id}__`;
    });

    //Processes plural century references
    text = processPluralReferences(text);
    const pluralYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = pluralYearsConvertedTagSafeBox.length;
        pluralYearsConvertedTagSafeBox.push(match);
        return `__PLURAL_YEARS_TAG_${id}__`;
    });

    //Converts written hundreds (e.g., "nineteen hundreds") to numeric form first
    text = processWrittenHundreds(text);
    const writtenHundredsYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = writtenHundredsYearsConvertedTagSafeBox.length;
        writtenHundredsYearsConvertedTagSafeBox.push(match);
        return `__WRITTEN_HUNDREDS_YEARS_TAG_${id}__`;
    });

    //Processes written century numbers and converts them to numbers for the next step
    text = processWrittenCenturies(text);
        //written centuries safeboxing skipped so they can convert in the next method:

    //Processes century number references and converts them to plural century references
    text = processCenturyReferences(text);
    const centuriesConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = centuriesConvertedTagSafeBox.length;
        centuriesConvertedTagSafeBox.push(match);
        return `__CENTURIES_TAG_${id}__`;
    });

    //Restores ranges and process them, passing stored context for unlabeled range detection
    text = text.replace(/__RANGE_(\d+)__/g, (_, i) => {
        const { match, surrounding, matchOffset } = rangePlaceholders[i];
        return processRanges(match, surrounding, matchOffset);
    });

    //Restores chains
    text = text.replace(/__CHAIN_(\d+)__/g, (_, i) => {
        return chainPlaceholders[i];
    });

    //Processes abbreviated decades
    text = text.replace(/__ABBR_DECADE_(\d+)__/g, (_, i) => {
        return processDecadeAbbreviatedRanges(abbreviatedDecadePlaceholders[i]);
    });

    //Processes decade ranges like "1980s–1990s"
    text = text.replace(/__DECADE_(\d+)__/g, (_, i) => {
        return processDecadeRanges(decadePlaceholders[i]);
    });


    //RESTORES EACH TAGS FROM THE SAFEBOXES
    text = text.replace(/__SINGLE_YEARS_TAG_(\d+)__/g, (_, id) => {
        console.log("Single Years Tags Released");
        return singleYearsConvertedTagSafeBox[id];
    });
    text = text.replace(/__UNLABELED_YEARS_TAG_(\d+)__/g, (_, id) => {
        console.log("Unlabeled Years Tags Released");
        return unlabeledYearsConvertedTagSafeBox[id];
    });
    text = text.replace(/__PLURAL_YEARS_TAG_(\d+)__/g, (_, id) => {
        console.log("Plural Years Tags Released");
        return pluralYearsConvertedTagSafeBox[id];
    });
    text = text.replace(/__WRITTEN_HUNDREDS_YEARS_TAG_(\d+)__/g, (_, id) => {
        console.log("Written Hundreds Years Tags Released");
        return writtenHundredsYearsConvertedTagSafeBox[id];
    });
    text = text.replace(/__CENTURIES_TAG_(\d+)__/g, (_, id) => {
        console.log("Centuries Tags Released");
        return centuriesConvertedTagSafeBox[id];
    });

    return text;
}

//----------------------------------------------------


//----------------DOM WALKING-----------------

function processTextNode(node) {
    node.nodeValue = processText(node.nodeValue);
}

function walkDOMAndProcess(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (["script", "style", "textarea", "input", "a", "code"].includes(tag)) return;
        node.childNodes.forEach(walkDOMAndProcess);
    } else if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
    }
}

// Kick it off from the body
walkDOMAndProcess(document.body);

//-----------------------------------------------







//--------------------------TESTING----------------------

const allTests = [

    // --- SINGLE DATES ---
    { input: "1948", expected: "11948 H.E. (Holocene Era) [converted from 1948 CE]" },
    { input: "44BC", expected: "9957 H.E. (Holocene Era) [converted from 44 BCE]" },
    { input: "1865 A.D.", expected: "11865 H.E. (Holocene Era) [converted from 1865 CE]." },
    { input: "1994C.E.", expected: "11994 H.E. (Holocene Era) [converted from 1994 CE]." },
    
    
    // --- RANGE TESTS ---
    { input: "2000 BCE–1996 CE", expected: "8001–11996 H.E. (Holocene Era) [converted from 2000 BCE–1996 CE]" },
    { input: "500–1000 BCE", expected: "9501–9001 H.E. (Holocene Era) [converted from 500 BCE–1000 BCE]" },
    { input: "1500 CE", expected: "11500 H.E. (Holocene Era) [converted from 1500 CE]" },
    { input: "1000–500", expected: "1000–500" },
    { input: "50 BC–50 AD", expected: "9951–10050 H.E. (Holocene Era) [converted from 50 BCE–50 CE]" },
    { input: "300 BP–100 BP", expected: "11650–11850 H.E. (Holocene Era) [converted from 300 BP–100 BP]" },
    { input: "1,500–2,000 CE", expected: "11500–12000 H.E. (Holocene Era) [converted from 1500 CE–2000 CE]" },
    { input: "1200 to 1400 CE", expected: "11200–11400 H.E. (Holocene Era) [converted from 1200 CE–1400 CE]" },
    { input: "1000 BCE to 500 BCE", expected: "9001–9501 H.E. (Holocene Era) [converted from 1000 BCE–500 BCE]" },
    { input: "1000BCE–500BCE", expected: "9001–9501 H.E. (Holocene Era) [converted from 1000 BCE–500 BCE]" },
    { input: "1000–400BCE", expected: "9001–9601 H.E. (Holocene Era) [converted from 1000 BCE–400 BCE]" },
    { input: "1000B.C.E.–500B.C.E.", expected: "9001–9501 H.E. (Holocene Era) [converted from 1000 BCE–500 BCE]" },
    { input: "1000–400B.C.E.", expected: "9001–9601 H.E. (Holocene Era) [converted from 1000 BCE–400 BCE]" },

    // --- BP SINGLE YEARS ---
    { input: "300 BP", expected: "11650 H.E. (Holocene Era) [converted from 300 BP]" },
    { input: "1950 BP", expected: "10000 H.E. (Holocene Era) [converted from 1950 BP]" },
    { input: "1951 BP", expected: "9999 H.E. (Holocene Era) [converted from 1951 BP]" },
    { input: "50BP", expected: "11900 H.E. (Holocene Era) [converted from 50 BP]" },
    { input: "40B.P.", expected: "11910 H.E. (Holocene Era) [converted from 40 BP]." },
    { input: "30 B.P.", expected: "11920 H.E. (Holocene Era) [converted from 30 BP]." },
    { input: "the year 30 B.P. was rough", expected: "the year 11920 H.E. (Holocene Era) [converted from 30 BP] was rough" },

    // --- UNLABELED RANGES ---
    { input: "1000–1500", expected: "1000–1500" },
    { input: "1500–1000", expected: "1500–1000" },
    { input: "1500–500", expected: "1500–500" },

    // --- NON-DATES ---
    { input: "240-343-1340", expected: "240-343-1340" }, //phone number example
    { input: "1103-2000-3200-4382", expected: "1103-2000-3200-4382" }, //credit card example
    { input: "991-91-7234", expected: "991-91-7234" }, //social security example
    { input: "01/02/1980", expected: "01/02/11980 H.E. (Holocene Era) [converted from 1980 CE]" }, //birthday/exact date example
    { input: "12:15", expected: "12:15" }, //time
    { input: "14:15PM", expected: "14:15PM" }, //time
    { input: "2:15 AM", expected: "2:15 AM" }, //time
    { input: "about 30-50 wild boars", expected: "about 30-50 wild boars" }, //not a range
    { input: "I need 900-1200 centimeters of rope.", expected: "I need 900-1200 centimeters of rope." }, //not a range

    // --- COMPLEX SENTANCES / DOUBLE DATES ---
    { input: "From 500 BCE to 400 BCE, and later 1500 CE–1600 CE", expected: "From 9501–9601 H.E. (Holocene Era) [converted from 500 BCE–400 BCE], and later 11500–11600 H.E. (Holocene Era) [converted from 1500 CE–1600 CE]" },
    { input: "fifteenth century BCE and 1400–1500 CE", expected: "8400s H.E. (Holocene Era) [converted from 15th century BCE] and 11400–11500 H.E. (Holocene Era) [converted from 1400 CE–1500 CE]" },
    { input: "In 500 BCE, something happened. Between 1000–1200 CE,...", expected: "In 9501 H.E. (Holocene Era) [converted from 500 BCE], something happened. Between 11000–11200 H.E. (Holocene Era) [converted from 1000 CE–1200 CE],..." },

    // --- EDGE CASE ---
    { input: "0 CE", expected: "10000 H.E. (Holocene Era) [converted from 0 CE]" },

    // --- NO SPACE FORMATTING ---
    { input: "2000BCE", expected: "8001 H.E. (Holocene Era) [converted from 2000 BCE]" },
    { input: "100CE", expected: "10100 H.E. (Holocene Era) [converted from 100 CE]" },
    { input: "2000BCE–100CE", expected: "8001–10100 H.E. (Holocene Era) [converted from 2000 BCE–100 CE]" },

    // --- MIXED ERA RANGES ---
    { input: "2000 BCE–50 CE", expected: "8001–10050 H.E. (Holocene Era) [converted from 2000 BCE–50 CE]" },
    { input: "2000–50 BCE", expected: "8001–9951 H.E. (Holocene Era) [converted from 2000 BCE–50 BCE]" },

    // --- BP RANGE ---
    { input: "300 BP–100 BP", expected: "11650–11850 H.E. (Holocene Era) [converted from 300 BP–100 BP]" },
    { input: "300–100 BP", expected: "11650–11850 H.E. (Holocene Era) [converted from 300 BP–100 BP]" },

    // --- FUZZY DATES ---
    { input: "c. 500 BCE", expected: "c. 9501 H.E. (Holocene Era) [converted from 500 BCE]" },
    { input: "~1200 AD", expected: "~11200 H.E. (Holocene Era) [converted from 1200 CE]" },
    { input: "around 300 BC", expected: "around 9701 H.E. (Holocene Era) [converted from 300 BCE]" },
    { input: "c. 1000–1500", expected: "c. 11000–11500 H.E. (Holocene Era) [converted from 1000–1500 CE]" },
    { input: "c. 1200", expected: "c. 11200 H.E. (Holocene Era) [converted from 1200 CE]" },
    { input: "~ 300", expected: "~ 10300 H.E. (Holocene Era) [converted from 300 CE]" },
    { input: "around 1000", expected: "around 11000 H.E. (Holocene Era) [converted from 1000 CE]" },

    // --- ZERO AND NEGATIVE ---
    { input: "10000 BCE", expected: "1 H.E. (Holocene Era) [converted from 10000 BCE]" },
    { input: "10001 BCE", expected: "0 H.E. (Holocene Era) [converted from 10001 BCE]" },
    { input: "10002 BCE", expected: "-1 H.E. (Holocene Era) [converted from 10002 BCE]" },
    { input: "10003 BCE", expected: "-2 H.E. (Holocene Era) [converted from 10003 BCE]" },

    // --- PLURAL CENTURY TESTS ---
    { input: "1500s CE", expected: "11500s H.E. (Holocene Era) [converted from 1500s CE]" },
    { input: "500s BCE", expected: "9500s H.E. (Holocene Era) [converted from 500s BCE]" },
    { input: "100s BCE", expected: "9900s H.E. (Holocene Era) [converted from 100s BCE]" },
    { input: "200s", expected: "10200s H.E. (Holocene Era) [converted from 200s CE]" },
    { input: "300s BC", expected: "9700s H.E. (Holocene Era) [converted from 300s BC]" },
    { input: "1800s AD", expected: "11800s H.E. (Holocene Era) [converted from 1800s AD]" },
    { input: "early 500s BCE", expected: "early 9500s H.E. (Holocene Era) [converted from 500s BCE]" },
    { input: "mid-1800s CE", expected: "mid-11800s H.E. (Holocene Era) [converted from 1800s CE]" },
    { input: "late 1400s CE", expected: "late 11400s H.E. (Holocene Era) [converted from 1400s CE]" },

    // --- FUZZY PREFIX PLURAL CENTURIES ---
    { input: "early 500s BCE", expected: "early 9500s H.E. (Holocene Era) [converted from 500s BCE]" },
    { input: "mid-1800s CE", expected: "mid-11800s H.E. (Holocene Era) [converted from 1800s CE]" },
    { input: "around 1300s BCE", expected: "around 8700s H.E. (Holocene Era) [converted from 1300s BCE]" },

    // --- CENTURY NUMBER REFERENCE TESTS ---
    // CE / AD centuries
    { input: "15th century CE", expected: "11400s H.E. (Holocene Era) [converted from 15th century CE]" },
    { input: "2nd century AD", expected: "10100s H.E. (Holocene Era) [converted from 2nd century AD]" },
    { input: "1st century", expected: "10000s H.E. (Holocene Era) [converted from 1st century]" }, // default CE

    // BCE / BC centuries
    { input: "5th century BCE", expected: "9400s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "3rd century BC", expected: "9600s H.E. (Holocene Era) [converted from 3rd century BC]" },

    // Edge cases: very early centuries
    { input: "1st century BCE", expected: "9800s H.E. (Holocene Era) [converted from 1st century BCE]" },
    { input: "12th century CE", expected: "11100s H.E. (Holocene Era) [converted from 12th century CE]" },

    // Mixed with extra text
    { input: "The mid-15th century CE saw changes", expected: "The mid-11400s H.E. (Holocene Era) [converted from 15th century CE] saw changes" },
    { input: "Late 3rd century BC events", expected: "Late 9600s H.E. (Holocene Era) [converted from 3rd century BC] events" },


    // --- WRITTEN CENTURY TESTS ---
    // Basic CE
    { input: "fifteenth century CE", expected: "11400s H.E. (Holocene Era) [converted from 15th century CE]" },
    { input: "second century AD", expected: "10100s H.E. (Holocene Era) [converted from 2nd century AD]" },
    { input: "first century", expected: "10000s H.E. (Holocene Era) [converted from 1st century]" },

    // Basic BCE
    { input: "fifth century BCE", expected: "9400s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "third century BC", expected: "9600s H.E. (Holocene Era) [converted from 3rd century BC]" },

    // Teens
    { input: "thirteenth century CE", expected: "11200s H.E. (Holocene Era) [converted from 13th century CE]" },
    { input: "nineteenth century CE", expected: "11800s H.E. (Holocene Era) [converted from 19th century CE]" },

    // Tens
    { input: "twentieth century CE", expected: "11900s H.E. (Holocene Era) [converted from 20th century CE]" },
    { input: "thirtieth century CE", expected: "12900s H.E. (Holocene Era) [converted from 30th century CE]" },

    // Hyphenated
    { input: "twenty-first century CE", expected: "12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "thirty-second century CE", expected: "13100s H.E. (Holocene Era) [converted from 32nd century CE]" },

    // Non-hyphen variant (important!)
    { input: "twenty first century CE", expected: "12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "thirty second century CE", expected: "13100s H.E. (Holocene Era) [converted from 32nd century CE]" },

    // High values
    { input: "ninety-ninth century CE", expected: "19800s H.E. (Holocene Era) [converted from 99th century CE]" },
    { input: "ninety ninth century CE", expected: "19800s H.E. (Holocene Era) [converted from 99th century CE]" },

    //Other
    { input: "early fifteenth century CE", expected: "early 11400s H.E. (Holocene Era) [converted from 15th century CE]" },
    { input: "mid-twentieth century CE", expected: "mid-11900s H.E. (Holocene Era) [converted from 20th century CE]" },
    { input: "late third century BC", expected: "late 9600s H.E. (Holocene Era) [converted from 3rd century BC]" },
    { input: "c. twenty-first century CE", expected: "c. 12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "~ twenty first century CE", expected: "~ 12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "around fifth century BCE", expected: "around 9400s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "The fifteenth century CE saw major changes", expected: "The 11400s H.E. (Holocene Era) [converted from 15th century CE] saw major changes" },
    { input: "In the early twenty-first century CE, technology advanced rapidly",
        expected: "In the early 12000s H.E. (Holocene Era) [converted from 21st century CE], technology advanced rapidly" },
    { input: "Late third century BC events reshaped the region",
        expected: "Late 9600s H.E. (Holocene Era) [converted from 3rd century BC] events reshaped the region" },
    { input: "He finished in first place", expected: "He finished in first place" },
    { input: "She lived for twenty years", expected: "She lived for twenty years" },
    { input: "This is a second attempt", expected: "This is a second attempt" },


    // --- WRITTEN HUNDREDS TESTS ---
    { input: "nineteen hundreds CE", expected: "11900s H.E. (Holocene Era) [converted from 1900 CE]" },
    { input: "early nineteen hundreds", expected: "early 11900s H.E. (Holocene Era) [converted from 1900 CE]" },
    { input: "mid-nineteen hundreds", expected: "mid-11900s H.E. (Holocene Era) [converted from 1900 CE]" },
    { input: "late nineteen hundreds BCE", expected: "late 8100s H.E. (Holocene Era) [converted from 1900 BCE]" },
    { input: "fifteen hundreds", expected: "11500s H.E. (Holocene Era) [converted from 1500 CE]" },
    { input: "early fifteen hundreds BCE", expected: "early 8500s H.E. (Holocene Era) [converted from 1500 BCE]" },
    { input: "c. nineteen hundreds", expected: "c. 11900s H.E. (Holocene Era) [converted from 1900 CE]" },
    { input: "sixteen hundreds", expected: "11600s H.E. (Holocene Era) [converted from 1600 CE]" },
    { input: "around thirteen hundreds BCE", expected: "around 8700s H.E. (Holocene Era) [converted from 1300 BCE]" },

    // --- DECADES ---
    { input: "the 1990s", expected: "the 11990s H.E. (Holocene Era) [converted from 1990s CE]" },
    { input: "1980s–1990s", expected: "11980s–11990s H.E. (Holocene Era) [converted from 1980s–1990s CE]" },
    { input: "1980s–90s", expected: "11980s–90s H.E. (Holocene Era) [converted from 1980s–90s CE]" },
    { input: "1980-90", expected: "11980–90 H.E. (Holocene Era) [converted from 1980-90 CE]" },

    // --- LONG AND COMPLICATED ---
    { input: "The 1980s–1990s in the late 20th century saw the birth of Jared who was born in 1991. If he was born in 100 AD or 100 B.C.E., he would have been born in a different year. But he was born in the 1900s, or rather the nineteen hundreds and not the next millennia. His lifespan is 1991-2010, and his son was born c. 2000 CE.", expected: "The 11980s–11990s H.E. (Holocene Era) [converted from 1980s–1990s CE] in the late 11900s H.E. (Holocene Era) [converted from 20th century] saw the birth of Jared who was born in 11991 H.E. (Holocene Era) [converted from 1991 CE]. If he was born in 10100 H.E. (Holocene Era) [converted from 100 CE] or 9901 H.E. (Holocene Era) [converted from 100 BCE], he would have been born in a different year. But he was born in the 11900s H.E. (Holocene Era) [converted from 1900s CE], or rather the 11900s H.E. (Holocene Era) [converted from 1900 CE] and not the next millennia. His lifespan is 11991–12010 H.E. (Holocene Era) [converted from 1991–2010 CE], and his son was born c. 12000 H.E. (Holocene Era) [converted from 2000 CE]." },

    // --- DOTTED ERA SENTENCE-ENDING ---
    // C.E. mid-sentence: period re-appended because next word is capitalised.
    // C.E. at end of string: period is not re-appended (no following capital word to detect).
    { input: "I was born in 1994 C.E. My brother was born in 1996 C.E.", expected: "I was born in 11994 H.E. (Holocene Era) [converted from 1994 CE]. My brother was born in 11996 H.E. (Holocene Era) [converted from 1996 CE]." },

    // --- MULTI-SENTENCE WITH SINGLES AND LABELED RANGE ---
    // Multiple singles across sentences
    { input: "Genghis Khan was born in 1162 CE and died in 1227 CE. His empire existed from 1206 CE to 1368 CE.",
      expected: "Genghis Khan was born in 11162 H.E. (Holocene Era) [converted from 1162 CE] and died in 11227 H.E. (Holocene Era) [converted from 1227 CE]. His empire existed from 11206–11368 H.E. (Holocene Era) [converted from 1206 CE–1368 CE]." },

    // Labeled range where only end year carries the era
    { input: "The Viking Age was roughly 793–1066 CE. This was a period of Norse expansion and trade.",
      expected: "The Viking Age was roughly 10793–11066 H.E. (Holocene Era) [converted from 793 CE–1066 CE]. This was a period of Norse expansion and trade." },

    // Semicolons and colons as separators
    { input: "The ancient world ended around 476 CE; the medieval period lasted until approximately 1400 CE. Key dates include: 410 CE and 455 CE.",
      expected: "The ancient world ended around 10476 H.E. (Holocene Era) [converted from 476 CE]; the medieval period lasted until approximately 11400 H.E. (Holocene Era) [converted from 1400 CE]. Key dates include: 10410 H.E. (Holocene Era) [converted from 410 CE] and 10455 H.E. (Holocene Era) [converted from 455 CE]." },

    // --- EMOJIS ---
    // Emojis at sentence boundaries
    { input: "🏺 Ancient Rome was founded around 753 BCE. 🏛️ The Republic lasted from 509 BCE to 27 BCE.",
      expected: "🏺 Ancient Rome was founded around 9248 H.E. (Holocene Era) [converted from 753 BCE]. 🏛️ The Republic lasted from 9492–9974 H.E. (Holocene Era) [converted from 509 BCE–27 BCE]." },

    // Emojis mid-sentence
    { input: "The 🌍 world changed in 1492 CE 🚢 when Columbus sailed. By 1776 CE 🗽 America was independent.",
      expected: "The 🌍 world changed in 11492 H.E. (Holocene Era) [converted from 1492 CE] 🚢 when Columbus sailed. By 11776 H.E. (Holocene Era) [converted from 1776 CE] 🗽 America was independent." },

    // --- FOREIGN LANGUAGE ---
    // Spanish sentence ("hasta" is not a range connector → two separate singles)
    { input: "El Imperio Romano existió desde 753 BCE hasta 476 CE, según los historiadores.",
      expected: "El Imperio Romano existió desde 9248 H.E. (Holocene Era) [converted from 753 BCE] hasta 10476 H.E. (Holocene Era) [converted from 476 CE], según los historiadores." },

    // German sentence
    { input: "Im Jahr 1914 CE begann der Erste Weltkrieg, der bis 1918 CE dauerte.",
      expected: "Im Jahr 11914 H.E. (Holocene Era) [converted from 1914 CE] begann der Erste Weltkrieg, der bis 11918 H.E. (Holocene Era) [converted from 1918 CE] dauerte." },

    // --- SENTENCE BOUNDARY ISOLATION ---
    // Phone number range must not convert; date in separate sentence must convert
    { input: "Call us at extension 1200-1400. The Roman Forum was built around 500 BCE.",
      expected: "Call us at extension 1200-1400. The Roman Forum was built around 9501 H.E. (Holocene Era) [converted from 500 BCE]." },

    // "Dr." abbreviation period must not trigger a sentence boundary; phone number in second sentence must not convert
    { input: "Dr. Smith was born in 1978 CE. His office phone is 1200-1400, extension 7.",
      expected: "Dr. Smith was born in 11978 H.E. (Holocene Era) [converted from 1978 CE]. His office phone is 1200-1400, extension 7." },

    // --- MIXED ERA TYPES ---
    // BP and BCE in the same sentence
    { input: "Humans first arrived around 3000 BP and the Bronze Age began around 1200 BCE.",
      expected: "Humans first arrived around 8950 H.E. (Holocene Era) [converted from 3000 BP] and the Bronze Age began around 8801 H.E. (Holocene Era) [converted from 1200 BCE]." },

    // BCE range then written ordinal century CE in the next sentence
    { input: "The Hellenistic period ran from 323 BCE to 31 BCE. The first century CE saw Rome's golden age.",
      expected: "The Hellenistic period ran from 9678–9970 H.E. (Holocene Era) [converted from 323 BCE–31 BCE]. The 10000s H.E. (Holocene Era) [converted from 1st century CE] saw Rome's golden age." },

    // Written century CE followed by unlabeled decade range in the next sentence
    { input: "In the nineteenth century CE, the Industrial Revolution transformed society. The 1840s–1870s were decades of rapid change.",
      expected: "In the 11800s H.E. (Holocene Era) [converted from 19th century CE], the Industrial Revolution transformed society. The 11840s–11870s H.E. (Holocene Era) [converted from 1840s–1870s CE] were decades of rapid change." },

    // --- SPECIAL CHARACTERS ---
    // Ampersand between two singles; slash in "9/11" must not convert
    { input: "The 1914 CE & 1918 CE dates mark WWI. The 9/11 tragedy occurred in 2001 CE.",
      expected: "The 11914 H.E. (Holocene Era) [converted from 1914 CE] & 11918 H.E. (Holocene Era) [converted from 1918 CE] dates mark WWI. The 9/11 tragedy occurred in 12001 H.E. (Holocene Era) [converted from 2001 CE]." },

    // --- LIST AND PARENTHETICAL ---
    // Comma-separated list ending with a labeled range
    { input: "Important events: the fall of Rome in 476 CE, the Norman Conquest in 1066 CE, and the Black Death from 1347–1351 CE.",
      expected: "Important events: the fall of Rome in 10476 H.E. (Holocene Era) [converted from 476 CE], the Norman Conquest in 11066 H.E. (Holocene Era) [converted from 1066 CE], and the Black Death from 11347–11351 H.E. (Holocene Era) [converted from 1347 CE–1351 CE]." },

    // Written century inside parentheses
    { input: "The Renaissance began in Florence around 1400 CE (roughly the early fifteenth century CE) and spread across Europe.",
      expected: "The Renaissance began in Florence around 11400 H.E. (Holocene Era) [converted from 1400 CE] (roughly the early 11400s H.E. (Holocene Era) [converted from 15th century CE]) and spread across Europe." },

    // --- EM DASH TIMELINE ---
    // Em dashes (—) are not range connectors → three separate singles
    { input: "Timeline of events: 44 BCE — Julius Caesar assassinated; 27 BCE — Augustus became emperor; 476 CE — Fall of Rome.",
      expected: "Timeline of events: 9957 H.E. (Holocene Era) [converted from 44 BCE] — Julius Caesar assassinated; 9974 H.E. (Holocene Era) [converted from 27 BCE] — Augustus became emperor; 10476 H.E. (Holocene Era) [converted from 476 CE] — Fall of Rome." },

    // --- TRYING TO TRICK IT ---
    { input: "Around 1400 ships sailed across the ocean.", expected: "Around 1400 ships sailed across the ocean." },
    { input: "c. 1200 was the best", expected: "c. 11200 H.E. (Holocene Era) [converted from 1200 CE] was the best" },
    { input: "~ 300 is thought to be the fall of Rome", expected: "~ 10300 H.E. (Holocene Era) [converted from 300 CE] is thought to be the fall of Rome" },
    { input: "around 1000 is the first milennia", expected: "around 11000 H.E. (Holocene Era) [converted from 1000 CE] is the first milennia" },
    { input: "1200 was the best", expected: "11200 H.E. (Holocene Era) [converted from 1200 CE] was the best" },
    { input: "300 is thought to be the fall of Rome", expected: "10300 H.E. (Holocene Era) [converted from 300 CE] is thought to be the fall of Rome" },
    { input: "1200 men manned the ship in the assault on Paris in 1200.", expected: "1200 men manned the ship in the assault on Paris in 11200 H.E. (Holocene Era) [converted from 1200 CE]." },
    { input: "600 running mice finished the race in 1999.", expected: "600 running mice finished the race in 11999 H.E. (Holocene Era) [converted from 1999 CE]." },
    { input: "1200 various artifacts.", expected: "1200 various artifacts." },
    { input: "1200 soldiers", expected: "1200 soldiers" },
    { input: "I have 1 apple.", expected: "I have 1 apple." },
    { input: "I have 0 influence.", expected: "I have 0 influence." },
    { input: "I am 44 years old.", expected: "I am 44 years old." },
    { input: "I have 30 copious pumpkins.", expected: "I have 30 copious pumpkins." },


    // --- NEXT ROUND TO TRICK IT ---
    { input: "In the 1980s-90s various things...", expected: "In the 11980s–90s H.E. (Holocene Era) [converted from 1980s-90s CE] various things..." },
    { input: "The first hundred is rough.", expected: "The first hundred is rough." },
    { input: "I have around 2.", expected: "I have around 2." },
    { input: "400 USD", expected: "400 USD" },
    { input: "2000USD", expected: "2000USD" },
    { input: "100 EUR", expected: "100 EUR" },
    { input: "$100", expected: "$100" },
    { input: "100 percent", expected: "100 percent" },
    { input: "100%", expected: "100%" },
    { input: "80 pct", expected: "80 pct" },
    { input: "4 dozen", expected: "4 dozen" },
    { input: "6 per day", expected: "6 per day" },
    { input: "6 hour train ride", expected: "6 hour train ride" },
    { input: "1000 fold, 1000 person, 1000 strong, 1000 odd, 1000 year gap, 1000th, 1001st, 1002nd, 1003rd, 1000 page book, 1000 horsepower, 1000 gauge, 1000 carat, 1000 degree heat", expected: "1000 fold, 1000 person, 1000 strong, 1000 odd, 1000 year gap, 1000th, 1001st, 1002nd, 1003rd, 1000 page book, 1000 horsepower, 1000 gauge, 1000 carat, 1000 degree heat" },
    { input: "4000 of the soldiers", expected: "4000 of the soldiers" },
    { input: "year 900 of the Republic", expected: "year 10900 H.E. (Holocene Era) [converted from 900 CE] of the Republic" },
    { input: "In the year of our Lord 1503, we set sail", expected: "In the year of our Lord 11503 H.E. (Holocene Era) [converted from 1503 CE], we set sail" },

    // --- UNITS ---
    { input: "400 V", expected: "400 V" },
    { input: "400 cm", expected: "400 cm" },
    { input: "500 miles", expected: "500 miles" },
    { input: "200 lbs", expected: "200 lbs" },
    { input: "400 volt", expected: "400 volt" },


    // =====================================================================
    // EDGE CASE SURVEY — False Positives & False Negatives
    // Each bullet from the brainstorm gets 3 tests.
    // =====================================================================

    // --- FALSE POSITIVES: Non-Year Numbers That May Be Misidentified ---

    // Version numbers
    { input: "Python 3.11 is the latest version available", expected: "Python 3.11 is the latest version available" },
    { input: "HTTP 2 is the new standard protocol", expected: "HTTP 2 is the new standard protocol" },
    { input: "the server returned HTTP 404 not found", expected: "the server returned HTTP 404 not found" },

    // Model / part numbers
    { input: "The Boeing 747 flew overnight to London", expected: "The Boeing 747 flew overnight to London" },
    { input: "Fires an AK-47 rifle in combat situations", expected: "Fires an AK-47 rifle in combat situations" },
    { input: "B-52 bombers flew long-range strategic missions", expected: "B-52 bombers flew long-range strategic missions" },
    { input: "Heckler & Koch 416 was a part", expected: "Heckler & Koch 416 was a part" },

    // Highway / route numbers
    { input: "Take Highway 101 south toward the city", expected: "Take Highway 101 south toward the city" },
    { input: "Drive north on I-495 through Virginia today", expected: "Drive north on I-495 through Virginia today" },
    { input: "Route 666 runs west to east across America", expected: "Route 666 runs west to east across America" },

    // Patent or law numbers
    { input: "Public Law 111 was signed into federal law", expected: "Public Law 111 was signed into federal law" },
    { input: "Patent 1500 covers the described invention", expected: "Patent 1500 covers the described invention" },
    { input: "See RFC number 2616 for the HTTP specification", expected: "See RFC number 2616 for the HTTP specification" },

    // Port numbers
    { input: "Listen on port 443 for incoming HTTPS traffic", expected: "Listen on port 443 for incoming HTTPS traffic" },
    { input: "The server uses port 2080 by default", expected: "The server uses port 2080 by default" },
    { input: "Allow incoming traffic on port 2222 remotely", expected: "Allow incoming traffic on port 2222 remotely" },

    // RFC document numbers
    { input: "Per RFC 2616, the response header must be present", expected: "Per RFC 2616, the response header must be present" },
    { input: "RFC 1540 describes HTTP/2 binary framing format", expected: "RFC 1540 describes HTTP/2 binary framing format" },
    { input: "RFC 1918 defines the private IP address ranges", expected: "RFC 1918 defines the private IP address ranges" },

    // Frequency — Hz is in units (should pass), baud is not (may fail)
    { input: "The signal runs at 2400 Hz continuously", expected: "The signal runs at 2400 Hz continuously" },
    { input: "Old modems connected at 1200 baud over phone lines", expected: "Old modems connected at 1200 baud over phone lines" },
    { input: "A 900 MHz processor ran consistently hot", expected: "A 900 MHz processor ran consistently hot" },

    // Voltage / wattage — V, W, kW all in units (should all pass)
    { input: "Plugged into a 240 V outlet in Europe", expected: "Plugged into a 240 V outlet in Europe" },
    { input: "The space heater draws 1200 W of power", expected: "The space heater draws 1200 W of power" },
    { input: "The turbine generates 1800 kW continuously", expected: "The turbine generates 1800 kW continuously" },

    // Screen resolution — × symbol blocks word check for 1920 and 2560
    { input: "the display runs at 1920×1080 pixels natively", expected: "the display runs at 1920×1080 pixels natively" },
    { input: "scaled to 1440p on the external monitor", expected: "scaled to 1440p on the external monitor" },
    { input: "the game renders at 2560×1440 at full detail", expected: "the game renders at 2560×1440 at full detail" },

    // Caloric — calories is count noun, kcal/cal in units (should all pass)
    { input: "consume 2000 calories each day for maintenance", expected: "consume 2000 calories each day for maintenance" },
    { input: "the strict diet allows 1800 kcal per day", expected: "the strict diet allows 1800 kcal per day" },
    { input: "he burned 1500 cal during the long run", expected: "he burned 1500 cal during the long run" },

    // Altitude / depth — ft, m in units (should all pass)
    { input: "the aircraft cruised at 1500 ft above the clouds", expected: "the aircraft cruised at 1500 ft above the clouds" },
    { input: "the wreck lay at a depth of 700 m below", expected: "the wreck lay at a depth of 700 m below" },
    { input: "the summit stands at 2800 m above sea level", expected: "the summit stands at 2800 m above sea level" },

    // File sizes — kb, mb, gb all in units (should all pass)
    { input: "uploaded a 1024 KB document to the server", expected: "uploaded a 1024 KB document to the server" },
    { input: "the program needs 2048 MB of free RAM", expected: "the program needs 2048 MB of free RAM" },
    { input: "the external drive holds 512 GB of data", expected: "the external drive holds 512 GB of data" },

    // Credit / FICO scores — number has nothing or non-blocking word after it
    { input: "a credit score of 750 was required for approval", expected: "a credit score of 750 was required for approval" },
    { input: "his FICO score of 800 got him approved immediately", expected: "his FICO score of 800 got him approved immediately" },
    { input: "the IQ test returned a result of 135 points", expected: "the IQ test returned a result of 135 points" },

    // IQ / standardized test scores
    { input: "scored 1400 on the SAT college entrance exam", expected: "scored 1400 on the SAT college entrance exam" },
    { input: "a perfect ACT score of 1600 was unheard of", expected: "a perfect ACT score of 1600 was unheard of" },
    { input: "she improved her credit rating to 780 over time", expected: "she improved her credit rating to 780 over time" },

    // HTTP status codes — "error" BEFORE number is not caught; "error" AFTER IS caught
    { input: "error 404 was returned by the web server", expected: "error 404 was returned by the web server" },
    { input: "HTTP status 200 OK response was received", expected: "HTTP status 200 OK response was received" },
    { input: "got a 500 error back from the API endpoint", expected: "got a 500 error back from the API endpoint" },

    // Zip / postal codes — 5-digit US zips >3000 pass; 4-digit Australian codes may fail
    { input: "zip code 94107 is in San Francisco California", expected: "zip code 94107 is in San Francisco California" },
    { input: "postal code 10001 serves midtown New York City", expected: "postal code 10001 serves midtown New York City" },
    { input: "postal code 2000 covers central Sydney Australia", expected: "postal code 2000 covers central Sydney Australia" },

    // Biblical / legal citations — colon blocks verse; "of" check saves article refs
    { input: "as stated in Genesis 101:101 of the scripture text", expected: "as stated in Genesis 101:101 of the scripture text" },
    { input: "Section 1983 allows civil rights lawsuits in court", expected: "Section 1983 allows civil rights lawsuits in court" },
    { input: "Article 1776 of the legal code clearly applies here", expected: "Article 1776 of the legal code clearly applies here" },

    // Page numbers — "page" precedes number so the word-after check doesn't help
    { input: "see page 247 for the full discussion below", expected: "see page 247 for the full discussion below" },
    { input: "turn to page 1066 for the bibliography section", expected: "turn to page 1066 for the bibliography section" },
    { input: "referenced on p. 247 in the appendix index", expected: "referenced on p. 247 in the appendix index" },

    // Atmospheric pressure — mbar/mmHg in units; hPa is NOT in units
    { input: "barometric pressure is 1013 hPa at sea level", expected: "barometric pressure is 1013 hPa at sea level" },
    { input: "standard pressure of 1013 mbar was measured today", expected: "standard pressure of 1013 mbar was measured today" },
    { input: "a barometric reading of 760 mmHg was recorded", expected: "a barometric reading of 760 mmHg was recorded" },

    // RPM — rpm in units (should all pass)
    { input: "engine idles steadily at 1800 RPM when fully warm", expected: "engine idles steadily at 1800 RPM when fully warm" },
    { input: "running at 2400 rpm under maximum continuous load", expected: "running at 2400 rpm under maximum continuous load" },
    { input: "idle speed is 800 rpm when the car is in neutral", expected: "idle speed is 800 rpm when the car is in neutral" },


    // --- FALSE NEGATIVES: Real Year References That May Not Be Caught ---

    // Treaty / agreement years in parentheses — single years should convert; ranges may not
    { input: "The Treaty of Westphalia (1648) ended the Thirty Years War", expected: "The Treaty of Westphalia (11648 H.E. (Holocene Era) [converted from 1648 CE]) ended the Thirty Years War" },
    { input: "Napoleon Bonaparte (1769–1821) was a French general", expected: "Napoleon Bonaparte (11769 H.E. (Holocene Era) [converted from 1769 CE]–11821 H.E. (Holocene Era) [converted from 1821 CE]) was a French general" },
    { input: "[1492] Columbus arrived in the Americas that year", expected: "[11492 H.E. (Holocene Era) [converted from 1492 CE]] Columbus arrived in the Americas that year" },

    // Election years — "election" is not in strongIndicators
    { input: "the 1860 election was pivotal in American history", expected: "the 11860 H.E. (Holocene Era) [converted from 1860 CE] election was pivotal in American history" },
    { input: "the election of 1800 was hotly contested in America", expected: "the election of 11800 H.E. (Holocene Era) [converted from 1800 CE] was hotly contested in America" },
    { input: "1860 election results were disputed by many people", expected: "11860 H.E. (Holocene Era) [converted from 1860 CE] election results were disputed by many people" },

    // "Year" as a word — already a strong indicator, these should all pass
    { input: "the year 1453 marked the fall of Constantinople", expected: "the year 11453 H.E. (Holocene Era) [converted from 1453 CE] marked the fall of Constantinople" },
    { input: "in the year 1066 William conquered all of England", expected: "in the year 11066 H.E. (Holocene Era) [converted from 1066 CE] William conquered all of England" },
    { input: "that year, 1066, changed the course of history", expected: "that year, 11066 H.E. (Holocene Era) [converted from 1066 CE], changed the course of history" },

    // Fiscal / quarter notation — count nouns like "earnings" and "results" may block
    { input: "Q3 2024 earnings report disappointed analysts badly", expected: "Q3 12024 H.E. (Holocene Era) [converted from 2024 CE] earnings report disappointed analysts badly" },
    { input: "H1 2023 results showed strong revenue growth overall", expected: "H1 12023 H.E. (Holocene Era) [converted from 2023 CE] results showed strong revenue growth overall" },
    { input: "FY2025 budget projections are overly optimistic now", expected: "FY12025 H.E. (Holocene Era) [converted from 2025 CE] budget projections are overly optimistic now" },

    // Publication / copyright years
    { input: "published in 1859, Darwin described natural selection", expected: "published in 11859 H.E. (Holocene Era) [converted from 1859 CE], Darwin described natural selection" },
    { input: "© 1997 All rights reserved worldwide by the author", expected: "© 11997 H.E. (Holocene Era) [converted from 1997 CE] All rights reserved worldwide by the author" },
    { input: "printed in 2003, the book quickly became popular", expected: "printed in 12003 H.E. (Holocene Era) [converted from 2003 CE], the book quickly became popular" },

    // Named events — event nouns (earthquake, pandemic, landing) not in strongIndicators
    { input: "the 1906 earthquake struck and devastated San Francisco", expected: "the 11906 H.E. (Holocene Era) [converted from 1906 CE] earthquake struck and devastated San Francisco" },
    { input: "the 1918 pandemic killed millions of people worldwide", expected: "the 11918 H.E. (Holocene Era) [converted from 1918 CE] pandemic killed millions of people worldwide" },
    { input: "the 1969 moon landing was broadcast live globally", expected: "the 11969 H.E. (Holocene Era) [converted from 1969 CE] moon landing was broadcast live globally" },

    // Years followed by non-era acronyms (VE, USA, NATO) — should still convert
    { input: "1945 VE Day marked the end of war in Europe", expected: "11945 H.E. (Holocene Era) [converted from 1945 CE] VE Day marked the end of war in Europe" },
    { input: "1776 USA declared independence from the British crown", expected: "11776 H.E. (Holocene Era) [converted from 1776 CE] USA declared independence from the British crown" },
    { input: "post-1945 NATO was established for collective defense", expected: "post-11945 H.E. (Holocene Era) [converted from 1945 CE] NATO was established for collective defense" },

    // Pre- / post- prefixed years
    { input: "pre-1914 Europe was relatively stable and prosperous", expected: "pre-11914 H.E. (Holocene Era) [converted from 1914 CE] Europe was relatively stable and prosperous" },
    { input: "post-1945 reconstruction began across all of Europe", expected: "post-11945 H.E. (Holocene Era) [converted from 1945 CE] reconstruction began across all of Europe" },
    //{ input: "mid-1800s-era settlements were common across the west", expected: "mid-11800s H.E. (Holocene Era) [converted from 1800s CE]-era settlements were common across the west" },

    // Parenthetical and bracketed single years
    { input: "The Magna Carta (1215) was signed at Runnymede England", expected: "The Magna Carta (11215 H.E. (Holocene Era) [converted from 1215 CE]) was signed at Runnymede England" },
    { input: "[1066] William conquered England at the Battle of Hastings", expected: "[11066 H.E. (Holocene Era) [converted from 1066 CE]] William conquered England at the Battle of Hastings" },
    { input: "The Battle of Hastings [1066] transformed medieval Britain", expected: "The Battle of Hastings [11066 H.E. (Holocene Era) [converted from 1066 CE]] transformed medieval Britain" },

    // Financial event years — crash, crisis, rally not in strongIndicators
    { input: "the 1929 crash wiped out countless personal fortunes", expected: "the 11929 H.E. (Holocene Era) [converted from 1929 CE] crash wiped out countless personal fortunes" },
    { input: "the 2008 crisis hit global markets especially hard", expected: "the 12008 H.E. (Holocene Era) [converted from 2008 CE] crisis hit global markets especially hard" },
    { input: "the 1987 stock market rally quickly reversed course", expected: "the 11987 H.E. (Holocene Era) [converted from 1987 CE] stock market rally quickly reversed course" },

    // Year as adjective for events — festival, boycott, embargo not in strongIndicators
    { input: "the 1969 Woodstock festival drew enormous enthusiastic crowds", expected: "the 11969 H.E. (Holocene Era) [converted from 1969 CE] Woodstock festival drew enormous enthusiastic crowds" },
    { input: "the 1980 Olympics boycott angered many dedicated athletes", expected: "the 11980 H.E. (Holocene Era) [converted from 1980 CE] Olympics boycott angered many dedicated athletes" },
    { input: "the 1973 oil embargo shocked Western economies deeply", expected: "the 11973 H.E. (Holocene Era) [converted from 1973 CE] oil embargo shocked Western economies deeply" }


];

allTests.forEach(({ input, expected }) => {
    const output = processText(input);
    const pass = output === expected ? "✅" : "❌";

    if (pass === "❌") {
        console.log(`${pass} FAILED`);
        console.log(`Input:    "${input}"`);
        console.log(`Output:   "${output}"`);
        console.log(`Expected: "${expected}"`);
        console.log("------");
    } else {
        console.log(`${pass} ${input}`);
        console.log(`Output: ${output}`);
    }
});

//-------------------------------------------------------