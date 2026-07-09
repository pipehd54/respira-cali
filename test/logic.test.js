import { describe, it, expect } from 'vitest';
import { nivelAQI, aFahrenheit } from '../js/utils/logic.js';

describe('Respira Cali logic', () => {
  it('clasifica AQI', () => {
    expect(nivelAQI(42)).toBe('Bueno');
    expect(nivelAQI(78)).toBe('Moderado');
  });
  it('convierte temperatura', () => {
    expect(aFahrenheit(0)).toBe(32);
  });
});