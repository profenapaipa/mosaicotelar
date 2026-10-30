/* inicio.js: la puerta de entrada, pensada como la de una plataforma que se presenta a colegios y
   a un jurado. Muestra la plataforma misma (capturas de sus espacios), hace una sola pregunta
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
      h('button', { class: 'btn', type: 'button', onclick: () => { st.cambiar((s) => { s.rol = r.id; }); location.hash = '#/guia/' + r.id; } }, r.boton));
  }

  function componente(id, nombre, rotulo, texto) {
    return h('article', { class: 'tarjeta proyecto-tarjeta portal', 'data-espacio': id }, h('div', { class: 'cuerpo' },
      h('div', { class: 'proyecto-cab' }, marca(id), h('div', null, h('h3', null, nombre), h('small', null, rotulo))), h('p', null, texto),
      h('div', { class: 'acciones' }, h('a', { class: 'btn btn--chico btn--suave', href: '#/portales/' + id, 'aria-label': 'Ir a ' + nombre }, 'Ir a ' + nombre))));
  }

  MT.router.registrar({
    id: 'inicio', titulo: 'Inicio', espacio: '',
    render(main) {
      const s = st.obtener();
      const c = h('div', { class: 'contenedor' });
      const tejido = MT.tejido.logoTejido();

      c.append(h('section', { class: 'lienzo' },
        h('div', null,
          h('p', { class: 'descriptor' }, 'Colectivo de educación inclusiva con tecnología'),
          h('div', { class: 'marca-hero' },
            h('div', { class: 'marca-hero__logo' }, tejido.el, h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: tejido.repetir }, 'Ver otra vez')),
            h('div', null, h('h1', null, 'Mosaico Telar'), h('p', { class: 'marca-hero__lema' }, 'Tejemos caminos para aprender.'))),
          h('p', { class: 'intro' }, 'La plataforma donde el docente planea una clase inclusiva, orientación la valida, la familia la ve y cada estudiante la recibe a su medida.'),
          h('ul', { class: 'hilos-leyenda', 'aria-label': 'Sus tres portales' }, [['kinesis', 'Kinesis', 'el aula'], ['wisfox', 'Wisfox', 'el estudiante'], ['valeria', 'ValerIA', 'la guía']].map(([id, n, r]) => h('li', { 'data-espacio': id }, h('i', { 'aria-hidden': 'true' }), h('strong', null, n), ' ' + r))),
          h('div', { class: 'acciones' },
            h('a', { class: 'btn', href: '#roles', onclick: (e) => { e.preventDefault(); const el = document.getElementById('roles'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, 'Entrar con mi rol'),
            h('a', { class: 'btn btn--suave', href: '#/piloto' }, 'Solicitar un piloto')),
          h('ul', { class: 'confianza' }, ['Pensado desde el Decreto 1421 y el DUA', 'Información clínica aislada', 'Funciona sin instalar nada'].map((t) => h('li', null, t)))),
        h('div', { class: 'vitrina' },
          h('div', { class: 'dispositivo dispositivo--a' }, h('img', { src: 'assets/capturas/docente.jpg', alt: 'El espacio del docente: sus estudiantes, el siguiente paso y las actividades planeadas con DUA', width: '1280', height: '800' }), h('span', { class: 'dispositivo-rotulo' }, 'Espacio del docente')),
          h('div', { class: 'dispositivo dispositivo--b' }, h('img', { src: 'assets/capturas/estudiante.jpg', alt: 'El espacio del estudiante: su actividad del día con el quiz, sus puntos y sus logros', width: '1280', height: '800' }), h('span', { class: 'dispositivo-rotulo' }, 'Espacio del estudiante')))));

      if (s.rol) {
        const r = MT.roles.por(s.rol);
        c.append(h('section', { class: 'siguiente-banner', 'aria-label': 'Continuar' },
          h('div', null, h('p', { class: 'etiqueta' }, 'Estás como ' + r.nombre.toLowerCase()), h('h2', null, 'Continúa donde lo dejaste')),
          h('a', { class: 'btn', href: '#/guia' }, 'Ver mi guía de inicio')));
      }

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-que' },
        h('h2', { id: 'h-que' }, 'Qué es Mosaico Telar'),
        h('p', { class: 'bajada' }, 'Mosaico Telar es la plataforma que reúne tres portales para que una clase inclusiva llegue completa, del docente al estudiante. Cada portal nació como un proyecto de estudiantes; juntos comparten una identidad, un camino para cada rol y los mismos datos.'),
        h('div', { class: 'plataforma' },
          h('span', { class: 'plataforma__rotulo' }, marca('mosaico', 'plataforma__marca'), 'Mosaico Telar · la plataforma'),
          h('div', { class: 'rejilla rejilla--3' },
            componente('kinesis', 'Kinesis', 'El aula', 'Donde se planea la clase con DUA y se decide qué ajuste recibe cada estudiante. Lo usan docentes, orientación, familias y coordinación.'),
            componente('wisfox', 'Wisfox', 'El estudiante', 'Donde el estudiante aprende a su ritmo: rutas, lecciones, quizes con explicación, puntos y logros, con la actividad hecha a su medida.'),
            componente('valeria', 'ValerIA', 'La guía', 'Una asistente de IA que propone y no decide. Ayuda al docente a diseñar y al estudiante a resolver dudas. Hoy responde con ejemplos.')),
          h('p', { class: 'plataforma__une' }, h('strong', null, 'Cómo se conectan: '), 'Kinesis le pasa a Wisfox la actividad ya aprobada, Wisfox le devuelve a Kinesis el progreso, y ValerIA ayuda a los dos.')),
        h('div', { class: 'objetivo' }, h('p', { class: 'etiqueta' }, 'Para qué existe'),
          h('p', { class: 'objetivo__texto' }, 'Que cada estudiante que necesita ajustes los reciba en la clase de hoy, y no solo en un documento.')),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#roles', onclick: (e) => { e.preventDefault(); const el = document.getElementById('roles'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, 'Elegir mi rol'),
          h('a', { class: 'btn btn--suave', href: '#/portales' }, 'Ver los tres portales'))));

      c.append(h('section', { class: 'seccion', id: 'roles', 'aria-labelledby': 'h-roles' },
        h('h2', { id: 'h-roles' }, '¿Quién eres? Empieza por aquí'),
        h('p', { class: 'bajada' }, 'Elige tu rol y te mostramos por dónde empezar: qué portal te toca, en qué orden y qué hace cada uno. Puedes cambiar de rol cuando quieras.'),
        h('div', { class: 'rejilla rejilla--5' }, MT.roles.lista.map(tarjetaRol)),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Si solo quieres conocerla, ', h('a', { href: '#/portales' }, 'mira los tres portales'), ', ', h('a', { href: '#/mapa/conexiones' }, 'el mapa'), ' o ', h('a', { href: '#/recorrido/roles' }, 'qué ve cada rol'), '.')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-como' },
        h('h2', { id: 'h-como' }, 'Así viaja una clase inclusiva'),
        h('p', { class: 'bajada' }, 'Un ajuste nace en el aula, pasa por orientación y solo entonces llega a la familia y al estudiante. ValerIA acompaña a quien enseña y a quien aprende.'),
        h('ol', { class: 'pasos3' },
          h('li', null, h('h3', null, 'Planea'), h('p', null, 'El docente diseña la clase con DUA, ve los apoyos de cada estudiante y le pide ideas a ValerIA.'), h('span', { class: 'sello sello--ok' }, 'Disponible hoy')),
          h('li', null, h('h3', null, 'Valida'), h('p', null, 'Orientación revisa el ajuste y lo aprueba o lo devuelve. Nada llega a nadie sin esa decisión.'), h('span', { class: 'sello sello--ok' }, 'Disponible hoy')),
          h('li', null, h('h3', null, 'Aprende'), h('p', null, 'El estudiante recibe la actividad a su medida y la familia ve el proceso mientras ocurre.'), h('span', { class: 'sello sello--ok' }, 'Disponible hoy'))),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/recorrido/camino' }, 'Recorrerlo de punta a punta'), h('a', { class: 'btn btn--suave', href: '#/mapa/conexiones' }, 'Ver todo en el mapa'))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-dif' },
        h('h2', { id: 'h-dif' }, 'Qué nos hace distintos'),
        h('div', { class: 'rejilla rejilla--3 diferencial' },
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Un flujo, no un documento'), h('p', null, 'No generamos un PIAR y ahí termina: el ajuste viaja entre cuatro roles y cada paso se ve.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Para todos, no solo con diagnóstico'), h('p', null, 'El DUA es la base: la clase se piensa para todos y el ajuste cubre lo que el diseño no alcanza.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Protegido por diseño'), h('p', null, 'La información clínica queda aislada y la IA nunca la recibe.'))),
        h('p', { style: 'margin-top:1rem' }, h('a', { href: '#/mapa/comparar' }, 'Ver la comparación con PIARPLUS, incluido dónde vamos atrás'))));

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
          h('p', null, 'Trabajamos con información de menores de edad. Por eso la regla es clara: los datos de partida son de ejemplo y lo que tú escribes se queda en tu navegador.'),
          h('div', { class: 'rejilla rejilla--2' },
            [['Ningún dato real entra hasta cumplir los requisitos', 'Política de tratamiento de datos, autorización de las familias, contrato con el colegio, cifrado y una revisión de seguridad independiente.'],
             ['La información clínica queda aislada', 'Solo la ve orientación. Ni docentes, ni familias, ni coordinación, ni la IA la reciben.'],
             ['La IA solo propone', 'Trabaja con perfiles ficticios y sin acceso a bases de datos. Sus respuestas son propuestas, nunca decisiones.'],
             ['Lo que subes se queda contigo', 'Los archivos se guardan solo en este navegador y no se envían a ningún servidor. Cada archivo lo ve únicamente quien tú elijas.']]
              .map(([t, p]) => h('div', { class: 'item' }, h('h3', null, t), h('p', null, p)))),
          h('p', { style: 'margin-top:1rem' }, h('a', { href: '#/recorrido/datos' }, 'Ver cómo viaja la información')))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-participa' },
        h('h2', { id: 'h-participa' }, 'Llévala a tu colegio'),
        h('p', { class: 'bajada' }, 'Buscamos colegios que quieran un piloto acompañado y aliados que quieran sumarse: pedagogía, datos, seguridad y financiación.'),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/piloto' }, 'Solicitar un piloto'), h('a', { class: 'btn btn--suave', href: '#/hoja/propuesta' }, 'Ver la propuesta'))));

      main.append(c);
    },
  });
})(window.MT = window.MT || {});
