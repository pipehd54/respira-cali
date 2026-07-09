import { nivelAQI, aFahrenheit, claseAQI, emojiAQI, clasePM25 } from '../utils/logic.js';

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
    const avatar = aqiNum !== null ? emojiAQI(aqiNum) : '🌤️';

    // PM2.5 bar
    const pm25Num = typeof pm25 === 'number' ? pm25 : null;
    const barWidth = pm25Num !== null ? Math.min((pm25Num / 15) * 100, 100) : 0;
    const barClass = pm25Num !== null ? clasePM25(pm25Num) : 'pm25-bueno';

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <span class="card-avatar">${avatar}</span>
          <h2>${barrio}</h2>
        </div>
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
          <div class="pm25-bar-track">
            <div class="pm25-bar-fill ${barClass}" style="width: ${barWidth}%"></div>
          </div>
          <span class="pm25-limit-label">Límite OMS: 15 µg/m³</span>
        </div>
      </div>
    `;
    contenedor.append(card);
  });
}