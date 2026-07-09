// js/api/geocoding.js
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

export async function buscarBarrios(query) {
  if (!query || query.length < 3) return [];

  try {
    const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(
      query + ', Cali, Valle del Cauca, Colombia'
    )}&limit=6&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'RespiraCali/1.0 (contacto@pipehd54.dev)', // Requerido por Nominatim
      },
    });

    if (!res.ok) throw new Error('Geocoding falló');

    const data = await res.json();

    return data
      .filter(item => item.display_name.includes('Cali'))
      .map(item => ({
        display_name: item.display_name.split(',')[0].trim(),
        barrio: item.address?.suburb || item.address?.neighbourhood || 'Cali',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
  } catch (error) {
    console.error('Error en geocoding:', error);
    return [];
  }
}