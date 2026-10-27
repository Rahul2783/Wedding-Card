/**
 * High-performance Continuous & Interactive Flower Shower (पुष्प वर्षा) Engine
 * Spawns organic falling rose petals, marigold petals, and gold glitters
 * Supports Continuous Mode (ON by default) with instant Pause/Stop and Resume
 */

let canvasInstance = null;
let animFrameId = null;
let resizeHandler = null;
let isRunning = false;
let particles = [];

// Realistic Indian wedding flower petal color palette
const PETAL_COLORS = [
  { fill: '#b80c1d', stroke: '#70000e', type: 'rose' },       // Deep royal red rose
  { fill: '#db1d32', stroke: '#940a1b', type: 'rose' },       // Crimson rose
  { fill: '#ff4d64', stroke: '#c01525', type: 'rose' },       // Soft rose pink
  { fill: '#ff7700', stroke: '#c44e00', type: 'marigold' },   // Saffron orange marigold
  { fill: '#ffa600', stroke: '#b87100', type: 'marigold' },   // Golden yellow marigold
  { fill: '#ffc83b', stroke: '#d99b00', type: 'marigold' },   // Bright marigold
  { fill: '#ffd700', stroke: '#9b7b00', type: 'gold' },       // Gold leaf glitter
  { fill: '#fff2a8', stroke: '#d4a64a', type: 'gold' },       // Shimmering gold sparkle
];

function createParticle(width, height, randomY = true) {
  const colorObj = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -20 - Math.random() * 50,
    size: Math.random() * 12 + 10,
    color: colorObj.fill,
    stroke: colorObj.stroke,
    type: colorObj.type,
    speedY: Math.random() * 1.6 + 1.2, // Gentle graceful falling speed
    speedX: (Math.random() - 0.5) * 0.9,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 2.2,
    oscillationSpeed: Math.random() * 0.03 + 0.012,
    oscillationDistance: Math.random() * 2 + 0.8,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.25 + 0.75,
  };
}

function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;

  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.stroke;
  ctx.lineWidth = 1;

  ctx.beginPath();
  if (p.type === 'rose') {
    // Curved heart-shaped rose petal
    ctx.moveTo(0, -p.size * 0.5);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.75, p.size * 0.4, 0, p.size * 0.75);
    ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.4, -p.size * 0.6, -p.size * 0.6, 0, -p.size * 0.5);
  } else if (p.type === 'marigold') {
    // Teardrop marigold petal with natural fold
    ctx.ellipse(0, 0, p.size * 0.38, p.size * 0.68, 0.2, 0, Math.PI * 2);
  } else {
    // 4-point golden star sparkle / gold foil
    ctx.moveTo(0, -p.size * 0.4);
    ctx.lineTo(p.size * 0.32, 0);
    ctx.lineTo(0, p.size * 0.4);
    ctx.lineTo(-p.size * 0.32, 0);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Start continuous flower shower (ON by default)
 */
export function startContinuousFlowerShower(container = document.body) {
  if (isRunning) return;

  // Reduced motion preference check
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let canvas = document.getElementById('flower-shower-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'flower-shower-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.transition = 'opacity 0.4s ease';
    canvas.style.opacity = '1';
    container.appendChild(canvas);
  } else {
    canvas.style.opacity = '1';
  }

  canvasInstance = canvas;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const updateSize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  updateSize();
  resizeHandler = updateSize;
  window.addEventListener('resize', resizeHandler, { passive: true });

  // Density: ~38 particles on desktop, 20 on mobile for smooth 60 FPS
  const count = width < 768 ? 22 : 40;
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(width, height, true));
  }

  isRunning = true;

  function renderLoop() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.angle += p.oscillationSpeed;
      p.x += Math.sin(p.angle) * p.oscillationDistance + p.speedX;
      p.rotation += p.rotSpeed;

      // Wrap around smoothly when leaving bottom or side
      if (p.y > height + 25) {
        p.y = -20 - Math.random() * 40;
        p.x = Math.random() * width;
      }
      if (p.x < -30) p.x = width + 20;
      if (p.x > width + 30) p.x = -20;

      drawPetal(ctx, p);
    }

    animFrameId = requestAnimationFrame(renderLoop);
  }

  animFrameId = requestAnimationFrame(renderLoop);
}

/**
 * Stop continuous flower shower
 */
export function stopContinuousFlowerShower() {
  isRunning = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (canvasInstance) {
    canvasInstance.style.opacity = '0';
    setTimeout(() => {
      if (!isRunning && canvasInstance && canvasInstance.parentNode) {
        canvasInstance.parentNode.removeChild(canvasInstance);
        canvasInstance = null;
      }
    }, 450);
  }
}

/**
 * Quick celebratory burst shower (e.g. for guestbook submission or manual shower click)
 */
export function triggerCelebrationBurst(count = 25) {
  if (!isRunning) {
    startContinuousFlowerShower();
    return;
  }
  // If already running, inject extra flurry of petals at the top
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(width, height, false));
  }
  // Trim excess particles after a short while
  setTimeout(() => {
    if (particles.length > 45) {
      particles.splice(40);
    }
  }, 4000);
}
