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
    return raw ? { ...PREDETERMINADO, ...JSON.parse(raw) } : { ...PREDETERMINADO };
  } catch {
    return { ...PREDETERMINADO };
  }
}