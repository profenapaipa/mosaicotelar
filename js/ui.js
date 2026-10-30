/* ui.js: constructor de elementos, texto seguro y los símbolos de la marca.

   Por qué no se usa innerHTML con texto dinámico: lo que responde la IA o escribe una persona
   nunca debe interpretarse como HTML. h() crea nodos y ricoTexto() solo admite negrilla y
   cursiva, también como nodos. Los símbolos SVG sí son cadenas, pero son estáticas, escritas
   aquí, y por eso es seguro parsearlas. */
(function (MT) {
  'use strict';

  function añadir(el, hijos) {
    for (const hijo of hijos.flat(Infinity)) {
      if (hijo == null || hijo === false) continue;
      el.append(hijo.nodeType ? hijo : document.createTextNode(String(hijo)));
    }
  }

  function h(tag, attrs, ...hijos) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    añadir(el, hijos);
    return el;
  }

  function ricoTexto(texto) {
    const frag = document.createDocumentFragment();
    String(texto).split('\n').forEach((linea, i) => {
      if (i) frag.append(document.createElement('br'));
      for (const parte of linea.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)) {
        if (!parte) continue;
        if (parte.startsWith('**')) frag.append(h('strong', null, parte.slice(2, -2)));
        else if (parte.startsWith('*')) frag.append(h('em', null, parte.slice(1, -1)));
        else frag.append(document.createTextNode(parte));
      }
    });
    return frag;
  }

  function svg(cadena) {
    const t = document.createElement('template');
    t.innerHTML = cadena.trim();
    return t.content.firstChild;
  }

  /* Los tres hilos cruzan hilos neutros, alternando por encima y por debajo como un tejido real.
     Los colores son los de cada proyecto: verde de Kinesis, coral de Wisfox, índigo de ValerIA. */
  function telar(columnas, filas, banda, hueco, margen, clase) {
    const colores = ['var(--c-kinesis)', 'var(--c-wisfox)', 'var(--c-valeria)'];
    const paso = banda + hueco;
    const ancho = margen * 2 + columnas * paso - hueco;
    const alto = margen * 2 + filas * paso - hueco;
    const r = [];
    for (let i = 0; i < filas; i++)
      r.push(`<rect x="0" y="${margen + i * paso}" width="${ancho}" height="${banda}" rx="${banda / 2}" fill="var(--hilo)"/>`);
    for (let j = 0; j < columnas; j++)
      r.push(`<rect x="${margen + j * paso}" y="0" width="${banda}" height="${alto}" rx="${banda / 2}" fill="${colores[j % 3]}"/>`);
    for (let i = 0; i < filas; i++)
      for (let j = 0; j < columnas; j++)
        if ((i + j) % 2 === 0)
          r.push(`<rect x="${margen + j * paso - 1}" y="${margen + i * paso}" width="${banda + 2}" height="${banda}" fill="var(--hilo)"/>` +
                 `<rect x="${margen + j * paso - 1}" y="${margen + i * paso + banda - 3}" width="${banda + 2}" height="3" fill="var(--hilo-sombra)"/>`);
    return svg(`<svg class="${clase}" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Trama de un telar: tres hilos de color, verde, coral e índigo, cruzan hilos claros" focusable="false">${r.join('')}</svg>`);
  }

  const MARCAS = {
    // Una "K" en movimiento: el brazo superior sigue como trayectoria y termina en un punto (identidad de Kinesis).
    kinesis: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="var(--c-kinesis-fuerte)"/><path d="M22 16v32M24 34l18-15M28 34l16 14" fill="none" stroke="var(--sobre-fuerte)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="49" cy="14" r="4.5" fill="var(--sobre-fuerte)"/></svg>`,
    // El zorro de Wisfox: orejas altas y mentón en punta (lo que lo distingue de un gato a 24 px).
    wisfox: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="var(--c-wisfox-fuerte)"/><path d="M9 7l17 15h12l17-15-2 28-21 22-21-22z" fill="var(--sobre-fuerte)"/><path d="M22 33l5 2M42 33l-5 2" stroke="var(--c-wisfox-fuerte)" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="52" r="3" fill="var(--c-wisfox-fuerte)"/></svg>`,
    // Una chispa de cuatro puntas: la guía que ilumina el camino.
    valeria: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="var(--c-valeria-fuerte)"/><path d="M32 10l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="var(--sobre-fuerte)"/></svg>`,
    zorro: (c) => `<svg class="${c}" viewBox="0 0 64 64" role="img" aria-label="El zorro de Wisfox" focusable="false"><path d="M6 4l19 17h14l19-17-2 30-24 26-24-26z" fill="var(--c-wisfox)"/><path d="M32 60L13 36l19 6 19-6z" fill="var(--superficie)"/><path d="M20 30l6 2.5M44 30l-6 2.5" stroke="var(--tinta)" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="55" r="3" fill="var(--tinta)"/></svg>`,
  };
  const ICONOS = {
    inicio: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    recorrido: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="5" cy="18" r="2.5" fill="currentColor"/><circle cx="19" cy="6" r="2.5" fill="currentColor"/><path d="M7 17c8 0 2-10 10-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    estado: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12.5l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const marca = (nombre, clase) => svg(MARCAS[nombre](clase || ''));
  const icono = (nombre) => svg(ICONOS[nombre]);

  MT.ui = { h, ricoTexto, svg, telar, marca, icono };
})(window.MT = window.MT || {});
