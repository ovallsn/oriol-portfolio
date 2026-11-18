type Point = [number, number, number];

const steps = 156;
const sides = 12;
const layers = 16;
const points: Point[] = [];

function center(t: number): Point {
  const radius = 1.37 + 0.57 * Math.cos(3 * t);
  return [radius * Math.cos(2 * t), radius * Math.sin(2 * t), 0.66 * Math.sin(3 * t)];
}

function cross(a: Point, b: Point): Point {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function unit(v: Point): Point {
  const length = Math.hypot(...v);
  return [v[0] / length, v[1] / length, v[2] / length];
}

// Build a tubular mesh around a trefoil curve. Each ring follows the tangent
// so the cross-section stays perpendicular to the curve as it winds around.
for (let i = 0; i < steps; i++) {
  const t = i / steps * Math.PI * 2;
  const origin = center(t);
  const near = center(t + 0.001);
  const tangent = unit([near[0] - origin[0], near[1] - origin[1], near[2] - origin[2]]);
  const binormal = unit(cross(tangent, [Math.cos(2 * t), Math.sin(2 * t), 0]));
  const normal = cross(binormal, tangent);

  for (let j = 0; j < sides; j++) {
    const angle = j / sides * Math.PI * 2 + t * 2;
    const a = Math.cos(angle) * 0.35;
    const b = Math.sin(angle) * 0.35;
    points.push([
      origin[0] + a * normal[0] + b * binormal[0],
      origin[1] + a * normal[1] + b * binormal[1],
      origin[2] + a * normal[2] + b * binormal[2],
    ]);
  }
}

const edges: [number, number][] = [];
for (let i = 0; i < steps; i++) {
  const next = (i + 1) % steps;
  for (let j = 0; j < sides; j++) {
    const from = i * sides + j;
    const around = (j + 1) % sides;
    edges.push([from, next * sides + j], [from, i * sides + around]);
    if ((i + j) % 2 === 0) edges.push([from, next * sides + around]);
  }
}

function initScene(scene: HTMLElement) {
  const canvas = scene.querySelector('canvas');
  const toggle = scene.querySelector('button');
  const label = toggle?.querySelector('span');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !toggle || !label) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const projected = points.map<Point>(() => [0, 0, 0]);
  const depth = Array.from({ length: layers }, () => [] as [number, number][]);
  let paused = motion.matches;
  let inView = true;
  let size = 0;
  let ink = '';
  let accent = '';
  let angle = 0.15;
  let tilt = 0;
  let targetTilting = 0;
  let targetTurning = 0;
  let turn = 0;
  let frame = 0;
  let lastDraw = 0;

  function draw() {
    if (!ctx || size === 0) return;
    const sx = Math.sin(0.42 + tilt);
    const cx = Math.cos(0.42 + tilt);
    const sy = Math.sin(angle + turn);
    const cy = Math.cos(angle + turn);
    const roll = 0.3;
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const scale = size * 0.19;

    for (let i = 0; i < points.length; i++) {
      const [x, y, z] = points[i];
      const a = x * cy - y * sy;
      const b = x * sy + y * cy;
      const c = b * cx - z * sx;
      const d = b * sx + z * cx;
      const perspective = 7 / (7 - d);
      const point = projected[i];
      point[0] = size / 2 + (a * cr - c * sr) * scale * perspective;
      point[1] = size / 2 + (a * sr + c * cr) * scale * perspective;
      point[2] = d;
    }

    for (const bucket of depth) bucket.length = 0;
    for (const edge of edges) {
      const z = (projected[edge[0]][2] + projected[edge[1]][2]) / 2;
      const layer = Math.max(0, Math.min(layers - 1, Math.floor((z + 2.5) / 5 * layers)));
      depth[layer].push(edge);
    }

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(0.45, size / 560);
    for (let i = 0; i < layers; i++) {
      ctx.beginPath();
      for (const [from, to] of depth[i]) {
        ctx.moveTo(projected[from][0], projected[from][1]);
        ctx.lineTo(projected[to][0], projected[to][1]);
      }
      ctx.globalAlpha = 0.17 + 0.73 * (i / (layers - 1)) ** 1.6;
      ctx.stroke();
    }

    ctx.fillStyle = accent;
    for (const index of [96, 690, 1173, 1518]) {
      const [x, y, z] = projected[index];
      ctx.globalAlpha = z > 0 ? 0.84 : 0.32;
      ctx.beginPath();
      ctx.arc(x, y, z > 0 ? 2.05 : 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function measure() {
    if (!canvas || !ctx) return;
    size = canvas.getBoundingClientRect().width;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * ratio);
    canvas.height = canvas.width;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const colors = getComputedStyle(scene);
    ink = colors.color;
    accent = colors.getPropertyValue('--accent-strong').trim() || ink;
    draw();
  }

  function animate(time: number) {
    if (time - lastDraw >= 32) {
      angle += Math.min(time - lastDraw, 50) * 0.00016;
      tilt += (targetTilting - tilt) * 0.085;
      turn += (targetTurning - turn) * 0.085;
      lastDraw = time;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    if (!toggle || !label) return;
    scene.dataset.paused = String(paused);
    label.textContent = (paused ? toggle.dataset.play : toggle.dataset.pause) ?? '';
    if (paused || !inView || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (frame === 0) {
      lastDraw = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  motion.addEventListener('change', (event) => {
    paused = event.matches;
    sync();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const bounds = canvas.getBoundingClientRect();
    targetTilting = 0.3 * (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
    targetTurning = 0.45 * (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
  });
  canvas.addEventListener('pointerleave', () => {
    targetTilting = 0;
    targetTurning = 0;
  });

  new ResizeObserver(measure).observe(canvas);
  new MutationObserver(measure).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(scene);
  document.addEventListener('visibilitychange', sync);

  measure();
  sync();
}

document.querySelectorAll<HTMLElement>('[data-hero-scene]').forEach(initScene);
