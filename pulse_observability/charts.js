/**
 * Pulse Observability - Real-Time Canvas Charts
 * Motor gráfico ligero de alto rendimiento.
 */

class TelemetryChart {
  constructor(canvasId, label, color) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.label = label;
    this.color = color;
    this.dataPoints = [];
    this.maxPoints = 40; // Número máximo de puntos en el historial horizontal
    
    // Configurar densidades para displays Retina/High-DPI
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Escalado para resoluciones nítidas
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  push(value) {
    this.dataPoints.push(value);
    if (this.dataPoints.length > this.maxPoints) {
      this.dataPoints.shift();
    }
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    ctx.clearRect(0, 0, w, h);
    
    if (this.dataPoints.length < 2) return;

    // Dibujar rejilla de fondo sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    // Calcular coordenadas
    const stepX = w / (this.maxPoints - 1);
    const points = [];
    
    for (let i = 0; i < this.dataPoints.length; i++) {
      const val = this.dataPoints[i];
      // Ajustar margen vertical para que las líneas no se corten en los bordes
      const x = i * stepX;
      const y = h - (val / 100) * (h - 20) - 10;
      points.push({ x, y });
    }

    // 1. Dibujar área rellena con gradiente suave
    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, this.color.replace('1)', '0.25)'));
    grad.addColorStop(1, this.color.replace('1)', '0.0)'));
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Dibujar línea del trazo principal suavizada
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3. Dibujar punto indicador en la última métrica
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }
}
