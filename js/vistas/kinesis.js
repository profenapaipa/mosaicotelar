/* kinesis.js: el hilo del aula, con la cara que ya tenía Kinesis: barra lateral propia, encabezado
   de bienvenida con degradado, tarjeta de "Siguiente paso" y el panel de cifras montado encima.

   Conserva lo esencial: el docente ve apoyos y no diagnósticos, planea con los tres principios del
   DUA, la orientación valida y la familia ve el proceso. Lo que NO trae esta versión: base de datos,
   inicio de sesión y administración; eso sigue en el proyecto completo (github.com/profenapaipa/Kinesis). */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { hero, panelCifras, hora } = MT.comun;
  const st = MT.store;
  const D = MT.datos;

  const selloAjuste = (a) => ({
    ninguno: h('span', { class: 'sello sello--e' }, 'Sin ajuste'),
    propuesto: h('span', { class: 'sello sello--aviso' }, 'Pendiente de orientación'),
    aprobado: h('span', { class: 'sello sello--ok' }, 'Aprobado'),
    devuelto: h('span', { class: 'sello sello--aviso' }, 'Devuelto al docente'),
  }[a.estado]);

  const listaAjustes = (items) => h('ul', { class: 'ajuste-lista' }, items.map((i) => h('li', null, h('strong', null, i.cambio), h('span', { class: 'suave' }, 'Por qué: ' + i.porque))));
  const irA = (id) => () => { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.focus({ preventScroll: true }); } };
  const duaCubiertos = (s) => ['repr', 'accion', 'compromiso'].filter((k) => s.plan.dua[k].length).length;

  function docente(c) {
    const s = st.obtener();
    const est = D.estudiantes.find((e) => e.id === s.estudiante) || D.estudiantes[0];
    // Ver el perfil de apoyos de un estudiante con PIAR es el paso 1 del recorrido.
    if (est.piar && !s.pasos.apoyos) st.cambiar((x) => { x.pasos.apoyos = true; });
    const dua = duaCubiertos(s);
    const aj = s.ajuste;

    const siguiente = aj.estado === 'ninguno'
      ? { titulo: dua < 3 ? `Completa el DUA de “${s.plan.tema}”` : 'Ajusta la actividad al perfil', texto: dua < 3 ? `Tienes ${dua} de 3 principios escritos. Con el diseño universal completo, los ajustes individuales se reducen a lo que de verdad hace falta.` : 'Ya cubriste los tres principios. Ahora ajusta lo que el diseño universal no alcanza.', boton: { texto: 'Abrir la planeación', onclick: irA('planeacion') } }
      : aj.estado === 'propuesto' ? { titulo: 'Tu ajuste espera a orientación', texto: 'Mientras tanto puedes planear otra clase o pedirle ideas a ValerIA.', boton: { texto: 'Hablar con ValerIA', onclick: () => MT.ia.panel.abrir() } }
      : aj.estado === 'devuelto' ? { titulo: 'Orientación devolvió tu ajuste', texto: aj.nota || 'Revísalo y vuelve a enviarlo.', boton: { texto: 'Ver el ajuste', onclick: irA('estado-ajuste') } }
      : { titulo: 'Tu ajuste ya llegó al estudiante', texto: 'Está aprobado y disponible en Wisfox.', boton: { texto: 'Verlo en Wisfox', onclick: () => { window.location.hash = '#/demo/estudiante'; } } };

    c.append(
      hero({ rol: 'Docente', titulo: 'Hola, docente', texto: 'Diseña tu clase una vez para todo el curso y deja los ajustes individuales para lo que el diseño universal no alcanza a cubrir.', siguiente }),
      panelCifras([
        { valor: String(D.estudiantes.length), etiqueta: 'Estudiantes', detalle: 'En 1 curso' },
        { valor: String(D.estudiantes.filter((e) => e.piar).length), etiqueta: 'Con PIAR', detalle: 'Tienen apoyos registrados' },
        { valor: aj.estado === 'ninguno' ? '0' : '1', etiqueta: 'Ajustes enviados', detalle: 'A orientación' },
        { valor: `${dua}/3`, etiqueta: 'Principios del DUA', detalle: 'Cubiertos en esta clase' },
      ]));

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

    const planear = h('div', { class: 'tarjeta tarjeta--borde', id: 'planeacion', tabindex: '-1' });
    const medidor = h('span', { style: 'width:0%' });
    const resumen = h('p', { class: 'suave', 'aria-live': 'polite' });
    const pintarDua = () => {
      const n = duaCubiertos(st.obtener());
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
    const ajustar = h('button', { class: 'btn btn--suave', type: 'button', disabled: !est.piar || (aj.estado === 'propuesto' && aj.estudiante === est.id),
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

    const estado = aj.estado !== 'ninguno' ? h('div', { class: 'tarjeta', id: 'estado-ajuste', tabindex: '-1' },
      h('p', { class: 'etiqueta' }, 'Ajuste de ' + aj.estudiante), selloAjuste(aj), listaAjustes(aj.items),
      aj.estado === 'devuelto' ? [h('p', { class: 'aviso' }, 'Orientación devolvió el ajuste' + (aj.nota ? ': ' + aj.nota : '.')),
        h('div', { class: 'acciones' }, h('button', { class: 'btn', type: 'button', onclick: () => { st.cambiar((x) => { x.ajuste.estado = 'propuesto'; x.ajuste.nota = ''; }); MT.router.recargar(); } }, 'Volver a enviar a orientación'))] : null,
      aj.estado === 'aprobado' ? h('p', { class: 'suave' }, 'Aprobado a las ' + aj.hora + '. Ya está disponible para el estudiante en Wisfox.') : null) : null;

    c.append(h('div', { class: 'bloque rejilla rejilla--aside' }, roster, h('div', { class: 'rejilla' }, perfil, planear, estado)));
  }

  function orientacion(c) {
    const aj = st.obtener().ajuste;
    c.append(
      hero({ rol: 'Orientación', titulo: 'Hola, equipo', texto: 'Todo el colegio en una vista: qué ajustes proponen los docentes y cuáles esperan tu validación.',
        siguiente: aj.estado === 'propuesto'
          ? { titulo: 'Revisa el ajuste de ' + aj.estudiante, texto: 'El docente propone y tú validas. Nada llega al estudiante ni a la familia sin tu aprobación.', boton: { texto: 'Abrir la revisión', onclick: irA('revision') } }
          : { titulo: 'Todo al día', texto: aj.estado === 'ninguno' ? 'No hay ajustes pendientes. Cuando un docente envíe uno, aparecerá aquí.' : 'Ya resolviste el ajuste más reciente.' } }),
      panelCifras([
        { valor: String(D.estudiantes.length), etiqueta: 'Estudiantes', detalle: 'En 1 curso' },
        { valor: String(D.estudiantes.filter((e) => e.piar).length), etiqueta: 'Con PIAR', detalle: 'Perfil pedagógico registrado' },
        { valor: aj.estado === 'propuesto' ? '1' : '0', etiqueta: 'Por revisar', detalle: 'Ajustes pendientes' },
        { valor: aj.estado === 'aprobado' ? '1' : '0', etiqueta: 'Aprobados', detalle: 'Ya llegaron al estudiante' },
      ]));

    if (aj.estado === 'ninguno') {
      c.append(h('div', { class: 'bloque vacio' }, h('p', null, 'No hay ajustes pendientes.'), h('a', { class: 'btn', href: '#/demo/docente' }, 'Ver cómo lo propone el docente')));
      return;
    }
    const nota = h('textarea', { id: 'o-nota', maxlength: '200', 'aria-label': 'Nota para el docente (opcional)' }, aj.nota);
    const decidir = (nuevo) => {
      st.cambiar((x) => {
        x.ajuste.estado = nuevo;
        x.ajuste.nota = nota.value.slice(0, 200);
        if (nuevo === 'aprobado') {
          x.ajuste.hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
          x.pasos.aprobado = true;
          st.evento('Orientación aprobó los ajustes de la actividad.', true);
        } else {
          st.evento('Orientación devolvió el ajuste al docente.', false);
        }
      });
      MT.router.recargar();
    };
    c.append(h('div', { class: 'bloque tarjeta tarjeta--borde', id: 'revision', tabindex: '-1' },
      h('p', { class: 'etiqueta' }, 'Revisión'), h('h2', null, 'Ajuste para ' + aj.estudiante), selloAjuste(aj),
      listaAjustes(aj.items),
      aj.estado === 'propuesto'
        ? [h('div', { class: 'campo' }, h('label', { for: 'o-nota' }, 'Nota para el docente (opcional)'), nota),
           h('div', { class: 'acciones' },
             h('button', { class: 'btn', type: 'button', onclick: () => decidir('aprobado') }, 'Aprobar el ajuste'),
             h('button', { class: 'btn btn--suave', type: 'button', onclick: () => decidir('devuelto') }, 'Devolver al docente'))]
        : h('p', { class: 'aviso' }, aj.estado === 'aprobado' ? 'Aprobado a las ' + aj.hora + '.' : 'Devuelto al docente' + (aj.nota ? ': ' + aj.nota : '.'))));
  }

  function familia(c) {
    const s = st.obtener();
    const aj = s.ajuste;
    if (aj.estado === 'aprobado' && !s.pasos.familia) st.cambiar((x) => { x.pasos.familia = true; });
    const eventos = s.eventos.filter((e) => e.familia);
    const codigo = aj.estudiante || s.estudiante;
    c.append(
      hero({ rol: 'Familia', titulo: 'Hola, acudiente', texto: `Así va ${codigo} en el colegio: lo que se hace en clase para que aprenda a su manera y cómo acompañar desde casa.` }),
      panelCifras([
        { valor: String(aj.estado === 'aprobado' ? aj.items.length : 0), etiqueta: 'Ajustes en clase', detalle: 'Apoyos que le funcionan' },
        { valor: String(eventos.length), etiqueta: 'Novedades', detalle: 'Compartidas por el colegio' },
        { valor: aj.estado === 'aprobado' ? 'Listo' : 'En espera', etiqueta: 'Estado del ajuste', detalle: 'Aprobado por orientación' },
      ]));
    c.append(h('div', { class: 'bloque rejilla rejilla--2' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Lo que está pasando'),
        h('h2', null, 'Por ' + codigo),
        eventos.length
          ? h('ul', { class: 'linea-tiempo' }, eventos.map((e) => h('li', null, h('time', null, hora(e.t)), e.texto)),
              aj.estado !== 'aprobado' ? h('li', { class: 'pendiente' }, 'Falta la aprobación de orientación.') : null)
          : h('div', { class: 'vacio' }, 'Todavía no hay novedades. Cuando el docente prepare una actividad con apoyos, aparecerá aquí.'),
        h('p', { class: 'suave' }, 'La familia se entera mientras ocurre, no en la entrega de notas.')),
      h('div', { class: 'tarjeta' },
        h('p', { class: 'etiqueta' }, 'Para la casa'),
        h('h2', null, 'Cómo puedes acompañar'),
        aj.estado === 'aprobado'
          ? h('p', null, 'La actividad de inglés ya tiene apoyos: pasos cortos, imágenes y más tiempo. Puedes preguntarle cómo le fue y qué aprendió.')
          : h('p', { class: 'suave' }, 'Cuando la actividad esté lista te contaremos qué cambió y por qué.'),
        h('p', { class: 'suave' }, 'Aquí nunca aparece un diagnóstico: solo lo que se hace en el aula para que aprenda a su manera.'))));
  }

  /* Coordinación = el administrador de Kinesis. Administra la estructura (usuarios, cursos, periodos,
     categorías de apoyo, vínculos con familias) y ve CUÁNTOS ajustes hay, nunca de quién ni qué dicen:
     por mínimo privilegio no tiene acceso al diagnóstico ni al PIAR completo. */
  function coordinacion(c) {
    const aj = st.obtener().ajuste;
    const cuenta = (e) => (aj.estado === e ? '1' : '0');
    c.append(
      hero({ rol: 'Coordinación', titulo: 'Hola, coordinación', texto: 'Deja la estructura del colegio lista: cursos, usuarios, periodos y vínculos con las familias. El contenido pedagógico es de docentes y orientación.',
        siguiente: { titulo: 'Revisa que cada estudiante tenga curso y familia', texto: 'Mientras no tengan curso, ningún docente los ve en su lista ni puede planear para ellos.', boton: { texto: 'Abrir la administración real', onclick: () => { window.location.hash = '#/kinesis/coordinacion'; } } } }),
      panelCifras([
        { valor: String(D.estudiantes.length), etiqueta: 'Estudiantes', detalle: 'Matriculados' },
        { valor: '1', etiqueta: 'Cursos', detalle: D.curso },
        { valor: cuenta('propuesto'), etiqueta: 'Ajustes por revisar', detalle: 'Sin ver de quién' },
        { valor: cuenta('aprobado'), etiqueta: 'Ajustes aprobados', detalle: 'Sin ver su contenido' },
      ]));
    c.append(h('div', { class: 'bloque rejilla rejilla--2' },
      h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Gestión'), h('h2', null, 'Lo que coordinación administra'),
        h('ul', { class: 'lista' }, [
          ['Usuarios', 'Crear y editar docentes, orientación, familias y estudiantes.'],
          ['Cursos y periodos', 'Armar los cursos y los periodos académicos, y asignar docentes.'],
          ['Categorías de apoyo', 'Definir la lista de apoyos que usa el colegio.'],
          ['Vínculos con familias', 'Conectar a cada acudiente con su estudiante.'],
        ].map(([t, d]) => h('li', null, h('strong', null, t), h('br'), h('span', { class: 'suave' }, d)))),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/kinesis/coordinacion' }, 'Abrir la administración real'))),
      h('div', { class: 'tarjeta' },
        h('p', { class: 'etiqueta' }, 'Lo que no ve'), h('h2', null, 'Mínimo privilegio'),
        h('p', null, 'La administración no tiene acceso al diagnóstico ni al PIAR completo, y no existe un atajo de “el administrador ve todo”. Solo orientación tiene acceso institucional, porque es su función.'),
        h('p', { class: 'suave' }, 'Por eso aquí ves cantidades, no contenidos: cuántos ajustes hay por revisar, no de quién ni qué dicen.'))));
  }

  MT.demoKinesis = { docente, orientacion, familia, coordinacion };
})(window.MT = window.MT || {});
