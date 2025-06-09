/**
 * @class FlipClock
 * A modular flip clock component that can be used to display time or a countdown.
 */
class FlipClock {
  /**
   * @param {HTMLElement} el - The container element for the clock.
   * @param {object} [options={}] - Configuration options for the clock.
   */
  constructor(el, options = {}) {
    /**
     * The root DOM element for this clock instance.
     * @type {HTMLElement}
     */
    this.el = el;

    /**
     * The last recorded time values to check against for changes.
     * @type {object}
     */
    this.lastTime = {};

    // Initialize the clock structure and start the update loop
    this._setupClock();
    this._tick();

    // Start the interval timer
    setInterval(() => this._tick(), 1000);
  }

  /**
   * Sets up the initial HTML structure for the clock within the container element.
   * @private
   */
  _setupClock() {
    this.el.classList.add("flip-clock");
    this.el.innerHTML = `
            ${this._createUnit("Hours")}
            ${this._createUnit("Minutes")}
            ${this._createUnit("Seconds")}
        `;

    // Store references to the digit elements for easy access later
    this.digitElements = {
      hours: this.el
        .querySelector('[data-unit="Hours"]')
        .querySelectorAll(".flip-card"),
      minutes: this.el
        .querySelector('[data-unit="Minutes"]')
        .querySelectorAll(".flip-card"),
      seconds: this.el
        .querySelector('[data-unit="Seconds"]')
        .querySelectorAll(".flip-card"),
    };
  }

  /**
   * Creates the HTML for a single time unit (e.g., 'Hours').
   * @param {string} label - The label for the time unit.
   * @returns {string} The HTML string for the unit.
   * @private
   */
  _createUnit(label) {
    return `
            <div class="flip-unit" data-unit="${label}">
                <div class="digit-group">
                    ${this._createDigit("0")}
                    ${this._createDigit("0")}
                </div>
                <div class="unit-label">${label}</div>
            </div>
        `;
  }

  /**
   * Creates the HTML for a single flip-card digit.
   * @param {string} digit - The initial digit to display.
   * @returns {string} The HTML string for the digit card.
   * @private
   */
  _createDigit(digit) {
    // The structure needs a top half (static), a bottom half (updates immediately),
    // and a "back" flap that performs the animation.
    return `
            <div class="flip-card">
                <div class="card-face top"><span>${digit}</span></div>
                <div class="card-face back"><span>${digit}</span></div>
                <div class="card-face bottom"><span>${digit}</span></div>
            </div>
        `;
  }

  /**
   * The main update loop, called every second.
   * @private
   */
  _tick() {
    const now = new Date();
    const time = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };

    // Update each unit if its value has changed
    this._updateUnit("hours", time.hours);
    this._updateUnit("minutes", time.minutes);
    this._updateUnit("seconds", time.seconds);
  }

  /**
   * Updates the two digits of a time unit (e.g., updates 'Hours' to the new value).
   * @param {string} unit - The name of the unit to update ('hours', 'minutes', 'seconds').
   * @param {number} value - The new value for the unit.
   * @private
   */
  _updateUnit(unit, value) {
    if (this.lastTime[unit] === value) {
      return; // No change, do nothing
    }

    this.lastTime[unit] = value;
    const paddedValue = String(value).padStart(2, "0");
    const tens = paddedValue[0];
    const ones = paddedValue[1];

    this._flipDigit(this.digitElements[unit][0], tens);
    this._flipDigit(this.digitElements[unit][1], ones);
  }

  /**
   * Triggers the flip animation for a single digit card.
   * @param {HTMLElement} cardEl - The .flip-card element to animate.
   * @param {string} newDigit - The new digit to display after the flip.
   * @private
   */
  _flipDigit(cardEl, newDigit) {
    const topFace = cardEl.querySelector(".top");
    const bottomFace = cardEl.querySelector(".bottom");
    const backFace = cardEl.querySelector(".back");

    const currentDigit = topFace.textContent;
    if (currentDigit === newDigit) {
      return; // Already correct
    }

    // Set the new number on the flipping flap (back) and the new static bottom half.
    backFace.querySelector("span").textContent = newDigit;
    bottomFace.querySelector("span").textContent = newDigit;

    // Add the 'go' class to trigger the CSS animation on the back face.
    cardEl.classList.add("go");

    // Listen for the end of the animation
    backFace.addEventListener(
      "animationend",
      () => {
        // Update the top static face to the new number.
        topFace.querySelector("span").textContent = newDigit;

        // Reset the flap for the next animation.
        backFace.classList.remove("go");
        backFace.style.transition = "none"; // Temporarily disable transition for reset
        backFace.style.transform = "rotateX(0deg)";
        backFace.querySelector("span").textContent = newDigit;
        // Force reflow to apply the reset instantly
        backFace.offsetHeight;
        // Re-enable transition for the next flip
        backFace.style.transition = "";
      },
      { once: true }
    ); // Use {once: true} to automatically remove the event listener.
  }
}

// --- INITIALIZATION ---
// Wait for the DOM to be fully loaded before running the script.
document.addEventListener("DOMContentLoaded", () => {
  const clockContainer = document.getElementById("flip-clock-container");
  if (clockContainer) {
    new FlipClock(clockContainer);
  }
});
