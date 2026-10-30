/* estado.js: la hoja de ruta, en tres lecturas para quien decide si apoyar, probar o comprar:
   - Propuesta: el objetivo, a quién sirve, cómo se sostiene y cómo sabremos si funciona.
   - Arquitectura: qué corre en el navegador, qué corre en un servidor y qué falta.
   - Etapas: qué hay hoy y qué viene.
   Nada aquí es una promesa sin fecha ni una cifra inventada: lo que no está validado se dice "por validar". */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { pagina } = MT.comun;

  const TABS = [{ id: 'propuesta', etiqueta: 'Propuesta' }, { id: 'arquitectura', etiqueta: 'Arquitectura' }, { id: 'etapas', etiqueta: 'Etapas' }];
  const OAPE = 'https://oape.educacionbogota.edu.co/sites/default/files/2026-05/3.Marzo_2026_Boletin_Mensual_1.pdf';

  const tarjeta = (t, ...hijos) => h('div', { class: 'tarjeta' }, h('h2', null, t), ...hijos);
  const lista = (l) => h('ul', null, l.map((x) => h('li', null, x)));

  function propuesta(c) {
    c.append(h('section', { class: 'siguiente-banner' }, h('div', null, h('p', { class: 'etiqueta' }, 'Objetivo'),
      h('h2', null, 'Que cada estudiante que necesita ajustes los reciba en la clase de hoy, y no solo en un documento.'),
      h('p', null, 'Mosaico Telar acorta el camino entre el plan de ajustes (PIAR) y lo que ocurre en el aula, y deja a todos los involucrados viéndolo al mismo tiempo.'))));
    c.append(h('div', { class: 'rejilla rejilla--2', style: 'margin-top:1rem' },
      tarjeta('El problema', h('p', null, 'Todo colegio debe elaborar un PIAR para cada estudiante con discapacidad (Decreto 1421 de 2017). En la práctica el plan queda en una carpeta y el docente adapta la clase después de darla, sin que orientación ni la familia lo vean.'),
        h('p', null, 'En colegios oficiales de Bogotá hay 22.803 estudiantes con discapacidad (marzo de 2026). ', h('a', { href: OAPE, rel: 'noopener' }, 'Boletín de la OAPE'), '.')),
      tarjeta('Para quién es', h('p', null, h('strong', null, 'Quienes la usan: '), 'docentes, orientación, familias, coordinación y estudiantes.'),
        h('p', null, h('strong', null, 'Quienes deciden: '), 'rectorías, coordinaciones académicas y secretarías de educación.'),
        h('p', { class: 'suave' }, 'Quién paga y cuánto es una hipótesis por validar en el piloto.'))));
    c.append(h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' },
      tarjeta('Valor para el colegio', lista(['Evidencia de que cada ajuste se pensó, se aprobó y se aplicó', 'Menos trabajo duplicado entre docente y orientación', 'Cumplimiento del Decreto 1421 con trazabilidad'])),
      tarjeta('Valor para la familia', lista(['Ve el proceso mientras ocurre', 'Entiende qué cambió y por qué', 'Sabe cómo acompañar en casa'])),
      tarjeta('Valor para un aliado', lista(['Un problema nacional con norma que obliga', 'Un producto probado por estudiantes y docentes', 'Datos de un piloto antes de escalar']))));
    c.append(h('div', { class: 'rejilla rejilla--2', style: 'margin-top:1rem' },
      tarjeta('Cómo se sostiene (hipótesis)', lista(['Piloto acompañado en un curso, sin costo', 'Luego, una licencia por colegio: el precio está por definir con los primeros colegios', 'Aliados que financien el servidor, la revisión de seguridad y el contenido'])),
      tarjeta('Cómo sabremos que funciona', lista(['Tiempo entre el PIAR y la primera actividad ajustada', 'Porcentaje de ajustes propuestos que orientación aprueba', 'Uso semanal por rol (docentes, familias, estudiantes)', 'Percepción de docentes y familias, con una encuesta corta']))));
    c.append(h('div', { class: 'rejilla rejilla--2', style: 'margin-top:1rem' },
      tarjeta('Riesgos y cómo se manejan', lista(['Datos de menores: ningún dato real hasta cumplir los requisitos de protección de datos', 'La IA se equivoca: solo propone, decide quien enseña, y nunca ve información clínica', 'Que los docentes no la adopten: guía de inicio rápido por rol y un piloto con acompañamiento', 'Competencia: PIARPLUS genera documentos con IA; nosotros llevamos el ajuste al aula (ver la comparación en el mapa)'])),
      tarjeta('Qué necesitamos', lista(['Un colegio piloto y un curso', 'Revisión legal de protección de datos (Ley 1581)', 'Un servidor y su mantenimiento', 'Financiación para el primer año']),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/piloto' }, 'Solicitar un piloto'), h('a', { class: 'btn btn--suave', href: '#/mapa/comparar' }, 'Comparación con PIARPLUS')))));
  }

  const CAPAS = [
    ['Interfaz', 'Se ejecuta en el navegador: HTML, CSS y JavaScript. Funciona sin instalar nada.', 'Aplicación instalable en el celular, que sigue funcionando sin internet.', 'ok'],
    ['Portales Kinesis y Wisfox', 'Aplicaciones de sus equipos, con sus propios datos. “Mi espacio” reúne el trabajo de los tres en una pantalla.', 'Compartir un solo modelo de datos y un solo inicio de sesión entre los tres.', 'aviso'],
    ['Servidor (backend)', 'No hay. Lo creado se guarda en el navegador de quien lo crea.', 'API con cuentas, roles y registro de quién hizo qué.', 'e'],
    ['Base de datos', 'El navegador (localStorage).', 'Base de datos con copia de seguridad y cifrado, una por colegio.', 'e'],
    ['Archivos', 'El navegador (IndexedDB), con validación de formato y de contenido.', 'Almacenamiento con permisos, revisión de virus y vencimiento.', 'e'],
    ['ValerIA (IA)', 'Textos de ejemplo. El agente está definido (personalidad, límites y voz) y corre en un servicio aparte.', 'Un servicio intermedio que guarda la clave, filtra los datos y limita el uso.', 'aviso'],
    ['Seguridad y privacidad', 'Los permisos por rol se aplican en pantalla.', 'Los permisos se hacen cumplir en el servidor, que es el único lugar donde de verdad se garantizan.', 'e'],
  ];
  const ETIQ = { ok: 'Disponible', aviso: 'Parcial', e: 'Por construir' };

  function arquitectura(c) {
    c.append(h('div', { class: 'tarjeta' }, h('h2', null, 'Frontend y backend, capa por capa'),
      h('p', { class: 'suave' }, 'Hoy la plataforma es un frontend completo. Para usarse con datos reales entre varias personas necesita su backend: esa es la siguiente etapa.'),
      h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla' },
        h('thead', null, h('tr', null, ['Capa', 'Hoy', 'Siguiente', 'Estado'].map((t) => h('th', { scope: 'col' }, t)))),
        h('tbody', null, CAPAS.map(([a, b, d, k]) => h('tr', null, h('th', { scope: 'row' }, a), h('td', null, b), h('td', null, d), h('td', null, h('span', { class: 'sello sello--' + k }, ETIQ[k])))))))));
    c.append(h('div', { class: 'aviso', style: 'margin-top:1rem' }, 'Por qué importa: mientras no haya servidor, un usuario con conocimientos técnicos podría ver o cambiar lo que su propio navegador guarda. Con datos de ejemplo no hay riesgo; con datos reales sí, y por eso no se usan hasta tener backend.'));
  }

  const ETAPAS = [
    ['Disponible hoy', 'ok', 'Cinco espacios por rol con crear, editar y borrar: estudiantes, actividades con DUA y quiz, ajustes con aprobación, notas, cursos y categorías. Archivos con permisos por rol. Ruta de Inglés de grado 8.° con quizes explicados. Progreso, puntos y logros. Guía de inicio rápido por rol y acceso a los tres portales.'],
    ['Con respuestas de ejemplo', 'aviso', 'ValerIA ya tiene su lugar en cada espacio y responde con textos preparados. Se conecta a un modelo de lenguaje sin cambiar nada más.'],
    ['En desarrollo', 'e', 'Servidor con cuentas y base de datos para compartir entre dispositivos y personas. Un solo inicio de sesión para los tres portales. Documento PIAR en el formato oficial. Más materias en la ruta del estudiante.'],
    ['Antes de usar datos reales', 'e', 'Política de tratamiento de datos, autorización de las familias, contrato con el colegio, cifrado y revisión de seguridad independiente.'],
  ];
  function etapas(c) {
    c.append(h('div', { class: 'tarjeta' }, h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla' },
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Etapa'), h('th', { scope: 'col' }, 'Qué incluye'))),
      h('tbody', null, ETAPAS.map(([e, k, t]) => h('tr', null, h('td', null, h('span', { class: 'sello sello--' + k }, e)), h('td', null, t))))))),
      h('div', { class: 'aviso', style: 'margin-top:1rem' }, 'No diagnosticamos, no reemplazamos al equipo interdisciplinario del colegio y no decidimos por el docente. Los datos de partida son de ejemplo.'));
  }

  MT.router.registrar({
    id: 'hoja', titulo: 'Hoja de ruta', espacio: '', subs: TABS,
    render(main, { sub }) {
      const c = pagina(main, { etiqueta: 'Hoja de ruta', titulo: { propuesta: 'Para qué existe y cómo se sostiene', arquitectura: 'Cómo está construida y qué falta', etapas: 'Qué hay hoy y qué viene' }[sub],
        descripcion: 'La mirada de quien decide si probar, apoyar o llevarla a su colegio.' });
      c.append(h('nav', { class: 'pestanas-pagina', 'aria-label': 'Secciones de la hoja de ruta' }, TABS.map((t) => h('a', { href: '#/hoja/' + t.id, 'aria-current': t.id === sub ? 'page' : null }, t.etiqueta))));
      ({ propuesta, arquitectura, etapas })[sub](c);
    },
  });
})(window.MT = window.MT || {});
