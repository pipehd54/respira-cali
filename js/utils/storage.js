const KEY = 'respira-cali-estado';

const PREDETERMINADO = { unidad: 'C', busqueda: '', favoritos: [], tema: 'oscuro' };

export function guardarEstado(estado) {
  try {
    localStorage.setItem(KEY, JSON.stringify(estado));
  } catch {
    // localStorage lleno o deshabilitado — ignorar silenciosamente
  }
}

export function cargarEstado() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...PREDETERMINADO };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...PREDETERMINADO };

    const estado = { ...PREDETERMINADO };

    // Validar unidad ('C' o 'F')
    if (parsed.unidad === 'C' || parsed.unidad === 'F') {
      estado.unidad = parsed.unidad;
    }

    // Validar tema ('oscuro' o 'claro')
    if (parsed.tema === 'oscuro' || parsed.tema === 'claro') {
      estado.tema = parsed.tema;
    }

    // Sanitizar favoritos
    if (Array.isArray(parsed.favoritos)) {
      estado.favoritos = parsed.favoritos
        .map(f => {
          if (typeof f === 'string') {
            return { barrio: f.trim(), lat: 3.4516, lon: -76.532 };
          }
          if (
            f &&
            typeof f === 'object' &&
            typeof f.barrio === 'string' &&
            typeof f.lat === 'number' &&
            !Number.isNaN(f.lat) &&
            typeof f.lon === 'number' &&
            !Number.isNaN(f.lon)
          ) {
            return {
              barrio: f.barrio.trim(),
              lat: f.lat,
              lon: f.lon
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    return estado;
  } catch {
    return { ...PREDETERMINADO };
  }
}