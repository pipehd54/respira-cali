import { nivelAQI, aFahrenheit, claseAQI } from '../utils/logic.js';

export function renderEstaciones(estaciones, estado, contenedor) {
  contenedor.innerHTML = '';
  estaciones.forEach(({ barrio, aqi = '—', pm25 = '—', tempC = '—', lat, lon }) => {
    const temp = estado.unidad === 'C' ? `${tempC}°C` : `${aFahrenheit(tempC)}°F`;
    const esFav = estado.favoritos.some(f => f.barrio === barrio);
    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.dataset.barrio = barrio;
    card.dataset.lat = lat || '';
    card.dataset.lon = lon || '';
    card.tabIndex = 0;

    const aqiNum = typeof aqi === 'number' ? aqi : null;
    const aqiCls = aqiNum !== null ? claseAQI(aqiNum) : '';

    card.innerHTML = `
      <div class="card-header">
        <h2>${barrio}</h2>
        <div class="card-actions">
          <span class="temp-badge">${temp}</span>
          <button class="fav" aria-label="Favorito">${esFav ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="aqi-hero ${aqiCls}">
        <span class="aqi-value">${aqi}</span>
        <span class="aqi-label">AQI · ${nivelAQI(aqi)}</span>
      </div>
      <div class="card-metrics">
        <div class="metric">
          <span class="metric-label">PM2.5</span>
          <span class="metric-value">${pm25}</span>
          <span class="metric-unit">µg/m³</span>
        </div>
      </div>
    `;
    contenedor.append(card);
  });
}