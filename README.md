# 🌤️ WeatherPro

**Advanced weather insights at your fingertips**

A modern, responsive weather application built with Next.js 15, featuring real-time weather data, location-based forecasts, and a beautiful glassmorphic UI design.

![WeatherPro Screenshot](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Weather Data** - Current conditions with detailed metrics
- **5-Day Forecast** - Extended weather predictions with visual icons
- **Location Services** - Automatic geolocation detection with fallback
- **Global Search** - Search weather for cities worldwide with autocomplete
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 🎨 User Experience
- **Glassmorphic UI** - Modern glass-effect design with backdrop blur
- **Smooth Animations** - Fluid transitions and hover effects
- **Dark Theme** - Beautiful gradient backgrounds with excellent contrast
- **Interactive Elements** - Hover states and micro-interactions
- **Loading States** - Elegant loading animations and error handling

### 📊 Weather Metrics
- Temperature (current and "feels like")
- Humidity and dew point
- Wind speed and direction
- Atmospheric pressure
- UV index with color coding
- Visibility range
- Sunrise and sunset times

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myweather
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5.x** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework

### Icons & UI
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable UI components

### Development Tools
- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing

## 📁 Project Structure

```
myweather/
├── app/
│   ├── actions/
│   │   └── weatherActions.ts    # Server actions for weather API
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Main weather app component
│   └── favicon.ico             # App favicon
├── public/
│   ├── manifest.json           # PWA manifest
│   └── *.svg                   # Static assets and icons
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

## 🎮 Usage

### Search for Weather
1. Use the search bar to enter any city name
2. Select from autocomplete suggestions
3. Press Enter or click the Search button

### Use Current Location
1. Click the "My Location" button
2. Allow location access when prompted
3. Weather data will automatically load for your area

### View Detailed Information
- **Current Conditions**: Temperature, humidity, wind, pressure
- **Extended Forecast**: 5-day weather predictions
- **Sun Times**: Sunrise and sunset information
- **Air Quality**: UV index with safety indicators

## 🔧 Configuration

### Environment Setup
The app currently uses mock data for demonstration. To integrate with a real weather API:

1. **Choose a Weather API Provider**
   - OpenWeatherMap
   - WeatherAPI
   - AccuWeather

2. **Update Weather Actions**
   ```typescript
   // app/actions/weatherActions.ts
   export async function getCurrentWeather(city: string) {
     // Replace mock data with actual API calls
   }
   ```

3. **Add Environment Variables**
   ```bash
   # .env.local
   WEATHER_API_KEY=your_api_key_here
   WEATHER_API_URL=https://api.provider.com
   ```

## 📱 Responsive Design

WeatherPro is fully responsive across all device sizes:

- **Mobile (320px+)**: Optimized touch interface
- **Tablet (768px+)**: Enhanced layout with better spacing
- **Desktop (1024px+)**: Full sidebar layout with detailed metrics
- **Large Screens (1440px+)**: Maximum content width with centered layout

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-blue-500 to-indigo-500`)
- **Secondary**: Emerald green (`from-green-500 to-emerald-500`)
- **Background**: Dark gradient (`from-slate-900 via-blue-900 to-indigo-900`)
- **Glass Effects**: White with opacity (`bg-white/5`, `bg-white/10`)

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts with proper contrast
- **Data**: Monospace for numerical values

## 🚀 Deployment

### Netlify (Recommended)
The project includes `netlify.toml` configuration:

```bash
npm run build
# Deploy to Netlify
```

### Vercel
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## 🔄 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Weather Data Providers** - For making weather information accessible

---

**Built with ❤️ using Next.js 15 and modern web technologies**
