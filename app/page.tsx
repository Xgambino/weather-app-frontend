"use client";

import { useEffect, useState } from "react";
import WeatherCard from "./components/weatherCard";
import { Weather } from "./types/weather";
import { ThemeToggle } from "./components/themeToggle";
import "./globals.css"; // Assuming globals.css is where you import styles

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;
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
      console.error("City-based fetch error:", err);
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchByCoords = async (lat: number, lon: number) => {
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
    };

    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchByCoords(latitude, longitude);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Location permission denied or unavailable.");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-white">
      {/* Fullscreen Background Video */}
      <video autoPlay muted loop className="video-background">
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="z-10 w-full max-w-2xl px-6 py-12 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight neon-flicker text-purple-300">
          The Weather App
        </h1>

        <ThemeToggle />

        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="🔍 Enter city name"
            className="w-full max-w-md px-5 py-3 rounded-xl bg-white/20 border border-purple-500 placeholder-purple-300 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-purple-500/50 transition"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>

          {loading && !weather && (
            <p className="text-purple-300 animate-pulse">
              Getting weather from your location...
            </p>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {weather && (
            <div className="mt-6 w-full">
              <WeatherCard data={weather} />
            </div>
          )}
        </div>
      </div>

      {/* Neon Flicker Style */}
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
