'use client';
import { useEffect, useState } from 'react';
import WeatherCard from './components/weatherCard';
import { Weather } from './types/weather';
import { ThemeToggle } from './components/themeToggle';

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/weather?city=${city}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError('');
      } else {
        setError(data.error || 'Something went wrong');
        setWeather(null);
      }
    } catch (err) {
      setError('Failed to fetch weather');
      console.error('City-based fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLoading(true);
          try {
            const res = await fetch(`${BASE_URL}/api/weather/coords?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (res.ok) {
              setWeather(data);
              setError('');
            } else {
              console.error('Weather API responded with error:', data);
              setError(data.error || 'Could not get weather from coordinates');
            }
          } catch (err) {
            console.error('Auto-location fetch error:', err);
            setError('Failed to fetch weather using your location');
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          setError('Location permission denied or unavailable.');
        }
      );
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide neon-glow">NeoWeather</h1>

      <ThemeToggle />

      <input
        className="w-full max-w-md px-4 py-3 bg-black bg-opacity-30 border border-purple-500 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        type="text"
        placeholder="🔍 Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={fetchWeather}
        disabled={loading}
        className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-full text-white font-semibold tracking-wider shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
      >
        {loading ? 'Loading...' : 'Get Weather'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {weather && (
        <div className="w-full max-w-md mt-4">
          <WeatherCard data={weather} />
        </div>
      )}

      <style jsx>{`
        .neon-glow {
          color: #fff;
          text-shadow:
            0 0 5px #fff,
            0 0 10px #a855f7,
            0 0 20px #a855f7,
            0 0 40px #a855f7;
        }
      `}</style>
    </main>
  );
}
