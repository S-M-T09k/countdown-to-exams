document.addEventListener("DOMContentLoaded", () => {
  const targetDate = new Date("2026-03-16T09:00:00");

  // --- DOM Elements for Main Countdown Values ---
  const elMainMonthsVal = document.getElementById("main-months-val");
  const elMainDaysVal = document.getElementById("main-days-val");
  const elMainHoursVal = document.getElementById("main-hours-val");
  const elMainMinutesVal = document.getElementById("main-minutes-val");
  const elMainSecondsVal = document.getElementById("main-seconds-val");

  // --- DOM Elements for Total Counters ---
  const elTotalMonths = document.getElementById("total-months");
  const elTotalDays = document.getElementById("total-days");
  const elTotalHours = document.getElementById("total-hours");
  const elTotalMinutes = document.getElementById("total-minutes");
  const elTotalSeconds = document.getElementById("total-seconds");

  // --- Containers and Messages ---
  const mainCountdownContainer = document.getElementById(
    "main-countdown-container"
  );
  const totalCountersContainer = document.getElementById(
    "total-counters-container"
  );
  const countdownEndedMessage = document.getElementById("countdown-ended");
  const mainPageTitle = document.getElementById("main-title");
  const subTitle = document.querySelector("header p");

  let intervalId;

  function updateCountdown() {
    const now = new Date();
    const timeLeft = targetDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      if (mainCountdownContainer) mainCountdownContainer.style.display = "none";
      if (totalCountersContainer) totalCountersContainer.style.display = "none";
      if (countdownEndedMessage)
        countdownEndedMessage.classList.remove("hidden");

      const estimateSpanHTML =
        mainPageTitle.querySelector("span")?.outerHTML || "";
      mainPageTitle.innerHTML = "Exam Time! " + estimateSpanHTML;

      if (subTitle) subTitle.classList.add("hidden");

      // Set all main countdown values to 0 or 0.0
      if (elMainMonthsVal) elMainMonthsVal.textContent = "00";
      if (elMainDaysVal) elMainDaysVal.textContent = "00";
      if (elMainHoursVal) elMainHoursVal.textContent = "00";
      if (elMainMinutesVal) elMainMinutesVal.textContent = "00";
      if (elMainSecondsVal) elMainSecondsVal.textContent = "00.0";

      // Set total counters to 0 with correct decimal places
      if (elTotalMonths) elTotalMonths.textContent = (0).toFixed(9);
      if (elTotalDays) elTotalDays.textContent = (0).toFixed(7);
      if (elTotalHours) elTotalHours.textContent = (0).toFixed(6);
      if (elTotalMinutes) elTotalMinutes.textContent = (0).toFixed(4);
      if (elTotalSeconds) elTotalSeconds.textContent = (0).toFixed(2);
      return;
    }

    // --- Main Countdown Calculation (H, M, S part from total timeLeft) ---
    const s_total_for_main = Math.floor(timeLeft / 1000);
    const s_main_integer = s_total_for_main % 60;
    const m_main = Math.floor(s_total_for_main / 60) % 60;
    const h_main = Math.floor(s_total_for_main / 3600) % 24;

    const s_main_decimal_val = Math.floor((timeLeft % 1000) / 100);

    // --- Main Countdown Calculation (Months and Days part - calendar difference) ---
    let y_diff = targetDate.getFullYear() - now.getFullYear();
    let m_diff = targetDate.getMonth() - now.getMonth();
    let d_diff = targetDate.getDate() - now.getDate();

    if (
      now.getHours() > targetDate.getHours() ||
      (now.getHours() === targetDate.getHours() &&
        now.getMinutes() > targetDate.getMinutes()) ||
      (now.getHours() === targetDate.getHours() &&
        now.getMinutes() === targetDate.getMinutes() &&
        now.getSeconds() >= targetDate.getSeconds())
    ) {
      if (targetDate.getTime() > now.getTime()) {
        d_diff--;
      }
    }

    if (d_diff < 0) {
      m_diff--;
      const daysInCurrentMonthOfNow = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      d_diff += daysInCurrentMonthOfNow;
    }

    if (m_diff < 0) {
      y_diff--;
      m_diff += 12;
    }

    let displayMonths = y_diff * 12 + m_diff;
    let displayDays = d_diff;

    if (displayMonths < 0) displayMonths = 0;
    if (displayDays < 0) displayDays = 0;

    // --- Update Main Countdown DOM (Simplified) ---
    if (elMainMonthsVal)
      elMainMonthsVal.textContent = String(displayMonths).padStart(2, "0");
    if (elMainDaysVal)
      elMainDaysVal.textContent = String(displayDays).padStart(2, "0");
    if (elMainHoursVal)
      elMainHoursVal.textContent = String(h_main).padStart(2, "0");
    if (elMainMinutesVal)
      elMainMinutesVal.textContent = String(m_main).padStart(2, "0");
    if (elMainSecondsVal)
      elMainSecondsVal.textContent =
        String(s_main_integer).padStart(2, "0") +
        "." +
        String(s_main_decimal_val);

    // --- Total Counters Calculation ---
    const totalSecondsRaw = timeLeft / 1000;
    const totalMinutes = totalSecondsRaw / 60;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;
    const averageDaysInMonth = 365.25 / 12;
    const totalMonths = totalDays / averageDaysInMonth;

    // --- Update Total Counters DOM (Adjusted toFixed for more digits) ---
    if (elTotalSeconds) elTotalSeconds.textContent = totalSecondsRaw.toFixed(2);
    if (elTotalMinutes) elTotalMinutes.textContent = totalMinutes.toFixed(4);
    if (elTotalHours) elTotalHours.textContent = totalHours.toFixed(6);
    if (elTotalDays) elTotalDays.textContent = totalDays.toFixed(7);
    if (elTotalMonths) elTotalMonths.textContent = totalMonths.toFixed(9);
  }

  // Initial call and interval
  updateCountdown();
  intervalId = setInterval(updateCountdown, 100); // Update every 100ms
});
