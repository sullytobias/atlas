# 🗺️ Atlas - Interactive World Map

An interactive world map application built with React, TypeScript, and MapLibre GL. Click on any country to explore detailed information including capitals, population, languages, currencies, and more.

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
git clone <repository-url>
cd atlas

# Install dependencies
npm install

# Start development server
npm run dev
```

### Generate Capital Data

The application uses REST Countries API data. To regenerate the capital cities dataset:

```bash
npm run generate:capitals
```

This fetches the latest country data including:
- Capital cities with coordinates
- Country flags
- Population statistics
- Languages and currencies
- Geographic information

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **MapLibre GL** - Map rendering engine
- **Vite** - Build tool and dev server
- **REST Countries API** - Country data source

## 📁 Project Structure

```
atlas/
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
│   │   └── capitals.json        # Generated capital cities data
│   ├── styles/
│   │   ├── index.css
│   │   └── map.css
│   └── App.tsx
├── scripts/
│   └── generateCapitals.ts      # Data generation script
└── package.json
```

## 🎮 Usage

1. **Toggle Layers** - Click the hamburger menu (☰) in the top-right to open layer controls
2. **View Country Info** - Click on any country to see detailed information in a popup
3. **Navigate** - Use mouse/trackpad to pan and zoom the map
4. **Switch Views** - Toggle between satellite and standard map views
5. **Show Capitals** - Enable capital city markers and labels

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run generate:capitals # Generate/update capital cities data
```

## 🌐 Data Sources

- **Map Tiles**: OpenStreetMap & ArcGIS World Imagery
- **Vector Data**: MapLibre Demo Tiles
- **Country Data**: [REST Countries API](https://restcountries.com)

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Tobias Sullivan
