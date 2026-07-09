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
    const estado = raw ? { ...PREDETERMINADO, ...JSON.parse(raw) } : { ...PREDETERMINADO };
    estado.busqueda = ''; // Nunca persistir la búsqueda entre sesiones

    // Sanitizar favoritos antiguos (compatibilidad hacia atrás)
    if (Array.isArray(estado.favoritos)) {
      estado.favoritos = estado.favoritos.map(f => {
        if (typeof f === 'string') {
          return { barrio: f, lat: 3.4516, lon: -76.532 };
        }
        return f;
      });
    } else {
      estado.favoritos = [];
    }

    return estado;
  } catch {
    return { ...PREDETERMINADO };
  }
}