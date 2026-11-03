/* identidad.js: el manual de marca, vivo. Cada muestra se dibuja con los mismos componentes y
   variables de la plataforma, así el manual no puede contradecir a la página: si cambia un color
   en tokens.css, cambia aquí. */
(function (MT) {
  'use strict';
  const { h, marca, lockup, icono } = MT.ui;
  const { pagina } = MT.comun;

  const COLORES = [
    { nombre: 'Tinta', hex: '#1A1714', rol: 'Monocromo', origen: 'Un negro cálido, no un negro puro.', uso: 'Texto, estructura, logo e íconos.' },
    { nombre: 'Papel', hex: '#FFFFFF', rol: 'Monocromo', origen: 'Fondo de tarjetas y páginas.', uso: 'Superficies.' },
    { nombre: 'Lino', hex: '#F6F2EA', rol: 'Monocromo', origen: 'Un blanco cálido que baja el brillo de la pantalla.', uso: 'Fondos secundarios y bandas.' },
    { nombre: 'Verde bosque', hex: '#1B7F56', rol: 'Color principal', origen: 'Kinesis: su color de marca. Wisfox usa la misma familia (#3D9960 y #2E7D4F).', uso: 'La acción: botón principal, enlaces y estados activos.' },
    { nombre: 'Ámbar', hex: '#E8A13C', rol: 'Funcional', origen: 'Wisfox: su acento y el zorro. Kinesis: sus avisos y el PIAR.', uso: 'Identifica a Wisfox y da avisos. Nunca rojo: un PIAR no es un error. Nunca lleva texto encima.' },
    { nombre: 'Azul tinta', hex: '#2B4FA3', rol: 'Funcional', origen: 'El “Océano” del menú de apariencia de Kinesis (#1D6FB8), un paso más oscuro: el original se confundía con el verde en tritanopía.', uso: 'Identifica a ValerIA.' },
  ];

  // Contraste WCAG, calculado aquí mismo para que la cifra mostrada sea siempre la real.
  const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const razon = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const ICONOS = ['docente', 'orientacion', 'familia', 'coordinacion', 'libro', 'chat', 'mapa', 'recorrido', 'estado', 'identidad'];

  const VERSIONES = [
    { nombre: 'A color, sobre fondo blanco', clase: 'muestra-logo--claro', mono: false, archivo: 'logo-color-fondo-blanco.svg', uso: 'La versión principal: piezas negras e hilos de colores.' },
    { nombre: 'A color, sobre fondo negro', clase: 'muestra-logo--oscuro', mono: false, archivo: 'logo-color-fondo-negro.svg', uso: 'Las piezas pasan a blanco y los hilos conservan su color.' },
    { nombre: 'Blanco y negro, sobre fondo blanco', clase: 'muestra-logo--claro', mono: true, archivo: 'logo-bn-fondo-blanco.svg', uso: 'Para impresión en una tinta, fotocopias y sellos.' },
    { nombre: 'Blanco y negro, sobre fondo negro', clase: 'muestra-logo--oscuro', mono: true, archivo: 'logo-bn-fondo-negro.svg', uso: 'Para fondos oscuros sin color.' },
  ];

  const seccion = (id, titulo, ...hijos) => h('section', { class: 'manual-seccion', id, 'aria-labelledby': 'm-' + id }, h('h2', { id: 'm-' + id }, titulo), ...hijos);

  MT.router.registrar({
    id: 'identidad', titulo: 'Identidad', espacio: '',
    render(main) {
      const c = pagina(main, { etiqueta: 'Identidad', titulo: 'Mosaico Telar: identidad',
        descripcion: 'Cómo se ve y cómo habla la plataforma. Todo lo que ves aquí está hecho con los mismos componentes que usa el resto del sitio.' });

      c.append(h('nav', { class: 'toc', 'aria-label': 'Contenido de la identidad' }, h('ul', null,
        [['proposito', 'Propósito'], ['logo', 'Logo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['formas', 'Formas e íconos'], ['recursos', 'Recursos'], ['componentes', 'Componentes'], ['voz', 'Voz']]
          .map(([id, t]) => h('li', null, h('a', { href: '#/identidad', onclick: (e) => { e.preventDefault(); const el = document.getElementById(id); if (el) MT.movimiento.desplazar(el); } }, t))))));

      c.append(seccion('proposito', 'Propósito',
        h('div', { class: 'rejilla rejilla--2' },
          h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Por qué existimos'), h('p', { class: 'manual-grande' }, 'Para que ninguna forma de aprender se quede fuera del aula.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Eslogan'), h('p', { class: 'manual-grande' }, 'Tejemos caminos para aprender.'))),
        h('p', null, h('strong', null, 'Qué hacemos: '), 'una plataforma para que el docente planee una clase inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.'),
        h('p', null, h('strong', null, 'Descriptor: '), 'Colectivo de educación inclusiva con tecnología.'),
        h('div', { class: 'rejilla rejilla--3' }, [['Todos somos mosaico', 'Todos aprendemos distinto, también quienes no tienen un diagnóstico.'], ['Cada pieza conserva su nombre', 'Kinesis, Wisfox y ValerIA se unen sin perder su identidad.'], ['Los datos van primero', 'Son menores de edad. Lo que no es necesario, no se pide.'], ['Decimos qué hay', 'Y qué responde con ejemplos. Sin adornos.']]
          .map(([t, p]) => h('div', { class: 'tarjeta' }, h('h3', null, t), h('p', null, p))))));

      c.append(seccion('logo', 'Logo',
        h('p', null, 'Una trama de telar vista de cerca: ', h('strong', null, 'nueve teselas negras cruzadas por hilos de cuatro colores'), ', que pasan por encima y por debajo. El mosaico son las piezas; el telar, lo que las une. Cada hilo es el color de uno de los portales: verde (Kinesis), azul (ValerIA), ámbar (Wisfox) y rosa (la plataforma que los une).'),
        h('div', { class: 'rejilla rejilla--2' }, VERSIONES.map((v) => h('div', { class: 'tarjeta' },
          h('div', { class: 'muestra-logo ' + v.clase }, lockup(v.mono ? 'logo-mono' : '')),
          h('h3', null, v.nombre), h('p', { class: 'suave' }, v.uso),
          h('p', null, h('a', { href: 'assets/' + v.archivo, download: v.archivo }, 'Descargar (SVG)'))))),
        h('p', { class: 'suave', style: 'margin-top:.6rem' }, 'La base es la versión a color: piezas negras con los hilos de colores. De ella salen las otras tres, y también el ícono de la pestaña y el botón de inicio. En el ícono de la pestaña y en el botón de inicio el logo va sobre una baldosa blanca para que se lea con cualquier tema del navegador.'),
        h('div', { class: 'tarjeta', style: 'margin-top:1rem' }, h('h3', null, 'Por qué se ve como se ve (leyes de la Gestalt)'),
          h('ul', null,
            h('li', null, h('strong', null, 'Cierre: '), 'el cuadrado completo se lee aunque los hilos lo corten en nueve piezas.'),
            h('li', null, h('strong', null, 'Semejanza: '), 'todos los hilos tienen el mismo grosor y todas las piezas la misma tinta; por eso se lee como una sola trama.'),
            h('li', null, h('strong', null, 'Continuidad: '), 'cada hilo sigue recto de lado a lado y el ojo lo sigue aunque se oculte bajo otro.'),
            h('li', null, h('strong', null, 'Figura y fondo: '), 'los hilos son el espacio vacío: el logo se dibuja con lo que no está, y por eso funciona en cualquier fondo.'),
            h('li', null, h('strong', null, 'Simplicidad: '), 'una sola forma, un solo grosor y una sola tinta. Sin degradados, sin líneas de distinto peso.'))),
        h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' },
          h('div', { class: 'tarjeta' }, h('div', { class: 'muestra-simbolo' }, marca('mosaico', 'simbolo-grande')), h('p', { class: 'suave' }, 'Símbolo solo, para íconos y favicon. Se lee desde 16 px.')),
          h('div', { class: 'tarjeta' }, h('h3', null, 'Cómo se usa'), h('ul', null,
            h('li', null, 'Espacio libre: el ancho de un hilo, por todos los lados.'), h('li', null, 'Tamaño mínimo: 16 px el símbolo; 110 px el logo completo.'), h('li', null, 'Los hilos llevan el color de su portal; en blanco y negro, toman el color del fondo.'))),
          h('div', { class: 'tarjeta' }, h('h3', null, 'Cómo no'), h('ul', null,
            h('li', null, 'No estirarlo ni girarlo.'), h('li', null, 'No cambiar los colores de las piezas ni de los hilos.'), h('li', null, 'No ponerle sombras, degradados ni contornos.'))))));

      c.append(seccion('color', 'Color',
        h('p', null, h('strong', null, 'Un color principal, dos funcionales y tres neutros.'), ' El principal es el verde bosque, y se eligió por continuidad: los dos proyectos ya eran verdes, así que la plataforma no les cambia el tono, lo comparte. Los funcionales también salen de las aplicaciones.'),
        h('div', { class: 'rejilla rejilla--3' }, COLORES.map((k) => h('div', { class: 'tarjeta muestra-color' },
          h('div', { class: 'muestra-color__tinte', style: `background:${k.hex}` }),
          h('p', { class: 'etiqueta' }, k.rol), h('h3', null, k.nombre), h('p', { class: 'dato' }, k.hex), h('p', null, k.uso), h('p', { class: 'suave' }, 'Origen: ' + k.origen),
          h('p', { class: 'suave' }, (() => { const b = razon(k.hex, '#FFFFFF'); const t = razon(k.hex, '#1A1714'); return b >= t ? `Texto encima: blanco (${b.toFixed(1)}:1)` : `Texto encima: tinta (${t.toFixed(1)}:1). El blanco no pasa.`; })())))),
        h('div', { class: 'tarjeta tarjeta--borde', style: 'margin-top:1rem' }, h('h3', null, 'Por qué estos tres funcionan juntos'),
          h('ul', null,
            h('li', null, h('strong', null, 'Se distinguen aunque no se vea el color: '), 'verde, ámbar y azul se separan en daltonismo: el par más exigente es verde y azul en tritanopía (ΔE 8,7, por encima del mínimo de 8); los demás superan 17. Se validaron con la herramienta de paletas.'),
            h('li', null, h('strong', null, 'Cubren los tres ejes del color: '), 'un verde (planta), un amarillo naranja (cálido) y un azul (frío). Además, cada hilo tiene su forma (cuadrado, hexágono, círculo) y su nombre: el color nunca va solo.'),
            h('li', null, h('strong', null, 'El ámbar nunca lleva texto: '), 'su contraste con blanco es 2,1:1, por debajo del mínimo. Por eso solo se usa como identificador, siempre con el nombre al lado.'),
            h('li', null, h('strong', null, 'Se descartó el terracota: '), 'se veía más cálido, pero junto a este verde es indistinguible para protanopía (ΔE 1). Tampoco el océano claro: junto al verde casi se confunde en tritanopía (ΔE 3,5).'))),
        h('p', { class: 'suave', style: 'margin-top:.8rem' }, 'Cada color se validó para daltonismo y contraste con una herramienta de paletas antes de usarse.')));

      c.append(seccion('tipografia', 'Tipografía',
        h('p', null, h('strong', null, 'Newsreader'), ' para los títulos, que dan un tono editorial y sereno, y ', h('strong', null, 'Nunito'), ' para la interfaz, la voz que Kinesis y Wisfox ya compartían. Ambas se alojan en el sitio, sin depender de internet (licencia SIL OFL).'),
        h('div', { class: 'tarjeta' },
          h('p', { class: 'tipo tipo--1' }, 'Tejemos caminos para aprender'), h('p', { class: 'dato' }, 'Títulos · Newsreader 700 · 34 a 50 px'),
          h('p', { class: 'tipo tipo--2' }, 'Una clase pensada para todos'), h('p', { class: 'dato' }, 'Subtítulos · Nunito 800 · 22 px'),
          h('p', { class: 'tipo tipo--3' }, 'El docente planea una vez y cada estudiante recibe su camino.'), h('p', { class: 'dato' }, 'Texto · Nunito 400 y 600 · 16 px, interlineado 1,6'))));

      c.append(seccion('formas', 'Formas e íconos',
        h('p', null, 'Un mosaico se arma con teselas. Cada hilo tiene la suya y las tres son de una sola tinta, como el logo. Las dos primeras las conservó cada proyecto; la tercera se diseñó para completar la familia.'),
        h('div', { class: 'rejilla rejilla--3' },
          h('div', { class: 'tarjeta tesela' }, marca('kinesis', 'tesela-marca'), h('h3', null, 'Cuadrado redondeado'), h('p', null, 'Kinesis, el aula. La “K” en movimiento: su brazo superior termina en un punto, el estudiante que avanza.')),
          h('div', { class: 'tarjeta tesela' }, marca('wisfox', 'tesela-marca'), h('h3', null, 'Hexágono'), h('p', null, 'Wisfox, el estudiante. El hexágono con la W que ya tenía.')),
          h('div', { class: 'tarjeta tesela' }, marca('valeria', 'tesela-marca'), h('h3', null, 'Círculo'), h('p', null, 'ValerIA, la guía. Una “V” sencilla, sin chispas ni destellos: la guía no es magia, es acompañamiento.'))),
        h('div', { class: 'tarjeta', style: 'margin-top:1rem' }, h('h3', null, 'Íconos'), h('p', { class: 'suave' }, 'De línea, con un solo trazo redondeado de 2 px y en una sola tinta, como los que ya usaban Kinesis y Wisfox.'),
          h('div', { class: 'iconos-fila' }, ICONOS.map((n) => icono(n))))));

      c.append(seccion('recursos', 'Recursos gráficos',
        h('p', null, 'El telar y el mosaico dan para más que un logo. Estos recursos salen de los dos símbolos y se usan con medida: dan identidad sin cargar la pantalla.'),
        h('div', { class: 'rejilla rejilla--2' },
          h('div', { class: 'tarjeta' }, h('div', { class: 'patron-telar', role: 'img', 'aria-label': 'Patrón de trama de telar' }), h('h3', null, 'Patrón de trama'), h('p', { class: 'suave' }, 'Fondo muy suave para estados vacíos y piezas. Nunca detrás de texto largo.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'patron-mosaico', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5, 6].map((i) => h('span', { class: 'p' + (i % 3) }))), h('h3', null, 'Patrón de teselas'), h('p', { class: 'suave' }, 'Tres formas, tres colores: el mosaico completo. Es una de las pocas veces que los tres colores aparecen juntos.')),
          h('div', { class: 'tarjeta' }, h('hr', { class: 'puntada' }), h('h3', null, 'Divisor de puntada'), h('p', { class: 'suave' }, 'Separa secciones como una costura, en tinta.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'medidor medidor--hilo', role: 'img', 'aria-label': 'Barra de hilo al 66 %' }, h('span', { style: 'width:66%' })), h('h3', null, 'Barra de hilo'), h('p', { class: 'suave' }, 'El progreso se teje: tres colores avanzando juntos.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'cargador-trama', role: 'img', 'aria-label': 'Cargando' }, h('span'), h('span'), h('span')), h('h3', null, 'Cargador'), h('p', { class: 'suave' }, 'Tres hilos subiendo y bajando. Se detiene si la persona pide menos movimiento.')))));

      c.append(seccion('componentes', 'Componentes',
        h('p', null, 'Esquinas moderadas, filete fino y casi sin sombra. El verde marca la acción; todo lo demás es tinta.'),
        h('div', { class: 'tarjeta' }, h('div', { class: 'acciones' }, h('button', { class: 'btn', type: 'button' }, 'Botón principal'), h('button', { class: 'btn btn--suave', type: 'button' }, 'Botón secundario'),
          h('span', { class: 'sello sello--ok' }, 'Aprobado'), h('span', { class: 'sello sello--aviso' }, 'Pendiente'), h('span', { class: 'sello sello--e' }, 'Simulado')))));

      c.append(seccion('voz', 'Voz',
        h('p', null, 'Hablamos como una persona que te cuenta algo con respeto: claro, concreto y sin tecnicismos. Siempre de tú.'),
        h('div', { class: 'rejilla rejilla--2' },
          h('div', { class: 'tarjeta tarjeta--borde' }, h('h3', null, 'Así sí'), h('ul', null,
            h('li', null, '“Tu ajuste espera a orientación.”'), h('li', null, '“Hoy responde con textos de ejemplo.”'), h('li', null, '“Cuando la actividad esté lista te contaremos qué cambió y por qué.”'))),
          h('div', { class: 'tarjeta' }, h('h3', null, 'Así no'), h('ul', null,
            h('li', null, 'Prometer lo que no existe.'), h('li', null, 'Mencionar diagnósticos o etiquetas.'), h('li', null, 'Hablar de “casos” o “problemas” de un estudiante.'))))));
    },
  });
})(window.MT = window.MT || {});
