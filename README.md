# ⚡ Pulse Observability Engine // SRE Chaos Testbed

**Pulse** es un portal web interactivo de telemetría, observabilidad y simulación de incidentes en tiempo real para mallas de microservicios distribuidos. 

Este proyecto demuestra competencias avanzadas en **optimización de renderizado interactivo en el cliente**, **diseño visual premium (Glassmorphism)** y **modelado de pipelines de eventos syslog distribuidos** sin dependencias de librerías externas.

---

## 🚀 Características Clave

*   **Motor Gráfico HTML5 Canvas Nativo:** Gráficas de rendimiento fluido con curvas Bezier y gradientes de color dinámicos. Diseñado específicamente para evitar sobrecargas de procesamiento por el Garbage Collector (GC Spikes) reusando arrays de datos.
*   **Simulador de Caos e Incidentes (SRE Testbed):** Inyección manual de anomalías de red para auditar la respuesta del sistema:
    *   *Ataque DDoS Masivo:* Picos críticos de tráfico y latencia de red.
    *   *Fuga de Memoria (DB Memory Leak):* Pérdida progresiva y acumulación de RAM.
    *   *Pico de CPU de Transacciones:* Cargas de procesamiento repentinas en pasarelas de pago.
*   **Consola de Logs Distribuidos (Syslog Pipeline):** Procesamiento unificado de eventos de estado con colores reactivos basados en la severidad (Healthy, Warning, Critical).
*   **Diseño Visual de Vanguardia:** Interfaz premium con Glassmorphism (efectos translúcidos de cristal), paleta HSL adaptativa y micro-animaciones.

---

## 🛠️ Tecnologías Utilizadas

*   **Core:** HTML5 (Estructura semántica), JavaScript (Lógica de animación y simulación de eventos, ES6+).
*   **Diseño y Estilos:** CSS3 nativo (Variables CSS, Flexbox, CSS Grid, desenfoques `backdrop-filter`).
*   **Renderizado de Datos:** API de HTML5 Canvas (sin usar librerías externas de gráficos como Chart.js o D3).

---

## 💻 Ejecución Local

Dado que es una aplicación del lado del cliente (Frontend-Only), es extremadamente fácil de correr localmente:

1. **Opción A (Doble clic):** Abre el explorador de archivos y haz doble clic sobre el archivo `index.html` para abrirlo directamente en cualquier navegador moderno.
2. **Opción B (Servidor Estático Local):** Si tienes el servidor de Node del workspace activo, abre tu navegador e ingresa a:
   👉 **`http://localhost:3000/pulse_observability/index.html`**

---

## 💡 Conceptos de Ingeniería de Software Demostrados

*   **Eficiencia Gráfica en Canvas:** Implementación manual del refresco de pantalla mediante la API de dibujo en 2D. Optimización del consumo de memoria limpiando y reutilizando coordenadas en lugar de instanciar nuevos objetos en cada ciclo de pintado, reduciendo el trabajo de recolección de basura (*Garbage Collector Overhead*).
*   **Manejo de Estados de Telemetría:** Simulación determinista de anomalías de red basadas en modelos matemáticos para representar ataques DDoS (incremento exponencial de TPS y latencia) o fugas de memoria (acumulación aritmética progresiva).
*   **Diseño Modular:** Separación clara de responsabilidades entre el renderizador gráfico (`charts.js`) y la lógica de simulación de telemetría e incidencias (`telemetry.js`).
