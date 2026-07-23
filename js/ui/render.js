import { nivelAQI, aFahrenheit, claseAQI, emojiAQI, clasePM25, escapeHTML } from '../utils/logic.js';

export function renderEstaciones(estaciones, estado, contenedor) {
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (!estaciones || estaciones.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-state';
    emptyMsg.setAttribute('role', 'status');
    emptyMsg.textContent = 'No se encontraron estaciones ni barrios.';
    contenedor.appendChild(emptyMsg);
    return;
  }

  estaciones.forEach(({ barrio, aqi = '—', pm25 = '—', tempC = '—', lat, lon }) => {
    const tempNum = typeof tempC === 'number' && !Number.isNaN(tempC) ? tempC : null;
    const tempStr = tempNum !== null
      ? (estado.unidad === 'C' ? `${tempNum}°C` : `${aFahrenheit(tempNum)}°F`)
      : '—';

    const esFav = estado.favoritos.some(f => f.barrio === barrio);
    const barrioSanitizado = escapeHTML(barrio);

    const card = document.createElement('article');
    card.className = 'estacion-card';
    card.dataset.barrio = barrio;
    card.dataset.lat = lat || '';
    card.dataset.lon = lon || '';

    const aqiNum = typeof aqi === 'number' && !Number.isNaN(aqi) ? aqi : null;
    const aqiCls = aqiNum !== null ? claseAQI(aqiNum) : 'aqi-desconocido';
    const avatar = aqiNum !== null ? emojiAQI(aqiNum) : '🌤️';
    const aqiTexto = aqiNum !== null ? aqiNum : '—';
    const aqiLabel = nivelAQI(aqiNum);

    // PM2.5 bar
    const pm25Num = typeof pm25 === 'number' && !Number.isNaN(pm25) ? pm25 : null;
    const pm25Texto = pm25Num !== null ? pm25Num : '—';
    const barWidth = pm25Num !== null ? Math.min(Math.max((pm25Num / 15) * 100, 0), 100) : 0;
    const barClass = pm25Num !== null ? clasePM25(pm25Num) : 'pm25-bueno';

    const btnFavLabel = esFav
      ? `Eliminar ${barrioSanitizado} de favoritos`
      : `Guardar ${barrioSanitizado} en favoritos`;

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <span class="card-avatar" aria-hidden="true">${avatar}</span>
          <h2>${barrioSanitizado}</h2>
        </div>
        <div class="card-actions">
          <span class="temp-badge" aria-label="Temperatura actual ${tempStr}">${tempStr}</span>
          <button type="button" class="fav" aria-label="${btnFavLabel}" aria-pressed="${esFav}">${esFav ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="aqi-hero ${aqiCls}">
        <span class="aqi-value">${aqiTexto}</span>
        <span class="aqi-label">AQI · ${aqiLabel}</span>
      </div>
      <div class="card-metrics">
        <div class="metric">
          <span class="metric-label">PM2.5</span>
          <span class="metric-value">${pm25Texto}</span>
          <span class="metric-unit">µg/m³</span>
          <div class="pm25-bar-track" role="progressbar" aria-valuenow="${barWidth.toFixed(0)}" aria-valuemin="0" aria-valuemax="100" aria-label="Nivel PM2.5 respecto al límite OMS">
            <div class="pm25-bar-fill ${barClass}" style="width: ${barWidth}%"></div>
          </div>
          <span class="pm25-limit-label">Límite OMS: 15 µg/m³</span>
        </div>
      </div>
    `;
    contenedor.append(card);
  });
}