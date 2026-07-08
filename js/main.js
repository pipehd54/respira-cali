// Datos con temperatura mock 
const estacionesMock = [
  { id: 1, barrio: 'La Flora', aqi: 42, nivel: 'Bueno', tempC: 24 },
  { id: 2, barrio: 'San Fernando', aqi: 78, nivel: 'Moderado', tempC: 26 },
  { id: 3, barrio: 'Aguablanca', aqi: 112, nivel: 'No saludable', tempC: 28 }
];

// Estado de la app 
const estado = {
  unidad: 'C', // 'C' o 'F'
  busqueda: ''
};

// Utilidad: convierte temperatura
const aFahrenheit = (c) => Math.round((c * 9/5) + 32);

// Filtro combinado: AQI malo + búsqueda por texto
const aplicarFiltros = (estaciones) => {
  return estaciones
    .filter(({ aqi }) => aqi >= 51)
    .filter(({ barrio }) => 
      barrio.toLowerCase().includes(estado.busqueda.toLowerCase())
    );
};

// Render: ahora muestra temperatura según unidad
const renderEstaciones = (estaciones) => {
  const contenedor = document.querySelector('#estaciones');
  contenedor.innerHTML = '';
  
  estaciones.forEach(({ barrio, aqi, nivel, tempC }) => {
    const temp = estado.unidad === 'C' ? `${tempC}°C` : `${aFahrenheit(tempC)}°F`;
    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.tabIndex = 0; // hace la tarjeta enfocable con teclado
    card.innerHTML = `
      <h2>${barrio}</h2>
      <p>AQI: <strong>${aqi}</strong> — ${nivel}</p>
      <p>Temp: ${temp}</p>
    `;
    contenedor.append(card);
  });
};

// Orquestador
const actualizarVista = () => {
  const filtradas = aplicarFiltros(estacionesMock);
  renderEstaciones(filtradas);
};

// Eventos
document.addEventListener('DOMContentLoaded', () => {
  const inputBusqueda = document.querySelector('#busqueda');
  const btnTemp = document.querySelector('#toggle-temp');

  // 1. Buscar mientras escribes
  inputBusqueda.addEventListener('input', (e) => {
    estado.busqueda = e.target.value.trim();
    actualizarVista();
  });

  // 2. Toggle °C/°F
  btnTemp.addEventListener('click', () => {
    estado.unidad = estado.unidad === 'C' ? 'F' : 'C';
    btnTemp.textContent = estado.unidad === 'C' ? 'Mostrar °F' : 'Mostrar °C';
    btnTemp.setAttribute('aria-pressed', estado.unidad === 'F');
    actualizarVista();
  });

  actualizarVista(); // render inicial
});