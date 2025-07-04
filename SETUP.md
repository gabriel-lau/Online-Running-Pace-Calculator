# Setup Guide for Running Pace Calculator

## Quick Start

1. **Test the app locally**:
   ```bash
   npm start
   ```
   Visit: http://localhost:3000

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## GitHub Setup

1. **Create a new GitHub repository**:
   - Go to GitHub and create a new repository named `running-pace-calculator`
   - Don't initialize with README (we already have one)

2. **Connect your local repository**:
   ```bash
   git remote add origin https://github.com/yourusername/running-pace-calculator.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Select "GitHub Actions" as the source
   - The app will be automatically deployed

## Features Included

✅ **Modern Web App**:
- Responsive design
- Beautiful UI with gradients
- Smooth animations
- Error handling

✅ **Multiple Pace Inputs**:
- Kilometres Per Hour (km/h)
- Miles Per Hour (mph)
- Minutes Per Kilometre (min/km)
- Minutes Per Mile (min/mile)

✅ **Race Distance Calculations**:
- 2.4km (fitness test)
- 5km (Parkrun)
- 10km
- Half Marathon (21.1km)
- Full Marathon (42.2km)

✅ **GitHub Actions CI/CD**:
- Automated testing
- Cross-platform testing (Node 16, 18, 20)
- Automatic deployment to GitHub Pages
- Code quality checks

✅ **Testing Suite**:
- Unit tests for all calculations
- Edge case handling
- Coverage reporting

## File Structure

```
running-pace-calculator/
├── index.html              # Main HTML file
├── style.css              # CSS styling
├── script.js              # JavaScript functionality
├── script.test.js         # Test suite
├── package.json           # Dependencies and scripts
├── README.md              # Documentation
├── LICENSE                # MIT License
├── .gitignore             # Git ignore rules
├── SETUP.md               # This file
└── .github/
    └── workflows/
        ├── ci.yml         # Continuous Integration
        └── deploy.yml     # Deployment workflow
```

## Customization

### Update Repository URLs
Replace `yourusername` in:
- `package.json` → repository URLs
- `README.md` → demo links
- GitHub Actions workflows (if needed)

### Modify Calculations
Edit `script.js` to:
- Add new race distances
- Change pace conversion formulas
- Add new pace input types

### Styling
Edit `style.css` to:
- Change colors (see CSS variables at top)
- Modify layout
- Add animations

## Troubleshooting

### Tests failing?
- Check Node.js version (requires 16+)
- Ensure all dependencies are installed: `npm install`

### GitHub Actions not working?
- Ensure repository has GitHub Pages enabled
- Check that workflows are in `.github/workflows/`
- Verify branch name is `main`

### App not displaying correctly?
- Check browser console for errors
- Ensure all files are in the correct location
- Test with `npm start` locally first

## Next Steps

1. Push to GitHub
2. Enable GitHub Pages
3. Share your calculator with the running community!
4. Consider adding features like:
   - Pace comparison charts
   - Training plan suggestions
   - Imperial/metric unit toggles
   - Save/load personal records

Happy running! 🏃‍♂️
