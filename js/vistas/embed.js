/* embed.js: los proyectos REALES, intactos.

   Kinesis y Wisfox ya tenían identidad, animaciones, recursos, gráficos y una organización propios:
   el trabajo de sus equipos. Reescribirlos aquí habría perdido gran parte de eso, así que se muestran
   tal cual, dentro de un marco, y la plataforma los rodea con lo que los une (el riel, el mapa, los
   roles y el flujo del ajuste), sin tocarles su cara.

   Los dos se cargan desde su propia dirección publicada (Kinesis y Wisfox, en GitHub Pages). Si su equipo
   los actualiza, aquí se ve la actualización sin hacer nada, y esta plataforma no guarda ninguna copia de
   su código. */
(function (MT) {
  'use strict';
  const { h, marca } = MT.ui;
  const st = MT.store;
  const KINESIS = 'https://profenapaipa.github.io/Kinesis/';
  const WISFOX = 'https://profenapaipa.github.io/wisfox/';

  const PROYECTOS = {
    kinesis: {
      nombre: 'Kinesis', marca: 'kinesis', repo: 'https://github.com/profenapaipa/Kinesis',
      desc: 'Planeación inclusiva con PIAR y DUA. El proyecto completo, tal como lo construyó su equipo.',
      subs: [
        { id: 'docente', etiqueta: 'Docente', url: KINESIS + 'docente/' },
        { id: 'orientacion', etiqueta: 'Orientación', url: KINESIS + 'orientador/' },
        { id: 'familia', etiqueta: 'Familia', url: KINESIS + 'padre/' },
        { id: 'coordinacion', etiqueta: 'Administración', url: KINESIS + 'administrador/' },
        { id: 'estudiante', etiqueta: 'Estudiante', url: KINESIS + 'estudiante/' },
      ],
    },
    wisfox: {
      nombre: 'Wisfox', marca: 'wisfox', repo: 'https://github.com/profenapaipa/wisfox',
      desc: 'Tu plataforma de aprendizaje. El proyecto completo, tal como lo publicó su equipo.',
      subs: [{ id: 'app', etiqueta: 'Plataforma completa', url: WISFOX }],
    },
  };

  Object.entries(PROYECTOS).forEach(([id, p]) => {
    MT.router.registrar({
      id, titulo: p.nombre, espacio: id, subs: p.subs,
      render(main, { sub }) {
        const actual = p.subs.find((x) => x.id === sub) || p.subs[0];
        // Entrar a un rol de Kinesis también fija el rol de la persona en la plataforma.
        const rol = id === 'wisfox' ? 'estudiante' : actual.id;
        if (st.obtener().rol !== rol) st.cambiar((x) => { x.rol = rol; });
        const barra = h('div', { class: 'embed-barra' },
          marca(p.marca, 'marca'),
          h('div', null, h('h1', null, p.nombre), h('p', null, p.desc)),
          p.subs.length > 1 ? h('nav', { class: 'embed-roles', 'aria-label': 'Ver ' + p.nombre + ' como' },
            p.subs.map((x) => h('a', { href: `#/${id}/${x.id}`, 'aria-current': x.id === actual.id ? 'page' : null }, x.etiqueta))) : null,
          h('div', { class: 'acciones' },
            h('a', { class: 'btn btn--chico btn--suave', href: actual.url, target: '_blank', rel: 'noopener' }, 'Abrir en una pestaña'),
            h('a', { class: 'btn btn--chico btn--suave', href: p.repo, target: '_blank', rel: 'noopener' }, 'Código'),
            h('a', { class: 'btn btn--chico', href: '#/demo/' + (rol === 'estudiante' ? 'estudiante' : rol) }, 'Ver el ajuste de punta a punta')));
        const marco = h('iframe', { class: 'embed-marco', src: actual.url, title: p.nombre + ', proyecto completo (demostración con datos ficticios)', referrerpolicy: 'no-referrer' });
        main.append(barra, marco);
      },
    });
  });
})(window.MT = window.MT || {});
