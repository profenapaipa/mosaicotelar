/* estado.js: la verdad sobre lo que hay, para que nadie confunda una demostración con un
   producto terminado. Es la misma tabla que usamos en el pitch. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { pagina } = MT.comun;

  const FILAS = [
    ['Funciona hoy', 'ok', 'Kinesis y Wisfox, los proyectos completos, incrustados tal como los construyeron sus equipos (datos ficticios). Esta plataforma: mapa interactivo, entrada por rol, flujo del ajuste de punta a punta y una identidad común.'],
    ['En integración', 'aviso', 'IA ValerIA conectada a un modelo de lenguaje. Aquí ya tiene su lugar y responde con textos de ejemplo.'],
    ['Simulado, y se dice', 'aviso', 'Ajuste individual, aprobación de orientación y vista de la familia (fases 5 y 6 de Kinesis). Aquí se representan con reglas sencillas, no con el sistema real.'],
    ['Viene', 'e', 'Piloto con datos reales, solo después de cumplir los requisitos de protección de datos.'],
  ];

  MT.router.registrar({
    id: 'estado', titulo: 'Estado', espacio: '',
    render(main) {
      const c = pagina(main, { etiqueta: 'Estado', titulo: 'Dónde estamos, sin adornos', descripcion: 'Lo que funciona, lo que está en camino y lo que mostramos simulado.' });
      c.append(h('div', { class: 'rejilla' },
        h('div', { class: 'tarjeta' }, h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla' },
          h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Estado'), h('th', { scope: 'col' }, 'Qué hay'))),
          h('tbody', null, FILAS.map(([e, k, t]) => h('tr', null, h('td', null, h('span', { class: 'sello sello--' + k }, e)), h('td', null, t))))))),
        h('div', { class: 'tarjeta tarjeta--borde' },
          h('h2', null, 'Qué es esta plataforma y qué no es'),
          h('p', null, 'Los proyectos completos se muestran intactos, con su propia cara, sus animaciones y sus recursos. La plataforma pone alrededor lo que los une: el mapa, los roles, el flujo del ajuste y una identidad común.'),
          h('p', null, 'No reemplaza a los proyectos completos, que siguen siendo de cada equipo y conservan su código, su base de datos y su autonomía.'),
          h('div', { class: 'acciones' },
            h('a', { class: 'btn btn--chico btn--suave', href: 'https://github.com/profenapaipa/Kinesis', rel: 'noopener' }, 'Kinesis completo'),
            h('a', { class: 'btn btn--chico btn--suave', href: 'https://github.com/profenapaipa/wisfox', rel: 'noopener' }, 'Wisfox completo'))),
        h('div', { class: 'aviso' }, 'No diagnosticamos, no reemplazamos al equipo interdisciplinario del colegio y no decidimos por el docente. Todo lo que ves es ficticio.')));
    },
  });
})(window.MT = window.MT || {});
