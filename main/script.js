const numbersElement = document.getElementById("numbers");
const bonusElement = document.getElementById("bonus");
const generateButton = document.getElementById("generateButton");
const themeButton = document.getElementById("themeButton");
const holidayForm = document.getElementById("holidayForm");
const countryCodeElement = document.getElementById("countryCode");
const holidayYearElement = document.getElementById("holidayYear");
const holidayStatusElement = document.getElementById("holidayStatus");
const holidayListElement = document.getElementById("holidayList");

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

function formatHolidayDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
}

function renderHolidays(holidays) {
  holidayListElement.innerHTML = "";

  holidays.forEach((holiday) => {
    const item = document.createElement("li");
    const date = document.createElement("span");
    const name = document.createElement("strong");
    const type = document.createElement("small");

    date.textContent = formatHolidayDate(holiday.date);
    name.textContent = holiday.name;
    type.textContent = holiday.nationalHoliday ? "전국 공휴일" : "지역 공휴일";

    item.append(date, name, type);
    holidayListElement.append(item);
  });
}

async function loadHolidays(event) {
  event.preventDefault();

  const countryCode = countryCodeElement.value;
  const year = holidayYearElement.value;
  const countryName = countryCodeElement.options[countryCodeElement.selectedIndex].textContent;
  const endpoint = `https://date.nager.at/api/v4/Holidays/${countryCode}/${year}`;

  holidayStatusElement.textContent = `${countryName} ${year}년 공휴일을 불러오는 중입니다.`;
  holidayListElement.innerHTML = "";

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("공휴일 데이터를 불러오지 못했습니다.");
    }

    const holidays = await response.json();

    if (holidays.length === 0) {
      holidayStatusElement.textContent = "표시할 공휴일 데이터가 없습니다.";
      return;
    }

    holidayStatusElement.textContent = `${countryName} ${year}년 공휴일 ${holidays.length}개`;
    renderHolidays(holidays);
  } catch (error) {
    holidayStatusElement.textContent = "잠시 후 다시 시도해주세요. 공휴일 데이터를 가져오지 못했습니다.";
  }
}

generateButton.addEventListener("click", drawLottoNumbers);
themeButton.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});
holidayForm.addEventListener("submit", loadHolidays);

setTheme(localStorage.getItem("lotto-theme") || "light");
holidayYearElement.value = new Date().getFullYear();
