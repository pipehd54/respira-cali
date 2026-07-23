# Respira Cali

![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=flat-square&logo=vercel)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES2024%2B-yellow?style=flat-square&logo=javascript)

![Respira Cali](./banner.png)

Aplicación web ligera diseñada para consultar el estado de la calidad del aire y variables meteorológicas en tiempo real exclusivamente para la ciudad de Santiago de Cali, Colombia.

Demo en vivo: [https://respira-cali.vercel.app/](https://respira-cali.vercel.app/)

## Características

- Índice de Calidad del Aire (AQI): Visualización clara de los niveles de contaminación y recomendaciones.
- Búsqueda por Barrio: Geocodificación integrada para consultar zonas específicas de Cali.
- Tema Claro / Oscuro: Detección del sistema y toggle manual con almacenamiento en localStorage.
- Ligera y Accesible: Construida sin frameworks pesados, aplicando optimizaciones como debounce y principios de accesibilidad (a11y).

## Tecnologías utilizadas

- Lenguaje: JavaScript ES2024+ (Módulos nativos)
- Estilos: CSS3 Vanilla (Variables CSS y diseño responsivo)
- API: Open-Meteo Air Quality & Weather API
- Testing: Vitest

## Instalación y desarrollo local

Para ejecutar este proyecto de manera local en tu máquina:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/pipchd54/respira-cali.git
   cd respira-cali
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar pruebas:
   ```bash
   npm test
   ```

---

Desarrollado por [Andrés Felipe Timote Daza](https://github.com/pipchd54)