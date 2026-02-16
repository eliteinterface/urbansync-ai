import { format } from 'date-fns';
import {
  ChevronDown,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import type { WeatherSnapshot } from '../hooks/useWeather';

type WeatherWidgetProps = {
  data: WeatherSnapshot | null;
  loading?: boolean;
};

const toRounded = (value: number | null) =>
  value == null || Number.isNaN(value) ? null : Math.round(value);

const toFixed = (value: number | null, digits = 1) =>
  value == null || Number.isNaN(value) ? null : value.toFixed(digits);

const WeatherWidget = ({ data, loading }: WeatherWidgetProps) => {
  if (!data && !loading) {
    return null;
  }

  if (!data) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="h-6 w-1/2 rounded-full bg-slate-200" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 rounded-2xl bg-slate-200" />
            <div className="h-12 rounded-2xl bg-slate-200" />
            <div className="h-12 rounded-2xl bg-slate-200" />
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  const condition = data.condition?.toLowerCase() ?? '';
  const ConditionIcon =
    condition === 'thunderstorm'
      ? CloudLightning
      : condition === 'rain' || condition === 'drizzle'
      ? CloudRain
      : condition === 'snow'
      ? CloudSnow
      : condition === 'clear'
      ? Sun
      : Cloud;

  const temperature = toRounded(data.temperature);
  const feelsLike = toRounded(data.feelsLike);
  const humidity = toRounded(data.humidity);
  const wind = toRounded(data.windKmh);
  const updatedLabel = format(new Date(data.updatedAt), 'HH:mm');
  const descriptionLabel = data.description
    ? `${data.description.charAt(0).toUpperCase()}${data.description.slice(1)}`
    : 'Estado actual';
  const visibilityKm = toFixed(
    data.visibility != null ? data.visibility / 1000 : null
  );
  const sunriseLabel = data.sunrise
    ? format(new Date(data.sunrise * 1000), 'HH:mm')
    : null;
  const sunsetLabel = data.sunset
    ? format(new Date(data.sunset * 1000), 'HH:mm')
    : null;

  const details = [
    data.pressure != null
      ? { label: 'Presion', value: `${Math.round(data.pressure)} hPa` }
      : null,
    data.clouds != null
      ? { label: 'Nubosidad', value: `${Math.round(data.clouds)}%` }
      : null,
    visibilityKm != null
      ? { label: 'Visibilidad', value: `${visibilityKm} km` }
      : null,
    data.windGustKmh != null
      ? { label: 'Racha viento', value: `${Math.round(data.windGustKmh)} km/h` }
      : null,
    data.windDeg != null
      ? { label: 'Direccion viento', value: `${Math.round(data.windDeg)}°` }
      : null,
    data.rainMm != null
      ? {
          label: data.rainWindow ? `Lluvia ${data.rainWindow}` : 'Lluvia',
          value: `${data.rainMm.toFixed(1)} mm`,
        }
      : null,
    data.snowMm != null
      ? {
          label: data.snowWindow ? `Nieve ${data.snowWindow}` : 'Nieve',
          value: `${data.snowMm.toFixed(1)} mm`,
        }
      : null,
    sunriseLabel ? { label: 'Amanecer', value: sunriseLabel } : null,
    sunsetLabel ? { label: 'Atardecer', value: sunsetLabel } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-700/70">
            Clima ahora
          </p>
          <div className="mt-2 flex items-center gap-3">
            <ConditionIcon className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-3xl font-semibold">
                {temperature != null ? `${temperature}°C` : '--'}
              </p>
              <p className="text-sm text-slate-600">
                {descriptionLabel}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{data.name ?? 'Tu zona'}</p>
          <p>Actualizado {updatedLabel}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
          <Thermometer className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Temperatura</p>
            <p className="font-semibold">
              {temperature != null ? `${temperature}°C` : '--'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
          <Thermometer className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Sensacion termica</p>
            <p className="font-semibold">
              {feelsLike != null ? `${feelsLike}°C` : '--'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
          <Wind className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Viento</p>
            <p className="font-semibold">
              {wind != null ? `${wind} km/h` : '--'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
          <Droplets className="h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Humedad</p>
            <p className="font-semibold">
              {humidity != null ? `${humidity}%` : '--'}
            </p>
          </div>
        </div>
      </div>

      {details.length > 0 && (
        <details className="group mt-4 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs text-slate-500">
            Ver detalles del clima
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2"
              >
                <span className="text-slate-500">{detail.label}</span>
                <span className="font-semibold text-slate-800">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
};

export default WeatherWidget;
