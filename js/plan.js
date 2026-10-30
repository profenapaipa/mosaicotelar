/* plan.js: qué incluye cada plan, qué está bloqueado en la demo y el registro de cuentas.

   Regla de honestidad: en la demo está desbloqueado TODO lo que ya funciona. Lo que aparece con candado (Pro) es lo que
   todavía no está construido o depende del servidor, y dice "En desarrollo". Nada bloqueado esconde algo que ya existe.

   Registro: sin servidor activo, la cuenta se reserva en este dispositivo (y se puede enviar por correo si hay contacto
   configurado). Con `MT.config.api`, el registro viaja al servidor privado. Solo se pide un correo: sin nombres. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const st = MT.store;

  /* Funciones Pro: lo que se ve bloqueado en la demo. */
  const PRO = {
    piar: { titulo: 'Exportar el PIAR en el formato oficial', que: 'Genera el documento del Plan Individual de Ajustes Razonables con los datos del perfil y los ajustes aprobados, listo para imprimir o firmar.', desde: 'Pro y Colegio' },
    valeria: { titulo: 'ValerIA con un modelo de lenguaje real', que: 'Respuestas generadas por un modelo, ajustadas a tu actividad y a tu grado, sin que la IA reciba nunca información clínica.', desde: 'Pro y Colegio' },
    nube: { titulo: 'Trabajo compartido en la nube', que: 'Lo que creas se guarda en un servidor y lo ven tu equipo y las familias desde cualquier dispositivo, sin perder nada al cambiar de equipo.', desde: 'Pro y Colegio' },
    cuentas: { titulo: 'Cuentas por rol con inicio de sesión único', que: 'Cada persona entra con su cuenta, ve solo lo suyo y la misma sesión sirve en Kinesis, ValerIA y Wisfox.', desde: 'Pro y Colegio' },
    reportes: { titulo: 'Reportes del colegio', que: 'Cuántos ajustes hay en cada estado, cuánto tarda un ajuste en llegar al aula y cómo usa la plataforma cada curso, sin ver datos de estudiantes.', desde: 'Pro y Colegio' },
    auditoria: { titulo: 'Historial de quién hizo qué', que: 'Un registro de las acciones importantes (aprobaciones, cambios de perfil, archivos) para rendir cuentas ante el colegio.', desde: 'Pro y Colegio' },
    avisos: { titulo: 'Avisos por correo a las familias', que: 'Cuando orientación aprueba un ajuste, la familia recibe un mensaje sencillo con lo que cambió y por qué.', desde: 'Pro y Colegio' },
    materias: { titulo: 'Más materias en la ruta del estudiante', que: 'Rutas de aprendizaje para otras materias, escritas con el equipo pedagógico del colegio a partir de su malla.', desde: 'Colegio, como servicio' },
  };

  const PRO_NAV = {
    docente: [{ pro: 'piar', etiqueta: 'Exportar PIAR', icono: 'libro' }, { pro: 'nube', etiqueta: 'Compartir con el equipo', icono: 'mapa' }],
    orientacion: [{ pro: 'piar', etiqueta: 'Exportar PIAR', icono: 'libro' }, { pro: 'auditoria', etiqueta: 'Historial', icono: 'estado' }],
    familia: [{ pro: 'avisos', etiqueta: 'Avisos al correo', icono: 'chat' }],
    coordinacion: [{ pro: 'reportes', etiqueta: 'Reportes', icono: 'estado' }, { pro: 'cuentas', etiqueta: 'Cuentas y usuarios', icono: 'coordinacion' }, { pro: 'auditoria', etiqueta: 'Historial', icono: 'recorrido' }],
    estudiante: [{ pro: 'materias', etiqueta: 'Más materias', icono: 'libro' }],
  };

  const candadoSvg = () => MT.ui.svg('<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>');
  const etiquetaPro = () => h('span', { class: 'pro-etiqueta' }, 'Pro');

  function abrirPro(clave) {
    const f = PRO[clave];
    MT.dlg.abrir({ titulo: f.titulo, cuerpo: h('div', null,
      h('p', null, f.que),
      h('p', null, h('span', { class: 'sello sello--e' }, 'En desarrollo'), ' ', h('span', { class: 'suave' }, 'Incluida en: ' + f.desde + '.')),
      h('p', { class: 'suave' }, 'Lo que ves desbloqueado en la demostración ya funciona. Esto llega con el servidor: pide la prueba gratuita y te avisamos cuando se active.')),
    acciones: [{ texto: 'Solicitar prueba gratuita', onclick: (c) => { c(); location.hash = '#/registro/prueba'; } }, { texto: 'Ver los planes', suave: true, onclick: (c) => { c(); location.hash = '#/planes'; } }] });
  }

  // Un botón con candado: se ve, se entiende qué es y abre la explicación en vez de hacer algo.
  const candado = (clave, texto) => h('button', { class: 'btn btn--chico btn--suave pro-candado', type: 'button', 'aria-label': `${texto || PRO[clave].titulo}: función Pro, bloqueada`, onclick: () => abrirPro(clave) }, candadoSvg(), texto || PRO[clave].titulo, etiquetaPro());

  /* ---------------- Cuenta y registro ---------------- */
  const cuenta = () => st.obtener().cuenta || null;
  const valido = (c) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(c) && c.length <= 254;

  async function registrar(d) {
    const datos = { correo: String(d.correo || '').trim().toLowerCase(), rol: d.rol, institucion: String(d.institucion || '').trim().slice(0, 100), plan: d.plan === 'prueba' ? 'prueba' : 'gratis', mensaje: String(d.mensaje || '').trim().slice(0, 500), consentimiento: true };
    if (!valido(datos.correo)) throw new Error('Escribe un correo válido, por ejemplo nombre@colegio.edu.co.');
    if (!d.consentimiento) throw new Error('Para registrarte debes aceptar el tratamiento de tu correo.');
    let via = 'local';
    const api = MT.config.api;
    if (api) {
      let r;
      try { r = await fetch(api.replace(/\/$/, '') + '/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos), signal: AbortSignal.timeout(10000) }); }
      catch (e) { throw new Error('No pudimos comunicarnos con el servidor. Inténtalo de nuevo en un momento.'); }
      if (!r.ok) { const m = await r.json().catch(() => ({})); throw new Error(m.detail || 'No pudimos registrarte. Revisa los datos.'); }
      via = 'servidor';
    }
    st.cambiar((s) => { s.cuenta = { correo: datos.correo, rol: datos.rol, institucion: datos.institucion, plan: datos.plan, fecha: new Date().toISOString(), via }; if (datos.rol && MT.roles.por(datos.rol)) s.rol = datos.rol; });
    return { via, datos };
  }

  const etiquetaPlan = () => { const c = cuenta(); return c ? (c.plan === 'prueba' ? 'Prueba Pro solicitada' : 'Cuenta gratuita') : 'Demo · Probar gratis'; };

  MT.plan = { PRO, PRO_NAV, abrirPro, candado, etiquetaPro, candadoSvg, cuenta, registrar, valido, etiquetaPlan };
})(window.MT = window.MT || {});
