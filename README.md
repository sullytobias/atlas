# 🗺️ Atlas - Interactive World Map

An interactive world map application built with React, TypeScript, and MapLibre GL. Click on any country to explore detailed information including capitals, population, languages, currencies, and more.

**🔗 Live Demo**: [https://yourusername.github.io/atlas/](https://yourusername.github.io/atlas/)

## ✨ Features

- 🌍 **Interactive Map** - Click on any country to view detailed information
- 🛰️ **Multiple Base Layers** - Switch between satellite imagery and standard map view
- 🏛️ **Capital Cities** - Toggle capital city markers and labels
- 🌊 **Coastlines** - Show/hide country borders and coastlines
- 🎨 **Country Highlighting** - Hover over countries for visual feedback
- 📊 **Rich Data** - View population, area, languages, currencies, and more
- 🎯 **Responsive UI** - Clean drawer interface for layer controls

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/atlas.git
cd atlas

# Install dependencies
npm install

# Generate capital cities data
npm run generate:data

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **MapLibre GL** - Map rendering engine
- **Vite** - Build tool and dev server
- **REST Countries API** - Country data source

## 📁 Project Structure

```
atlas/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages deployment
├── src/
│   ├── components/
│   │   ├── Map.tsx              # Main map component
│   │   ├── LayerToggles.tsx     # Layer control drawer
│   │   └── InfoBanner.tsx       # User info banner
│   ├── config/
│   │   ├── mapSources.ts        # Map data sources
│   │   └── mapLayers.ts         # Map layer definitions
│   ├── hooks/
│   │   ├── useMapInstance.ts    # Map initialization hook
│   │   └── useLayerVisibility.ts # Layer toggle hook
│   ├── data/
│   │   └── data.json            # Capital cities data (generated)
│   ├── styles/
│   │   ├── index.css
│   │   └── map.css
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── generateData.ts          # Data generation script
├── vite.config.ts
└── package.json
```

## 🎮 Usage

### Map Controls

1. **Pan** - Click and drag to move around the map
2. **Zoom** - Scroll or pinch to zoom in/out
3. **Click Country** - Click any country to view detailed information popup
4. **Hover** - Hover over countries to see highlight effect

### Layer Controls

Click the hamburger menu (☰) in the top-right corner to toggle:

- **Satellite View** - Switch between satellite imagery and standard map
- **Coastlines** - Show/hide country borders
- **Show Capitals** - Display capital city markers and labels

### Country Information

Click any country to see:
- 🏛️ Capital city name
- 👥 Population
- 📏 Total area (km²)
- 🗣️ Languages spoken
- 💰 Currencies used
- 🚗 Driving side (left/right)
- 🌍 Continent

## 📦 Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run generate:data # Fetch and generate capital cities data
```

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Setup

1. **Update `vite.config.ts`**:
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/atlas/', // Replace 'atlas' with your repo name
   })
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", select **GitHub Actions** as the source

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy your app
   - Your site will be live at `https://yourusername.github.io/atlas/`

### Manual Deployment

You can also trigger deployment manually:
- Go to **Actions** tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

## 🌐 Data Sources

- **Base Maps**: 
  - [OpenStreetMap](https://www.openstreetmap.org) - Standard map tiles
  - [ArcGIS World Imagery](https://www.arcgis.com) - Satellite imagery
- **Vector Data**: [MapLibre Demo Tiles](https://demotiles.maplibre.org/)
- **Country Data**: [REST Countries API](https://restcountries.com/v3.1/)

## 🔄 Updating Country Data

The capital cities data is fetched from REST Countries API. To update with the latest data:

```bash
npm run generate:data
```

This script fetches and generates a GeoJSON file containing:
- Capital coordinates
- Country flags (SVG)
- Population statistics
- Languages and currencies
- Geographic information (area, continents)
- Driving regulations

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Country name matching between vector tiles and REST Countries API may differ for some regions
- Demo tiles have limited coverage in some areas

## 🎯 Future Enhancements

- [ ] Add search functionality for countries
- [ ] Display more detailed statistics
- [ ] Add map animation/transitions
- [ ] Support for mobile gestures
- [ ] Dark mode support
- [ ] Export country data

## 👨‍💻 Author

**Tobias Sullivan**

## 🙏 Acknowledgments

- [MapLibre GL JS](https://maplibre.org/) for the amazing map library
- [REST Countries](https://restcountries.com/) for comprehensive country data
- [OpenStreetMap](https://www.openstreetmap.org/) contributors

---

Made with ❤️ using React, TypeScript, and MapLibre GL
