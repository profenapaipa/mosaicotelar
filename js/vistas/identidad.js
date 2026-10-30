/* identidad.js: el manual de marca, vivo. Cada muestra se dibuja con los mismos componentes y
   variables de la plataforma, así el manual no puede contradecir a la página: si cambia un color
   en tokens.css, cambia aquí. La versión escrita está en docs/MANUAL_DE_MARCA.md. */
(function (MT) {
  'use strict';
  const { h, marca, lockup } = MT.ui;
  const { pagina } = MT.comun;

  const COLORES = [
    { nombre: 'Verde bosque', hex: '#1B7F56', origen: 'Kinesis: su color de marca. Wisfox usa la misma familia (#3D9960 y #2E7D4F).', uso: 'Color principal de la plataforma y del hilo del aula.' },
    { nombre: 'Ámbar', hex: '#E8A13C', origen: 'Wisfox: su acento y el zorro. Kinesis: sus avisos y el PIAR.', uso: 'Hilo del estudiante, avisos y estados que piden atención. Nunca rojo: un PIAR no es un error.' },
    { nombre: 'Uva', hex: '#6B4FC8', origen: 'Uno de los colores que Kinesis ya ofrecía en su menú de apariencia.', uso: 'Hilo de la guía (ValerIA).' },
    { nombre: 'Tinta', hex: '#23202E', origen: 'Texto y trama del logo sobre fondo claro.', uso: 'Texto principal.' },
    { nombre: 'Papel', hex: '#FAF6EF', origen: 'Fondo cálido que queda entre el menta de Wisfox y el claro de Kinesis.', uso: 'Fondo de las páginas del colectivo.' },
    { nombre: 'Hilo', hex: '#E4DAC6', origen: 'Los hilos neutros del telar.', uso: 'Trama del logo y de los patrones.' },
  ];

  // Contraste WCAG, calculado aquí mismo para que la cifra mostrada sea siempre la real.
  const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const razon = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  const seccion = (id, titulo, ...hijos) => h('section', { class: 'manual-seccion', id, 'aria-labelledby': 'm-' + id }, h('h2', { id: 'm-' + id }, titulo), ...hijos);

  MT.router.registrar({
    id: 'identidad', titulo: 'Identidad de marca', espacio: '',
    render(main) {
      const c = pagina(main, { etiqueta: 'Manual de marca', titulo: 'Mosaico Telar: identidad',
        descripcion: 'Cómo se ve y cómo habla la plataforma. Todo lo que ves aquí está hecho con los mismos componentes que usa el resto del sitio.' });

      c.append(h('nav', { class: 'toc', 'aria-label': 'Contenido del manual' }, h('ul', null,
        [['proposito', 'Propósito'], ['logo', 'Logo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['formas', 'Formas'], ['recursos', 'Recursos'], ['componentes', 'Componentes'], ['voz', 'Voz']]
          .map(([id, t]) => h('li', null, h('a', { href: '#/identidad', onclick: (e) => { e.preventDefault(); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, t))))));

      c.append(seccion('proposito', 'Propósito',
        h('div', { class: 'rejilla rejilla--2' },
          h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Por qué existimos'), h('p', { class: 'manual-grande' }, 'Para que ninguna forma de aprender se quede fuera del aula.')),
          h('div', { class: 'tarjeta tarjeta--borde' }, h('p', { class: 'etiqueta' }, 'Eslogan'), h('p', { class: 'manual-grande' }, 'Tejemos caminos para aprender.'))),
        h('p', null, h('strong', null, 'Qué hacemos: '), 'unimos tres proyectos estudiantiles para que el docente planee una clase inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.'),
        h('p', null, h('strong', null, 'Descriptor: '), 'Colectivo de educación inclusiva con tecnología.'),
        h('div', { class: 'rejilla rejilla--3' }, [['Todos somos mosaico', 'Todos aprendemos distinto, también quienes no tienen un diagnóstico.'], ['Cada hilo es autónomo', 'Se unen sin perder su nombre, su código ni su cara.'], ['Los datos van primero', 'Son menores de edad. Lo que no es necesario, no se pide.'], ['Decimos qué funciona', 'Y qué es simulado. Sin adornos.'], ['Hecho por estudiantes', 'Con revisión de adultos y de otros equipos.']]
          .map(([t, p]) => h('div', { class: 'tarjeta' }, h('h3', null, t), h('p', null, p))))));

      const claro = h('div', { class: 'muestra-logo muestra-logo--claro' }, lockup());
      const oscuro = h('div', { class: 'muestra-logo muestra-logo--oscuro' }, lockup());
      c.append(seccion('logo', 'Logo',
        h('p', null, 'Un telar en su forma más simple: ', h('strong', null, 'tres hilos de color'), ', uno por proyecto, y ', h('strong', null, 'dos pasadas de trama'), ' que los cruzan por encima y por debajo. Los colores son los de las aplicaciones. El logo no lleva ficha ni fondo.'),
        h('div', { class: 'rejilla rejilla--2' }, claro, oscuro),
        h('div', { class: 'rejilla rejilla--3', style: 'margin-top:1rem' },
          h('div', { class: 'tarjeta' }, h('div', { class: 'muestra-simbolo' }, marca('mosaico', 'simbolo-grande')), h('p', { class: 'suave' }, 'Símbolo solo, para íconos y favicon.')),
          h('div', { class: 'tarjeta' }, h('h3', null, 'Cómo se usa'), h('ul', null,
            h('li', null, 'Espacio libre: el ancho de un hilo, por todos los lados.'), h('li', null, 'Tamaño mínimo: 24 px el símbolo; 96 px el logo completo.'), h('li', null, 'Sobre fondo oscuro, la versión clara de los tres colores y la trama en blanco.'))),
          h('div', { class: 'tarjeta' }, h('h3', null, 'Cómo no'), h('ul', null,
            h('li', null, 'No estirarlo ni girarlo.'), h('li', null, 'No cambiar el color de un hilo ni su orden.'), h('li', null, 'No ponerle sombras, degradados ni fichas.'))))));

      c.append(seccion('color', 'Color',
        h('p', null, 'Tres colores de hilo, que ya existían en los proyectos, y tres neutros. Ninguno se inventó para la plataforma.'),
        h('div', { class: 'rejilla rejilla--3' }, COLORES.map((k) => h('div', { class: 'tarjeta muestra-color' },
          h('div', { class: 'muestra-color__tinte', style: `background:${k.hex}` }),
          h('h3', null, k.nombre), h('p', { class: 'dato' }, k.hex), h('p', null, k.uso), h('p', { class: 'suave' }, 'Origen: ' + k.origen),
          h('p', { class: 'suave' }, (() => { const b = razon(k.hex, '#FFFFFF'); const t = razon(k.hex, '#23202E'); return b >= t ? `Texto encima: blanco (${b.toFixed(1)}:1)` : `Texto encima: tinta (${t.toFixed(1)}:1). El blanco no pasa.`; })())))),
        h('p', { class: 'suave', style: 'margin-top:1rem' }, 'Cada espacio conserva la paleta de su proyecto: Kinesis, verde bosque y oscuro por defecto; Wisfox, menta claro con ámbar; ValerIA, uva. El tema oscuro de cada uno también se conserva.')));

      c.append(seccion('tipografia', 'Tipografía',
        h('p', null, h('strong', null, 'Nunito'), ', para todo. Es la tipografía que Kinesis y Wisfox ya usaban; tiene terminaciones redondeadas y sigue siendo amable en pesos altos. Se aloja en el propio sitio, sin depender de internet.'),
        h('div', { class: 'tarjeta' },
          h('p', { class: 'tipo tipo--1' }, 'Tejemos caminos para aprender'), h('p', { class: 'dato' }, 'Título · 900 · 32 a 46 px'),
          h('p', { class: 'tipo tipo--2' }, 'Una clase pensada para todos'), h('p', { class: 'dato' }, 'Subtítulo · 800 · 24 px'),
          h('p', { class: 'tipo tipo--3' }, 'El docente planea una vez y cada estudiante recibe su camino.'), h('p', { class: 'dato' }, 'Texto · 400 y 600 · 16 px, interlineado 1,6'))));

      c.append(seccion('formas', 'Formas',
        h('p', null, 'Un mosaico se arma con teselas. Cada hilo tiene la suya: la conservó de su proyecto y la tercera se diseñó para completar la familia.'),
        h('div', { class: 'rejilla rejilla--3' },
          h('div', { class: 'tarjeta tesela' }, marca('kinesis', 'tesela-marca'), h('h3', null, 'Cuadrado redondeado'), h('p', null, 'Kinesis, el aula. La “K” en movimiento: su brazo superior termina en un punto, el estudiante que avanza.')),
          h('div', { class: 'tarjeta tesela' }, marca('wisfox', 'tesela-marca'), h('h3', null, 'Hexágono'), h('p', null, 'Wisfox, el estudiante. El hexágono con la W que ya tenía.')),
          h('div', { class: 'tarjeta tesela' }, marca('valeria', 'tesela-marca'), h('h3', null, 'Círculo'), h('p', null, 'ValerIA, la guía. Una chispa de cuatro puntas que ilumina el camino.')))));

      c.append(seccion('recursos', 'Recursos gráficos',
        h('p', null, 'El telar y el mosaico dan para mucho más que un logo. Estos recursos salen de los dos símbolos y se usan con medida: dan identidad sin cargar la pantalla.'),
        h('div', { class: 'rejilla rejilla--2' },
          h('div', { class: 'tarjeta' }, h('div', { class: 'patron-telar', role: 'img', 'aria-label': 'Patrón de trama de telar' }), h('h3', null, 'Patrón de trama'), h('p', { class: 'suave' }, 'Fondo suave para portadas y estados vacíos. Nunca detrás de texto largo.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'patron-mosaico', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5, 6].map((i) => h('span', { class: 'p' + (i % 3) }))), h('h3', null, 'Patrón de teselas'), h('p', { class: 'suave' }, 'Tres formas, tres colores: el mosaico completo.')),
          h('div', { class: 'tarjeta' }, h('hr', { class: 'puntada' }), h('h3', null, 'Divisor de puntada'), h('p', { class: 'suave' }, 'Separa secciones como una costura, en vez de una línea seca.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'medidor medidor--hilo', role: 'img', 'aria-label': 'Barra de hilo al 66 %' }, h('span', { style: 'width:66%' })), h('h3', null, 'Barra de hilo'), h('p', { class: 'suave' }, 'El progreso se teje: tres colores avanzando juntos.')),
          h('div', { class: 'tarjeta' }, h('div', { class: 'cargador-trama', role: 'img', 'aria-label': 'Cargando' }, h('span'), h('span'), h('span')), h('h3', null, 'Cargador'), h('p', { class: 'suave' }, 'Tres hilos subiendo y bajando. Se detiene si la persona pide menos movimiento.')))));

      c.append(seccion('componentes', 'Componentes',
        h('p', null, 'Redondeados, de bordes suaves y con el color del espacio donde estén. Un botón es verde en Kinesis, verde menta en Wisfox y uva en ValerIA, sin código nuevo.'),
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
