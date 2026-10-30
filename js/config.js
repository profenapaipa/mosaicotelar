/* config.js: lo único que se cambia al publicar. Sin claves ni secretos: este archivo es público.

   contacto: correo al que llegan las solicitudes de piloto. Si queda vacío, la página de piloto muestra
   la información sin el formulario.
   portales: dirección pública de cada aplicación. ValerIA no tiene dirección propia: vive dentro de la
   plataforma. */
(function (MT) {
  'use strict';
  MT.config = {
    contacto: '',
    portales: {
      kinesis: 'https://profenapaipa.github.io/Kinesis/',
      wisfox: 'https://profenapaipa.github.io/wisfox/',
    },
  };
})(window.MT = window.MT || {});
