const numbersElement = document.getElementById("numbers");
const bonusElement = document.getElementById("bonus");
const generateButton = document.getElementById("generateButton");
const themeButton = document.getElementById("themeButton");

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.dataset.theme = theme;
  themeButton.textContent = isDark ? "화이트 모드" : "다크 모드";
  themeButton.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("lotto-theme", theme);
}

function drawLottoNumbers() {
  const pool = Array.from({ length: 45 }, (_, index) => index + 1);

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[randomIndex]] = [pool[randomIndex], pool[i]];
  }

  const winningNumbers = pool.slice(0, 6).sort((a, b) => a - b);
  const bonusNumber = pool[6];

  numbersElement.innerHTML = winningNumbers
    .map((number) => `<span class="ball">${number}</span>`)
    .join("");

  bonusElement.innerHTML = `보너스 번호 <span class="ball">${bonusNumber}</span>`;
}

generateButton.addEventListener("click", drawLottoNumbers);
themeButton.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

setTheme(localStorage.getItem("lotto-theme") || "light");
