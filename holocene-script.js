const ERA_PATTERN = "BC|BCE|CE|AD|BP|B\\.C\\.|B\\.C\\.E\\.|C\\.E\\.|A\\.D\\.|B\\.P\\.";
const FUZZY_MODIFIER = "(?:early|mid-|late|c\\.|ca\\.|~|around)\\s*";

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
const pluralRegex = new RegExp(
    `\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?`, 
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

//--------------------------------------------------------------




//----------------CORE TEXT PROCESSING-----------------

function processRanges(text) {
    return text.replace(rangeRegex, (match, fuzzyPrefix, prefixEra, y1, era1, y2, era2, offset, string) => {

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        if (!y1 || !y2) return match;

        const prefix = fuzzyPrefix ? fuzzyPrefix.trim() + " " : "";
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

        //If end is BCE → start must also be BCE
        if (normEra2 === "BCE") {
            finalEra1 = "BCE";
            finalEra2 = "BCE";
        }

        //Fully unlabeled range
        else if (!normEra1 && !normEra2 && !normPrefix) {
            if (year1 <= year2) {
                finalEra1 = "CE";
                finalEra2 = "CE";
            } else {
                return match; // ambiguous → do not convert
            }
        } else {
            finalEra2 = normEra2 || normEra1 || normPrefix || "CE";

            if (normEra1) {
                finalEra1 = normEra1;
            } else if (normPrefix) {
                finalEra1 = normPrefix;
            } else {
                finalEra1 = finalEra2;
            }
        }

        const converted1 = convertYear(year1, finalEra1);
        const converted2 = convertYear(year2, finalEra2);

        return `${prefix}${converted1}–${converted2} H.E. (Holocene Era) [converted from ${year1} ${finalEra1}–${year2} ${finalEra2}]`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, fuzzyPrefix, prefixEra, yearStr, suffixEra, offset, string) => {

        if (!yearStr) return match;

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        const prefix = fuzzyPrefix ? fuzzyPrefix.trim() + " " : "";
        const year = parseYear(yearStr);
        const era = normalizeEra(suffixEra || prefixEra || "CE");

        const converted = convertYear(year, era);

        return `${prefix}${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
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
    const pluralRegex = new RegExp(`\\b(\\d{1,4})s\\s*(${ERA_PATTERN})?\\b`, "gi");

    return text.replace(pluralRegex, (match, numberStr, eraStr, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const number = parseInt(numberStr.replace(/,/g, ""), 10);
        const era = normalizeEra(eraStr || "CE");  // default CE if no era

        let convertedNumber = convertYear(number, era);
        if (era === "BCE" || era === "BC") {
            convertedNumber -= 1; // BCE adjustment for broad centuries
        }

        return `${convertedNumber}s H.E. (Holocene Era) [converted from ${numberStr}s ${eraStr || "CE"}]`;
    });
}

function processCenturyReferences(text) {
    return text.replace(centuryRegex, (match, fuzzyPrefix, centuryNumberStr, ordinal, eraStr, offset, fullText) => {
        if (isInsideConvertedText(fullText, offset)) return match;
        if (match.includes("H.E.")) return match;

        const prefix = fuzzyPrefix || "";  // preserve the original modifier
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

        return `${prefix}${convertedNumber}s H.E. (Holocene Era) [converted from ${centuryNumberStr}${ordinal} century${eraStr ? " " + eraStr : ""}]`;
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

  // --- ORIGINAL TESTS ---
  { input: "2000 BCE–1996 CE", expected: "8001–11996 H.E. (Holocene Era) [converted from 2000 BCE–1996 CE]" },
  { input: "500–1000 BCE", expected: "9501–9001 H.E. (Holocene Era) [converted from 500 BCE–1000 BCE]" },
  { input: "1500 CE", expected: "11500 H.E. (Holocene Era) [converted from 1500 CE]" },
  { input: "1000–500", expected: "1000–500" },
  { input: "50 BC–50 AD", expected: "9951–10050 H.E. (Holocene Era) [converted from 50 BCE–50 CE]" },
  { input: "300 BP–100 BP", expected: "11650–11850 H.E. (Holocene Era) [converted from 300 BP–100 BP]" },
  { input: "1,500–2,000 CE", expected: "11500–12000 H.E. (Holocene Era) [converted from 1500 CE–2000 CE]" },

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

  // --- Fuzzy Prefix ---
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
  { input: "Late 3rd century BC events", expected: "Late 9600s H.E. (Holocene Era) [converted from 3rd century BC] events" }


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