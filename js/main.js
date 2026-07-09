import { getAire } from './api/aire.js';
import { getClima } from './api/clima.js';
import { guardarEstado, cargarEstado } from './utils/storage.js';
import { renderEstaciones } from './ui/render.js';
import { debounce } from './utils/debounce.js';

const estado = cargarEstado();
let datosCali = [];

async function obtenerDatos() {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '<p aria-live="polite">Cargando...</p>';
  try {
    const [aire, clima] = await Promise.all([getAire(), getClima()]);
    datosCali = [{ id: 'cali', barrio: 'Cali (general)', ...aire, ...clima }];
  } catch (e) {
    contenedor.innerHTML = '<p role="alert">Error de red</p>';
    datosCali = [];
  }
}

function aplicarFiltros() {
  const q = (estado.busqueda || '').toLowerCase();
  return datosCali.filter(({ barrio }) => barrio.toLowerCase().includes(q));
}

async function actualizar() {
  if (!datosCali.length) await obtenerDatos();
  renderEstaciones(aplicarFiltros(), estado, document.querySelector('#estaciones'));
  guardarEstado(estado);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#busqueda');
  const btnTemp = document.querySelector('#toggle-temp');
  const btnTema = document.querySelector('#toggle-tema');
  const contenedor = document.querySelector('#estaciones');

  // Tema
  document.documentElement.setAttribute('data-tema', estado.tema);
  btnTema.textContent = estado.tema === 'claro' ? '☀️' : '🌙';
  btnTema.setAttribute('aria-label', estado.tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  btnTema.addEventListener('click', () => {
    estado.tema = estado.tema === 'claro' ? 'oscuro' : 'claro';
    document.documentElement.setAttribute('data-tema', estado.tema);
    btnTema.textContent = estado.tema === 'claro' ? '☀️' : '🌙';
    btnTema.setAttribute('aria-label', estado.tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    guardarEstado(estado);
  });

  // Busqueda
  input.value = estado.busqueda;
  btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
  btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');

  btnTemp.addEventListener('click', () => {
    estado.unidad = estado.unidad === 'C' ? 'F' : 'C';
    btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
    btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');
    actualizar();
  });

  const form = document.querySelector('#filtros');
  if (form) {
    form.addEventListener('submit', e => e.preventDefault());
  }

  const onBuscar = debounce(e => {
  estado.busqueda = e.target.value.trim();
  actualizar();
  }, 300);

  input.addEventListener('input', onBuscar);

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