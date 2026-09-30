// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzENzAJwt1sA0XsZQKBOb3y9_PYW3nFaQrs9AS7aXMYhEZYG7toXMumxIagFbq-NgC7bA/exec";

// Dark / Light Mode
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem(
    "portfolioTheme",
    isDark ? "dark" : "light"
  );
});

if (localStorage.getItem("portfolioTheme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

// Contact Form
const form = document.getElementById("contactForm");
const status = document.getElementById("status");
const responseList = document.getElementById("responseList");

function getResponses() {
  return JSON.parse(
    localStorage.getItem("portfolioResponses") || "[]"
  );
}

function displayResponses() {
  const responses = getResponses();
  responseList.replaceChildren();

  if (responses.length === 0) {
    responseList.textContent = "No responses yet.";
    return;
  }

  responses.slice().reverse().forEach(function (item) {
    const card = document.createElement("div");
    card.className = "card response";

    const heading = document.createElement("h3");
    heading.textContent = item.name;

    const email = document.createElement("p");
    email.textContent = "Email: " + item.email;

    const message = document.createElement("p");
    message.textContent = item.message;

    const date = document.createElement("small");
    date.textContent = item.date;

    card.append(heading, email, message, date);
    responseList.appendChild(card);
  });
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    status.textContent = "Please fill in all fields.";
    return;
  }

  const data = { name, email, message };

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  status.textContent = "Submitting...";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const responses = getResponses();

    responses.push({
      name,
      email,
      message,
      date: new Date().toLocaleString()
    });

    localStorage.setItem(
      "portfolioResponses",
      JSON.stringify(responses)
    );

    form.reset();
    displayResponses();

    status.textContent =
      "Submission sent! Check Google Sheets to confirm it was saved.";

  } catch (error) {
    status.textContent =
      "Submission failed. Please check your connection and try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

displayResponses();