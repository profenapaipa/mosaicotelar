/* valeria.js: el espacio de la IA, aparte de los otros dos y con su propio lugar fijo.

   Hoy responde con textos de ejemplo y lo dice en pantalla. Cuando haya un servidor con un modelo,
   este mismo chat (y el panel que se abre desde cualquier espacio) se llenarán con respuestas
   reales sin tocar nada más: ver js/ia-config.js.

   Dos secciones: "Conversar" (el chat) y "Conexión" (en qué estado está y cómo se conecta), para
   que quien entre sepa siempre si lo que lee es real o un ejemplo. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio } = MT.comun;

  const TABS = [
    { id: 'chat', etiqueta: 'Conversar', icono: 'chispa' },
    { id: 'conexion', etiqueta: 'Conexión', icono: 'estado' },
  ];

  function chat(c) {
    const caja = h('div', { class: 'tarjeta tarjeta--chat' });
    c.append(h('header', { class: 'saludo' }, h('div', null, h('h1', null, 'Conversa con ValerIA'),
      h('p', null, 'La guía de los tres hilos: ayuda al docente a diseñar y al estudiante a resolver sus dudas. Propone; decide quien enseña.'))),
      caja,
      h('p', { class: 'suave' }, 'También puedes abrirla desde cualquier espacio con el botón “Hablar con ValerIA”, y la conversación es la misma.'));
    const ch = MT.ia.montarChat(caja, MT.ia.panel.sugerenciasPara('valeria'));
    MT.router.alSalir(() => ch.destruir());
  }

  function conexion(c) {
    const estado = h('div', { class: 'tarjeta tarjeta--borde' });
    const pintar = () => estado.replaceChildren(h('p', { class: 'etiqueta' }, 'Estado de la conexión'), MT.ia.chipModo(),
      h('p', { style: 'margin-top:.6rem' }, MT.ia.info.modo === 'servidor'
        ? 'Conectada a un servidor con un modelo de lenguaje.'
        : 'Hoy responde con textos de ejemplo. No está conectada a un modelo de lenguaje.'));
    pintar();
    window.addEventListener('mt-ia-modo', pintar, { once: true });
    c.append(h('header', { class: 'saludo' }, h('div', null, h('h1', null, 'Conexión de ValerIA'), h('p', null, 'Qué es real hoy y cómo se conecta un modelo.'))),
      h('div', { class: 'rejilla rejilla--2' }, estado,
        h('div', { class: 'tarjeta' }, h('p', { class: 'etiqueta' }, 'Dónde se muestra'),
          h('p', null, 'En su propio espacio y en un panel que se abre desde cualquier pantalla: en Kinesis para el docente y en Wisfox para el estudiante. Comparten la misma conversación.'))),
      h('div', { class: 'tarjeta', style: 'margin-top:1rem' }, h('p', { class: 'etiqueta' }, 'Cómo se conecta'),
        h('ol', null,
          h('li', null, 'Un servidor guarda la clave del modelo como variable de entorno. La clave nunca va en esta página.'),
          h('li', null, 'Esta página se sirve desde ese mismo servidor.'),
          h('li', null, 'En js/ia-config.js queda el proveedor en “auto”, que detecta el servidor solo.')),
        h('p', { class: 'suave' }, 'Solo se envían datos ficticios, y las respuestas se muestran como texto, nunca se ejecutan.')));
  }

  MT.router.registrar({
    id: 'valeria', titulo: 'IA ValerIA', espacio: 'valeria', subs: TABS,
    render(main, { sub }) {
      const c = espacio(main, { marca: 'valeria', nombre: 'ValerIA', descripcion: 'La guía de los tres hilos', ruta: 'valeria', tabs: TABS, sub,
        usuario: { iniciales: 'VI', nombre: 'ValerIA', rol: MT.ia.info.modo === 'servidor' ? 'En vivo' : 'Modo de ejemplo' } });
      ({ chat, conexion })[sub](c);
    },
  });
})(window.MT = window.MT || {});
