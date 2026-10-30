/* tejido.js: el logo de Mosaico Telar tejiéndose.

   Cuenta la idea de la marca en cuatro segundos: nueve piezas, cuatro hilos de color (los de los tres portales:
   verde Kinesis, ámbar Wisfox, azul ValerIA) que se cruzan por encima y por debajo, y al final los hilos se vuelven
   el espacio vacío entre las piezas: queda el logo en blanco y negro, con los colores como recuerdo de sus partes.

   Es la misma geometría del logo final (ver LOGO en ui.js): 3 x 3 piezas, hilos de 6 unidades, puentes de 4.
   Si la persona pide menos movimiento, o no hay CSS de animación, se ve directamente el logo final. */
(function (MT) {
  'use strict';
  const { h, svg } = MT.ui;

  const LADO = 16; const HILO = 6; const PUENTE = 4; const R = 12;
  const CORTES = [0, 1, 2].map((k) => [2 + k * (LADO + HILO), 2 + k * (LADO + HILO) + LADO]);

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
    const piezas = []; const puentes = []; const cruces = [];
    CORTES.forEach(([y0, y1], j) => CORTES.forEach(([x0, x1], i) => piezas.push(pieza(x0, y0, x1, y1, i === 0 && j === 0 ? R : 0, i === 2 && j === 0 ? R : 0, i === 2 && j === 2 ? R : 0, i === 0 && j === 2 ? R : 0))));
    const COLOR = { v: ['var(--hilo-kinesis)', 'var(--hilo-wisfox)'], h: ['var(--hilo-valeria)', 'var(--hilo-kinesis)'] };
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
    return { piezas: piezas.join(''), puentes: puentes.join(''), cruces, COLOR };
  }

  /* Devuelve { el, repetir }. El SVG termina siempre en el logo final; los hilos de color solo existen durante la animación. */
  function logoTejido() {
    const g = geometria();
    const hilos = [
      ...[0, 1].map((a) => `<rect class="hilo hilo--v" style="--d:${0.5 + a * 0.6}s" x="${CORTES[a][1]}" y="2" width="${HILO}" height="60" fill="${g.COLOR.v[a]}"/>`),
      ...[0, 1].map((b) => `<rect class="hilo hilo--h" style="--d:${0.8 + b * 0.6}s" x="2" y="${CORTES[b][1]}" width="60" height="${HILO}" fill="${g.COLOR.h[b]}"/>`),
    ].join('');
    const cruces = g.cruces.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="${HILO}" height="${HILO}" fill="${c}"/>`).join('');
    const el = svg(`<svg class="logo-tejido tejiendo" viewBox="0 0 64 64" role="img" aria-label="Mosaico Telar: nueve piezas unidas por hilos que se cruzan" focusable="false">
      <path class="tela" fill="currentColor" d="${g.piezas}"/>
      <g class="hilos">${hilos}</g>
      <path class="puentes" fill="currentColor" d="${g.puentes}"/>
      <g class="cruces">${cruces}</g></svg>`);
    // Se repite quitando la clase, forzando el cálculo de estilos y volviéndola a poner.
    const repetir = () => { el.classList.remove('tejiendo'); void el.getBoundingClientRect(); el.classList.add('tejiendo'); };
    return { el, repetir };
  }

  MT.tejido = { logoTejido };
})(window.MT = window.MT || {});
