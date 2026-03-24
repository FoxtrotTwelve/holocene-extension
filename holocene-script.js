const yearRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b|\b(\d{3,4})\b/g;

const rangeRegex = /\b(?:(AD|A\.D\.)\s*)?(\d{1,6}|\d{1,3}(?:,\d{3})*)\s*(?:-|–|to)\s*(\d{1,6}|\d{1,3}(?:,\d{3})*)(\s*(BC|BCE|CE|AD|BP|B\.C\.|B\.C\.E\.|C\.E\.|A\.D\.|B\.P\.))\b/g;


//-----------HELPER METHODS-----------------

function parseYear(yearStr) {
  return parseInt(yearStr.replace(/,/g, ""), 10);
}

function normalizeEra(era) {
  if (!era) return null;

  return era.replace(/\./g, "").toUpperCase();
}

function convertYear(year, era) {
  if (era === "BC" || era === "BCE") {
    return 10001 - year;
  } else if (era === "BP") {
    return 1950 - year + 10000; // BP = before 1950
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
    const year1 = parseInt(y1.replace(/,/g, ""), 10);
    const year2 = parseInt(y2.replace(/,/g, ""), 10);

    const converted1 = convertYear(year1, era || prefix);
    const converted2 = convertYear(year2, era || prefix);

    return `${converted1}–${converted2} HE`;
  });
}

function processSingleYears(text) {
  return text.replace(yearRegex, (
    match,
    prefixEra,   // group 1
    year1,       // group 2
    suffixFull,  // group 3 (unused)
    suffixEra,   // group 4
    prefixEra2,  // group 5 (branch 2)
    year2        // group 6 (branch 2)
  ) => {
    let yearStr, era;

    // Branch 1: number + suffix era
    if (year1 && suffixEra) {
      yearStr = year1;
      era = suffixEra;
    }
    // Branch 2: AD 1066
    else if (prefixEra2 && year2) {
      yearStr = year2;
      era = prefixEra2;
    } else {
      return match; // safety fallback
    }

    const year = parseYear(yearStr);
    const normalizedEra = normalizeEra(era);

    const converted = convertYear(year, normalizedEra);

    return `${converted} HE`;
  });
}

function processUnlabeledYears(text) {
  return text.replace(/\b(\d{3,4})\b/g, (match, offset, fullText) => {
    if (!isLikelyUnlabeledYear(match, fullText, offset)) return match;

    const year = parseInt(match, 10);
    const converted = convertYear(year, "AD"); // default to AD/CE

    return `${converted} HE`;
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