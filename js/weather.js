const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCodes = {
  0: ["Clear sky", "☀"],
  1: ["Mainly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"],
  45: ["Fog", "〰"],
  48: ["Depositing rime fog", "〰"],
  51: ["Light drizzle", "🌦"],
  53: ["Drizzle", "🌦"],
  55: ["Dense drizzle", "🌧"],
  56: ["Freezing drizzle", "🌧"],
  57: ["Freezing drizzle", "🌧"],
  61: ["Slight rain", "🌦"],
  63: ["Moderate rain", "🌧"],
  65: ["Heavy rain", "🌧"],
  66: ["Freezing rain", "🌧"],
  67: ["Heavy freezing rain", "🌧"],
  71: ["Slight snow", "🌨"],
  73: ["Moderate snow", "🌨"],
  75: ["Heavy snow", "❄"],
  77: ["Snow grains", "❄"],
  80: ["Rain showers", "🌦"],
  81: ["Rain showers", "🌧"],
  82: ["Violent rain showers", "🌧"],
  85: ["Snow showers", "🌨"],
  86: ["Heavy snow showers", "🌨"],
  95: ["Thunderstorm", "⛈"],
  96: ["Thunderstorm with hail", "⛈"],
  99: ["Thunderstorm with hail", "⛈"]
};

async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Weather service is unavailable. Please try again."
    );
  }

  return response.json();
}

export async function getWeatherByCity(city) {
  const query = city.trim();

  if (!query) {
    throw new Error("Please enter a city name.");
  }

  // Step 1: Find the city and its coordinates.
  const geo = await getJson(
    `${GEO_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );

  const place = geo.results?.[0];

  if (!place) {
    throw new Error(
      `We couldn't find "${query}". Check the spelling and try again.`
    );
  }

  // Step 2: Request the weather for those coordinates.
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    timezone: "auto",
    forecast_days: "1"
  });

  const data = await getJson(`${WEATHER_URL}?${params}`);
  const current = data.current;

  const [condition, icon] =
    weatherCodes[current.weather_code] || [
      "Unknown conditions",
      "☁"
    ];

  const localTime = current.time?.split("T")[1] || "--:--";

  return {
    city: place.name,
    region: place.admin1 || place.country || "",
    country: place.country || "",

    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    wind: Math.round(current.wind_speed_10m),

    windDirection: degreesToDirection(
      current.wind_direction_10m
    ),

    condition,
    icon,
    localTime,

    latitude: Number(place.latitude).toFixed(2),
    longitude: Number(place.longitude).toFixed(2),

    isDay: current.is_day === 1
  };
}

function degreesToDirection(degrees = 0) {
  const directions = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW"
  ];

  return directions[Math.round(degrees / 45) % 8];
}