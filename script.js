// Get references to the HTML elements for the main countdown
const monthsMainElement = document.getElementById("months-main");
const daysMainElement = document.getElementById("days-main");
const hoursMainElement = document.getElementById("hours-main");
const minutesMainElement = document.getElementById("minutes-main");
const secondsMainElement = document.getElementById("seconds-main");

// Get references to the HTML elements for the individual timers
const secondsOnlyElement = document.getElementById("seconds-only");
const minutesOnlyElement = document.getElementById("minutes-only");
const hoursOnlyElement = document.getElementById("hours-only");
const daysOnlyElement = document.getElementById("days-only");
const monthsOnlyElement = document.getElementById("months-only");

// Set the target date and time for the countdown
const targetDate = new Date("March 16, 2026 09:00:00");

// Function to update all the countdown timers
function updateCountdown() {
  // Get the current date and time
  const now = new Date();
  // Calculate the difference between the target and current time in milliseconds
  const timeDifference = targetDate.getTime() - now.getTime();

  // If the target time has passed, stop the countdown
  if (timeDifference <= 0) {
    clearInterval(intervalId);
    document.querySelector(".countdown-container h1").innerText =
      "Time has arrived!";
    monthsMainElement.innerText = "0";
    daysMainElement.innerText = "0";
    hoursMainElement.innerText = "00";
    minutesMainElement.innerText = "00";
    secondsMainElement.innerText = "00.0";
    secondsOnlyElement.innerText = "0.000";
    minutesOnlyElement.innerText = "0.00";
    hoursOnlyElement.innerText = "0.00";
    daysOnlyElement.innerText = "0.00";
    monthsOnlyElement.innerText = "0.00";
    return;
  }

  // Calculate total remaining units
  const totalSeconds = timeDifference / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  // Calculate months and remaining days for the main counter
  let remainingMonths = (targetDate.getFullYear() - now.getFullYear()) * 12;
  remainingMonths -= now.getMonth();
  remainingMonths += targetDate.getMonth();

  // Adjust for cases where the target day is before the current day in the same month/year
  if (
    targetDate.getDate() < now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear()
  ) {
    remainingMonths = 0; // Less than a month left
  } else if (targetDate.getDate() < now.getDate()) {
    remainingMonths--;
  }

  const tempDate = new Date(now);
  let monthsPassed = 0;
  while (tempDate < targetDate) {
    tempDate.setMonth(tempDate.getMonth() + 1);
    if (tempDate <= targetDate) {
      monthsPassed++;
    } else {
      break;
    }
  }
  remainingMonths = monthsPassed;

  // Calculate remaining days in the current "month" for the main counter
  let daysInTargetMonth = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    0
  ).getDate();
  let remainingDaysMain;

  const diffYears = targetDate.getFullYear() - now.getFullYear();
  const diffMonths = targetDate.getMonth() - now.getMonth();
  const diffDays = targetDate.getDate() - now.getDate();

  if (diffYears === 0 && diffMonths === 0) {
    remainingDaysMain = diffDays;
  } else {
    const nextMonthFirstDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const timeToTarget = targetDate.getTime() - now.getTime();
    const timeToNextMonth = nextMonthFirstDay.getTime() - now.getTime();
    const daysIntoNextMonth = Math.max(
      0,
      Math.floor(
        (timeToTarget -
          (remainingMonths - (diffDays < 0 ? 1 : 0)) *
            (30.4375 * 24 * 60 * 60 * 1000)) /
          (24 * 60 * 60 * 1000)
      )
    ); // Approximate

    const daysInCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    if (diffDays < 0) {
      const daysLeftInCurrentMonth =
        daysInCurrentMonth - now.getDate() + targetDate.getDate();
      remainingDaysMain = daysLeftInCurrentMonth;
    } else {
      remainingDaysMain = diffDays;
    }
    if (remainingMonths > 0) {
      const daysFromNowToTargetMonthStart =
        (new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          1
        ).getTime() -
          now.getTime()) /
        (1000 * 60 * 60 * 24);
      const fullMonthsInDays = Math.floor(remainingMonths) * 30.4375; // Approximate
      remainingDaysMain = Math.ceil(
        daysFromNowToTargetMonthStart - fullMonthsInDays
      );
      if (remainingDaysMain < 0) {
        remainingDaysMain = targetDate.getDate();
      }
    } else {
      remainingDaysMain = Math.ceil(totalDays);
    }
  }

  const remainingHours = Math.floor((totalDays % 1) * 24);
  const remainingMinutes = Math.floor((totalHours % 1) * 60);
  const remainingSeconds = Math.floor((totalMinutes % 1) * 60);
  const remainingMilliseconds = Math.floor((totalSeconds % 1) * 1000);

  // Update the HTML elements for the main countdown
  monthsMainElement.innerText = remainingMonths;
  daysMainElement.innerText =
    remainingDaysMain >= 0 ? Math.floor(remainingDaysMain) : 0;
  hoursMainElement.innerText = formatTime(remainingHours);
  minutesMainElement.innerText = formatTime(remainingMinutes);
  secondsMainElement.innerText = `${formatTime(remainingSeconds)}.${
    String(remainingMilliseconds).padStart(3, "0")[0]
  }`;

  // Update the HTML elements for the individual timers
  secondsOnlyElement.innerText = totalSeconds.toFixed(3);
  minutesOnlyElement.innerText = totalMinutes.toFixed(2);
  hoursOnlyElement.innerText = totalHours.toFixed(2);
  daysOnlyElement.innerText = totalDays.toFixed(2);

  // Approximate month calculation for the individual month counter
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let monthsDiff = (targetDate.getFullYear() - start.getFullYear()) * 12;
  monthsDiff -= start.getMonth();
  monthsDiff += targetDate.getMonth();
  if (targetDate.getDate() < start.getDate()) {
    monthsDiff--;
  }
  monthsOnlyElement.innerText =
    monthsDiff +
    (targetDate.getDate() - now.getDate()) /
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

// Function to format time units (add leading zero if less than 10)
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Update the countdown every 100 milliseconds for smoother decimal display
const intervalId = setInterval(updateCountdown, 100);
// Call updateCountdown once when the page loads
updateCountdown();
