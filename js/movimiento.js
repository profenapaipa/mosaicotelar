/* movimiento.js: una sola respuesta a "¿se puede mover algo con suavidad?", para que el interruptor de la versión calmada y el ajuste
   del sistema (prefers-reduced-motion) valgan igual en todas partes.

   Por qué hace falta: el CSS ya apaga animaciones y transiciones (calmado.css), pero un desplazamiento pedido desde JavaScript con
   scrollIntoView({ behavior: 'smooth' }) ignora el CSS. Quien necesite desplazar la pantalla debe preguntar aquí. */
(function (MT) {
  'use strict';
  const reducir = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // Calmado: la persona lo encendió en Apariencia, o su sistema pide menos movimiento.
  const calmado = () => document.documentElement.dataset.movimiento === 'calmado' || reducir.matches;

  MT.movimiento = {
    calmado,
    suave: () => !calmado(),
    // Lleva un elemento a la vista, con suavidad solo si se puede.
    desplazar(el) { if (el) el.scrollIntoView({ behavior: calmado() ? 'auto' : 'smooth', block: 'start' }); },
  };
})(window.MT = window.MT || {});
