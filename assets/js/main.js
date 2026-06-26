/* main.js — header state, mobile nav, scroll reveals, year, comparison slider */
(function () {
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();

// Before/after comparison slider: auto-animates, switches to manual on interaction
document.querySelectorAll('.compare').forEach(function (c) {
  var frame = c.querySelector('.compare__frame');
  var handle = c.querySelector('.compare__handle');
  var arTags = c.querySelector('.compare__tags--ar');
  var esTags = c.querySelector('.compare__tags--es');
  if (!frame) return;
  var pos = 50, dragging = false, auto = true, inView = false, raf = null, lastTs = null, phase = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { auto = false; pos = 52; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function apply() {
    frame.style.setProperty('--pos', pos + '%');
    if (handle) handle.setAttribute('aria-valuenow', Math.round(100 - pos));
    if (arTags) arTags.style.opacity = clamp((62 - pos) / 26, 0, 1);
    if (esTags) esTags.style.opacity = clamp((pos - 38) / 26, 0, 1);
  }
  function step(ts) {
    if (!auto || !inView) { raf = null; lastTs = null; return; }
    if (lastTs == null) lastTs = ts;
    phase += (ts - lastTs) / 1000 * (2 * Math.PI / 7);
    lastTs = ts;
    pos = 50 + 30 * Math.sin(phase);
    apply();
    raf = window.requestAnimationFrame(step);
  }
  function startAuto() { if (auto && inView && raf == null) { lastTs = null; raf = window.requestAnimationFrame(step); } }
  function stopRaf() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } lastTs = null; }
  function goManual() { auto = false; stopRaf(); }
  function setFromX(clientX) {
    var r = frame.getBoundingClientRect();
    pos = clamp(((clientX - r.left) / r.width) * 100, 2, 98);
    apply();
  }
  frame.addEventListener('pointerdown', function (e) {
    goManual(); dragging = true;
    try { frame.setPointerCapture(e.pointerId); } catch (err) {}
    setFromX(e.clientX);
  });
  frame.addEventListener('pointermove', function (e) { if (dragging) setFromX(e.clientX); });
  frame.addEventListener('pointerup', function () { dragging = false; });
  frame.addEventListener('pointercancel', function () { dragging = false; });
  if (handle) {
    handle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goManual(); pos = clamp(pos - 3, 2, 98); apply(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goManual(); pos = clamp(pos + 3, 2, 98); apply(); e.preventDefault(); }
    });
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { inView = en.isIntersecting; if (inView) startAuto(); else stopRaf(); });
    }, { threshold: 0.25 });
    io2.observe(frame);
  } else { inView = true; startAuto(); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopRaf(); else startAuto(); });
  apply();
});

// Leader lines: fan from each tag to a point on the cow
(function () {
  var SVGNS = 'http://www.w3.org/2000/svg';
  var AR = [[58, 37], [62, 48], [57, 58], [54, 65], [62, 72], [59, 81], [60, 90]];
  var ES = [[41, 64], [44, 84]];
  function draw() {
    document.querySelectorAll('.compare').forEach(function (c) {
      var frame = c.querySelector('.compare__frame');
      if (!frame) return;
      var fr = frame.getBoundingClientRect();
      if (!fr.width) return;
      c.querySelectorAll('.compare__tags').forEach(function (grp) {
        var svg = grp.querySelector('.compare__leaders');
        if (!svg) return;
        var isAr = grp.classList.contains('compare__tags--ar');
        var dots = isAr ? AR : ES;
        var side = isAr ? 'right' : 'left';
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        var pills = grp.querySelectorAll('.ctag');
        pills.forEach(function (p, i) {
          if (i >= dots.length) return;
          var r = p.getBoundingClientRect();
          var axpx = side === 'right' ? r.left : r.right;
          var ax = (axpx - fr.left) / fr.width * 100;
          var ay = (r.top + r.height / 2 - fr.top) / fr.height * 100;
          var dx = dots[i][0], dy = dots[i][1];
          var kx = side === 'right' ? ax - 4 : ax + 4;
          var line = document.createElementNS(SVGNS, 'polyline');
          line.setAttribute('points', ax + ',' + ay + ' ' + kx + ',' + ay + ' ' + dx + ',' + dy);
          svg.appendChild(line);
          var dot = document.createElementNS(SVGNS, 'circle');
          dot.setAttribute('cx', dx); dot.setAttribute('cy', dy); dot.setAttribute('r', '1.1');
          svg.appendChild(dot);
        });
      });
    });
  }
  window.addEventListener('resize', draw);
  window.addEventListener('load', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  setTimeout(draw, 300); setTimeout(draw, 900);
  draw();
})();
