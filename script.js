let validCodes = {};
let currentCode = "";

// Load codes.json
fetch("codes.json")
  .then(r => r.json())
  .then(data => {
    validCodes = data;
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
