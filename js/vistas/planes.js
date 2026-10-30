/* planes.js: planes, servicios y paquetes, y el registro (cuenta gratuita o prueba de Pro).

   Todo lo que figura como "Incluido" ya funciona en la demostración. Lo bloqueado dice "En desarrollo". Los precios no se inventan:
   se definen con los primeros colegios, y la página lo dice. */
(function (MT) {
  'use strict';
  const { h, marca } = MT.ui;
  const { pagina } = MT.comun;
  const st = MT.store;

  const PLANES = [
    { id: 'demo', nombre: 'Demo', precio: 'Sin costo', sub: 'Sin registro', para: 'Conocer la plataforma tal como funciona hoy.',
      incluye: ['Los cinco roles y su flujo de trabajo', 'Actividades con DUA y quiz, ajustes con aprobación, notas', 'Archivos con permisos por rol', 'Ruta de Inglés de grado 8.° con quizes explicados', 'Kinesis y Wisfox dentro de la plataforma, y ValerIA con ejemplos'],
      accion: { texto: 'Entrar a la demo', href: '#/guia' } },
    { id: 'gratis', nombre: 'Gratis', precio: 'Sin costo', sub: 'Solo con registro', para: 'Docentes, orientadores y familias que quieren empezar.', destacado: false,
      incluye: ['Todo lo de la demo', 'Tu cuenta gratuita reservada con tu correo', 'Aviso cuando abramos el espacio en la nube', 'Prioridad en la lista del primer piloto'],
      accion: { texto: 'Crear cuenta gratis', href: '#/registro/gratis', principal: true } },
    { id: 'pro', nombre: 'Pro', precio: 'Prueba gratuita', sub: 'El precio se define con los primeros colegios', para: 'Equipos que quieren trabajar juntos, en la nube.', bloqueado: true,
      incluye: ['Todo lo de Gratis', 'Trabajo compartido en la nube', 'Cuentas por rol con inicio de sesión único', 'ValerIA con un modelo de lenguaje real', 'Exportar el PIAR en el formato oficial', 'Reportes e historial'],
      accion: { texto: 'Solicitar prueba gratuita', href: '#/registro/prueba', principal: true } },
    { id: 'colegio', nombre: 'Colegio', precio: 'A la medida', sub: 'Pro más servicios', para: 'Colegios que quieren implementarla bien.', bloqueado: true,
      incluye: ['Todo lo de Pro, para varios cursos', 'Implementación en tu colegio', 'Capacitación a docentes y familias', 'Asesoría pedagógica en DUA y PIAR', 'Acompañamiento y seguimiento del piloto', 'Soporte prioritario'],
      accion: { texto: 'Pedir una cotización', href: '#/piloto' } },
  ];

  // [fila, demo, gratis, pro, colegio]. ok = incluido hoy; pro = bloqueado, en desarrollo; serv = servicio que se presta; - = no aplica
  const TABLA = [
    ['Recorrer la plataforma con datos de ejemplo', 'ok', 'ok', 'ok', 'ok'],
    ['Los cinco roles y su flujo de trabajo', 'ok', 'ok', 'ok', 'ok'],
    ['Actividades con DUA y quiz editable', 'ok', 'ok', 'ok', 'ok'],
    ['Ajustes con aprobación de orientación', 'ok', 'ok', 'ok', 'ok'],
    ['Notas y archivos con permisos por rol', 'ok', 'ok', 'ok', 'ok'],
    ['Ruta de Inglés de grado 8.° con quizes explicados', 'ok', 'ok', 'ok', 'ok'],
    ['Kinesis y Wisfox dentro de la plataforma, con vista dividida', 'ok', 'ok', 'ok', 'ok'],
    ['Cuenta propia y lista de acceso al espacio en la nube', '-', 'ok', 'ok', 'ok'],
    ['ValerIA con un modelo de lenguaje real', '-', '-', 'pro', 'pro'],
    ['Trabajo compartido en la nube, entre personas y dispositivos', '-', '-', 'pro', 'pro'],
    ['Cuentas por rol con inicio de sesión único', '-', '-', 'pro', 'pro'],
    ['Exportar el PIAR en el formato oficial', '-', '-', 'pro', 'pro'],
    ['Reportes del colegio e historial de quién hizo qué', '-', '-', 'pro', 'pro'],
    ['Varios cursos y varias materias', '-', '-', 'pro', 'serv'],
    ['Implementación en tu colegio', '-', '-', '-', 'serv'],
    ['Capacitación a docentes y familias', '-', '-', '-', 'serv'],
    ['Asesoría pedagógica en DUA y PIAR', '-', '-', '-', 'serv'],
    ['Acompañamiento y seguimiento del piloto', '-', '-', '-', 'serv'],
  ];
  const CELDA = { ok: ['Incluido', 'ok'], pro: ['Pro · en desarrollo', 'pro'], serv: ['Servicio', 'serv'], '-': ['No incluido', 'no'] };

  const SERVICIOS = [
    { id: 'implementacion', nombre: 'Implementación', para: 'Rectoría y coordinación', que: ['Configuración de cursos, categorías de apoyo y cuentas por rol', 'Carga inicial acordada con el colegio', 'Puesta en marcha con el equipo de orientación'], entrega: 'Remoto y en el colegio' },
    { id: 'asesoria', nombre: 'Asesoría pedagógica', para: 'Docentes y orientación', que: ['Cómo diseñar actividades con DUA', 'Cómo pensar un ajuste razonable y cuándo aprobarlo', 'Revisión de sus propios formatos de PIAR'], entrega: 'Sesiones por equipo' },
    { id: 'capacitacion', nombre: 'Capacitación', para: 'Docentes, familias y estudiantes', que: ['Talleres por rol con la guía de inicio rápido', 'Material para familias en lenguaje sencillo', 'Práctica guiada con la demostración'], entrega: 'Talleres presenciales o virtuales' },
    { id: 'acompanamiento', nombre: 'Acompañamiento del piloto', para: 'Colegio que prueba en un curso', que: ['Seguimiento semanal con el equipo', 'Indicadores: tiempo hasta el primer ajuste, ajustes aprobados, uso por rol', 'Informe final con aprendizajes y recomendaciones'], entrega: 'Un periodo académico' },
    { id: 'datos', nombre: 'Datos y seguridad', para: 'Rectoría y asesor legal del colegio', que: ['Política de tratamiento de datos y autorizaciones de las familias', 'Revisión de seguridad y decisión de dónde viven los datos', 'Preparación para datos reales con apoyo de un asesor legal'], entrega: 'Antes de usar datos reales' },
    { id: 'contenido', nombre: 'Contenido a la medida', para: 'Coordinación académica', que: ['Rutas de aprendizaje para otras materias, desde su malla', 'Quizes con explicación escritos con sus docentes'], entrega: 'Por materia y periodo' },
    { id: 'soporte', nombre: 'Soporte y mantenimiento', para: 'Todo el colegio', que: ['Canal de ayuda para cada rol', 'Actualizaciones y correcciones'], entrega: 'Continuo' },
  ];

  const PAQUETES = [
    { nombre: 'Piloto acompañado', para: 'Un curso de un colegio', incluye: ['Plan Pro con prueba gratuita', 'Implementación', 'Capacitación por rol', 'Acompañamiento del piloto', 'Datos y seguridad'], nota: 'Para probar con un solo curso, durante un periodo académico, y decidir con evidencia.' },
    { nombre: 'Colegio', para: 'Varios cursos', incluye: ['Plan Pro para todo el colegio', 'Implementación completa', 'Capacitación continua', 'Asesoría pedagógica en DUA y PIAR', 'Contenido a la medida', 'Soporte prioritario'], nota: 'Para colegios que ya decidieron y quieren llevarlo bien a todos sus cursos.' },
    { nombre: 'Aliados y secretarías', para: 'Varios colegios', incluye: ['Programa para una red de colegios', 'Todos los servicios', 'Indicadores comparables entre colegios', 'Formación de formadores'], nota: 'Para secretarías, fundaciones y aliados que quieren llevarla a más estudiantes.' },
  ];

  const icono = (k) => (k === 'ok' ? '✓' : k === 'pro' ? '🔒' : k === 'serv' ? '★' : '–');

  /* ---------------- Planes y servicios ---------------- */
  function vistaPlanes(main, sub) {
    const c = pagina(main, { etiqueta: 'Planes y servicios', titulo: sub === 'servicios' ? 'Servicios y paquetes' : 'Empieza gratis, crece con acompañamiento',
      descripcion: sub === 'servicios' ? 'Implementarla bien es tan importante como el software. Estos son los servicios que ofrecemos y cómo se agrupan en paquetes.' : 'La demo ya funciona completa. Con un registro reservas tu cuenta gratuita, y las funciones Pro se piden con una prueba gratuita.' });
    c.append(h('nav', { class: 'pestanas-pagina', 'aria-label': 'Planes y servicios' }, [['planes', 'Planes'], ['servicios', 'Servicios y paquetes']].map(([id, t]) => h('a', { href: '#/planes/' + id, 'aria-current': id === sub ? 'page' : null }, t))));
    if (sub === 'servicios') return servicios(c);

    c.append(h('div', { class: 'rejilla rejilla--4 planes' }, PLANES.map((p) => h('article', { class: 'tarjeta plan-tarjeta' + (p.bloqueado ? ' plan-tarjeta--pro' : ''), 'data-plan': p.id },
      h('p', { class: 'etiqueta' }, p.nombre), h('p', { class: 'plan-precio' }, p.precio), h('p', { class: 'suave plan-sub' }, p.sub), h('p', null, p.para),
      h('ul', { class: 'plan-lista' }, p.incluye.map((x) => h('li', null, x))),
      h('a', { class: 'btn' + (p.accion.principal ? '' : ' btn--suave'), href: p.accion.href }, p.accion.texto)))));
    c.append(h('p', { class: 'aviso aviso--suave', style: 'margin-top:1rem' }, 'Lo que está en la demo ya funciona. En el plan Pro, lo marcado “en desarrollo” llega con el servidor: al pedir la prueba gratuita te avisamos cuando se active. El precio de Pro y Colegio se define con los primeros colegios; hoy no hay cobro de ningún tipo.'));

    c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-comp' }, h('h2', { id: 'h-comp' }, 'Qué incluye cada plan'),
      h('div', { class: 'tabla-scroll' }, h('table', { class: 'tabla tabla-planes' },
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Función'), PLANES.map((p) => h('th', { scope: 'col' }, p.nombre)))),
        h('tbody', null, TABLA.map(([f, ...v]) => h('tr', null, h('th', { scope: 'row' }, f), v.map((k) => h('td', { class: 'celda-' + CELDA[k][1] }, h('span', { 'aria-hidden': 'true' }, icono(k)), h('span', { class: k === '-' ? 'solo-lectores' : 'celda-texto' }, ' ' + CELDA[k][0]))))))))));

    c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-faq' }, h('h2', { id: 'h-faq' }, 'Preguntas frecuentes'),
      h('div', { class: 'rejilla rejilla--2' }, [
        ['¿Qué puedo hacer hoy sin pagar ni registrarme?', 'Recorrer la demostración completa con datos de ejemplo: los cinco roles, actividades, ajustes, archivos y la ruta de Inglés. Todo lo que ya funciona está desbloqueado.'],
        ['¿Para qué sirve registrarme?', 'Para reservar tu cuenta gratuita, recibir el aviso cuando abramos el espacio en la nube y entrar a la lista del primer piloto. Solo pedimos tu correo.'],
        ['¿Cuánto cuesta Pro?', 'Todavía no hay precio: lo definimos con los primeros colegios. La prueba es gratuita y sin tarjeta.'],
        ['¿Se pueden usar datos reales de estudiantes?', 'Todavía no. Primero necesitamos la política de datos, la autorización de las familias, un contrato con el colegio y una revisión de seguridad. Ese trabajo hace parte de los servicios.'],
      ].map(([q, a]) => h('div', { class: 'tarjeta' }, h('h3', null, q), h('p', null, a))))));
    c.append(h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/registro/gratis' }, 'Crear cuenta gratis'), h('a', { class: 'btn btn--suave', href: '#/registro/prueba' }, 'Solicitar prueba gratuita de Pro'), h('a', { class: 'btn btn--suave', href: '#/planes/servicios' }, 'Ver servicios y paquetes')));
  }

  function servicios(c) {
    c.append(h('div', { class: 'rejilla rejilla--3 servicios' }, SERVICIOS.map((s) => h('article', { class: 'tarjeta servicio', id: 'serv-' + s.id },
      h('h2', null, s.nombre), h('p', { class: 'etiqueta' }, 'Para ' + s.para.toLowerCase()), h('ul', null, s.que.map((x) => h('li', null, x))), h('p', { class: 'suave' }, h('strong', null, 'Cómo se entrega: '), s.entrega)))));
    c.append(h('section', { class: 'seccion', 'aria-labelledby': 'h-paq' }, h('h2', { id: 'h-paq' }, 'Paquetes'),
      h('p', { class: 'bajada' }, 'Los servicios se agrupan en paquetes según el tamaño del proyecto. El valor se cotiza con cada colegio: hoy no hay precios publicados.'),
      h('div', { class: 'rejilla rejilla--3' }, PAQUETES.map((p) => h('article', { class: 'tarjeta plan-tarjeta' }, h('p', { class: 'etiqueta' }, p.para), h('h3', null, p.nombre), h('ul', { class: 'plan-lista' }, p.incluye.map((x) => h('li', null, x))), h('p', { class: 'suave' }, p.nota), h('a', { class: 'btn', href: '#/piloto' }, 'Pedir una cotización')))),
      h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Cada paquete incluye la prueba gratuita de Pro. ', h('a', { href: '#/registro/prueba' }, 'Solicitarla ahora'), '.')));
  }

  /* ---------------- Registro ---------------- */
  function vistaRegistro(main, plan) {
    const c = pagina(main, { etiqueta: 'Registro', titulo: plan === 'prueba' ? 'Solicita tu prueba gratuita de Pro' : 'Crea tu cuenta gratuita',
      descripcion: plan === 'prueba' ? 'Cuéntanos quién eres y qué necesitas. Te avisamos cuando se active, sin tarjeta y sin compromiso.' : 'Solo te pedimos un correo. Reservas tu cuenta y sigues usando la demostración completa mientras abrimos el espacio en la nube.' });
    const correo = MT.dlg.campo({ id: 'correo', etiqueta: 'Tu correo', max: 120, valor: (MT.plan.cuenta() || {}).correo || '', ayuda: 'No pedimos tu nombre ni el de ningún estudiante.' });
    const rol = MT.dlg.campo({ id: 'rol', etiqueta: 'Tu rol', tipo: 'select', valor: st.obtener().rol || 'docente', opciones: [...MT.roles.lista.map((r) => ({ valor: r.id, texto: r.nombre })), { valor: 'directivo', texto: 'Rectoría o directivo' }, { valor: 'aliado', texto: 'Aliado, fundación o secretaría' }] });
    const inst = MT.dlg.campo({ id: 'institucion', etiqueta: 'Colegio u organización (opcional)', max: 100 });
    const msg = plan === 'prueba' ? MT.dlg.campo({ id: 'mensaje', etiqueta: 'Qué necesitas (opcional)', tipo: 'area', filas: 3, max: 500, ayuda: 'Por ejemplo: cuántos cursos, qué rol usaría la plataforma y qué te preocupa.' }) : null;
    const consent = h('label', { class: 'casilla casilla--consent' }, h('input', { type: 'checkbox', id: 'consentimiento' }),
      h('span', null, 'Autorizo el tratamiento de mi correo para que me contacten sobre Mosaico Telar. Puedo pedir que lo borren cuando quiera.'));
    const error = h('p', { class: 'aviso', role: 'alert', hidden: true });
    const boton = h('button', { class: 'btn', type: 'submit' }, plan === 'prueba' ? 'Solicitar la prueba' : 'Crear mi cuenta');
    const f = h('form', { class: 'tarjeta formulario formulario--registro', novalidate: true },
      h('div', { class: 'campo campo--plan', role: 'group', 'aria-label': 'Qué quieres' }, h('p', { class: 'campo__etiqueta' }, 'Qué quieres'),
        h('a', { class: 'chip-plan' + (plan === 'gratis' ? ' chip-plan--on' : ''), href: '#/registro/gratis', 'aria-current': plan === 'gratis' ? 'page' : null }, 'Cuenta gratuita'),
        h('a', { class: 'chip-plan' + (plan === 'prueba' ? ' chip-plan--on' : ''), href: '#/registro/prueba', 'aria-current': plan === 'prueba' ? 'page' : null }, 'Prueba gratuita de Pro')),
      error, correo.el, rol.el, inst.el, msg ? msg.el : null, consent, boton,
      h('p', { class: 'suave' }, 'Tu correo se usa solo para contactarte sobre Mosaico Telar. No lo compartimos ni lo usamos para otra cosa.'));
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); error.hidden = true; boton.disabled = true;
      try {
        const r = await MT.plan.registrar({ correo: correo.leer(), rol: rol.leer(), institucion: inst.leer(), mensaje: msg ? msg.leer() : '', plan, consentimiento: consent.querySelector('input').checked });
        exito(c, f, r, plan);
      } catch (err) { error.hidden = false; error.textContent = err.message; boton.disabled = false; }
    });
    c.append(f);
    c.append(h('p', { class: 'suave' }, 'Antes de registrarte puedes ', h('a', { href: '#/planes' }, 'ver qué incluye cada plan'), ' o ', h('a', { href: '#/guia' }, 'entrar a la demostración'), '.'));
  }

  function exito(c, f, r, plan) {
    const tej = MT.tejido.logo({ animar: true });
    const contacto = MT.config.contacto;
    const cuerpo = `Correo: ${r.datos.correo}\nRol: ${r.datos.rol}\nInstitución: ${r.datos.institucion || '-'}\nPlan: ${plan === 'prueba' ? 'Prueba gratuita de Pro' : 'Cuenta gratuita'}\n${r.datos.mensaje || ''}`;
    const tarjeta = h('div', { class: 'tarjeta registro-exito', role: 'status' },
      h('div', { class: 'registro-exito__logo' }, tej.el),
      h('div', null,
        h('h2', null, plan === 'prueba' ? '¡Solicitud recibida!' : '¡Tu cuenta quedó reservada!'),
        h('p', null, r.via === 'servidor' ? `Te escribiremos a ${r.datos.correo}.` : `Quedó guardada en este dispositivo para ${r.datos.correo}. Cuando abramos el espacio en la nube te escribiremos.`),
        r.via === 'local' && contacto ? h('p', null, h('a', { class: 'btn btn--suave', href: `mailto:${contacto}?subject=${encodeURIComponent(plan === 'prueba' ? 'Prueba gratuita de Pro' : 'Cuenta gratuita')}&body=${encodeURIComponent(cuerpo)}` }, 'Enviarla también por correo')) : null,
        h('p', { class: 'suave' }, 'Mientras tanto, la demostración completa ya está abierta para ti.'),
        h('div', { class: 'acciones' }, h('a', { class: 'btn', href: '#/guia' }, 'Entrar a la demostración'), h('a', { class: 'btn btn--suave', href: '#/planes' }, 'Ver los planes'))));
    f.replaceWith(tarjeta);
  }

  MT.router.registrar({
    id: 'planes', titulo: 'Planes y servicios', espacio: '', subs: [{ id: 'planes' }, { id: 'servicios' }],
    render(main, { sub }) { vistaPlanes(main, sub); },
  });
  MT.router.registrar({
    id: 'registro', titulo: 'Registro', espacio: '', subs: [{ id: 'gratis' }, { id: 'prueba' }],
    render(main, { sub }) { vistaRegistro(main, sub); },
  });
})(window.MT = window.MT || {});
