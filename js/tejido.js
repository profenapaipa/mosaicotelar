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
  const EXTRA = 1;      // cuánto se mete cada hilo bajo las piezas vecinas
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
    // Cada pieza es un camino propio. Los puentes negros NO son una forma aparte: se suman a las dos piezas que unen.
    // Si fueran otra forma, el suavizado de bordes dejaría ver una línea clara entre el puente y la pieza (se notaba mientras
    // aparecían). Dentro de un mismo camino no hay borde que suavizar, y al estar el puente en los dos caminos, ninguno de sus
    // lados queda como arista entre formas distintas.
    const caminos = [];
    CORTES.forEach(([y0, y1], j) => { caminos[j] = []; CORTES.forEach(([x0, x1], i) => caminos[j][i] = [pieza(x0, y0, x1, y1, i === 0 && j === 0 ? R : 0, i === 2 && j === 0 ? R : 0, i === 2 && j === 2 ? R : 0, i === 0 && j === 2 ? R : 0)]); });
    // Quién pasa por encima en cada cruce (a = hilo vertical, b = hilo horizontal): se alterna, como en un tejido.
    const encima = (a, b) => ((a + b) % 2 === 0 ? 'h' : 'v');
    const une = (d, ...fichas) => fichas.forEach(([i, j]) => caminos[j][i].push(d));
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const cx = CORTES[a][1]; const cy = CORTES[b][1];
      if (encima(a, b) === 'h') {   // el vertical pasa por debajo: dos puentes en la columna del hilo, uno arriba y uno abajo del cruce
        const arriba = `M${cx} ${cy - PUENTE}h${HILO}v${PUENTE}h-${HILO}Z`; const abajo = `M${cx} ${cy + HILO}h${HILO}v${PUENTE}h-${HILO}Z`;
        une(arriba, [a, b], [a + 1, b]); une(abajo, [a, b + 1], [a + 1, b + 1]);
      } else {                      // el horizontal pasa por debajo: dos puentes en la fila del hilo, uno a cada lado del cruce
        const izq = `M${cx - PUENTE} ${cy}h${PUENTE}v${HILO}h-${PUENTE}Z`; const der = `M${cx + HILO} ${cy}h${PUENTE}v${HILO}h-${PUENTE}Z`;
        une(izq, [a, b], [a, b + 1]); une(der, [a + 1, b], [a + 1, b + 1]);
      }
    }
    const piezas = caminos.flat().map((p) => p.join(''));
    /* Los hilos de color, por tramos. Dos decisiones que evitan las líneas finas del borde:
       1. Donde un hilo pasa por debajo, su tramo termina DENTRO del puente negro (2 unidades), nunca en seco; y el hilo que pasa
          por encima lo cruza de una sola pieza. Así no hay cuadritos de "cruce" superpuestos, que dejaban rayas del mismo color.
       2. Cada tramo es 1 unidad más ancho que el espacio entre piezas y se mete debajo de ellas: si coincidieran borde con borde,
          el suavizado de los bordes dejaría ver el fondo como una línea clara entre la pieza y el hilo. */
    const hilos = [];
    const tramos = (desde, corte) => { const t = []; let ini = 2; for (const c of corte) { t.push([ini, c - 2]); ini = c + HILO + PUENTE - 2; } t.push([ini, 62]); return t; };
    for (let a = 0; a < 2; a++) {
      const cortes = [0, 1].filter((b) => encima(a, b) === 'h').map((b) => CORTES[b][1]);
      tramos(2, cortes).forEach(([i, f], k) => hilos.push({ eje: 'v', x: CORTES[a][1] - EXTRA, y: i, w: HILO + 2 * EXTRA, h: f - i, color: COLOR.v[a], d: 0.5 + a * 0.4 + k * 0.1 }));
    }
    for (let b = 0; b < 2; b++) {
      const cortes = [0, 1].filter((a) => encima(a, b) === 'v').map((a) => CORTES[a][1]);
      tramos(2, cortes).forEach(([i, f], k) => hilos.push({ eje: 'h', x: i, y: CORTES[b][1] - EXTRA, w: f - i, h: HILO + 2 * EXTRA, color: COLOR.h[b], d: 0.7 + b * 0.4 + k * 0.1 }));
    }
    return { piezas, hilos };
  }

  /* El logo. opciones: { animar: true, mono: false, clase: '' }. Devuelve { el, repetir, alternar, esMono }. */
  function logo(op) {
    const o = Object.assign({ animar: true, mono: false, clase: '' }, op);
    const g = geometria();
    const hilos = g.hilos.map((t) => `<rect class="hilo hilo--${t.eje}" style="--d:${t.d}s" x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="${t.color}"/>`).join('');
    const unica = g.piezas.join('');
    const el = svg(`<svg class="logo-tejido ${o.clase}" viewBox="0 0 64 64" role="img" aria-label="Mosaico Telar: nueve piezas unidas por cuatro hilos de colores que se cruzan" focusable="false">
      <g class="hilos">${hilos}</g>
      <path class="tela-unica" fill="currentColor" d="${unica}"/>
      <g class="piezas">${g.piezas.map((d, i) => `<path class="pieza" style="--i:${i}" fill="currentColor" d="${d}"/>`).join('')}</g></svg>`);
    if (o.mono) el.classList.add('mono');
    let temporizador = null;
    let solape = null;
    const terminar = () => { el.classList.remove('tejiendo', 'cerrando'); };
    const repetir = () => {
      clearTimeout(temporizador); clearTimeout(solape);
      el.classList.remove('tejiendo', 'cerrando'); void el.getBoundingClientRect(); el.classList.add('tejiendo');
      solape = setTimeout(() => el.classList.add('cerrando'), DURACION - 350);
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
