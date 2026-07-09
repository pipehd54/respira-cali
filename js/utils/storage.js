const KEY = 'respira-cali-estado';

export function guardarEstado(estado) {
  localStorage.setItem(KEY, JSON.stringify(estado));
}

export function cargarEstado() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { unidad: 'C', busqueda: '', favoritos: [] };
}