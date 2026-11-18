const scene = document.querySelector<HTMLElement>('[data-portrait-scene]');

if (scene) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingFrame = 0;
  let lastAngle = -1;

  const draw = () => {
    pendingFrame = 0;
    const { top } = scene.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewport * 0.93 - top) / (viewport * 0.65)));
    const angle = motion.matches ? 0 : Math.round(165 * (1 - progress ** 1.15));

    if (angle !== lastAngle) {
      scene.style.setProperty('--portrait-turn', `${angle}deg`);
      lastAngle = angle;
    }
  };

  const scheduleDraw = () => {
    if (!pendingFrame) pendingFrame = requestAnimationFrame(draw);
  };

  const syncMotion = () => {
    if (motion.matches) {
      window.removeEventListener('scroll', scheduleDraw);
      window.removeEventListener('resize', scheduleDraw);
    } else {
      window.addEventListener('scroll', scheduleDraw, { passive: true });
      window.addEventListener('resize', scheduleDraw);
    }
    scheduleDraw();
  };

  motion.addEventListener('change', syncMotion);
  window.addEventListener('pageshow', scheduleDraw);
  document.fonts.ready.then(scheduleDraw);
  syncMotion();
}
