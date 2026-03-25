//const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b|\b(\d{3,4})\b/g;
const ERA_PATTERN = "BC|BCE|CE|AD|BP|B\\.C\\.|B\\.C\\.E\\.|C\\.E\\.|A\\.D\\.|B\\.P\\.";
const yearRegex = new RegExp(
  `\\b(?:(AD|A\\.D\\.)\\s*)?` +
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +
  `(?:\\s*(${ERA_PATTERN}))\\b`,
  "gi"
);

const rangeRegex = new RegExp(
  `\\b(?:(AD|A\\.D\\.)\\s*)?` +                 // prefix era
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +          // year1
  `(?:\\s*(${ERA_PATTERN}))?` +                // era1 (NEW)
  `\\s*(?:-|–|to)\\s*` +
  `(\\d{1,3}(?:,\\d{3})*|\\d{1,6})` +          // year2
  `(?:\\s*(${ERA_PATTERN}))?` +                 // era2 (required)
  `\\b`,
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
 * Determine the era for a number in a range or a single year.
 * Rules:
 * - If there’s a suffix immediately after the number, use it.
 * - For first number in range:
 *    - If the second number is BCE, force first to BCE.
 *    - Otherwise, use prefix or default CE.
 * - For second number, fallback to suffix, prefix, or CE.
 */
// function getEraForNumber(numberStr, position, prefixEra, suffixEra, fullMatch) {
//     // Check for suffix immediately after this number
//     const suffixRegex = new RegExp(`\\b${numberStr}\\b\\s*(BC|BCE|CE|AD|BP|B\\.C\\.|B\\.C\\.E\\.|C\\.E\\.|A\\.D\\.|B\\.P\\.)`, 'i');
//     const suffixMatch = fullMatch.match(suffixRegex);

//     if (suffixMatch) {
//         return normalizeEra(suffixMatch[1]);
//     }

//     // Determine era of the other end of the range
//     const otherEndMatch = fullMatch.match(/(\d{1,6})\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.)$/i);
//     const otherEra = otherEndMatch ? normalizeEra(otherEndMatch[2]) : null;

//     let era;

//     if (position === "start") {
//         // If second number is BCE/BC, first number must also be BCE/BC
//         if (otherEra === "BCE" || otherEra === "BC") {
//             era = "BCE";
//         } else {
//             era = prefixEra || "CE";
//         }
//     } else if (position === "end") {
//         era = suffixEra || prefixEra || "CE";
//     } else if (position === "single") {
//         era = suffixEra || prefixEra || "CE";
//     } else {
//         era = "CE";
//     }

//     return normalizeEra(era);
// }

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
    const before = text.slice(0, offset);
    const lastOpen = before.lastIndexOf("[converted from");
    const lastClose = before.lastIndexOf("]");

    return lastOpen > lastClose;
}

// function isInsideRange(text, offset) {
//     const before = text.slice(0, offset);
//     const lastDash = Math.max(
//         before.lastIndexOf("–"),
//         before.lastIndexOf("-"),
//         before.lastIndexOf("to")
//     );

//     const lastBreak = Math.max(
//         before.lastIndexOf("."),
//         before.lastIndexOf(","),
//         before.lastIndexOf("\n")
//     );

//     return lastDash > lastBreak;
// }

// function isInsideRange(text, offset) {
//     const before = text.slice(0, offset);
//     const after = text.slice(offset);

//     const window = before.slice(-20) + after.slice(0, 20);

//     const rangePattern = /\d{1,6}(?:,\d{3})?\s*(?:-|–|to)\s*\d{1,6}(?:,\d{3})?/;

//     return rangePattern.test(window);
// }

//--------------------------------------------------------------




//----------------CORE TEXT PROCESSING-----------------

function processRanges(text) {
    return text.replace(rangeRegex, (match, prefixEra, y1, era1, y2, era2, offset, string) => {

        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        if (!y1 || !y2) return match;

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

        return `${converted1}–${converted2} H.E. (Holocene Era) [converted from ${year1} ${finalEra1}–${year2} ${finalEra2}]`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, prefixEra, yearStr, suffixEra, offset, string) => {

        if (!yearStr) return match;

        //if (isInsideRange(string, offset)) return match;
        if (isInsideConvertedText(string, offset)) return match;
        if (match.includes("H.E.")) return match;

        const year = parseYear(yearStr);
        const era = normalizeEra(suffixEra || prefixEra || "CE");

        const converted = convertYear(year, era);

        return `${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
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

function processText(text) {
    const rangePlaceholders = [];

    //Extract ranges and replace with placeholders
    text = text.replace(rangeRegex, (match) => {
        const id = rangePlaceholders.length;
        rangePlaceholders.push(match);
        return `__RANGE_${id}__`;
    });

    //Process singles + unlabeled
    text = processSingleYears(text);
    text = processUnlabeledYears(text);

    //Restore ranges and process them
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
        if (["script", "style", "textarea", "input"].includes(tag)) return;
        node.childNodes.forEach(walkDOMAndProcess);
    } else if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
    }
}

// Kick it off from the body
walkDOMAndProcess(document.body);

//-----------------------------------------------









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
  { input: "300 BP–100 BP", expected: "11650–11850 H.E. (Holocene Era) [converted from 300 BP–100 BP]" }

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
  }
});