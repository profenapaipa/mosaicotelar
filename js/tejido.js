/* tejido.js: el logo de Mosaico Telar tejiéndose, y la animación del hilo usada donde la plataforma "trabaja".

   La idea de la marca: nueve piezas unidas por cuatro hilos que se cruzan por encima y por debajo. Los cuatro hilos son
   los tres portales y la plataforma que los une: verde Kinesis, azul ValerIA, ámbar Wisfox y rosa Mosaico Telar.

   Cómo está dibujado (y por qué no hay costuras): los hilos van DETRÁS de una sola forma negra que ya trae las piezas y los
   puentes de "por debajo". Así el entretejido sale solo, y al quitar el color los hilos son espacio vacío limpio.

   Cómo se anima (opción B, "lengüeta tejida", pendiente de consulta con personas neurodivergentes después de la muestra):
   1. Las nueve piezas llegan separadas, cada una con su forma: algunas traen una lengüeta y otras una muesca donde la lengüeta
      de una vecina encaja. Todas son distintas y todas encajan; ninguna falta. Las lengüeteas son los mismos puentes del logo
      final, así que la silueta de llegada no cambia: solo se descubre lo que el logo ya tenía.
   2. Cuando las piezas encajan, una aguja pasa cada hilo de borde a borde: va por encima donde el logo final lo muestra y se
      esconde bajo el puente donde el hilo pasa por debajo. El hilo nunca aparece de golpe: se ve avanzar sin cortes.
   3. Al terminar se pasa a la forma única (el mismo dibujo, pero un solo camino), para que ninguna arista deje una línea fina.
   Todo se mueve con transform y opacity (sin reflujo) y se maneja con la API de animaciones web, para poder detenerla en
   cualquier instante y revisar los cuadros uno a uno (irA).

   Si la persona pide menos movimiento, se ve directamente el logo final. Con el movimiento calmado solo hay un desvanecido. */
(function (MT) {
  'use strict';
  const { h, svg } = MT.ui;

  const LADO = 16; const HILO = 6; const PUENTE = 4; const R = 12;
  const CORTES = [0, 1, 2].map((k) => [2 + k * (LADO + HILO), 2 + k * (LADO + HILO) + LADO]);
  // Los cuatro hilos: verticales (izquierdo, derecho) y horizontales (superior, inferior).
  const COLOR = { v: ['var(--hilo-kinesis)', 'var(--hilo-wisfox)'], h: ['var(--hilo-valeria)', 'var(--hilo-mosaico)'] };
  const EXTRA = 1;      // cuánto se mete cada hilo bajo las piezas vecinas
  const DURACION = 3250; // ms: cuando termina la animación y se pasa a la forma única
  const RELEVO = 3050;   // ms: instante del cambio a la forma única
  // La lengüeta y su muesca: cuánto entra en la vecina, cuánto más alta que el puente es, cuánto la rebasa para que no haya
  // línea clara en el borde de la muesca, y el radio de las esquinas redondeadas.
  // Hay dos formas de encaje para elegir (solo cambian la animación; el logo final es el mismo): "escalon", sobria, y "curva",
  // más grande y redondeada, que se acerca más al rompecabezas. "separa" es cuánto se alejan las piezas al llegar y debe superar
  // la profundidad de la lengüeta; "escala" encoge el conjunto al inicio para que, separadas, quepan en el mismo cuadro.
  const FORMAS = {
    escalon: { prof: 4, alto: 3, solape: 0.6, radio: 2, separa: 5.5, escala: 0.9 },
    curva: { prof: 5, alto: 6, solape: 0.6, radio: 4, separa: 7.5, escala: 0.84 },
  };
  const f = (n) => +n.toFixed(2);
  const igual = (a, b) => Math.abs(a - b) < 0.01;

  // Rectángulo redondeado en sentido horario, con un radio por esquina (como el que dibujaba antes cada pieza).
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

  // Polígono horario con esquinas redondeadas: cada vértice trae su radio. Convexo o cóncavo se decide por el giro.
  function poligono(v) {
    const n = v.length; let d = '';
    v.forEach(([x, y, r], i) => {
      const [px, py] = v[(i + n - 1) % n]; const [qx, qy] = v[(i + 1) % n];
      const l1 = Math.hypot(x - px, y - py); const l2 = Math.hypot(qx - x, qy - y);
      const ux = (x - px) / l1; const uy = (y - py) / l1; const wx = (qx - x) / l2; const wy = (qy - y) / l2;
      d += (i ? 'L' : 'M') + f(x - ux * r) + ' ' + f(y - uy * r);
      if (r) d += `A${r} ${r} 0 0 ${ux * wy - uy * wx > 0 ? 1 : 0} ${f(x + wx * r)} ${f(y + wy * r)}`;
    });
    return d + 'Z';
  }

  // El contorno de una pieza: su cuadrado con las esquinas externas redondeadas y, en las esquinas que reciben una lengüeta, una muesca.
  function contorno(x0, y0, x1, y1, radios, muescas, rc) {
    const v = []; const m = muescas;
    if (m.TL) v.push([x0, y0 + m.TL.nh, 0], [x0 + m.TL.nw, y0 + m.TL.nh, rc], [x0 + m.TL.nw, y0, 0]); else v.push([x0, y0, radios.TL]);
    if (m.TR) v.push([x1 - m.TR.nw, y0, 0], [x1 - m.TR.nw, y0 + m.TR.nh, rc], [x1, y0 + m.TR.nh, 0]); else v.push([x1, y0, radios.TR]);
    if (m.BR) v.push([x1, y1 - m.BR.nh, 0], [x1 - m.BR.nw, y1 - m.BR.nh, rc], [x1 - m.BR.nw, y1, 0]); else v.push([x1, y1, radios.BR]);
    if (m.BL) v.push([x0 + m.BL.nw, y1, 0], [x0 + m.BL.nw, y1 - m.BL.nh, rc], [x0, y1 - m.BL.nh, 0]); else v.push([x0, y1, radios.BL]);
    return poligono(v);
  }

  /* Para cada puente, una de las dos piezas que une lleva la lengüeta y la otra la muesca (se alternan, para que las nueve
     piezas sean distintas entre sí). La muesca es un escalón en la esquina que da al cruce; la lengüeta, el puente prolongado
     hasta rellenar ese escalón con un pequeño excedente (solape) dentro de la pieza vecina: así, al encajar, negro sobre negro
     y sin línea clara. El tramo que cruza el hueco mide justo lo que el puente final. */
  function encajes(puentes, ENC) {
    const muescas = {}; const lenguetas = {};
    const { prof, alto, solape, radio } = ENC;
    const sinRadios = () => ({ TL: 0, TR: 0, BR: 0, BL: 0 });
    puentes.forEach((p, k) => {
      const [x0, y0, x1, y1] = p.tira;
      const daLaPrimera = k % 2 === 0;
      const dueno = daLaPrimera ? p.a : p.b; const recibe = daLaPrimera ? p.b : p.a;
      const dir = daLaPrimera ? 1 : -1;   // hacia dónde mira la lengüeta: derecha (o abajo) si es +1
      const horizontal = p.eje === 'h';
      // Los bordes de la pieza que da y de la que recibe, medidos sobre el eje en que se cruza el hueco.
      const [d0, d1] = horizontal ? [x0, x1] : [y0, y1];
      const bordeDueno = dir > 0 ? d0 : d1; const bordeRecibe = dir > 0 ? d1 : d0;
      // Por qué lado va al ras el puente con su pieza (el otro lado es el que se agranda para formar la lengüeta).
      const [a0, a1] = horizontal ? [y0, y1] : [x0, x1];
      const [r0, r1] = horizontal ? CORTES[recibe[1]] : CORTES[recibe[0]];
      const alRasFin = igual(a1, r1);
      const crece0 = alRasFin ? a0 - alto - solape : a0; const crece1 = alRasFin ? a1 : a1 + alto + solape;
      const e0 = dir > 0 ? bordeRecibe : bordeRecibe - prof - solape; const e1 = dir > 0 ? bordeRecibe + prof + solape : bordeRecibe;
      const c0 = Math.min(bordeDueno - dir, bordeRecibe + dir * 0.5); const c1 = Math.max(bordeDueno - dir, bordeRecibe + dir * 0.5);
      // La esquina lejana, del lado que no va al ras, es la que se redondea (en la muesca y en la lengüeta).
      const rr = sinRadios();
      const rojo = (horizontal ? (alRasFin ? 'T' : 'B') + (dir > 0 ? 'R' : 'L') : (dir > 0 ? 'B' : 'T') + (alRasFin ? 'L' : 'R'));
      rr[rojo] = radio + solape;
      const cuello = horizontal ? pieza(c0, a0, c1, a1, 0, 0, 0, 0) : pieza(a0, c0, a1, c1, 0, 0, 0, 0);
      const cabeza = horizontal ? pieza(e0, crece0, e1, crece1, rr.TL, rr.TR, rr.BR, rr.BL) : pieza(crece0, e0, crece1, e1, rr.TL, rr.TR, rr.BR, rr.BL);
      // La muesca está en la esquina de la pieza que recibe que da al puente.
      const esquina = horizontal ? (alRasFin ? 'B' : 'T') + (dir > 0 ? 'L' : 'R') : (dir > 0 ? 'T' : 'B') + (alRasFin ? 'R' : 'L');
      const muesca = horizontal ? { nw: prof, nh: PUENTE + alto } : { nw: PUENTE + alto, nh: prof };
      const clave = recibe.join(',');
      (muescas[clave] = muescas[clave] || {})[esquina] = muesca;
      (lenguetas[dueno.join(',')] = lenguetas[dueno.join(',')] || []).push(cuello + cabeza);
    });
    return { muescas, lenguetas };
  }

  function geometria(forma) {
    // Cada pieza es un camino propio. Los puentes negros NO son una forma aparte: se suman a las dos piezas que unen.
    // Si fueran otra forma, el suavizado de bordes dejaría ver una línea clara entre el puente y la pieza. Dentro de un mismo
    // camino no hay borde que suavizar, y al estar el puente en los dos caminos, ninguno de sus lados queda como arista entre
    // formas distintas.
    const caminos = [];
    CORTES.forEach(([y0, y1], j) => { caminos[j] = []; CORTES.forEach(([x0, x1], i) => caminos[j][i] = [pieza(x0, y0, x1, y1, i === 0 && j === 0 ? R : 0, i === 2 && j === 0 ? R : 0, i === 2 && j === 2 ? R : 0, i === 0 && j === 2 ? R : 0)]); });
    // Quién pasa por encima en cada cruce (a = hilo vertical, b = hilo horizontal): se alterna, como en un tejido.
    const encima = (a, b) => ((a + b) % 2 === 0 ? 'h' : 'v');
    const puentes = [];
    const une = (eje, x0, y0, x1, y1, pa, pb) => {
      const d = `M${x0} ${y0}h${x1 - x0}v${y1 - y0}h-${x1 - x0}Z`;
      caminos[pa[1]][pa[0]].push(d); caminos[pb[1]][pb[0]].push(d);
      puentes.push({ eje, tira: [x0, y0, x1, y1], a: pa, b: pb });
    };
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const cx = CORTES[a][1]; const cy = CORTES[b][1];
      if (encima(a, b) === 'h') {   // el vertical pasa por debajo: dos puentes en la columna del hilo, uno arriba y uno abajo del cruce
        une('h', cx, cy - PUENTE, cx + HILO, cy, [a, b], [a + 1, b]);
        une('h', cx, cy + HILO, cx + HILO, cy + HILO + PUENTE, [a, b + 1], [a + 1, b + 1]);
      } else {                      // el horizontal pasa por debajo: dos puentes en la fila del hilo, uno a cada lado del cruce
        une('v', cx - PUENTE, cy, cx, cy + HILO, [a, b], [a, b + 1]);
        une('v', cx + HILO, cy, cx + HILO + PUENTE, cy + HILO, [a + 1, b], [a + 1, b + 1]);
      }
    }
    const piezas = caminos.flat().map((p) => p.join(''));

    // Las piezas de la animación: cada una con su muesca (si recibe) y sus lengüetas (si da).
    const { muescas, lenguetas } = encajes(puentes, forma);
    const cuerpos = [];
    CORTES.forEach(([y0, y1], j) => CORTES.forEach(([x0, x1], i) => {
      const clave = i + ',' + j;
      const radios = { TL: i === 0 && j === 0 ? R : 0, TR: i === 2 && j === 0 ? R : 0, BR: i === 2 && j === 2 ? R : 0, BL: i === 0 && j === 2 ? R : 0 };
      cuerpos.push({ i, j, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, cuerpo: contorno(x0, y0, x1, y1, radios, muescas[clave] || {}, forma.radio), lenguetas: lenguetas[clave] || [] });
    }));

    /* Los hilos de color, por tramos. Dos decisiones que evitan las líneas finas del borde:
       1. Donde un hilo pasa por debajo, su tramo termina DENTRO del puente negro (2 unidades), nunca en seco; y el hilo que pasa
          por encima lo cruza de una sola pieza. Así no hay cuadritos de "cruce" superpuestos, que dejaban rayas del mismo color.
       2. Cada tramo es 1 unidad más ancho que el espacio entre piezas y se mete debajo de ellas: si coincidieran borde con borde,
          el suavizado de los bordes dejaría ver el fondo como una línea clara entre la pieza y el hilo. */
    const hilos = []; // los tramos, sueltos (para dibujarlos y para las pruebas)
    const lineas = []; // los cuatro hilos, cada uno con sus tramos en orden
    const tramos = (corte) => { const t = []; let ini = 2; for (const c of corte) { t.push([ini, c - 2]); ini = c + HILO + PUENTE - 2; } t.push([ini, 62]); return t; };
    const agrega = (eje, k, corte) => {
      const c = CORTES[k][1]; const ts = tramos(corte);
      lineas.push({ eje, centro: c + HILO / 2, color: COLOR[eje][k], tramos: ts });
      ts.forEach(([i, fin]) => hilos.push(eje === 'v'
        ? { eje, x: c - EXTRA, y: i, w: HILO + 2 * EXTRA, h: fin - i, color: COLOR[eje][k], linea: lineas.length - 1, desde: i, hasta: fin }
        : { eje, x: i, y: c - EXTRA, w: fin - i, h: HILO + 2 * EXTRA, color: COLOR[eje][k], linea: lineas.length - 1, desde: i, hasta: fin }));
    };
    // El orden de las líneas es el del tejido: Kinesis, ValerIA, Wisfox, Mosaico Telar.
    agrega('v', 0, [0, 1].filter((b) => encima(0, b) === 'h').map((b) => CORTES[b][1]));
    agrega('h', 0, [0, 1].filter((a) => encima(a, 0) === 'v').map((a) => CORTES[a][1]));
    agrega('v', 1, [0, 1].filter((b) => encima(1, b) === 'h').map((b) => CORTES[b][1]));
    agrega('h', 1, [0, 1].filter((a) => encima(a, 1) === 'v').map((a) => CORTES[a][1]));
    return { piezas, hilos, lineas, cuerpos };
  }

  const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const calmado = () => document.documentElement.dataset.movimiento === 'calmado';

  /* La animación completa. Devuelve la lista de animaciones para poder cancelarlas o detenerlas en un instante. */
  const SUAVE = 'cubic-bezier(.45, 0, .2, 1)';
  const suave3 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const INICIOS = [1050, 1250, 1450, 1650]; const TRAVESIA = 1350; const MUESTRAS = 30;
  function tejer(el, g, forma) {
    const A = [];
    // Lo que termina en el estado base (piezas, lienzo, tramos) usa fill "backwards": al acabar, la animación deja de aplicarse. Con "both"
    // el navegador sigue tratando cada pieza como una capa propia y compone sus bordes por separado, lo que dejaba líneas tenues entre
    // piezas que comparten arista. Solo lo que debe quedarse en su valor final (punta, relevo) usa "both".
    const an = (nodo, kf, op) => { const a = nodo.animate(kf, Object.assign({ fill: 'backwards' }, op)); A.push(a); return a; };
    const lienzo = el.querySelector('.lienzo');
    an(lienzo, [{ scale: forma.escala }, { scale: 1 }], { duration: 1050, easing: SUAVE });
    // 1. Las piezas llegan separadas y encajan. Las del centro primero, las esquinas al final.
    el.querySelectorAll('.pieza').forEach((n) => {
      const i = +n.dataset.i; const j = +n.dataset.j;
      const retraso = 60 * ((i === 1 ? 0 : 1) + (j === 1 ? 0 : 1));
      const giro = ((i + j) % 2 ? 1 : -1) * 5;
      an(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: retraso, easing: 'ease-out' });
      an(n, [{ translate: `${(i - 1) * forma.separa}px ${(j - 1) * forma.separa}px` }, { translate: '0px 0px' }], { duration: 820, delay: retraso + 120, easing: SUAVE });
      an(n, [{ rotate: `${giro}deg` }, { rotate: '0deg' }], { duration: 560, delay: retraso + 120, easing: 'cubic-bezier(.3, 0, .2, 1)' });
    });
    // 2. Cada hilo avanza de un borde al otro con su aguja. La punta y los tramos usan la misma curva de avance, por eso se ve continuo.
    g.lineas.forEach((l, k) => {
      const largo = 60; const radio = HILO / 2 + EXTRA; const muestras = Array.from({ length: MUESTRAS + 1 }, (_, n) => 2 + largo * suave3(n / MUESTRAS));
      el.querySelectorAll(`.hilo[data-linea="${k}"]`).forEach((r) => {
        const a = +r.dataset.desde; const b = +r.dataset.hasta; const escala = l.eje === 'v' ? 'scaleY' : 'scaleX';
        an(r, muestras.map((s) => ({ transform: `${escala}(${f(Math.min(1, Math.max(0, (s - a) / (b - a))))})` })), { duration: TRAVESIA, delay: INICIOS[k] });
      });
      const punta = el.querySelector(`.punta[data-linea="${k}"]`);
      an(punta, muestras.map((s, n) => {
        // La aguja solo se ve mientras cabe dentro del logo (su radio es lo que sobresale del hilo) y mientras el hilo va a la vista.
        // Antes de llegar a un puente la punta se apaga (su borde redondo dejaría cuñas de fondo contra el negro) y el hilo sigue plano hasta él.
        const visible = s >= 2 + radio && l.tramos.some(([a, b]) => s >= a && s <= (b === 62 ? 62 : b - 2) - radio);
        return { transform: l.eje === 'v' ? `translate(${l.centro}px, ${f(s)}px)` : `translate(${f(s)}px, ${l.centro}px)`, opacity: visible ? 1 : 0 };
      }), { duration: TRAVESIA, delay: INICIOS[k], fill: 'both' });
    });
    // 3. El relevo a la forma única: las dos formas son idénticas, una se enciende y la otra se apaga.
    an(el.querySelector('.tela-unica'), [{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: RELEVO, fill: 'both' });
    an(el.querySelector('.piezas'), [{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: RELEVO + 10, fill: 'both' });
    return A;
  }
  // La versión calmada: sin desplazamientos ni giros, solo aparece suavemente.
  function calma(el) {
    return [el.querySelector('.lienzo').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out', fill: 'both' })];
  }

  /* El logo. opciones: { animar: true, mono: false, clase: '', forma: 'curva' (la elegida) | 'escalon' }. Devuelve { el, repetir, alternar, esMono, irA, animaciones }. */
  function logo(op) {
    const o = Object.assign({ animar: true, mono: false, clase: '', forma: 'curva' }, op);
    const forma = FORMAS[o.forma] || FORMAS.curva;
    const g = geometria(forma);
    const tips = g.lineas.map((l, k) => `<circle class="punta" data-linea="${k}" r="${HILO / 2 + EXTRA}" cx="0" cy="0" fill="${l.color}"/>`).join('');
    const hilos = g.hilos.map((t) => `<rect class="hilo hilo--${t.eje}" data-linea="${t.linea}" data-desde="${t.desde}" data-hasta="${t.hasta}" x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="${t.color}"/>`).join('');
    const unica = g.piezas.join('');
    const piezas = g.cuerpos.map((c) => `<g class="pieza" data-i="${c.i}" data-j="${c.j}" style="transform-origin:${c.cx}px ${c.cy}px"><path fill="currentColor" d="${c.cuerpo}"/>${c.lenguetas.map((d) => `<path fill="currentColor" d="${d}"/>`).join('')}</g>`).join('');
    // svg() arma el logo dentro de un <template>, que pertenece a un documento inerte con su propia línea de tiempo: una animación creada ahí
    // nunca avanza y las piezas se quedaban en opacidad 0 hasta el relevo. Por eso se adopta en el documento real y la animación arranca
    // cuando el logo ya está montado en la página.
    const el = document.adoptNode(svg(`<svg class="logo-tejido ${o.clase}" viewBox="0 0 64 64" role="img" aria-label="Mosaico Telar: nueve piezas unidas por cuatro hilos de colores que se cruzan" focusable="false">
      <g class="lienzo" style="transform-origin:32px 32px">
      <g class="hilos">${tips}${hilos}</g>
      <path class="tela-unica" fill="currentColor" d="${unica}"/>
      <g class="piezas">${piezas}</g></g></svg>`));
    if (o.mono) el.classList.add('mono');
    let animaciones = []; let temporizador = null;
    const limpiar = () => { clearTimeout(temporizador); animaciones.forEach((a) => a.cancel()); animaciones = []; el.classList.remove('tejiendo'); };
    // Con "reducir movimiento" no se anima al cargar; si la persona pide "Ver otra vez", se le muestra el desvanecido calmado.
    const arrancar = () => {
      limpiar(); if (!el.animate) return;
      const suave = reducido() || calmado();
      el.classList.add('tejiendo');
      animaciones = suave ? calma(el) : tejer(el, g, forma);
      temporizador = setTimeout(limpiar, suave ? 800 : DURACION);
    };
    // Si el logo aún no está en la página (la vista lo crea y luego lo inserta), espera a que se monte; el tiempo cuenta desde ahí.
    let esperaMontaje = 0;
    const repetir = () => {
      cancelAnimationFrame(esperaMontaje);
      if (el.isConnected) return arrancar();
      let intentos = 0;
      const espera = () => { if (el.isConnected) arrancar(); else if (intentos++ < 180) esperaMontaje = requestAnimationFrame(espera); };
      esperaMontaje = requestAnimationFrame(espera);
    };
    if (o.animar && !reducido()) repetir();
    // Detiene la animación en un instante (ms) para revisarla cuadro a cuadro: las capturas y las pruebas la usan.
    const irA = (ms) => {
      cancelAnimationFrame(esperaMontaje); if (!animaciones.length && el.isConnected) arrancar();
      clearTimeout(temporizador); animaciones.forEach((a) => { a.pause(); a.currentTime = ms; }); };
    // Pasar de color a blanco y negro (y volver) mostrando las dos versiones de la marca.
    const alternar = () => { el.classList.toggle('mono'); return el.classList.contains('mono'); };
    return { el, repetir, alternar, irA, animaciones: () => animaciones, esMono: () => el.classList.contains('mono') };
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
    if (reducido()) return;
    let b = document.getElementById('progreso-hilos');
    if (!b) { b = h('div', { id: 'progreso-hilos', 'aria-hidden': 'true' }, ['kinesis', 'valeria', 'wisfox', 'mosaico'].map((c) => h('span', { class: 'hilo-' + c }))); document.body.append(b); }
    b.classList.remove('corre'); void b.offsetWidth; b.classList.add('corre');
  }

  /* Revelado al desplazarse: las secciones y tarjetas entran con un pequeño movimiento cuando llegan a la vista. */
  let observador = null;
  function revelar(main) {
    if (!('IntersectionObserver' in window) || reducido()) return;
    if (observador) observador.disconnect();
    observador = new IntersectionObserver((entradas) => entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); observador.unobserve(e.target); } }), { threshold: 0.12 });
    main.querySelectorAll('.seccion, .rol-tarjeta, .plan-tarjeta, .portal, .servicio').forEach((x, i) => { x.classList.add('revela'); x.style.setProperty('--r', String((i % 5) * 70) + 'ms'); observador.observe(x); });
  }

  MT.tejido = { logo, logoTejido, logoColor, cargador, progreso, revelar };
})(window.MT = window.MT || {});
