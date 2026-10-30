/* vivos.js: los portales "vivos", para trabajar con varios a la vez.

   Los portales (Kinesis y Wisfox son aplicaciones completas; ValerIA es un chat) viven en un contenedor que el router
   NUNCA destruye. Cambiar de pestaña solo muestra u oculta: lo que hiciste en Kinesis sigue ahí cuando vuelves de
   Wisfox, el chat de ValerIA conserva su conversación, y puedes ver dos portales lado a lado (vista dividida).

   Por qué se ve así: un iframe se recarga si se le cambia de lugar en el documento, por eso el contenedor es fijo y
   solo se alterna su visibilidad. */
(function (MT) {
  'use strict';
  const { h, marca } = MT.ui;
  const { PORTALES, ORDEN } = MT.guias;
  const st = MT.store;

  let raiz; let marcos; let encabezado; const paneles = {};
  let activo = null; let lado = null;
  const TARDA = 8000;

  function iniciar(main) {
    encabezado = h('div', { class: 'vivo-cab' });
    marcos = h('div', { class: 'vivo-marcos' });
    raiz = h('section', { class: 'vivos', 'data-persistente': '', hidden: true, 'aria-label': 'Portales abiertos' }, encabezado, marcos);
    main.prepend(raiz);
  }

  function crearPanel(id) {
    const p = PORTALES[id];
    const el = h('div', { class: 'vivo-panel', 'data-espacio': id, hidden: true, 'data-portal': id });
    if (id === 'valeria') {
      const caja = h('div', { class: 'tarjeta tarjeta--chat' });
      el.append(h('p', { class: 'vivo-panel__nombre' }, marca(id), 'ValerIA · la guía'), h('p', { class: 'pro-fila' }, h('span', null, 'Hoy responde con ejemplos preparados. '), MT.plan.candado('valeria', 'Modelo de lenguaje real')), caja);
      MT.ia.montarChat(caja, MT.ia.panel.sugerenciasPara()); // vive mientras la página: su conversación no se pierde al cambiar de pestaña
    } else {
      const url = (MT.config.portales || {})[id];
      const estado = h('p', { class: 'vivo-estado', role: 'status' }, MT.tejido.cargador(), `Cargando ${p.nombre}…`);
      const marco = h('iframe', { class: 'portal-marco', src: url, title: `${p.nombre}, ${p.rotulo.toLowerCase()}`, referrerpolicy: 'no-referrer',
        allow: 'clipboard-write', sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads' });
      const espera = setTimeout(() => { estado.replaceChildren(`${p.nombre} está tardando. Revisa tu conexión o ábrelo en una pestaña aparte con el enlace de arriba.`); estado.classList.add('vivo-estado--tarda'); }, TARDA);
      marco.addEventListener('load', () => { clearTimeout(espera); estado.remove(); });
      el.append(h('p', { class: 'vivo-panel__nombre' }, marca(id), `${p.nombre} · ${p.rotulo.toLowerCase()}`), estado, marco);
    }
    marcos.append(el);
    paneles[id] = el;
    return el;
  }

  function pintarEncabezado() {
    const p = PORTALES[activo]; const rol = st.obtener().rol; const r = rol ? MT.roles.por(rol) : null;
    const pasos = rol ? MT.guias.pasosEn(rol, activo) : [];
    const otros = ORDEN.filter((x) => x !== activo);
    const url = (MT.config.portales || {})[activo];
    // replaceChildren (nativo) convertiría un null en el texto "null": por eso solo se pasan nodos reales.
    encabezado.replaceChildren(...[
      h('div', { class: 'vivo-cab__titulo', 'data-espacio': activo },
        marca(activo, 'vivo-cab__marca'),
        h('div', null, h('p', { class: 'vivo-titulo', role: 'heading', 'aria-level': '1' }, `${p.nombre}: ${p.rotulo.toLowerCase()}`), h('p', { class: 'suave vivo-cab__que' }, p.que))),
      h('div', { class: 'vivo-cab__pasos' },
        r ? h('p', null, h('strong', null, `Tu rol: ${r.nombre}. `), pasos.length ? `En ${p.nombre} te toca:` : `En ${p.nombre} no tienes pasos propios; mira tu guía para ver dónde trabajas.`)
          : h('p', null, h('strong', null, 'Elige tu rol '), `para ver qué te toca hacer en ${p.nombre}.`),
        pasos.length ? h('ol', null, pasos.map((s) => h('li', null, h('span', null, s.t), s.aqui ? h('button', { class: 'enlace-boton', type: 'button', onclick: () => MT.guias.irAqui(rol, s.aqui) }, 'Hacerlo en Mi espacio') : null))) : null),
      h('div', { class: 'vivo-cab__acciones' },
        lado
          ? h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => { lado = null; refrescar(); } }, 'Quitar vista dividida')
          : h('span', { class: 'dividir' }, h('label', { for: 'dividir-con' }, 'Ver al lado'),
            h('select', { id: 'dividir-con', onchange: (e) => { if (e.target.value) { lado = e.target.value; refrescar(); } } },
              h('option', { value: '' }, 'Elegir portal…'), otros.map((o) => h('option', { value: o }, PORTALES[o].nombre)))),
        url && activo !== 'valeria' ? h('a', { class: 'btn btn--chico btn--suave', href: url, target: '_blank', rel: 'noopener' }, 'Abrir en pestaña aparte') : null),
      activo !== 'valeria' ? h('p', { class: 'aviso aviso--suave' }, `${p.nombre} es una aplicación de su equipo, con sus propios datos y su propio inicio de sesión. Lo que hagas aquí todavía no aparece en Mi espacio.`) : null].filter(Boolean));
  }

  function refrescar() {
    if (!activo) return;
    const visibles = [activo, lado].filter(Boolean);
    visibles.forEach((id) => { if (!paneles[id]) crearPanel(id); });
    Object.entries(paneles).forEach(([id, el]) => { el.hidden = !visibles.includes(id); });
    marcos.className = 'vivo-marcos' + (visibles.length > 1 ? ' vivo-marcos--2' : '');
    pintarEncabezado();
    if (MT.barra) MT.barra.actualizar();
  }

  function mostrar(id) {
    if (!raiz) iniciar(document.getElementById('app'));
    activo = id; if (lado === id) lado = null;
    raiz.hidden = false;
    refrescar();
  }
  function ocultar() { if (raiz) raiz.hidden = true; if (MT.barra) MT.barra.actualizar(); }

  MT.vivos = { mostrar, ocultar, abiertos: () => Object.keys(paneles), activo: () => (raiz && !raiz.hidden ? activo : null), lado: () => lado, dividir(id) { if (id && id !== activo) { lado = id; refrescar(); } } };
  MT.vivos.iniciar = iniciar;
})(window.MT = window.MT || {});
