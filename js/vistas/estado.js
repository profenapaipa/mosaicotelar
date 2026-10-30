/* estado.js: la hoja de ruta. Dice con claridad qué hace la plataforma hoy, qué responde con ejemplos y qué
   viene, para que un colegio, una familia o un inversionista sepan exactamente qué están viendo. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { pagina } = MT.comun;

  const FILAS = [
    ['Disponible hoy', 'ok', 'Cinco espacios por rol con crear, editar y borrar: estudiantes, actividades con DUA y quiz, ajustes con aprobación, notas, cursos y categorías de apoyo. Biblioteca de archivos con permisos por rol. Ruta de Inglés de grado 8.° con lecciones y quizes explicados. Progreso, puntos y logros.'],
    ['Con respuestas de ejemplo', 'aviso', 'ValerIA, la guía de IA, ya tiene su lugar en cada espacio y responde con textos preparados. Se conecta a un modelo de lenguaje sin cambiar nada más.'],
    ['En desarrollo', 'e', 'Servidor con cuentas de usuario y base de datos para compartir la información entre dispositivos. Generación del documento PIAR en el formato oficial. Más materias en la ruta del estudiante.'],
    ['Antes de usar datos reales', 'e', 'Política de tratamiento de datos, autorización de las familias, contrato con el colegio, cifrado y una revisión de seguridad independiente.'],
  ];

  MT.router.registrar({
    id: 'hoja', titulo: 'Hoja de ruta', espacio: '',
    render(main) {
      const c = pagina(main, { etiqueta: 'Hoja de ruta', titulo: 'Qué hay hoy y qué viene', descripcion: 'Lo que la plataforma hace, lo que responde con ejemplos y lo que sigue.' });
      c.append(h('div', { class: 'rejilla' },
        h('div', { class: 'tarjeta' }, h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla' },
          h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Etapa'), h('th', { scope: 'col' }, 'Qué incluye'))),
          h('tbody', null, FILAS.map(([e, k, t]) => h('tr', null, h('td', null, h('span', { class: 'sello sello--' + k }, e)), h('td', null, t))))))),
        h('div', { class: 'tarjeta tarjeta--borde' }, h('h2', null, 'Dónde se guarda lo que haces'),
          h('p', null, 'Esta versión no tiene servidor: lo que creas (actividades, ajustes, notas y archivos) se guarda solo en el navegador de este dispositivo y no se envía a ningún sitio. Eso protege la información, y también significa que no se comparte entre dispositivos ni entre personas.'),
          h('p', null, 'Compartirlo entre el equipo de un colegio es justamente lo que trae el servidor con cuentas de usuario.')),
        h('div', { class: 'aviso' }, 'No diagnosticamos, no reemplazamos al equipo interdisciplinario del colegio y no decidimos por el docente. Los datos de partida son de ejemplo.')));
    },
  });
})(window.MT = window.MT || {});
