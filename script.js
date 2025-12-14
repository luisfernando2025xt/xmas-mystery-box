let validCodes = {};
let lettersData = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";

// Detect TikTok in-app browser
function isTikTokBrowser() {
    return /TikTok/i.test(navigator.userAgent);
}

// Santa premium image from GitHub Raw
const santaImageURL = "https://raw.githubusercontent.com/luisfernando2025xt/xmas-mystery-box/refs/heads/main/santa.png";

// Load codes.json and letters.json
Promise.all([
    fetch("codes.json").then(r => r.json()),
    fetch("letters.json").then(r => r.json())
]).then(([codes, letters]) => {
    validCodes = codes;
    lettersData = letters;
});

// Verify code
function verifyCode() {
    const codeInput = document.getElementById("codeInput").value.trim();

    if (!(codeInput in validCodes)) {
        alert("Invalid code");
        return;
    }

    if (validCodes[codeInput].used) {
        alert("This code has already been used.");
        return;
    }

    currentCode = codeInput;

    if (lettersData[currentCode]) {
        currentLetter = lettersData[currentCode];
    } else {
        alert("Letter not found for this code.");
        return;
    }

    document.getElementById("code-section").classList.add("hidden");
    document.getElementById("name-section").classList.remove("hidden");
}

// Mark code as used
function markCodeUsed() {
    validCodes[currentCode].used = true;

    fetch("codes.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validCodes)
    });
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

    // 🚨 TikTok in-app browser protection
    if (isTikTokBrowser()) {
        document.getElementById("tiktokNotice").style.display = "block";
        return;
    }

    const { jsPDF } = window.jspdf;

    const marginX = 20;
    const marginTop = 30;
    const bottomMargin = 30;
    const lineHeight = 16;
    const imageWidth = 135;
    const imageHeight = 180;
    const titleFontSize = 24;
    const pageWidth = 370;

    const fullText = `Dear ${userName},\n\n` + currentLetter.join("\n\n");

    const tempDoc = new jsPDF({ unit: "pt", format: [pageWidth, 1000] });
    tempDoc.setFont("Courier", "normal");
    tempDoc.setFontSize(14.2);
    const lines = tempDoc.splitTextToSize(fullText, pageWidth - marginX * 2);

    const pageHeight =
        marginTop +
        imageHeight +
        20 +
        titleFontSize +
        20 +
        (lines.length * lineHeight) +
        20 +
        lineHeight +
        bottomMargin;

    const doc = new jsPDF({
        unit: "pt",
        format: [pageWidth, pageHeight]
    });

    doc.setFont("Courier", "normal");

    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = marginTop;
    doc.addImage(santaImageURL, "PNG", imageX, imageY, imageWidth, imageHeight);

    const title = "Santa's Letter";
    doc.setFontSize(titleFontSize);
    const titleY = imageY + imageHeight + 20;
    doc.text(title, pageWidth / 2, titleY, { align: "center" });

    doc.setFontSize(14.2);
    let cursorY = titleY + 20;
    lines.forEach(line => {
        doc.text(line, marginX, cursorY);
        cursorY += lineHeight;
    });

    const bottomText = "Your special gift awaits!";
    doc.text(bottomText, marginX, cursorY + 20);

    doc.save(`Santa_Letter_${userName}.pdf`);
}

// ✅ ESTA FUNCIÓN VA AQUÍ, FUERA DE TODO
function closeTikTokNotice() {
    document.getElementById("tiktokNotice").style.display = "none";
}
