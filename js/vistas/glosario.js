/* glosario.js: las palabras del tema, explicadas en lenguaje cotidiano.

   Dos usos: la página #/glosario con todas, y un marcado automático: la primera vez que una sigla aparece en una
   pantalla se vuelve un botón que abre su explicación. Es un botón y no un texto emergente al pasar el cursor
   porque en el celular no existe el cursor, y porque un botón también se alcanza con el teclado. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { pagina } = MT.comun;

  const TERMINOS = [
    { sigla: 'PIAR', nombre: 'Plan Individual de Ajustes Razonables', que: 'La herramienta con la que el colegio y la familia planean los ajustes que un estudiante necesita para aprender y participar. Lo contempla el Decreto 1421 de 2017, que lo establece para estudiantes con discapacidad.' },
    { palabra: 'neurodiversidad', nombre: 'Neurodiversidad', que: 'La idea de que las diferencias en cómo funciona el cerebro humano son una variación natural, como la diversidad cultural o biológica. No describe a una persona sola: describe a un grupo, y en un aula todos somos parte de ella.' },
    { palabra: 'neurodivergencia', nombre: 'Neurodivergencia', que: 'La manera de procesar, aprender o percibir que se aparta de lo más habitual. Es una forma de ser y de aprender, no una falta.' },
    { palabra: 'neurodesarrollo', nombre: 'Neurodesarrollo', que: 'El proceso por el cual el cerebro y el sistema nervioso se desarrollan y se organizan desde la infancia, y con ellos la atención, el lenguaje, la memoria y la manera de relacionarse. Cada persona lo recorre a su ritmo.' },
    { sigla: 'DUA', nombre: 'Diseño Universal para el Aprendizaje', que: 'Una manera de planear la clase pensando desde el principio en que todos aprendemos distinto. Tiene tres principios: ofrecer varias formas de presentar la información (el qué), de expresarse (el cómo) y de motivarse (el por qué).' },
    { sigla: 'XP', nombre: 'Puntos de experiencia', que: 'Los puntos que ganas al hacer lecciones y quizes. Suben tu nivel. Son para ver tu propio avance, no para compararte con nadie.' },
    { nombre: 'Ajuste', que: MT.guias.AJUSTE },
    { nombre: 'Apoyo', que: 'Lo que le sirve a un estudiante para aprender, por ejemplo más tiempo o imágenes junto al texto. En Mosaico Telar un apoyo se describe siempre sin diagnóstico.' },
    { nombre: 'Información clínica', que: 'Datos de salud o un diagnóstico. En Mosaico Telar solo existe como archivos que ve únicamente orientación: ni docentes, ni familias, ni coordinación, ni la inteligencia artificial la reciben.' },
    { nombre: 'Mínimo privilegio', que: 'La regla de que cada rol ve solo lo que necesita para hacer su trabajo y nada más. Por eso coordinación administra el colegio pero no ve los apoyos de los estudiantes.' },
    { nombre: 'Portal', que: 'Cada una de las tres partes de la plataforma: Kinesis (el aula), ValerIA (la guía) y Wisfox (el estudiante).' },
  ];

  // Se marcan al primer uso las siglas y también las palabras clave del eje narrativo (neurodiversidad, neurodivergencia, neurodesarrollo).
  const SIGLAS = TERMINOS.filter((t) => t.sigla || t.palabra);
  const clave = (t) => t.sigla || t.palabra;
  const NO = 'BUTTON, A, LABEL, SELECT, OPTION, TEXTAREA, INPUT, DIALOG, H1, SCRIPT, STYLE, SVG, ABBR, .termino, .vivos, [role="heading"]';

  function explicar(t) {
    MT.dlg.abrir({ titulo: t.sigla ? `${t.sigla}: ${t.nombre}` : t.nombre, cuerpo: h('div', null, h('p', null, t.que), h('p', null, h('a', { href: '#/glosario', onclick: () => document.querySelector('dialog[open]') && document.querySelector('dialog[open]').close() }, 'Ver todo el glosario'))),
      acciones: [{ texto: 'Entendido', onclick: (cerrar) => cerrar() }] });
  }

  /* Marca la primera aparición de cada sigla en una pantalla. Solo toca texto corrido: nunca títulos, botones ni enlaces. */
  function marcar(main) {
    const pendientes = new Map(SIGLAS.map((t) => [clave(t), t]));
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && !n.parentElement.closest(NO) && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
    const nodos = []; while (walker.nextNode()) nodos.push(walker.currentNode);
    for (const nodo of nodos) {
      if (!pendientes.size) break;
      for (const [sigla, t] of [...pendientes]) {
        const m = new RegExp(`(^|[^A-Za-zÁÉÍÓÚáéíóúÑñ])${sigla}(?![A-Za-zÁÉÍÓÚáéíóúÑñ])`).exec(nodo.nodeValue);
        if (!m) continue;
        const i = m.index + m[1].length;
        const despues = nodo.splitText(i + sigla.length);
        const antes = nodo.splitText(i);
        const boton = h('button', { class: 'termino', type: 'button', 'aria-label': `${sigla}: qué significa`, onclick: () => explicar(t) }, sigla);
        antes.replaceWith(boton);
        pendientes.delete(sigla);
        // El nodo original se partió: lo que queda para las demás siglas está en `despues`; se vuelve a empezar con él.
        nodos.push(nodo, despues);
        break;
      }
    }
  }

  MT.glosario = { marcar, TERMINOS };

  MT.router.registrar({
    id: 'glosario', titulo: 'Glosario', espacio: '',
    render(main) {
      const c = pagina(main, { etiqueta: 'Glosario', titulo: 'Las palabras del tema, sin complicaciones', descripcion: 'Qué significa cada sigla y cada término que verás en la plataforma.' });
      c.append(h('dl', { class: 'glosario' }, TERMINOS.map((t) => h('div', { class: 'tarjeta' }, h('dt', null, t.sigla ? h('span', null, h('strong', null, t.sigla), ' · ', t.nombre) : h('strong', null, t.nombre)), h('dd', null, t.que)))));
    },
  });
})(window.MT = window.MT || {});
