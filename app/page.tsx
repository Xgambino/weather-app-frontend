"use client";
import { useEffect, useState } from "react";
import WeatherCard from "./components/weatherCard";
import { Weather } from "./types/weather";
import { ThemeToggle } from "./components/themeToggle";

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/weather?city=${city}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError("");
      } else {
        setError(data.error || "Something went wrong");
        setWeather(null);
      }
    } catch (err) {
      setError("Failed to fetch weather");
      console.error("City-based fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLoading(true);
          try {
            const res = await fetch(
              `${BASE_URL}/api/weather/coords?lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            if (res.ok) {
              setWeather(data);
              setError("");
            } else {
              setError(data.error || "Could not get weather from coordinates");
            }
          } catch (err) {
            setError("Failed to fetch weather using your location");
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          setError("Location permission denied or unavailable.");
        }
      );
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden text-white flex flex-col justify-center items-center">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/bg.mp4" type="video/mp4" />
        <source src="/bg.webm" type="video/webm" />
        <source src="/bg.ogg" type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 -z-10"></div>

      {/* Content Section */}
      <div className="text-center space-y-8 p-8 md:p-16 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold text-purple-300 neon-flicker">
          ⚡ NeoWeather
        </h1>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* City Input */}
        <div className="w-full max-w-md mx-auto">
          <input
            className="w-full px-6 py-3 bg-opacity-20 border border-purple-500 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur"
            type="text"
            placeholder="🔍 Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Fetch weather button */}
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-8 py-4 bg-purple-700 hover:bg-purple-600 rounded-full text-white font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Weather Data Display */}
        {weather && (
          <div className="mt-6">
            <WeatherCard data={weather} />
          </div>
        )}
      </div>

      <style jsx>{`
        .neon-flicker {
          text-shadow: 0 0 5px #fff, 0 0 10px #a855f7, 0 0 20px #a855f7,
            0 0 40px #a855f7;
          animation: flicker 2s infinite;
        }

        @keyframes flicker {
          0%,
          18%,
          22%,
          25%,
          53%,
          57%,
          100% {
            opacity: 1;
          }

          20%,
          24%,
          55% {
            opacity: 0.4;
          }
        }
      `}</style>
    </main>
  );
}
