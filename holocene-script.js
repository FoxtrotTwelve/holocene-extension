const ERA_PATTERN = "BCE|BC|CE|AD|BP|A\\.D\\.|B\\.C\\.E\\.|B\\.C\\.|C\\.E\\.|B\\.P\\.";
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

const masterConvertedRegex = /\b(?:early|mid-|late|c\.|ca\.|circa|~|around)?\s*\d+(?:s)?(?:–\d+(?:s)?)?\s+H\.E\.[^\[]*\[converted from [^\]]+\]/gi;
        ///\(Holocene Era\) \[converted from .*?\]/;

const yearRegex = new RegExp(
  `\\b(${FUZZY_MODIFIER})?` +      // group 1: fuzzy prefix (optional)
  `(?:(AD|A\\.D\\.)\\s*)?` +      // group 2: prefix era (optional)
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` + // group 3: year
  //`(?:\\s*(${ERA_PATTERN}))\\b`,       // group 4: suffix era
  //`\\s*(${ERA_PATTERN})(?=\\b|[^a-zA-Z])`,
  `\\s*(${ERA_PATTERN})\\.?`,
  "gi"
);

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




//const abbreviatedDecadeRegex = /\b(\d{4}s?)[-–](\d{2}s?)\b/g;
const abbreviatedDecadeRegex = /\b(\d{4}s?)\s*[-–]\s*(\d{2}s?)\b/g;






//-----------HELPER METHODS-----------------

// const convertedPlaceholders = [];
// function protectConverted(text) {
//     return text.replace(
//         /\b(?:early|mid-|late|c\.|ca\.|circa|~|around)?\s*\d+(?:s)?(?:–\d+(?:s)?)?\s+H\.E\.[^\[]*\[converted from [^\]]+\]/gi,
//         (match) => {
//             const id = convertedPlaceholders.length;
//             convertedPlaceholders.push(match);
//             return `__CONVERTED_${id}__`;
//         }
//     );
// }
// function restoreConverted(text) {
//     return text.replace(/__CONVERTED_(\d+)__/g, (_, i) => {
//         return convertedPlaceholders[i];
//     });
// }

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

    // look at surrounding words (keep your existing context logic)
    const before = text.slice(Math.max(0, offset - 20), offset).toLowerCase();
    const after = text.slice(offset + matchLength, offset + matchLength + 40).toLowerCase();

    const dateIndicators = [
        "year","years","during","ad","ce","bce","bc","bp",
        "a.d.","c.e.","b.c.e","b.c.","b.p.","century","centuries",
        "since","c.","ca.","circa","early","mid-","late", "in"
    ];

    return dateIndicators.some(indicator => before.includes(indicator) || after.includes(indicator));
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
    //console.log("Processed in RANGES");
    return text.replace(rangeRegex, (match, fuzzyPrefix, prefixEra, y1, era1, y2, era2, offset, string) => {
        const before = string[offset - 1];
        const after = string[offset + match.length];

        if (before === "-" || before === "–" || after === "-" || after === "–") return match;
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;
        if (!y1 || !y2) return match;

        const year1 = parseYear(y1);
        const year2 = parseYear(y2);

        if (!isLikelyYearRange(year1, year2, prefixEra, era1, era2, string, offset, match.length, fuzzyPrefix)) {
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

        return `${formattedPrefix}${converted1}–${converted2} H.E. (Holocene Era) [converted from ${year1} ${finalEra1}–${year2} ${finalEra2}]`;
    });
}

function processSingleYears(text) {
    //console.log("Processed in SINGLE YEARS");
    return text.replace(yearRegex, (match, fuzzyPrefix, prefixEra, yearStr, suffixEra, offset, string) => {
        const before = string[offset - 1];
        const after = string[offset + match.length];

        if (before === "-" || before === "–" || after === "-" || after === "–") {
            return match;
        }


        if (!yearStr) return match;

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;
        if (match.includes("BP") && match.includes("H.E.")) return match;

        const formattedPrefix = formatPrefix(fuzzyPrefix);
        const year = parseYear(yearStr);
        const era = normalizeEra(suffixEra || prefixEra || "CE");

        const converted = convertYear(year, era);

        console.log("YEAR IS: " + year + " | ERA IS: " + era);

        return `${formattedPrefix}${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
    });
}

function processUnlabeledYears(text) {
    //console.log("Processed in UNLABELED YEARS");
    return text.replace(/\b(\d{3,4})\b/g, (match, p1, offset, string) => {

        if (isInsideConvertedText(string, offset)) return match;

        const after = string.slice(offset, offset + 20);
        if (after.includes("H.E.")) return match;

        if (!isLikelyUnlabeledYear(match, string, offset)) return match;

        const year = parseInt(match, 10);
        const era = "CE";
        const converted = convertYear(year, era);

        return `${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
    });
}

function processPluralReferences(text) {
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, "gi");
    //const pluralRegex = new RegExp(`\\b(\\d{1,4})s(?!\\s*H\\.E\\.)\\s*(${ERA_PATTERN})?\\b`, "gi");
    //console.log("Processed in PLURAL REF");
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

        // Only add 's' if original match had an 's' (indicating a plural/decade)
        const hasS = /\ds\b/.test(match);

        return `${formattedPrefix}${convertedNumber}${hasS ? "s" : ""} H.E. (Holocene Era) [converted from ${numberStr}s ${eraStr || "CE"}]`;
    });
}

function processCenturyReferences(text) {
    //console.log("Processed in CENTURY REF");
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
    //console.log("Processed in WRITTEN CENTURIES");
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
    //console.log("Processed in WRITTEN HUNDREDS");
    return text.replace(writtenHundredsRegex, (match, fuzzy, word, era, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const baseNumber = parseWrittenHundreds(word);
        if (!baseNumber) return match;

        const formattedPrefix = formatPrefix(fuzzy);
        const normalizedEra = normalizeEra(era || "CE"); // default CE if no era

        // Pass number through convertHundredYear for H.E. conversion
        let convertedNumber = convertHundredYear(baseNumber, normalizedEra);

        // BCE adjustment for plural centuries
        if (normalizedEra === "BCE" || normalizedEra === "BC") {
            convertedNumber -= 1;
        }

        return `${formattedPrefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${baseNumber} ${normalizedEra}]`;
    });
}

function protectDecades(text, decadePlaceholders) {
    return text.replace(decadeRegex, (match) => {
        const id = decadePlaceholders.length;
        decadePlaceholders.push(match);
        return `__DECADE_${id}__`;
    });
}
function protectDecades(text, decadePlaceholders){
    return text.replace(decadeRegex, (match, first, second, offset, string) => {

        // 🚨 NEW: detect era context
        const after = string.slice(offset, offset + match.length + 10);
        if (new RegExp(`\\b(BP|B\\.P\\.)\\b`, "i").test(after)) {
            return match; // ❌ DO NOT protect → let range system handle it
        }

        const id = decadePlaceholders.length;
        decadePlaceholders.push(match);
        return `__DECADE_${id}__`;
    });
}

// function processDecadeRanges(text) {
//     console.log("Processed in DECADES");
//     return text.replace(decadeRegex, (match, first, second, offset, string) => {
//         if (isInsideConvertedText(string, offset)) return match;
//         if (match.includes("H.E.")) return match;

//         const eraMatch = match.match(new RegExp(`(${ERA_PATTERN})`, "i"));
//         const era = eraMatch ? normalizeEra(eraMatch[0]) : "CE";

//         const hasSFirst = /s$/.test(first);
//         const firstYear = parseInt(first.replace(/s$/, ""), 10);
//         const convertedFirst = convertYear(firstYear, era);
//         let result = convertedFirst + (hasSFirst ? "s" : "");

//         if (second) {
//             let secondDisplay = second; // what will appear in the text
//             let secondYear = parseInt(second.replace(/s$/, ""), 10);
//             const hasSSecond = /s$/.test(second);

//             // Handle abbreviated 2-digit second decade like "90s"
//             if (second.length === 2) {
//                 const century = Math.floor(firstYear / 100);
//                 secondYear = parseInt(century.toString() + second, 10);
//             }

//             const convertedSecond = convertYear(secondYear, era);
            
//             // Keep 's' if it was in the original second decade
//             secondDisplay = hasSSecond ? convertedSecond + "s" : convertedSecond;

//             result += "–" + secondDisplay;
//         }

//         return `${result} H.E. (Holocene Era) [converted from ${match} ${era}]`;
//     });
// }

// function processDecadeRanges(match) {
//     const parts = match.split(/[-–]/);
//     const first = parts[0].trim();
//     const second = parts[1] ? parts[1].trim() : null;

//     const firstHasS = /s$/.test(first);
//     const firstYear = parseInt(first.replace(/s$/, ""), 10);
//     const convertedFirst = convertYear(firstYear, "CE") + (firstHasS ? "s" : "");

//     let result = convertedFirst;

//     if (second) {
//         let secondDisplay = second; // leave abbreviated as-is
//         // Only expand 2-digit second if full numeric conversion needed
//         if (!second.includes("s") && second.length === 2) {
//             secondDisplay = second; // keep "90" instead of "10090"
//         } else if (/s$/.test(second)) {
//             secondDisplay = second; // keep "90s" as-is
//         } else {
//             const secondYear = parseInt(second.replace(/s$/, ""), 10);
//             secondDisplay = convertYear(secondYear, "CE");
//         }
//         result += "–" + secondDisplay;
//     }

//     return `${result} H.E. (Holocene Era) [converted from ${match} CE]`;
// }

function processDecadeRanges(text) {
    console.log("Processed in DECADES");
    return text.replace(decadeRegex, (match, first, second, offset, string) => {
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        const eraMatch = match.match(new RegExp(`(${ERA_PATTERN})`, "i"));
        const era = eraMatch ? normalizeEra(eraMatch[0]) : "CE";

        // First decade
        const hasSFirst = /s$/.test(first);
        const firstYear = parseInt(first.replace(/s$/, ""), 10);

        // 🚫 Skip centuries like 1800s, 1500s, etc.
        if (firstYear % 100 === 0) {
            return match;
        }

        const convertedFirst = convertYear(firstYear, era);
        let result = convertedFirst + (hasSFirst ? "s" : "");

        // Second decade (if exists)
        if (second) {
            const hasSSecond = /s$/.test(second);
            let strippedSecond = second.replace(/s$/, "");
            let secondYear;

            if (strippedSecond.length === 2) {
                const century = Math.floor(firstYear / 100);
                secondYear = parseInt(century.toString() + strippedSecond, 10);
            } else {
                secondYear = parseInt(strippedSecond, 10);
            }

            const convertedSecond = convertYear(secondYear, era);

            // Keep original style: 's' if present, abbreviated if originally 2 digits
            let secondDisplay;
            if (strippedSecond.length === 2 && !hasSSecond) {
                secondDisplay = strippedSecond; // keep '90' as-is
            } else {
                secondDisplay = hasSSecond ? convertedSecond + "s" : convertedSecond;
            }

            result += "–" + secondDisplay;
        }

        return `${result} H.E. (Holocene Era) [converted from ${match} ${era}]`;
    });
}


// function protectAbbreviatedDecades(text, abbreviatedDecadePlaceholders) {
//     return text.replace(abbreviatedDecadeRegex, (match) => {
//         const id = abbreviatedDecadePlaceholders.length;
//         abbreviatedDecadePlaceholders.push(match);
//         return `__ABBR_DECADE_${id}__`;
//     });
// }
function protectAbbreviatedDecades(text, abbreviatedDecadePlaceholders) {
    return text.replace(abbreviatedDecadeRegex, (match, first, second, offset, string) => {

        // 🚨 NEW: detect era context
        const after = string.slice(offset, offset + match.length + 10);
        if (new RegExp(`\\b(${ERA_PATTERN})\\b`, "i").test(after)) {
            return match; // ❌ DO NOT protect → let range system handle it
        }

        const id = abbreviatedDecadePlaceholders.length;
        abbreviatedDecadePlaceholders.push(match);
        return `__ABBR_DECADE_${id}__`;
    });
}
function processDecadeAbbreviatedRanges(text) {
    console.log("Processed in ABBREVIATED DECADES");

    return text.replace(abbreviatedDecadeRegex, (match, first, second, offset, string) => {
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        const eraMatch = match.match(new RegExp(`(${ERA_PATTERN})`, "i"));
        const era = eraMatch ? normalizeEra(eraMatch[0]) : "CE";

        const hasSFirst = /s$/.test(first);
        const firstYear = parseInt(first.replace(/s$/, ""), 10);

        const convertedFirst = convertYear(firstYear, era);
        let result = convertedFirst + (hasSFirst ? "s" : "");

        const hasSSecond = /s$/.test(second);

        // 🚨 KEY RULE: DO NOT convert abbreviated second
        const separator = match.includes("–") ? "–" : "-";
        result += separator + second;

        return `${result} H.E. (Holocene Era) [converted from ${match} ${era}]`;
    });
}

function processText(text) {
    const chainPlaceholders = [];
    const decadePlaceholders = [];
    const abbreviatedDecadePlaceholders = [];
    //Protects numeric chains
    text = text.replace(/\b\d+(?:[-–]\d+){2,}\b/g, (match) => {
        const id = chainPlaceholders.length;
        chainPlaceholders.push(match);
        return `__CHAIN_${id}__`;
    });

    // Protect abbreviated decades
    text = protectAbbreviatedDecades(text, abbreviatedDecadePlaceholders);
    
    const rangePlaceholders = [];
    //Extracts ranges and replace with placeholders
    text = text.replace(rangeRegex, (match) => {
        const id = rangePlaceholders.length;
        rangePlaceholders.push(match);
        return `__RANGE_${id}__`;
    });

    //Protects decades before any conversion
    text = protectDecades(text, decadePlaceholders);
    
    //Might be extranious:
    //text = protectConverted(text);

    //Processes singles + unlabeled
    text = processSingleYears(text);
    const singleYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = singleYearsConvertedTagSafeBox.length;
        singleYearsConvertedTagSafeBox.push(match);
        return `__SINGLE_YEARS_TAG_${id}__`;
    });

    text = processUnlabeledYears(text);
    const unlabeledYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = unlabeledYearsConvertedTagSafeBox.length;
        unlabeledYearsConvertedTagSafeBox.push(match);
        return `__UNLABELED_YEARS_TAG_${id}__`;
    });

    // Processes plural century references
    text = processPluralReferences(text);
    const pluralYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = pluralYearsConvertedTagSafeBox.length;
        pluralYearsConvertedTagSafeBox.push(match);
        return `__PLURAL_YEARS_TAG_${id}__`;
    });

    // Convert written hundreds (e.g., "nineteen hundreds") to numeric form first
    text = processWrittenHundreds(text);
    const writtenHundredsYearsConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = writtenHundredsYearsConvertedTagSafeBox.length;
        writtenHundredsYearsConvertedTagSafeBox.push(match);
        return `__WRITTEN_HUNDREDS_YEARS_TAG_${id}__`;
    });

    // Processes written century numbers and converts them to numbers for the next step
    text = processWrittenCenturies(text);
        //written centuries safeboxing skipped so they can convert in the next method:

    // Processes century number references and converts them to plural century references
    text = processCenturyReferences(text);
    const centuriesConvertedTagSafeBox = [];
    text = text.replace(masterConvertedRegex, (match) => {
        const id = centuriesConvertedTagSafeBox.length;
        centuriesConvertedTagSafeBox.push(match);
        return `__CENTURIES_TAG_${id}__`;
    });

    //Restores ranges and process them
    text = text.replace(/__RANGE_(\d+)__/g, (_, i) => {
        return processRanges(rangePlaceholders[i]);
    });

    //Restores chains
    text = text.replace(/__CHAIN_(\d+)__/g, (_, i) => {
        return chainPlaceholders[i];
    });

    // Process abbreviated decades
    text = text.replace(/__ABBR_DECADE_(\d+)__/g, (_, i) => {
        return processDecadeAbbreviatedRanges(abbreviatedDecadePlaceholders[i]);
    });

    // Processes decade ranges like "1980s–1990s"
    text = text.replace(/__DECADE_(\d+)__/g, (_, i) => {
        return processDecadeRanges(decadePlaceholders[i]);
    });

    //Might be extranious
    // Restores converted text BEFORE ranges
    //text = restoreConverted(text);


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
  { input: "1865 A.D.", expected: "11865 H.E. (Holocene Era) [converted from 1865 CE]" },
  { input: "1994C.E.", expected: "11994 H.E. (Holocene Era) [converted from 1994 CE]" },
  
  
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
  { input: "40B.P.", expected: "11910 H.E. (Holocene Era) [converted from 40 BP]" },
  { input: "30 B.P.", expected: "11920 H.E. (Holocene Era) [converted from 30 BP]" },

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
  { input: "c. 1000–1500", expected: "c. 11000–11500 H.E. (Holocene Era) [converted from 1000 CE–1500 CE]" },
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
    { input: "1980-90", expected: "11980-90 H.E. (Holocene Era) [converted from 1980-90 CE]" }


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