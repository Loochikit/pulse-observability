/**
 * Pulse Observability - Telemetry Logic & Anomalies Engine
 */

class ServerSimulator {
  constructor(id, name, ip) {
    this.id = id;
    this.name = name;
    this.ip = ip;
    
    // Métricas iniciales base
    this.cpu = 15 + Math.random() * 15;
    this.memory = 30 + Math.random() * 10;
    this.networkIn = 1.2; // MB/s
    this.networkOut = 0.8; // MB/s
    this.disk = 45.2; // % estático
    this.latency = 20 + Math.random() * 10; // ms
    
    // Estado y Anomalías activas
    this.status = 'healthy'; // healthy, warning, critical
    this.activeAnomaly = null; // ddos, memory_leak, cpu_spike
    this.leakRate = 0;
    this.cpuTarget = null;
    this.anomalyTimer = 0;
  }

  update() {
    // 1. Simulación normal con ruido browniano sutil
    const noise = () => (Math.random() - 0.5) * 4;

    if (!this.activeAnomaly) {
      // Modulación normal
      this.cpu = Math.max(5, Math.min(95, this.cpu + noise()));
      this.memory = Math.max(10, Math.min(95, this.memory + (Math.random() - 0.5) * 0.5));
      this.networkIn = Math.max(0.1, this.networkIn + (Math.random() - 0.5) * 0.2);
      this.networkOut = Math.max(0.1, this.networkOut + (Math.random() - 0.5) * 0.15);
      this.latency = Math.max(5, Math.min(120, this.latency + (Math.random() - 0.5) * 3));
    } else {
      // 2. Aplicar comportamiento de Anomalías
      this.anomalyTimer++;

      if (this.activeAnomaly === 'cpu_spike') {
        // Rampa rápida hacia el 92%-98% de CPU
        this.cpu = this.cpu * 0.7 + 95 * 0.3 + (Math.random() - 0.5) * 2;
        this.latency = this.latency * 0.8 + 250 * 0.2 + (Math.random() - 0.5) * 10;
      } 
      else if (this.activeAnomaly === 'memory_leak') {
        // Rampa incremental continua de memoria
        this.leakRate += 0.05;
        this.memory = Math.min(99.5, this.memory + this.leakRate);
        this.cpu = Math.max(5, Math.min(95, this.cpu + noise() * 0.5));
        if (this.memory > 90) {
          this.latency = this.latency * 0.9 + 400 * 0.1; // Descenso severo por swap de disco
        }
      } 
      else if (this.activeAnomaly === 'ddos') {
        // Tráfico de red masivo de entrada y CPU colapsado
        this.networkIn = this.networkIn * 0.6 + 480 * 0.4 + (Math.random() - 0.5) * 20;
        this.networkOut = this.networkOut * 0.6 + 65 * 0.4 + (Math.random() - 0.5) * 5;
        this.cpu = this.cpu * 0.8 + 89 * 0.2 + (Math.random() - 0.5) * 3;
        this.latency = this.latency * 0.7 + 600 * 0.3 + (Math.random() - 0.5) * 30;
      }
    }

    // 3. Evaluar reglas de estado según umbrales técnicos
    let oldStatus = this.status;
    if (this.cpu > 85 || this.memory > 90 || this.latency > 350) {
      this.status = 'critical';
    } else if (this.cpu > 65 || this.memory > 75 || this.latency > 150) {
      this.status = 'warning';
    } else {
      this.status = 'healthy';
    }

    return {
      statusChanged: oldStatus !== this.status,
      oldStatus: oldStatus,
      newStatus: this.status
    };
  }

  triggerAnomaly(type) {
    this.activeAnomaly = type;
    this.anomalyTimer = 0;
    this.leakRate = 0;
  }

  clearAnomaly() {
    this.activeAnomaly = null;
    this.anomalyTimer = 0;
    this.leakRate = 0;
    this.cpu = 15 + Math.random() * 15;
    this.memory = 30 + Math.random() * 10;
    this.networkIn = 1.2;
    this.networkOut = 0.8;
    this.latency = 20 + Math.random() * 10;
  }
}

// Inicialización de Servidores
const servers = [
  new ServerSimulator('srv-alpha', 'Microservice Alpha (User-Auth)', '10.0.0.12'),
  new ServerSimulator('srv-beta', 'Microservice Beta (API Gateway)', '10.0.0.13'),
  new ServerSimulator('srv-gamma', 'Microservice Gamma (Inventory-DB)', '10.0.0.14'),
  new ServerSimulator('srv-delta', 'Microservice Delta (Payment-Gateway)', '10.0.0.15')
];

// Instancias de Gráficas de Canvas
const charts = {};

// Inicialización general al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Gráficas en Canvas
  charts['srv-alpha'] = new TelemetryChart('chart-alpha', 'CPU/Latency Alpha', 'rgba(0, 240, 255, 1)');
  charts['srv-beta'] = new TelemetryChart('chart-beta', 'CPU/Latency Beta', 'rgba(255, 0, 127, 1)');
  charts['srv-gamma'] = new TelemetryChart('chart-gamma', 'CPU/Latency Gamma', 'rgba(0, 240, 255, 1)');
  charts['srv-delta'] = new TelemetryChart('chart-delta', 'CPU/Latency Delta', 'rgba(255, 0, 127, 1)');

  // Iniciar bucle del motor de telemetría (actualización cada 1 segundo)
  setInterval(tickTelemetry, 1000);

  // Registro de Logs Inicial
  addLogLine('System', 'Pulse Telemetry Engine iniciado exitosamente.', 'info');
  addLogLine('System', 'Monitoreando 4 microservicios en topología mesh local.', 'info');
});

// Bucle principal de Telemetría
function tickTelemetry() {
  let globalHealthy = true;

  servers.forEach(server => {
    const report = server.update();
    
    // Actualizar UI del servidor
    updateServerUI(server);

    // Enviar datos al motor de gráficos
    if (charts[server.id]) {
      charts[server.id].push(server.cpu);
    }

    // Gestionar alertas en consola si cambia de estado
    if (report.statusChanged) {
      if (server.status === 'critical') {
        addLogLine(server.name, `ALERT CRITICAL: Uso crítico detectado en CPU/Latencia (${server.cpu.toFixed(1)}% | ${server.latency.toFixed(0)}ms).`, 'err');
      } else if (server.status === 'warning') {
        addLogLine(server.name, `ALERT WARNING: Parámetros del sistema por encima del umbral nominal (${server.cpu.toFixed(1)}% | ${server.memory.toFixed(1)}%).`, 'warn');
      } else if (server.status === 'healthy' && report.oldStatus !== 'healthy') {
        addLogLine(server.name, `System Restored: El microservicio ha regresado a niveles de operación saludables.`, 'info');
      }
    }

    // Si algún servidor no está saludable, el estado global cambia
    if (server.status !== 'healthy') {
      globalHealthy = false;
    }
  });

  // Actualizar indicador general de salud del sistema
  const statusDot = document.getElementById('global-status-dot');
  const statusText = document.getElementById('global-status-text');
  
  if (globalHealthy) {
    statusDot.style.backgroundColor = 'var(--state-normal)';
    statusDot.style.boxShadow = '0 0 10px var(--state-normal)';
    statusText.innerText = 'SISTEMA OPERANDO NOMINAL';
    statusText.style.color = 'var(--state-normal)';
  } else {
    // Si hay críticos es crítico, si solo hay warnings es warning
    const hasCritical = servers.some(s => s.status === 'critical');
    const color = hasCritical ? 'var(--state-critical)' : 'var(--state-warning)';
    statusDot.style.backgroundColor = color;
    statusDot.style.boxShadow = `0 0 10px ${color}`;
    statusText.innerText = hasCritical ? 'DEGRADACIÓN CRÍTICA DETECTADA' : 'SISTEMA EN RIESGO / ADVERTENCIA';
    statusText.style.color = color;
  }
}

// Renderizado directo a la UI
function updateServerUI(server) {
  const card = document.getElementById(server.id);
  if (!card) return;

  // Actualizar clases de estados de alerta
  card.className = `card server-card ${server.status}`;

  // Actualizar Badge de Estado
  const badge = card.querySelector('.server-status-badge');
  badge.innerText = server.status;

  // Actualizar Barra de CPU
  const cpuVal = card.querySelector('#' + server.id + '-cpu-val');
  const cpuBar = card.querySelector('#' + server.id + '-cpu-bar');
  cpuVal.innerText = server.cpu.toFixed(1) + '%';
  cpuBar.style.width = server.cpu + '%';
  cpuBar.className = `progress-bar ${server.status}`;

  // Actualizar Barra de Memoria
  const memVal = card.querySelector('#' + server.id + '-mem-val');
  const memBar = card.querySelector('#' + server.id + '-mem-bar');
  memVal.innerText = server.memory.toFixed(1) + '%';
  memBar.style.width = server.memory + '%';
  memBar.className = `progress-bar ${server.status}`;

  // Actualizar Latencia y Tráfico de Red
  card.querySelector('#' + server.id + '-latency').innerText = server.latency.toFixed(0) + ' ms';
  card.querySelector('#' + server.id + '-net-in').innerText = server.networkIn.toFixed(1);
  card.querySelector('#' + server.id + '-net-out').innerText = server.networkOut.toFixed(1);
}

// Disparador de Anomalías interactivo
function triggerIncident(type) {
  // Seleccionar un servidor objetivo semi-aleatorio o específico
  let targetServer = servers[0]; // Por defecto Alpha

  if (type === 'ddos') {
    targetServer = servers[1]; // API Gateway es ideal para DDoS
    addLogLine('System', `Simulación Iniciada: Lanzando ataque de denegación de servicio DDoS distribuido hacia ${targetServer.name}...`, 'warn');
  } 
  else if (type === 'memory_leak') {
    targetServer = servers[2]; // DB para Memory Leak
    addLogLine('System', `Simulación Iniciada: Inyectando fuga de memoria progresiva (Leak) en ${targetServer.name}...`, 'warn');
  } 
  else if (type === 'cpu_spike') {
    targetServer = servers[3]; // Payment Gateway para picos transaccionales
    addLogLine('System', `Simulación Iniciada: Generando pico transaccional masivo de CPU en ${targetServer.name}...`, 'warn');
  }

  targetServer.triggerAnomaly(type);
}

// Restauración de Sistemas
function clearIncidents() {
  addLogLine('System', 'Comando de restauración global enviado. Reiniciando contenedores de microservicios...', 'info');
  servers.forEach(server => {
    if (server.activeAnomaly) {
      server.clearAnomaly();
    }
  });
}

// Consola de Logs interactiva
function addLogLine(source, message, type = 'info') {
  const consoleElem = document.getElementById('logs-console');
  if (!consoleElem) return;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const logLine = document.createElement('div');
  logLine.className = `log-line ${type}`;
  
  logLine.innerHTML = `<span class="log-time">[${timeStr}]</span> <strong>[${source}]</strong> ${message}`;
  
  consoleElem.appendChild(logLine);
  
  // Auto scroll hacia el final de los logs
  consoleElem.scrollTop = consoleElem.scrollHeight;
}
