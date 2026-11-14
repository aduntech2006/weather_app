const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (city) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is missing. Check your .env file.');
  }

  const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    } else {
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }

  return await response.json();
};

export const fetchWeatherByCoords = async (lat, lon) => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is missing. Check your .env file.');
  }

  const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather for your current location.');
  }

  return await response.json();
};