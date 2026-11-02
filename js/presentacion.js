/* presentacion.js: el modo presentación, para proyectar la plataforma y para que cinco estudiantes se turnen en la mesa.

   Qué cambia cuando está activo (el CSS está en css/presentacion.css y todo cuelga de html[data-presentacion="activa"]):
   letra y controles más grandes, menos navegación, y un "guion de la mesa": una barra discreta abajo que recorre los cinco roles
   siguiendo un ajuste de principio a fin. Cada paso lleva al rol y a la pantalla donde ocurre, así quien presenta solo pulsa
   "Siguiente". "Empezar de nuevo" restablece los datos de ejemplo y el rol con un solo clic, sin pedir confirmación: en la mesa
   los datos son ficticios y lo que se necesita es dejar todo limpio para la siguiente persona.

   Es opcional y no cambia nada si nadie lo activa. Se activa con el botón de la franja o con Alt+P (con modificador, para no
   chocar con quien escribe en un campo). El texto del guion vive en js/mensajes.js y es un borrador por aprobar.

   Se recuerda en este navegador (activo, paso y si el guion está oculto), así recargar la página no saca del modo. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const M = MT.mensajes.presentacion;
  const G = MT.mensajes.guion;
  const CLAVE = 'mosaicotelar.presentacion';
  const raiz = document.documentElement;

  function leer() {
    try { const d = JSON.parse(localStorage.getItem(CLAVE) || '{}'); return { activo: !!d.activo, paso: Math.max(0, Math.min(G.pasos.length - 1, Number(d.paso) || 0)), oculto: !!d.oculto }; } catch (e) { return { activo: false, paso: 0, oculto: false }; }
  }
  const estado = leer();
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento: vale mientras la página esté abierta */ } }

  let panel = null; let boton = null; let observador = null;
  const refs = {};

  /* ---------------- Ir a un paso del guion ---------------- */
  function ir(i, volverA) {
    estado.paso = Math.max(0, Math.min(G.pasos.length - 1, i)); guardar();
    const p = G.pasos[estado.paso];
    MT.store.cambiar((s) => { s.rol = p.rol; });
    pintar();
    if (location.hash === p.hash) MT.router.recargar(); else location.hash = p.hash;
    // El router lleva el foco al título de la pantalla nueva; quien presenta con el teclado necesita seguir en su botón.
    if (volverA) setTimeout(() => enfocar(volverA), 60);
  }
  // En el primer o el último paso uno de los dos botones queda desactivado y no puede recibir el foco: se usa el otro.
  function enfocar(el) { (el && !el.disabled ? el : (refs.siguiente.disabled ? refs.anterior : refs.siguiente)).focus(); }

  async function reiniciar() {
    await MT.barra.empezarDeNuevo({ confirmar: false });
    estado.paso = 0; guardar(); pintar();
    MT.dlg.toast(M.reiniciado);
  }

  /* ---------------- La barra del guion ---------------- */
  function construirPanel() {
    refs.meta = h('span', { class: 'guion__meta' });
    refs.titulo = h('h2', { class: 'guion__titulo' });
    refs.texto = h('p', { class: 'guion__texto' });
    refs.puntos = h('ol', { class: 'guion__puntos', 'aria-label': M.guion });
    refs.anterior = h('button', { class: 'btn btn--suave', type: 'button', onclick: () => ir(estado.paso - 1, refs.anterior) }, M.anterior);
    refs.siguiente = h('button', { class: 'btn', type: 'button', onclick: () => ir(estado.paso + 1, refs.siguiente) }, M.siguiente);
    const completa = document.fullscreenEnabled
      ? h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => { if (document.fullscreenElement) document.exitFullscreen(); else raiz.requestFullscreen().catch(() => {}); } }, M.pantallaCompleta) : null;
    const cuerpo = h('div', { class: 'guion__cuerpo', id: 'guion-cuerpo' },
      h('div', { class: 'guion__texto-caja' },
        h('p', { class: 'guion__etiqueta' }, M.guion, ' ', G.aprobado ? null : h('span', { class: 'guion__borrador' }, M.borrador), ' · ', refs.meta),
        refs.titulo, refs.texto),
      h('div', { class: 'guion__nav' }, refs.anterior, refs.siguiente),
      h('div', { class: 'guion__pie' },
        refs.puntos,
        h('div', { class: 'guion__utiles' },
          h('button', { class: 'btn btn--chico btn--suave', type: 'button', id: 'btn-reiniciar-mesa', onclick: reiniciar }, M.empezarDeNuevo),
          completa,
          h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => ocultar(true) }, M.ocultar),
          h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => alternar(false) }, M.salir))),
      h('p', { class: 'solo-lectores' }, M.atajos));
    refs.mostrar = h('button', { class: 'btn btn--chico guion__mostrar', type: 'button', 'aria-controls': 'guion-cuerpo', onclick: () => ocultar(false) }, M.mostrar);
    panel = h('aside', { class: 'guion', id: 'guion-mesa', 'aria-label': M.guion }, cuerpo, refs.mostrar);
    // Las flechas cambian de paso solo con el foco dentro del guion: así no le quitan las flechas a nadie más.
    panel.addEventListener('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(estado.paso + 1, document.activeElement); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(estado.paso - 1, document.activeElement); }
    });
    G.pasos.forEach((p, i) => refs.puntos.append(h('li', null, h('button', { type: 'button', class: 'guion__punto', 'aria-label': `${M.paso(i + 1, G.pasos.length)}: ${p.titulo}`, onclick: (e) => ir(i, e.currentTarget) }))));
    document.body.append(panel);
    // El resto de la página deja sitio a la barra: se mide para no adivinar su altura.
    if (window.ResizeObserver) { observador = new ResizeObserver(medir); observador.observe(panel); }
  }

  function medir() { raiz.style.setProperty('--guion-alto', (panel && estado.activo && !estado.oculto ? panel.offsetHeight : 0) + 'px'); }

  function pintar() {
    if (!panel) return;
    const p = G.pasos[estado.paso]; const r = p.rol ? MT.roles.por(p.rol) : null;
    refs.meta.textContent = `${M.paso(estado.paso + 1, G.pasos.length)} · ${r ? M.turno(r.nombre) : M.turnoGeneral}`;
    refs.titulo.textContent = p.titulo;
    refs.texto.textContent = p.texto;
    refs.anterior.disabled = estado.paso === 0;
    refs.siguiente.disabled = estado.paso === G.pasos.length - 1;
    [...refs.puntos.children].forEach((li, i) => { const b = li.firstChild; if (i === estado.paso) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    panel.dataset.oculto = estado.oculto ? 'si' : 'no';
    panel.querySelector('.guion__cuerpo').hidden = estado.oculto;
    refs.mostrar.hidden = !estado.oculto;
    medir();
  }

  function ocultar(si) {
    estado.oculto = si; guardar(); pintar();
    if (si) refs.mostrar.focus(); else enfocar(refs.siguiente);
  }

  /* ---------------- Activar y desactivar ---------------- */
  function alternar(activar, avisar) {
    estado.activo = activar === undefined ? !estado.activo : !!activar;
    guardar();
    if (estado.activo) { raiz.dataset.presentacion = 'activa'; if (!panel) construirPanel(); panel.hidden = false; pintar(); }
    else { delete raiz.dataset.presentacion; if (panel) panel.hidden = true; raiz.style.removeProperty('--guion-alto'); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
    if (boton) boton.setAttribute('aria-pressed', String(estado.activo));
    if (avisar !== false && MT.dlg) MT.dlg.toast(estado.activo ? 'Modo presentación activado.' : 'Modo presentación desactivado.');
    // El tamaño de la letra cambia la altura de la franja y de la barra de portales, de las que depende la altura de los portales.
    window.dispatchEvent(new Event('resize'));
  }

  function iniciar() {
    boton = h('button', { class: 'btn btn--chico btn--suave', id: 'btn-presentacion', type: 'button', 'aria-pressed': 'false', 'aria-keyshortcuts': 'Alt+P', title: M.ayudaBoton, onclick: () => alternar() }, M.activar);
    const acciones = document.querySelector('.franja-acciones');
    if (acciones) acciones.insertBefore(boton, document.getElementById('btn-apariencia'));
    document.addEventListener('keydown', (e) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.code === 'KeyP') { e.preventDefault(); alternar(); }
      else if (e.code === 'KeyG' && estado.activo) { e.preventDefault(); if (estado.oculto) ocultar(false); else enfocar(refs.siguiente); }
    });
    if (estado.activo) alternar(true, false);
  }

  iniciar();
  MT.presentacion = { iniciar, alternar, activo: () => estado.activo, paso: () => estado.paso, ir, reiniciar };
})(window.MT = window.MT || {});
