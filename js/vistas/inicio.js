/* inicio.js: la puerta de entrada. Presenta al colectivo, lleva a cada espacio y dice, sin
   adornos, qué funciona hoy y qué viene. Toda cifra tiene su fuente. */
(function (MT) {
  'use strict';
  const { h, marca, telar } = MT.ui;

  const KINESIS_DEMO = 'https://profenapaipa.github.io/Kinesis/';
  const OAPE = 'https://oape.educacionbogota.edu.co/sites/default/files/2026-05/3.Marzo_2026_Boletin_Mensual_1.pdf';
  const CORTE = 'https://www.diarioconstitucional.cl/2025/08/21/corte-constitucional-de-colombia-ampara-derecho-a-una-educacion-inclusiva-de-estudiante-neurodivergente/';

  function hilo(nombre, etiqueta, texto, ruta, externos, espacio) {
    return h('article', { class: 'tarjeta tarjeta--borde hilo-tarjeta', 'data-espacio': espacio },
      marca(nombre, 'marca-hilo'), h('p', { class: 'etiqueta' }, etiqueta),
      h('h3', null, nombre === 'valeria' ? 'IA ValerIA' : nombre === 'kinesis' ? 'Kinesis' : 'Wisfox'),
      h('p', null, texto),
      h('div', { class: 'acciones' }, h('a', { class: 'btn btn--chico', href: ruta }, 'Entrar al espacio'),
        externos.map(([t, u]) => h('a', { class: 'btn btn--chico btn--suave', href: u, rel: 'noopener' }, t))));
  }

  MT.router.registrar({
    id: 'inicio', titulo: 'Inicio', espacio: '',
    render(main) {
      const c = h('div', { class: 'contenedor' });

      c.append(h('section', { class: 'portada' },
        h('div', null,
          h('p', { class: 'descriptor' }, 'Colectivo de educación inclusiva con tecnología'),
          h('h1', null, 'Mosaico Telar'),
          h('p', { class: 'eslogan' }, 'Tejemos caminos para aprender.'),
          h('p', { class: 'intro' }, 'En cada salón hay un mosaico de formas de aprender, pero las clases suelen planearse para un solo camino. Tres proyectos de estudiantes se tejen aquí para que el docente planee una clase inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.'),
          h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/recorrido' }, 'Recorrer el ajuste de punta a punta'),
            h('a', { class: 'btn btn--suave', href: '#/kinesis' }, 'Entrar a Kinesis'))),
        telar(9, 9, 30, 8, 8, 'telar')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-problema' },
        h('h2', { id: 'h-problema' }, 'El plan existe en el papel. Falta que llegue al aula.'),
        h('p', { class: 'bajada' }, 'En Colombia, todo colegio debe elaborar un plan individual de ajustes razonables (PIAR) para cada estudiante con discapacidad. En la práctica, ese plan queda en una carpeta y el docente adapta la clase después de darla.'),
        h('div', { class: 'rejilla rejilla--3' },
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, '22.803'), h('p', null, 'estudiantes con discapacidad en colegios oficiales de Bogotá, marzo de 2026.'), h('a', { href: OAPE, rel: 'noopener' }, 'Boletín de la OAPE')),
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, '3,38 %'), h('p', null, 'de la matrícula oficial de la ciudad, 675.324 estudiantes en total.'), h('a', { href: OAPE, rel: 'noopener' }, 'Boletín de la OAPE')),
          h('div', { class: 'tarjeta' }, h('span', { class: 'cifra' }, 'Decreto 1421'), h('p', null, 'de 2017 obliga a diseñar el PIAR y a hacerle seguimiento. Un fallo reciente de la Corte Constitucional amparó a un estudiante cuyo colegio no lo hizo a tiempo.'), h('a', { href: CORTE, rel: 'noopener' }, 'Diario Constitucional'))),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Estas cifras miden discapacidad. Nuestra propuesta es más amplia: todos aprendemos distinto, y por eso todos somos parte del mosaico.')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-hilos' },
        h('h2', { id: 'h-hilos' }, 'Tres proyectos, un mismo problema'),
        h('p', { class: 'bajada' }, 'Cada proyecto nació de una necesidad distinta, conserva su nombre, su código y su autonomía. Mosaico Telar los une en un solo espacio con una sola forma de moverse.'),
        h('div', { class: 'rejilla rejilla--3' },
          hilo('kinesis', 'Hilo del aula', 'Para docentes, orientación y familias. El docente planea con Diseño Universal para el Aprendizaje y ve los apoyos de cada estudiante. La información clínica queda aislada.', '#/kinesis', [['Proyecto completo', KINESIS_DEMO]], 'kinesis'),
          hilo('wisfox', 'Hilo del estudiante', 'Para estudiantes. Lecciones, quiz, retos y un zorro que acompaña, para aprender a su ritmo.', '#/wisfox', [['Proyecto completo', 'https://github.com/profenapaipa/wisfox']], 'wisfox'),
          hilo('valeria', 'Hilo de la guía', 'Una asistente de IA, en español e inglés, que atraviesa los otros dos hilos. Propone; el docente decide.', '#/valeria', [], 'valeria')),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, '¿Por qué telar? Porque tejer es un proceso artesanal donde varios hilos hacen una sola tela. La urdimbre es la malla curricular; la trama, los ajustes de cada estudiante.')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-datos' },
        h('div', { class: 'garantias' },
          h('h2', { id: 'h-datos' }, 'Los datos de los estudiantes van primero'),
          h('p', null, 'Trabajamos con información de menores de edad. Por eso la regla es clara: hoy todo lo que ves es ficticio.'),
          h('div', { class: 'rejilla rejilla--2' },
            [['Un dato real no entra hasta cumplir los requisitos', 'Política de tratamiento de datos, autorización de las familias, contrato con el colegio, cifrado y una revisión de seguridad independiente.'],
             ['La información clínica queda aislada', 'En Kinesis el diagnóstico vive aparte y solo lo ve quien tiene permiso explícito.'],
             ['La IA no recibe datos de estudiantes', 'Solo trabaja con perfiles ficticios y sin acceso a bases de datos. Sus respuestas son propuestas.'],
             ['Nadie revisa su propio código', 'Cada cambio lo lee otra persona antes de publicarse, y cada proyecto tiene quien responda por los datos y las claves.']]
              .map(([t, p]) => h('div', { class: 'item' }, h('h3', null, t), h('p', null, p)))))));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-participa' },
        h('h2', { id: 'h-participa' }, '¿Quieres tejer con nosotros?'),
        h('p', { class: 'bajada' }, 'Buscamos colegios que quieran probar esto en su aula y personas que quieran sumarse al equipo: desarrollo de actividades, diseño, contenido pedagógico, datos y seguridad.'),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: 'https://github.com/profenapaipa/mosaicotelar/issues/new', rel: 'noopener' }, 'Escríbenos en GitHub')),
        h('p', { class: 'suave' }, 'Esa conversación es pública: no escribas allí datos personales ni información de estudiantes.')));

      main.append(c);
    },
  });
})(window.MT = window.MT || {});
