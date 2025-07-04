class PaceCalculator {
    constructor() {
        this.paceTypeSelect = document.getElementById('pace-type');
        this.paceValueInput = document.getElementById('pace-value');
        this.paceUnitSpan = document.getElementById('pace-unit');
        this.timeInputsDiv = document.getElementById('time-inputs');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');

        this.distances = {
            '2.4km': 2.4,
            '5km': 5,
            '10km': 10,
            'half': 21.1,
            'full': 42.2
        };

        this.initEventListeners();
    }

    initEventListeners() {
        this.paceTypeSelect.addEventListener('change', () => this.updatePaceInputs());
        this.calculateBtn.addEventListener('click', () => this.calculateRaceTimes());

        // Enter key support
        this.paceValueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculateRaceTimes();
        });

        this.minutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculateRaceTimes();
        });

        this.secondsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculateRaceTimes();
        });
    }

    updatePaceInputs() {
        const paceType = this.paceTypeSelect.value;

        if (paceType === 'min-km' || paceType === 'min-mile') {
            this.paceValueInput.style.display = 'none';
            this.paceUnitSpan.style.display = 'none';
            this.timeInputsDiv.style.display = 'grid';
        } else {
            this.paceValueInput.style.display = 'block';
            this.paceUnitSpan.style.display = 'inline-block';
            this.timeInputsDiv.style.display = 'none';

            // Update unit text
            switch (paceType) {
                case 'kmh':
                    this.paceUnitSpan.textContent = 'km/h';
                    break;
                case 'mph':
                    this.paceUnitSpan.textContent = 'mph';
                    break;
            }
        }
    }

    validateInputs() {
        const paceType = this.paceTypeSelect.value;
        let isValid = true;

        // Remove previous error styles
        this.paceValueInput.classList.remove('input-error');
        this.minutesInput.classList.remove('input-error');
        this.secondsInput.classList.remove('input-error');

        if (paceType === 'min-km' || paceType === 'min-mile') {
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;

            if (minutes === 0 && seconds === 0) {
                this.minutesInput.classList.add('input-error');
                this.secondsInput.classList.add('input-error');
                isValid = false;
            }
        } else {
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
            case 'kmh':
                {
                    return paceValue;
                }
            case 'mph':
                {
                    return paceValue * 1.60934; // mph to km/h
                }

            case 'min-km':
                {
                    const totalMinutesPerKm = minutes + (seconds / 60);
                    return 60 / totalMinutesPerKm; // Convert min/km to km/h
                }

            case 'min-mile':
                {
                    const totalMinutesPerMile = minutes + (seconds / 60);
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

        const paceType = this.paceTypeSelect.value;
        const paceValue = parseFloat(this.paceValueInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

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
            block: 'start'
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

    convertMilesToKm: (miles) => miles * 1.60934,
    convertKmToMiles: (km) => km / 1.60934,
    convertMinutesToSeconds: (minutes) => minutes * 60,
    formatTime: (totalMinutes) => {
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
    }
};
