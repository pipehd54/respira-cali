export async function getClima(lat = 3.4516, lon = -76.532) {
  const URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=America/Bogota`;

  const res = await fetch(URL);
  if (!res.ok) throw new Error('Clima falló');
  const data = await res.json();

  return { tempC: data.current.temperature_2m };
}