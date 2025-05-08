'use client';
import { Weather } from '../types/weather';

interface Props {
  data: Weather;
}

export default function WeatherCard({ data }: Props) {
  return (
    <div className="p-4 rounded-xl shadow-xl bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold">{data.city}, {data.country}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
        alt={data.description}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-weather.png';
        }}
      />
      <p className="text-lg capitalize">{data.description}</p>
      <p>Temperature: {Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(data.temperature)}°C</p>
      <p>Humidity: {data.humidity}%</p>
      <p>Wind: {data.wind_speed} m/s</p>
    </div>
  );
}
