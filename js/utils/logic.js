export const nivelAQI = aqi => aqi <= 50 ? 'Bueno' : aqi <= 100 ? 'Moderado' : 'No saludable';
export const aFahrenheit = c => Math.round(c * 9 / 5 + 32);

export const claseAQI = aqi => {
  if (aqi <= 50) return 'aqi-bueno';
  if (aqi <= 100) return 'aqi-moderado';
  if (aqi <= 150) return 'aqi-danino';
  return 'aqi-peligroso';
};