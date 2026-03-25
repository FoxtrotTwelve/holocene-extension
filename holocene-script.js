const ERA_PATTERN = "BC|BCE|CE|AD|BP|B\\.C\\.|B\\.C\\.E\\.|C\\.E\\.|A\\.D\\.|B\\.P\\.";
const FUZZY_MODIFIER = "(?:early|mid-|late|c\\.|ca\\.|circa|~|around)\\s*";
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

const yearRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +      // group 1: fuzzy prefix (optional)
  `(?:(AD|A\\.D\\.)\\s*)?` +      // group 2: prefix era (optional)
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` + // group 3: year
  `(?:\\s*(${ERA_PATTERN}))\\b`,       // group 4: suffix era
  "gi"
);

const rangeRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +             // group 1: fuzzy prefix
  `(?:(AD|A\\.D\\.)\\s*)?` +             // group 2: prefix era
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +    // group 3: start year
  `(?:\\s*(${ERA_PATTERN}))?` +           // group 4: start era (optional)
  `\\s*(?:-|–|to)\\s*` +
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +    // group 5: end year
  `(?:\\s*(${ERA_PATTERN}))?` +           // group 6: end era (optional)
  `\\b`,
  "gi"
);

// Century references (e.g., "15th century BCE")
const centuryRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?(\\d+)(st|nd|rd|th)\\s+century\\s*(${ERA_PATTERN})?\\b`,
  "gi"
);

// Plural references (e.g., "1800s BCE")
//const pluralRegex = /\b(\d{1,4})s(?!\s*H\.E\.)\s*(${ERA_PATTERN})?\b/gi;
//const pluralRegex = new RegExp( `\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?`, "gi" );
const pluralRegex = new RegExp(
    `\\b(${FUZZY_MODIFIER})?(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, 
    "gi"
);

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

const writtenHundredsRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +
  `(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\\s+hundreds` +
  `(?:\\s*(${ERA_PATTERN}))?\\b`,
  "gi"
);





//-----------HELPER METHODS-----------------

function parseYear(yearStr) {
    return parseInt(yearStr.replace(/,/g, ""), 10);
}

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

function getOrdinalSuffix(n) {
    const j = n % 10;
    const k = n % 100;

    if (k >= 11 && k <= 13) return "th";

    if (j === 1) return "st";
    if (j === 2) return "nd";
    if (j === 3) return "rd";

    return "th";
}

function convertFromBPToBC(year){
    return year - 1950 + 1;
}

function convertFromBPToAD(year){
    return 1950-year;
}

//Handles year conversion from BC/BCE, AD/CE, and BP
//into Holocene Era
function convertYear(year, era) {
    if (!era) era = "CE";

    if (era === "BP") {
        if (1950-year>0){
            year = convertFromBPToAD(year);
            era = "CE";
        }
        else {
            year = convertFromBPToBC(year);
            era = "BCE";
        }
    }

    if (era === "BC" || era === "BCE") {
        return 10001 - year;
    } else {
        return year + 10000; // AD / CE
    }
}

function convertHundredYear(year, era) {


    if (era === "BC" || era === "BCE") {
        return 10001 - year;
    } else {
        return year + 10000; // AD / CE
    }
}

function isLikelyUnlabeledYear(match, nodeValue, index) {
    const year = parseInt(match, 10);

    // Plausible year range
    if (year < 100 || year > 3000) return false;

    // Avoid times (e.g., 12:30)
    if (nodeValue[index - 1] === ":" || nodeValue[index + match.length] === ":") return false;

    // Avoid being part of a longer number with punctuation
    if (nodeValue[index - 1] && /\d/.test(nodeValue[index - 1])) return false;
    if (nodeValue[index + match.length] && /\d/.test(nodeValue[index + match.length])) return false;

    return true;
}

function isInsideConvertedText(text, offset) {
    if (!text || typeof text !== "string") return false;

    const before = text.slice(0, offset);
    const lastOpen = before.lastIndexOf("[converted from");
    const lastClose = before.lastIndexOf("]");

    return lastOpen > lastClose;
}

function normalizeOrdinalSpacing(text) {
  return text.replace(
    /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)\b/gi,
    (_, tens, ones) => `${tens}-${ones}`
  );
}

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

function processRanges(text) {
    return text.replace(rangeRegex, (match, fuzzyPrefix, prefixEra, y1, era1, y2, era2, offset, string) => {

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        if (!y1 || !y2) return match;

        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const year1 = parseYear(y1);
        const year2 = parseYear(y2);

        if (!era1 && !era2 && !prefixEra && year1 > year2) {
            return match;
        }

        const normPrefix = normalizeEra(prefixEra);
        const normEra1 = normalizeEra(era1);
        const normEra2 = normalizeEra(era2);

        if (!normEra1 && !normEra2 && !normPrefix && year1 > year2) {
            return match;
        }

        let finalEra1, finalEra2;

        // --- Handle BP ranges first
        if (normEra1 === "BP" || normEra2 === "BP") {
            finalEra1 = "BP";
            finalEra2 = "BP";
        } 
        // --- Then handle BCE ranges
        else if (normEra2 === "BCE") {
            finalEra1 = "BCE";
            finalEra2 = "BCE";
        } 
        // --- Fully unlabeled range
        else if (!normEra1 && !normEra2 && !normPrefix) {
            if (year1 <= year2) {
                finalEra1 = "CE";
                finalEra2 = "CE";
            } else {
                return match; // ambiguous → do not convert
            }
        } 
        // --- Mixed cases
        else {
            finalEra2 = normEra2 || normEra1 || normPrefix || "CE";
            finalEra1 = normEra1 || normPrefix || finalEra2;
        }

        const converted1 = convertYear(year1, finalEra1);
        const converted2 = convertYear(year2, finalEra2);

        return `${formattedPrefix}${converted1}–${converted2} H.E. (Holocene Era) [converted from ${year1} ${finalEra1}–${year2} ${finalEra2}]`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, fuzzyPrefix, prefixEra, yearStr, suffixEra, offset, string) => {

        if (!yearStr) return match;

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const year = parseYear(yearStr);
        const era = normalizeEra(suffixEra || prefixEra || "CE");

        const converted = convertYear(year, era);

        return `${formattedPrefix}${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
    });
}

function processUnlabeledYears(text) {
    return text.replace(/\b(\d{3,4})\b/g, (match, p1, offset, string) => {

        if (isInsideConvertedText(string, offset)) return match;

        if (!isLikelyUnlabeledYear(match, string, offset)) return match;

        const year = parseInt(match, 10);
        const converted = convertYear(year, "CE");

        return `${converted} H.E. (Holocene Era) [converted from ${year}]`;
    });
}

function processPluralReferences(text) {
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, "gi");
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s(?!\\s*H\\.E\\.)\\s*(${ERA_PATTERN})?\\b`, "gi");

    return text.replace(pluralRegex, (match, fuzzyPrefix, numberStr, eraStr, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const number = parseInt(numberStr.replace(/,/g, ""), 10);
        const era = normalizeEra(eraStr || "CE");  // default CE if no era

        let convertedNumber = convertYear(number, era);
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1; // BCE adjustment for broad centuries
        }

        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${numberStr}s ${eraStr || "CE"}]`;
    });
}

function processCenturyReferences(text) {
    return text.replace(centuryRegex, (match, fuzzyPrefix, centuryNumberStr, ordinal, eraStr, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const formattedPrefix = formatPrefix(fuzzyPrefix);  // preserve the original modifier
        const centuryNumber = parseInt(centuryNumberStr, 10);
        const era = normalizeEra(eraStr || "CE"); // default CE

        // Convert century → "hundreds" number
        let baseNumber;
        if (era === "BCE") {
            baseNumber = (centuryNumber+1) * 100;
        } else {
            baseNumber = (centuryNumber-1) * 100;
        }

        // Convert to HE
        let convertedNumber = convertYear(baseNumber, era);

        // BCE adjustment for broad centuries
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1;
        }

        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${centuryNumberStr}${ordinal} century${eraStr ? " " + eraStr : ""}]`;
    });
}

function processWrittenCenturies(text) {
  text = normalizeOrdinalSpacing(text);

  return text.replace(
    writtenCenturyRegex,
    (match, fuzzy, word, era, offset, fullText) => {

      if (isInsideConvertedText(fullText, offset)) return match;
      if (match.includes("H.E.")) return match;

      const num = parseWrittenOrdinal(word);
      if (!num) return match;

      const prefix = formatPrefix(fuzzy);
      const suffix = getOrdinalSuffix(num);

      return `${prefix}${num}${suffix} century${era ? " " + era : ""}`;
    }
  );
}

function processWrittenHundreds(text) {
    return text.replace(writtenHundredsRegex, (match, fuzzy, word, era, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const baseNumber = parseWrittenHundreds(word);
        if (!baseNumber) return match;

        const formattedPrefix = formatPrefix(fuzzy);
        const normalizedEra = normalizeEra(era || "CE"); // default CE if no era

        // Pass number through convertYear for H.E. conversion
        let convertedNumber = convertHundredYear(baseNumber, normalizedEra);

        // BCE adjustment for plural centuries
        if (normalizedEra === "BCE" || normalizedEra === "BC") {
            convertedNumber -= 1;
        }

        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${baseNumber} ${normalizedEra}]`;
    });
}

function processText(text) {
    const rangePlaceholders = [];

    //Extracts ranges and replace with placeholders
    text = text.replace(rangeRegex, (match) => {
        const id = rangePlaceholders.length;
        rangePlaceholders.push(match);
        return `__RANGE_${id}__`;
    });

    //Processes singles + unlabeled
    text = processSingleYears(text);
    text = processUnlabeledYears(text);

    // Processes plural century references
    text = processPluralReferences(text);

    //MOVING DOWN    // Convert written hundreds (e.g., "nineteen hundreds") to numeric form first
    text = processWrittenHundreds(text);

    // Processes written century numbers and converts them to numbers for the next step
    text = processWrittenCenturies(text);

    // Processes century number references and converts them to plural century references
    text = processCenturyReferences(text);

    //Restores ranges and process them
    text = text.replace(/__RANGE_(\d+)__/g, (_, i) => {
        return processRanges(rangePlaceholders[i]);
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

  // --- BP SINGLE YEARS ---
  { input: "300 BP", expected: "11650 H.E. (Holocene Era) [converted from 300 BP]" },
  { input: "1950 BP", expected: "10000 H.E. (Holocene Era) [converted from 1950 BP]" },
  { input: "1951 BP", expected: "9999 H.E. (Holocene Era) [converted from 1951 BP]" },

  // --- UNLABELED RANGES ---
  { input: "1000–1500", expected: "11000–11500 H.E. (Holocene Era) [converted from 1000 CE–1500 CE]" },
  { input: "1500–1000", expected: "1500–1000" },
  { input: "1500–500", expected: "1500–500" },

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
  { input: "c. 1000–1500", expected: "c. 11000–11500 H.E. (Holocene Era) [converted from 1000 CE–1500 CE]" },
  { input: "c. 1200", expected: "c. 11200 H.E. (Holocene Era) [converted from 1200]" },
  { input: "~ 300", expected: "~ 10300 H.E. (Holocene Era) [converted from 300]" },
  { input: "around 1000", expected: "around 11000 H.E. (Holocene Era) [converted from 1000]" },

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
    { input: "around thirteen hundreds BCE", expected: "around 8700s H.E. (Holocene Era) [converted from 1300 BCE]" }





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