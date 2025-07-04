# Online Running Pace Calculator 🏃‍♂️
Visit the live application: [Online Running Pace Calculator](https://gabriel-lau.github.io/Online-Running-Pace-Calculator/)

A modern, responsive web application for calculating running race times based on your training pace. Built with vanilla JavaScript, HTML, and CSS, with automated deployment using GitHub Actions.

## Features

- **Multiple Pace Input Options**:
  - Kilometres Per Hour (km/h)
  - Miles Per Hour (mph)
  - Minutes Per Kilometre (min/km)
  - Minutes Per Mile (min/mile)

- **Race Distance Calculations**:
  - 2.4km (fitness test distance)
  - 5km (Parkrun)
  - 10km
  - Half Marathon (21.1km)
  - Full Marathon (42.2km)

- **Modern UI/UX**:
  - Responsive design for all devices
  - Beautiful gradient styling
  - Smooth animations
  - Error handling and validation

- **Automated CI/CD**:
  - GitHub Actions for testing and deployment
  - Automated deployment to GitHub Pages
  - Cross-platform testing


## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/running-pace-calculator.git
   cd running-pace-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. **Select your pace type** from the dropdown menu
2. **Enter your pace value**:
   - For km/h or mph: Enter a decimal number
   - For min/km or min/mile: Enter minutes and seconds separately
3. **Click "Calculate Race Times"** to see your projected times
4. **View your results** for all race distances

### Example Calculations

- **10 km/h** → 5km in 30:00, Marathon in 4:13:12
- **6 mph** → 5km in 31:04, Marathon in 4:22:24
- **5:00 min/km** → 5km in 25:00, Marathon in 3:31:00
- **8:00 min/mile** → 5km in 24:51, Marathon in 3:30:48

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with live reload
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint JavaScript code
- `npm run lint:fix` - Fix linting issues automatically

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Project Structure

```
running-pace-calculator/
├── index.html          # Main HTML file
├── style.css          # CSS styling
├── script.js          # JavaScript functionality
├── script.test.js     # Test suite
├── package.json       # Project dependencies and scripts
├── README.md          # Project documentation
├── .github/
│   └── workflows/
│       ├── ci.yml     # Continuous Integration workflow
│       └── deploy.yml # Deployment workflow
└── dist/              # Build output directory
```

## Testing

The project includes comprehensive tests covering:

- Pace conversion between different units
- Time calculations for all race distances
- Edge cases and error handling
- Utility functions

Tests are written using Jest and run automatically on every push via GitHub Actions.

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

### Setup GitHub Pages Deployment

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Select "GitHub Actions" as the source
4. The app will be automatically deployed on every push to main

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (if you have gh-pages installed)
npx gh-pages -d dist
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Styled with modern CSS Grid and Flexbox
- Automated with GitHub Actions
- Deployed on GitHub Pages

## Formula References

### Pace Conversions

- **mph to km/h**: `km/h = mph × 1.60934`
- **min/km to km/h**: `km/h = 60 ÷ minutes_per_km`
- **min/mile to km/h**: `km/h = (60 ÷ minutes_per_mile) × 1.60934`

### Time Calculations

- **Time = Distance ÷ Speed**
- **Total Minutes = (Distance in km) ÷ (Speed in km/h) × 60**

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/running-pace-calculator/issues) on GitHub.

---

Made with ❤️ for the running community
