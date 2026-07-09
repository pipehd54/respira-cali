const URL = 'https://api.open-meteo.com/v1/forecast?latitude=3.4516&longitude=-76.532&current=temperature_2m&timezone=America/Bogota';

export async function getClima() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Clima falló');
  const data = await res.json();
  return { tempC: data.current.temperature_2m };
}