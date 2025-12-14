// =====================
// Global variables
// =====================
let validCodes = {};
let lettersData = {};
let currentCode = "";
let currentLetter = [];
let letterIndex = 0;
let userName = "";

const box5Codes = ["ABC123","XYZ789","LMN456","PL55MN88","QW11ER22","GH12JK34","RT56UV78","YZ90AB12","CD34EF56","MN78OP90"];
const santaImageURL = "https://raw.githubusercontent.com/luisfernando2025xt/xmas-mystery-box/refs/heads/main/santa.png";

// =====================
// Load JSON Data
// =====================
Promise.all([
    fetch("codes.json").then(r => r.json()),
    fetch("letters.json").then(r => r.json())
]).then(([codes, letters]) => {
    validCodes = codes;
    lettersData = letters;
});

// =====================
// LANGUAGE SETUP
// =====================
const texts = {
    EN: {
        yearTag: "Santa in 2025",
        heading: "Santa's Letter 2025",
        instructions: `
            Some people are still waiting for their letter.<br>
            Help them receive it before the Christmas magic is over.<br><br>
            <strong>Share the Magic</strong><br>
            <a href="#" onclick="shareWhatsApp(); return false;" style="color:var(--gold);font-weight:600;">WhatsApp</a> ·
            <a href="https://twitter.com/intent/tweet?text=Santa%27s%20Letter%202025" target="_blank" style="color:var(--gold);font-weight:600;">X</a> ·
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/" target="_blank" style="color:var(--gold);font-weight:600;">Facebook</a> ·
            <a href="#" onclick="navigator.clipboard.writeText('https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/'); alert('Link copied. Share it on Instagram DM or Story.'); return false;" style="color:var(--gold);font-weight:600;">Instagram</a>
        `,
        namePlaceholder: "Enter your name",
        promoText: `
🎄 Your Santa letter is complete.<br><br>
If this message brought a smile or a moment of warmth, you’re welcome to support the magic and help Santa keep delivering letters around the world.<br><br>
<a href="https://legacybuilder35.gumroad.com/l/jgcdam" target="_blank" class="button">☕ Buy Santa a Coffee</a>
`
    },
    ES: {
        yearTag: "Santa en 2025",
        heading: "Carta de Santa 2025",
        instructions: `
            Algunas personas todavía esperan su carta.<br>
            Ayúdalos a recibirla antes de que termine la magia navideña.<br><br>
            <strong>Comparte la Magia</strong><br>
            <a href="#" onclick="shareWhatsApp(); return false;" style="color:var(--gold);font-weight:600;">WhatsApp</a> ·
            <a href="https://twitter.com/intent/tweet?text=Carta%20de%20Santa%202025" target="_blank" style="color:var(--gold);font-weight:600;">X</a> ·
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/" target="_blank" style="color:var(--gold);font-weight:600;">Facebook</a> ·
            <a href="#" onclick="navigator.clipboard.writeText('https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/'); alert('Enlace copiado. Compártelo en Instagram DM o Historia.'); return false;" style="color:var(--gold);font-weight:600;">Instagram</a>
        `,
        namePlaceholder: "Ingresa tu nombre",
        promoText: `
🎄 Tu carta de Santa está completa.<br><br>
Si este mensaje te hizo sonreír o sentir un momento de calidez, puedes apoyar la magia y ayudar a Santa a seguir entregando cartas alrededor del mundo.<br><br>
<a href="https://legacybuilder35.gumroad.com/l/jgcdam" target="_blank" class="button">☕ Compra un café para Santa</a>
`
    },
    DE: {
        yearTag: "Weihnachtsmann 2025",
        heading: "Brief vom Weihnachtsmann 2025",
        instructions: `
            Manche Leute warten noch auf ihren Brief.<br>
            Hilf ihnen, ihn zu erhalten, bevor die Weihnachtsmagie vorbei ist.<br><br>
            <strong>Teile die Magie</strong><br>
            <a href="#" onclick="shareWhatsApp(); return false;" style="color:var(--gold);font-weight:600;">WhatsApp</a> ·
            <a href="https://twitter.com/intent/tweet?text=Brief%20vom%20Weihnachtsmann%202025" target="_blank" style="color:var(--gold);font-weight:600;">X</a> ·
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/" target="_blank" style="color:var(--gold);font-weight:600;">Facebook</a> ·
            <a href="#" onclick="navigator.clipboard.writeText('https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/'); alert('Link kopiert. Teile es auf Instagram DM oder Story.'); return false;" style="color:var(--gold);font-weight:600;">Instagram</a>
        `,
        namePlaceholder: "Gib deinen Namen ein",
        promoText: `
🎄 Dein Weihnachtsbrief ist fertig.<br><br>
Wenn diese Nachricht dir ein Lächeln geschenkt hat, kannst du die Magie unterstützen und Santa helfen, weiterhin Briefe auf der ganzen Welt zuzustellen.<br><br>
<a href="https://legacybuilder35.gumroad.com/l/jgcdam" target="_blank" class="button">☕ Kaufe Santa einen Kaffee</a>
`
    }
};

// =====================
// LANGUAGE HANDLING
// =====================
// Load language from localStorage
const savedLang = localStorage.getItem("selectedLang") || "EN";
document.getElementById("langSelect").value = savedLang;
updateStaticText();

// Save and update when changed
document.getElementById("langSelect").addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem("selectedLang", lang);
    updateStaticText();
});

// Update static texts
function updateStaticText() {
    const lang = document.getElementById("langSelect").value;
    document.querySelector(".year-tag").innerHTML = texts[lang].yearTag;
    document.querySelector("h1").innerHTML = texts[lang].heading;
    document.querySelector(".instructions").innerHTML = texts[lang].instructions;
    document.getElementById("nameInput").placeholder = texts[lang].namePlaceholder;
    document.querySelector(".promo").innerHTML = texts[lang].promoText;
}

// =====================
// LETTER GENERATION
// =====================
const box5 = document.getElementById('box5');
const modal = document.getElementById('modal');
const viewerBody = document.getElementById('viewerBody');
const viewerTitle = document.getElementById('viewerTitle');
const viewerFooter = document.getElementById('viewerFooter');
const viewerOpenNew = document.getElementById('viewerOpenNew');
const closeBtn = document.getElementById('closeBtn');

box5.addEventListener('click', startLetter);

function startLetter() {
    const name = document.getElementById("nameInput").value.trim();
    const lang = localStorage.getItem("selectedLang") || "EN";

    if (!name) {
        alert(lang === 'ES' ? "¡Por favor ingresa tu nombre!" : lang === 'DE' ? "Bitte gib deinen Namen ein!" : "Please enter your name!");
        return;
    }

    const code = box5Codes[Math.floor(Math.random() * box5Codes.length)];

    fetch('letters.json')
        .then(r => r.json())
        .then(letters => {
            if (!letters[code] || !letters[code][lang]) {
                alert(lang === 'ES' ? "Lo sentimos, esta carta aún no está disponible en tu idioma." :
                      lang === 'DE' ? "Entschuldigung, dieser Brief ist in deiner Sprache noch nicht verfügbar." :
                      "Sorry, this letter is not available in your language yet.");
                return;
            }
            const letterContent = letters[code][lang].map(p => p.replace("{name}", name)).join("<br><br>");
            viewerTitle.textContent = lang === 'ES' ? "Tu Carta de Santa" : lang === 'DE' ? "Dein Weihnachtsbrief" : "Your Santa Letter";
            viewerFooter.innerHTML = `Letter Code: ${code}`;
            viewerBody.innerHTML = letterContent;
            viewerOpenNew.style.display = "none";
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
        });
}

// =====================
// MODAL HANDLING
// =====================
closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    viewerBody.innerHTML = '';
    modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', (ev) => {
    if(ev.target === modal){
        modal.classList.remove('show');
        viewerBody.innerHTML = '';
        modal.setAttribute('aria-hidden', 'true');
    }
});

// =====================
// COUNTDOWN
// =====================
const countdownEl = document.getElementById("countdown");
const targetDate = new Date("December 25, 2025 00:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if(diff <= 0){
        countdownEl.textContent = "🎄 Christmas is here";
        return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================
// WhatsApp Share
// =====================
function shareWhatsApp() {
    const link = "https://luisfernando2025xt.github.io/GET_MY_SANTAS_LETTER/";
    const message = "Santa's Letter 2025 ✨ Help someone receive their letter before the Christmas magic is over 🎄\n\n" + link;
    const encoded = encodeURIComponent(message);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if(isMobile){
        window.open("https://wa.me/?text=" + encoded, "_blank");
    } else {
        navigator.clipboard.writeText(link);
        alert("Link copied. Share it on WhatsApp.");
    }
}
