/* main.js: arranque. Construye la navegación a partir de UNA lista (así el menú de escritorio y
   la barra del celular nunca se contradicen), conecta la apariencia y el botón de ValerIA, y
   registra cualquier error para que las pruebas automáticas puedan verlo. */
(function (MT) {
  'use strict';
  const { h, marca, icono } = MT.ui;

  // Errores de ejecución a la vista de herramientas/auditar.py. No se envía nada a ningún sitio.
  window.__errores = window.__errores || [];
  window.addEventListener('error', (e) => window.__errores.push(e.message));
  document.addEventListener('securitypolicyviolation', (e) => window.__errores.push('CSP: ' + e.violatedDirective + ' ' + e.blockedURI));
  window.addEventListener('unhandledrejection', (e) => window.__errores.push('promesa: ' + ((e.reason && e.reason.message) || e.reason)));

  // La lista única del riel. "abajo" son las páginas de la plataforma; el resto es donde se trabaja.
  const ESPACIOS = [
    { id: 'mi', hash: '#/mi', etiqueta: 'Mi espacio', cls: 'e-marca', icono: () => icono('inicio') },
    { id: 'mapa', hash: '#/mapa', etiqueta: 'Mapa', cls: 'e-marca', icono: () => icono('mapa') },
    { id: 'recorrido', hash: '#/recorrido', etiqueta: 'Roles', cls: 'e-marca', icono: () => icono('docente') },
    { id: 'planes', hash: '#/planes', etiqueta: 'Participar', cls: 'e-marca', icono: () => icono('logros'), abajo: true },
    { id: 'hoja', hash: '#/hoja', etiqueta: 'Hoja de ruta', cls: 'e-marca', icono: () => icono('estado'), abajo: true },
    { id: 'identidad', hash: '#/identidad', etiqueta: 'Marca', cls: 'e-marca', icono: () => icono('identidad'), abajo: true },
  ];

  function decorativo(svg) { svg.removeAttribute('role'); svg.removeAttribute('aria-label'); svg.setAttribute('aria-hidden', 'true'); return svg; }

  function construirNavegacion() {
    const enlace = (e) => h('a', { href: e.hash, class: e.cls, 'data-ruta': e.id }, e.icono(), e.etiqueta);
    document.getElementById('riel-logo').append(marca('mosaico'));
    document.getElementById('riel-items').append(...ESPACIOS.filter((e) => !e.abajo).map(enlace));
    document.getElementById('riel-abajo').append(...ESPACIOS.filter((e) => e.abajo).map(enlace));
    document.getElementById('logo-pie').replaceChildren(marca('mosaico'));
  }

  /* Apariencia (de Kinesis): modo claro, oscuro o del sistema, y texto más grande. Se guarda en
     este navegador y un script en <head> la aplica antes de pintar, para evitar el destello. */
  const CLAVE_APAR = 'mosaicotelar.apariencia';
  function leerApariencia() { try { return JSON.parse(localStorage.getItem(CLAVE_APAR) || '{}'); } catch (e) { return {}; } }
  function aplicarApariencia(a) {
    const r = document.documentElement;
    if (a.tema === 'claro' || a.tema === 'oscuro') r.dataset.tema = a.tema; else delete r.dataset.tema;
    if (a.texto === 'grande') r.dataset.texto = 'grande'; else delete r.dataset.texto;
    try { localStorage.setItem(CLAVE_APAR, JSON.stringify(a)); } catch (e) { /* sin almacenamiento */ }
  }

  function construirApariencia() {
    const boton = document.getElementById('btn-apariencia');
    const menu = document.getElementById('menu-apariencia');
    const a = leerApariencia();
    const radio = (valor, texto) => h('label', { class: 'casilla' },
      h('input', { type: 'radio', name: 'tema', value: valor, checked: (a.tema || 'sistema') === valor,
        onchange: () => { a.tema = valor; aplicarApariencia(a); } }), texto);
    menu.append(
      h('fieldset', null, h('legend', null, 'Modo'), radio('sistema', 'Del sistema'), radio('claro', 'Claro'), radio('oscuro', 'Oscuro')),
      h('label', { class: 'casilla' }, h('input', { type: 'checkbox', checked: a.texto === 'grande',
        onchange: (e) => { a.texto = e.target.checked ? 'grande' : 'normal'; aplicarApariencia(a); } }), 'Texto más grande'));
    const cerrar = () => { menu.hidden = true; boton.setAttribute('aria-expanded', 'false'); };
    boton.addEventListener('click', () => { const abre = menu.hidden; menu.hidden = !abre; boton.setAttribute('aria-expanded', String(abre)); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { cerrar(); boton.focus(); } });
    document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !boton.contains(e.target)) cerrar(); });
  }

  construirNavegacion();
  construirApariencia();
  MT.vivos.iniciar(document.getElementById('app'));
  MT.barra.construir();
  document.getElementById('btn-ia').addEventListener('click', () => MT.ia.panel.alternar());
  MT.ia.detectar();
  MT.router.iniciar();
})(window.MT = window.MT || {});
