let validCodes = {};
let lettersData = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";
let santaImage = new Image();

// Load everything when page loads
Promise.all([
    fetch("codes.json").then(r => r.json()),
    fetch("letters.json").then(r => r.json())
]).then(([codes, letters]) => {
    validCodes = codes;
    lettersData = letters;
    santaImage.src = 'santa_base.png';  // Your downloaded image
});

// Verify code (unchanged)
function verifyCode() {
    const codeInput = document.getElementById("codeInput").value.trim();
    if (!(codeInput in validCodes)) { alert("Invalid code"); return; }
    if (validCodes[codeInput].used) { alert("This code has already been used."); return; }
    
    currentCode = codeInput;
    if (lettersData[currentCode]) { currentLetter = lettersData[currentCode]; }
    else { alert("Letter not found for this code."); return; }
    
    document.getElementById("code-section").classList.add("hidden");
    document.getElementById("name-section").classList.remove("hidden");
}

// Mark code used
function markCodeUsed() {
    validCodes[currentCode].used = true;
    fetch("codes.json", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validCodes) });
}

// Generate personalized image + start letter
function generateLetterAndPDF() {
    const input = document.getElementById("nameInput").value.trim();
    if (!input) return alert("Please enter your name.");
    userName = input;
    
    markCodeUsed();
    document.getElementById("name-section").classList.add("hidden");
    document.getElementById("image-section").classList.remove("hidden");
    
    // Wait for image to load, then generate personalized version
    if (santaImage.complete) {
        createPersonalizedImage();
    } else {
        santaImage.onload = createPersonalizedImage;
    }
}

function createPersonalizedImage() {
    const canvas = document.getElementById("santaCanvas");
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw Santa base image
    ctx.drawImage(santaImage, 0, 0, canvas.width, canvas.height);
    
    // Add name on the letter (BIG GOLD TEXT)
    ctx.fillStyle = "#FFD700";  // Gold
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "bold 32px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(userName, canvas.width/2, 140);
    ctx.fillText(userName, canvas.width/2, 140);
    
    // Add code below name
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.strokeText(currentCode, canvas.width/2, 180);
    ctx.fillText(currentCode, canvas.width/2, 180);
    
    // Auto-advance to letter after 2 seconds
    setTimeout(() => {
        document.getElementById("image-section").classList.add("hidden");
        document.getElementById("letter-section").classList.remove("hidden");
        letterIndex = 0;
        nextSentence();
    }, 2000);
}

// Show next sentence (unchanged)
function nextSentence() {
    if (letterIndex >= currentLetter.length) {
        document.getElementById("downloadPDF").classList.remove("hidden");
        return;
    }
    const letterText = document.getElementById("letterText");
    letterText.innerHTML += currentLetter[letterIndex] + "<br><br>";
    letterIndex++;
}

// Download PDF WITH SANTA IMAGE
function downloadLetterPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: [370, 700] });
    
    // Add personalized Santa image to TOP of PDF
    const canvas = document.getElementById("santaCanvas");
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, 30, 330, 250);
    
    // Add letter text below image
    doc.setFont("Courier", "normal");
    doc.setFontSize(14);
    const fullText = `Dear ${userName},\n\n` + currentLetter.join("\n\n") + "\n\nYour special gift awaits!";
    const lines = doc.splitTextToSize(fullText, 330);
    doc.text(lines, 20, 300);
    
    doc.save(`Santa_Letter_${userName}_${currentCode}.pdf`);
}
