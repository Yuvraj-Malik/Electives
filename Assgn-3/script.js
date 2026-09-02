/* =========================
   MOBILE NAVIGATION
========================= */

function toggleMenu() {
    const nav = document.querySelector(".nav-links");

    if (nav) {
        nav.classList.toggle("show");
    }
}


/* =========================
   COUNTDOWN
========================= */

function updateCountdown() {

    const countdown = document.getElementById("countdown");

    if (!countdown) {
        return;
    }

    const eventDate = new Date("September 25, 2026 10:00:00").getTime();
    const now = new Date().getTime();

    const difference = eventDate - now;

    if (difference <= 0) {
        countdown.innerHTML = "SEAferno is LIVE!";
        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) /
        1000
    );

    countdown.innerHTML =
        `${days}D : ${hours}H : ${minutes}M : ${seconds}S`;
}

setInterval(updateCountdown, 1000);

updateCountdown();


/* =========================
   REGISTRATION FORM
========================= */

function submitRegistration(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const eventName = document.getElementById("event").value;
    const message = document.getElementById("formMessage");

    if (name === "" || eventName === "") {
        message.innerHTML = "Please fill in all required fields.";
        return;
    }

    message.innerHTML =
        `Registration successful! See you at SEAferno, ${name}!`;

    document.getElementById("registrationForm").reset();
}


/* =========================
   FAQ
========================= */

function toggleFAQ(button) {

    const answer = button.nextElementSibling;
    const symbol = button.querySelector("span");

    answer.classList.toggle("show");

    if (answer.classList.contains("show")) {
        symbol.innerHTML = "−";
    } else {
        symbol.innerHTML = "+";
    }
}