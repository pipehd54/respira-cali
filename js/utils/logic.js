export const nivelAQI = aqi => aqi <= 50 ? 'Bueno' : aqi <= 100 ? 'Moderado' : 'No saludable';
export const aFahrenheit = c => Math.round(c * 9 / 5 + 32);

export const claseAQI = aqi => {
  if (aqi <= 50) return 'aqi-bueno';
  if (aqi <= 100) return 'aqi-moderado';
  if (aqi <= 150) return 'aqi-danino';
  return 'aqi-peligroso';
};

export const emojiAQI = aqi => {
  if (aqi <= 50) return '🌿';
  if (aqi <= 100) return '😷';
  if (aqi <= 150) return '⚠️';
  return '🚨';
};

export const clasePM25 = pm25 => {
  const ratio = pm25 / 15;
  if (ratio <= 1) return 'pm25-bueno';
  if (ratio <= 2) return 'pm25-moderado';
  if (ratio <= 3) return 'pm25-danino';
  return 'pm25-peligroso';
};