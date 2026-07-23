// js/api/geocoding.js
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

export async function buscarBarrios(query, signal = null) {
  if (!query || query.length < 3) return [];

  try {
    const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(
      query + ', Cali, Valle del Cauca, Colombia'
    )}&limit=6&addressdetails=1`;

    const options = {
      headers: {
        'User-Agent': 'RespiraCali/1.0 (contacto@pipehd54.dev)',
      },
    };
    if (signal) options.signal = signal;

    const res = await fetch(url, options);

    if (!res.ok) throw new Error('Geocoding falló');

    const data = await res.json();

    return data
      .filter(item => item.display_name && item.display_name.includes('Cali'))
      .map(item => ({
        display_name: item.display_name.split(',')[0].trim(),
        barrio: item.address?.suburb || item.address?.neighbourhood || item.address?.road || item.display_name.split(',')[0].trim(),
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
  } catch (error) {
    if (error.name === 'AbortError') return []; // Petición cancelada intencionalmente
    console.error('Error en geocoding:', error);
    return [];
  }
}