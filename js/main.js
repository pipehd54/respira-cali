// Estado
const estado = { unidad: 'C', busqueda: '' };
const API_AIRE = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=3.4516&longitude=-76.532&current=us_aqi_pm2_5,pm2_5,pm10&timezone=America/Bogota';
const API_CLIMA = 'https://api.open-meteo.com/v1/forecast?latitude=3.4516&longitude=-76.532&current=temperature_2m&timezone=America/Bogota';

// Utilidades
const aFahrenheit = c => Math.round(c * 9/5 + 32);
const nivelAQI = aqi => aqi <= 50? 'Bueno' : aqi <= 100? 'Moderado' : 'No saludable';

// 1. Función async que trae datos reales
async function obtenerDatosReales() {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '<p aria-live="polite">Cargando datos de Cali...</p>';

  try {
    // Promise.all lanza las dos peticiones en paralelo
    const [resAire, resClima] = await Promise.all([
      fetch(API_AIRE),
      fetch(API_CLIMA)
    ]);

    if (!resAire.ok ||!resClima.ok) throw new Error('Error en la red');

    const dataAire = await resAire.json();
    const dataClima = await resClima.json();

    // Mapeamos a nuestra estructura (simulamos 3 barrios con mismos datos)
    const base = {
      aqi: dataAire.current.us_aqi_pm2_5,
      pm25: dataAire.current.pm2_5,
      tempC: dataClima.current.temperature_2m
    };

    return [
      { id:1, barrio:'La Flora',...base, nivel: nivelAQI(base.aqi) },
      { id:2, barrio:'San Fernando',...base, nivel: nivelAQI(base.aqi) },
      { id:3, barrio:'Aguablanca',...base, nivel: nivelAQI(base.aqi) }
    ];

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p role="alert">No se pudo cargar el aire de Cali. Intenta recargar.</p>';
    return []; // devolvemos vacío para no romper render
  }
}

// 2. Filtros y render (igual que antes, pero con temp real)
const aplicarFiltros = estaciones => estaciones
 .filter(({ aqi }) => aqi >= 0) // ahora mostramos todo, el filtro AQI lo maneja el usuario
 .filter(({ barrio }) => barrio.toLowerCase().includes(estado.busqueda.toLowerCase()));

const renderEstaciones = estaciones => {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '';
  estaciones.forEach(({ barrio, aqi, nivel, tempC, pm25 }) => {
    const temp = estado.unidad === 'C'? `${tempC}°C` : `${aFahrenheit(tempC)}°F`;
    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.tabIndex = 0;
    card.innerHTML = `<h2>${barrio}</h2>
      <p>AQI: <strong>${aqi}</strong> — ${nivel}</p>
      <p>PM2.5: ${pm25} µg/m³</p>
      <p>Temp: ${temp}</p>`;
    contenedor.append(card);
  });
};

// 3. Orquestador async
let datosCali = [];

async function actualizarVista() {
  if (datosCali.length === 0) datosCali = await obtenerDatosReales();
  const filtradas = aplicarFiltros(datosCali);
  renderEstaciones(filtradas);
}

// Eventos (sin cambios)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#busqueda').addEventListener('input', e => {
    estado.busqueda = e.target.value.trim();
    actualizarVista();
  });
  document.querySelector('#toggle-temp').addEventListener('click', e => {
    estado.unidad = estado.unidad === 'C'? 'F' : 'C';
    e.target.textContent = estado.unidad === 'C'? 'Mostrar °F' : 'Mostrar °C';
    e.target.setAttribute('aria-pressed', estado.unidad === 'F');
    actualizarVista();
  });
  actualizarVista();
});