/* inicio.js: la puerta de entrada. Hace UNA pregunta ("¿quién eres?") y todo lo demás sale de ahí.
   Por debajo de esa decisión, lo que sigue es corto: qué es la plataforma, qué conserva cada
   proyecto, de dónde salen las cifras y qué se protege. Quien ya eligió rol ve primero su
   siguiente paso. */
(function (MT) {
  'use strict';
  const { h, marca, icono } = MT.ui;
  const st = MT.store;

  const KINESIS_COMPLETO = 'https://profenapaipa.github.io/Kinesis/';
  const OAPE = 'https://oape.educacionbogota.edu.co/sites/default/files/2026-05/3.Marzo_2026_Boletin_Mensual_1.pdf';
  const CORTE = 'https://www.diarioconstitucional.cl/2025/08/21/corte-constitucional-de-colombia-ampara-derecho-a-una-educacion-inclusiva-de-estudiante-neurodivergente/';

  function tarjetaRol(r) {
    return h('article', { class: 'tarjeta rol-tarjeta', 'data-espacio': r.marca },
      h('span', { class: 'rol-icono' }, icono(r.icono)),
      h('h3', null, r.nombre), h('p', { class: 'rol-lema' }, r.lema),
      h('p', { class: 'etiqueta' }, 'Entras a ' + r.espacio),
      h('a', { class: 'btn', href: r.hash, onclick: () => st.cambiar((s) => { s.rol = r.id; }) }, r.boton));
  }

  function hilo(nombre, etiqueta, texto, conserva, ruta, externo, espacio) {
    return h('article', { class: 'tarjeta tarjeta--borde hilo-tarjeta', 'data-espacio': espacio },
      marca(nombre, 'marca-hilo'), h('p', { class: 'etiqueta' }, etiqueta),
      h('h3', null, nombre === 'valeria' ? 'IA ValerIA' : nombre === 'kinesis' ? 'Kinesis' : 'Wisfox'),
      h('p', null, texto), h('p', { class: 'suave' }, h('strong', null, 'Conserva: '), conserva),
      h('div', { class: 'acciones' }, h('a', { class: 'btn btn--chico', href: ruta }, 'Entrar al espacio'),
        externo ? h('a', { class: 'btn btn--chico btn--suave', href: externo, rel: 'noopener' }, 'Proyecto completo') : null));
  }

  MT.router.registrar({
    id: 'inicio', titulo: 'Inicio', espacio: '',
    render(main) {
      const s = st.obtener();
      const c = h('div', { class: 'contenedor' });

      c.append(h('section', { class: 'portada' },
        h('div', null,
          h('p', { class: 'descriptor' }, 'Colectivo de educación inclusiva con tecnología'),
          h('h1', null, 'Mosaico Telar'),
          h('p', { class: 'eslogan' }, 'Tejemos caminos para aprender.'),
          h('p', { class: 'intro' }, 'Tres proyectos de estudiantes, en un solo lugar, para que el docente planee una clase inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.'),
          h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#roles' + '', onclick: (e) => { e.preventDefault(); const el = document.getElementById('roles'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, 'Elegir mi rol'),
            h('a', { class: 'btn btn--suave', href: '#/recorrido/camino' }, 'Ver cómo funciona'))),
        h('div', { class: 'portada-arte', 'aria-hidden': 'true' }, marca('mosaico', 'portada-logo'))));

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
        h('div', { class: 'rejilla rejilla--4' }, MT.roles.lista.map(tarjetaRol)),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Si solo quieres conocer la plataforma, ',
          h('a', { href: '#/recorrido/camino' }, 'sigue el recorrido de un ajuste de punta a punta'), '.')));

      c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-hilos' },
        h('h2', { id: 'h-hilos' }, 'Tres proyectos, una sola plataforma'),
        h('p', { class: 'bajada' }, 'Cada proyecto nació de una necesidad distinta y sigue siendo de su equipo. Aquí comparten una identidad, una navegación y un hilo de datos; no pierden lo suyo.'),
        h('div', { class: 'rejilla rejilla--3' },
          hilo('kinesis', 'Hilo del aula', 'Para docentes, orientación y familias: planeación con DUA y seguimiento de ajustes razonables.', 'su cara, sus roles, su manejo de la información clínica y su proyecto completo.', '#/kinesis/docente', KINESIS_COMPLETO, 'kinesis'),
          hilo('wisfox', 'Hilo del estudiante', 'Para estudiantes: lecciones, quiz, retos y un zorro que acompaña.', 'su cara, su zorro, sus puntos y misiones, y su proyecto completo.', '#/wisfox/inicio', 'https://github.com/profenapaipa/wisfox', 'wisfox'),
          hilo('valeria', 'Hilo de la guía', 'Una asistente de IA que atraviesa los otros dos: propone, y decide quien enseña.', 'su propio espacio y su lugar fijo en todas las pantallas.', '#/valeria/chat', null, 'valeria'))));

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
             ['La información clínica queda aislada', 'Solo la ve quien tiene permiso explícito. Ningún otro rol, ni la IA, la recibe.'],
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
