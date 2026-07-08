// main.js - Punto de entrada ES2024+
const estacionesMock = [
  { id: 1, barrio: 'La Flora', aqi: 42, nivel: 'Bueno' },
  { id: 2, barrio: 'San Fernando', aqi: 78, nivel: 'Moderado' },
  { id: 3, barrio: 'Aguablanca', aqi: 112, nivel: 'No saludable' }
];

const renderEstaciones = (estaciones) => {
  const contenedor = document.querySelector('#estaciones');
  
  estaciones.forEach(({ barrio, aqi, nivel }) => {
    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.innerHTML = `
      <h2>${barrio}</h2>
      <p>AQI: <strong>${aqi}</strong></p>
      <span class = "${nivel.toLowerCase()}">${nivel}</span>
    `;
    contenedor.append(card);
  });
};

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderEstaciones(estacionesMock);
});