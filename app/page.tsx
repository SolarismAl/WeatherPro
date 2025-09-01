"use client";

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Eye, Droplets, Thermometer, Gauge, Sunrise, Sunset, MapPin, Search, RefreshCw, AlertCircle, ChevronDown, TrendingUp, Navigation } from 'lucide-react';
import { getCurrentWeather, getCurrentWeatherByCoords } from '../lib/weatherService';

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  pressure: number;
  feelsLike: number;
  dewPoint: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Butuan, Philippines');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock data for demonstration
  const mockWeatherData: WeatherData = {
    location: 'Butuan',
    country: 'Philippines',
    temperature: 28,
    condition: 'Partly Cloudy',
    description: 'Pleasant with some clouds',
    humidity: 72,
    windSpeed: 8,
    windDirection: 'NE',
    visibility: 10,
    uvIndex: 6,
    pressure: 1013,
    feelsLike: 31,
    dewPoint: 22,
    sunrise: '6:12 AM',
    sunset: '6:45 PM',
    forecast: [
      { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy', icon: 'sun' },
      { day: 'Tue', high: 32, low: 25, condition: 'Sunny', icon: 'sun' },
      { day: 'Wed', high: 29, low: 23, condition: 'Rain', icon: 'rain' },
      { day: 'Thu', high: 27, low: 22, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Fri', high: 31, low: 26, condition: 'Sunny', icon: 'sun' }
    ]
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationPermission('granted');
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationPermission('denied');
        // Fallback to default location
        fetchWeatherData('Butuan, Philippines');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Popular cities for search suggestions
  const popularCities = [
    'Manila, Philippines', 'Cebu, Philippines', 'Davao, Philippines', 'Quezon City, Philippines',
    'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France', 'Sydney, Australia',
    'Singapore', 'Hong Kong', 'Seoul, South Korea', 'Bangkok, Thailand', 'Dubai, UAE'
  ];

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    
    if (value.trim().length > 0) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (city: string) => {
    setSearchInput(city);
    setShowSuggestions(false);
    fetchWeatherData(city);
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeatherByCoords(lat, lon);
      setWeatherData(data);
      setLocation(`${data.location}, ${data.country}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather(cityName);
      setWeatherData(data);
      setLocation(cityName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get user's location first
    getUserLocation();
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      fetchWeatherData(searchInput);
      setSearchInput('');
      setIsSearchFocused(false);
      setShowSuggestions(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'cloud': return <Cloud className="w-5 h-5 text-gray-400" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCurrentWeatherIcon = () => {
    if (!weatherData) return <Cloud className="w-20 h-20 text-gray-300 opacity-60" />;
    return <Sun className="w-20 h-20 text-amber-400 animate-pulse" />;
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-400 bg-green-400/20';
    if (uvIndex <= 5) return 'text-yellow-400 bg-yellow-400/20';
    if (uvIndex <= 7) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-16 text-center shadow-2xl">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-blue-300 animate-spin mx-auto mb-6" />
            <div className="absolute -inset-4 bg-blue-400/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">Fetching Weather</h2>
          <p className="text-blue-200/80">Getting the latest conditions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center max-w-md shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-white text-2xl font-semibold mb-3">Service Unavailable</h2>
          <p className="text-blue-200/80 mb-8">{error}</p>
          <button
            onClick={() => fetchWeatherData(location)}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-2xl text-white font-medium transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 transition-all duration-1000">
      <div className="max-w-7xl mx-auto">
        {/* Floating Header */}
        <div className="text-center mb-10 pt-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              WeatherPro
            </h1>
          </div>
          <p className="text-blue-200/80 text-lg font-medium">Advanced weather insights at your fingertips</p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-10 shadow-2xl transition-all duration-300 hover:bg-white/10">
          <div className="flex gap-4 items-center">
            <div className={`relative flex-1 transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isSearchFocused ? 'text-blue-400' : 'text-white/60'}`} />
              <input
                type="text"
                placeholder="Search cities worldwide..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking
                  setTimeout(() => {
                    setIsSearchFocused(false);
                    setShowSuggestions(false);
                  }, 200);
                }}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-lg"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {searchSuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(city)}
                      className="px-6 py-3 text-white hover:bg-white/10 cursor-pointer transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl flex items-center gap-3 group"
                    >
                      <MapPin className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span className="group-hover:text-blue-100">{city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={getUserLocation}
              className="group px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
              title="Use my location"
            >
              <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              My Location
            </button>
            <button
              onClick={handleSearch}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Search
            </button>
          </div>
          
          {/* Location Status */}
          {locationPermission === 'granted' && userLocation && (
            <div className="mt-4 flex items-center gap-2 text-green-300 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Using your current location
            </div>
          )}
          {locationPermission === 'denied' && (
            <div className="mt-4 flex items-center gap-2 text-yellow-300 text-sm">
              <AlertCircle className="w-4 h-4" />
              Location access denied - showing default location
            </div>
          )}
        </div>

        {weatherData && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Weather Display */}
            <div className="xl:col-span-3 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl transition-all duration-500 hover:bg-white/10">
              {/* Location Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{weatherData.location}</h2>
                    <p className="text-blue-200/80 text-lg">{weatherData.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-200/60 text-sm">Last updated</p>
                  <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Current Temperature Display */}
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-light text-white transition-all duration-700">
                      {weatherData.temperature}°
                    </span>
                    <span className="text-2xl text-blue-200/80 font-medium">C</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl text-white font-semibold">{weatherData.condition}</h3>
                    <p className="text-blue-200/80 text-lg">{weatherData.description}</p>
                    <p className="text-blue-300/80">Feels like {weatherData.feelsLike}°C</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    {getCurrentWeatherIcon()}
                    <div className="absolute -inset-8 bg-amber-400/10 rounded-full blur-xl animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-center transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="text-blue-200/80 text-sm font-medium mb-3">{day.day}</p>
                      <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {getWeatherIcon(day.icon)}
                      </div>
                      <div className="space-y-1">
                        <div className="text-white font-bold text-lg">{day.high}°</div>
                        <div className="text-blue-300/80 text-sm">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Details Sidebar */}
            <div className="space-y-6">
              {/* Current Conditions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl transition-all duration-300 hover:bg-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  Current Conditions
                </h3>
                <div className="space-y-5">
                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Droplets className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-blue-200/90">Humidity</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.humidity}%</span>
                  </div>
                  
                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Wind className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-blue-200/90">Wind</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.windSpeed} km/h {weatherData.windDirection}</span>
                  </div>

                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Eye className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-blue-200/90">Visibility</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.visibility} km</span>
                  </div>

                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Gauge className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-blue-200/90">Pressure</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.pressure} hPa</span>
                  </div>

                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 ${getUVIndexColor(weatherData.uvIndex)}`}>
                        <Sun className="w-4 h-4" />
                      </div>
                      <span className="text-blue-200/90">UV Index</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getUVIndexColor(weatherData.uvIndex)}`}>
                        {weatherData.uvIndex}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sun & Moon Times */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl transition-all duration-300 hover:bg-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sunrise className="w-5 h-5 text-orange-400" />
                  Sun & Moon
                </h3>
                <div className="space-y-5">
                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Sunrise className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-blue-200/90">Sunrise</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.sunrise}</span>
                  </div>
                  
                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Sunset className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-blue-200/90">Sunset</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.sunset}</span>
                  </div>

                  <div className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-blue-200/90">Dew Point</span>
                    </div>
                    <span className="text-white font-bold">{weatherData.dewPoint}°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Footer */}
        <div className="text-center mt-16 pb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-blue-200/80 font-medium">Weather data updated in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}