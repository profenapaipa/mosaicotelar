/* recorrido.js: el ajuste de punta a punta, leído del estado compartido. No cuenta la historia
   en abstracto: marca como hecho solo lo que la persona ya hizo en cada espacio. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const { espacio } = MT.comun;
  const st = MT.store;

  const PASOS = [
    { clave: 'apoyos', titulo: 'El docente ve los apoyos', texto: 'En Kinesis, elige a un estudiante con PIAR y mira sus apoyos, sin diagnóstico.', ir: ['#/kinesis/docente', 'Ir a Kinesis'], sello: 'Funciona hoy' },
    { clave: 'ia', titulo: 'Pide ayuda a ValerIA', texto: 'La asistente propone una actividad con DUA.', ir: ['ia', 'Abrir ValerIA'], sello: 'Simulada hoy' },
    { clave: 'ajuste', titulo: 'Se ajusta al perfil', texto: 'Cada apoyo se vuelve un cambio concreto, con su razón.', ir: ['#/kinesis/docente', 'Ajustar'], sello: 'Simulado: fase 5 de Kinesis' },
    { clave: 'aprobado', titulo: 'Orientación aprueba', texto: 'Nada llega al estudiante sin la validación del equipo de orientación.', ir: ['#/kinesis/orientacion', 'Revisar'], sello: 'Simulado: fase 5 de Kinesis' },
    { clave: 'familia', titulo: 'La familia ve el proceso', texto: 'Se entera mientras ocurre, no en la entrega de notas.', ir: ['#/kinesis/familia', 'Ver'], sello: 'Simulado: fase 6 de Kinesis' },
    { clave: 'estudiante', titulo: 'El estudiante la resuelve', texto: 'En Wisfox recibe la actividad ajustada y completa el quiz.', ir: ['#/wisfox/leccion', 'Ir a Wisfox'], sello: 'Wisfox funciona; el ajuste llega simulado' },
  ];

  MT.router.registrar({
    id: 'recorrido', titulo: 'Recorrido', espacio: '',
    render(main) {
      const hoja = espacio(main, { marca: 'valeria', titulo: 'El ajuste, de punta a punta', ruta: 'recorrido',
        descripcion: 'Sigue el camino de una actividad desde el docente hasta el estudiante. Cada paso se marca cuando lo haces.' });
      const p = st.obtener().pasos;
      const hechos = PASOS.filter((x) => p[x.clave]).length;

      hoja.append(h('div', { class: 'tarjeta tarjeta--borde' },
        h('p', { class: 'etiqueta' }, 'Tu avance'), h('h2', null, `${hechos} de ${PASOS.length} pasos`),
        h('div', { class: 'medidor', role: 'img', 'aria-label': `${hechos} de ${PASOS.length} pasos hechos` }, h('span', { style: `width:${(hechos / PASOS.length) * 100}%` })),
        h('p', { class: 'suave', style: 'margin-top:.6rem' }, 'Todo es con una estudiante ficticia. Lo que ves marcado como simulado se muestra así a propósito.'),
        h('ol', { class: 'recorrido' }, PASOS.map((x, i) => h('li', { class: p[x.clave] ? 'hecho' : '' },
          h('span', { class: 'n', 'aria-hidden': 'true' }, p[x.clave] ? '✓' : String(i + 1)),
          h('div', { class: 'cuerpo' }, h('h3', null, x.titulo, p[x.clave] ? h('span', { class: 'solo-lectores' }, ' (hecho)') : null), h('p', null, x.texto),
            h('span', { class: 'sello sello--e' }, x.sello)),
          x.ir[0] === 'ia'
            ? h('button', { class: 'btn btn--chico', type: 'button', onclick: () => MT.ia.panel.abrir() }, x.ir[1])
            : h('a', { class: 'btn btn--chico', href: x.ir[0] }, x.ir[1])))),
        h('div', { class: 'acciones' }, h('button', { class: 'btn btn--suave', type: 'button', onclick: () => { st.reiniciar(); MT.router.recargar(); } }, 'Empezar de nuevo'))));
    },
  });
})(window.MT = window.MT || {});
