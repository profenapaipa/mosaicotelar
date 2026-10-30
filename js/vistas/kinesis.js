/* kinesis.js: el hilo del aula. Conserva lo esencial de Kinesis: el docente ve apoyos y no
   diagnósticos, planea con los tres principios del DUA, la orientación valida y la familia ve
   el proceso. Lo que NO trae esta versión: base de datos, inicio de sesión y administración;
   eso sigue siendo el proyecto completo (github.com/profenapaipa/Kinesis). */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio, hora } = MT.comun;
  const st = MT.store;
  const D = MT.datos;

  const TABS = [{ id: 'docente', etiqueta: 'Docente' }, { id: 'orientacion', etiqueta: 'Orientación' }, { id: 'familia', etiqueta: 'Familia' }];

  const selloAjuste = (a) => ({
    ninguno: h('span', { class: 'sello sello--e' }, 'Sin ajuste'),
    propuesto: h('span', { class: 'sello sello--aviso' }, 'Pendiente de orientación'),
    aprobado: h('span', { class: 'sello sello--ok' }, 'Aprobado'),
    devuelto: h('span', { class: 'sello sello--aviso' }, 'Devuelto al docente'),
  }[a.estado]);

  function listaAjustes(items) {
    return h('ul', { class: 'ajuste-lista' }, items.map((i) => h('li', null, h('strong', null, i.cambio), h('span', { class: 'suave' }, 'Por qué: ' + i.porque))));
  }

  function docente(hoja) {
    const s = st.obtener();
    const est = D.estudiantes.find((e) => e.id === s.estudiante) || D.estudiantes[0];
    // Ver el perfil de apoyos de un estudiante con PIAR es el paso 1 del recorrido.
    if (est.piar && !s.pasos.apoyos) st.cambiar((x) => { x.pasos.apoyos = true; });

    const roster = h('div', { class: 'tarjeta' },
      h('h2', null, 'Mi curso · ' + D.curso),
      h('p', { class: 'suave' }, 'Diez estudiantes ficticios, tres con PIAR.'),
      h('ul', { class: 'roster' }, D.estudiantes.map((e) => h('li', null,
        h('button', { type: 'button', 'aria-pressed': e.id === est.id ? 'true' : 'false',
          onclick: () => { st.cambiar((x) => { x.estudiante = e.id; if (e.piar) x.pasos.apoyos = true; }); MT.router.recargar(); } },
          h('span', null, e.id), e.piar ? h('span', { class: 'sello sello--aviso' }, 'PIAR') : null)))));

    const perfil = h('div', { class: 'tarjeta tarjeta--borde' },
      h('p', { class: 'etiqueta' }, 'Perfil de apoyos'),
      h('h2', null, 'Estudiante ' + est.id),
      est.piar
        ? [h('h3', null, 'Apoyos que le sirven'), h('ul', null, est.apoyos.map((a) => h('li', null, a))),
           h('h3', null, 'Fortalezas'), h('ul', null, est.fortalezas.map((a) => h('li', null, a))),
           h('p', { class: 'suave' }, 'El diagnóstico no aparece aquí: solo lo ve quien tiene permiso. El docente ve apoyos.')]
        : h('div', { class: 'vacio' }, 'Sin apoyos registrados. La actividad general ya le sirve, y el DUA beneficia a todos.'));

    // Planeación con DUA
    const planear = h('div', { class: 'tarjeta tarjeta--borde' });
    const medidor = h('span', { style: 'width:0%' });
    const resumen = h('p', { class: 'suave', 'aria-live': 'polite' });
    const pintarDua = () => {
      const n = ['repr', 'accion', 'compromiso'].filter((k) => st.obtener().plan.dua[k].length).length;
      medidor.style.width = Math.round((n / 3) * 100) + '%';
      resumen.textContent = `DUA: ${n} de 3 principios cubiertos.` + (n === 3 ? ' Planeación completa.' : '');
    };
    const asig = h('select', { id: 'k-asig', onchange: (e) => st.cambiar((x) => { x.plan.asignatura = e.target.value; }) },
      D.asignaturas.map((a) => h('option', { value: a, selected: a === s.plan.asignatura }, a)));
    const tema = h('input', { type: 'text', id: 'k-tema', maxlength: '80', value: s.plan.tema,
      onchange: (e) => st.cambiar((x) => { x.plan.tema = e.target.value.slice(0, 80); }) });
    planear.append(
      h('p', { class: 'etiqueta' }, 'Planeación'),
      h('h2', null, 'Diseña la clase con DUA'),
      h('div', { class: 'campo' }, h('label', { for: 'k-asig' }, 'Asignatura'), asig),
      h('div', { class: 'campo' }, h('label', { for: 'k-tema' }, 'Tema'), tema),
      // append nativo no aplana listas (mostraba "[object HTMLFieldSetElement]"): se expande con "...".
      ...D.dua.map((g) => h('fieldset', { class: 'dua-grupo' }, h('legend', null, g.titulo), h('p', { class: 'principio' }, g.principio),
        g.opciones.map((op) => h('label', { class: 'casilla' },
          h('input', { type: 'checkbox', checked: s.plan.dua[g.id].includes(op),
            onchange: (e) => { st.cambiar((x) => { const l = x.plan.dua[g.id]; if (e.target.checked) l.push(op); else l.splice(l.indexOf(op), 1); }); pintarDua(); } }),
          op)))),
      h('div', { class: 'medidor', role: 'img', 'aria-label': 'Avance del DUA' }, medidor), resumen);
    pintarDua();

    const pedirIA = h('button', { class: 'btn', type: 'button', onclick: () => {
      const p = st.obtener().plan;
      MT.ia.panel.abrir({ tarea: 'disenar', texto: `Necesito una actividad de 20 minutos de ${p.asignatura} sobre ${p.tema} para grado 8.º.` });
    } }, 'Pedir ayuda a ValerIA');
    const ajustar = h('button', { class: 'btn btn--suave', type: 'button', disabled: !est.piar || (s.ajuste.estado === 'propuesto' && s.ajuste.estudiante === est.id),
      onclick: () => {
        st.cambiar((x) => {
          x.ajuste = { estado: 'propuesto', estudiante: est.id, items: D.generarAjuste(est), hora: '', nota: '' };
          x.pasos.ajuste = true;
          st.evento(`El docente preparó una actividad con apoyos para ${est.id}.`, true);
        });
        MT.router.recargar();
      } }, 'Ajustar al perfil de ' + est.id);
    planear.append(h('div', { class: 'acciones' }, pedirIA, ajustar));
    if (!est.piar) planear.append(h('p', { class: 'suave' }, 'El ajuste individual está disponible para estudiantes con apoyos registrados.'));

    const aj = s.ajuste;
    const estado = aj.estado !== 'ninguno' ? h('div', { class: 'tarjeta' },
      h('p', { class: 'etiqueta' }, 'Ajuste de ' + aj.estudiante), selloAjuste(aj),
      listaAjustes(aj.items),
      aj.estado === 'devuelto' ? [h('p', { class: 'aviso' }, 'Orientación devolvió el ajuste' + (aj.nota ? ': ' + aj.nota : '.')),
        h('div', { class: 'acciones' }, h('button', { class: 'btn', type: 'button', onclick: () => { st.cambiar((x) => { x.ajuste.estado = 'propuesto'; x.ajuste.nota = ''; }); MT.router.recargar(); } }, 'Volver a enviar a orientación'))] : null,
      aj.estado === 'aprobado' ? h('p', { class: 'suave' }, 'Aprobado a las ' + aj.hora + '. Ya está disponible para el estudiante en Wisfox.') : null) : null;

    hoja.append(h('div', { class: 'rejilla rejilla--aside' }, roster, h('div', { class: 'rejilla' }, perfil, planear, estado)));
  }

  function orientacion(hoja) {
    const aj = st.obtener().ajuste;
    if (aj.estado === 'ninguno') {
      hoja.append(h('div', { class: 'vacio' }, h('p', null, 'No hay ajustes pendientes.'), h('a', { class: 'btn', href: '#/kinesis/docente' }, 'Pedir uno desde Docente')));
      return;
    }
    const nota = h('textarea', { id: 'o-nota', maxlength: '200', 'aria-label': 'Nota para el docente (opcional)' }, aj.nota);
    const decidir = (estadoNuevo) => {
      st.cambiar((x) => {
        x.ajuste.estado = estadoNuevo;
        x.ajuste.nota = nota.value.slice(0, 200);
        if (estadoNuevo === 'aprobado') {
          x.ajuste.hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
          x.pasos.aprobado = true;
          st.evento('Orientación aprobó los ajustes de la actividad.', true);
        } else {
          st.evento('Orientación devolvió el ajuste al docente.', false);
        }
      });
      MT.router.recargar();
    };
    hoja.append(h('div', { class: 'tarjeta tarjeta--borde' },
      h('p', { class: 'etiqueta' }, 'Revisión de orientación'),
      h('h2', null, 'Ajuste para ' + aj.estudiante), selloAjuste(aj),
      h('p', { class: 'suave' }, 'El docente propone y orientación valida. Nada llega al estudiante ni a la familia sin esta aprobación.'),
      listaAjustes(aj.items),
      aj.estado === 'propuesto'
        ? [h('div', { class: 'campo' }, h('label', { for: 'o-nota' }, 'Nota para el docente (opcional)'), nota),
           h('div', { class: 'acciones' },
             h('button', { class: 'btn', type: 'button', onclick: () => decidir('aprobado') }, 'Aprobar el ajuste'),
             h('button', { class: 'btn btn--suave', type: 'button', onclick: () => decidir('devuelto') }, 'Devolver al docente'))]
        : h('p', { class: 'aviso' }, aj.estado === 'aprobado' ? 'Aprobado a las ' + aj.hora + '.' : 'Devuelto al docente' + (aj.nota ? ': ' + aj.nota : '.'))));
  }

  function familia(hoja) {
    const s = st.obtener();
    const aj = s.ajuste;
    if (aj.estado === 'aprobado' && !s.pasos.familia) st.cambiar((x) => { x.pasos.familia = true; });
    const eventos = s.eventos.filter((e) => e.familia);
    hoja.append(h('div', { class: 'rejilla rejilla--2' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Vista de la familia'),
        h('h2', null, 'Lo que se está haciendo por ' + (aj.estudiante || s.estudiante)),
        eventos.length
          ? h('ul', { class: 'linea-tiempo' }, eventos.map((e) => h('li', null, h('time', null, hora(e.t)), e.texto)),
              aj.estado !== 'aprobado' ? h('li', { class: 'pendiente' }, 'Falta la aprobación de orientación.') : null)
          : h('div', { class: 'vacio' }, 'Todavía no hay novedades. Cuando el docente prepare una actividad con apoyos, aparecerá aquí.'),
        h('p', { class: 'suave' }, 'La familia se entera mientras ocurre, no en la entrega de notas.')),
      h('div', { class: 'tarjeta' },
        h('p', { class: 'etiqueta' }, 'Mensaje para casa'),
        aj.estado === 'aprobado'
          ? h('p', null, 'La actividad de inglés ya tiene apoyos: pasos cortos, imágenes y más tiempo. Puedes preguntarle cómo le fue y qué aprendió.')
          : h('p', { class: 'suave' }, 'Cuando la actividad esté lista te contaremos qué cambió y por qué.'),
        h('p', { class: 'suave' }, 'Aquí nunca aparece un diagnóstico: solo lo que se hace en el aula para que aprenda a su manera.'))));
  }

  MT.router.registrar({
    id: 'kinesis', titulo: 'Kinesis', espacio: 'kinesis', subs: TABS,
    render(main, { sub }) {
      const hoja = espacio(main, { marca: 'kinesis', titulo: 'Kinesis', ruta: 'kinesis', tabs: TABS, sub,
        descripcion: 'Aprender en movimiento: apoyos que avanzan con cada estudiante. Planeación inclusiva con PIAR y DUA.' });
      ({ docente, orientacion, familia })[sub](hoja);
    },
  });
})(window.MT = window.MT || {});
