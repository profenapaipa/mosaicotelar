/* wisfox.js: el hilo del estudiante, con la cara que ya tenía Wisfox: barra lateral plana con el
   hexágono, saludo con puntos, árbol de materias en órbita, misiones diarias y el zorro.

   Conserva lo esencial: lección, quiz de opción múltiple, minijuego de ordenar frases, logros y
   un tutor de IA. Lo que NO trae esta versión: el catálogo completo de materias, el cambio de idioma
   y los planes; eso sigue en el proyecto completo (github.com/profenapaipa/wisfox).

   La diferencia con Wisfox solo es una: la actividad cambia según lo que Orientación aprobó en
   Kinesis. Ese es el hilo que une los dos espacios. Y el tutor de IA de Wisfox es aquí ValerIA. */
(function (MT) {
  'use strict';
  const { h, marca, icono, svg } = MT.ui;
  const { espacio } = MT.comun;
  const st = MT.store;
  const D = MT.datos;
  const L = D.leccion;

  const TABS = [
    { id: 'inicio', etiqueta: 'Inicio', icono: 'inicio' },
    { id: 'leccion', etiqueta: 'Lección y quiz', icono: 'libro' },
    { id: 'juego', etiqueta: 'Juego', icono: 'juego' },
    { id: 'logros', etiqueta: 'Logros', icono: 'logros' },
    { id: 'tutora', etiqueta: 'Tutora IA', icono: 'chispa', nuevo: 'ValerIA', href: '#/valeria/chat' },
  ];
  const XP_META = 100;

  const sumarXP = (n, logro) => st.cambiar((s) => { s.wisfox.xp = Math.min(XP_META, s.wisfox.xp + n); if (logro) st.logro(logro); });
  const progresoIngles = (w) => Math.round(([w.leccion, !!w.quiz, w.ordena].filter(Boolean).length / 3) * 100);

  function saludo(titulo, texto) {
    const xp = st.obtener().wisfox.xp;
    return h('header', { class: 'saludo' },
      h('div', null, h('h1', null, titulo), h('p', null, texto)),
      h('div', { class: 'saludo-chips' },
        h('a', { class: 'chip-xp', href: '#/wisfox/logros', 'aria-label': 'Mis logros' }, icono('logros'), 'Logros'),
        h('span', { class: 'chip-xp' }, xp + ' XP')));
  }

  function barraXP() {
    const xp = st.obtener().wisfox.xp;
    return h('div', { class: 'xp' }, h('strong', null, xp + ' XP'),
      h('div', { class: 'medidor', style: 'flex:1', role: 'img', 'aria-label': `${xp} de ${XP_META} puntos de experiencia` }, h('span', { style: `width:${(xp / XP_META) * 100}%` })));
  }

  /* El árbol de aprendizaje: la materia al centro de la atención, las demás en órbita. Solo Inglés está
     activo aquí; las otras se ven pero dicen que viven en el proyecto completo (sin simular de más). */
  const MATERIAS = [
    { id: 'matematicas', nombre: 'Matemáticas', icono: '🧮', color: '#7DB04F', x: 50, y: 9 },
    { id: 'economia', nombre: 'Economía', icono: '📈', color: '#E8746A', x: 11, y: 36 },
    { id: 'ingles', nombre: 'Inglés', icono: '🌎', color: '#3AA8A0', x: 89, y: 36, activa: true },
    { id: 'historia', nombre: 'Historia', icono: '🏛️', color: '#E8A13C', x: 25, y: 83 },
    { id: 'biologia', nombre: 'Biología', icono: '🧬', color: '#3D9960', x: 75, y: 83 },
  ];

  function orbita(w) {
    // Las líneas son SVG de verdad (createElement('svg') no crea un elemento SVG): se parsean desde texto.
    const lineas = svg(`<svg class="orbita-lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${MATERIAS.map((m) => `<line x1="50" y1="50" x2="${m.x}" y2="${m.y}" stroke="${m.color}" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".6"/>`).join('')}</svg>`);
    const nodos = MATERIAS.map((m) => {
      const pct = m.activa ? progresoIngles(w) + ' %' : 'Próximamente';
      const cuerpo = [h('span', { class: 'nodo-aro', style: `--aro:${m.color}` }, h('span', { 'aria-hidden': 'true' }, m.icono)), h('span', { class: 'nodo-nombre' }, m.nombre), h('span', { class: 'nodo-pct' }, pct)];
      const estilo = `left:${m.x}%;top:${m.y}%`;
      return m.activa ? h('a', { class: 'nodo', style: estilo, href: '#/wisfox/leccion', 'aria-label': `${m.nombre}, ${pct} completado. Ir a la lección` }, cuerpo)
        : h('span', { class: 'nodo nodo--pendiente', style: estilo }, cuerpo);
    });
    return h('div', { class: 'orbita' }, lineas, h('div', { class: 'orbita-centro' }, marca('wisfox')), h('p', { class: 'orbita-pista' }, 'Tu árbol de aprendizaje. Toca una materia.'), nodos);
  }

  function inicio(c) {
    const s = st.obtener();
    const w = s.wisfox;
    const lista = s.ajuste.estado === 'aprobado';
    c.append(saludo('¡Hola, Demo! 👋', 'Continúa aprendiendo. Tú puedes lograrlo.'));

    const nivel = Math.min(5, 1 + Math.floor(w.xp / 25));
    const misiones = [
      { t: 'Completa la lección', xp: 10, ok: w.leccion }, { t: 'Responde el quiz', xp: 40, ok: !!w.quiz }, { t: 'Ordena la frase', xp: 15, ok: w.ordena },
    ];
    const principal = h('div', { class: 'rejilla' },
      h('div', { class: 'tarjeta' }, orbita(w),
        h('p', { class: 'suave', style: 'margin-top:.8rem' }, 'Aquí solo está Inglés. Las demás materias viven en el proyecto completo de Wisfox.')),
      h('div', { class: 'rejilla rejilla--4' },
        [[w.leccion ? '1' : '0', 'Lección completada'], [w.quiz ? `${w.quiz.aciertos}/${w.quiz.total}` : '—', 'Aciertos en el quiz'], [w.ordena ? '1' : '0', 'Juego superado'], [String(w.xp), 'XP ganados']]
          .map(([v, e]) => h('div', { class: 'tarjeta tarjeta--cifra' }, h('strong', null, v), h('span', null, e)))),
      h('div', { class: 'banner-zorro' }, marca('zorro'), h('p', null, 'La astucia no es trucar, es saber aprender, adaptarse y superar cualquier desafío.')));

    const lateral = h('div', { class: 'rejilla' },
      h('div', { class: 'tarjeta' }, h('div', { class: 'tarjeta-cab' }, h('h2', null, 'Tu progreso')),
        h('p', null, h('strong', null, 'Nivel ' + nivel), ' · Explorador'), barraXP()),
      h('div', { class: 'tarjeta' }, h('h2', null, 'Misiones diarias'),
        h('ul', { class: 'misiones' }, misiones.map((m) => h('li', { class: m.ok ? 'hecha' : '' },
          h('span', null, m.t, m.ok ? h('span', { class: 'solo-lectores' }, ' (hecha)') : null), h('span', { class: 'sello sello--aviso' }, '+' + m.xp + ' XP'))))),
      lista ? h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Para ti'), h('p', null, 'Tu actividad de hoy ya está lista y quedó a tu medida.'),
        h('a', { class: 'btn btn--chico', href: '#/wisfox/leccion' }, 'Empezar'))
        : h('div', { class: 'tarjeta' }, h('p', { class: 'etiqueta' }, 'Tu actividad'), h('p', { class: 'suave' }, 'Esta es la versión general. Cuando tu ajuste esté aprobado, aquí llegará la tuya.')),
      h('div', { class: 'tarjeta ayuda-zorro' }, h('p', { class: 'etiqueta' }, '¿Necesitas ayuda?'), h('p', null, 'Pregúntale a ValerIA, tu tutora.'),
        h('button', { class: 'btn', type: 'button', onclick: () => MT.ia.panel.abrir({ tarea: 'ayuda', texto: 'No entiendo cuándo se le pone la s al verbo.' }) }, 'Hablar con ValerIA')));

    c.append(h('div', { class: 'rejilla rejilla--wisfox' }, principal, lateral));
  }

  function quiz(contenedor) {
    const s0 = st.obtener().wisfox;
    let i = 0; let aciertos = 0;
    const fin = () => {
      const previo = st.obtener().wisfox.quiz;
      if (!previo) {
        sumarXP(aciertos * 10, 'quiz');
        st.cambiar((s) => { s.wisfox.quiz = { aciertos, total: L.quiz.length }; s.pasos.estudiante = true; st.evento('La estudiante completó el quiz de la actividad.', true); });
      }
      contenedor.replaceChildren(h('div', { class: 'tarjeta tarjeta--borde' },
        h('h3', null, 'Quiz terminado'),
        h('p', null, `Acertaste ${aciertos} de ${L.quiz.length}.` + (previo ? ' Tu primer resultado ya sumó XP; repetirlo no suma más.' : ' ¡Bien hecho!')),
        h('div', { class: 'acciones' }, h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { i = 0; aciertos = 0; pintar(); } }, 'Repetir el quiz'))));
    };
    function pintar() {
      const p = L.quiz[i];
      const msg = h('p', { 'aria-live': 'polite', class: 'suave' });
      const sig = h('button', { class: 'btn', type: 'button', hidden: true, onclick: () => { i += 1; i < L.quiz.length ? pintar() : fin(); } }, i + 1 < L.quiz.length ? 'Siguiente' : 'Ver resultado');
      const opciones = h('div', { class: 'opciones' }, p.o.map((texto, k) => h('button', { class: 'opcion', type: 'button',
        onclick: (e) => {
          const botones = opciones.querySelectorAll('button');
          botones.forEach((b) => { b.disabled = true; });
          const ok = k === p.a;
          if (ok) aciertos += 1;
          botones[p.a].classList.add('correcta');
          if (!ok) e.currentTarget.classList.add('incorrecta');
          msg.textContent = ok ? 'Correcto.' : 'Casi. La respuesta correcta es: ' + p.o[p.a];
          sig.hidden = false; sig.focus();
        } }, texto)));
      contenedor.replaceChildren(h('div', { class: 'tarjeta' },
        h('p', { class: 'etiqueta' }, `Pregunta ${i + 1} de ${L.quiz.length}`), h('h3', null, p.q), opciones, msg, sig));
    }
    contenedor.replaceChildren(h('div', { class: 'tarjeta' }, h('h3', null, 'Quiz'),
      h('p', { class: 'suave' }, `${L.quiz.length} preguntas de opción múltiple.`),
      h('button', { class: 'btn', type: 'button', onclick: pintar }, s0.quiz ? 'Repetir el quiz' : 'Empezar el quiz')));
  }

  function leccion(c) {
    const s = st.obtener();
    const adaptada = s.ajuste.estado === 'aprobado';
    const hecha = s.wisfox.leccion;
    const zonaQuiz = h('div');
    c.append(saludo('Lección y quiz', adaptada ? 'Tu actividad llegó a tu medida.' : 'Hoy repasamos el present simple.'));
    const marcar = h('button', { class: 'btn', type: 'button', disabled: hecha, onclick: (e) => {
      sumarXP(10, 'leccion');
      st.cambiar((x) => { x.wisfox.leccion = true; if (x.ajuste.estado === 'aprobado') st.logro('adaptada'); });
      e.currentTarget.disabled = true; e.currentTarget.textContent = 'Lección marcada';
    } }, hecha ? 'Lección marcada' : 'Marcar la lección como leída');

    c.append(h('div', { class: 'rejilla' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Ruta de Inglés'), h('h2', null, 'Mi rutina del día'),
        adaptada ? h('span', { class: 'sello sello--ok' }, 'Versión a tu medida') : h('span', { class: 'sello sello--aviso' }, 'Versión general'),
        h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' }, L.tarjetas.map((t) => h('div', { class: 'tarjeta tarjeta--plana' },
          h('span', { class: 'icono', 'aria-hidden': 'true' }, t.icono), h('h3', null, t.titulo), h('p', null, t.texto), h('p', null, h('strong', null, t.ejemplo))))),
        adaptada
          ? [h('h3', { style: 'margin-top:1.2rem' }, 'Tu actividad, en tres pasos'),
             h('ol', { class: 'pasos-visuales' }, L.pasosAjustados.map((p) => h('li', null, h('span', { class: 'icono', 'aria-hidden': 'true' }, p.icono), p.texto))),
             h('ul', { class: 'ajuste-lista' }, s.ajuste.items.map((i) => h('li', null, i.cambio)))]
          : h('p', { class: 'suave', style: 'margin-top:1rem' }, 'El ajuste individual toma el camino de Kinesis: docente, orientación y vuelta aquí.'),
        h('div', { class: 'acciones' }, marcar)),
      zonaQuiz));
    quiz(zonaQuiz);
  }

  function juego(c) {
    const o = L.ordena;
    const elegidas = [];
    const respuesta = h('div', { class: 'fichas fichas--respuesta', 'aria-label': 'Tu frase', 'aria-live': 'polite' });
    const banco = h('div', { class: 'fichas', 'aria-label': 'Palabras para ordenar' });
    const msg = h('p', { class: 'suave', 'aria-live': 'polite' });
    const pintar = () => {
      respuesta.replaceChildren(...elegidas.map((w, idx) => h('button', { class: 'ficha', type: 'button', onclick: () => { elegidas.splice(idx, 1); pintar(); } }, w)));
      banco.replaceChildren(...o.mezcla.filter((w) => elegidas.filter((e) => e === w).length < o.mezcla.filter((m) => m === w).length)
        .map((w) => h('button', { class: 'ficha', type: 'button', onclick: () => { elegidas.push(w); pintar(); } }, w)));
    };
    const comprobar = () => {
      if (elegidas.join(' ') === o.frase.join(' ')) {
        const ya = st.obtener().wisfox.ordena;
        msg.textContent = ya ? '¡Correcto! Esta vez no suma XP porque ya lo lograste.' : '¡Correcto! Ganaste 15 XP.';
        if (!ya) { sumarXP(15, 'ordena'); st.cambiar((s) => { s.wisfox.ordena = true; }); }
      } else {
        msg.textContent = elegidas.length === o.frase.length ? 'Todavía no. Recuerda: con she el verbo lleva -s. Toca una palabra para quitarla.' : 'Faltan palabras.';
      }
    };
    pintar();
    c.append(saludo('Minijuego', 'Ordena la frase y suma puntos.'),
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'suave' }, 'Toca las palabras en el orden correcto para armar la oración.'),
        respuesta, banco, h('div', { class: 'acciones' }, h('button', { class: 'btn', type: 'button', onclick: comprobar }, 'Comprobar'),
          h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { elegidas.length = 0; msg.textContent = ''; pintar(); } }, 'Empezar de nuevo')), msg));
  }

  function logros(c) {
    const ganados = st.obtener().wisfox.logros;
    c.append(saludo('Logros', `${ganados.length} de ${D.logros.length} conseguidos.`),
      h('div', { class: 'tarjeta tarjeta--borde' }, barraXP(),
        h('ul', { class: 'logros', style: 'margin-top:1rem' }, D.logros.map((l) => {
          const ok = ganados.includes(l.id);
          return h('li', { class: 'logro' + (ok ? ' ganado' : '') }, h('span', { class: 'icono', 'aria-hidden': 'true' }, l.icono), h('strong', null, l.nombre), h('div', null, ok ? 'Conseguido' : 'Pendiente'));
        }))));
  }

  MT.router.registrar({
    id: 'wisfox', titulo: 'Wisfox', espacio: 'wisfox', subs: TABS.filter((t) => !t.href),
    render(main, { sub }) {
      if (st.obtener().rol !== 'estudiante') st.cambiar((x) => { x.rol = 'estudiante'; });
      const c = espacio(main, { marca: 'wisfox', nombre: 'Wisfox', descripcion: 'Tu plataforma de aprendizaje', ruta: 'wisfox', tabs: TABS, sub,
        usuario: { iniciales: 'DE', nombre: 'Demo', rol: 'Nivel ' + Math.min(5, 1 + Math.floor(st.obtener().wisfox.xp / 25)) + ' · Explorador' } });
      ({ inicio, leccion, juego, logros })[sub](c);
    },
  });
})(window.MT = window.MT || {});
