/* config.js: lo único que se cambia al publicar. Sin claves ni secretos: este archivo es público.

   contacto: correo al que llegan las solicitudes de piloto. Si queda vacío, la página de piloto muestra
   la información sin el formulario. */
(function (MT) {
  'use strict';
  MT.config = { contacto: '' };
})(window.MT = window.MT || {});
