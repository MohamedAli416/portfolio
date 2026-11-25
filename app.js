(() => {
  document.querySelectorAll('img[data-img]').forEach(i => { const [a, b] = i.dataset.img.split('.'); i.src = b ? window.IMG[a][b] : window.IMG[a]; });
  const slides = [...document.querySelectorAll('.slide')];
  const pills = [...document.querySelectorAll('.pills button')];
  const counter = document.getElementById('counter');
  let cur = -1, lock = false, wheelAcc = 0, wheelT;

  const pad = n => String(n + 1).padStart(2, '0');

  function go(i, instant) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === cur) return;
    const prev = slides[cur];
    if (prev) { prev.classList.remove('active'); prev.classList.add('leaving'); setTimeout(() => prev.classList.remove('leaving'), 1000); }
    slides[i].classList.add('active');
    cur = i;
    const nav = +slides[i].dataset.nav;
    pills.forEach(p => p.classList.toggle('on', +p.dataset.go === nav));
    counter.textContent = pad(i);
    history.replaceState(null, '', '#' + (i + 1));
    lock = true;
    setTimeout(() => (lock = false), instant ? 0 : 1100);
  }
  const next = () => !lock && go(cur + 1);
  const prev = () => !lock && go(cur - 1);

  pills.forEach(p => p.addEventListener('click', () => { lock = false; go(+p.dataset.go); }));

  addEventListener('wheel', e => {
    e.preventDefault();
    wheelAcc += e.deltaY + e.deltaX;
    clearTimeout(wheelT);
    wheelT = setTimeout(() => (wheelAcc = 0), 160);
    if (Math.abs(wheelAcc) > 40 && !lock) { wheelAcc > 0 ? next() : prev(); wheelAcc = 0; }
  }, { passive: false });

  addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
  });

  let sy = null, sx = null;
  addEventListener('touchstart', e => { sy = e.touches[0].clientY; sx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (sy === null) return;
    const dy = sy - e.changedTouches[0].clientY, dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) dy > 0 ? next() : prev();
    sy = null;
  }, { passive: true });
  addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  const start = Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1);
  go(start, true);
})();
