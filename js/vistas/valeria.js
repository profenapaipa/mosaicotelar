/* valeria.js: el espacio de la IA, aparte de los otros dos.

   Hoy responde con textos de ejemplo y lo dice en pantalla. Cuando haya un servidor con un modelo,
   este mismo chat (y el panel que se abre desde cualquier espacio) se llenarán con respuestas
   reales sin tocar nada más: ver js/ia-config.js. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio } = MT.comun;

  MT.router.registrar({
    id: 'valeria', titulo: 'IA ValerIA', espacio: 'valeria',
    render(main) {
      const hoja = espacio(main, { marca: 'valeria', titulo: 'IA ValerIA', ruta: 'valeria',
        descripcion: 'La guía de los tres hilos: ayuda al docente a diseñar y al estudiante a resolver sus dudas.' });

      const caja = h('div', { class: 'tarjeta', style: 'padding:0;display:flex;flex-direction:column;height:34rem;overflow:hidden' });
      const estado = h('div', { class: 'tarjeta tarjeta--borde' });
      const pintarEstado = () => estado.replaceChildren(
        h('p', { class: 'etiqueta' }, 'Estado de la conexión'), MT.ia.chipModo(),
        h('p', { style: 'margin-top:.6rem' }, MT.ia.info.modo === 'servidor'
          ? 'Conectada a un servidor con un modelo de lenguaje.'
          : 'Hoy responde con textos de ejemplo. No está conectada a un modelo de lenguaje.'));
      pintarEstado();
      window.addEventListener('mt-ia-modo', pintarEstado, { once: true });

      // La rejilla va en una clase (no en style) para que el diseño de celular pueda reemplazarla.
      hoja.append(h('div', { class: 'rejilla rejilla--chat' },
        caja,
        h('div', { class: 'rejilla' }, estado,
          h('div', { class: 'tarjeta' }, h('p', { class: 'etiqueta' }, 'Dónde se muestra'),
            h('p', null, 'Aquí, y en el panel que se abre con el botón ValerIA desde cualquier espacio: en Kinesis para el docente y en Wisfox para el estudiante. Comparten la misma conversación.')),
          h('div', { class: 'tarjeta' }, h('p', { class: 'etiqueta' }, 'Cómo se conecta'),
            h('ol', null,
              h('li', null, 'Un servidor guarda la clave del modelo como variable de entorno. La clave nunca va en esta página.'),
              h('li', null, 'Esta página se sirve desde ese mismo servidor.'),
              h('li', null, 'En js/ia-config.js queda el proveedor en “auto”, que detecta el servidor solo.')),
            h('p', { class: 'suave' }, 'Solo se envían datos ficticios, y las respuestas se muestran como texto, nunca se ejecutan.')))));

      const chat = MT.ia.montarChat(caja, MT.ia.panel.sugerenciasPara('valeria'));
      MT.router.alSalir(() => chat.destruir());
    },
  });
})(window.MT = window.MT || {});
