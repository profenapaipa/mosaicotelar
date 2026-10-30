/* wisfox.js: el hilo del estudiante. Conserva lo esencial de Wisfox: el zorro, la ruta con XP,
   lección, quiz de opción múltiple, un minijuego de ordenar frases y los logros.
   Lo que NO trae esta versión: el catálogo completo de materias, el tutor conectado, los planes
   y el idioma alternable; eso sigue en el proyecto completo (github.com/profenapaipa/wisfox).

   La diferencia con Wisfox solo: aquí la actividad cambia según lo que Orientación aprobó
   en Kinesis. Ese es el hilo que une los dos espacios. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio } = MT.comun;
  const st = MT.store;
  const D = MT.datos;
  const L = D.leccion;

  const TABS = [{ id: 'ruta', etiqueta: 'Mi ruta' }, { id: 'leccion', etiqueta: 'Lección y quiz' }, { id: 'juego', etiqueta: 'Juego' }, { id: 'logros', etiqueta: 'Logros' }];
  const XP_META = 100;

  function sumarXP(n, logro) {
    st.cambiar((s) => { s.wisfox.xp = Math.min(XP_META, s.wisfox.xp + n); if (logro) st.logro(logro); });
  }

  function barraXP() {
    const xp = st.obtener().wisfox.xp;
    return h('div', { class: 'xp' }, h('strong', null, xp + ' XP'),
      h('div', { class: 'medidor', style: 'flex:1', role: 'img', 'aria-label': `${xp} de ${XP_META} puntos de experiencia` }, h('span', { style: `width:${(xp / XP_META) * 100}%` })));
  }

  function ruta(hoja) {
    const aj = st.obtener().ajuste;
    const lista = aj.estado === 'aprobado';
    hoja.append(h('div', { class: 'rejilla rejilla--2' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('div', { class: 'zorro-saludo' }, MT.ui.marca('zorro'),
          h('div', { class: 'burbuja' }, lista
            ? '¡Hola! Tu actividad de hoy ya está lista y quedó a tu medida. ¿Empezamos?'
            : '¡Hola! Hoy repasamos el present simple. Esta es la versión general; cuando tu ajuste esté aprobado, aquí llegará la tuya.')),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/wisfox/leccion' }, 'Ir a la lección'),
          h('button', { class: 'btn btn--suave', type: 'button', onclick: () => MT.ia.panel.abrir({ tarea: 'ayuda', texto: 'No entiendo cuándo se le pone la s al verbo.' }) }, 'Preguntar a ValerIA'))),
      h('div', { class: 'tarjeta' },
        h('p', { class: 'etiqueta' }, 'Tu progreso'), barraXP(),
        h('p', { class: 'suave' }, 'Lección +10, cada respuesta correcta del quiz +10 y el juego +15.'),
        lista ? h('span', { class: 'sello sello--ok' }, 'Actividad a tu medida') : h('span', { class: 'sello sello--aviso' }, 'Versión general'))));
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

  function leccion(hoja) {
    const s = st.obtener();
    const adaptada = s.ajuste.estado === 'aprobado';
    const hecha = s.wisfox.leccion;
    const zonaQuiz = h('div');
    const marcar = h('button', { class: 'btn', type: 'button', disabled: hecha, onclick: (e) => {
      sumarXP(10, 'leccion');
      st.cambiar((x) => { x.wisfox.leccion = true; if (x.ajuste.estado === 'aprobado') { st.logro('adaptada'); } });
      e.currentTarget.disabled = true; e.currentTarget.textContent = 'Lección marcada';
    } }, hecha ? 'Lección marcada' : 'Marcar la lección como leída');

    hoja.append(h('div', { class: 'rejilla' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Lección'), h('h2', null, 'Mi rutina del día (present simple)'),
        adaptada
          ? h('span', { class: 'sello sello--ok' }, 'Versión a tu medida')
          : h('span', { class: 'sello sello--aviso' }, 'Versión general'),
        h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' }, L.tarjetas.map((t) => h('div', { class: 'tarjeta' },
          h('span', { class: 'icono', 'aria-hidden': 'true', style: 'font-size:2rem' }, t.icono), h('h3', null, t.titulo), h('p', null, t.texto), h('p', null, h('strong', null, t.ejemplo))))),
        adaptada
          ? [h('h3', { style: 'margin-top:1.2rem' }, 'Tu actividad, en tres pasos'),
             h('ol', { class: 'pasos-visuales' }, L.pasosAjustados.map((p) => h('li', null, h('span', { class: 'icono', 'aria-hidden': 'true' }, p.icono), p.texto))),
             h('ul', { class: 'ajuste-lista' }, s.ajuste.items.map((i) => h('li', null, i.cambio)))]
          : h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Hacer el ajuste individual toma el camino de Kinesis: docente, orientación y vuelta aquí.'),
        h('div', { class: 'acciones' }, marcar)),
      zonaQuiz));
    quiz(zonaQuiz);
  }

  function juego(hoja) {
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
    hoja.append(h('div', { class: 'tarjeta tarjeta--borde' },
      h('p', { class: 'etiqueta' }, 'Minijuego'), h('h2', null, 'Ordena la frase'),
      h('p', { class: 'suave' }, 'Toca las palabras en el orden correcto para armar la oración.'),
      respuesta, banco, h('div', { class: 'acciones' }, h('button', { class: 'btn', type: 'button', onclick: comprobar }, 'Comprobar'),
        h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { elegidas.length = 0; msg.textContent = ''; pintar(); } }, 'Empezar de nuevo')), msg));
  }

  function logros(hoja) {
    const ganados = st.obtener().wisfox.logros;
    hoja.append(h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Logros'), h('h2', null, `${ganados.length} de ${D.logros.length} conseguidos`), barraXP(),
      h('ul', { class: 'logros', style: 'margin-top:1rem' }, D.logros.map((l) => {
        const ok = ganados.includes(l.id);
        return h('li', { class: 'logro' + (ok ? ' ganado' : '') }, h('span', { class: 'icono', 'aria-hidden': 'true' }, l.icono), h('strong', null, l.nombre), h('div', null, ok ? 'Conseguido' : 'Pendiente'));
      }))));
  }

  MT.router.registrar({
    id: 'wisfox', titulo: 'Wisfox', espacio: 'wisfox', subs: TABS,
    render(main, { sub }) {
      const hoja = espacio(main, { marca: 'wisfox', titulo: 'Wisfox', ruta: 'wisfox', tabs: TABS, sub,
        descripcion: 'Aprende a tu ritmo, con lecciones, retos y un zorro que te acompaña.' });
      ({ ruta, leccion, juego, logros })[sub](hoja);
    },
  });
})(window.MT = window.MT || {});
