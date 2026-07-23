import { describe, it, expect } from 'vitest';
import {
  nivelAQI,
  aFahrenheit,
  claseAQI,
  emojiAQI,
  clasePM25,
  escapeHTML
} from '../js/utils/logic.js';

describe('Respira Cali logic - AQI y Clima', () => {
  it('clasifica todos los niveles oficiales de US AQI correctamente', () => {
    expect(nivelAQI(25)).toBe('Bueno');
    expect(nivelAQI(75)).toBe('Moderado');
    expect(nivelAQI(125)).toBe('Dañino para grupos sensibles');
    expect(nivelAQI(175)).toBe('No saludable');
    expect(nivelAQI(250)).toBe('Muy no saludable');
    expect(nivelAQI(350)).toBe('Peligroso');
  });

  it('maneja valores no numéricos o nulos en nivelAQI sin fallar', () => {
    expect(nivelAQI(null)).toBe('Desconocido');
    expect(nivelAQI(undefined)).toBe('Desconocido');
    expect(nivelAQI('—')).toBe('Desconocido');
    expect(nivelAQI(NaN)).toBe('Desconocido');
  });

  it('asigna clases CSS de AQI acordes a los rangos', () => {
    expect(claseAQI(40)).toBe('aqi-bueno');
    expect(claseAQI(90)).toBe('aqi-moderado');
    expect(claseAQI(140)).toBe('aqi-danino');
    expect(claseAQI(180)).toBe('aqi-nosaludable');
    expect(claseAQI(220)).toBe('aqi-muynosaludable');
    expect(claseAQI(320)).toBe('aqi-peligroso');
    expect(claseAQI(null)).toBe('aqi-desconocido');
  });

  it('devuelve el emoji representativo correcto', () => {
    expect(emojiAQI(30)).toBe('🌿');
    expect(emojiAQI(80)).toBe('😷');
    expect(emojiAQI(130)).toBe('⚠️');
    expect(emojiAQI(180)).toBe('🚨');
    expect(emojiAQI(250)).toBe('🟣');
    expect(emojiAQI(400)).toBe('☠️');
    expect(emojiAQI('invalid')).toBe('🌤️');
  });

  it('convierte temperatura de Celsius a Fahrenheit', () => {
    expect(aFahrenheit(0)).toBe(32);
    expect(aFahrenheit(25)).toBe(77);
    expect(aFahrenheit(-10)).toBe(14);
    expect(aFahrenheit(null)).toBe(null);
  });

  it('clasifica PM2.5 según límites de la OMS (15 µg/m³)', () => {
    expect(clasePM25(10)).toBe('pm25-bueno');
    expect(clasePM25(25)).toBe('pm25-moderado');
    expect(clasePM25(40)).toBe('pm25-danino');
    expect(clasePM25(60)).toBe('pm25-peligroso');
  });

  it('sanitiza cadenas HTML para prevenir XSS', () => {
    expect(escapeHTML('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(escapeHTML('San Fernando & Granada'))
      .toBe('San Fernando &amp; Granada');
    expect(escapeHTML(123)).toBe('');
  });
});