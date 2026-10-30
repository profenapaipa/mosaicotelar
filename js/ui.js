/* ui.js: constructor de elementos, texto seguro y todos los símbolos de la marca.

   Por qué no se usa innerHTML con texto dinámico: lo que responde la IA o escribe una persona
   nunca debe interpretarse como HTML. h() crea nodos y ricoTexto() solo admite negrilla y
   cursiva, también como nodos. Los símbolos SVG sí son cadenas, pero son estáticas, escritas
   aquí, y por eso es seguro parsearlas.

   La familia de símbolos (ver marca.js y docs/ANALISIS_Y_DISENO.md):
   - Cada hilo tiene su propia forma de ficha, como las teselas de un mosaico:
       Kinesis = cuadrado redondeado   Wisfox = hexágono   ValerIA = círculo
   - Los conserva tal cual los tenían los proyectos (la K en movimiento, el hexágono con W)
     y le suma la tercera, que no existía.
   - El logo del colectivo es el telar: los tres colores de hilo cruzando hilos neutros. */
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

  /* El telar. Los tres colores de hilo son los de las aplicaciones: el verde bosque de Kinesis,
     el ámbar de Wisfox y el "uva" que Kinesis ya traía entre sus colores y que aquí es de ValerIA. */
  const HILOS = ['#1B7F56', '#E8A13C', '#6B4FC8'];

  function cuerpoTelar(columnas, filas, banda, hueco, margen, neutro, sombra) {
    const paso = banda + hueco;
    const ancho = margen * 2 + columnas * paso - hueco;
    const alto = margen * 2 + filas * paso - hueco;
    const r = [];
    for (let i = 0; i < filas; i++)
      r.push(`<rect x="0" y="${margen + i * paso}" width="${ancho}" height="${banda}" rx="${banda / 2}" fill="${neutro}"/>`);
    for (let j = 0; j < columnas; j++)
      r.push(`<rect x="${margen + j * paso}" y="0" width="${banda}" height="${alto}" rx="${banda / 2}" fill="${HILOS[j % 3]}"/>`);
    for (let i = 0; i < filas; i++)
      for (let j = 0; j < columnas; j++)
        if ((i + j) % 2 === 0)
          r.push(`<rect x="${margen + j * paso - 1}" y="${margen + i * paso}" width="${banda + 2}" height="${banda}" fill="${neutro}"/>` +
                 `<rect x="${margen + j * paso - 1}" y="${margen + i * paso + banda - 3}" width="${banda + 2}" height="3" fill="${sombra}"/>`);
    return { ancho, alto, cuerpo: r.join('') };
  }

  // Trama grande, para portadas.
  function telar(columnas, filas, banda, hueco, margen, clase) {
    const t = cuerpoTelar(columnas, filas, banda, hueco, margen, 'var(--hilo)', 'var(--hilo-sombra)');
    return svg(`<svg class="${clase}" viewBox="0 0 ${t.ancho} ${t.alto}" role="img" aria-label="Trama de un telar: tres hilos de color, verde, ámbar e índigo, cruzan hilos claros" focusable="false">${t.cuerpo}</svg>`);
  }

  /* Logo del colectivo, en su forma más simple: tres hilos de color y dos pasadas de trama.
     La trama usa currentColor, así el mismo símbolo sirve sobre fondo claro (tinta) y oscuro (blanco).
     Los colores salen de variables para poder usar la versión clara sobre fondos oscuros. */
  const LOGO = (c) => {
    const F = 'stroke="var(--logo-fondo,#FAF6EF)" stroke-width="3" paint-order="stroke"';   // costura: separa lo que pasa por encima
    return `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect x="5" y="4" width="14" height="56" rx="7" fill="var(--logo-1,#1B7F56)"/><rect x="25" y="4" width="14" height="56" rx="7" fill="var(--logo-2,#E8A13C)"/><rect x="45" y="4" width="14" height="56" rx="7" fill="var(--logo-3,#6B4FC8)"/><rect x="1" y="17" width="62" height="8" rx="4" fill="currentColor" ${F}/><rect x="1" y="39" width="62" height="8" rx="4" fill="currentColor" ${F}/><rect x="25" y="17" width="14" height="8" fill="var(--logo-2,#E8A13C)" ${F}/><rect x="5" y="39" width="14" height="8" fill="var(--logo-1,#1B7F56)" ${F}/><rect x="45" y="39" width="14" height="8" fill="var(--logo-3,#6B4FC8)" ${F}/></svg>`;
  };

  const MARCAS = {
    mosaico: LOGO,
    // Kinesis: la "K" en movimiento. El brazo superior sigue de largo y termina en un punto: el estudiante que avanza.
    kinesis: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="var(--k-fuerte)"/><path d="M22 16v32M24 34l18-15M28 34l16 14" fill="none" stroke="var(--k-sobre)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="49" cy="14" r="4.5" fill="var(--k-sobre)"/></svg>`,
    // Wisfox: el hexágono con la W, como en su plataforma.
    wisfox: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M32 4l24 14v28L32 60 8 46V18z" fill="var(--w-fuerte)" stroke="var(--w-fuerte)" stroke-width="6" stroke-linejoin="round"/><path d="M19 24l6.5 18L32 29l6.5 13L45 24" fill="none" stroke="var(--w-sobre)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    // ValerIA: la tercera ficha, un círculo con una chispa de cuatro puntas. La guía que ilumina el camino.
    valeria: (c) => `<svg class="${c}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="30" fill="var(--v-fuerte)"/><path d="M32 12l5.5 14.5L52 32l-14.5 5.5L32 52l-5.5-14.5L12 32l14.5-5.5z" fill="var(--v-sobre)"/></svg>`,
    // El zorro de Wisfox: orejas altas y mentón en punta. Es la mascota, no la marca.
    zorro: (c) => `<svg class="${c}" viewBox="0 0 64 64" role="img" aria-label="El zorro de Wisfox" focusable="false"><path d="M6 4l19 17h14l19-17-2 30-24 26-24-26z" fill="var(--w-acento)"/><path d="M32 60L13 36l19 6 19-6z" fill="var(--superficie)"/><path d="M20 30l6 2.5M44 30l-6 2.5" stroke="var(--tinta)" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="55" r="3" fill="var(--tinta)"/></svg>`,
  };

  // Íconos de línea: un solo trazo, redondeado, 2 px, como los de Kinesis y Wisfox.
  const L = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONOS = {
    inicio: L('<path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>'),
    recorrido: L('<circle cx="5.5" cy="18" r="2.3"/><circle cx="18.5" cy="6" r="2.3"/><path d="M7.5 17c8 0 2-10 9-10"/>'),
    estado: L('<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.4l2.7 2.7 5-5.6"/>'),
    identidad: L('<circle cx="12" cy="12" r="8.5"/><circle cx="8.4" cy="10.2" r="1"/><circle cx="12" cy="7.6" r="1"/><circle cx="15.6" cy="10.2" r="1"/><path d="M12 20.5c-2 0-2-2.2 0-2.6 1.6-.4 1.6-2.4 0-2.4"/>'),
    docente: L('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14c2.5 0 4 1.8 4 4.5"/>'),
    orientacion: L('<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h5"/>'),
    familia: L('<path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5"/><path d="M12 17.2c-2.2-1.4-3-2.4-3-3.6a1.7 1.7 0 0 1 3-1 1.7 1.7 0 0 1 3 1c0 1.2-.8 2.2-3 3.6z"/>'),
    libro: L('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"/>'),
    juego: L('<path d="M9 4h3a1.6 1.6 0 0 1 3.2 0H18v4a1.6 1.6 0 0 0 0 3.2V17h-4a1.6 1.6 0 0 0-3.2 0H6v-4a1.6 1.6 0 0 0 0-3.2V4z"/>'),
    logros: L('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7"/>'),
    flecha: L('<path d="M12 4v16M6 14l6 6 6-6"/>'),
    chispa: L('<path d="M12 3l2 6 6 3-6 3-2 6-2-6-6-3 6-3z"/>'),
  };

  const marca = (nombre, clase) => svg(MARCAS[nombre](clase || ''));
  // Símbolo + nombre. Es la forma horizontal del logo.
  const lockup = (clase) => h('span', { class: 'logo-lockup ' + (clase || '') }, marca('mosaico', 'logo-simbolo'), h('span', { class: 'logo-nombre' }, 'Mosaico Telar'));
  const icono = (nombre) => svg(ICONOS[nombre]);

  MT.ui = { h, ricoTexto, svg, telar, marca, lockup, icono, HILOS };
})(window.MT = window.MT || {});
