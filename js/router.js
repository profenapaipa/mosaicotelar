/* router.js: navegación por hash (#/kinesis/docente). Sin servidor, funciona igual abriendo el
   archivo, en GitHub Pages o dentro del servidor del piloto.

   Qué hace en cada cambio de pantalla: pinta la vista, fija el color del espacio, actualiza el
   título de la pestaña, marca el enlace activo y lleva el foco al título para que quien usa un
   lector de pantalla sepa dónde está. */
(function (MT) {
  'use strict';
  const rutas = {};
  let limpiezas = [];

  function registrar(def) { rutas[def.id] = def; }
  // Las vistas que abren suscripciones (el chat) registran aquí cómo cerrarlas al salir.
  function alSalir(fn) { limpiezas.push(fn); }

  function actual() {
    const partes = (window.location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
    const id = rutas[partes[0]] ? partes[0] : 'inicio';
    const def = rutas[id];
    const sub = def.subs && def.subs.some((s) => s.id === partes[1]) ? partes[1] : (def.subs ? def.subs[0].id : null);
    return { id, sub, def };
  }

  function marcarNavegacion(id) {
    document.querySelectorAll('[data-ruta]').forEach((a) => {
      if (a.dataset.ruta === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function render(opciones) {
    const op = Object.assign({ foco: true }, opciones);
    const { id, sub, def } = actual();
    const main = document.getElementById('app');
    const y = window.scrollY;
    limpiezas.forEach((f) => { try { f(); } catch (e) { /* ya no importa */ } });
    limpiezas = [];
    main.dataset.espacio = (typeof def.espacio === 'function' ? def.espacio(sub) : def.espacio) || '';
    main.replaceChildren();
    try {
      def.render(main, { sub });
    } catch (e) {
      (window.__errores = window.__errores || []).push('vista ' + id + ': ' + e.message);
      console.error(e);
      main.replaceChildren(MT.ui.h('div', { class: 'contenedor' }, MT.ui.h('p', { class: 'aviso' }, 'Esta pantalla tuvo un problema. Vuelve al inicio e inténtalo otra vez.')));
    }
    document.title = (def.titulo === 'Inicio' ? 'Mosaico Telar' : def.titulo + ' · Mosaico Telar');
    marcarNavegacion(id);
    if (op.foco) {
      window.scrollTo(0, 0);
      const t = main.querySelector('h1');
      if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    } else {
      window.scrollTo(0, y);
    }
  }

  function iniciar() {
    window.addEventListener('hashchange', () => render({ foco: true }));
    render({ foco: false });
  }

  MT.router = { registrar, iniciar, actual, alSalir, recargar: () => render({ foco: false }), rutas };
})(window.MT = window.MT || {});
