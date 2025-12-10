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
    
    // 370 × 570 points
    const doc = new jsPDF({
        unit: "pt",        // points
        format: [300, 570] // width, height in points
    });

    doc.setFont("Courier", "normal");
    doc.setFontSize(14.2);

    const text = currentLetter.join("\n\n");
    doc.text(`Dear ${userName},\n\n` + text, 10, 30); // 10pt margin from left, 30pt from top

    doc.text("\n🎅✨ Your special gift awaits!", 10, 550); // adjust vertical if needed
    doc.save(`Santa_Letter_${userName}.pdf`);
}




