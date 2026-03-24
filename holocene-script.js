//const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b|\b(\d{3,4})\b/g;
const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b/gi;

const rangeRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)\s*(?:-|–|to)\s*(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b/gi;


//-----------HELPER METHODS-----------------

function parseYear(yearStr) {
    return parseInt(yearStr.replace(/,/g, ""), 10);
}

function normalizeEra(era) {
    if (!era) return "CE";

    era = era.replace(/\./g, "").toUpperCase();

    if (era === "AD") {
        era = "CE";
    } else if (era === "BC") {
        era = "BCE";
    }

    return era;
}

// Use this to determine the era for each number in a range
function getEraForNumber(numberStr, position, prefixEra, suffixEra, fullMatch) {
    // Check for a suffix immediately after this number
    const suffixMatch = fullMatch.match(new RegExp(`${numberStr}\\s*(BC|BCE|CE|AD|BP|B\\.C\\.|B\\.C\\.E\\.|C\\.E\\.|A\\.D\\.|B\\.P\\.)`, 'i'));
    
    // Look for a global default at the end of the range (applies if first number has no label)
    const defaultEraMatch = fullMatch.match(/(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.)$/i);
    const defaultEra = defaultEraMatch ? defaultEraMatch[1] : "CE";

    // Decide which era to use
    let era;
    if (suffixMatch) {
        era = suffixMatch[1]; // explicit suffix near the number
    } else if (position === "start") {
        era = suffixEra || prefixEra || defaultEra; // fallback for first number
    } else if (position === "end") {
        era = suffixEra || prefixEra || defaultEra; // fallback for second number
    } else {
        era = defaultEra;
    }

    return normalizeEra(era);
}

function convertFromBPToBC(year){
    if (1950 - year == 0) {
        return 1;
    } else {
        return ((1950 - year)*-1) + 1;
    }
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

//--------------------------------------------------------------




//----------------CORE TEXT PROCESSING-----------------

function processRanges(text) {
    return text.replace(rangeRegex, (match, prefixEra, y1, y2, _, suffixEra) => {
        // Determine era separately for each end
        const era1 = getEraForNumber(y1, "start", prefixEra, suffixEra, match);
        const era2 = getEraForNumber(y2, "end", prefixEra, suffixEra, match);

        // Parse the numbers (remove commas)
        const year1 = parseYear(y1);
        const year2 = parseYear(y2);

        // Convert to Holocene Era
        const converted1 = convertYear(year1, era1);
        const converted2 = convertYear(year2, era2);

        // Return final converted range
        return `${converted1}–${converted2} H.E. (Holocene Era) [converted from ${year1} ${era1}–${year2} ${era2}]`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, prefixEra, yearStr, _, suffixEra) => {
        // Determine the correct era using the same logic as ranges
        const era = getEraForNumber(yearStr, "single", prefixEra, suffixEra, match);

        // Parse the year number
        const year = parseYear(yearStr);

        // Convert to Holocene Era
        const converted = convertYear(year, era);

        return `${converted} H.E. (Holocene Era) [converted from ${year} ${era}]`;
    });
}

function processUnlabeledYears(text) {
    return text.replace(/\b(\d{3,4})\b/g, (match, offset, fullText) => {
        if (!isLikelyUnlabeledYear(match, fullText, offset)) return match;

        const year = parseInt(match, 10);
        const converted = convertYear(year, "CE"); // default to AD/CE

        return `${converted} H.E. (Holocene Era) [converted from ${year}]`;
    });
}

function processText(text) {
    // Convenience wrapper applying all three functions
    text = processRanges(text);
    text = processSingleYears(text);
    text = processUnlabeledYears(text);
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