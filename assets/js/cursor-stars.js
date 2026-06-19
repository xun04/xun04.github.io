(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (prefersReducedMotion || isCoarsePointer) return;

  const style = document.createElement('style');
  style.textContent = `
    .cursor-star {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      font-family: serif;
      font-size: var(--star-size, 12px);
      line-height: 1;
      color: var(--star-color, #f5c542);
      text-shadow: 0 0 6px currentColor;
      transform: translate(-50%, -50%) rotate(var(--star-rotate, 0deg)) scale(var(--star-scale, 1));
      animation: cursor-star-trail 850ms ease-out forwards;
      will-change: transform, opacity;
    }

    @keyframes cursor-star-trail {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(var(--star-rotate, 0deg)) scale(var(--star-scale, 1));
      }
      100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--star-drift-x, 0px)), calc(-50% + var(--star-drift-y, -24px))) rotate(calc(var(--star-rotate, 0deg) + 90deg)) scale(0.25);
      }
    }
  `;
  document.head.appendChild(style);

  const symbols = ['✦', '✧', '✩', '⋆'];
  const colors = ['#f5c542', '#ffd166', '#ffef9f', '#9ad7ff', '#cdb4ff'];
  let lastSpawn = 0;

  function createStar(x, y) {
    const star = document.createElement('span');
    const size = 9 + Math.random() * 7;
    const driftX = (Math.random() - 0.5) * 34;
    const driftY = -18 - Math.random() * 28;

    star.className = 'cursor-star';
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.setProperty('--star-size', `${size}px`);
    star.style.setProperty('--star-color', colors[Math.floor(Math.random() * colors.length)]);
    star.style.setProperty('--star-rotate', `${Math.random() * 180}deg`);
    star.style.setProperty('--star-scale', `${0.75 + Math.random() * 0.7}`);
    star.style.setProperty('--star-drift-x', `${driftX}px`);
    star.style.setProperty('--star-drift-y', `${driftY}px`);

    document.body.appendChild(star);
    window.setTimeout(() => star.remove(), 900);
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;

    const now = performance.now();
    if (now - lastSpawn < 28) return;
    lastSpawn = now;

    createStar(event.clientX, event.clientY);
  });
})();
