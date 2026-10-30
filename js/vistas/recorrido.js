/* recorrido.js: "cómo funciona", en tres lecturas que responden tres preguntas distintas.

   - Mi camino:   ¿qué hago yo ahora?            (el ajuste de punta a punta, marcado según lo que hiciste)
   - Quién ve qué: ¿qué puede ver y hacer cada rol? (la matriz de roles)
   - Cómo viaja:  ¿por dónde va la información?  (el flujo de datos y lo que nunca sale de su lugar)

   Están separadas a propósito: una sola página con todo abrumaría. Cada persona lee la que necesita. */
(function (MT) {
  'use strict';
  const { h, marca, icono } = MT.ui;
  const { pagina } = MT.comun;
  const st = MT.store;

  const TABS = [{ id: 'camino', etiqueta: 'Mi camino' }, { id: 'roles', etiqueta: 'Quién ve qué' }, { id: 'datos', etiqueta: 'Cómo viaja la información' }];

  const PASOS = [
    { clave: 'apoyos', rol: 'Docente', espacio: 'kinesis', titulo: 'El docente ve los apoyos', texto: 'En Kinesis, elige a un estudiante con PIAR y mira sus apoyos, sin diagnóstico.', ir: ['#/demo/docente', 'Ir a Kinesis'], sello: 'Funciona hoy' },
    { clave: 'ia', rol: 'Docente', espacio: 'valeria', titulo: 'Pide ayuda a ValerIA', texto: 'La asistente propone una actividad con DUA.', ir: ['ia', 'Abrir ValerIA'], sello: 'Respuesta de ejemplo' },
    { clave: 'ajuste', rol: 'Docente', espacio: 'kinesis', titulo: 'Se ajusta al perfil', texto: 'Cada apoyo se vuelve un cambio concreto, con su razón.', ir: ['#/demo/docente', 'Ajustar'], sello: 'Simulado: fase 5 de Kinesis' },
    { clave: 'aprobado', rol: 'Orientación', espacio: 'kinesis', titulo: 'Orientación aprueba', texto: 'Nada llega al estudiante sin la validación del equipo de orientación.', ir: ['#/demo/orientacion', 'Revisar'], sello: 'Simulado: fase 5 de Kinesis' },
    { clave: 'familia', rol: 'Familia', espacio: 'kinesis', titulo: 'La familia ve el proceso', texto: 'Se entera mientras ocurre, no en la entrega de notas.', ir: ['#/demo/familia', 'Ver'], sello: 'Simulado: fase 6 de Kinesis' },
    { clave: 'estudiante', rol: 'Estudiante', espacio: 'wisfox', titulo: 'El estudiante la resuelve', texto: 'En Wisfox recibe la actividad ajustada y completa el quiz.', ir: ['#/demo/estudiante', 'Ir a Wisfox'], sello: 'Wisfox funciona; el ajuste llega simulado' },
  ];

  function camino(c) {
    const s = st.obtener();
    const p = s.pasos;
    const hechos = PASOS.filter((x) => p[x.clave]).length;
    if (s.rol) {
      const sig = MT.roles.siguiente(s.rol, s);
      c.append(h('section', { class: 'siguiente-banner' }, h('div', null, h('p', { class: 'etiqueta' }, 'Tu siguiente paso, como ' + MT.roles.por(s.rol).nombre.toLowerCase()), h('h2', null, sig.titulo), h('p', null, sig.texto)),
        h('a', { class: 'btn', href: sig.hash }, sig.boton)));
    } else {
      c.append(h('p', { class: 'aviso' }, 'Aún no elegiste un rol. ', h('a', { href: '#/' }, 'Elígelo en el inicio'), ' y aquí verás tu siguiente paso.'));
    }
    c.append(h('div', { class: 'tarjeta tarjeta--borde', style: 'margin-top:1rem' },
      h('p', { class: 'etiqueta' }, 'El camino de un ajuste'), h('h2', null, `${hechos} de ${PASOS.length} pasos`),
      h('div', { class: 'medidor medidor--hilo', role: 'img', 'aria-label': `${hechos} de ${PASOS.length} pasos hechos` }, h('span', { style: `width:${(hechos / PASOS.length) * 100}%` })),
      h('p', { class: 'suave', style: 'margin-top:.6rem' }, 'Todo es con una estudiante ficticia. Cada paso se marca cuando lo haces; lo simulado se dice como simulado.'),
      h('ol', { class: 'recorrido' }, PASOS.map((x, i) => h('li', { class: p[x.clave] ? 'hecho' : '', 'data-espacio': x.espacio },
        h('span', { class: 'n', 'aria-hidden': 'true' }, p[x.clave] ? '✓' : String(i + 1)),
        h('div', { class: 'cuerpo' }, h('p', { class: 'etiqueta' }, x.rol), h('h3', null, x.titulo, p[x.clave] ? h('span', { class: 'solo-lectores' }, ' (hecho)') : null), h('p', null, x.texto),
          h('span', { class: 'sello sello--e' }, x.sello)),
        x.ir[0] === 'ia' ? h('button', { class: 'btn btn--chico', type: 'button', onclick: () => MT.ia.panel.abrir() }, x.ir[1]) : h('a', { class: 'btn btn--chico', href: x.ir[0] }, x.ir[1])))),
      h('div', { class: 'acciones' }, h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { st.reiniciar(); MT.router.recargar(); } }, 'Empezar de nuevo'))));
  }

  function roles(c) {
    const col = MT.roles.COLUMNAS;
    c.append(h('div', { class: 'tarjeta' },
      h('h2', null, 'Qué puede ver y hacer cada rol'),
      h('p', { class: 'suave' }, 'Es la regla de la plataforma. La demostración usa solo datos ficticios y no incluye información clínica en ningún rol.'),
      h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla tabla--matriz' },
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Dato'), col.map((n) => h('th', { scope: 'col' }, n)))),
        h('tbody', null, MT.roles.MATRIZ.map((f) => h('tr', null, h('th', { scope: 'row' }, f.dato, h('small', null, f.nota)),
          f.celdas.map((t) => h('td', null, h('span', { class: 'sello ' + (/^No|Nunca/.test(t) ? 'sello--aviso' : 'sello--ok') }, t))))))))));
    c.append(h('h2', { style: 'margin-top:1.6rem' }, 'Y en concreto, para cada rol'),
      h('div', { class: 'acordeon' }, MT.roles.lista.map((r) => h('details', { class: 'tarjeta', 'data-espacio': r.marca },
        h('summary', null, marca(r.marca, 'resumen-marca'), h('strong', null, r.nombre), h('span', { class: 'suave' }, ' · ' + r.espacio)),
        h('div', { class: 'rejilla rejilla--2' },
          h('div', null, h('h3', null, 'Puedes'), h('ul', null, r.haces.map((x) => h('li', null, x)))),
          h('div', null, h('h3', null, 'No puedes'), h('ul', null, r.noHaces.map((x) => h('li', null, x))))),
        h('p', null, h('strong', null, 'Recibes: '), r.recibes), h('p', null, h('strong', null, 'Entregas: '), r.entregas),
        h('a', { class: 'btn btn--chico', href: r.hash, onclick: () => st.cambiar((s) => { s.rol = r.id; }) }, r.boton)))));
  }

  function datos(c) {
    const NODOS = [
      { quien: 'Docente', marca: 'kinesis', accion: 'Planea la clase con DUA y elige a un estudiante', entrega: 'Actividad + tema' },
      { quien: 'ValerIA', marca: 'valeria', accion: 'Propone una actividad y ideas de ajuste', entrega: 'Propuesta (texto)' },
      { quien: 'Docente', marca: 'kinesis', accion: 'Ajusta la actividad a los apoyos del perfil', entrega: 'Ajuste con su razón' },
      { quien: 'Orientación', marca: 'kinesis', accion: 'Revisa y aprueba, o devuelve con una nota', entrega: 'Aprobación' },
      { quien: 'Familia', marca: 'kinesis', accion: 'Ve lo que se hace, ya aprobado', entrega: 'Novedad en lenguaje sencillo' },
      { quien: 'Estudiante', marca: 'wisfox', accion: 'Recibe la actividad a su medida y la resuelve', entrega: 'Progreso: XP, quiz, logros' },
    ];
    c.append(h('div', { class: 'tarjeta' },
      h('h2', null, 'Por dónde va la información'),
      h('p', { class: 'suave' }, 'Un ajuste nace en el aula, pasa por orientación y solo entonces llega a la familia y al estudiante. Cada flecha dice qué viaja.'),
      h('ol', { class: 'flujo' }, NODOS.map((n, i) => h('li', { 'data-espacio': n.marca },
        h('div', { class: 'flujo-nodo' }, marca(n.marca, 'flujo-marca'), h('div', null, h('strong', null, n.quien), h('p', null, n.accion))),
        h('div', { class: 'flujo-flecha' }, icono('flecha'), h('span', { class: 'sello sello--e' }, n.entrega)))))));
    c.append(h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' },
      [['Nunca sale de su lugar', 'La información clínica vive aislada en Kinesis. Solo orientación, con permiso, la ve. La IA no la recibe jamás.'],
       ['A la IA solo llega un perfil anónimo', 'Se arma en el servidor con datos ficticios. Lo que escribe una persona tiene tope de longitud y no se guarda.'],
       ['Las claves no viajan', 'Viven como variable de entorno en el servidor. Esta página es pública y no tiene ninguna.']]
        .map(([t, p]) => h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, t), h('p', null, p)))));
  }

  MT.router.registrar({
    id: 'recorrido', titulo: 'Cómo funciona', espacio: '', subs: TABS,
    render(main, { sub }) {
      const c = pagina(main, { etiqueta: 'Cómo funciona', titulo: 'Qué hacer, quién ve qué y por dónde viaja la información',
        descripcion: 'Tres lecturas cortas. Elige la que necesitas: no hace falta leerlas todas.' });
      c.append(h('nav', { class: 'pestanas-pagina', 'aria-label': 'Secciones de Cómo funciona' },
        TABS.map((t) => h('a', { href: '#/recorrido/' + t.id, 'aria-current': t.id === sub ? 'page' : null }, t.etiqueta))));
      ({ camino, roles, datos })[sub](c);
    },
  });
})(window.MT = window.MT || {});
