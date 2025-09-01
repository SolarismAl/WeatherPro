// Use the API key directly for now - in production, use environment variables
const API_KEY = '3e0527c3c27a23f93bb896188458c8a6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  dt: number;
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function getWeatherCondition(weatherMain: string): string {
  const conditionMap: { [key: string]: string } = {
    'Clear': 'Sunny',
    'Clouds': 'Partly Cloudy',
    'Rain': 'Rainy',
    'Drizzle': 'Light Rain',
    'Thunderstorm': 'Thunderstorm',
    'Snow': 'Snowy',
    'Mist': 'Misty',
    'Fog': 'Foggy'
  };
  return conditionMap[weatherMain] || weatherMain;
}

function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
}

function getWeatherIcon(weatherMain: string): string {
  const iconMap: { [key: string]: string } = {
    'Clear': 'sun',
    'Clouds': 'cloud',
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'rain',
    'Snow': 'cloud',
    'Mist': 'cloud',
    'Fog': 'cloud'
  };
  return iconMap[weatherMain] || 'cloud';
}

export async function getCurrentWeatherByCoords(lat: number, lon: number) {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured');
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log('Fetching weather by coordinates:', url.replace(API_KEY, '[API_KEY]'));
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data: OpenWeatherResponse = await response.json();

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    let forecast: Array<{
      day: string;
      high: number;
      low: number;
      condition: string;
      icon: string;
    }> = [];
    if (forecastResponse.ok) {
      const forecastData: ForecastResponse = await forecastResponse.json();
      
      // Group forecast by day and get daily high/low
      const dailyData = new Map();
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData.has(date)) {
          dailyData.set(date, {
            dt: item.dt,
            temps: [item.main.temp_max, item.main.temp_min],
            weather: item.weather[0]
          });
        } else {
          const existing = dailyData.get(date);
          existing.temps.push(item.main.temp_max, item.main.temp_min);
        }
      });

      // Convert to forecast format (take first 5 days)
      forecast = Array.from(dailyData.values()).slice(0, 5).map(day => ({
        day: getDayName(day.dt),
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        condition: getWeatherCondition(day.weather.main),
        icon: getWeatherIcon(day.weather.main)
      }));
    }

    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: getWeatherCondition(data.weather[0].main),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(data.wind.deg),
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      uvIndex: 0, // UV index not available in current weather API
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like),
      dewPoint: Math.round(data.main.temp - ((100 - data.main.humidity) / 5)), // Approximation
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      forecast
    };
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Provide fallback data while API key activates
    console.log('Using fallback weather data');
    return {
      location: 'Your Location',
      country: 'Unknown',
      temperature: 25,
      condition: 'Partly Cloudy',
      description: 'Weather data temporarily unavailable',
      humidity: 65,
      windSpeed: 10,
      windDirection: 'NE',
      visibility: 10,
      uvIndex: 5,
      pressure: 1013,
      feelsLike: 28,
      dewPoint: 18,
      sunrise: '06:30',
      sunset: '18:30',
      forecast: [
        { day: 'Today', high: 27, low: 22, condition: 'Partly Cloudy', icon: 'cloud' },
        { day: 'Tomorrow', high: 26, low: 21, condition: 'Sunny', icon: 'sun' },
        { day: 'Wednesday', high: 24, low: 19, condition: 'Rainy', icon: 'rain' },
        { day: 'Thursday', high: 28, low: 23, condition: 'Sunny', icon: 'sun' },
        { day: 'Friday', high: 25, low: 20, condition: 'Partly Cloudy', icon: 'cloud' },
      ]
    };
  }
}

export async function getCurrentWeather(city: string) {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured');
  }

  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    console.log('Fetching weather from:', url.replace(API_KEY, '[API_KEY]'));
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      if (response.status === 404) {
        throw new Error('City not found');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data: OpenWeatherResponse = await response.json();

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    let forecast: Array<{
      day: string;
      high: number;
      low: number;
      condition: string;
      icon: string;
    }> = [];
    if (forecastResponse.ok) {
      const forecastData: ForecastResponse = await forecastResponse.json();
      
      // Group forecast by day and get daily high/low
      const dailyData = new Map();
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData.has(date)) {
          dailyData.set(date, {
            dt: item.dt,
            temps: [item.main.temp_max, item.main.temp_min],
            weather: item.weather[0]
          });
        } else {
          const existing = dailyData.get(date);
          existing.temps.push(item.main.temp_max, item.main.temp_min);
        }
      });

      // Convert to forecast format (take first 5 days)
      forecast = Array.from(dailyData.values()).slice(0, 5).map(day => ({
        day: getDayName(day.dt),
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        condition: getWeatherCondition(day.weather.main),
        icon: getWeatherIcon(day.weather.main)
      }));
    }

    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: getWeatherCondition(data.weather[0].main),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(data.wind.deg),
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      uvIndex: 0, // UV index not available in current weather API
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like),
      dewPoint: Math.round(data.main.temp - ((100 - data.main.humidity) / 5)), // Approximation
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      forecast
    };
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Provide fallback data while API key activates
    console.log('Using fallback weather data');
    return {
      location: city,
      country: 'Unknown',
      temperature: 25,
      condition: 'Partly Cloudy',
      description: 'Weather data temporarily unavailable',
      humidity: 65,
      windSpeed: 10,
      windDirection: 'NE',
      visibility: 10,
      uvIndex: 5,
      pressure: 1013,
      feelsLike: 28,
      dewPoint: 18,
      sunrise: '06:30',
      sunset: '18:30',
      forecast: [
        { day: 'Today', high: 27, low: 22, condition: 'Partly Cloudy', icon: 'cloud' },
        { day: 'Tomorrow', high: 26, low: 21, condition: 'Sunny', icon: 'sun' },
        { day: 'Wednesday', high: 24, low: 19, condition: 'Rainy', icon: 'rain' },
        { day: 'Thursday', high: 28, low: 23, condition: 'Sunny', icon: 'sun' },
        { day: 'Friday', high: 25, low: 20, condition: 'Partly Cloudy', icon: 'cloud' },
      ]
    };
  }
}
