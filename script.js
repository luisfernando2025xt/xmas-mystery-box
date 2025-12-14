let validCodes = {};
let lettersData = {};
let uiText = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";
let currentLanguage = "EN"; // default language

const santaImageURL = "https://raw.githubusercontent.com/luisfernando2025xt/xmas-mystery-box/refs/heads/main/santa.png";

// Load JSON files
Promise.all([
    fetch("codes.json").then(r => r.json()),
    fetch("letters.json").then(r => r.json()),
    fetch("ui_text.json").then(r => r.json())
]).then(([codes, letters, ui]) => {
    validCodes = codes;
    lettersData = letters;
    uiText = ui;
    setLanguage(); // initialize UI text
});

// Set language and update UI text
function setLanguage() {
    const select = document.getElementById("languageSelect");
    currentLanguage = select.value;

    document.querySelector("h1").innerText = uiText[currentLanguage].enterCode;
    document.getElementById("codeInput").placeholder = uiText[currentLanguage].codePlaceholder;
    document.querySelector("#code-section button").innerText = uiText[currentLanguage].continueButton;
    document.querySelector("#name-section h2").innerText = uiText[currentLanguage].nameHeading;
    document.getElementById("nameInput").placeholder = uiText[currentLanguage].namePlaceholder;
    document.querySelector("#name-section button").innerText = uiText[currentLanguage].startLetterButton;
    document.getElementById("downloadPDF").innerText = uiText[currentLanguage].downloadPDF;
}

// Verify code
function verifyCode() {
    const codeInput = document.getElementById("codeInput").value.trim();

    if (!(codeInput in validCodes)) {
        return alert(uiText[currentLanguage].invalidCode);
    }

    if (validCodes[codeInput].used) {
        return alert(uiText[currentLanguage].codeUsed);
    }

    currentCode = codeInput;

    if (lettersData[currentCode] && lettersData[currentCode][currentLanguage]) {
        currentLetter = lettersData[currentCode][currentLanguage];
    } else {
        return alert("Letter not found for this code in the selected language.");
    }

    document.getElementById("code-section").classList.add("hidden");
    document.getElementById("name-section").classList.remove("hidden");
}

// Mark code as used (client-side only)
function markCodeUsed() {
    validCodes[currentCode].used = true;
}

// Start letter
function startLetter() {
    const input = document.getElementById("nameInput").value.trim();
    if (!input) return alert("Please enter your name.");
    userName = input;

    markCodeUsed();

    document.getElementById("name-section").classList.add("hidden");
    document.getElementById("letter-section").classList.remove("hidden");

    letterIndex = 0;
    document.getElementById("letterText").innerHTML = "";
    nextSentence();
}

// Show next sentence
function nextSentence() {
    if (letterIndex >= currentLetter.length) {
        document.getElementById("downloadPDF").classList.remove("hidden");
        return;
    }

    const letterText = document.getElementById("letterText");
    letterText.innerHTML += currentLetter[letterIndex] + "<br><br>";
    letterIndex++;
}

// Generate PDF
function downloadLetterPDF() {
    const { jsPDF } = window.jspdf;

    const marginX = 20;
    const marginTop = 30;
    const bottomMargin = 30;
    const lineHeight = 16;
    const imageWidth = 135;
    const imageHeight = 180;
    const titleFontSize = 24;
    const pageWidth = 370;

    const fullText = `${uiText[currentLanguage].pdfGreeting} ${userName},\n\n` + currentLetter.join("\n\n");

    const tempDoc = new jsPDF({ unit: "pt", format: [pageWidth, 1000] });
    tempDoc.setFont("Courier", "normal");
    tempDoc.setFontSize(14.2);
    const lines = tempDoc.splitTextToSize(fullText, pageWidth - marginX * 2);
    const textHeight = lines.length * lineHeight;

    const pageHeight = marginTop + imageHeight + 20 + titleFontSize + 20 + textHeight + 20 + lineHeight + bottomMargin;

    const doc = new jsPDF({ unit: "pt", format: [pageWidth, pageHeight] });
    doc.setFont("Courier", "normal");

    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = marginTop;
    doc.addImage(santaImageURL, "PNG", imageX, imageY, imageWidth, imageHeight);

    const titleY = imageY + imageHeight + 20;
    doc.setFontSize(titleFontSize);
    doc.text(uiText[currentLanguage].pdfTitle, pageWidth / 2, titleY, { align: "center" });

    doc.setFontSize(14.2);
    let cursorY = titleY + 20;
    lines.forEach(line => {
        doc.text(line, marginX, cursorY);
        cursorY += lineHeight;
    });

    const bottomText = uiText[currentLanguage].pdfEnding;
    const bottomLines = doc.splitTextToSize(bottomText, pageWidth - marginX * 2);
    let bottomY = cursorY + 20;
    bottomLines.forEach(line => {
        doc.text(line, marginX, bottomY);
        bottomY += lineHeight;
    });

    doc.save(`Santa_Letter_${userName}.pdf`);
}
