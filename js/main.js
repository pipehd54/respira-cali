import { getAire } from './api/aire.js';
import { getClima } from './api/clima.js';
import { guardarEstado, cargarEstado } from './utils/storage.js';
import { renderEstaciones } from './ui/render.js';
import { debounce } from './utils/debounce.js';
import { buscarBarrios } from './api/geocoding.js';

const estado = cargarEstado();
let datosCali = [];

async function obtenerDatos() {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '<p aria-live="polite">Cargando...</p>';
  try {
    const promesas = [
      Promise.all([getAire(), getClima()]).then(([aire, clima]) => ({
        id: 'cali',
        barrio: 'Cali (general)',
        lat: 3.4516,
        lon: -76.532,
        ...aire,
        ...clima
      }))
    ];

    estado.favoritos.forEach(f => {
      promesas.push(
        Promise.all([getAire(f.lat, f.lon), getClima(f.lat, f.lon)]).then(([aire, clima]) => ({
          id: f.barrio,
          barrio: f.barrio,
          lat: f.lat,
          lon: f.lon,
          ...aire,
          ...clima
        }))
      );
    });

    datosCali = await Promise.all(promesas);
  } catch {
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
  const form = document.querySelector('#filtros');

  // ── Tema ──
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

  // ── Temperatura ──
  btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
  btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');
  btnTemp.addEventListener('click', () => {
    estado.unidad = estado.unidad === 'C' ? 'F' : 'C';
    btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
    btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');
    actualizar();
  });

  // ── Prevenir envío del form ──
  if (form) {
    form.addEventListener('submit', e => e.preventDefault());
  }

  // ── Búsqueda con geocoding ──
  const resultadosDiv = document.createElement('div');
  resultadosDiv.id = 'resultados-busqueda';
  resultadosDiv.className = 'resultados-busqueda';
  input.parentNode.appendChild(resultadosDiv);

  const onBuscar = debounce(async (e) => {
    const query = e.target.value.trim();
    estado.busqueda = query;

    if (query.length < 3) {
      resultadosDiv.innerHTML = '';
      datosCali = []; // Forza recarga de la lista general (Cali + favoritos)
      actualizar();
      return;
    }

    const barrios = await buscarBarrios(query);

    resultadosDiv.innerHTML = '';

    if (barrios.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No se encontraron barrios';
      resultadosDiv.appendChild(p);
      return;
    }

    const fragment = document.createDocumentFragment();
    barrios.forEach(b => {
      const div = document.createElement('div');
      div.className = 'resultado-item';
      div.dataset.lat = b.lat;
      div.dataset.lon = b.lon;
      div.textContent = b.barrio;
      fragment.appendChild(div);
    });
    resultadosDiv.appendChild(fragment);
  }, 300);

  resultadosDiv.addEventListener('click', async (e) => {
    const item = e.target.closest('.resultado-item');
    if (!item) return;

    const lat = parseFloat(item.dataset.lat);
    const lon = parseFloat(item.dataset.lon);

    resultadosDiv.innerHTML = '';
    input.value = item.textContent.trim();
    estado.busqueda = item.textContent.trim(); // Ajustar búsqueda al barrio seleccionado

    try {
      const [aire, clima] = await Promise.all([
        getAire(lat, lon),
        getClima(lat, lon),
      ]);

      datosCali = [{
        id: 'buscado',
        barrio: item.textContent.trim(),
        lat: lat,
        lon: lon,
        ...aire,
        ...clima,
      }];

      actualizar();
    } catch (err) {
      console.error(err);
    }
  });

  input.addEventListener('input', onBuscar);

  // ── Favoritos (delegación) ──
  contenedor.addEventListener('click', e => {
    if (e.target.classList.contains('fav')) {
      const card = e.target.closest('article');
      const barrio = card.dataset.barrio;
      const lat = parseFloat(card.dataset.lat);
      const lon = parseFloat(card.dataset.lon);

      const existe = estado.favoritos.some(f => f.barrio === barrio);
      if (existe) {
        estado.favoritos = estado.favoritos.filter(f => f.barrio !== barrio);
        // Si no estamos buscando, remover de la UI inmediatamente
        if (estado.busqueda.length < 3) {
          datosCali = datosCali.filter(d => d.barrio !== barrio);
        }
      } else {
        estado.favoritos = [...estado.favoritos, { barrio, lat, lon }];
      }
      actualizar();
    }
  });

  actualizar();
});