/* wisfox.js: la parte de Wisfox que necesita la demostración integrada: la lección y el quiz del
   estudiante, que cambian según lo que Orientación aprobó en Kinesis. Ese es el hilo que une los dos.

   El Wisfox COMPLETO (árbol de materias, misiones, notas, recursos, planes, el zorro y todo lo demás)
   va incrustado tal cual lo construyó su equipo: ver embed.js. Aquí NO se reimplementa. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const st = MT.store;
  const D = MT.datos;
  const L = D.leccion;
  const XP_META = 100;

  const sumarXP = (n, logro) => st.cambiar((s) => { s.wisfox.xp = Math.min(XP_META, s.wisfox.xp + n); if (logro) st.logro(logro); });

  function saludo(titulo, texto) {
    const xp = st.obtener().wisfox.xp;
    return h('header', { class: 'saludo' }, h('div', null, h('h1', null, titulo), h('p', null, texto)),
      h('div', { class: 'saludo-chips' }, h('span', { class: 'chip-xp' }, xp + ' XP')));
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
        h('div', { class: 'acciones' }, h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { i = 0; aciertos = 0; pintar(); } }, 'Repetir el quiz'),
          h('a', { class: 'btn', href: '#/wisfox' }, 'Abrir Wisfox completo'))));
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
    c.append(saludo('¡Hola, Demo!', adaptada ? 'Tu actividad llegó a tu medida.' : 'Hoy repasamos el present simple.'));
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

  MT.demoWisfox = { leccion };
})(window.MT = window.MT || {});
