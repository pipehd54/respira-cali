import { getAire } from './api/aire.js';
import { getClima } from './api/clima.js';
import { guardarEstado, cargarEstado } from './utils/storage.js';
import { renderEstaciones } from './ui/render.js';

const estado = cargarEstado(); // recupera última sesión
let datosCali = [];

async function obtenerDatos() {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '<p aria-live="polite">Cargando...</p>';
  try {
    const [aire, clima] = await Promise.all([getAire(), getClima()]);
    const base = { ...aire, ...clima };
    datosCali = ['La Flora','San Fernando','Aguablanca'].map(barrio => ({ id: barrio, barrio, ...base }));
  } catch (e) {
    contenedor.innerHTML = '<p role="alert">Error de red</p>';
    datosCali = [];
  }
}

function aplicarFiltros() {
  return datosCali.filter(({ barrio }) => 
    barrio.toLowerCase().includes(estado.busqueda.toLowerCase())
  );
}

async function actualizar() {
  if (!datosCali.length) await obtenerDatos();
  renderEstaciones(aplicarFiltros(), estado, document.querySelector('#estaciones'));
  guardarEstado(estado); // persiste en cada cambio
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#busqueda');
  const btnTemp = document.querySelector('#toggle-temp');
  const contenedor = document.querySelector('#estaciones');

  input.value = estado.busqueda; // restaura búsqueda
  btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
  btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');

  input.addEventListener('input', e => { estado.busqueda = e.target.value.trim(); actualizar(); });
  btnTemp.addEventListener('click', () => { estado.unidad = estado.unidad === 'C' ? 'F' : 'C'; actualizar(); });

  // Delegación: un solo listener para todos los botones de favorito
  contenedor.addEventListener('click', e => {
    if (e.target.classList.contains('fav')) {
      const barrio = e.target.closest('article').dataset.barrio;
      estado.favoritos = estado.favoritos.includes(barrio)
        ? estado.favoritos.filter(b => b !== barrio)
        : [...estado.favoritos, barrio];
      actualizar();
    }
  });

  actualizar();
});