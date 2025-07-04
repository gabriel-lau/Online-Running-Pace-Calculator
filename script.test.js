// Mock DOM elements for testing
const mockDOM = () => {
    const mockElement = (id) => ({
        id,
        value: '',
        textContent: '',
        style: { display: 'block' },
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        },
        addEventListener: jest.fn(),
        parentNode: {
            insertBefore: jest.fn()
        },
        nextSibling: null,
        scrollIntoView: jest.fn(),
        remove: jest.fn()
    });

    global.document = {
        getElementById: jest.fn((id) => mockElement(id)),
        createElement: jest.fn(() => mockElement('mock-element')),
        addEventListener: jest.fn()
    };
};

// Test utilities
const createMockCalculator = () => {
    mockDOM();

    // Mock the PaceCalculator class
    class MockPaceCalculator {
        constructor() {
            this.paceTypeSelect = document.getElementById('pace-type');
            this.paceValueInput = document.getElementById('pace-value');
            this.minutesInput = document.getElementById('minutes');
            this.secondsInput = document.getElementById('seconds');
            this.distances = {
                '2.4km': 2.4,
                '5km': 5,
                '10km': 10,
                'half': 21.1,
                'full': 42.2
            };
        }

        convertToKmh(paceType, paceValue, minutes = 0, seconds = 0) {
            switch (paceType) {
                case 'kmh':
                    return paceValue;
                case 'mph':
                    return paceValue * 1.60934;
                case 'min-km':
                    const totalMinutesPerKm = minutes + (seconds / 60);
                    return 60 / totalMinutesPerKm;
                case 'min-mile':
                    const totalMinutesPerMile = minutes + (seconds / 60);
                    const kmhFromMile = 60 / totalMinutesPerMile;
                    return kmhFromMile * 1.60934;
                default:
                    return 0;
            }
        }

        calculateTimeFromSpeed(speedKmh, distanceKm) {
            const timeInHours = distanceKm / speedKmh;
            const totalMinutes = timeInHours * 60;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const seconds = Math.floor((totalMinutes % 1) * 60);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }

    return new MockPaceCalculator();
};

describe('Running Pace Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = createMockCalculator();
    });

    describe('Pace Conversion', () => {
        test('converts km/h correctly', () => {
            expect(calculator.convertToKmh('kmh', 10)).toBe(10);
        });

        test('converts mph to km/h correctly', () => {
            const result = calculator.convertToKmh('mph', 10);
            expect(result).toBeCloseTo(16.0934, 3);
        });

        test('converts min/km to km/h correctly', () => {
            const result = calculator.convertToKmh('min-km', 0, 5, 0); // 5 minutes per km
            expect(result).toBe(12); // 60/5 = 12 km/h
        });

        test('converts min/mile to km/h correctly', () => {
            const result = calculator.convertToKmh('min-mile', 0, 8, 0); // 8 minutes per mile
            expect(result).toBeCloseTo(12.07, 1);
        });

        test('handles seconds in min/km conversion', () => {
            const result = calculator.convertToKmh('min-km', 0, 4, 30); // 4:30 per km
            expect(result).toBeCloseTo(13.33, 2);
        });
    });

    describe('Time Calculation', () => {
        test('calculates time for 5km at 10 km/h', () => {
            const result = calculator.calculateTimeFromSpeed(10, 5);
            expect(result).toBe('30:00');
        });

        test('calculates time for marathon at 12 km/h', () => {
            const result = calculator.calculateTimeFromSpeed(12, 42.2);
            expect(result).toBe('3:31:00');
        });

        test('calculates time for 10km at 15 km/h', () => {
            const result = calculator.calculateTimeFromSpeed(15, 10);
            expect(result).toBe('40:00');
        });

        test('handles fractional minutes correctly', () => {
            const result = calculator.calculateTimeFromSpeed(8, 2.4);
            expect(result).toBe('18:00');
        });
    });

    describe('Edge Cases', () => {
        test('handles zero pace value', () => {
            expect(calculator.convertToKmh('kmh', 0)).toBe(0);
        });

        test('handles zero minutes and seconds', () => {
            expect(calculator.convertToKmh('min-km', 0, 0, 0)).toBe(Infinity);
        });

        test('handles very fast pace', () => {
            const result = calculator.calculateTimeFromSpeed(25, 5);
            expect(result).toBe('12:00');
        });

        test('handles very slow pace', () => {
            const result = calculator.calculateTimeFromSpeed(5, 5);
            expect(result).toBe('1:00:00');
        });
    });

    describe('Distance Calculations', () => {
        test('calculates correct times for all distances', () => {
            const speed = 12; // km/h

            expect(calculator.calculateTimeFromSpeed(speed, 2.4)).toBe('12:00');
            expect(calculator.calculateTimeFromSpeed(speed, 5)).toBe('25:00');
            expect(calculator.calculateTimeFromSpeed(speed, 10)).toBe('50:00');
            expect(calculator.calculateTimeFromSpeed(speed, 21.1)).toBe('1:45:30');
            expect(calculator.calculateTimeFromSpeed(speed, 42.2)).toBe('3:31:00');
        });
    });
});

describe('Utility Functions', () => {
    const utils = {
        convertMilesToKm: (miles) => miles * 1.60934,
        convertKmToMiles: (km) => km / 1.60934,
        convertMinutesToSeconds: (minutes) => minutes * 60,
        formatTime: (totalMinutes) => {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const seconds = Math.floor((totalMinutes % 1) * 60);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    };

    test('converts miles to km correctly', () => {
        expect(utils.convertMilesToKm(1)).toBeCloseTo(1.60934, 4);
        expect(utils.convertMilesToKm(26.2)).toBeCloseTo(42.165, 2);
    });

    test('converts km to miles correctly', () => {
        expect(utils.convertKmToMiles(1.60934)).toBeCloseTo(1, 4);
        expect(utils.convertKmToMiles(42.2)).toBeCloseTo(26.22, 2);
    });

    test('converts minutes to seconds correctly', () => {
        expect(utils.convertMinutesToSeconds(1)).toBe(60);
        expect(utils.convertMinutesToSeconds(2.5)).toBe(150);
    });

    test('formats time correctly', () => {
        expect(utils.formatTime(30)).toBe('30:00');
        expect(utils.formatTime(90)).toBe('1:30:00');
        expect(utils.formatTime(125.5)).toBe('2:05:30');
    });
});
