//const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b|\b(\d{3,4})\b/g;
const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b/g;

const rangeRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)\s*(?:-|–|to)\s*(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b/g;


//-----------HELPER METHODS-----------------

function parseYear(yearStr) {
    return parseInt(yearStr.replace(/,/g, ""), 10);
}

function normalizeEra(era) {
    if (!era) return null;

    return era.replace(/\./g, "").toUpperCase();
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
    if (era === "BP") {
        if (1950-year>0){
            year = convertFromBPToAD(year);
            era = "AD";
        }
        else {
            year = convertFromBPToBC(year);
            era = "BC";
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
    return text.replace(rangeRegex, (match, prefix, y1, y2, suffix, era) => {
        const year1 = parseYear(y1);
        const year2 = parseYear(y2);

        const converted1 = convertYear(year1, era || prefix);
        const converted2 = convertYear(year2, era || prefix);

        return `${converted1}–${converted2} H.E. (Holocene Era)`;
    });
}

function processSingleYears(text) {
    return text.replace(yearRegex, (match, prefixEra, yearStr, _, suffixEra) => {
        // Use the era from suffix (mandatory) or prefix (optional)
        const era = normalizeEra(suffixEra || prefixEra);

        // Parse the number, remove commas if any
        const year = parseYear(yearStr);

        // Convert to Holocene year
        const converted = convertYear(year, era);

        return `${converted} H.E. (Holocene Era)`;
    });
}

function processUnlabeledYears(text) {
    return text.replace(/\b(\d{3,4})\b/g, (match, offset, fullText) => {
        if (!isLikelyUnlabeledYear(match, fullText, offset)) return match;

        const year = parseInt(match, 10);
        const converted = convertYear(year, "AD"); // default to AD/CE

        return `${converted} H.E. (Holocene Era)`;
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