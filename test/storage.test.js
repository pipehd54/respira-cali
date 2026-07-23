import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cargarEstado, guardarEstado } from '../js/utils/storage.js';

describe('Respira Cali - storage.js', () => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true
    });
    globalThis.localStorage.clear();
  });

  it('retorna el estado predeterminado cuando localStorage está vacío', () => {
    const estado = cargarEstado();
    expect(estado).toEqual({
      unidad: 'C',
      busqueda: '',
      favoritos: [],
      tema: 'oscuro'
    });
  });

  it('sanitiza valores corruptos o maliciosos en localStorage', () => {
    globalThis.localStorage.setItem(
      'respira-cali-estado',
      JSON.stringify({
        unidad: 'INVALID_UNIT',
        tema: '<script>alert(1)</script>',
        favoritos: [{ barrio: ' San Fernando ', lat: 3.45, lon: -76.5 }, { invalid: true }]
      })
    );

    const estado = cargarEstado();
    expect(estado.unidad).toBe('C');
    expect(estado.tema).toBe('oscuro');
    expect(estado.favoritos).toEqual([
      { barrio: 'San Fernando', lat: 3.45, lon: -76.5 }
    ]);
  });

  it('guarda el estado correctamente', () => {
    const nuevoEstado = { unidad: 'F', tema: 'claro', favoritos: [{ barrio: 'Granada', lat: 3.45, lon: -76.5 }] };
    guardarEstado(nuevoEstado);

    const cargado = cargarEstado();
    expect(cargado.unidad).toBe('F');
    expect(cargado.tema).toBe('claro');
    expect(cargado.favoritos).toHaveLength(1);
  });
});
