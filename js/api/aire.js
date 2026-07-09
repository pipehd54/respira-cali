const URL = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=3.4516&longitude=-76.532&current=us_aqi_pm2_5,pm2_5,pm10&timezone=America/Bogota';

export async function getAire() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Aire falló');
  const data = await res.json();
  return {
    aqi: data.current.us_aqi_pm2_5,
    pm25: data.current.pm2_5
  };
}