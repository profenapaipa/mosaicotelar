/* estado.js: la verdad sobre lo que hay, para que nadie confunda una demostración con un
   producto terminado. Es la misma tabla que usamos en el pitch. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio } = MT.comun;

  const FILAS = [
    ['Funciona hoy', 'ok', 'Kinesis con datos ficticios: perfiles, planeación con DUA y vistas por rol. Wisfox v2.1: lecciones, quiz, juegos y logros. Este espacio unificado, con una sola identidad y un estado compartido.'],
    ['En integración', 'aviso', 'IA ValerIA conectada a un modelo de lenguaje. Aquí ya tiene su lugar y responde con textos de ejemplo.'],
    ['Simulado, y se dice', 'aviso', 'Ajuste individual, aprobación de orientación y vista de la familia (fases 5 y 6 de Kinesis). Aquí se representan con reglas sencillas, no con el sistema real.'],
    ['Viene', 'e', 'Piloto con datos reales, solo después de cumplir los requisitos de protección de datos.'],
  ];

  MT.router.registrar({
    id: 'estado', titulo: 'Estado', espacio: '',
    render(main) {
      const hoja = espacio(main, { marca: 'valeria', titulo: 'Dónde estamos, sin adornos', ruta: 'estado',
        descripcion: 'Lo que funciona, lo que está en camino y lo que mostramos simulado.' });
      hoja.append(h('div', { class: 'rejilla' },
        h('div', { class: 'tarjeta' }, h('table', { class: 'tabla' },
          h('thead', null, h('tr', null, h('th', null, 'Estado'), h('th', null, 'Qué hay'))),
          h('tbody', null, FILAS.map(([e, c, t]) => h('tr', null, h('td', null, h('span', { class: 'sello sello--' + c }, e)), h('td', null, t)))))),
        h('div', { class: 'tarjeta tarjeta--borde' },
          h('h2', null, 'Qué es este espacio y qué no es'),
          h('p', null, 'Es una versión unificada que conserva lo esencial de cada proyecto: de Kinesis los roles, el DUA y los apoyos sin diagnóstico; de Wisfox el zorro, la ruta, el quiz y los logros; de ValerIA su lugar en pantalla.'),
          h('p', null, 'No reemplaza a los proyectos completos, que siguen siendo de cada equipo y conservan su código y su autonomía.'),
          h('div', { class: 'acciones' },
            h('a', { class: 'btn btn--chico btn--suave', href: 'https://github.com/profenapaipa/Kinesis', rel: 'noopener' }, 'Kinesis completo'),
            h('a', { class: 'btn btn--chico btn--suave', href: 'https://github.com/profenapaipa/wisfox', rel: 'noopener' }, 'Wisfox completo'))),
        h('div', { class: 'aviso' }, 'No diagnosticamos, no reemplazamos al equipo interdisciplinario del colegio y no decidimos por el docente. Todo lo que ves es ficticio.')));
    },
  });
})(window.MT = window.MT || {});
