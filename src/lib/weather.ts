import { CLUB, WEATHER_FALLBACK } from "@/data/mock";
import type { WeatherInfo } from "@/types";

/**
 * Open-Meteo current weather for the club stadium (brief §5/§9.2).
 * No API key required. Cached 30 minutes; any failure falls back to
 * the mock value so the UI NEVER breaks because of weather (§10).
 */
export async function getWeather(): Promise<WeatherInfo> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${CLUB.stadium.lat}&longitude=${CLUB.stadium.lng}` +
      `&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return WEATHER_FALLBACK;
    const json = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const temp = json.current?.temperature_2m;
    const code = json.current?.weather_code;
    if (typeof temp !== "number" || typeof code !== "number") {
      return WEATHER_FALLBACK;
    }
    return { temperatureC: Math.round(temp), code, isMock: false };
  } catch {
    return WEATHER_FALLBACK;
  }
}

/** Maps a WMO weather code to its i18n key (weather.<group>). */
export function weatherCodeToGroup(code: number): string {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}
