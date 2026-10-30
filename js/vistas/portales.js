/* portales.js: los tres portales en paralelo y la guía de inicio rápido de cada rol.

   Responde dos preguntas que desconciertan a quien llega: "¿qué hace cada cosa?" y "¿por dónde empiezo yo?".
   - #/portales: Kinesis, Wisfox y ValerIA lado a lado, y un ajuste recorriendo los tres.
   - #/guia/<rol>: los pasos de cada rol, cada uno con el portal donde ocurre y dos botones:
     abrir el portal original, o hacerlo aquí mismo, en Mi espacio. */
(function (MT) {
  'use strict';
  const { h, marca, icono } = MT.ui;
  const { pagina } = MT.comun;
  const st = MT.store;

  const PORTALES = {
    kinesis: {
      nombre: 'Kinesis', rotulo: 'El aula', paraQuien: 'Docentes, orientación, familias y coordinación',
      que: 'Donde se planea una clase inclusiva y se decide qué ajuste recibe cada estudiante. Reúne los perfiles de apoyo, la planeación con DUA y la aprobación de orientación.',
      haces: ['Ver los apoyos de cada estudiante, sin diagnóstico', 'Planear con los tres principios del DUA', 'Proponer, revisar y aprobar ajustes', 'Mostrar a la familia lo ya aprobado'],
      entrega: 'Entrega a Wisfox la actividad aprobada y a la familia las novedades.', estado: ['Disponible', 'ok'],
    },
    wisfox: {
      nombre: 'Wisfox', rotulo: 'El estudiante', paraQuien: 'Estudiantes (y su familia, acompañando)',
      que: 'Donde el estudiante aprende a su ritmo: rutas por materia, lecciones, quizes con explicación, puntos y logros, con un zorro que acompaña.',
      haces: ['Seguir su ruta de aprendizaje', 'Hacer la actividad que le llegó, a su medida', 'Responder quizes y ganar logros', 'Preguntar sus dudas a ValerIA'],
      entrega: 'Devuelve al docente el progreso: quiz, puntos y logros.', estado: ['Disponible', 'ok'],
    },
    valeria: {
      nombre: 'ValerIA', rotulo: 'La guía', paraQuien: 'Docentes y estudiantes',
      que: 'Una asistente de inteligencia artificial que propone y no decide. Ayuda al docente a diseñar y al estudiante a resolver dudas. Nunca recibe información clínica.',
      haces: ['Pedir ideas para una actividad', 'Pedir ayuda para redactar un ajuste', 'Aclarar una duda de un tema', 'Responder en español e inglés'],
      entrega: 'Entrega propuestas al docente y explicaciones al estudiante.', estado: ['Respuestas de ejemplo', 'aviso'],
    },
  };

  const urlPortal = (id) => (MT.config.portales || {})[id] || null;
  // Los portales se ven dentro de Mosaico Telar, en su propia pestaña: no hace falta salir para viajar entre ellos.
  const abrirPortal = (id) => { location.hash = '#/portales/' + id; };
  const botonPortal = (id, clase) => h('button', { class: 'btn ' + (clase || ''), type: 'button', onclick: () => abrirPortal(id) }, 'Ir a ' + PORTALES[id].nombre);

  // Un ajuste recorriendo los tres portales: cada paso cae en el carril donde ocurre.
  const CARRILES = ['kinesis', 'valeria', 'wisfox'];
  const FLUJO = [
    ['kinesis', 'Orientación', 'Registra los apoyos del perfil de cada estudiante.'],
    ['kinesis', 'Docente', 'Planea la clase con DUA y crea la actividad.'],
    ['valeria', 'Docente', 'Pide ideas y ayuda a redactar. Propone; decide quien enseña.'],
    ['kinesis', 'Docente', 'Ajusta la actividad al perfil y la envía a orientación.'],
    ['kinesis', 'Orientación', 'Revisa y aprueba, o devuelve con una nota.'],
    ['kinesis', 'Familia', 'Ve la novedad ya aprobada, con su razón.'],
    ['wisfox', 'Estudiante', 'Recibe la actividad a su medida, hace el quiz y gana logros.'],
    ['valeria', 'Estudiante', 'Resuelve sus dudas mientras practica.'],
    ['kinesis', 'Docente', 'Ve el progreso del estudiante y decide el siguiente paso.'],
  ];

  const TABS = [{ id: 'general', etiqueta: 'Vista general' }, { id: 'kinesis', etiqueta: 'Kinesis' }, { id: 'wisfox', etiqueta: 'Wisfox' }, { id: 'valeria', etiqueta: 'ValerIA' }];
  const pestanas = (sub) => h('nav', { class: 'pestanas-pagina', 'aria-label': 'Portales' }, TABS.map((t) => h('a', { href: '#/portales/' + t.id, 'aria-current': t.id === sub ? 'page' : null }, t.etiqueta)));

  // Un portal dentro de Mosaico Telar: se viaja de uno a otro con las pestañas, sin salir de la plataforma.
  function vistaPortal(main, id) {
    const p = PORTALES[id]; const rol = st.obtener().rol; const r = rol ? MT.roles.por(rol) : null;
    const c = pagina(main, { etiqueta: 'Portales', titulo: p.nombre + ': ' + p.rotulo.toLowerCase(), descripcion: p.que });
    c.append(pestanas(id));
    c.append(h('div', { class: 'portal-franja', 'data-espacio': id },
      h('span', null, r ? h('span', null, h('strong', null, 'Tu rol: ' + r.nombre + '. '), 'Tu guía te dice qué hacer aquí.') : h('span', null, 'Elige tu rol para ver qué te toca hacer aquí.')),
      h('span', { class: 'acciones' }, h('a', { class: 'btn btn--chico', href: r ? '#/guia/' + rol : '#/guia' }, 'Mi guía de inicio'),
        id === 'valeria' ? null : h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => { if (r) { location.hash = '#/mi/resumen'; } else { location.hash = '#/guia'; } } }, 'Hacerlo en Mi espacio'))));
    if (id === 'valeria') {
      const caja = h('div', { class: 'tarjeta tarjeta--chat' });
      c.append(caja, h('p', { class: 'suave' }, 'ValerIA propone y no decide. Hoy responde con textos de ejemplo y nunca recibe información clínica.'));
      const ch = MT.ia.montarChat(caja, MT.ia.panel.sugerenciasPara());
      MT.router.alSalir(() => ch.destruir());
      return;
    }
    const url = urlPortal(id);
    c.append(h('iframe', { class: 'portal-marco', src: url, title: p.nombre + ', ' + p.rotulo.toLowerCase(), loading: 'lazy', referrerpolicy: 'no-referrer',
      allow: 'clipboard-write', sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads' }));
    c.append(h('p', { class: 'suave' }, p.nombre + ' es una aplicación de su equipo, con sus propios datos y su propio inicio de sesión. Se muestra aquí tal como la construyeron. ',
      h('a', { href: url, target: '_blank', rel: 'noopener' }, 'Si no carga, ábrela en una pestaña aparte.')));
  }

  function vistaPortales(main) {
    const c = pagina(main, { etiqueta: 'Portales', titulo: 'Tres portales, una sola plataforma',
      descripcion: 'Kinesis, Wisfox y ValerIA trabajan en paralelo y se pasan el trabajo entre sí. Viaja entre ellos con las pestañas, sin salir de Mosaico Telar.' });
    c.append(pestanas('general'));

    c.append(h('div', { class: 'rejilla rejilla--3 portales' }, Object.entries(PORTALES).map(([id, p]) => h('article', { class: 'tarjeta portal', 'data-espacio': id },
      h('div', { class: 'proyecto-cab' }, marca(id), h('div', null, h('h2', null, p.nombre), h('small', null, p.rotulo))),
      h('span', { class: 'sello sello--' + p.estado[1] }, p.estado[0]),
      h('p', null, p.que),
      h('p', { class: 'etiqueta' }, 'Para quién'), h('p', null, p.paraQuien),
      h('p', { class: 'etiqueta' }, 'Qué haces ahí'), h('ul', null, p.haces.map((x) => h('li', null, x))),
      h('p', { class: 'portal__entrega' }, p.entrega),
      h('div', { class: 'acciones' }, botonPortal(id), id === 'valeria' ? null : h('a', { class: 'btn btn--suave', href: id === 'kinesis' ? '#/guia' : '#/guia/estudiante' }, 'Cómo usarlo'))))));

    c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-flujo' },
      h('h2', { id: 'h-flujo' }, 'Un ajuste recorre los tres portales'),
      h('p', { class: 'bajada' }, 'Cada fila es un paso, en el portal donde ocurre. Lee de arriba hacia abajo: el trabajo baja de un portal al siguiente.'),
      h('div', { class: 'carriles-cab', 'aria-hidden': 'true' }, CARRILES.map((id) => h('div', { 'data-espacio': id }, marca(id, 'carril-marca'), h('strong', null, PORTALES[id].nombre)))),
      h('ol', { class: 'carriles' }, FLUJO.map(([id, quien, texto], i) => h('li', { class: 'carril-paso' },
        CARRILES.map((c2) => (c2 === id
          ? h('div', { class: 'carril-celda carril-celda--activa', 'data-espacio': id },
            h('span', { class: 'carril-n' }, String(i + 1)), h('p', { class: 'etiqueta' }, quien + ' · ' + PORTALES[id].nombre), h('p', null, texto))
          : h('div', { class: 'carril-celda', 'aria-hidden': 'true' }))))))));

    c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-une' },
      h('h2', { id: 'h-une' }, 'Qué los une'),
      h('div', { class: 'rejilla rejilla--4' }, [
        ['Un rol, un camino', 'Eliges quién eres una vez y cada portal te muestra lo tuyo.'],
        ['Los mismos datos', 'Un ajuste aprobado en Kinesis es el que ve el estudiante en Wisfox.'],
        ['Una guía común', 'ValerIA ayuda en los dos portales y nunca recibe información clínica.'],
        ['Una sola identidad', 'Mismo diseño, mismas reglas de privacidad y mismo lenguaje.'],
      ].map(([t, p]) => h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, t), h('p', null, p)))),
      h('p', { class: 'aviso', style: 'margin-top:1rem' }, 'Hoy, “Mi espacio” reúne los tres portales en una sola pantalla, con todo conectado. Kinesis y Wisfox originales siguen siendo aplicaciones de sus equipos, con sus propios datos: compartir los datos entre ellas es el trabajo del servidor central de la hoja de ruta.'),
      h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/guia' }, 'Mi guía de inicio rápido'), h('a', { class: 'btn btn--suave', href: '#/mapa/conexiones' }, 'Ver el mapa de módulos'))));
  }

  /* ---------------- Guía de inicio rápido por rol ---------------- */
  // portal: dónde ocurre el paso. aqui: sección de Mi espacio donde se puede hacer ahora mismo.
  const GUIA = {
    docente: { principal: 'kinesis', meta: 'Planear una clase, ajustarla a cada estudiante y ver cómo le va.', pasos: [
      { portal: 'kinesis', t: 'Conoce los apoyos de tus estudiantes', d: 'Mira qué le sirve a cada uno. Nunca verás un diagnóstico.', aqui: 'estudiantes' },
      { portal: 'kinesis', t: 'Planea la actividad con DUA', d: 'Piensa la clase para todos: varias formas de representar, de expresarse y de motivarse. Agrega su quiz.', aqui: 'actividades' },
      { portal: 'valeria', t: 'Pide ideas a ValerIA', d: 'Te propone una actividad. Tú decides qué usar.', aqui: 'actividades' },
      { portal: 'kinesis', t: 'Ajusta la actividad a un estudiante', d: 'Cada apoyo se vuelve un cambio concreto, con su razón. Envíalo a orientación.', aqui: 'ajustes' },
      { portal: 'wisfox', t: 'Mira cómo la recibe el estudiante', d: 'Cuando orientación aprueba, el estudiante la ve a su medida y tú ves su progreso.', aqui: 'resumen' },
    ] },
    orientacion: { principal: 'kinesis', meta: 'Validar que cada ajuste sea adecuado antes de que llegue al estudiante.', pasos: [
      { portal: 'kinesis', t: 'Completa los perfiles de apoyo', d: 'Marca qué le ayuda a cada estudiante. Sin diagnóstico en el perfil.', aqui: 'estudiantes' },
      { portal: 'kinesis', t: 'Revisa los ajustes propuestos', d: 'El docente propone y tú validas. Cada cambio trae su razón.', aqui: 'ajustes' },
      { portal: 'kinesis', t: 'Aprueba o devuelve con una nota', d: 'Nada llega al estudiante ni a la familia sin tu decisión.', aqui: 'ajustes' },
      { portal: 'kinesis', t: 'Guarda lo clínico donde solo tú lo ves', d: 'Los archivos clínicos son solo de orientación.', aqui: 'archivos' },
    ] },
    familia: { principal: 'kinesis', meta: 'Entender qué se hace en clase y acompañar en casa.', pasos: [
      { portal: 'kinesis', t: 'Mira las novedades', d: 'Lo que el colegio ya aprobó, en lenguaje sencillo y con su razón.', aqui: 'resumen' },
      { portal: 'kinesis', t: 'Lee los mensajes del equipo', d: 'Las notas que el equipo marcó para ti.', aqui: 'resumen' },
      { portal: 'wisfox', t: 'Acompaña la práctica en casa', d: 'Tu estudiante practica en Wisfox. Pregúntale por sus logros.', aqui: null },
    ] },
    coordinacion: { principal: 'kinesis', meta: 'Dejar el colegio listo para que los demás puedan trabajar.', pasos: [
      { portal: 'kinesis', t: 'Crea los cursos', d: 'Cada estudiante necesita un curso.', aqui: 'cursos' },
      { portal: 'kinesis', t: 'Registra a los estudiantes', d: 'Con un código, sin nombres en esta demostración.', aqui: 'estudiantes' },
      { portal: 'kinesis', t: 'Define las categorías de apoyo', d: 'Las opciones que orientación marcará en los perfiles.', aqui: 'categorias' },
      { portal: 'kinesis', t: 'Mira las cifras del colegio', d: 'Cuántos ajustes hay en cada estado, sin ver de quién.', aqui: 'resumen' },
    ] },
    estudiante: { principal: 'wisfox', meta: 'Aprender a tu ritmo, con la actividad hecha a tu medida.', pasos: [
      { portal: 'wisfox', t: 'Entra a tu actividad de hoy', d: 'Si orientación aprobó un ajuste para ti, ya viene a tu medida.', aqui: 'resumen' },
      { portal: 'wisfox', t: 'Sigue tu ruta de Inglés', d: 'Lecciones cortas con su quiz y la explicación de cada respuesta.', aqui: 'ruta' },
      { portal: 'valeria', t: 'Pregunta lo que no entiendas', d: 'ValerIA te explica con ejemplos y te hace una pregunta para practicar.', aqui: null },
      { portal: 'wisfox', t: 'Mira tus logros', d: 'Puntos, niveles y logros por lo que vas haciendo.', aqui: 'logros' },
    ] },
  };

  function irAqui(rol, seccion) { st.cambiar((s) => { s.rol = rol; }); location.hash = '#/mi/' + seccion; }

  function vistaGuia(main, { sub }) {
    const rol = sub; const r = MT.roles.por(rol); const g = GUIA[rol];
    const c = pagina(main, { etiqueta: 'Inicio rápido', titulo: 'Tu guía de inicio rápido', descripcion: 'Elige tu rol y sigue los pasos. Cada paso dice en qué portal ocurre y te lleva a él.' });
    c.append(h('nav', { class: 'pestanas-pagina', 'aria-label': 'Elige tu rol' }, MT.roles.lista.map((x) => h('a', { href: '#/guia/' + x.id, 'aria-current': x.id === rol ? 'page' : null }, x.nombre))));
    c.append(h('section', { class: 'siguiente-banner' },
      h('div', null, h('p', { class: 'etiqueta' }, 'Tu meta como ' + r.nombre.toLowerCase()), h('h2', null, g.meta), h('p', null, 'Tu portal principal es ' + PORTALES[g.principal].nombre + '.')),
      h('div', { class: 'acciones' }, botonPortal(g.principal),
        h('button', { class: 'btn btn--suave', type: 'button', onclick: () => irAqui(rol, 'resumen') }, 'Trabajar en Mi espacio'))));
    c.append(h('ol', { class: 'guia-pasos' }, g.pasos.map((p, i) => h('li', { class: 'tarjeta guia-paso', 'data-espacio': p.portal },
      h('span', { class: 'n', 'aria-hidden': 'true' }, String(i + 1)),
      h('div', { class: 'guia-paso__texto' }, h('p', { class: 'etiqueta' }, 'En ' + PORTALES[p.portal].nombre), h('h3', null, p.t), h('p', null, p.d)),
      h('div', { class: 'acciones' },
        p.aqui ? h('button', { class: 'btn btn--chico', type: 'button', onclick: () => irAqui(rol, p.aqui) }, 'Hacerlo aquí') : null,
        h('button', { class: 'btn btn--chico btn--suave', type: 'button', 'aria-label': 'Ir a ' + PORTALES[p.portal].nombre + ', paso ' + (i + 1), onclick: () => abrirPortal(p.portal) },
          'Ir a ' + PORTALES[p.portal].nombre))))));
    c.append(h('p', { class: 'suave' }, '“Ir a” abre el portal aquí mismo, sin salir de Mosaico Telar. “Hacerlo aquí” lo hace en Mi espacio, la versión que reúne los tres. ', h('a', { href: '#/portales' }, 'Ver qué hace cada portal')));
  }

  MT.router.registrar({
    id: 'portales', titulo: 'Portales', subs: TABS,
    espacio: (sub) => (['kinesis', 'wisfox', 'valeria'].includes(sub) ? sub : ''),
    render(main, { sub }) { if (sub === 'general') vistaPortales(main); else vistaPortal(main, sub); },
  });
  MT.router.registrar({
    id: 'guia', titulo: 'Inicio rápido', espacio: '',
    // La guía abre en el rol de quien la lee; los demás quedan a un clic.
    subs: () => { const a = st.obtener().rol; const l = MT.roles.lista.map((r) => ({ id: r.id })); return a ? [l.find((x) => x.id === a), ...l.filter((x) => x.id !== a)] : l; },
    render: vistaGuia,
  });
  MT.portales = { PORTALES, GUIA, abrirPortal };
})(window.MT = window.MT || {});
