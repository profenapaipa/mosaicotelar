/* conexion.js: saber si hay internet, avisarlo con calma y registrar el service worker que deja la plataforma abrir sin red.

   Tres cosas, en este orden:
   1. Un aviso amable y fijo arriba cuando la conexión se cae, y otro corto cuando vuelve. Vive dentro de la franja (y no entre la
      franja y la barra de portales) para que la altura que mide vivos.js para los portales siga siendo la correcta.
   2. `sondear(url)`: una comprobación real de que una dirección responde. `navigator.onLine` solo sabe si hay una red conectada, no si
      esa red llega a internet (un wifi sin salida dice "en línea"), así que los portales de Kinesis y Wisfox no se fían de él.
   3. El registro de sw.js. Solo existe en https y en localhost: abriendo index.html desde el disco (file://), que es el plan B de la
      USB, no hay service worker y esta parte se salta en silencio. La plataforma funciona igual, porque no depende de él.

   Un evento "offline" u "online" se toma como verdad sin volver a preguntarle a navigator.onLine: así las pruebas pueden simularlo. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const M = MT.mensajes.sinConexion;
  let enLinea = navigator.onLine !== false;
  const oyentes = new Set();
  let aviso = null; let texto = null; let accion = null; let temporizador = null;

  /* ---------------- El aviso ---------------- */
  function crearAviso() {
    const franja = document.querySelector('.franja'); if (!franja) return;
    texto = h('span', { class: 'aviso-conexion__texto' });
    accion = h('button', { class: 'btn btn--chico', type: 'button', hidden: true, onclick: () => location.reload() }, M.recargar);
    const cerrar = h('button', { class: 'btn btn--chico btn--suave', type: 'button', 'aria-label': M.cerrar, onclick: () => ocultar() }, 'Cerrar');
    // role="status" desde el inicio y vacío: así los lectores de pantalla anuncian el texto cuando aparece.
    aviso = h('div', { class: 'aviso-conexion', role: 'status', hidden: true }, texto, h('span', { class: 'acciones' }, accion, cerrar));
    franja.prepend(aviso);
  }
  function mostrar(mensaje, conBoton) {
    if (!aviso) crearAviso(); if (!aviso) return;
    clearTimeout(temporizador);
    texto.textContent = mensaje; accion.hidden = !conBoton; aviso.hidden = false;
    // La franja crece o se encoge: los portales vuelven a medir cuánto espacio les queda.
    window.dispatchEvent(new Event('resize'));
  }
  function ocultar() { if (aviso) { aviso.hidden = true; window.dispatchEvent(new Event('resize')); } }

  function cambiar(valor) {
    if (valor === enLinea) return;
    enLinea = valor;
    if (!enLinea) mostrar(M.aviso, false);
    else if (aviso && !aviso.hidden) { mostrar(M.volvio, false); temporizador = setTimeout(ocultar, 4000); }
    oyentes.forEach((f) => { try { f(enLinea); } catch (e) { console.error(e); } });
  }
  window.addEventListener('offline', () => cambiar(false));
  window.addEventListener('online', () => cambiar(true));
  if (!enLinea) mostrar(M.aviso, false);

  /* ---------------- Sondeo ---------------- */
  // Una petición "no-cors" no deja leer la respuesta, pero resuelve si el servidor contestó y falla si no hay red: justo lo que se necesita.
  async function sondear(url, ms) {
    if (!enLinea) return false;
    const corte = new AbortController(); const t = setTimeout(() => corte.abort(), ms || 6000);
    try { await fetch(url, { mode: 'no-cors', cache: 'no-store', referrerPolicy: 'no-referrer', signal: corte.signal }); return true; }
    catch (e) { return false; } finally { clearTimeout(t); }
  }

  /* ---------------- Service worker ---------------- */
  function registrar() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return; // file://: sin worker, y está bien
    const habiaControl = !!navigator.serviceWorker.controller;
    const hayVersionNueva = () => mostrar(M.versionNueva, true);
    // Un worker nuevo toma el control cuando ya había uno: la página que se está viendo es de la versión anterior.
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (habiaControl) hayVersionNueva(); });
    navigator.serviceWorker.addEventListener('message', (e) => { if (e.data && e.data.tipo === 'version-nueva') hayVersionNueva(); });
    // Se registra al terminar de cargar: guardar la plataforma para después no debe competir con pintar la primera pantalla.
    const registrarAhora = () => navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Sin funcionamiento sin conexión:', e && e.message));
    if (document.readyState === 'complete') registrarAhora(); else window.addEventListener('load', registrarAhora);
  }

  MT.conexion = { enLinea: () => enLinea, alCambiar(f) { oyentes.add(f); return () => oyentes.delete(f); }, sondear, mostrar, ocultar };
  registrar();
})(window.MT = window.MT || {});
