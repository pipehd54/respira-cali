import { getAire } from './api/aire.js';
import { getClima } from './api/clima.js';
import { guardarEstado, cargarEstado } from './utils/storage.js';
import { renderEstaciones } from './ui/render.js';
import { debounce } from './utils/debounce.js';
import { buscarBarrios } from './api/geocoding.js';

const estado = cargarEstado();
let datosCali = [];
let searchAbortController = null;

async function fetchEstacionConFallback(id, barrio, lat, lon) {
  const [aireRes, climaRes] = await Promise.allSettled([
    getAire(lat, lon),
    getClima(lat, lon)
  ]);

  const aire = aireRes.status === 'fulfilled' ? aireRes.value : { aqi: '—', pm25: '—' };
  const clima = climaRes.status === 'fulfilled' ? climaRes.value : { tempC: '—' };

  return {
    id,
    barrio,
    lat,
    lon,
    ...aire,
    ...clima
  };
}

async function obtenerDatos() {
  const contenedor = document.querySelector('#estaciones');
  if (!datosCali.length && contenedor) {
    contenedor.innerHTML = '<p aria-live="polite">Cargando datos del aire...</p>';
  }
  try {
    const promesas = [
      fetchEstacionConFallback('cali', 'Cali (general)', 3.4516, -76.532)
    ];

    estado.favoritos.forEach(f => {
      promesas.push(
        fetchEstacionConFallback(f.barrio, f.barrio, f.lat, f.lon)
      );
    });

    datosCali = await Promise.all(promesas);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    if (contenedor) {
      contenedor.innerHTML = '<p role="alert">No se pudieron cargar los datos del aire. Revisa tu conexión.</p>';
    }
    datosCali = [];
  }
}

function aplicarFiltros() {
  const q = (estado.busqueda || '').toLowerCase().trim();
  if (!q) return datosCali;
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

  if (!input || !btnTemp || !btnTema || !contenedor) return;

  // ── Tema ──
  const aplicarTema = () => {
    document.documentElement.setAttribute('data-tema', estado.tema);
    btnTema.textContent = estado.tema === 'claro' ? '☀️' : '🌙';
    btnTema.setAttribute('aria-label', estado.tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  };
  aplicarTema();

  btnTema.addEventListener('click', () => {
    estado.tema = estado.tema === 'claro' ? 'oscuro' : 'claro';
    aplicarTema();
    guardarEstado(estado);
  });

  // ── Temperatura ──
  const aplicarUnidadTemp = () => {
    btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');
    const unitC = btnTemp.querySelector('.temp-unit-active, .temp-unit-inactive');
    if (unitC) {
      btnTemp.innerHTML = `<span class="${estado.unidad === 'C' ? 'temp-unit-active' : 'temp-unit-inactive'}">°C</span><span class="temp-unit-divider">/</span><span class="${estado.unidad === 'F' ? 'temp-unit-active' : 'temp-unit-inactive'}">°F</span>`;
    }
  };
  aplicarUnidadTemp();

  btnTemp.addEventListener('click', () => {
    estado.unidad = estado.unidad === 'C' ? 'F' : 'C';
    aplicarUnidadTemp();
    actualizar();
  });

  // ── Prevenir envío del form ──
  if (form) {
    form.addEventListener('submit', e => e.preventDefault());
  }

  // ── Búsqueda con geocoding y accesibilidad ──
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-wrapper';
  input.parentNode.insertBefore(searchWrapper, input);
  searchWrapper.appendChild(input);

  const resultadosDiv = document.createElement('div');
  resultadosDiv.id = 'resultados-busqueda';
  resultadosDiv.className = 'resultados-busqueda';
  resultadosDiv.setAttribute('role', 'listbox');
  resultadosDiv.setAttribute('aria-label', 'Sugerencias de barrios');
  searchWrapper.appendChild(resultadosDiv);

  let activeIndex = -1;

  const cerrarResultados = () => {
    resultadosDiv.innerHTML = '';
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
  };

  document.addEventListener('click', e => {
    if (!searchWrapper.contains(e.target)) {
      cerrarResultados();
    }
  });

  const seleccionarBarrio = async (barrioNombre, lat, lon) => {
    cerrarResultados();
    input.value = barrioNombre;
    estado.busqueda = barrioNombre;

    try {
      const datosBarrio = await fetchEstacionConFallback('buscado', barrioNombre, lat, lon);
      const indexExistente = datosCali.findIndex(d => d.barrio.toLowerCase() === barrioNombre.toLowerCase());
      if (indexExistente >= 0) {
        datosCali[indexExistente] = datosBarrio;
      } else {
        datosCali.push(datosBarrio);
      }
      actualizar();
    } catch (err) {
      console.error('Error al seleccionar barrio:', err);
    }
  };

  const onBuscar = debounce(async (e) => {
    const query = e.target.value.trim();
    estado.busqueda = query;

    if (searchAbortController) {
      searchAbortController.abort();
    }
    searchAbortController = new AbortController();

    if (query.length < 3) {
      cerrarResultados();
      actualizar();
      return;
    }

    const barrios = await buscarBarrios(query, searchAbortController.signal);

    resultadosDiv.innerHTML = '';
    activeIndex = -1;

    if (barrios.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No se encontraron barrios';
      p.className = 'no-resultados';
      resultadosDiv.appendChild(p);
      return;
    }

    const fragment = document.createDocumentFragment();
    barrios.forEach((b, index) => {
      const div = document.createElement('div');
      div.className = 'resultado-item';
      div.id = `opcion-barrio-${index}`;
      div.setAttribute('role', 'option');
      div.setAttribute('tabindex', '-1');
      div.dataset.lat = b.lat;
      div.dataset.lon = b.lon;
      div.textContent = b.barrio;

      div.addEventListener('click', () => {
        seleccionarBarrio(b.barrio, b.lat, b.lon);
      });

      fragment.appendChild(div);
    });
    resultadosDiv.appendChild(fragment);
  }, 300);

  input.addEventListener('input', onBuscar);

  // Navegación por teclado en el input de búsqueda
  input.addEventListener('keydown', e => {
    const items = resultadosDiv.querySelectorAll('.resultado-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      actualizarFocoItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      actualizarFocoItem(items);
    } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      const item = items[activeIndex];
      seleccionarBarrio(item.textContent.trim(), parseFloat(item.dataset.lat), parseFloat(item.dataset.lon));
    } else if (e.key === 'Escape') {
      cerrarResultados();
    }
  });

  function actualizarFocoItem(items) {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', item.id);
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ── Favoritos (delegación de eventos) ──
  contenedor.addEventListener('click', e => {
    const btnFav = e.target.closest('.fav');
    if (btnFav) {
      const card = btnFav.closest('article');
      const barrio = card.dataset.barrio;
      const lat = parseFloat(card.dataset.lat);
      const lon = parseFloat(card.dataset.lon);

      const existe = estado.favoritos.some(f => f.barrio === barrio);
      if (existe) {
        estado.favoritos = estado.favoritos.filter(f => f.barrio !== barrio);
        if (!estado.busqueda && barrio !== 'Cali (general)') {
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