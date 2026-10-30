/* tejido.js: el logo de Mosaico Telar tejiéndose, y la animación del hilo usada donde la plataforma "trabaja".

   La idea de la marca: nueve piezas unidas por cuatro hilos que se cruzan por encima y por debajo. Los cuatro hilos son
   los tres portales y la plataforma que los une: verde Kinesis, azul ValerIA, ámbar Wisfox y rosa Mosaico Telar.

   Cómo está dibujado (y por qué no hay costuras): los hilos van DETRÁS de una sola forma negra que ya trae las piezas y los
   puentes de "por debajo". Así el entretejido sale solo, y al quitar el color los hilos son espacio vacío limpio. Mientras
   se anima, las piezas aparecen una a una (nueve formas separadas); al terminar se cambia a la forma única, para que ninguna
   arista de una pieza deje una línea fina.

   Si la persona pide menos movimiento, se ve directamente el logo final. */
(function (MT) {
  'use strict';
  const { h, svg } = MT.ui;

  const LADO = 16; const HILO = 6; const PUENTE = 4; const R = 12;
  const CORTES = [0, 1, 2].map((k) => [2 + k * (LADO + HILO), 2 + k * (LADO + HILO) + LADO]);
  // Los cuatro hilos: verticales (izquierdo, derecho) y horizontales (superior, inferior).
  const COLOR = { v: ['var(--hilo-kinesis)', 'var(--hilo-wisfox)'], h: ['var(--hilo-valeria)', 'var(--hilo-mosaico)'] };
  const DURACION = 3400; // ms: cuando termina la animación y se pasa a la forma única

  function pieza(x0, y0, x1, y1, tl, tr, br, bl) {
    let d = `M${x0 + tl} ${y0}H${x1 - tr}`;
    if (tr) d += `a${tr} ${tr} 0 0 1 ${tr} ${tr}`;
    d += `V${y1 - br}`;
    if (br) d += `a${br} ${br} 0 0 1 -${br} ${br}`;
    d += `H${x0 + bl}`;
    if (bl) d += `a${bl} ${bl} 0 0 1 -${bl} -${bl}`;
    d += `V${y0 + tl}`;
    if (tl) d += `a${tl} ${tl} 0 0 1 ${tl} -${tl}`;
    return d + 'Z';
  }

  function geometria() {
    const piezas = [];
    CORTES.forEach(([y0, y1], j) => CORTES.forEach(([x0, x1], i) => piezas.push(pieza(x0, y0, x1, y1, i === 0 && j === 0 ? R : 0, i === 2 && j === 0 ? R : 0, i === 2 && j === 2 ? R : 0, i === 0 && j === 2 ? R : 0))));
    const puentes = []; const cruces = [];
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const cx = CORTES[a][1]; const cy = CORTES[b][1];
      if ((a + b) % 2 === 0) { // el hilo horizontal pasa por encima: el vertical se interrumpe
        puentes.push(`M${cx} ${cy - PUENTE}h${HILO}v${PUENTE}h-${HILO}Z`, `M${cx} ${cy + HILO}h${HILO}v${PUENTE}h-${HILO}Z`);
        cruces.push([cx, cy, COLOR.h[b]]);
      } else {                 // el vertical pasa por encima: el horizontal se interrumpe
        puentes.push(`M${cx - PUENTE} ${cy}h${PUENTE}v${HILO}h-${PUENTE}Z`, `M${cx + HILO} ${cy}h${PUENTE}v${HILO}h-${PUENTE}Z`);
        cruces.push([cx, cy, COLOR.v[a]]);
      }
    }
    return { piezas, puentes: puentes.join(''), cruces };
  }

  /* El logo. opciones: { animar: true, mono: false, clase: '' }. Devuelve { el, repetir, alternar, esMono }. */
  function logo(op) {
    const o = Object.assign({ animar: true, mono: false, clase: '' }, op);
    const g = geometria();
    const hilos = [
      ...[0, 1].map((a) => `<rect class="hilo hilo--v" style="--d:${0.55 + a * 0.45}s" x="${CORTES[a][1]}" y="2" width="${HILO}" height="60" fill="${COLOR.v[a]}"/>`),
      ...[0, 1].map((b) => `<rect class="hilo hilo--h" style="--d:${0.8 + b * 0.45}s" x="2" y="${CORTES[b][1]}" width="60" height="${HILO}" fill="${COLOR.h[b]}"/>`),
    ].join('');
    const cruces = g.cruces.map(([x, y, c], i) => `<rect class="cruce" style="--d:${1.75 + i * 0.1}s" x="${x}" y="${y}" width="${HILO}" height="${HILO}" fill="${c}"/>`).join('');
    const unica = g.piezas.join('') + g.puentes;
    const el = svg(`<svg class="logo-tejido ${o.clase}" viewBox="0 0 64 64" role="img" aria-label="Mosaico Telar: nueve piezas unidas por cuatro hilos de colores que se cruzan" focusable="false">
      <g class="hilos">${hilos}</g><g class="cruces">${cruces}</g>
      <path class="tela-unica" fill="currentColor" d="${unica}"/>
      <g class="piezas">${g.piezas.map((d, i) => `<path class="pieza" style="--i:${i}" fill="currentColor" d="${d}"/>`).join('')}<path class="puentes" fill="currentColor" d="${g.puentes}"/></g></svg>`);
    if (o.mono) el.classList.add('mono');
    let temporizador = null;
    const terminar = () => { el.classList.remove('tejiendo'); };
    const repetir = () => {
      clearTimeout(temporizador);
      el.classList.remove('tejiendo'); void el.getBoundingClientRect(); el.classList.add('tejiendo');
      temporizador = setTimeout(terminar, DURACION);
    };
    if (o.animar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) repetir();
    // Pasar de color a blanco y negro (y volver) mostrando las dos versiones de la marca.
    const alternar = () => { el.classList.toggle('mono'); return el.classList.contains('mono'); };
    return { el, repetir, alternar, esMono: () => el.classList.contains('mono') };
  }

  // Compatibilidad con la bienvenida: el logo que se teje.
  const logoTejido = () => logo({ animar: true });
  // La versión a color, quieta, para piezas de presentación, planes y la página de marca.
  const logoColor = (clase) => logo({ animar: false, clase: clase || '' }).el;

  /* Un cargador: el mismo telar, con los hilos subiendo y bajando sin parar. Para esperas reales (un portal que carga). */
  function cargador(clase) {
    const e = logo({ animar: false, clase: 'logo-cargador ' + (clase || '') }).el;
    e.classList.add('cargando');
    e.setAttribute('role', 'img'); e.setAttribute('aria-label', 'Cargando');
    return e;
  }

  /* Una barra de cuatro hilos que cruza la parte de arriba cada vez que se cambia de pantalla: dice "estoy tejiendo la siguiente". */
  function progreso() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let b = document.getElementById('progreso-hilos');
    if (!b) { b = h('div', { id: 'progreso-hilos', 'aria-hidden': 'true' }, ['kinesis', 'valeria', 'wisfox', 'mosaico'].map((c) => h('span', { class: 'hilo-' + c }))); document.body.append(b); }
    b.classList.remove('corre'); void b.offsetWidth; b.classList.add('corre');
  }

  /* Revelado al desplazarse: las secciones y tarjetas entran con un pequeño movimiento cuando llegan a la vista. */
  let observador = null;
  function revelar(main) {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (observador) observador.disconnect();
    observador = new IntersectionObserver((entradas) => entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); observador.unobserve(e.target); } }), { threshold: 0.12 });
    main.querySelectorAll('.seccion, .rol-tarjeta, .plan-tarjeta, .portal, .servicio').forEach((x, i) => { x.classList.add('revela'); x.style.setProperty('--r', String((i % 5) * 70) + 'ms'); observador.observe(x); });
  }

  MT.tejido = { logo, logoTejido, logoColor, cargador, progreso, revelar };
})(window.MT = window.MT || {});
