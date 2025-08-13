class PaceCalculator {
  constructor() {
    // this.paceTypeSelect = document.getElementById('pace-type');
    this.selectedPaceType = 'kmh'; // Default pace type

    // Input for Kilometres per hour
    this.paceValueInputKmh = document.getElementById('pace-value-kmh');

    // Input for Miles per hour
    this.paceValueInputMph = document.getElementById('pace-value-mph');

    // Input for Minutes per Kilometre (min/km)
    this.minutesInputMinkm = document.getElementById('minutes-min-km');
    this.secondsInputMinkm = document.getElementById('seconds-min-km');

    // Input for Minutes per Mile (min/mile)
    this.minutesInputMinmile = document.getElementById('minutes-min-mile');
    this.secondsInputMinmile = document.getElementById('seconds-min-mile');

    this.calculateBtn = document.getElementById('calculate-btn');
    this.resultsSection = document.getElementById('results-section');

    this.distances = {
      '2.4km': 2.4,
      '5km': 5,
      '10km': 10,
      half: 21.1,
      full: 42.2,
    };

    this.initEventListeners();
  }

  initEventListeners() {
    // this.paceTypeSelect.addEventListener('change', () => this.updatePaceInputs());
    this.paceValueInputKmh.addEventListener('input', () => this.updatePaceInputs('kmh'));
    this.paceValueInputMph.addEventListener('input', () => this.updatePaceInputs('mph'));

    this.minutesInputMinkm.addEventListener('input', () => this.updatePaceInputs('min-km'));
    this.secondsInputMinkm.addEventListener('input', () => this.updatePaceInputs('min-km'));
    this.minutesInputMinmile.addEventListener('input', () => this.updatePaceInputs('min-mile'));
    this.secondsInputMinmile.addEventListener('input', () => this.updatePaceInputs('min-mile'));
    this.calculateBtn.addEventListener('click', () => this.calculateRaceTimes());

    // Enter key support
    this.paceValueInputKmh.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });

    this.paceValueInputMph.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });

    this.minutesInputMinkm.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });

    this.secondsInputMinkm.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });

    this.minutesInputMinmile.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });

    this.secondsInputMinmile.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.calculateRaceTimes();
    });
  }

  updatePaceInputs(paceType) {
    this.selectedPaceType = paceType || this.selectedPaceType;

    if (this.selectedPaceType === 'kmh') {
      this.paceValueInput = this.paceValueInputKmh;
    }
    else if (this.selectedPaceType === 'mph') {
      this.paceValueInput = this.paceValueInputMph;
    }
    else if (this.selectedPaceType === 'min-km') {
      this.minutesInput = this.minutesInputMinkm;
      this.secondsInput = this.secondsInputMinkm;
    }
    else if (this.selectedPaceType === 'min-mile') {
      this.minutesInput = this.minutesInputMinmile;
      this.secondsInput = this.secondsInputMinmile;
    }

    this.updatePaceInputValues(paceType);
  }

  updatePaceInputValues(paceType) {
    // Calculate equivalent pace values for other inputs
    const paceTypeArr = ['kmh', 'mph', 'min-km', 'min-mile'];
    const paceValue = parseFloat(this.paceValueInput?.value) || 0;
    const minutes = this.minutesInput ? parseInt(this.minutesInput.value) : 0;
    const seconds = this.secondsInput ? parseInt(this.secondsInput.value) : 0;
    const paceInKmh = this.convertToKmh(paceType, paceValue, minutes, seconds);
    for (const type of paceTypeArr) {
      if (type === paceType) continue;
      if (type === 'kmh') {
        this.paceValueInputKmh.value = paceInKmh;
      } else if (type === 'mph') {
        this.paceValueInputMph.value = this.calculateKmhToMph(paceInKmh);
      } else if (type === 'min-km') {
        const minKm = this.calculateKmhToMinKm(paceInKmh);
        this.minutesInputMinkm.value = minKm.minutes;
        this.secondsInputMinkm.value = minKm.seconds;
      } else if (type === 'min-mile') {
        const minMile = this.calculateKmhToMinMile(paceInKmh);
        this.minutesInputMinmile.value = minMile.minutes;
        this.secondsInputMinmile.value = minMile.seconds;
      }
    }

  }

  calculateKmhToMph(kmh) {
    return kmh * 0.621371;
  }

  calculateKmhToMinKm(kmh) {
    const paceInMinutes = 60 / kmh;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes % 1) * 60);
    return { minutes, seconds };
  }

  calculateKmhToMinMile(kmh) {
    const mph = this.calculateKmhToMph(kmh);
    const paceInMinutes = 60 / mph;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes % 1) * 60);
    return { minutes, seconds };
  }

  removeErrorStyles() {
    this.paceValueInputKmh.classList.remove('input-error');
    this.paceValueInputMph.classList.remove('input-error');
    this.minutesInputMinkm.classList.remove('input-error');
    this.secondsInputMinkm.classList.remove('input-error');
    this.minutesInputMinmile.classList.remove('input-error');
    this.secondsInputMinmile.classList.remove('input-error');
  }

  validateInputs() {
    const paceType = this.selectedPaceType;
    let isValid = true;

    // Remove previous error styles
    this.removeErrorStyles();

    //  If time inputs are used
    if (paceType === 'min-km' || paceType === 'min-mile') {
      const minutes = parseInt(this.minutesInput.value) || 0;
      const seconds = parseInt(this.secondsInput.value) || 0;

      if (minutes === 0 && seconds === 0) {
        this.minutesInput.classList.add('input-error');
        this.secondsInput.classList.add('input-error');
        isValid = false;
      }
    } else { // If pace inputs are used
      const paceValue = parseFloat(this.paceValueInput.value);

      if (!paceValue || paceValue <= 0) {
        this.paceValueInput.classList.add('input-error');
        isValid = false;
      }
    }

    return isValid;
  }

  convertToKmh(paceType, paceValue, minutes = 0, seconds = 0) {
    switch (paceType) {
      case 'kmh': {
        return paceValue;
      }
      case 'mph': {
        return paceValue * 1.60934; // mph to km/h
      }

      case 'min-km': {
        const totalMinutesPerKm = minutes + seconds / 60;
        return 60 / totalMinutesPerKm; // Convert min/km to km/h
      }

      case 'min-mile': {
        const totalMinutesPerMile = minutes + seconds / 60;
        const kmhFromMile = 60 / totalMinutesPerMile; // km/h equivalent
        return kmhFromMile * 1.60934; // Convert from mile-based to km-based
      }

      default:
        return 0;
    }
  }

  calculateTimeFromSpeed(speedKmh, distanceKm) {
    const timeInHours = distanceKm / speedKmh;
    // Round to avoid floating-point precision issues
    const totalMinutes = Math.round(timeInHours * 60 * 100) / 100;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  calculateRaceTimes() {
    if (!this.validateInputs()) {
      this.showError('Please enter a valid pace value.');
      return;
    }

    const paceType = this.selectedPaceType;
    const paceValue = parseFloat(this.paceValueInput?.value) || 0;
    const minutes = parseInt(this.minutesInput?.value) || 0;
    const seconds = parseInt(this.secondsInput?.value) || 0;

    try {
      const speedKmh = this.convertToKmh(paceType, paceValue, minutes, seconds);

      if (speedKmh <= 0) {
        this.showError('Invalid pace calculation. Please check your inputs.');
        return;
      }

      // Calculate times for each distance
      const results = {};
      Object.entries(this.distances).forEach(([key, distance]) => {
        results[key] = this.calculateTimeFromSpeed(speedKmh, distance);
      });

      this.displayResults(results);
    } catch (error) {
      this.showError('An error occurred while calculating. Please try again.');
      console.error('Calculation error:', error);
    }
  }

  displayResults(results) {
    // Update result elements
    document.getElementById('time-2-4km').textContent = results['2.4km'];
    document.getElementById('time-5km').textContent = results['5km'];
    document.getElementById('time-10km').textContent = results['10km'];
    document.getElementById('time-half').textContent = results['half'];
    document.getElementById('time-full').textContent = results['full'];

    // Show results section
    this.resultsSection.style.display = 'block';

    // Smooth scroll to results
    this.resultsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  showError(message) {
    // Create or update error message
    let errorElement = document.getElementById('error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'error-message';
      errorElement.className = 'error-message';
      this.calculateBtn.parentNode.insertBefore(errorElement, this.calculateBtn.nextSibling);
    }

    errorElement.textContent = message;

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.remove();
      }
    }, 5000);
  }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PaceCalculator();
});

// Add some utility functions for testing
window.PaceCalculatorUtils = {
  // Fix floating-point precision issues
  roundToPrecision: (num, precision = 10) => {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  },

  convertMilesToKm: miles => miles * 1.60934,
  convertKmToMiles: km => km / 1.60934,
  convertMinutesToSeconds: minutes => minutes * 60,
  formatTime: totalMinutes => {
    // Round to avoid floating-point precision issues
    const roundedMinutes = Math.round(totalMinutes * 100) / 100;
    const hours = Math.floor(roundedMinutes / 60);
    const minutes = Math.floor(roundedMinutes % 60);
    const seconds = Math.round((roundedMinutes % 1) * 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  },
};
