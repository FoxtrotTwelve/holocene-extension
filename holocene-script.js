
//The Era Tag pattern options to search for - variable used throughout 
const ERA_PATTERN = "BCE|BC|CE|AD|BP|A\\.D\\.|B\\.C\\.E\\.|B\\.C\\.|C\\.E\\.|B\\.P\\.|\\(BCE\\)|\\(BC\\)|\\(CE\\)|\\(AD\\)|\\(BP\\)|\\(B.C.E.\\)|\\(B.C.\\)|\\(C.E.\\)|\\(A.D.\\)|\\(B.P.\\)";

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
  `\\s*(${ERA_PATTERN})(?![a-zA-Z])(\\.)?`,  // group 4: suffix era, group 5: trailing period
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
  `\\b(${FUZZY_MODIFIER})?` +              // group 1: fuzzy prefix (y1)
  `(?:(AD|A\\.D\\.)\\s*)?` +              // group 2: prefix era
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +     // group 3: start year
  `(?:\\s*(${ERA_PATTERN}))?` +            // group 4: start era (optional)
  `\\s*(?:-|–|to|and)\\s*` +              // separator (includes "and")
  `(${FUZZY_MODIFIER})?` +                // group 5: fuzzy prefix (y2)
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +     // group 6: end year
  `(?:\\s*(${ERA_PATTERN}))?` +            // group 7: end era (optional)
  `(?=\\s|$|[.,;:)\\]])`,                 // lookahead includes ) and ]
  "gi"
);

//Regex for Century references (e.g., "15th century BCE"):
// const centuryRegex = new RegExp(
//   `\\b(${FUZZY_MODIFIER})?(\\d+)(st|nd|rd|th)\\s+century\\s*(${ERA_PATTERN})?\\b`,
//   "gi"
// );
const centuryRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?(\\d+)(st|nd|rd|th)([-\\s]+)century(?:\\s+(${ERA_PATTERN}))?(\\s*)`,
  "gi"
);
//console.log("UPDATED CENTURY REGEX ACTIVE");

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

    era = era.replace(/^\(|\)$/g, '').trim().toUpperCase();
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
    // Decimal point immediately before — calibers (.308), batting averages (.300)
    if (nodeValue[index - 1] === '.') return false;

    // Citation/footnote brackets — [100] style reference markers.
    // Only block when preceded by a word char, '.', or ']' (e.g. ".[22]", "War[100]", "[99][100]").
    // Years-in-brackets like "[1492] Columbus" are preceded by space/start and should convert.
    if (nodeValue[index - 1] === '[' && nodeValue[index + match.length] === ']') {
        const charBeforeBracket = nodeValue[index - 2] || '';
        if (/[.\w\]]/.test(charBeforeBracket)) return false;
    }

    // Thousands separator — "200,000" should not split "200" as a year
    if (nodeValue[index + match.length] === ',' &&
        /^\d{3}(?!\d)/.test(nodeValue.slice(index + match.length + 1))) return false;

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

    // Inhibitor checks — run BEFORE strongIndicators so that a brand name or catalog
    // label before the number always wins, even when temporal words appear in the sentence
    // (e.g. "Symphony No. 1066 was discovered" — "discovered" is a strong indicator but
    // "No." should still block conversion).
    const immPrecMatch = before.match(/\b([a-z.']+(?:-[a-z.']+)*)\s*$/);
    const immPrecWord = immPrecMatch ? immPrecMatch[1] : '';

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
        // Aviation / military operations
        'flight', 'mission',
        // Musical catalog / opus numbers (Op. 131, BWV 1045, No. 131)
        'op.', 'opus', 'no.', 'bwv', 'hob.',
        // Location / contact designators
        'suite', 'unit', 'ext.', 'extension', 'zip', 'postcode',
    ]);
    if (precedingInhibitors.has(immPrecWord)) return false;

    // Brand/company names that precede model or product numbers, not years.
    // For multi-word brands (e.g. "Heckler & Koch 416"), add the last token that
    // directly precedes the number. The immPrecWord regex captures hyphens and
    // apostrophes, so "Can-Am", "Ski-Doo", "Sea-Doo", and "Levi's" work directly.
    // Space-separated brands whose last word is too generic ("Sea Ray", "Arctic Cat")
    // are handled by the brandPhrases two-word check below.
    const brandNames = new Set([
        // Automobiles — European sports / exotic
        'porsche', 'ferrari', 'lamborghini', 'maserati', 'bugatti',
        'mclaren', 'shelby',
        // Automobiles — European mainstream
        'fiat', 'alfa', 'romeo',     // Alfa Romeo: last word before number is "romeo"
        'lancia', 'audi', 'bmw', 'mercedes', 'benz', 'daimler',
        'volvo', 'saab', 'peugeot',
        // Automobiles — British / classic
        'jaguar', 'rover', 'cord', 'delorean', 'packard', 'nash',
        'healey',                    // Austin-Healey: last word is "healey"
        // Automobiles — American
        'ford', 'chevrolet', 'chrysler', 'ram', 'lincoln',
        'buick', 'oldsmobile', 'dodge', 'pontiac', 'plymouth',
        'amc', 'studebaker', 'hudson',
        // Automobiles — Asian
        'honda', 'toyota', 'nissan', 'mitsubishi', 'mazda', 'subaru',
        // Marine — outboard motors / boats
        'evinrude', 'mercury',
        'whaler',                    // Boston Whaler: last word is "whaler"
        // Commercial Vehicles
        'peterbilt', 'kenworth', 'freightliner', 'scania',
        // Heavy Equipment / Agricultural
        'deere',                     // John Deere: last word is "deere"
        'massey', 'ferguson',        // Massey Ferguson
        'caterpillar', 'komatsu', 'hanomag', 'panhard',
        'kubota', 'fendt', 'claas', 'deutz', 'terex', 'hitachi',
        // Aircraft
        'boeing', 'airbus', 'embraer', 'bombardier', 'cessna', 'beechcraft',
        'piper', 'gulfstream', 'learjet', 'sikorsky', 'fokker',
        'mirage',                    // Dassault Mirage
        'bell',                      // Bell Helicopter
        'lockheed', 'convair', 'northrop', 'grumman', 'mcdonnell', 'dornier',
        'tupolev', 'antonov',
        'havilland',                 // de Havilland: last word is "havilland"
        // Powersports / Outdoor Power
        'polaris', 'husqvarna', 'stihl',
        'can-am', 'ski-doo', 'sea-doo',
        // Motorcycles
        'kawasaki', 'yamaha', 'ducati', 'triumph', 'norton',
        'aprilia', 'suzuki', 'vincent', 'bsa', 'laverda', 'ural', 'enfield',
        'harley', 'davidson',        // Harley-Davidson
        'agusta',                    // MV Agusta: last word is "agusta"
        'guzzi',                     // Moto Guzzi: last word is "guzzi"
        'indian',                    // Indian Motorcycle
        'benelli', 'ktm', 'jawa', 'velocette', 'ajs', 'husaberg', 'puch',
        'morini',                    // Moto Morini: last word is "morini"
        // Firearms
        'remington', 'winchester', 'browning', 'beretta', 'glock', 'walther',
        'ruger', 'mossberg', 'marlin', 'springfield', 'makarov', 'kalashnikov',
        'heckler', 'koch',           // Heckler & Koch: last word is "koch"
        'wesson',                    // Smith & Wesson: last word is "wesson"
        'sauer',                     // Sig Sauer: last word is "sauer"
        'colt', 'sig', 'savage', 'barrett', 'cz',
        'steyr', 'webley', 'fn', 'vickers', 'weatherby', 'chiappa', 'taurus',
        // Computers / Gaming
        'ibm', 'intel', 'atari', 'commodore', 'amiga', 'xbox',
        'tandy', 'amstrad', 'sinclair',
        // Photography / Optics
        'nikon', 'canon', 'hasselblad', 'leica', 'mamiya', 'pentax',
        'fuji', 'fujifilm', 'yashica',
        // Musical Instruments / Audio
        'gibson', 'fender', 'rickenbacker', 'bosendorfer', 'baldwin',
        'roland', 'korg', 'arp', 'technics', 'marshall',
        'boogie',                    // Mesa Boogie: last word is "boogie"
        'jbl', 'bose',
        'marantz', 'sansui', 'peavey', 'dynaco', 'nad', 'mcintosh',
        'kardon', 'altec', 'hafler', // Harman Kardon: last word is "kardon"
        // Radio / Communications
        'icom', 'kenwood', 'yaesu', 'cobra',
        // Watches / Luxury
        'omega', 'rolex',
        'breitling', 'heuer', 'philippe', 'patek', 'longines', 'seiko',
        // Other
        'heinz', 'xerox', 'singer', 'tonka',
        "levi's",                    // Levi's 501 — apostrophe now captured by extended immPrecWord regex
        'miller', 'craftsman', 'krupp',
    ]);
    if (brandNames.has(immPrecWord)) return false;

    // Two-word brand phrases where the last word alone is too generic to inhibit safely
    const twoWordMatch = before.match(/\b([a-z]+)\s+([a-z]+)\s*$/);
    const twoWordPhrase = twoWordMatch ? `${twoWordMatch[1]} ${twoWordMatch[2]}` : '';
    const brandPhrases = new Set(['sea ray', 'arctic cat', 'de soto']);
    if (brandPhrases.has(twoWordPhrase)) return false;

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

    // Fiscal period notation: Q3 2024, H1 2023 — treat the following year as temporal
    const fiscalPrecedingMatch = rawBefore.match(/\b(Q[1-4]|H[12])\s*$/i);
    if (fiscalPrecedingMatch) return true;

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
        // Radio band identifiers (1200 AM, 101 FM)
        "am", "fm",
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
            // Suffix rules: structurally singular word-forms, never count nouns
            if (w.endsWith("ness")) return false; // darkness, illness, wellness, sadness, …
            if (w.endsWith("ics")) return false;  // politics, economics, physics, mathematics, …
            if (w.endsWith("ess")) return false;  // congress, fortress, empress, countess, duchess, princess, …
            const isTemporalWord = strongIndicators.some(ind => {
                const escaped = ind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`^${escaped}$`, 'i').test(w);
            });
            const singularsEndingInS = [
                // Greek/Latin -is forms (singular, not plural)
                'crisis', 'basis', 'thesis', 'hypothesis', 'analysis', 'synthesis',
                'diagnosis', 'prognosis', 'emphasis', 'genesis', 'nemesis',
                'iris', 'alexis', 'artemis', 'paris', 'acropolis', 'metropolis',
                // Latin -us forms (singular)
                'status', 'bonus', 'campus', 'circus', 'focus', 'nexus', 'radius', 'virus',
                'census', 'exodus', 'caucus', 'hiatus', 'apparatus', 'syllabus',
                'prospectus', 'impetus', 'stimulus', 'calculus', 'cumulus', 'stratus',
                'nimbus', 'mucus', 'discus', 'cactus', 'fetus', 'humus', 'abacus',
                'fungus', 'uterus', 'sinus', 'chorus', 'colossus', 'platypus',
                // Abstract nouns
                'progress', 'success', 'access', 'excess', 'process', 'stress',
                // Common singulars ending in s
                'class', 'glass', 'mass', 'brass', 'gas', 'plus', 'compass',
                'grass', 'moss', 'cross', 'truss', 'bliss',
                // Roman & ancient historical figures (ending in -us/-is, singular names)
                'augustus', 'claudius', 'tiberius', 'marcus', 'brutus', 'crassus',
                'spartacus', 'marius', 'darius', 'cyrus', 'herodotus', 'thucydides',
                'leonidas', 'pericles', 'socrates', 'aristoteles', 'archimedes',
                // Common English surnames (singular proper nouns, not count nouns)
                'adams', 'davis', 'jones', 'harris', 'lewis', 'james', 'thomas', 'hughes',
                'roberts', 'edwards', 'collins', 'morris', 'brooks', 'burns', 'mills', 'ross',
                'barnes', 'wells', 'willis', 'richards', 'chambers', 'phillips', 'stephens',
                'andrews', 'matthews', 'simmons', 'jenkins', 'rogers', 'walters', 'sanders',
                'daniels', 'owens', 'hayes', 'williams', 'davies', 'watts', 'parsons',
                'nichols', 'briggs', 'curtis', 'jacobs', 'ellis', 'abrams', 'pitts',
                'douglas', 'douglass', 'charles', 'francis', 'norris', 'travis', 'ferris',
                'jarvis', 'otis', 'hobbs', 'gibbs', 'biggs', 'riggs', 'griggs', 'phelps',
                'stokes', 'bates', 'yates', 'oates', 'gates', 'keats', 'yeats', 'hobbes',
                'perkins', 'atkins', 'hawkins', 'watkins', 'higgins', 'gibbons', 'tompkins',
                'hutchins', 'burrows', 'meadows', 'commons', 'tubbs', 'elvis',
                // International leaders / historical figures (ending in -s, not caught by suffix rules)
                'calles', 'cardenas', 'vargas', 'morales', 'marcos', 'rosas', 'torres',
                'santos', 'lagos', 'ohiggins', 'reyes', 'morelos',
                'louis', 'nicholas', 'engels', 'strauss',
                // Ancient rulers — Near East, Egypt, Persia (not covered by -us rule)
                'xerxes', 'cambyses', 'ramses', 'ramesses', 'thutmosis', 'sesostris',
                // Cities — European (very common in historical text)
                'athens', 'brussels', 'versailles', 'cannes', 'nantes', 'orleans', 'naples',
                'thebes', 'flanders', 'rhodes', 'wales', 'thames',
                // Cities — American
                'dallas', 'memphis', 'minneapolis', 'indianapolis', 'annapolis',
                'angeles', 'vegas', 'columbus',
                // Countries / territories whose English name ends in -s
                'netherlands', 'philippines',
                // US states ending in -s
                'texas', 'kansas', 'arkansas', 'illinois', 'massachusetts',
                // Mountain ranges / geographic features ending in -s
                'alps', 'andes',
                // Musicians (classical & popular)
                'brahms', 'sibelius', 'beatles', 'ramones',
                // Film directors, actors (excluded: bridges, sellers, hanks, hawks — too common as count nouns)
                'welles', 'lucas', 'hopkins', 'stevens',
            ];
            return !isTemporalWord && !verbsEndingInS.includes(w) && !adjectivesEndingInS.includes(w) && !singularsEndingInS.includes(w);
        }
        // Compound -men plurals (cavalrymen, horsemen, swordsmen, infantrymen, etc.)
        if (w.endsWith('men') && !['hymen','omen','specimen','lumen','semen',
            'acumen','abdomen','bitumen','foramen'].includes(w)) return true;
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
        // For sub-1000 numbers, look past ANY plain modifier to word2 (e.g. "900 Roman deserters")
        // 4-digit years (≥1000) are exempt — "1944 German officers" should still convert
        if (year < 1000 && word2 && isCountNoun(word2)) return false;
    }

    // Count-noun check above wins; strong indicators only apply when no count noun blocked it
    if (hasStrongIndicator) return true;

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
    return text.replace(rangeRegex, (match, fuzzyPrefix, prefixEra, y1, era1, fuzzyPrefix2, y2, era2, offset, string) => {
        const before = string[offset - 1];
        const after = string[offset + match.length];

        //Checks to make sure it doesn't have a dash before/after, isn't already converted, and has 2 years.
        if (before === "-" || before === "–" || after === "-" || after === "–") return match;
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;
        if (!y1 || !y2) return match;

        // "and" as separator is only valid when the first year has no era label.
        // "218 and 201 BC" → era1=undefined → true shorthand range → allow.
        // "410 CE and 455 CE" → era1="CE" → two independent labeled dates → fall back.
        if (/\band\b/i.test(match) && era1) {
            return processSingleYears(match);
        }

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

        // When both endpoints have fuzzy prefixes, fold the prefix into fromLabel and drop it from output
        const fromFuzzy = (fuzzyPrefix && fuzzyPrefix2) ? formatPrefix(fuzzyPrefix) : '';
        // fromLabel: compact for dual-fuzzy or unlabeled; expanded when era label is present
        const fromLabel = fromFuzzy
            ? `${year1}–${year2} ${finalEra2 || ''}`.trim()
            : hasEra
                ? `${year1} ${finalEra1}–${year2} ${finalEra2}`
                : `${year1}–${year2} ${finalEra2 || ''}`.trim();
        const fullFromLabel = `${fromFuzzy}${fromLabel}`.trim();
        const outputPrefix = fuzzyPrefix2 ? '' : formattedPrefix;
        //console.log("Processed in RANGES");
        return `${outputPrefix}${converted1}–${converted2} H.E. (Holocene Era) [converted from ${fullFromLabel}]`;
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

        //console.log("YEAR IS: " + year + " | ERA IS: " + era);

        //console.log("Processed in SINGLE YEARS");
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
        //console.log("Processed in UNLABELED YEARS");
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

        //console.log("Processed in UNLABELED YEARS");
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

        //console.log("Processed in PLURAL REF");
        return `${formattedPrefix}${convertedNumber}${hasS ? "s" : ""} H.E. (Holocene Era) [converted from ${numberStr}s ${eraStr || "CE"}]`;
    });
}

//Turns "13th century" into plural form "1400s" since century references is confusing
function processCenturyReferences(text) {
    return text.replace(centuryRegex, (match, fuzzyPrefix, centuryNumberStr, ordinal, separator, eraStr, trailingSpace, offset, fullText) => {
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
            baseNumber = centuryNumber * 100;
        } else {
            baseNumber = (centuryNumber-1) * 100;
        }

        //Converts to HE
        let convertedNumber = convertYear(baseNumber, era);

        //BCE/BC adjustment for broad centuries (because the first century CE and BC cause confusion)
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1;
        }

        const eraLabel = eraStr ? " " + normalizeEra(eraStr) : "";
        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${centuryNumberStr}${ordinal}${separator}century${eraLabel}]${trailingSpace}`;
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

        //console.log("Processed in WRITTEN CENTURIES");
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

        //console.log("Processed in WRITTEN HUNDREDS");
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
            // Brand names — model numbers should not be treated as decade years
            'porsche', 'ferrari', 'lamborghini', 'maserati', 'bugatti', 'mclaren', 'shelby',
            'fiat', 'alfa', 'romeo', 'lancia', 'audi', 'bmw', 'mercedes', 'benz', 'daimler',
            'volvo', 'saab', 'peugeot', 'jaguar', 'rover', 'cord', 'delorean', 'packard', 'nash',
            'healey', 'ford', 'chevrolet', 'chrysler', 'ram', 'lincoln', 'buick', 'oldsmobile',
            'dodge', 'pontiac', 'plymouth', 'amc', 'studebaker', 'hudson',
            'honda', 'toyota', 'nissan', 'mitsubishi', 'mazda', 'subaru',
            'evinrude', 'mercury', 'whaler', 'peterbilt', 'kenworth', 'freightliner', 'scania',
            'deere', 'massey', 'ferguson', 'caterpillar', 'komatsu', 'hanomag', 'panhard',
            'kubota', 'fendt', 'claas', 'deutz', 'terex', 'hitachi',
            'boeing', 'airbus', 'embraer', 'bombardier', 'cessna', 'beechcraft',
            'piper', 'gulfstream', 'learjet', 'sikorsky', 'fokker', 'mirage', 'bell',
            'lockheed', 'convair', 'northrop', 'grumman', 'mcdonnell', 'dornier', 'tupolev', 'antonov', 'havilland',
            'polaris', 'husqvarna', 'stihl', 'can-am', 'ski-doo', 'sea-doo',
            'kawasaki', 'yamaha', 'ducati', 'triumph', 'norton', 'aprilia', 'suzuki',
            'vincent', 'bsa', 'laverda', 'ural', 'enfield', 'harley', 'davidson',
            'agusta', 'guzzi', 'indian', 'benelli', 'ktm', 'jawa', 'velocette', 'ajs', 'husaberg', 'puch', 'morini',
            'remington', 'winchester', 'browning', 'beretta', 'glock', 'walther',
            'ruger', 'mossberg', 'marlin', 'springfield', 'makarov', 'kalashnikov',
            'heckler', 'koch', 'wesson', 'sauer', 'colt', 'sig', 'savage', 'barrett', 'cz',
            'steyr', 'webley', 'fn', 'vickers', 'weatherby', 'chiappa', 'taurus',
            'ibm', 'intel', 'atari', 'commodore', 'amiga', 'xbox', 'tandy', 'amstrad', 'sinclair',
            'nikon', 'canon', 'hasselblad', 'leica', 'mamiya', 'pentax', 'fuji', 'fujifilm', 'yashica',
            'gibson', 'fender', 'rickenbacker', 'bosendorfer', 'baldwin',
            'roland', 'korg', 'arp', 'technics', 'marshall', 'boogie', 'jbl', 'bose',
            'marantz', 'sansui', 'peavey', 'dynaco', 'nad', 'mcintosh', 'kardon', 'altec', 'hafler',
            'icom', 'kenwood', 'yaesu', 'cobra',
            'omega', 'rolex', 'breitling', 'heuer', 'philippe', 'patek', 'longines', 'seiko',
            'heinz', 'xerox', 'singer', 'tonka', "levi's", 'miller', 'craftsman', 'krupp',
        ]);
        if (decadeInhibitors.has(immPrecWord)) return match;

        //Detect era context - make sure it's not a BP
        const after = string.slice(offset, offset + match.length + 10);
        if (new RegExp(`\\b(BP|B\\.P\\.)\\b`, "i").test(after)) {
            return match;
        }

        // Don't protect when a unit abbreviation immediately follows (e.g. "1080 AM", "1750 RPM", "2350 W")
        const rawAfterStr = string.slice(offset + match.length, offset + match.length + 15);
        const firstWordAfter = rawAfterStr.match(/^\s*([A-Za-z]+)/);
        const wordAfter = firstWordAfter ? firstWordAfter[1].toLowerCase() : '';
        const afterUnitInhibitors = new Set([
            // Radio bands
            'am', 'fm',
            // Frequency
            'hz', 'khz', 'mhz', 'ghz', 'thz',
            // Rotation / rate
            'rpm', 'bpm', 'baud',
            // Speed / fuel economy
            'mph', 'kph', 'kt', 'kn', 'mpg',
            // Pressure
            'psi', 'pa', 'kpa', 'mpa', 'bar', 'mbar', 'btu',
            // Power
            'w', 'kw', 'mw', 'gw', 'hp', 'bhp',
            // Energy
            'j', 'kj', 'mj', 'ev', 'kev', 'mev',
            // Voltage / current
            'v', 'kv', 'mv', 'ma', 'ah',
            // Length
            'm', 'km', 'cm', 'mm', 'nm', 'ft', 'yd', 'mi',
            // Mass
            'kg', 'g', 'mg', 'lb', 'oz',
            // Volume
            'l', 'ml', 'dl', 'cl', 'gal',
            // Data size / rate
            'kb', 'mb', 'gb', 'tb', 'bps', 'kbps', 'mbps', 'gbps',
            // Sound / light
            'db', 'lm', 'lx',
            // Caloric / concentration
            'cal', 'kcal', 'ppm', 'ppb',
            // Force
            'n',
        ]);
        if (afterUnitInhibitors.has(wordAfter)) return match;

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

        //console.log("Processed in DECADES");
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

        //console.log("Processed in ABBREVIATED DECADES");
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
    text = text.replace(rangeRegex, (match, _1, _2, _3, _4, _5, _6, _7, offset, string) => {
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
        const result = processRanges(match, surrounding, matchOffset);
        if (result !== match) return result;
        // Fallback: if processRanges rejected the range AND it was followed by ) or ] in
        // the surrounding text (e.g. "(1769–1821)"), the lookahead extension extracted it
        // as a placeholder before individual year processing ran. Try each number individually.
        const charAfterMatch = surrounding[matchOffset + match.length];
        if (charAfterMatch === ')' || charAfterMatch === ']') {
            return match.replace(/\b(\d{3,4})\b/g, (numMatch, _g, numOffset) => {
                const yearNum = parseInt(numMatch, 10);
                if (yearNum < 100 || yearNum > 3000) return numMatch;
                const absOffset = matchOffset + numOffset;
                if (!isLikelyUnlabeledYear(numMatch, surrounding, absOffset)) return numMatch;
                const converted = convertYear(yearNum, 'CE');
                return `${converted} H.E. (Holocene Era) [converted from ${yearNum} CE]`;
            });
        }
        return match;
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
    { input: "fifteenth century BCE and 1400–1500 CE", expected: "8500s H.E. (Holocene Era) [converted from 15th century BCE] and 11400–11500 H.E. (Holocene Era) [converted from 1400 CE–1500 CE]" },
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
    { input: "2nd century AD", expected: "10100s H.E. (Holocene Era) [converted from 2nd century CE]" },
    { input: "1st century", expected: "10000s H.E. (Holocene Era) [converted from 1st century]" }, // default CE

    // BCE / BC centuries
    { input: "5th century BCE", expected: "9500s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "3rd century BC", expected: "9700s H.E. (Holocene Era) [converted from 3rd century BCE]" },

    // Edge cases: very early centuries
    { input: "1st century BCE", expected: "9900s H.E. (Holocene Era) [converted from 1st century BCE]" },
    { input: "12th century CE", expected: "11100s H.E. (Holocene Era) [converted from 12th century CE]" },

    // Mixed with extra text
    { input: "The mid-15th century CE saw changes", expected: "The mid-11400s H.E. (Holocene Era) [converted from 15th century CE] saw changes" },
    { input: "Late 3rd century BC events", expected: "Late 9700s H.E. (Holocene Era) [converted from 3rd century BCE] events" },


    // --- WRITTEN CENTURY TESTS ---
    // Basic CE
    { input: "fifteenth century CE", expected: "11400s H.E. (Holocene Era) [converted from 15th century CE]" },
    { input: "second century AD", expected: "10100s H.E. (Holocene Era) [converted from 2nd century CE]" },
    { input: "first century", expected: "10000s H.E. (Holocene Era) [converted from 1st century]" },

    // Basic BCE
    { input: "fifth century BCE", expected: "9500s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "third century BC", expected: "9700s H.E. (Holocene Era) [converted from 3rd century BCE]" },

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
    { input: "late third century BC", expected: "late 9700s H.E. (Holocene Era) [converted from 3rd century BCE]" },
    { input: "c. twenty-first century CE", expected: "c. 12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "~ twenty first century CE", expected: "~ 12000s H.E. (Holocene Era) [converted from 21st century CE]" },
    { input: "around fifth century BCE", expected: "around 9500s H.E. (Holocene Era) [converted from 5th century BCE]" },
    { input: "The fifteenth century CE saw major changes", expected: "The 11400s H.E. (Holocene Era) [converted from 15th century CE] saw major changes" },
    { input: "In the early twenty-first century CE, technology advanced rapidly",
        expected: "In the early 12000s H.E. (Holocene Era) [converted from 21st century CE], technology advanced rapidly" },
    { input: "Late third century BC events reshaped the region",
        expected: "Late 9700s H.E. (Holocene Era) [converted from 3rd century BCE] events reshaped the region" },
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
    { input: "Porsche 911 is an iconic sports car", expected: "Porsche 911 is an iconic sports car" },
    { input: "Ferrari 458 Italia was produced in 2009", expected: "Ferrari 458 Italia was produced in 12009 H.E. (Holocene Era) [converted from 2009 CE]" },
    { input: "Remington 700 is a bolt-action rifle", expected: "Remington 700 is a bolt-action rifle" },
    { input: "Smith & Wesson 500 revolver", expected: "Smith & Wesson 500 revolver" },
    { input: "Kawasaki 650 motorcycle", expected: "Kawasaki 650 motorcycle" },
    // Automobiles — American classic / muscle
    { input: "The Pontiac 455 was a powerful engine", expected: "The Pontiac 455 was a powerful engine" },
    { input: "Plymouth 440 powered the Road Runner", expected: "Plymouth 440 powered the Road Runner" },
    { input: "The AMC 360 powered the Javelin", expected: "The AMC 360 powered the Javelin" },
    { input: "The Studebaker 289 was the Golden Hawk engine", expected: "The Studebaker 289 was the Golden Hawk engine" },
    { input: "The Subaru 360 was Japan's first kei car", expected: "The Subaru 360 was Japan's first kei car" },
    // Aircraft
    { input: "The Lockheed 1011 TriStar was a wide-body jet", expected: "The Lockheed 1011 TriStar was a wide-body jet" },
    { input: "Convair 880 entered service in 1959", expected: "Convair 880 entered service in 11959 H.E. (Holocene Era) [converted from 1959 CE]" },
    { input: "The Antonov 124 is the world's largest cargo aircraft", expected: "The Antonov 124 is the world's largest cargo aircraft" },
    // Motorcycles
    { input: "The Benelli 750 Sei had six cylinders", expected: "The Benelli 750 Sei had six cylinders" },
    { input: "KTM 690 is a popular adventure bike", expected: "KTM 690 is a popular adventure bike" },
    // Firearms
    { input: "The Steyr 1891 was the standard Austrian rifle", expected: "The Steyr 1891 was the standard Austrian rifle" },
    { input: "Webley 455 was the British service revolver", expected: "Webley 455 was the British service revolver" },
    { input: "Taurus 444 is a powerful revolver", expected: "Taurus 444 is a powerful revolver" },
    // Hi-Fi / Audio
    { input: "The Marantz 2270 is a sought-after vintage receiver", expected: "The Marantz 2270 is a sought-after vintage receiver" },
    { input: "Sansui 1000 was one of the finest receivers", expected: "Sansui 1000 was one of the finest receivers" },
    { input: "McIntosh 275 is a classic tube amplifier", expected: "McIntosh 275 is a classic tube amplifier" },
    // Computers
    { input: "The Tandy 1000 was compatible with IBM PC", expected: "The Tandy 1000 was compatible with IBM PC" },
    // Watches
    { input: "Patek Philippe 2499 is the most coveted chronograph", expected: "Patek Philippe 2499 is the most coveted chronograph" },
    { input: "Breitling 806 was the original Navitimer reference", expected: "Breitling 806 was the original Navitimer reference" },
    // Agricultural
    { input: "The Kubota 2350 is a compact utility tractor", expected: "The Kubota 2350 is a compact utility tractor" },
    { input: "Fendt 936 is one of the most powerful tractors", expected: "Fendt 936 is one of the most powerful tractors" },
    // Two-word phrase brands
    { input: "De Soto 500 was a full-size American car", expected: "De Soto 500 was a full-size American car" },

    // Decimal-preceded numbers (calibers, batting averages) — period before number
    { input: "He fires .308 Winchester rounds at the range", expected: "He fires .308 Winchester rounds at the range" },
    { input: "The .338 Lapua Magnum is a long-range cartridge", expected: "The .338 Lapua Magnum is a long-range cartridge" },
    { input: "batted .300 for the entire season last year", expected: "batted .300 for the entire season last year" },

    // Flight / mission numbers
    { input: "Flight 1549 landed safely on the Hudson River", expected: "Flight 1549 landed safely on the Hudson River" },
    { input: "Mission 1202 was aborted during the lunar landing", expected: "Mission 1202 was aborted during the lunar landing" },
    { input: "Flight 800 exploded shortly after takeoff", expected: "Flight 800 exploded shortly after takeoff" },

    // Musical catalog / opus numbers
    { input: "Beethoven's Op. 131 is a late string quartet", expected: "Beethoven's Op. 131 is a late string quartet" },
    { input: "listen to Opus 131 performed by the Emerson Quartet", expected: "listen to Opus 131 performed by the Emerson Quartet" },
    { input: "BWV 1045 is a Bach violin concerto fragment", expected: "BWV 1045 is a Bach violin concerto fragment" },
    { input: "Symphony No. 1066 was discovered in an archive", expected: "Symphony No. 1066 was discovered in an archive" },

    // AM radio station identifiers
    { input: "tuned to 1200 AM for the morning talk show", expected: "tuned to 1200 AM for the morning talk show" },
    { input: "the 1080 AM station broadcasts news all day", expected: "the 1080 AM station broadcasts news all day" },

    // Location / contact designators
    { input: "Our office is in Suite 1200 on the top floor", expected: "Our office is in Suite 1200 on the top floor" },
    { input: "Unit 1200 in Building A was recently renovated", expected: "Unit 1200 in Building A was recently renovated" },
    { input: "call the main desk at ext. 1234 for assistance", expected: "call the main desk at ext. 1234 for assistance" },
    { input: "reach our support line at extension 1800 today", expected: "reach our support line at extension 1800 today" },
    { input: "postcode 2000 covers the Sydney central business district", expected: "postcode 2000 covers the Sydney central business district" },
    { input: "zip 1234 is an unusual short postal code format", expected: "zip 1234 is an unusual short postal code format" },

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
    { input: "the 1973 oil embargo shocked Western economies deeply", expected: "the 11973 H.E. (Holocene Era) [converted from 1973 CE] oil embargo shocked Western economies deeply" },

    // --- FALSE NEGATIVES FIXED: Words ending in -s that are NOT count nouns ---

    // -ness words (abstract nouns, never count nouns)
    { input: "the 1906 darkness that followed the earthquake shocked everyone", expected: "the 11906 H.E. (Holocene Era) [converted from 1906 CE] darkness that followed the earthquake shocked everyone" },
    { input: "1918 illness swept through the military camps rapidly", expected: "11918 H.E. (Holocene Era) [converted from 1918 CE] illness swept through the military camps rapidly" },
    { input: "a sense of 1929 helplessness gripped ordinary investors worldwide", expected: "a sense of 11929 H.E. (Holocene Era) [converted from 1929 CE] helplessness gripped ordinary investors worldwide" },

    // -ics words (field/discipline names, grammatically singular)
    { input: "1848 politics in Germany were turbulent and revolutionary", expected: "11848 H.E. (Holocene Era) [converted from 1848 CE] politics in Germany were turbulent and revolutionary" },
    { input: "the 1776 economics of the colonies favored independence strongly", expected: "the 11776 H.E. (Holocene Era) [converted from 1776 CE] economics of the colonies favored independence strongly" },
    { input: "1687 physics established Newton's laws of motion forever", expected: "11687 H.E. (Holocene Era) [converted from 1687 CE] physics established Newton's laws of motion forever" },

    // -ess words (singular nouns ending in -ess: congress, fortress, empress, etc.)
    { input: "the 1812 Congress declared war on Britain that summer", expected: "the 11812 H.E. (Holocene Era) [converted from 1812 CE] Congress declared war on Britain that summer" },
    { input: "1453 fortress walls proved no match for Ottoman cannon", expected: "11453 H.E. (Holocene Era) [converted from 1453 CE] fortress walls proved no match for Ottoman cannon" },
    { input: "the 1762 empress Catherine seized control of Russia", expected: "the 11762 H.E. (Holocene Era) [converted from 1762 CE] empress Catherine seized control of Russia" },

    // Latin -us singulars (census, exodus, caucus, hiatus, apparatus, syllabus)
    { input: "the 1810 census revealed the true size of the population", expected: "the 11810 H.E. (Holocene Era) [converted from 1810 CE] census revealed the true size of the population" },
    { input: "the 1848 exodus from Ireland accelerated dramatically after famine", expected: "the 11848 H.E. (Holocene Era) [converted from 1848 CE] exodus from Ireland accelerated dramatically after famine" },
    { input: "the 1860 caucus selected Lincoln as the Republican nominee", expected: "the 11860 H.E. (Holocene Era) [converted from 1860 CE] caucus selected Lincoln as the Republican nominee" },

    // Common surnames ending in -s (not count nouns)
    { input: "the 1826 Adams administration pursued an ambitious national agenda", expected: "the 11826 H.E. (Holocene Era) [converted from 1826 CE] Adams administration pursued an ambitious national agenda" },
    { input: "1865 Davis surrendered and the Confederacy collapsed entirely", expected: "11865 H.E. (Holocene Era) [converted from 1865 CE] Davis surrendered and the Confederacy collapsed entirely" },
    { input: "the 1884 Hayes presidency had already ended four years prior", expected: "the 11884 H.E. (Holocene Era) [converted from 1884 CE] Hayes presidency had already ended four years prior" },

    // Expanded surnames and historical figures
    { input: "the 1845 Douglass narrative described his life in slavery", expected: "the 11845 H.E. (Holocene Era) [converted from 1845 CE] Douglass narrative described his life in slavery" },
    { input: "the 1660 Charles restoration transformed English monarchy", expected: "the 11660 H.E. (Holocene Era) [converted from 1660 CE] Charles restoration transformed English monarchy" },
    { input: "the 1825 Nicholas I regime imposed strict censorship on Russia", expected: "the 11825 H.E. (Holocene Era) [converted from 1825 CE] Nicholas I regime imposed strict censorship on Russia" },
    { input: "the 1934 Cardenas presidency nationalized key Mexican industries", expected: "the 11934 H.E. (Holocene Era) [converted from 1934 CE] Cardenas presidency nationalized key Mexican industries" },
    { input: "the 1930 Vargas regime came to power through a Brazilian coup", expected: "the 11930 H.E. (Holocene Era) [converted from 1930 CE] Vargas regime came to power through a Brazilian coup" },
    { input: "the 1818 OHiggins government established Chilean independence fully", expected: "the 11818 H.E. (Holocene Era) [converted from 1818 CE] OHiggins government established Chilean independence fully" },
    { input: "the 1715 Louis court at Versailles was the envy of Europe", expected: "the 11715 H.E. (Holocene Era) [converted from 1715 CE] Louis court at Versailles was the envy of Europe" },
    { input: "the 1883 Engels correspondence shaped early socialist theory", expected: "the 11883 H.E. (Holocene Era) [converted from 1883 CE] Engels correspondence shaped early socialist theory" },
    // Latin -us expanded (prospectus, stimulus, calculus, cumulus, stratus)
    { input: "the 1687 calculus dispute between Newton and Leibniz was fierce", expected: "the 11687 H.E. (Holocene Era) [converted from 1687 CE] calculus dispute between Newton and Leibniz was fierce" },
    { input: "the 1803 prospectus outlined the original terms of the Louisiana Purchase", expected: "the 11803 H.E. (Holocene Era) [converted from 1803 CE] prospectus outlined the original terms of the Louisiana Purchase" },
    // Ancient historical figures
    { input: "the 44 BCE Augustus consolidation of power transformed Rome forever", expected: "the 9957 H.E. (Holocene Era) [converted from 44 BCE] Augustus consolidation of power transformed Rome forever" },
    { input: "the 480 BCE Leonidas stand at Thermopylae inspired all of Greece", expected: "the 9521 H.E. (Holocene Era) [converted from 480 BCE] Leonidas stand at Thermopylae inspired all of Greece" },

    // Cities — European
    { input: "The 1990 Paris flood caused widespread damage across the city", expected: "The 11990 H.E. (Holocene Era) [converted from 1990 CE] Paris flood caused widespread damage across the city" },
    { input: "the 1919 Versailles treaty formally ended the First World War", expected: "the 11919 H.E. (Holocene Era) [converted from 1919 CE] Versailles treaty formally ended the First World War" },
    { input: "the 1896 Athens Olympics were the first modern games held", expected: "the 11896 H.E. (Holocene Era) [converted from 1896 CE] Athens Olympics were the first modern games held" },
    { input: "the 1957 Brussels World's Fair showcased atomic age technology", expected: "the 11957 H.E. (Holocene Era) [converted from 1957 CE] Brussels World's Fair showcased atomic age technology" },
    { input: "the 1944 Nantes resistance fighters sabotaged German rail lines", expected: "the 11944 H.E. (Holocene Era) [converted from 1944 CE] Nantes resistance fighters sabotaged German rail lines" },
    // Cities — American
    { input: "the 1968 Memphis assassination changed American history forever", expected: "the 11968 H.E. (Holocene Era) [converted from 1968 CE] Memphis assassination changed American history forever" },
    { input: "the 1963 Dallas motorcade ended in tragedy for the nation", expected: "the 11963 H.E. (Holocene Era) [converted from 1963 CE] Dallas motorcade ended in tragedy for the nation" },
    { input: "the 1815 Orleans campaign was Napoleon's final military defeat", expected: "the 11815 H.E. (Holocene Era) [converted from 1815 CE] Orleans campaign was Napoleon's final military defeat" },
    // US States
    { input: "the 1836 Texas revolution established an independent republic", expected: "the 11836 H.E. (Holocene Era) [converted from 1836 CE] Texas revolution established an independent republic" },
    { input: "the 1854 Kansas Nebraska Act inflamed sectional tensions badly", expected: "the 11854 H.E. (Holocene Era) [converted from 1854 CE] Kansas Nebraska Act inflamed sectional tensions badly" },
    { input: "the 1780 Massachusetts constitution was the first written one", expected: "the 11780 H.E. (Holocene Era) [converted from 1780 CE] Massachusetts constitution was the first written one" },
    // Ancient rulers
    { input: "the 480 BCE Xerxes invasion of Greece was eventually repelled", expected: "the 9521 H.E. (Holocene Era) [converted from 480 BCE] Xerxes invasion of Greece was eventually repelled" },
    { input: "the 1279 BCE Ramses victory at Kadesh was celebrated for decades", expected: "the 8722 H.E. (Holocene Era) [converted from 1279 BCE] Ramses victory at Kadesh was celebrated for decades" },
    // Musicians
    { input: "the 1897 Brahms fourth symphony premiered to great acclaim then", expected: "the 11897 H.E. (Holocene Era) [converted from 1897 CE] Brahms fourth symphony premiered to great acclaim then" },
    { input: "the 1964 Beatles arrival in America transformed popular music entirely", expected: "the 11964 H.E. (Holocene Era) [converted from 1964 CE] Beatles arrival in America transformed popular music entirely" },
    // Film
    { input: "the 1941 Welles masterpiece Citizen Kane redefined cinema forever", expected: "the 11941 H.E. (Holocene Era) [converted from 1941 CE] Welles masterpiece Citizen Kane redefined cinema forever" },
    { input: "the 1977 Lucas blockbuster Star Wars changed Hollywood permanently", expected: "the 11977 H.E. (Holocene Era) [converted from 1977 CE] Lucas blockbuster Star Wars changed Hollywood permanently" },


    // --- UNLABELED YEARS: Historical Proper Nouns ---
    // Specific cases: institution/group/event noun follows the year directly
    { input: "The 1886 Shogunate was abolished during the Meiji Restoration", expected: "The 11886 H.E. (Holocene Era) [converted from 1886 CE] Shogunate was abolished during the Meiji Restoration" },
    { input: "1997 Israeli diaspora communities gathered worldwide for the summit", expected: "11997 H.E. (Holocene Era) [converted from 1997 CE] Israeli diaspora communities gathered worldwide for the summit" },
    { input: "the 1974 Panamanian congress voted on the new canal treaty", expected: "the 11974 H.E. (Holocene Era) [converted from 1974 CE] Panamanian congress voted on the new canal treaty" },

    // Ethnic/national adjective before historical noun
    { input: "the 1991 Bosnian war ended after years of brutal conflict", expected: "the 11991 H.E. (Holocene Era) [converted from 1991 CE] Bosnian war ended after years of brutal conflict" },
    { input: "the 1994 Rwandan genocide shocked the world community deeply", expected: "the 11994 H.E. (Holocene Era) [converted from 1994 CE] Rwandan genocide shocked the world community deeply" },
    { input: "the 1979 Iranian revolution changed the Middle East forever", expected: "the 11979 H.E. (Holocene Era) [converted from 1979 CE] Iranian revolution changed the Middle East forever" },
    { input: "the 1956 Suez crisis erupted after Egyptian nationalization", expected: "the 11956 H.E. (Holocene Era) [converted from 1956 CE] Suez crisis erupted after Egyptian nationalization" },
    { input: "the 1948 Arab rejection of the partition plan led to war", expected: "the 11948 H.E. (Holocene Era) [converted from 1948 CE] Arab rejection of the partition plan led to war" },

    // Historical event nouns not in strongIndicators (revolution, uprising, reformation, crusade)
    { input: "the 1789 Revolution transformed French society and politics", expected: "the 11789 H.E. (Holocene Era) [converted from 1789 CE] Revolution transformed French society and politics" },
    { input: "the 1517 Reformation began with Luther's ninety-five theses", expected: "the 11517 H.E. (Holocene Era) [converted from 1517 CE] Reformation began with Luther's ninety-five theses" },
    { input: "the 1956 Hungarian uprising was crushed by Soviet forces", expected: "the 11956 H.E. (Holocene Era) [converted from 1956 CE] Hungarian uprising was crushed by Soviet forces" },
    { input: "the 1853 Shogunate was weakened by American commodore Perry", expected: "the 11853 H.E. (Holocene Era) [converted from 1853 CE] Shogunate was weakened by American commodore Perry" },

    // --- DECADE INHIBITOR: Brand Model Numbers Ending in X0 ---
    // X0 numbers match the decade regex; the brand name before them must block protection
    { input: "The Yamaha 1250 is a sport touring motorcycle", expected: "The Yamaha 1250 is a sport touring motorcycle" },
    { input: "The Ducati 1260 Multistrada is a flagship adventure bike", expected: "The Ducati 1260 Multistrada is a flagship adventure bike" },
    { input: "The Kawasaki 1050 Concours is a sport touring motorcycle", expected: "The Kawasaki 1050 Concours is a sport touring motorcycle" },
    { input: "The Cessna 1750 is a twin-engine light aircraft", expected: "The Cessna 1750 is a twin-engine light aircraft" },
    { input: "The Fendt 1050 Vario is a flagship agricultural tractor", expected: "The Fendt 1050 Vario is a flagship agricultural tractor" },
    { input: "The Roland 1080 is a digital workstation synthesizer", expected: "The Roland 1080 is a digital workstation synthesizer" },

    // --- DECADE INHIBITOR: Additional AM Radio Frequencies Ending in X0 ---
    { input: "Tuned to 1150 AM for the live baseball broadcast", expected: "Tuned to 1150 AM for the live baseball broadcast" },
    { input: "The 1340 AM signal carries local news and weather", expected: "The 1340 AM signal carries local news and weather" },
    { input: "broadcasting on 1470 AM across three counties", expected: "broadcasting on 1470 AM across three counties" },

    // --- DECADE INHIBITOR: Unit Abbreviations After X0 Numbers ---
    // Without the after-word unit check, these would be wrongly converted as decade years
    { input: "The motor spins at 1750 RPM at highway cruising speed", expected: "The motor spins at 1750 RPM at highway cruising speed" },
    { input: "pressurized to 1450 PSI during the hydrostatic pressure test", expected: "pressurized to 1450 PSI during the hydrostatic pressure test" },
    { input: "the generator outputs 2350 W of continuous rated power", expected: "the generator outputs 2350 W of continuous rated power" },
    { input: "the supply rail runs at 1250 V in high-voltage mode", expected: "the supply rail runs at 1250 V in high-voltage mode" },
    { input: "the cable is rated to 1350 kV for high-voltage transmission", expected: "the cable is rated to 1350 kV for high-voltage transmission" },
    { input: "the cliff summit stands 1750 m above the valley floor", expected: "the cliff summit stands 1750 m above the valley floor" },
    { input: "the load was tested at 2250 kg before the bridge opened", expected: "the load was tested at 2250 kg before the bridge opened" },
    { input: "the antenna broadcasts at 1350 kHz on the shortwave band", expected: "the antenna broadcasts at 1350 kHz on the shortwave band" },

    // --- REGRESSION: Historical Years Ending in X0 Still Convert ---
    // Verify the brand and unit inhibitors do not accidentally block real year conversions
    { input: "The 1960 Kennedy election transformed American politics forever", expected: "The 11960 H.E. (Holocene Era) [converted from 1960 CE] Kennedy election transformed American politics forever" },
    { input: "the 1950 Korean War began with a sudden northern invasion", expected: "the 11950 H.E. (Holocene Era) [converted from 1950 CE] Korean War began with a sudden northern invasion" },
    { input: "the 1940 Churchill speech rallied a besieged British nation", expected: "the 11940 H.E. (Holocene Era) [converted from 1940 CE] Churchill speech rallied a besieged British nation" },
    { input: "the 1930 Vargas coup transformed Brazilian politics entirely", expected: "the 11930 H.E. (Holocene Era) [converted from 1930 CE] Vargas coup transformed Brazilian politics entirely" },

    // --- PUNIC WAR WIKIPEDIA ---
    { input: "The Third Punic War (149–146 BC) was the third and last of the Punic Wars fought between Carthage and Rome. The war was fought entirely within Carthaginian territory, in what is now northern Tunisia. When the Second Punic War ended in 201 BC one of the terms of the peace treaty prohibited Carthage from waging war without Rome's permission. Rome's ally, King Masinissa of Numidia, exploited this to repeatedly raid and seize Carthaginian territory with impunity. In 149 BC Carthage sent an army, under Hasdrubal, against Masinissa, the treaty notwithstanding. The campaign ended in disaster as the Battle of Oroscopa ended with a Carthaginian defeat and the surrender of the Carthaginian army. Anti-Carthaginian factions in Rome used the illicit military action as a pretext to prepare a punitive expedition. Later in 149 BC a large Roman army landed at Utica in North Africa. The Carthaginians hoped to appease the Romans, but despite the Carthaginians surrendering all of their weapons, the Romans pressed on to besiege the city of Carthage. The Roman campaign suffered repeated setbacks through 149 BC, only alleviated by Scipio Aemilianus, a middle-ranking officer, distinguishing himself several times. A new Roman commander took over in 148 BC and fared equally badly. At the annual election of Roman magistrates in the spring of 147 BC the public support for Scipio was so great that the usual age restrictions were lifted to allow him to be appointed consul and commander in Africa. Scipio's term commenced with two Carthaginian successes, but he tightened the siege and started to build a large mole to prevent supplies from getting into Carthage via blockade runners. The Carthaginians had partially rebuilt their fleet, and it sortied, to the Romans' surprise. After an indecisive engagement, the Carthaginians mismanaged their withdrawal and lost many ships. The Romans then built a large brick structure in the harbour area that dominated the city wall. Once this was complete, Scipio led a strong force that stormed the camp of Carthage's field army and forced most of the towns and cities still supporting Carthage to surrender. In early 146 BC the Romans launched their final assault and, over six days, systematically destroyed the city and killed its inhabitants; only on the last day did they take prisoners, 50,000 of them, who were sold into slavery. The conquered Carthaginian territories became the Roman province of Africa, with Utica as its capital. It was a century before the site of Carthage was rebuilt as a Roman city. The main source for most aspects of the Punic Wars[note 1] is the historian Polybius (c. 200 – c. 118 BC), a Greek sent to Rome in 167 BC as a hostage.[2] His works include a now-lost manual on military tactics,[3] but he is best known for The Histories, written sometime after 146 BC.[4][5] He accompanied his patron and friend,[6] the Roman general Scipio Aemilianus, in North Africa during the Third Punic War;[7] this causes the normally reliable Polybius to recount Scipio's actions in a favourable light.[8][9][10] In addition, significant portions of The Histories' account of the Third Punic War have been lost.[8][11] The account of the Roman annalist Livy, who relied heavily on Polybius, is much used by modern historians of the Punic Wars,[12] but all that survives of his account of events after 167 BC is a list of contents.[13][14] Other ancient accounts of the Third Punic War or its participants which have also been largely lost include those of Plutarch, Dio Cassius[15] and the Greek Diodorus Siculus.[16] Modern historians also use the account of the 2nd-century AD Greek Appian.[17][18] The modern historian Bernard Mineo states that it 'is the only complete and continuous account of this war'.[15] It is thought to have been largely based on Polybius's account, but several problems with it have been identified.[10][19] These issues mean that of the three Punic Wars, the third is the one about which the least is reliably known.[20] Other sources include coins, inscriptions, archaeological evidence and empirical evidence from reconstructions.[21] In the mid-2nd century BC Rome was the dominant power in the Mediterranean region,[22] while Carthage was a large city-state in the north east of what is now Tunisia.[23][24] Carthage and Rome had fought the 23-year-long First Punic War from 264 to 241 BC and the 17-year-long Second Punic War between 218 and 201 BC. Both wars ended with Roman victories; the Second when the Roman general Scipio Africanus defeated Hannibal, the premier Carthaginian general of the war, at the Battle of Zama, 160 kilometres (100 mi) south-west of Carthage.[25] Africanus imposed a peace treaty on the Carthaginians which stripped them of their overseas territories and some of their African ones. An indemnity of 10,000 silver talents[note 2] was to be paid over 50 years.[26] Hostages were taken and Carthage was prohibited from waging war outside Africa—and could wage war in Africa only with Rome's express permission. Many senior Carthaginians wanted to reject the treaty, but Hannibal spoke strongly in its favour and it was accepted in spring 201 BC.[28][29] Henceforth, it was clear that Carthage was politically subordinate to Rome.[30] At the end of the war Masinissa, an ally of Rome, emerged as by far the most powerful ruler among the Numidians, the indigenous population which controlled much of what is now Algeria and Tunisia.[31] Over the following 50 years, he repeatedly took advantage of Carthage's inability to protect its possessions. Whenever Carthage petitioned Rome for redress or permission to take military action, Rome backed Masinissa and refused.[32] Masinissa's seizures of and raids into Carthaginian territory became increasingly flagrant. In 151 BC Carthage raised a large army commanded by the previously unrecorded[33] general Hasdrubal and, the treaty notwithstanding, counter-attacked the Numidians. The campaign ended in disaster at the Battle of Oroscopa and the army surrendered.[34][35] Many Carthaginians were subsequently massacred by the Numidians.[33] Hasdrubal escaped to Carthage, where, in an attempt to placate Rome, he was condemned to death.[36] Carthage paid off its indemnity in 151 BC[37] and was prospering economically[38] but was no military threat to Rome.[39] Nevertheless, there had long been a faction within the Roman Senate that had wished to take further military action against Carthage.[40] For example, the dislike of Carthage by the senior senator Cato was so well known that since the 18th century (AD), he has been credited with ending all of his speeches with Carthago delenda est ('Carthage must be destroyed').[41][42] The opposing faction included Scipio Nasica, who argued that fear of a strong enemy such as Carthage would keep the common people in check and avoid social division.[33][43] Cato was a member of an embassy to Carthage, probably in 153 BC, and noted her growing economy and strength;[43] Nasica was likely a member of the same embassy.[44] Using the illicit Carthaginian military action as a pretext,[40] Rome began preparing a punitive expedition.[45] Modern scholars have advanced several theories as to why Rome was eager for war.[47] These include: a Roman fear of Carthaginian commercial competition;[48][49][50] a desire to forestall a wider war which might have broken out with the death of Masinissa, who was aged 89 at the time;[51] the factional use of Carthage as a political 'bogeyman', irrespective of its true power;[52][53] a greed for glory and loot;[48][54] and a desire to quash a political system which Rome considered anathema.[52] No consensus has been reached regarding these and other hypotheses.[55] Carthaginian embassies attempted to negotiate with Rome, which responded evasively.[36][56] The large North African port city of Utica, some 55 km (34 mi) north of Carthage,[57] went over to Rome in 149 BC. Aware that Utica's harbour would greatly facilitate any assault on Carthage, the Senate and the People's Assembly of Rome declared war on Carthage.[34][58] The Romans elected two men each year, known as consuls, as senior magistrates, who at time of war would each lead an army; on occasion their term of office was extended.[59][60][61] A large Roman army landed at Utica in 149 BC under both consuls for the year, Manius Manilius commanding the army and Lucius Marcius Censorinus the fleet. The Carthaginians continued to attempt to appease Rome and sent an embassy to Utica. The consuls demanded that they hand over all weaponry; reluctantly the Carthaginians did so. Large convoys took enormous stocks of equipment from Carthage to Utica. Surviving records state that these included 200,000 sets of armour and 2,000 catapults. Carthage's warships all sailed to Utica and were burnt in the harbour.[62] Once Carthage was disarmed, Censorinus made the further demand that the Carthaginians abandon their city and relocate 16 km (10 mi) away from the sea; Carthage would then be destroyed.[62][63] The Carthaginians abandoned negotiations and prepared to defend their city.[64] The city of Carthage was unusually large for the time: modern scholars give population estimates ranging from 90,000 to 800,000. Any of these would make Carthage one of the most populous cities in the Mediterranean area at the time.[65][66] It was strongly fortified with walls of more than 35 km (20 mi) circumference.[67] Defending the main approach from the land were three lines of defences, of which the strongest was a brick-built wall 9 metres (30 ft) wide and 15–20 metres (50–70 ft) high with a 20-metre-wide (70 ft) ditch in front of it. Built into this wall was a barracks capable of holding over 24,000 soldiers.[63][68] The city had few reliable sources of ground water but possessed a complex system to catch and channel rainwater and many cisterns to store it.[69] The Carthaginians raised a strong and enthusiastic force to garrison the city from their citizenry and by freeing all slaves willing to fight.[64][70][71] They also formed a field army at least 20,000 strong,[72] which was placed under Hasdrubal, freshly released from his condemned cell. This army was based at Nepheris, 25 km (16 mi) south of Carthage.[73] Appian gives the strength of the Roman army which landed in Africa as 84,000 soldiers; modern historians estimate it at 40,000–50,000 men, of whom 4,000 were cavalry.[68][74] The Roman army moved to Carthage, unsuccessfully attempted to scale the city walls, and settled down for a siege. They set up two camps under command of legates: Censorinus' had the primary role of protecting the beached Roman ships and Manilius's housed the Roman legions. Hasdrubal moved up his army to harass the Roman supply lines and foraging parties.[75] The Romans launched another assault on the city but were repulsed again. Scipio Aemilianus, the adopted grandson of Scipio Africanus, who was serving as a tribune – a middle-ranking military position – held back his men and was able to deploy them to beat off the pursuing Carthaginians, preventing heavy losses.[76][77] The camp established by Censorinus was badly situated and by early summer was so pestiferous that it was moved to a healthier location. This was not as defensible, and the Carthaginians inflicted losses on the Roman fleet with fireships.[76] The Romans then made these attacks more difficult by building additional fortifications.[78] Nevertheless, the Carthaginians repeatedly attacked the camps. In often confused fighting Scipio distinguished himself further by his role in thwarting these; the discipline which he imposed on his troops was in contrast with the behaviour of most of the rest of the Roman army.[79] Manilius decided to strike against the Carthaginians' main camp near Nepheris, despite its strong position and fortifications. Arriving there, Manilius ordered an immediate assault, against Scipio's advice. This initially went well, but the Romans advanced into an untenable position. When they attempted to withdraw, the Carthaginians counterattacked, inflicting heavy casualties. Scipio led 300 cavalrymen in a series of limited and well-disciplined charges and threats which caused the Carthaginians to pause long enough for most of the infantry to complete their retreat. That night Scipio led his cavalry back to rescue a trapped group of Romans.[80] The Roman column retreated to its camp near Carthage, where a committee from the Senate had arrived to evaluate Scipio and Manilius' progress. Scipio's performance was prominent in their subsequent report.[81] Scipio made contact with several of the leaders of Carthage's Numidian cavalry, then joined a second, better-planned expedition led by Manilius against Hasdrubal at Nepheris. Despite the greater forethought, the Romans made no progress, although one of the Numidians contacted by Scipio did defect to the Romans with 2,200 men. Manilius withdrew after the Romans ran out of food and Scipio led the Romans' new allies on a successful foraging expedition.[82][83] The Romans elected two new consuls in 148 BC, but only one of them was sent to Africa: Lucius Calpurnius Piso Caesoninus; Lucius Hostilius Mancinus commanded the navy as his subordinate. He pulled back the close siege of Carthage to a looser blockade and attempted to mop up the other Carthaginian-supporting cities in the area. He failed: Neapolis surrendered and was subsequently sacked, but Aspis withstood assaults from both the Roman army and navy, while Hippo was fruitlessly besieged. A Carthaginian sortie from Hippo destroyed the Roman siege engines, causing the Romans to break off the campaign and go into winter quarters. Hasdrubal, already in charge of the Carthaginian field army, overthrew the civilian leadership of Carthage and took command himself. Carthage allied with Andriscus, a pretender to the Macedonian throne. Andriscus had invaded Roman Macedonia, defeated a Roman army, had himself crowned King Philip VI and sparked the Fourth Macedonian War.[84][85] Scipio intended to stand in the 147 BC elections for the post of aedile, which was a natural progression for him. Aged 36 or 37, he was too young to stand as consul, for which by the Lex Villia the minimum age was 41. There was considerable political manoeuvring behind the scenes. Scipio and his partisans played on his successes over the previous two years and the fact that it was his adoptive grandfather, Scipio Africanus, who had sealed Roman victory in Africa in the Second Punic War. Public demand to appoint him as consul and so allow him to take charge of the African war, was so strong that the Senate put aside the age requirements for all posts for the year. Scipio was elected consul and appointed to sole command in Africa; usually theatres were allocated to the two consuls by lot. He was granted the usual right to conscript enough men to make up the numbers of the forces there and the unusual entitlement to enroll volunteers.[86][87] Scipio moved the Romans' main camp back to near Carthage, closely observed by a Carthaginian detachment of 8,000. He made a speech demanding tighter discipline and dismissed those soldiers he considered ill-disciplined or poorly motivated. He then led a successful night attack and broke into the city with 4,000 men. Panicked in the dark, the Carthaginian defenders, after an initial fierce resistance, fled. Scipio decided that his position would be indefensible once the Carthaginians reorganised themselves in daylight and so withdrew.[88] Hasdrubal, horrified at the way the Carthaginian defences had collapsed, had Roman prisoners tortured to death on the walls, in sight of the Roman army. He was reinforcing the will to resist in the Carthaginian citizens; from this point, there could be no possibility of negotiation or even surrender. Some members of the city council denounced his actions and Hasdrubal had them too put to death and took full control of the city.[89][90] The renewed close siege cut off landward entry to the city, but a tight seaward interdiction was all but impossible with the naval technology of the time. Frustrated at the amount of food being shipped into the city, Scipio built an immense mole to cut off access to the harbour via blockade runners. The Carthaginians responded by cutting a new channel from their harbour to the sea. They had built a new fleet and once the channel was complete, the Carthaginians sailed out, taking the Romans by surprise. In the ensuing Battle of the Port of Carthage the Carthaginians held their own, but when withdrawing at the end of the day many of their ships were trapped against the city's sea wall and sunk or captured.[91][92] The Romans now attempted to advance against the Carthaginian defences in the harbour area, eventually gaining control of the quay. Here, over several months, they constructed a brick structure as high as the city wall, which enabled up to 4,000 Romans to fire onto the Carthaginian ramparts from short range.[93][94][95] Once this feature was complete, Scipio detached a large force and led it against the Carthaginian field army at Nepheris. The Carthaginians, commanded by a Greek named Diogenes, had established a fortified camp for their winter quarters. Late in 147 BC Scipio directed an assault on the camp from several directions and overran it. Fleeing Carthaginians were pursued by Rome's mounted Numidian allies and few escaped. The town of Nepheris was then besieged and surrendered after three weeks. Most of the fortified positions still holding out in Carthage's hinterland now opened their gates.[95][96] Scipio's position as the Roman commander in Africa was extended for a year in 146 BC.[97] In the spring he launched a full-scale assault from the harbour area, which successfully breached the walls.[98] Over six days,[99] the Romans systematically worked their way through the residential part of the city, killing everyone they encountered and setting the buildings behind them on fire.[93] On the last day Scipio agreed to accept prisoners, except for 900 Roman deserters in Carthaginian service, who fought on from the Temple of Eshmoun and burnt it down around themselves when all hope was gone.[100] At this point, Hasdrubal surrendered to Scipio on the promise of his life and freedom. Hasdrubal's wife, watching from a rampart, then blessed Scipio, cursed her husband and walked into the temple with her children to burn to death.[101] 50,000 Carthaginian prisoners were sold into slavery.[102] The notion that Roman forces then sowed the city with salt is likely a 19th-century invention.[103][104][105] Many of the religious items and cult-statues which Carthage had pillaged from Sicilian cities and temples over the centuries were returned with great ceremony.[106] Rome was determined that the city of Carthage remain in ruins. The Senate despatched a ten-man commission and Scipio was ordered to carry out further demolitions. A curse was placed on anyone who might attempt to resettle the site in the future.[107] The former site of the city was confiscated as ager publicus, public land.[108] Scipio celebrated a triumph and took the agnomen 'Africanus', as had his adoptive grandfather.[101][102] Hasdrubal's fate is not known, although he had surrendered on the promise of a retirement to an Italian estate.[101] The formerly Carthaginian territories were annexed by Rome and reconstituted to become the Roman province of Africa, with Utica as its capital.[108][109] The province became a major source of grain and other food.[110] The Punic cities which had stood by Carthage to the end were forfeit to Rome as ager publicus, or, as in the case of Bizerte, were destroyed.[108][107] Surviving cities were permitted to retain at least elements of their traditional system of government and culture.[111][112] The Romans did not interfere in the locals' private lives and Punic culture, language and religion survived, and is known to modern scholars as 'Neo-Punic civilization'.[113][114] The Punic language continued to be spoken in North Africa until the 7th century AD.[115][116] In 123 BC a reformist faction in Rome led by Gaius Gracchus was eager to redistribute land, including publicly held land. This included the site of Carthage and a controversial law was passed ordering the establishment of a new settlement there, called Junonia. Conservatives argued against the law and after its passage spread rumours that markers delimitating the new settlement had been dug up by wolves – a very poor omen. These rumours, and other political machinations, caused the plan to be scrapped.[note 3][119] In 111 BC legislation repeated the injunction against any resettlement.[120] A century after the war, Julius Caesar planned to rebuild Carthage as a Roman city, but little work was done. Augustus revived the concept in 29 BC and brought the plan to completion. Roman Carthage had become one of the main cities of Roman Africa by the time of the Empire.[121][122] Rome still exists as the capital of Italy; the ruins of Carthage lie 16 km (10 mi) east of modern Tunis on the North African coast; the modern town is a suburb of Tunis and the site of the Tunisian Presidential Palace.[24] A symbolic peace treaty was signed by Ugo Vetere and Chedli Klibi, the mayors of Rome and modern Carthage, respectively, on 5 February 1985, 2,131 years after the war ended.[123]",
        expected: "The Third Punic War (9852–9855 H.E. (Holocene Era) [converted from 149 BCE–146 BCE]) was the third and last of the Punic Wars fought between Carthage and Rome. The war was fought entirely within Carthaginian territory, in what is now northern Tunisia. When the Second Punic War ended in 9800 H.E. (Holocene Era) [converted from 201 BCE] one of the terms of the peace treaty prohibited Carthage from waging war without Rome's permission. Rome's ally, King Masinissa of Numidia, exploited this to repeatedly raid and seize Carthaginian territory with impunity. In 9852 H.E. (Holocene Era) [converted from 149 BCE] Carthage sent an army, under Hasdrubal, against Masinissa, the treaty notwithstanding. The campaign ended in disaster as the Battle of Oroscopa ended with a Carthaginian defeat and the surrender of the Carthaginian army. Anti-Carthaginian factions in Rome used the illicit military action as a pretext to prepare a punitive expedition. Later in 9852 H.E. (Holocene Era) [converted from 149 BCE] a large Roman army landed at Utica in North Africa. The Carthaginians hoped to appease the Romans, but despite the Carthaginians surrendering all of their weapons, the Romans pressed on to besiege the city of Carthage. The Roman campaign suffered repeated setbacks through 9852 H.E. (Holocene Era) [converted from 149 BCE], only alleviated by Scipio Aemilianus, a middle-ranking officer, distinguishing himself several times. A new Roman commander took over in 9853 H.E. (Holocene Era) [converted from 148 BCE] and fared equally badly. At the annual election of Roman magistrates in the spring of 9854 H.E. (Holocene Era) [converted from 147 BCE] the public support for Scipio was so great that the usual age restrictions were lifted to allow him to be appointed consul and commander in Africa. Scipio's term commenced with two Carthaginian successes, but he tightened the siege and started to build a large mole to prevent supplies from getting into Carthage via blockade runners. The Carthaginians had partially rebuilt their fleet, and it sortied, to the Romans' surprise. After an indecisive engagement, the Carthaginians mismanaged their withdrawal and lost many ships. The Romans then built a large brick structure in the harbour area that dominated the city wall. Once this was complete, Scipio led a strong force that stormed the camp of Carthage's field army and forced most of the towns and cities still supporting Carthage to surrender. In early 9855 H.E. (Holocene Era) [converted from 146 BCE] the Romans launched their final assault and, over six days, systematically destroyed the city and killed its inhabitants; only on the last day did they take prisoners, 50,000 of them, who were sold into slavery. The conquered Carthaginian territories became the Roman province of Africa, with Utica as its capital. It was a century before the site of Carthage was rebuilt as a Roman city. The main source for most aspects of the Punic Wars[note 1] is the historian Polybius (9801–9883 H.E. (Holocene Era) [converted from c. 200–118 BCE]), a Greek sent to Rome in 9834 H.E. (Holocene Era) [converted from 167 BCE] as a hostage.[2] His works include a now-lost manual on military tactics,[3] but he is best known for The Histories, written sometime after 9855 H.E. (Holocene Era) [converted from 146 BCE].[4][5] He accompanied his patron and friend,[6] the Roman general Scipio Aemilianus, in North Africa during the Third Punic War;[7] this causes the normally reliable Polybius to recount Scipio's actions in a favourable light.[8][9][10] In addition, significant portions of The Histories' account of the Third Punic War have been lost.[8][11] The account of the Roman annalist Livy, who relied heavily on Polybius, is much used by modern historians of the Punic Wars,[12] but all that survives of his account of events after 9834 H.E. (Holocene Era) [converted from 167 BCE] is a list of contents.[13][14] Other ancient accounts of the Third Punic War or its participants which have also been largely lost include those of Plutarch, Dio Cassius[15] and the Greek Diodorus Siculus.[16] Modern historians also use the account of the 10100s H.E. (Holocene Era) [converted from 2nd-century CE] Greek Appian.[17][18] The modern historian Bernard Mineo states that it 'is the only complete and continuous account of this war'.[15] It is thought to have been largely based on Polybius's account, but several problems with it have been identified.[10][19] These issues mean that of the three Punic Wars, the third is the one about which the least is reliably known.[20] Other sources include coins, inscriptions, archaeological evidence and empirical evidence from reconstructions.[21] In the mid-9800s H.E. (Holocene Era) [converted from 2nd century BCE] Rome was the dominant power in the Mediterranean region,[22] while Carthage was a large city-state in the north east of what is now Tunisia.[23][24] Carthage and Rome had fought the 23-year-long First Punic War from 9737–9760 H.E. (Holocene Era) [converted from 264 BCE–241 BCE] and the 17-year-long Second Punic War between 9783–9800 H.E. (Holocene Era) [converted from 218 BCE–201 BCE]. Both wars ended with Roman victories; the Second when the Roman general Scipio Africanus defeated Hannibal, the premier Carthaginian general of the war, at the Battle of Zama, 160 kilometres (100 mi) south-west of Carthage.[25] Africanus imposed a peace treaty on the Carthaginians which stripped them of their overseas territories and some of their African ones. An indemnity of 10,000 silver talents[note 2] was to be paid over 50 years.[26] Hostages were taken and Carthage was prohibited from waging war outside Africa—and could wage war in Africa only with Rome's express permission. Many senior Carthaginians wanted to reject the treaty, but Hannibal spoke strongly in its favour and it was accepted in spring 9800 H.E. (Holocene Era) [converted from 201 BCE].[28][29] Henceforth, it was clear that Carthage was politically subordinate to Rome.[30] At the end of the war Masinissa, an ally of Rome, emerged as by far the most powerful ruler among the Numidians, the indigenous population which controlled much of what is now Algeria and Tunisia.[31] Over the following 50 years, he repeatedly took advantage of Carthage's inability to protect its possessions. Whenever Carthage petitioned Rome for redress or permission to take military action, Rome backed Masinissa and refused.[32] Masinissa's seizures of and raids into Carthaginian territory became increasingly flagrant. In 9850 H.E. (Holocene Era) [converted from 151 BCE] Carthage raised a large army commanded by the previously unrecorded[33] general Hasdrubal and, the treaty notwithstanding, counter-attacked the Numidians. The campaign ended in disaster at the Battle of Oroscopa and the army surrendered.[34][35] Many Carthaginians were subsequently massacred by the Numidians.[33] Hasdrubal escaped to Carthage, where, in an attempt to placate Rome, he was condemned to death.[36] Carthage paid off its indemnity in 9850 H.E. (Holocene Era) [converted from 151 BCE][37] and was prospering economically[38] but was no military threat to Rome.[39] Nevertheless, there had long been a faction within the Roman Senate that had wished to take further military action against Carthage.[40] For example, the dislike of Carthage by the senior senator Cato was so well known that since the 11700s H.E. (Holocene Era) [converted from 18th century CE], he has been credited with ending all of his speeches with Carthago delenda est ('Carthage must be destroyed').[41][42] The opposing faction included Scipio Nasica, who argued that fear of a strong enemy such as Carthage would keep the common people in check and avoid social division.[33][43] Cato was a member of an embassy to Carthage, probably in 9848 H.E. (Holocene Era) [converted from 153 BCE], and noted her growing economy and strength;[43] Nasica was likely a member of the same embassy.[44] Using the illicit Carthaginian military action as a pretext,[40] Rome began preparing a punitive expedition.[45] Modern scholars have advanced several theories as to why Rome was eager for war.[47] These include: a Roman fear of Carthaginian commercial competition;[48][49][50] a desire to forestall a wider war which might have broken out with the death of Masinissa, who was aged 89 at the time;[51] the factional use of Carthage as a political 'bogeyman', irrespective of its true power;[52][53] a greed for glory and loot;[48][54] and a desire to quash a political system which Rome considered anathema.[52] No consensus has been reached regarding these and other hypotheses.[55] Carthaginian embassies attempted to negotiate with Rome, which responded evasively.[36][56] The large North African port city of Utica, some 55 km (34 mi) north of Carthage,[57] went over to Rome in 9852 H.E. (Holocene Era) [converted from 149 BCE]. Aware that Utica's harbour would greatly facilitate any assault on Carthage, the Senate and the People's Assembly of Rome declared war on Carthage.[34][58] The Romans elected two men each year, known as consuls, as senior magistrates, who at time of war would each lead an army; on occasion their term of office was extended.[59][60][61] A large Roman army landed at Utica in 9852 H.E. (Holocene Era) [converted from 149 BCE] under both consuls for the year, Manius Manilius commanding the army and Lucius Marcius Censorinus the fleet. The Carthaginians continued to attempt to appease Rome and sent an embassy to Utica. The consuls demanded that they hand over all weaponry; reluctantly the Carthaginians did so. Large convoys took enormous stocks of equipment from Carthage to Utica. Surviving records state that these included 200,000 sets of armour and 2,000 catapults. Carthage's warships all sailed to Utica and were burnt in the harbour.[62] Once Carthage was disarmed, Censorinus made the further demand that the Carthaginians abandon their city and relocate 16 km (10 mi) away from the sea; Carthage would then be destroyed.[62][63] The Carthaginians abandoned negotiations and prepared to defend their city.[64] The city of Carthage was unusually large for the time: modern scholars give population estimates ranging from 90,000 to 800,000. Any of these would make Carthage one of the most populous cities in the Mediterranean area at the time.[65][66] It was strongly fortified with walls of more than 35 km (20 mi) circumference.[67] Defending the main approach from the land were three lines of defences, of which the strongest was a brick-built wall 9 metres (30 ft) wide and 15–20 metres (50–70 ft) high with a 20-metre-wide (70 ft) ditch in front of it. Built into this wall was a barracks capable of holding over 24,000 soldiers.[63][68] The city had few reliable sources of ground water but possessed a complex system to catch and channel rainwater and many cisterns to store it.[69] The Carthaginians raised a strong and enthusiastic force to garrison the city from their citizenry and by freeing all slaves willing to fight.[64][70][71] They also formed a field army at least 20,000 strong,[72] which was placed under Hasdrubal, freshly released from his condemned cell. This army was based at Nepheris, 25 km (16 mi) south of Carthage.[73] Appian gives the strength of the Roman army which landed in Africa as 84,000 soldiers; modern historians estimate it at 40,000–50,000 men, of whom 4,000 were cavalry.[68][74] The Roman army moved to Carthage, unsuccessfully attempted to scale the city walls, and settled down for a siege. They set up two camps under command of legates: Censorinus' had the primary role of protecting the beached Roman ships and Manilius's housed the Roman legions. Hasdrubal moved up his army to harass the Roman supply lines and foraging parties.[75] The Romans launched another assault on the city but were repulsed again. Scipio Aemilianus, the adopted grandson of Scipio Africanus, who was serving as a tribune – a middle-ranking military position – held back his men and was able to deploy them to beat off the pursuing Carthaginians, preventing heavy losses.[76][77] The camp established by Censorinus was badly situated and by early summer was so pestiferous that it was moved to a healthier location. This was not as defensible, and the Carthaginians inflicted losses on the Roman fleet with fireships.[76] The Romans then made these attacks more difficult by building additional fortifications.[78] Nevertheless, the Carthaginians repeatedly attacked the camps. In often confused fighting Scipio distinguished himself further by his role in thwarting these; the discipline which he imposed on his troops was in contrast with the behaviour of most of the rest of the Roman army.[79] Manilius decided to strike against the Carthaginians' main camp near Nepheris, despite its strong position and fortifications. Arriving there, Manilius ordered an immediate assault, against Scipio's advice. This initially went well, but the Romans advanced into an untenable position. When they attempted to withdraw, the Carthaginians counterattacked, inflicting heavy casualties. Scipio led 300 cavalrymen in a series of limited and well-disciplined charges and threats which caused the Carthaginians to pause long enough for most of the infantry to complete their retreat. That night Scipio led his cavalry back to rescue a trapped group of Romans.[80] The Roman column retreated to its camp near Carthage, where a committee from the Senate had arrived to evaluate Scipio and Manilius' progress. Scipio's performance was prominent in their subsequent report.[81] Scipio made contact with several of the leaders of Carthage's Numidian cavalry, then joined a second, better-planned expedition led by Manilius against Hasdrubal at Nepheris. Despite the greater forethought, the Romans made no progress, although one of the Numidians contacted by Scipio did defect to the Romans with 2,200 men. Manilius withdrew after the Romans ran out of food and Scipio led the Romans' new allies on a successful foraging expedition.[82][83] The Romans elected two new consuls in 9853 H.E. (Holocene Era) [converted from 148 BCE], but only one of them was sent to Africa: Lucius Calpurnius Piso Caesoninus; Lucius Hostilius Mancinus commanded the navy as his subordinate. He pulled back the close siege of Carthage to a looser blockade and attempted to mop up the other Carthaginian-supporting cities in the area. He failed: Neapolis surrendered and was subsequently sacked, but Aspis withstood assaults from both the Roman army and navy, while Hippo was fruitlessly besieged. A Carthaginian sortie from Hippo destroyed the Roman siege engines, causing the Romans to break off the campaign and go into winter quarters. Hasdrubal, already in charge of the Carthaginian field army, overthrew the civilian leadership of Carthage and took command himself. Carthage allied with Andriscus, a pretender to the Macedonian throne. Andriscus had invaded Roman Macedonia, defeated a Roman army, had himself crowned King Philip VI and sparked the Fourth Macedonian War.[84][85] Scipio intended to stand in the 9854 H.E. (Holocene Era) [converted from 147 BCE] elections for the post of aedile, which was a natural progression for him. Aged 36 or 37, he was too young to stand as consul, for which by the Lex Villia the minimum age was 41. There was considerable political manoeuvring behind the scenes. Scipio and his partisans played on his successes over the previous two years and the fact that it was his adoptive grandfather, Scipio Africanus, who had sealed Roman victory in Africa in the Second Punic War. Public demand to appoint him as consul and so allow him to take charge of the African war, was so strong that the Senate put aside the age requirements for all posts for the year. Scipio was elected consul and appointed to sole command in Africa; usually theatres were allocated to the two consuls by lot. He was granted the usual right to conscript enough men to make up the numbers of the forces there and the unusual entitlement to enroll volunteers.[86][87] Scipio moved the Romans' main camp back to near Carthage, closely observed by a Carthaginian detachment of 8,000. He made a speech demanding tighter discipline and dismissed those soldiers he considered ill-disciplined or poorly motivated. He then led a successful night attack and broke into the city with 4,000 men. Panicked in the dark, the Carthaginian defenders, after an initial fierce resistance, fled. Scipio decided that his position would be indefensible once the Carthaginians reorganised themselves in daylight and so withdrew.[88] Hasdrubal, horrified at the way the Carthaginian defences had collapsed, had Roman prisoners tortured to death on the walls, in sight of the Roman army. He was reinforcing the will to resist in the Carthaginian citizens; from this point, there could be no possibility of negotiation or even surrender. Some members of the city council denounced his actions and Hasdrubal had them too put to death and took full control of the city.[89][90] The renewed close siege cut off landward entry to the city, but a tight seaward interdiction was all but impossible with the naval technology of the time. Frustrated at the amount of food being shipped into the city, Scipio built an immense mole to cut off access to the harbour via blockade runners. The Carthaginians responded by cutting a new channel from their harbour to the sea. They had built a new fleet and once the channel was complete, the Carthaginians sailed out, taking the Romans by surprise. In the ensuing Battle of the Port of Carthage the Carthaginians held their own, but when withdrawing at the end of the day many of their ships were trapped against the city's sea wall and sunk or captured.[91][92] The Romans now attempted to advance against the Carthaginian defences in the harbour area, eventually gaining control of the quay. Here, over several months, they constructed a brick structure as high as the city wall, which enabled up to 4,000 Romans to fire onto the Carthaginian ramparts from short range.[93][94][95] Once this feature was complete, Scipio detached a large force and led it against the Carthaginian field army at Nepheris. The Carthaginians, commanded by a Greek named Diogenes, had established a fortified camp for their winter quarters. Late in 9854 H.E. (Holocene Era) [converted from 147 BCE] Scipio directed an assault on the camp from several directions and overran it. Fleeing Carthaginians were pursued by Rome's mounted Numidian allies and few escaped. The town of Nepheris was then besieged and surrendered after three weeks. Most of the fortified positions still holding out in Carthage's hinterland now opened their gates.[95][96] Scipio's position as the Roman commander in Africa was extended for a year in 9855 H.E. (Holocene Era) [converted from 146 BCE].[97] In the spring he launched a full-scale assault from the harbour area, which successfully breached the walls.[98] Over six days,[99] the Romans systematically worked their way through the residential part of the city, killing everyone they encountered and setting the buildings behind them on fire.[93] On the last day Scipio agreed to accept prisoners, except for 900 Roman deserters in Carthaginian service, who fought on from the Temple of Eshmoun and burnt it down around themselves when all hope was gone.[100] At this point, Hasdrubal surrendered to Scipio on the promise of his life and freedom. Hasdrubal's wife, watching from a rampart, then blessed Scipio, cursed her husband and walked into the temple with her children to burn to death.[101] 50,000 Carthaginian prisoners were sold into slavery.[102] The notion that Roman forces then sowed the city with salt is likely a 11800s H.E. (Holocene Era) [converted from 19th-century] invention.[103][104][105] Many of the religious items and cult-statues which Carthage had pillaged from Sicilian cities and temples over the centuries were returned with great ceremony.[106] Rome was determined that the city of Carthage remain in ruins. The Senate despatched a ten-man commission and Scipio was ordered to carry out further demolitions. A curse was placed on anyone who might attempt to resettle the site in the future.[107] The former site of the city was confiscated as ager publicus, public land.[108] Scipio celebrated a triumph and took the agnomen 'Africanus', as had his adoptive grandfather.[101][102] Hasdrubal's fate is not known, although he had surrendered on the promise of a retirement to an Italian estate.[101] The formerly Carthaginian territories were annexed by Rome and reconstituted to become the Roman province of Africa, with Utica as its capital.[108][109] The province became a major source of grain and other food.[110] The Punic cities which had stood by Carthage to the end were forfeit to Rome as ager publicus, or, as in the case of Bizerte, were destroyed.[108][107] Surviving cities were permitted to retain at least elements of their traditional system of government and culture.[111][112] The Romans did not interfere in the locals' private lives and Punic culture, language and religion survived, and is known to modern scholars as 'Neo-Punic civilization'.[113][114] The Punic language continued to be spoken in North Africa until the 10600s H.E. (Holocene Era) [converted from 7th century CE].[115][116] In 9878 H.E. (Holocene Era) [converted from 123 BCE] a reformist faction in Rome led by Gaius Gracchus was eager to redistribute land, including publicly held land. This included the site of Carthage and a controversial law was passed ordering the establishment of a new settlement there, called Junonia. Conservatives argued against the law and after its passage spread rumours that markers delimitating the new settlement had been dug up by wolves – a very poor omen. These rumours, and other political machinations, caused the plan to be scrapped.[note 3][119] In 9890 H.E. (Holocene Era) [converted from 111 BCE] legislation repeated the injunction against any resettlement.[120] A century after the war, Julius Caesar planned to rebuild Carthage as a Roman city, but little work was done. Augustus revived the concept in 9972 H.E. (Holocene Era) [converted from 29 BCE] and brought the plan to completion. Roman Carthage had become one of the main cities of Roman Africa by the time of the Empire.[121][122] Rome still exists as the capital of Italy; the ruins of Carthage lie 16 km (10 mi) east of modern Tunis on the North African coast; the modern town is a suburb of Tunis and the site of the Tunisian Presidential Palace.[24] A symbolic peace treaty was signed by Ugo Vetere and Chedli Klibi, the mayors of Rome and modern Carthage, respectively, on 5 February 11985 H.E. (Holocene Era) [converted from 1985 CE], 2,131 years after the war ended.[123]"}

];

let failCounter = 0;

allTests.forEach(({ input, expected }) => {
    const output = processText(input);
    const pass = output === expected ? "✅" : "❌";

    if (pass === "❌") {
        console.log(`${pass} FAILED`);
        console.log(`Input:    "${input}"`);
        console.log(`Output:   "${output}"`);
        console.log(`Expected: "${expected}"`);
        // Find first difference
        let firstDiff = -1;
        for (let i = 0; i < Math.max(output.length, expected.length); i++) {
            if (output[i] !== expected[i]) { firstDiff = i; break; }
        }
        if (firstDiff !== -1) {
            const outCP = output.codePointAt(firstDiff);
            const expCP = expected.codePointAt(firstDiff);
            console.log(`First diff at pos ${firstDiff}: output U+${outCP?.toString(16).toUpperCase().padStart(4,'0')} (${JSON.stringify(output.slice(firstDiff, firstDiff+20))}) vs expected U+${expCP?.toString(16).toUpperCase().padStart(4,'0')} (${JSON.stringify(expected.slice(firstDiff, firstDiff+20))})`);
            console.log(`Context before: ${JSON.stringify(output.slice(Math.max(0,firstDiff-30), firstDiff))}`);
        }
        console.log("------");
        failCounter += 1;
    } else {
        //console.log(`${pass} ${input}`);
        //console.log(`Output: ${output}`);
    }
});

if (failCounter == 0) {
    console.log("All tests pass.");
} else {
    console.log(`There were "${failCounter}" failures.`);
}

//-------------------------------------------------------