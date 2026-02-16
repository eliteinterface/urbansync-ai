import { useEffect, useState } from 'react';

export type WeatherWarning = {
  kind: 'rain' | 'storm' | 'wind';
  message: string;
};

export type WeatherSnapshot = {
  name: string | null;
  condition: string | null;
  description: string | null;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  pressure: number | null;
  windKmh: number | null;
  windGustKmh: number | null;
  windDeg: number | null;
  clouds: number | null;
  visibility: number | null;
  rainMm: number | null;
  rainWindow: '1h' | '3h' | null;
  snowMm: number | null;
  snowWindow: '1h' | '3h' | null;
  sunrise: number | null;
  sunset: number | null;
  updatedAt: number;
};

const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const WIND_THRESHOLD_KMH = 30;

const useWeather = (lat?: number, lon?: number) => {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [warning, setWarning] = useState<WeatherWarning | null>(null);
  const [loading, setLoading] = useState(false);

  const asNumber = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? value : null;

  useEffect(() => {
    if (lat == null || lon == null) {
      setData(null);
      setWarning(null);
      setLoading(false);
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      setData(null);
      setWarning(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadWeather = async () => {
      setLoading(true);
      try {
        const url = new URL(WEATHER_ENDPOINT);
        url.searchParams.set('lat', lat.toString());
        url.searchParams.set('lon', lon.toString());
        url.searchParams.set('appid', apiKey);
        url.searchParams.set('units', 'metric');
        url.searchParams.set('lang', 'es');

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          setWarning(null);
          setLoading(false);
          return;
        }

        const payload = await response.json();
        const condition =
          typeof payload?.weather?.[0]?.main === 'string'
            ? payload.weather[0].main
            : null;
        const description =
          typeof payload?.weather?.[0]?.description === 'string'
            ? payload.weather[0].description
            : null;
        const windSpeed = asNumber(payload?.wind?.speed);
        const windKmh = windSpeed != null ? windSpeed * 3.6 : null;
        const windGust = asNumber(payload?.wind?.gust);
        const windGustKmh = windGust != null ? windGust * 3.6 : null;
        const rainOne = asNumber(payload?.rain?.['1h']);
        const rainThree = asNumber(payload?.rain?.['3h']);
        const snowOne = asNumber(payload?.snow?.['1h']);
        const snowThree = asNumber(payload?.snow?.['3h']);

        setData({
          name: typeof payload?.name === 'string' ? payload.name : null,
          condition,
          description,
          temperature: asNumber(payload?.main?.temp),
          feelsLike: asNumber(payload?.main?.feels_like),
          humidity: asNumber(payload?.main?.humidity),
          pressure: asNumber(payload?.main?.pressure),
          windKmh,
          windGustKmh,
          windDeg: asNumber(payload?.wind?.deg),
          clouds: asNumber(payload?.clouds?.all),
          visibility: asNumber(payload?.visibility),
          rainMm: rainOne ?? rainThree ?? null,
          rainWindow: rainOne != null ? '1h' : rainThree != null ? '3h' : null,
          snowMm: snowOne ?? snowThree ?? null,
          snowWindow: snowOne != null ? '1h' : snowThree != null ? '3h' : null,
          sunrise: asNumber(payload?.sys?.sunrise),
          sunset: asNumber(payload?.sys?.sunset),
          updatedAt: Date.now(),
        });

        let nextWarning: WeatherWarning | null = null;
        if (condition === 'Thunderstorm') {
          nextWarning = {
            kind: 'storm',
            message: 'Tormenta: mejor no saques la bolsa.',
          };
        } else if (condition === 'Rain' || condition === 'Drizzle') {
          nextWarning = {
            kind: 'rain',
            message: 'Lluvia: cierra bien la tapa.',
          };
        } else if ((windKmh ?? 0) > WIND_THRESHOLD_KMH) {
          nextWarning = {
            kind: 'wind',
            message: 'Viento fuerte: asegura la bolsa.',
          };
        }

        setWarning(nextWarning);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          setWarning(null);
          setLoading(false);
        }
        return;
      }

      setLoading(false);
    };

    loadWeather();

    return () => {
      controller.abort();
    };
  }, [lat, lon]);

  return { data, warning, loading };
};

export default useWeather;
