document.addEventListener("DOMContentLoaded", () => {
  const targetDate = new Date("2026-03-16T09:00:00");

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

  // Helper function to update a single flip card digit
  function flipDigit(card, newDigit) {
    const topFace = card.querySelector(".card-top span");
    const bottomFace = card.querySelector(".card-bottom span");
    const backTopFace = card.querySelector(".card-back-top span");
    const backBottomFace = card.querySelector(".card-back-bottom span");

    const currentDigit = topFace.textContent;

    if (currentDigit === String(newDigit)) {
      return; // No change
    }

    // Set the new digit on the back faces
    backTopFace.textContent = newDigit;
    backBottomFace.textContent = newDigit;

    // Add class to trigger animation
    card.classList.add("flipped");

    // After animation, reset for next flip
    setTimeout(() => {
      topFace.textContent = newDigit;
      bottomFace.textContent = newDigit;
      card.classList.remove("flipped");
      // Reset back faces to current (now new) digit to prepare for next potential flip
      // This is important if the animation doesn't perfectly hide them or for state consistency
      backTopFace.textContent = newDigit;
      backBottomFace.textContent = newDigit;
    }, 500); // Must match CSS transition duration
  }

  function updateFlipUnit(unitName, value, isDecimal = false) {
    const unitGroup = document.querySelector(
      `.flip-card-group[data-unit="${unitName}"]`
    );
    if (!unitGroup) return;

    if (isDecimal) {
      // For seconds.decimal
      const decimalCard = unitGroup.querySelector(".flip-card.decimal");
      if (decimalCard) flipDigit(decimalCard, value);
    } else {
      const tens = Math.floor(value / 10);
      const ones = value % 10;
      const tensCard = unitGroup.querySelector(".flip-card.tens");
      const onesCard = unitGroup.querySelector(".flip-card.ones");

      if (tensCard) flipDigit(tensCard, tens);
      if (onesCard) flipDigit(onesCard, ones);
    }
  }

  function updateCountdown() {
    const now = new Date();
    const timeLeft = targetDate.getTime() - now.getTime();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      if (mainCountdownContainer) mainCountdownContainer.style.display = "none"; // Hide instead of class for simplicity
      if (totalCountersContainer) totalCountersContainer.style.display = "none";
      if (countdownEndedMessage)
        countdownEndedMessage.classList.remove("hidden");

      const estimateSpanHTML =
        mainPageTitle.querySelector("span")?.outerHTML || "";
      mainPageTitle.innerHTML = "Exam Time! " + estimateSpanHTML;

      if (subTitle) subTitle.classList.add("hidden");

      // Set flip cards to 0
      ["months", "days", "hours", "minutes"].forEach((unit) => {
        updateFlipUnit(unit, 0);
      });
      updateFlipUnit("seconds", 0); // Integer part of seconds
      updateFlipUnit("seconds", 0, true); // Decimal part of seconds

      // Set total counters to 0 with correct decimal places
      if (elTotalMonths) elTotalMonths.textContent = (0).toFixed(9); // Adjusted for more digits
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

    // --- Update Main Flip Countdown DOM ---
    updateFlipUnit("months", displayMonths);
    updateFlipUnit("days", displayDays);
    updateFlipUnit("hours", h_main);
    updateFlipUnit("minutes", m_main);
    updateFlipUnit("seconds", s_main_integer); // Integer part of seconds
    updateFlipUnit("seconds", s_main_decimal_val, true); // Decimal part of seconds

    // --- Total Counters Calculation ---
    const totalSecondsRaw = timeLeft / 1000;
    const totalMinutes = totalSecondsRaw / 60;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;
    const averageDaysInMonth = 365.25 / 12;
    const totalMonths = totalDays / averageDaysInMonth;

    // --- Update Total Counters DOM (Adjusted toFixed for more digits) ---
    if (elTotalSeconds) elTotalSeconds.textContent = totalSecondsRaw.toFixed(2); // e.g., XXXXXXXX.XX (11)
    if (elTotalMinutes) elTotalMinutes.textContent = totalMinutes.toFixed(4); // e.g., XXXXXX.XXXX (11)
    if (elTotalHours) elTotalHours.textContent = totalHours.toFixed(6); // e.g., XXXX.XXXXXX (11)
    if (elTotalDays) elTotalDays.textContent = totalDays.toFixed(7); // e.g., XXX.XXXXXXX (11)
    if (elTotalMonths) elTotalMonths.textContent = totalMonths.toFixed(9); // e.g., XX.XXXXXXXXX (12)
  }

  // Initial setup of flip cards to 00 or 0
  ["months", "days", "hours", "minutes"].forEach((unit) => {
    updateFlipUnit(unit, 0);
  });
  updateFlipUnit("seconds", 0);
  updateFlipUnit("seconds", 0, true); // decimal

  // Initial call and interval
  updateCountdown();
  intervalId = setInterval(updateCountdown, 100); // Update every 100ms
});
