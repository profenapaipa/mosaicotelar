/* red-de-seguridad.js: que un error de ejecución nunca deje la pantalla en blanco.

   Por qué un archivo aparte, escrito sin depender de nada (ni de MT.ui ni de MT.mensajes): este código existe para el día en que algo
   falla, y lo que falla puede ser justamente uno de esos archivos. Se carga el primero, en el <head>.

   Qué cubre, y lo que ya cubría el router:
   - router.js ya atrapa el error de una vista al pintarla y deja un aviso. No cubre un script que no se pudo descargar (sin red a
     mitad de la carga, un archivo que falta), ni un error en el arranque de main.js antes de que el router empiece, ni uno de los
     pasos que el router hace después de pintar. En esos casos main queda vacío.
   - Esta red lo detecta: espera a que la página termine de cargar y, si entonces (o tras cualquier error) no hay nada visible en
     main, muestra un panel con tres salidas: volver a intentar, ir al inicio y empezar de nuevo. Si hay contenido, no toca nada:
     un error en un botón no debe tapar una pantalla que se puede usar. */
(function () {
  'use strict';
  var TEXTO = {
    titulo: 'Algo no salió como esperábamos',
    texto: 'Esta pantalla no se pudo mostrar. Tus datos de ejemplo siguen guardados en este dispositivo.',
    falta: 'No se pudo cargar una parte de la plataforma. Si no hay conexión, vuelve a intentarlo cuando regrese.',
    reintentar: 'Volver a intentar', inicio: 'Ir al inicio', reiniciar: 'Empezar de nuevo',
  };
  var fallaDeCarga = false; var pendiente = null;

  function hayContenido() {
    var main = document.getElementById('app'); if (!main) return false;
    return Array.prototype.some.call(main.children, function (x) { return x.tagName !== 'NOSCRIPT' && !x.hidden && x.getClientRects().length > 0; });
  }
  function boton(texto, clase, alPulsar) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + clase; b.textContent = texto; b.addEventListener('click', alPulsar); return b;
  }
  function mostrar() {
    var main = document.getElementById('app') || document.body;
    if (document.getElementById('red-de-seguridad')) return;
    var caja = document.createElement('div'); caja.className = 'contenedor'; caja.id = 'red-de-seguridad';
    caja.style.cssText = 'padding-top:2rem;padding-bottom:2rem';
    var t = document.createElement('div'); t.className = 'tarjeta'; t.setAttribute('role', 'alert');
    var h1 = document.createElement('h1'); h1.textContent = TEXTO.titulo; h1.tabIndex = -1;
    var p = document.createElement('p'); p.textContent = fallaDeCarga ? TEXTO.falta : TEXTO.texto;
    var acciones = document.createElement('div'); acciones.className = 'acciones';
    acciones.appendChild(boton(TEXTO.reintentar, '', function () { location.reload(); }));
    acciones.appendChild(boton(TEXTO.inicio, 'btn--suave', function () { location.hash = '#/'; location.reload(); }));
    // Empezar de nuevo: si el error viene de un dato guardado que ya no se entiende, esto lo quita. Los datos de ejemplo vuelven solos.
    acciones.appendChild(boton(TEXTO.reiniciar, 'btn--suave', function () {
      try { localStorage.removeItem('mosaicotelar.v2'); } catch (e) { /* sin almacenamiento */ }
      location.hash = '#/'; location.reload();
    }));
    t.appendChild(h1); t.appendChild(p); t.appendChild(acciones); caja.appendChild(t); main.appendChild(caja);
    try { h1.focus(); } catch (e) { /* nada */ }
  }
  function comprobar() {
    clearTimeout(pendiente); pendiente = null;
    if (document.readyState !== 'complete') return;       // todavía arrancando: el evento load vuelve a llamar
    if (!hayContenido()) mostrar();
  }
  // Un error cualquiera pide una comprobación en un momento; no se muestra nada si la pantalla se ve bien.
  function sospechar() { if (!pendiente) pendiente = setTimeout(comprobar, 500); }

  // En captura, para ver también los errores de carga de un <script>, que no suben por el documento.
  window.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el !== window && (el.tagName === 'SCRIPT' || el.tagName === 'LINK')) fallaDeCarga = true;
    sospechar();
  }, true);
  window.addEventListener('unhandledrejection', sospechar);
  window.addEventListener('load', function () { setTimeout(comprobar, 1500); });

  window.MT = window.MT || {};
  window.MT.seguridad = { comprobar: comprobar, hayContenido: hayContenido };
})();
