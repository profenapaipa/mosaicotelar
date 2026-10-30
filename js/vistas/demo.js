/* demo.js: el ajuste de punta a punta, vivo. Es lo único que NO existe en ninguno de los dos proyectos
   por separado: el recorrido que une al docente, a orientación, a la familia, a coordinación y al
   estudiante con un mismo dato (el ajuste). Cada pestaña es un rol; lo que se hace en una aparece en las otras.

   Está en una versión sencilla a propósito. Los proyectos completos, con todo lo que sus equipos
   construyeron, van incrustados tal cual: ver embed.js. */
(function (MT) {
  'use strict';
  const st = MT.store;
  const { espacio } = MT.comun;

  const TABS = [
    { id: 'docente', etiqueta: 'Docente', icono: 'docente' },
    { id: 'orientacion', etiqueta: 'Orientación', icono: 'orientacion' },
    { id: 'familia', etiqueta: 'Familia', icono: 'familia' },
    { id: 'coordinacion', etiqueta: 'Coordinación', icono: 'coordinacion' },
    { id: 'estudiante', etiqueta: 'Estudiante', icono: 'libro' },
  ];
  const USUARIOS = {
    docente: { iniciales: 'DC', nombre: 'Docente', rol: 'Demostración' },
    orientacion: { iniciales: 'OR', nombre: 'Equipo de orientación', rol: 'Demostración' },
    familia: { iniciales: 'AC', nombre: 'Acudiente', rol: 'Demostración' },
    coordinacion: { iniciales: 'CO', nombre: 'Coordinación', rol: 'Demostración' },
    estudiante: { iniciales: 'DE', nombre: 'Demo', rol: 'Estudiante' },
  };

  MT.router.registrar({
    id: 'demo', titulo: 'Ajuste de punta a punta', subs: TABS,
    // Los tres primeros roles y coordinación son de Kinesis; el estudiante, de Wisfox.
    espacio: (sub) => (sub === 'estudiante' ? 'wisfox' : 'kinesis'),
    render(main, { sub }) {
      if (st.obtener().rol !== sub) st.cambiar((x) => { x.rol = sub; });
      const c = espacio(main, { marca: 'mosaico', nombre: 'Ajuste de punta a punta', descripcion: 'Demostración integrada · datos ficticios', ruta: 'demo', tabs: TABS, sub, usuario: USUARIOS[sub] });
      (sub === 'estudiante' ? MT.demoWisfox.leccion : MT.demoKinesis[sub])(c);
    },
  });
})(window.MT = window.MT || {});
