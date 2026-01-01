<script>
  (function () {
    const wraps = Array.from(document.querySelectorAll('main.wrap'));
    const navRoot = document.getElementById('cardNav');
    if (!wraps.length || !navRoot) return;

    // Crear botones en la barra según tarjetas
    wraps.forEach((w, idx) => {
      if (!w.id) w.id = `c${idx + 1}`;
      const label = w.getAttribute('data-label') || `Carta ${idx + 1}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'navBtn';
      btn.textContent = label;
      btn.dataset.target = `#${w.id}`;

      btn.addEventListener('click', () => {
        const target = document.querySelector(btn.dataset.target);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      navRoot.appendChild(btn);
    });

    const navButtons = Array.from(navRoot.querySelectorAll('.navBtn'));

    // Marcar tarjeta activa + botón activo
    const setActiveByWrap = (activeWrap) => {
      wraps.forEach(w => w.classList.toggle('is-active', w === activeWrap));
      navButtons.forEach(b => {
        const isActive = b.dataset.target === `#${activeWrap.id}`;
        b.classList.toggle('is-active', isActive);
      });
    };

    // IntersectionObserver para detectar cuál tarjeta estás viendo
    const io = new IntersectionObserver((entries) => {
      // Elegimos la más visible
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveByWrap(visible.target);
    }, {
      root: null,
      threshold: [0.25, 0.40, 0.55, 0.70]
    });

    wraps.forEach(w => io.observe(w));

    // Estado inicial: primera tarjeta
    setActiveByWrap(wraps[0]);

    // Botón demo por tarjeta (sin IDs duplicados)
    document.querySelectorAll('.btnDemo').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('main.wrap');
        if (!wrap) return;

        const dateEl = wrap.querySelector('.dateText');
        const toEl = wrap.querySelector('.toName');
        const fromEl = wrap.querySelector('.fromName');

        if (dateEl) dateEl.textContent = "1 de enero";
        if (toEl) toEl.textContent = "Mamá (Nombre aquí)";
        if (fromEl) fromEl.textContent = "Gabo";
      });
    });

    // Navegación con teclado (← →)
    let currentIndex = 0;
    const getActiveIndex = () => wraps.findIndex(w => w.classList.contains('is-active'));
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

      const active = getActiveIndex();
      currentIndex = active >= 0 ? active : 0;

      if (e.key === 'ArrowRight') currentIndex = Math.min(wraps.length - 1, currentIndex + 1);
      if (e.key === 'ArrowLeft') currentIndex = Math.max(0, currentIndex - 1);

      wraps[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

  })();
</script>
