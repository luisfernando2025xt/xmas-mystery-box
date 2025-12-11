let validCodes = {};
let lettersData = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";

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

    // Load the specific letter for this code
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

    const doc = new jsPDF({
        unit: "pt",
        format: [370, 570]
    });

    doc.setFont("Courier", "normal");
    doc.setFontSize(14);

    const marginX = 10;    // margen izquierdo
    const marginTop = 20;  // margen superior
    const pageWidth = 370;
    const usableWidth = pageWidth - marginX*2; // ancho real disponible para texto

    const fullText = `Dear ${userName},\n\n` + currentLetter.join("\n\n");

    // Ajusta el texto al ancho disponible
    const lines = doc.splitTextToSize(fullText, usableWidth);

    // Dibuja el texto
    doc.text(lines, marginX, marginTop);

    // Línea final cerca del fondo
    const bottomText = "🎅✨ Your special gift awaits!";
    const bottomY = 550;
    const bottomLines = doc.splitTextToSize(bottomText, usableWidth);
    doc.text(bottomLines, marginX, bottomY);

    doc.save(`Santa_Letter_${userName}.pdf`);
}




