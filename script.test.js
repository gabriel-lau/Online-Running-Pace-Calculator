/**
 * @jest-environment jsdom
 */

// Import real classes from script.js
const {
  PaceCalculator,
  InputElementManager,
  PaceInputElement,
  TimeInputElement,
  PaceConverter,
} = require('./script.js');

// Mock DOM elements for testing
const createMockElement = (id = 'test-element') => ({
  id,
  value: '',
  textContent: '',
  style: { display: 'none' },
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  addEventListener: jest.fn(),
  parentNode: {
    insertBefore: jest.fn(),
  },
  nextSibling: null,
  scrollIntoView: jest.fn(),
  remove: jest.fn(),
});

const setupMockDOM = () => {
  // Mock all the DOM elements that the real classes expect
  const mockElements = {
    'calculate-btn': createMockElement('calculate-btn'),
    'results-section': createMockElement('results-section'),
    'pace-value-kmh': createMockElement('pace-value-kmh'),
    'pace-value-mph': createMockElement('pace-value-mph'),
    'minutes-min-km': createMockElement('minutes-min-km'),
    'seconds-min-km': createMockElement('seconds-min-km'),
    'minutes-min-mile': createMockElement('minutes-min-mile'),
    'seconds-min-mile': createMockElement('seconds-min-mile'),
    'time-2-4km': createMockElement('time-2-4km'),
    'time-5km': createMockElement('time-5km'),
    'time-10km': createMockElement('time-10km'),
    'time-half': createMockElement('time-half'),
    'time-full': createMockElement('time-full'),
  };

  // Use document.getElementById spy instead of replacing the whole document
  jest.spyOn(document, 'getElementById').mockImplementation(id => {
    return mockElements[id] || null;
  });

  jest
    .spyOn(document, 'createElement')
    .mockImplementation(() => createMockElement('created-element'));

  return mockElements;
};

describe('PaceConverter (Real Implementation)', () => {
  describe('convertToKmh', () => {
    test('converts km/h correctly (identity)', () => {
      expect(PaceConverter.convertToKmh('kmh', 10)).toBe(10);
    });

    test('converts mph to km/h correctly', () => {
      const result = PaceConverter.convertToKmh('mph', 10);
      expect(result).toBeCloseTo(16.0934, 3);
    });

    test('converts min/km to km/h correctly', () => {
      const result = PaceConverter.convertToKmh('min-km', 0, 5, 0); // 5 minutes per km
      expect(result).toBe(12); // 60/5 = 12 km/h
    });

    test('converts min/mile to km/h correctly', () => {
      const result = PaceConverter.convertToKmh('min-mile', 0, 8, 0); // 8 minutes per mile
      expect(result).toBeCloseTo(12.07, 1);
    });

    test('handles seconds in min/km conversion', () => {
      const result = PaceConverter.convertToKmh('min-km', 0, 4, 30); // 4:30 per km
      expect(result).toBeCloseTo(13.33, 2);
    });

    test('handles zero values', () => {
      expect(PaceConverter.convertToKmh('kmh', 0)).toBe(0);
      expect(PaceConverter.convertToKmh('min-km', 0, 0, 0)).toBe(Infinity);
    });

    test('handles unknown pace type', () => {
      expect(PaceConverter.convertToKmh('unknown', 10)).toBe(0);
    });
  });

  describe('convertKmhToMph', () => {
    test('converts km/h to mph correctly', () => {
      expect(PaceConverter.convertKmhToMph(16.0934)).toBeCloseTo(10, 3);
      expect(PaceConverter.convertKmhToMph(0)).toBe(0);
    });
  });

  describe('convertKmhToMinKm', () => {
    test('converts km/h to min/km correctly', () => {
      const result = PaceConverter.convertKmhToMinKm(12);
      expect(result.minutes).toBe(5);
      expect(result.seconds).toBe(0);
    });

    test('handles fractional minutes', () => {
      const result = PaceConverter.convertKmhToMinKm(13.33);
      expect(result.minutes).toBe(4);
      expect(result.seconds).toBe(30);
    });
  });

  describe('convertKmhToMinMile', () => {
    test('converts km/h to min/mile correctly', () => {
      const result = PaceConverter.convertKmhToMinMile(12.07);
      expect(result.minutes).toBe(8);
      expect(result.seconds).toBeCloseTo(0, 0);
    });
  });

  describe('calculateTimeFromSpeed', () => {
    test('calculates time for 5km at 10 km/h', () => {
      const result = PaceConverter.calculateTimeFromSpeed(10, 5);
      expect(result).toBe('30:00');
    });

    test('calculates time for marathon at 12 km/h', () => {
      const result = PaceConverter.calculateTimeFromSpeed(12, 42.2);
      expect(result).toBe('3:31:00');
    });

    test('calculates time for 10km at 15 km/h', () => {
      const result = PaceConverter.calculateTimeFromSpeed(15, 10);
      expect(result).toBe('40:00');
    });

    test('handles 2.4km at 12 km/h precision case', () => {
      const result = PaceConverter.calculateTimeFromSpeed(12, 2.4);
      expect(result).toBe('12:00');
    });

    test('handles very fast and slow paces', () => {
      expect(PaceConverter.calculateTimeFromSpeed(25, 5)).toBe('12:00');
      expect(PaceConverter.calculateTimeFromSpeed(5, 5)).toBe('1:00:00');
    });
  });
});

describe('PaceInputElement (Real Implementation)', () => {
  let mockElements, mockManager, paceInputElement;

  beforeEach(() => {
    mockElements = setupMockDOM();
    mockManager = {
      setSelectedPaceType: jest.fn(),
      autoConvertInputs: jest.fn(),
      triggerCalculateRaceTimes: jest.fn(),
    };
    paceInputElement = new PaceInputElement('kmh', mockElements['pace-value-kmh'], mockManager);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes correctly', () => {
    expect(paceInputElement.getType()).toBe('kmh');
    expect(paceInputElement.element).toBe(mockElements['pace-value-kmh']);
    expect(paceInputElement.manager).toBe(mockManager);
  });

  test('sets up event listeners', () => {
    expect(mockElements['pace-value-kmh'].addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
    expect(mockElements['pace-value-kmh'].addEventListener).toHaveBeenCalledWith(
      'input',
      expect.any(Function)
    );
    expect(mockElements['pace-value-kmh'].addEventListener).toHaveBeenCalledWith(
      'keypress',
      expect.any(Function)
    );
  });

  test('getPace returns pace value', () => {
    mockElements['pace-value-kmh'].value = '10.5';
    const pace = paceInputElement.getPace();
    expect(pace.pace).toBe(10.5);
  });

  test('setPace sets element value', () => {
    paceInputElement.setPace(12.5);
    expect(mockElements['pace-value-kmh'].value).toBe(12.5);
  });

  test('validates input correctly', () => {
    mockElements['pace-value-kmh'].value = '10';
    expect(paceInputElement.validateInput()).toBe(true);

    mockElements['pace-value-kmh'].value = '0';
    expect(paceInputElement.validateInput()).toBe(false);

    mockElements['pace-value-kmh'].value = '';
    expect(paceInputElement.validateInput()).toBe(false);
  });

  test('adds and removes styles', () => {
    paceInputElement.addSelectedStyle();
    expect(mockElements['pace-value-kmh'].classList.add).toHaveBeenCalledWith('input-selected');

    paceInputElement.removeSelectedStyle();
    expect(mockElements['pace-value-kmh'].classList.remove).toHaveBeenCalledWith('input-selected');

    paceInputElement.addErrorStyle();
    expect(mockElements['pace-value-kmh'].classList.add).toHaveBeenCalledWith('input-error');

    paceInputElement.removeErrorStyle();
    expect(mockElements['pace-value-kmh'].classList.remove).toHaveBeenCalledWith('input-error');
  });
});

describe('TimeInputElement (Real Implementation)', () => {
  let mockElements, mockManager, timeInputElement;

  beforeEach(() => {
    mockElements = setupMockDOM();
    mockManager = {
      setSelectedPaceType: jest.fn(),
      autoConvertInputs: jest.fn(),
      triggerCalculateRaceTimes: jest.fn(),
    };
    timeInputElement = new TimeInputElement(
      'min-km',
      mockElements['minutes-min-km'],
      mockElements['seconds-min-km'],
      mockManager
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes correctly', () => {
    expect(timeInputElement.getType()).toBe('min-km');
    expect(timeInputElement.element1).toBe(mockElements['minutes-min-km']);
    expect(timeInputElement.element2).toBe(mockElements['seconds-min-km']);
  });

  test('getPace returns minutes and seconds', () => {
    mockElements['minutes-min-km'].value = '4';
    mockElements['seconds-min-km'].value = '30';
    const pace = timeInputElement.getPace();
    expect(pace.minutes).toBe(4);
    expect(pace.seconds).toBe(30);
  });

  test('setPace sets both element values', () => {
    timeInputElement.setPace(5, 45);
    expect(mockElements['minutes-min-km'].value).toBe(5);
    expect(mockElements['seconds-min-km'].value).toBe(45);
  });

  test('validates input correctly', () => {
    mockElements['minutes-min-km'].value = '4';
    mockElements['seconds-min-km'].value = '30';
    expect(timeInputElement.validateInput()).toBe(true);

    mockElements['minutes-min-km'].value = '0';
    expect(timeInputElement.validateInput()).toBe(false);

    mockElements['seconds-min-km'].value = '60';
    expect(timeInputElement.validateInput()).toBe(false);
  });
});

describe('InputElementManager (Real Implementation)', () => {
  let mockElements, paceCalculator, inputManager;

  beforeEach(() => {
    // Set up DOM before creating any instances
    mockElements = setupMockDOM();
    paceCalculator = { calculateRaceTimes: jest.fn() };
    inputManager = new InputElementManager(paceCalculator);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes with all input elements', () => {
    expect(inputManager.children).toHaveLength(4);
    expect(inputManager.children[0]).toBeInstanceOf(PaceInputElement);
    expect(inputManager.children[2]).toBeInstanceOf(TimeInputElement);
  });

  test('setSelectedPaceType works correctly', () => {
    inputManager.setSelectedPaceType('kmh');
    expect(inputManager.getSelectedPaceType()).toBe('kmh');
    expect(inputManager.selectedInput).toBe(inputManager.children[0]);
  });

  test('validateSelectedInput works', () => {
    inputManager.setSelectedPaceType('kmh');
    mockElements['pace-value-kmh'].value = '10';
    expect(inputManager.validateSelectedInput()).toBe(true);

    mockElements['pace-value-kmh'].value = '0';
    expect(inputManager.validateSelectedInput()).toBe(false);
  });
});

describe('PaceCalculator (Real Implementation)', () => {
  let mockElements, paceCalculator;

  beforeEach(() => {
    // Set up DOM before creating any instances
    mockElements = setupMockDOM();
    paceCalculator = new PaceCalculator();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes correctly', () => {
    expect(paceCalculator.distances).toEqual({
      '2.4km': 2.4,
      '5km': 5,
      '10km': 10,
      half: 21.1,
      full: 42.2,
    });
    expect(paceCalculator.inputElementManager).toBeInstanceOf(InputElementManager);
  });

  test('showError creates error message', () => {
    paceCalculator.showError('Test error');
    expect(document.createElement).toHaveBeenCalledWith('div');
  });

  test('displayResults updates result elements', () => {
    const results = {
      '2.4km': '12:00',
      '5km': '25:00',
      '10km': '50:00',
      half: '1:45:30',
      full: '3:31:00',
    };

    paceCalculator.displayResults(results);

    expect(mockElements['time-2-4km'].textContent).toBe('12:00');
    expect(mockElements['time-5km'].textContent).toBe('25:00');
    expect(mockElements['time-10km'].textContent).toBe('50:00');
    expect(mockElements['time-half'].textContent).toBe('1:45:30');
    expect(mockElements['time-full'].textContent).toBe('3:31:00');
  });
});

describe('Integration Tests', () => {
  let mockElements, paceCalculator;

  beforeEach(() => {
    // Set up DOM before creating any instances
    mockElements = setupMockDOM();
    paceCalculator = new PaceCalculator();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('full calculation workflow with kmh input', () => {
    // Set up kmh input
    mockElements['pace-value-kmh'].value = '12';
    paceCalculator.inputElementManager.setSelectedPaceType('kmh');

    // Mock the validation to return true
    jest.spyOn(paceCalculator.inputElementManager, 'validateSelectedInput').mockReturnValue(true);

    // Run calculation
    paceCalculator.calculateRaceTimes();

    // Check results were calculated and displayed
    expect(mockElements['time-2-4km'].textContent).toBe('12:00');
    expect(mockElements['time-5km'].textContent).toBe('25:00');
  });

  test('full calculation workflow with min/km input', () => {
    // Set up min/km input
    mockElements['minutes-min-km'].value = '5';
    mockElements['seconds-min-km'].value = '0';
    paceCalculator.inputElementManager.setSelectedPaceType('min-km');

    // Mock the validation to return true
    jest.spyOn(paceCalculator.inputElementManager, 'validateSelectedInput').mockReturnValue(true);

    // Run calculation
    paceCalculator.calculateRaceTimes();

    // Check results (5:00/km = 12 km/h)
    expect(mockElements['time-2-4km'].textContent).toBe('12:00');
    expect(mockElements['time-5km'].textContent).toBe('25:00');
  });

  test('handles invalid input gracefully', () => {
    mockElements['pace-value-kmh'].value = '0';
    paceCalculator.inputElementManager.setSelectedPaceType('kmh');

    paceCalculator.calculateRaceTimes();

    expect(document.createElement).toHaveBeenCalledWith('div');
  });
});
