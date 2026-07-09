export const nivelAQI = aqi => aqi <= 50 ? 'Bueno' : aqi <= 100 ? 'Moderado' : 'No saludable';
export const aFahrenheit = c => Math.round(c * 9/5 + 32);