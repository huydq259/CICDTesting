const accents = ["#c4482f", "#167b68", "#1f6bb8", "#9b5f16"];
let accentIndex = 0;

const themeToggle = document.getElementById("themeToggle");
const timeBtn = document.getElementById("timeBtn");
const timeOutput = document.getElementById("timeOutput");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    accentIndex = (accentIndex + 1) % accents.length;
    document.documentElement.style.setProperty("--accent", accents[accentIndex]);
  });
}

if (timeBtn && timeOutput) {
  timeBtn.addEventListener("click", () => {
    const now = new Date();
    timeOutput.textContent = `Local time: ${now.toLocaleString()}`;
  });
}
