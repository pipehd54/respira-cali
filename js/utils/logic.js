/**
 * Sanitiza una cadena de texto reemplazando caracteres especiales de HTML
 * para prevenir ataques XSS (Cross-Site Scripting).
 * 
 * @param {string} str - Texto plano a sanitizar
 * @returns {string} Texto seguro para usar en HTML
 */
export const escapeHTML = str => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, match => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[match];
  });
};

/**
 * Convierte grados Celsius a Fahrenheit redondeados.
 */
export const aFahrenheit = c => {
  if (typeof c !== 'number' || Number.isNaN(c)) return null;
  return Math.round((c * 9) / 5 + 32);
};

/**
 * Retorna la etiqueta descriptiva oficial US AQI para un valor numérico dado.
 */
export const nivelAQI = aqi => {
  if (typeof aqi !== 'number' || Number.isNaN(aqi)) return 'Desconocido';
  if (aqi <= 50) return 'Bueno';
  if (aqi <= 100) return 'Moderado';
  if (aqi <= 150) return 'Dañino para grupos sensibles';
  if (aqi <= 200) return 'No saludable';
  if (aqi <= 300) return 'Muy no saludable';
  return 'Peligroso';
};

/**
 * Retorna la clase CSS correspondiente al rango de AQI.
 */
export const claseAQI = aqi => {
  if (typeof aqi !== 'number' || Number.isNaN(aqi)) return 'aqi-desconocido';
  if (aqi <= 50) return 'aqi-bueno';
  if (aqi <= 100) return 'aqi-moderado';
  if (aqi <= 150) return 'aqi-danino';
  if (aqi <= 200) return 'aqi-nosaludable';
  if (aqi <= 300) return 'aqi-muynosaludable';
  return 'aqi-peligroso';
};

/**
 * Retorna el emoji representativo para el valor de AQI.
 */
export const emojiAQI = aqi => {
  if (typeof aqi !== 'number' || Number.isNaN(aqi)) return '🌤️';
  if (aqi <= 50) return '🌿';
  if (aqi <= 100) return '😷';
  if (aqi <= 150) return '⚠️';
  if (aqi <= 200) return '🚨';
  if (aqi <= 300) return '🟣';
  return '☠️';
};

/**
 * Retorna la clase CSS para el nivel de PM2.5 comparado con el límite OMS (15 µg/m³).
 */
export const clasePM25 = pm25 => {
  if (typeof pm25 !== 'number' || Number.isNaN(pm25)) return 'pm25-bueno';
  const ratio = pm25 / 15;
  if (ratio <= 1) return 'pm25-bueno';
  if (ratio <= 2) return 'pm25-moderado';
  if (ratio <= 3) return 'pm25-danino';
  return 'pm25-peligroso';
};