let validCodes = {};
let lettersData = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";

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
    const { jsPDF } = window.jspdf;

    const marginX = 20;
    const marginTop = 30;
    const bottomMargin = 30;
    const lineHeight = 16;
    const imageWidth = 135;
    const imageHeight = 180;
    const titleFontSize = 24;
    const pageWidth = 370;

    // Texto principal
    const fullText = `Dear ${userName},\n\n` + currentLetter.join("\n\n");

    // Creamos un doc temporal para calcular altura del texto
    const tempDoc = new jsPDF({ unit: "pt", format: [pageWidth, 1000] });
    tempDoc.setFont("Courier", "normal");
    tempDoc.setFontSize(14.2);
    const lines = tempDoc.splitTextToSize(fullText, pageWidth - marginX * 2);
    const textHeight = lines.length * lineHeight;

    // Altura total del PDF
    const pageHeight = marginTop + imageHeight + 20 + titleFontSize + 20 + textHeight + 20 + lineHeight + bottomMargin;

    // Creamos el PDF final con altura dinámica
    const doc = new jsPDF({
        unit: "pt",
        format: [pageWidth, pageHeight]
    });
    doc.setFont("Courier", "normal");

    // === Dibujar imagen de Santa al tope, centrada ===
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = marginTop;
    doc.addImage(
        santaImageURL,
        "PNG",
        imageX,
        imageY,
        imageWidth,
        imageHeight
    );

    // === Dibujar título debajo de la imagen ===
    const title = "Santa's Letter";
    doc.setFontSize(titleFontSize);
    const titleY = imageY + imageHeight + 20;
    doc.text(title, pageWidth / 2, titleY, { align: "center" });

    // === Dibujar texto principal ===
    doc.setFontSize(14.2);
    let cursorY = titleY + 20;
    for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], marginX, cursorY);
        cursorY += lineHeight;
    }

    // === Dibujar frase final al fondo ===
    const bottomText = "Your special gift awaits!";
    const bottomLines = doc.splitTextToSize(bottomText, pageWidth - marginX * 2);
    let bottomY = cursorY + 20; // espacio desde el texto principal
    bottomLines.forEach(line => {
        doc.text(line, marginX, bottomY);
        bottomY += lineHeight;
    });

    // === Guardar PDF ===
    doc.save(`Santa_Letter_${userName}.pdf`);
}










