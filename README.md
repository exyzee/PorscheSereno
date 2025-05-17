# Sereno Dashboard

A modern driving simulation dashboard that integrates real-time navigation, traffic monitoring, and stress management features.

## Features

- 🗺️ Interactive Map Navigation
- 🚗 Real-time Driving Simulation
- 🚦 Traffic Condition Monitoring
- 🧘‍♂️ Breathing Exercise Widget
- 📊 Speed Control and Analytics

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Mapbox GL JS
- Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Mapbox API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/exyzee/Sereno---Dashboard.git
cd Sereno---Dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Mapbox token:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BreathingWidget.tsx
│   └── DrivingSimulator.tsx
├── pages/              # Page components
│   └── MapContent.tsx
├── assets/            # Static assets
│   ├── breathing.mov
│   └── widget-bg.mp4
├── styles/            # CSS/SCSS files
└── types/             # TypeScript type definitions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mapbox for the mapping platform
- Material-UI for the component library
- React team for the amazing framework 