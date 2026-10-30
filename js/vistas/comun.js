/* comun.js: lo que repiten los tres espacios, para que se vean y se comporten igual.

   El encabezado en degradado con la hoja de tarjetas encima viene de Kinesis; las pestañas en
   píldora también. Wisfox y ValerIA lo adoptan con su propio color. */
(function (MT) {
  'use strict';
  const { h, marca } = MT.ui;

  // Devuelve la "hoja": el contenedor donde cada vista pone sus tarjetas.
  function espacio(main, { marca: nombreMarca, titulo, descripcion, ruta, tabs, sub }) {
    const cabecera = h('div', { class: 'contenedor' },
      h('div', { class: 'cabecera' }, marca(nombreMarca, 'marca-espacio'),
        h('div', null, h('h1', null, titulo), h('p', null, descripcion))),
      tabs ? h('nav', { class: 'pestanas', 'aria-label': 'Secciones de ' + titulo },
        tabs.map((t) => h('a', { href: `#/${ruta}/${t.id}`, 'aria-current': t.id === sub ? 'page' : null }, t.etiqueta))) : null);
    const hoja = h('div', { class: 'contenedor hoja' });
    main.append(h('div', { class: 'encabezado-espacio' }, cabecera), hoja);
    return hoja;
  }

  const hora = (iso) => new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  MT.comun = { espacio, hora };
})(window.MT = window.MT || {});
