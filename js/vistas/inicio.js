/* inicio.js: la puerta de entrada, pensada como la de una plataforma que se presenta a colegios y
   a un jurado. Muestra el producto REAL (capturas de Kinesis y de Wisfox), hace una sola pregunta
   ("¿quién eres?") y todo lo demás sale de ahí. Cada cifra tiene su fuente y lo simulado se dice. */
(function (MT) {
  'use strict';
  const { h, marca } = MT.ui;
  const st = MT.store;

  const OAPE = 'https://oape.educacionbogota.edu.co/sites/default/files/2026-05/3.Marzo_2026_Boletin_Mensual_1.pdf';
  const CORTE = 'https://www.diarioconstitucional.cl/2025/08/21/corte-constitucional-de-colombia-ampara-derecho-a-una-educacion-inclusiva-de-estudiante-neurodivergente/';

  function tarjetaRol(r) {
    return h('article', { class: 'tarjeta rol-tarjeta' },
      h('span', { class: 'rol-icono' }, MT.ui.icono(r.icono)),
      h('h3', null, r.nombre), h('p', { class: 'rol-lema' }, r.lema),
      h('p', { class: 'etiqueta' }, 'Entras a ' + r.espacio),
      h('a', { class: 'btn', href: r.hash, onclick: () => st.cambiar((s) => { s.rol = r.id; }) }, r.boton));
  }

  function proyecto(id, nombre, rotulo, texto, captura, alt, real, repo, demo) {
    return h('article', { class: 'tarjeta proyecto-tarjeta' },
      captura ? h('img', { class: 'captura', src: captura, alt, loading: 'lazy', width: '1280', height: '800' }) : h('div', { class: 'captura patron-telar', role: 'img', 'aria-label': 'Patrón de trama. ValerIA todavía no tiene una pantalla propia.', style: 'height:180px;border-radius:0;margin:0' }),
      h('div', { class: 'cuerpo' },
        h('div', { class: 'proyecto-cab' }, marca(id), h('div', null, h('h3', null, nombre), h('small', null, rotulo))),
        h('p', null, texto),
        h('div', { class: 'acciones' },
          h('a', { class: 'btn btn--chico', href: real }, 'Abrir el proyecto completo'),
          repo ? h('a', { class: 'btn btn--chico btn--suave', href: repo, rel: 'noopener' }, 'Código') : null,
          demo ? h('a', { class: 'btn btn--chico btn--suave', href: demo }, 'En la demostración') : null)));
  }

  MT.router.registrar({
    id: 'inicio', titulo: 'Inicio', espacio: '',
    render(main) {
      const s = st.obtener();
      const c = h('div', { class: 'contenedor' });

      c.append(h('section', { class: 'lienzo' },
        h('div', null,
          h('p', { class: 'descriptor' }, 'Colectivo de educación inclusiva con tecnología'),
          h('h1', null, 'Tejemos caminos ', h('em', null, 'para aprender.')),
          h('p', { class: 'intro' }, 'Mosaico Telar une tres proyectos de estudiantes, Kinesis, Wisfox e IA ValerIA, para que el docente planee una clase inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.'),
          h('div', { class: 'acciones' },
            h('a', { class: 'btn', href: '#/mapa/conexiones' }, 'Explorar el mapa'),
            h('a', { class: 'btn btn--suave', href: '#roles', onclick: (e) => { e.preventDefault(); const el = document.getElementById('roles'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, 'Elegir mi rol')),
          h('ul', { class: 'confianza' }, ['Hecho por estudiantes', 'Código público', 'Solo datos ficticios', 'Pensado desde el Decreto 1421 y el DUA'].map((t) => h('li', null, t)))),
        h('div', { class: 'vitrina' },
          h('div', { class: 'dispositivo dispositivo--a' }, h('img', { src: 'assets/capturas/kinesis-docente.jpg', alt: 'Pantalla real de Kinesis: el inicio del docente, con sus estudiantes, el siguiente paso y la planeación con DUA', width: '1280', height: '800' }), h('span', { class: 'dispositivo-rotulo' }, 'Kinesis')),
          h('div', { class: 'dispositivo dispositivo--b' }, h('img', { src: 'assets/capturas/wisfox-inicio.jpg', alt: 'Pantalla real de Wisfox: el árbol de aprendizaje con las materias, el progreso y las misiones diarias', width: '1280', height: '800' }), h('span', { class: 'dispositivo-rotulo' }, 'Wisfox')))));

      if (s.rol) {
        const r = MT.roles.por(s.rol);
        const sig = MT.roles.siguiente(s.rol, s);
        c.append(h('section', { class: 'siguiente-banner', 'aria-label': 'Tu siguiente paso' },
          h('div', null, h('p', { class: 'etiqueta' }, `Tu siguiente paso, como ${r.nombre.toLowerCase()}`), h('h2', null, sig.titulo), h('p', null, sig.texto)),
          h('a', { class: 'btn', href: sig.hash }, sig.boton)));
      }

      c.append(h('section', { class: 'seccion', id: 'roles', 'aria-labelledby': 'h-roles' },
        h('h2', { id: 'h-roles' }, '¿Quién eres? Empieza por aquí'),
        h('p', { class: 'bajada' }, 'Elige tu rol y te llevamos a donde te toca. Cada persona ve solo lo que necesita, y puedes cambiar de rol cuando quieras.'),
        h('div', { class: 'rejilla rejilla--5' }, MT.roles.lista.map(tarjetaRol)),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Si solo quieres conocer la plataforma, ', h('a', { href: '#/mapa/conexiones' }, 'empieza por el mapa'), ' o ', h('a', { href: '#/recorrido/roles' }, 'mira qué ve cada rol'), '.')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-como' },
        h('h2', { id: 'h-como' }, 'Así viaja una clase inclusiva'),
        h('p', { class: 'bajada' }, 'Un ajuste nace en el aula, pasa por orientación y solo entonces llega a la familia y al estudiante. ValerIA acompaña a quien enseña y a quien aprende.'),
        h('ol', { class: 'pasos3' },
          h('li', null, h('h3', null, 'Planea'), h('p', null, 'El docente diseña la clase con DUA, ve los apoyos de cada estudiante y le pide ideas a ValerIA.'), h('span', { class: 'sello sello--ok' }, 'Funciona hoy en Kinesis')),
          h('li', null, h('h3', null, 'Valida'), h('p', null, 'Orientación revisa el ajuste y lo aprueba o lo devuelve. Nada llega a nadie sin esa decisión.'), h('span', { class: 'sello sello--aviso' }, 'Simulado en la demostración')),
          h('li', null, h('h3', null, 'Aprende'), h('p', null, 'El estudiante recibe la actividad a su medida en Wisfox, y la familia ve el proceso mientras ocurre.'), h('span', { class: 'sello sello--ok' }, 'Funciona hoy en Wisfox'))),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/demo/docente' }, 'Recorrerlo de punta a punta'), h('a', { class: 'btn btn--suave', href: '#/mapa/conexiones' }, 'Ver todo en el mapa'))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-dif' },
        h('h2', { id: 'h-dif' }, 'Qué nos hace distintos'),
        h('div', { class: 'rejilla rejilla--3 diferencial' },
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Un flujo, no un documento'), h('p', null, 'No generamos un PIAR y ahí termina: el ajuste viaja entre cuatro roles y cada paso se ve.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Para todos, no solo con diagnóstico'), h('p', null, 'El DUA es la base: la clase se piensa para todos y el ajuste cubre lo que el diseño no alcanza.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Protegido por diseño'), h('p', null, 'La información clínica queda aislada y la IA nunca la recibe.'))),
        h('p', { style: 'margin-top:1rem' }, h('a', { href: '#/mapa/comparar' }, 'Ver la comparación con PIARPLUS, incluido dónde vamos atrás'))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-proy' },
        h('h2', { id: 'h-proy' }, 'Los tres proyectos, tal como los construyeron'),
        h('p', { class: 'bajada' }, 'Cada proyecto es de su equipo y se muestra con su propia cara, sus animaciones y sus recursos. La plataforma no los reemplaza: los une.'),
        h('div', { class: 'rejilla rejilla--3' },
          proyecto('kinesis', 'Kinesis', 'Hilo del aula', 'Planeación inclusiva con PIAR y DUA para docentes, orientación y familias. La información clínica queda aislada.', 'assets/capturas/kinesis-familia.jpg', 'Pantalla real de Kinesis: la vista de la familia, con lo que aprende el estudiante y su plan de apoyos', '#/kinesis/docente', 'https://github.com/profenapaipa/Kinesis', '#/demo/docente'),
          proyecto('wisfox', 'Wisfox', 'Hilo del estudiante', 'Lecciones, quizes, minijuegos, logros y un zorro que acompaña, para aprender a su ritmo.', 'assets/capturas/wisfox-lecciones.jpg', 'Pantalla real de Wisfox: las rutas de aprendizaje por materia', '#/wisfox', 'https://github.com/profenapaipa/wisfox', '#/demo/estudiante'),
          proyecto('valeria', 'IA ValerIA', 'Hilo de la guía', 'Una asistente que propone y no decide. Hoy responde con textos de ejemplo; su lugar y su contrato ya existen.', null, '', '#/valeria/chat', null, null))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-problema' },
        h('h2', { id: 'h-problema' }, 'El plan existe en el papel. Falta que llegue al aula.'),
        h('p', { class: 'bajada' }, 'Todo colegio debe elaborar un plan de ajustes razonables (PIAR) para cada estudiante con discapacidad. En la práctica, queda en una carpeta y el docente adapta la clase después de darla.'),
        h('div', { class: 'rejilla rejilla--3' },
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, '22.803'), h('p', null, 'estudiantes con discapacidad en colegios oficiales de Bogotá, marzo de 2026 (3,38 % de la matrícula).'), h('a', { href: OAPE, rel: 'noopener' }, 'Boletín de la OAPE')),
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, 'Decreto 1421'), h('p', null, 'de 2017 obliga a diseñar el PIAR y a hacerle seguimiento. Un fallo reciente de la Corte Constitucional amparó a un estudiante cuyo colegio no lo hizo a tiempo.'), h('a', { href: CORTE, rel: 'noopener' }, 'Diario Constitucional')),
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, 'Todos'), h('p', null, 'Esas cifras miden discapacidad. Nuestra propuesta es más amplia: todos aprendemos distinto, y por eso todos somos parte del mosaico.')))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-datos' },
        h('div', { class: 'garantias' },
          h('h2', { id: 'h-datos' }, 'Los datos de los estudiantes van primero'),
          h('p', null, 'Trabajamos con información de menores de edad. Por eso la regla es clara: hoy todo lo que ves es ficticio.'),
          h('div', { class: 'rejilla rejilla--2' },
            [['Un dato real no entra hasta cumplir los requisitos', 'Política de tratamiento de datos, autorización de las familias, contrato con el colegio, cifrado y una revisión de seguridad independiente.'],
             ['La información clínica queda aislada', 'Solo la ve quien tiene permiso explícito. Ni coordinación, ni la IA, la reciben.'],
             ['La IA solo propone', 'Trabaja con perfiles ficticios y sin acceso a bases de datos. Sus respuestas son propuestas, nunca decisiones.'],
             ['Nadie revisa su propio código', 'Cada cambio lo lee otra persona antes de publicarse, y cada proyecto tiene quien responda por los datos y las claves.']]
              .map(([t, p]) => h('div', { class: 'item' }, h('h3', null, t), h('p', null, p)))),
          h('p', { style: 'margin-top:1rem' }, h('a', { href: '#/recorrido/datos' }, 'Ver cómo viaja la información')))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-participa' },
        h('h2', { id: 'h-participa' }, '¿Quieres tejer con nosotros?'),
        h('p', { class: 'bajada' }, 'Buscamos colegios que quieran probar esto en su aula y personas que quieran sumarse al equipo: desarrollo de actividades, diseño, contenido pedagógico, datos y seguridad.'),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: 'https://github.com/profenapaipa/mosaicotelar/issues/new', rel: 'noopener' }, 'Escríbenos en GitHub')),
        h('p', { class: 'suave' }, 'Esa conversación es pública: no escribas allí datos personales ni información de estudiantes.')));

      main.append(c);
    },
  });
})(window.MT = window.MT || {});
