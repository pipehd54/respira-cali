export async function getAire(lat = 3.4516, lon = -76.532) {
  const URL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi_pm2_5,pm2_5,pm10&timezone=America/Bogota`;

  const res = await fetch(URL);
  if (!res.ok) throw new Error('Aire falló');
  const data = await res.json();

  return {
    aqi: data.current.us_aqi_pm2_5,
    pm25: data.current.pm2_5,
  };
}