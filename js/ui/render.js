import { nivelAQI, aFahrenheit } from '../utils/logic.js';

export function renderEstaciones(estaciones, estado, contenedor) {
  contenedor.innerHTML = '';
  estaciones.forEach(({ barrio, aqi, pm25, tempC }) => {
    const temp = estado.unidad === 'C' ? `${tempC}°C` : `${aFahrenheit(tempC)}°F`;
    const esFav = estado.favoritos.includes(barrio);
    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.dataset.barrio = barrio;
    card.tabIndex = 0;
    card.innerHTML = `
      <h2>${barrio} <button class="fav" aria-label="Favorito">${esFav ? '★' : '☆'}</button></h2>
      <p>AQI: <strong>${aqi}</strong> — ${nivelAQI(aqi)}</p>
      <p>PM2.5: ${pm25} µg/m³</p>
      <p>Temp: ${temp}</p>
    `;
    contenedor.append(card);
  });
}