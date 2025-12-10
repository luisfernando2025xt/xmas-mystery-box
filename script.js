let validCodes = {};
let lettersData = {};
let currentCode = "";
let letter = [];
let index = 0;

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
    if (lettersData[codeInput]) {
        letter = lettersData[codeInput];
    } else {
        alert("Letter not found for this code.");
        return;
    }

    document.getElementById("code-section").style.display = "none";
    document.getElementById("name-section").style.display = "block";
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
    document.getElementById("name-section").classList.add("hidden");
    document.getElementById("letter-section").classList.remove("hidden");

    markCodeUsed();
    nextSentence();
}

// Show next sentence
function nextSentence() {
    if (index >= letter.length) return;

    document.getElementById("letterText").innerHTML += letter[index] + "<br><br>";
    index++;
}
