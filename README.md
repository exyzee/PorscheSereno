<p align="center">
  <img src="/docs/banner.jpg" alt="Sereno Dashboard Banner" width="100%" />
</p>

<h1 align="center">Sereno Dashboard</h1>
<p align="center"><b>IXD 2 Project, by Jha</b></p>
<p align="center">
  <b>A modern, interactive driving dashboard for navigation, simulation, and stress-free journeys.</b>
</p>
<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#faq">FAQ</a>
</p>

---

## 🚗 What is Sereno?

Sereno Dashboard is a next-generation driving simulation and navigation dashboard. It combines real-time map navigation, traffic monitoring, and built-in stress management tools (like breathing exercises) to help drivers stay focused, calm, and informed—whether you're on the road or just simulating a drive.

---

## ✨ Features

- **Interactive Map Navigation:** Explore routes and locations with a beautiful Mapbox-powered map.
- **Real-Time Driving Simulator:** Simulate driving conditions, speed, and traffic in a realistic dashboard.
- **Traffic Condition Monitoring:** Instantly see traffic status and get smart route suggestions.
- **Breathing Exercise Widget:** Take a calming breath right from your dashboard when traffic gets stressful.
- **Analytics & Speed Control:** Track your driving patterns and get insights (with optional Google Analytics).
- **Modern UI:** Inspired by in-car systems, with a clean, responsive, and touch-friendly design.

---

## 🖼️ Screenshots

<p align="center">
  <img src="/docs/ss1.png" alt="Sereno Dashboard Screenshot" width="80%" />
  <br/>
  <img src="/docs/ss2.png" alt="Breathing Widget Screenshot" width="80%" />
</p>

---

## 🚀 Getting Started

> **For class/demo use:**
> This project is ready to run as-is! All required tokens are included for demonstration purposes. Just clone, install, and start.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/exyzee/Sereno---Dashboard-1.git
   cd Sereno---Dashboard-1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## ⚙️ Environment Variables

A working `.env` file is already included for class/demo use. Here are the values:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoic3VuZGFyYW1qIiwiYSI6ImNsd2F5d2F5d2F5d2F5In0.eyJ1Ijoic3VuZGFyYW1qIiwiYSI6ImNsd2F5d2F5d2F5d2F5In0
VITE_API_URL=http://localhost:8000
VITE_ENABLE_ANALYTICS=true
VITE_GA_MEASUREMENT_ID=G-T1WKSPHLCR
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

- **Mapbox:** Token included for demo/class use.
- **Google Analytics:** Demo measurement ID included.
- **Spotify:** You can use your own credentials if you want music integration.

---

## 🗂 Project Structure

```
src/
  components/      # Reusable UI widgets and controls
  pages/           # Main app pages (Map, Dashboard, Profile, etc.)
  assets/          # Images, icons, and media
  layout/          # Layout components (sidebars, wrappers)
  utils/           # Utility functions (e.g., Spotify auth)
  types.d.ts       # TypeScript types
  App.tsx          # Main app entry
  main.tsx         # App bootstrap and analytics
```

---

## 🛠️ Scripts

- `npm run dev` — Start the dev server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the code
- `npm run type-check` — TypeScript type checking

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Mapbox](https://www.mapbox.com/) for maps
- [Material-UI](https://mui.com/) for UI components
- [React](https://react.dev/) for the framework
- [Spotify](https://developer.spotify.com/) for music integration

---

<p align="center"><i>Made with ❤️ for IXD 2 by Jha</i></p> 