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
        format: [370, 1000]
    });

    doc.setFont("Courier", "normal");
    doc.setFontSize(14.2);

    const marginX = 20;
    const marginTop = 30;
    const pageWidth = 370;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 30;
    const lineHeight = 16;

    // Carta principal
    const fullText = `Dear ${userName},\n\n` + currentLetter.join("\n\n");
    const lines = doc.splitTextToSize(fullText, pageWidth - marginX*2);

    // Frase final
    const bottomText = "Your special gift awaits!";
    const bottomLines = doc.splitTextToSize(bottomText, pageWidth - marginX*2);
    const bottomHeight = bottomLines.length * lineHeight;

    // Dibuja texto principal, dejando espacio para la frase final
    let cursorY = marginTop;
    for (let i = 0; i < lines.length; i++) {
        if (cursorY + lineHeight > pageHeight - bottomHeight - bottomMargin) break; // no sobrepasa
        doc.text(lines[i], marginX, cursorY);
        cursorY += lineHeight;
    }

    // Dibuja frase final pegada al fondo
    let bottomY = pageHeight - bottomMargin - (bottomLines.length - 1) * lineHeight;
    bottomLines.forEach(line => {
        doc.text(line, marginX, bottomY);
        bottomY += lineHeight;
    });

    doc.save(`Santa_Letter_${userName}.pdf`);
}



