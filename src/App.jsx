import { useState } from 'react';
import { fetchWeather, fetchWeatherByCoords } from './components/services/weatherService.js';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeather(data);
          setCity(data.name);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Unable to retrieve your location. Please allow location access in your browser.');
      }
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4 fw-bold">Weather Dashboard</h1>

          {/* Search Form + GPS Button */}
          <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city name (e.g., Lagos, Ota)..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary text-nowrap"
              onClick={handleLocationClick}
              disabled={loading}
              title="Use my current location"
            >
              📍 My Location
            </button>
          </form>

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Weather Display Card */}
          {weather && (
            <div className="card shadow-sm text-center p-4">
              <h2 className="fw-bold">
                {weather.name}, {weather.sys.country}
              </h2>
              <div className="display-3 fw-bold my-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <p className="text-capitalize text-muted fs-5 mb-3">
                {weather.weather[0].description}
              </p>
              <div className="d-flex justify-content-around border-top pt-3">
                <div>
                  <small className="text-muted d-block">Feels Like</small>
                  <strong>{Math.round(weather.main.feels_like)}°C</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Humidity</small>
                  <strong>{weather.main.humidity}%</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Wind Speed</small>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;