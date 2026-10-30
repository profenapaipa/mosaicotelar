/* datos.js: todo lo que se muestra es ficticio.

   Los estudiantes son códigos (P-01 a P-10), sin nombres, y el diagnóstico nunca aparece:
   el docente solo ve los apoyos, igual que en Kinesis. La separación es deliberada, porque
   la información clínica queda aislada y esta página es pública. */
(function (MT) {
  'use strict';

  const estudiantes = [
    { id: 'P-01', piar: false },
    { id: 'P-02', piar: true, apoyos: ['Descansos activos cada 15 minutos', 'Instrucciones orales y escritas'], fortalezas: ['Explica con ejemplos propios'] },
    { id: 'P-03', piar: true,
      apoyos: ['Instrucciones en pasos cortos y numerados', 'Apoyo visual junto al texto', 'Tiempo adicional del 50 %', 'Evitar leer en voz alta frente al curso', 'Una sola tarea a la vez'],
      fortalezas: ['Aprende muy bien con imágenes', 'Trabaja con entusiasmo en pareja'] },
    { id: 'P-04', piar: false }, { id: 'P-05', piar: false }, { id: 'P-06', piar: false },
    { id: 'P-07', piar: true, apoyos: ['Vocabulario de apoyo', 'Tiempo adicional del 25 %'], fortalezas: ['Buena memoria para el vocabulario nuevo'] },
    { id: 'P-08', piar: false }, { id: 'P-09', piar: false }, { id: 'P-10', piar: false },
  ];

  const asignaturas = ['Inglés', 'Matemáticas', 'Ciencias naturales', 'Ciencias sociales', 'Lengua castellana'];

  // Los tres principios del Diseño Universal para el Aprendizaje (DUA).
  const dua = [
    { id: 'repr', titulo: 'Múltiples formas de representación', principio: 'El “qué” del aprendizaje',
      opciones: ['Imágenes junto al texto', 'Instrucciones en pasos numerados', 'Un ejemplo resuelto antes de la tarea'] },
    { id: 'accion', titulo: 'Múltiples formas de acción y expresión', principio: 'El “cómo” del aprendizaje',
      opciones: ['Responder escribiendo, dibujando o hablando', 'Elegir el formato de entrega', 'Trabajar en parejas'] },
    { id: 'compromiso', titulo: 'Múltiples formas de compromiso', principio: 'El “por qué” del aprendizaje',
      opciones: ['Elegir el contexto de la tarea', 'Metas cortas con retroalimentación', 'Compartir en pareja y no frente al curso'] },
  ];

  /* Cada apoyo del perfil produce un cambio concreto con su razón. Es lógica sencilla a propósito:
     la fase 5 de Kinesis (ajustes individuales) todavía no existe, y esto la representa sin simular
     más de lo que hay. */
  const reglasAjuste = [
    { coincide: /pasos cortos/i, crear: () => ({ cambio: 'Las instrucciones pasan de un párrafo a pasos cortos y numerados, uno por tarjeta.', porque: 'Su perfil indica que le funcionan los pasos cortos.' }) },
    { coincide: /visual/i, crear: () => ({ cambio: 'Cada verbo lleva una imagen y un color.', porque: 'El apoyo visual junto al texto le ayuda a entender sin depender solo de la lectura.' }) },
    { coincide: /tiempo adicional/i, crear: (a) => { const p = (a.match(/(\d+)/) || [0, 50])[1]; return { cambio: `El desarrollo pasa de 12 a ${Math.round(12 * (1 + p / 100))} minutos.`, porque: `Tiene tiempo adicional del ${p} % en su perfil.` }; } },
    { coincide: /voz alta/i, crear: () => ({ cambio: 'Comparte su oración con una compañera y el docente la escucha aparte.', porque: 'Evita la lectura en voz alta frente al curso.' }) },
    { coincide: /una sola tarea/i, crear: () => ({ cambio: 'Las tarjetas se entregan de una en una.', porque: 'Su perfil pide una sola tarea a la vez.' }) },
    { coincide: /descansos/i, crear: () => ({ cambio: 'Se agrega una pausa activa de dos minutos a mitad de la actividad.', porque: 'Sus apoyos incluyen descansos activos.' }) },
    { coincide: /orales y escritas/i, crear: () => ({ cambio: 'Cada instrucción se dice en voz alta y también se escribe.', porque: 'Le sirve recibir la instrucción por dos canales.' }) },
    { coincide: /vocabulario/i, crear: () => ({ cambio: 'Se agrega un banco de palabras con su significado al lado.', porque: 'Su perfil pide vocabulario de apoyo.' }) },
  ];

  function generarAjuste(est) {
    const items = [];
    for (const apoyo of est.apoyos || []) {
      const regla = reglasAjuste.find((r) => r.coincide.test(apoyo));
      if (regla) items.push(regla.crear(apoyo));
    }
    return items;
  }

  const leccion = {
    tarjetas: [
      { icono: '🌅', titulo: 'I, you, we, they', texto: 'El verbo queda igual.', ejemplo: 'I eat breakfast.' },
      { icono: '🍳', titulo: 'He, she, it', texto: 'El verbo lleva -s.', ejemplo: 'She eats breakfast.' },
      { icono: '🚌', titulo: 'Para qué sirve', texto: 'Para contar lo que hacemos siempre: nuestra rutina.', ejemplo: 'My brother takes the bus.' },
    ],
    // La versión ajustada: mismos contenidos, pasos cortos con imagen (llega cuando Orientación aprueba).
    pasosAjustados: [
      { icono: '🖼️', texto: 'Mira las imágenes de la rutina.' },
      { icono: '🔗', texto: 'Une cada imagen con su verbo.' },
      { icono: '🗣️', texto: 'Cuéntale tu rutina a una compañera.' },
    ],
    quiz: [
      { q: 'She ___ breakfast at seven.', o: ['eat', 'eats', 'eating', 'eated'], a: 1 },
      { q: 'Con “I”, “you”, “we” y “they”, el verbo…', o: ['lleva -ing', 'lleva -s', 'queda igual', 'cambia a pasado'], a: 2 },
      { q: 'My brother ___ the bus to school.', o: ['takes', 'take', 'taking', 'is take'], a: 0 },
      { q: 'Elige la oración correcta:', o: ['He wake up early.', 'He waking up early.', 'He wakes up early.', 'He wakes ups early.'], a: 2 },
    ],
    ordena: { frase: ['She', 'eats', 'breakfast', 'at', 'seven'], mezcla: ['at', 'breakfast', 'She', 'seven', 'eats'] },
  };

  const logros = [
    { id: 'leccion', nombre: 'Primera lección', icono: '📘' },
    { id: 'quiz', nombre: 'Quiz completo', icono: '🏅' },
    { id: 'ordena', nombre: 'Frase ordenada', icono: '🧩' },
    { id: 'ia', nombre: 'Preguntó a ValerIA', icono: '✨' },
    { id: 'adaptada', nombre: 'Actividad a mi medida', icono: '🧵' },
  ];

  // Respuestas de ejemplo de ValerIA mientras no haya un modelo conectado.
  const respuestasIA = {
    disenar: '**Actividad de 20 minutos: mi rutina del día (present simple)**\n\n**Inicio (4 min).** Muestra tres imágenes de una rutina y pregunta: “¿Qué hace esta persona primero?”. Responden en voz alta, en parejas o señalando.\n\n**Desarrollo (12 min).** Cada estudiante arma su rutina con tarjetas: imagen, verbo y hora. Elige cómo mostrarla: escribiéndola, dibujándola con rótulos o grabando un audio corto.\n\n**Cierre (4 min).** Cada pareja comparte una oración. El docente señala la regla: con he, she, it el verbo lleva -s.\n\nPor qué sirve al DUA: hay varias formas de representar (imagen y texto), de expresar (escribir, dibujar o hablar) y de motivar (elegir y compartir en pareja).',
    ajustar: '**Ajustes propuestos**\n\nCada apoyo del perfil se convierte en un cambio concreto, y cada cambio dice por qué. El docente puede aceptar, cambiar o quitar cualquiera antes de que pase a orientación.',
    ayuda: 'Buena pregunta. La idea es esta:\n\n- Con **I, you, we, they** el verbo queda igual: *I eat breakfast.*\n- Con **he, she, it** el verbo lleva **-s**: *She eats breakfast.*\n\nLa -s aparece solo cuando hablas de una tercera persona, alguien de quien cuentas algo.\n\n**Pruébalo tú:** ¿cómo dirías “mi hermano toma el bus”? Empieza con “My brother…” y dime qué le pasa al verbo.',
    general: 'Estoy en **modo de ejemplo**: todavía no estoy conectada a un modelo de lenguaje, así que respondo con textos preparados. Puedes pedirme **diseñar una actividad**, **ajustarla a un perfil** o **explicarte la -s del present simple**.',
  };

  MT.datos = { curso: '8.°-A', estudiantes, asignaturas, dua, generarAjuste, leccion, logros, respuestasIA };
})(window.MT = window.MT || {});
