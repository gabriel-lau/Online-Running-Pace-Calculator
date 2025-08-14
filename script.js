class PaceCalculator {
  constructor() {
    this.calculateBtn = document.getElementById('calculate-btn');
    this.resultsSection = document.getElementById('results-section');

    this.distances = {
      '2.4km': 2.4,
      '5km': 5,
      '10km': 10,
      half: 21.1,
      full: 42.2,
    };

    this.inputElementManager = new InputElementManager(this);

    this.calculateBtn.addEventListener('click', () => this.calculateRaceTimes());
  }

  calculateRaceTimes() {
    if (!this.inputElementManager.validateSelectedInput()) {
      this.showError('Please enter a valid pace value.');
      return;
    }

    const paceType = this.inputElementManager.getSelectedPaceType();
    const paceValue = this.inputElementManager.getSelectedPace().pace || 0;
    const minutes = this.inputElementManager.getSelectedPace().minutes || 0;
    const seconds = this.inputElementManager.getSelectedPace().seconds || 0;

    try {
      const speedKmh = PaceConverter.convertToKmh(paceType, paceValue, minutes, seconds);

      if (speedKmh <= 0) {
        this.showError('Invalid pace calculation. Please check your inputs.');
        return;
      }

      // Calculate times for each distance
      const results = {};
      Object.entries(this.distances).forEach(([key, distance]) => {
        results[key] = PaceConverter.calculateTimeFromSpeed(speedKmh, distance);
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

class InputElementManager {
  constructor(parent) {
    this.parent = parent;
    this.paceType = '';
    this.selectedInput = null;
    this.children = [
      new PaceInputElement('kmh', document.getElementById('pace-value-kmh'), this),
      new PaceInputElement('mph', document.getElementById('pace-value-mph'), this),
      new TimeInputElement(
        'min-km',
        document.getElementById('minutes-min-km'),
        document.getElementById('seconds-min-km'),
        this
      ),
      new TimeInputElement(
        'min-mile',
        document.getElementById('minutes-min-mile'),
        document.getElementById('seconds-min-mile'),
        this
      ),
    ];
  }

  getSelectedPace() {
    return this.selectedInput?.getPace() || 0;
  }

  getSelectedPaceType() {
    return this.paceType;
  }

  setSelectedPaceType(type) {
    this.paceType = type;
    this.selectedInput = this.children.find(child => child.getType() === type);
    this.removeAllSelectedStyles();
    this.removeAllErrorStyles();
    this.selectedInput.addSelectedStyle();
  }

  removeAllSelectedStyles() {
    this.children.forEach(child => child.removeSelectedStyle());
  }

  removeAllErrorStyles() {
    this.children.forEach(child => child.removeErrorStyle());
  }

  autoConvertInputs() {
    const selectedPace = this.selectedInput.getPace();
    const selectedPaceKmh = PaceConverter.convertToKmh(
      this.paceType,
      selectedPace.pace,
      selectedPace.minutes,
      selectedPace.seconds
    );
    this.children.forEach(child => {
      if (child !== this.selectedInput) {
        switch (child.getType()) {
          case 'kmh':
            child.setPace(selectedPaceKmh);
            break;
          case 'mph':
            child.setPace(PaceConverter.convertKmhToMph(selectedPaceKmh));
            break;
          case 'min-km':
            child.setPace(
              PaceConverter.convertKmhToMinKm(selectedPaceKmh).minutes,
              PaceConverter.convertKmhToMinKm(selectedPaceKmh).seconds
            );
            break;
          case 'min-mile':
            child.setPace(
              PaceConverter.convertKmhToMinMile(selectedPaceKmh).minutes,
              PaceConverter.convertKmhToMinMile(selectedPaceKmh).seconds
            );
            break;
        }
      }
    });
  }

  validateSelectedInput() {
    this.removeAllErrorStyles();
    this.removeAllSelectedStyles();
    return this.selectedInput?.validateInput() || false;
  }

  triggerCalculateRaceTimes() {
    this.parent.calculateRaceTimes();
  }
}

class PaceInputElement {
  constructor(type, element, manager) {
    this.type = type;
    this.element = element;
    this.manager = manager;

    this.element.addEventListener('click', () => {
      this.manager.setSelectedPaceType(this.getType());
    });

    this.element.addEventListener('input', () => {
      this.manager.autoConvertInputs();
    });

    this.element.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        this.manager.triggerCalculateRaceTimes();
      }
    });
  }

  getType() {
    return this.type;
  }

  getPace() {
    return { pace: parseFloat(this.element.value) };
  }

  setPace(value) {
    this.element.value = value;
  }

  addSelectedStyle() {
    this.element.classList.add('input-selected');
  }

  removeSelectedStyle() {
    this.element.classList.remove('input-selected');
  }

  addErrorStyle() {
    this.element.classList.add('input-error');
  }

  removeErrorStyle() {
    this.element.classList.remove('input-error');
  }

  validateInput() {
    const paceValue = this.getPace();
    if (!paceValue.pace || paceValue.pace <= 0) {
      this.addErrorStyle();
      return false;
    }
    return true;
  }
}

class TimeInputElement {
  constructor(type, element1, element2, manager) {
    this.type = type;
    this.element1 = element1;
    this.element2 = element2;
    this.manager = manager;

    this.element1.addEventListener('click', () => {
      this.manager.setSelectedPaceType(this.getType());
    });
    this.element2.addEventListener('click', () => {
      this.manager.setSelectedPaceType(this.getType());
    });

    this.element1.addEventListener('input', () => {
      this.manager.autoConvertInputs();
    });
    this.element2.addEventListener('input', () => {
      this.manager.autoConvertInputs();
    });

    this.element1.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        this.manager.triggerCalculateRaceTimes();
      }
    });
    this.element2.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        this.manager.triggerCalculateRaceTimes();
      }
    });
  }

  getType() {
    return this.type;
  }

  getPace() {
    return {
      minutes: parseInt(this.element1.value),
      seconds: parseInt(this.element2.value),
    };
  }

  setPace(minutes, seconds) {
    this.element1.value = minutes;
    this.element2.value = seconds;
  }

  addSelectedStyle() {
    this.element1.classList.add('input-selected');
    this.element2.classList.add('input-selected');
  }

  removeSelectedStyle() {
    this.element1.classList.remove('input-selected');
    this.element2.classList.remove('input-selected');
  }

  addErrorStyle() {
    this.element1.classList.add('input-error');
    this.element2.classList.add('input-error');
  }

  removeErrorStyle() {
    this.element1.classList.remove('input-error');
    this.element2.classList.remove('input-error');
  }

  validateInput() {
    const paceValue = this.getPace();
    if (
      isNaN(paceValue.minutes) ||
      paceValue.minutes <= 0 ||
      isNaN(paceValue.seconds) ||
      paceValue.seconds < 0 ||
      paceValue.seconds >= 60
    ) {
      this.addErrorStyle();
      return false;
    }
    return true;
  }
}

class PaceConverter {
  static convertToKmh(paceType, paceValue, minutes, seconds) {
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

  static convertKmhToMph(kmh) {
    return kmh * 0.621371;
  }

  static convertKmhToMinKm(kmh) {
    const paceInMinutes = 60 / kmh;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes % 1) * 60);
    return { minutes, seconds };
  }

  static convertKmhToMinMile(kmh) {
    const mph = this.convertKmhToMph(kmh);
    const paceInMinutes = 60 / mph;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes % 1) * 60);
    return { minutes, seconds };
  }

  static calculateTimeFromSpeed(speedKmh, distanceKm) {
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
}

// Initialize the calculator when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new PaceCalculator();
  });
}

// Add some utility functions for testing
if (typeof window !== 'undefined') {
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
}

// Export classes for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PaceCalculator,
    InputElementManager,
    PaceInputElement,
    TimeInputElement,
    PaceConverter,
  };
}
