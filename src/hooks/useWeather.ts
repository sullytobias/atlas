import { useState, useEffect } from "react";

export interface WeatherData {
    temperatureC: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
}

export interface WeatherInfo {
    emoji: string;
    label: string;
}

export function getWeatherInfo(code: number): WeatherInfo {
    if (code === 0) return { emoji: "☀️", label: "Clear sky" };
    if (code === 1) return { emoji: "🌤", label: "Mainly clear" };
    if (code === 2) return { emoji: "⛅", label: "Partly cloudy" };
    if (code === 3) return { emoji: "☁️", label: "Overcast" };
    if (code <= 48) return { emoji: "🌫", label: "Fog" };
    if (code <= 55) return { emoji: "🌦", label: "Drizzle" };
    if (code <= 65) return { emoji: "🌧", label: "Rain" };
    if (code <= 77) return { emoji: "❄️", label: "Snow" };
    if (code <= 82) return { emoji: "🌧", label: "Showers" };
    if (code <= 86) return { emoji: "🌨", label: "Snow showers" };
    if (code <= 99) return { emoji: "⛈", label: "Thunderstorm" };
    return { emoji: "🌡", label: "Unknown" };
}

export function useWeather(lat: number | null, lng: number | null) {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lat === null || lng === null) {
            setData(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setData(null);

        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", lat.toFixed(4));
        url.searchParams.set("longitude", lng.toFixed(4));
        url.searchParams.set(
            "current",
            "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m",
        );
        url.searchParams.set("timezone", "auto");
        url.searchParams.set("forecast_days", "1");

        fetch(url.toString())
            .then((r) => r.json())
            .then((json) => {
                if (cancelled) return;
                const c = json.current as {
                    temperature_2m: number;
                    weather_code: number;
                    wind_speed_10m: number;
                    relative_humidity_2m: number;
                };
                setData({
                    temperatureC: Math.round(c.temperature_2m),
                    weatherCode: c.weather_code,
                    windSpeed: Math.round(c.wind_speed_10m),
                    humidity: Math.round(c.relative_humidity_2m),
                });
            })
            .catch(() => {
                if (!cancelled) setData(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [lat, lng]);

    return { data, loading };
}
