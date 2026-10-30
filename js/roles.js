/* roles.js: quién es cada persona en la plataforma y qué le toca hacer.

   Esta es la respuesta a "entro y no sé qué hacer": en vez de mostrar tres proyectos y que
   cada quien adivine, se pregunta una sola cosa (¿quién eres?) y todo lo demás sale de ahí:
   a dónde ir, qué puedes hacer, qué no, qué recibes, qué entregas y cuál es tu siguiente paso
   según lo que ya hiciste. Los roles son los mismos que ya existen en Kinesis y en Wisfox;
   aquí solo se juntan en un lugar. */
(function (MT) {
  'use strict';

  const lista = [
    {
      id: 'docente', boton: 'Soy docente', nombre: 'Docente', espacio: 'Kinesis', marca: 'kinesis', icono: 'docente', hash: '#/kinesis/docente',
      lema: 'Planeo la clase una vez y la ajusto a cada estudiante.',
      haces: ['Ver los apoyos de cada estudiante, sin diagnóstico', 'Planear con los tres principios del DUA', 'Pedir ideas a ValerIA', 'Enviar un ajuste a orientación'],
      noHaces: ['Ver información clínica', 'Aprobar tu propio ajuste'],
      recibes: 'La decisión de orientación sobre tu ajuste.',
      entregas: 'La actividad y el ajuste que propones.',
    },
    {
      id: 'orientacion', boton: 'Soy de orientación', nombre: 'Orientación', espacio: 'Kinesis', marca: 'kinesis', icono: 'orientacion', hash: '#/kinesis/orientacion',
      lema: 'Reviso y apruebo los ajustes antes de que lleguen al estudiante.',
      haces: ['Revisar los ajustes que propone el docente', 'Aprobarlos o devolverlos con una nota'],
      noHaces: ['Cambiar la actividad del docente'],
      recibes: 'Los ajustes propuestos por los docentes.',
      entregas: 'La aprobación, o la devolución con una nota.',
    },
    {
      id: 'familia', boton: 'Soy familia', nombre: 'Familia', espacio: 'Kinesis', marca: 'kinesis', icono: 'familia', hash: '#/kinesis/familia',
      lema: 'Veo qué se hace en clase para que mi hijo o hija aprenda a su manera.',
      haces: ['Ver el proceso mientras ocurre', 'Leer el mensaje para casa'],
      noHaces: ['Ver información clínica', 'Cambiar ajustes'],
      recibes: 'Las novedades, ya aprobadas por orientación.',
      entregas: 'Nada: solo mira y acompaña.',
    },
    {
      id: 'estudiante', boton: 'Soy estudiante', nombre: 'Estudiante', espacio: 'Wisfox', marca: 'wisfox', icono: 'libro', hash: '#/wisfox/inicio',
      lema: 'Aprendo a mi ritmo, con la actividad hecha a mi medida.',
      haces: ['Hacer la actividad que le llegó', 'Responder el quiz y jugar', 'Preguntarle a ValerIA'],
      noHaces: ['Ver los ajustes ni los perfiles de otros'],
      recibes: 'La actividad ya aprobada y a tu medida.',
      entregas: 'Tu progreso: puntos, quiz y logros.',
    },
  ];

  const por = (id) => lista.find((r) => r.id === id);

  /* Qué hacer ahora, según el rol y lo que ya pasó. Siempre devuelve UNA cosa: la más útil. */
  function siguiente(id, s) {
    const aj = s.ajuste;
    const w = s.wisfox;
    if (id === 'docente') {
      if (!s.pasos.apoyos) return { titulo: 'Mira los apoyos de un estudiante', texto: 'Empieza por entender qué le sirve a P-03.', hash: '#/kinesis/docente', boton: 'Ir a Kinesis' };
      if (aj.estado === 'ninguno') return { titulo: 'Ajusta la actividad a un estudiante', texto: 'Cada apoyo se vuelve un cambio concreto. Puedes pedirle ideas a ValerIA primero.', hash: '#/kinesis/docente', boton: 'Hacer el ajuste' };
      if (aj.estado === 'propuesto') return { titulo: 'Tu ajuste espera a orientación', texto: 'Mientras tanto, puedes planear otra actividad o preguntarle a ValerIA.', hash: '#/valeria/chat', boton: 'Hablar con ValerIA' };
      if (aj.estado === 'devuelto') return { titulo: 'Orientación devolvió tu ajuste', texto: aj.nota ? 'Dice: ' + aj.nota : 'Revísalo y vuelve a enviarlo.', hash: '#/kinesis/docente', boton: 'Revisarlo' };
      return { titulo: 'Tu ajuste ya llegó al estudiante', texto: 'Aprobado. Mira cómo lo recibe en Wisfox.', hash: '#/wisfox/leccion', boton: 'Verlo en Wisfox' };
    }
    if (id === 'orientacion') {
      if (aj.estado === 'ninguno') return { titulo: 'No hay ajustes pendientes', texto: 'Cuando un docente envíe uno, aparecerá aquí. Puedes ver cómo se hace desde Docente.', hash: '#/kinesis/docente', boton: 'Ver el lado del docente' };
      if (aj.estado === 'propuesto') return { titulo: 'Hay un ajuste por revisar', texto: 'El docente propone y tú validas. Nada llega al estudiante sin tu aprobación.', hash: '#/kinesis/orientacion', boton: 'Revisarlo' };
      return { titulo: 'Todo al día', texto: aj.estado === 'aprobado' ? 'Aprobaste el ajuste y ya está en Wisfox.' : 'Devolviste el ajuste al docente.', hash: '#/kinesis/orientacion', boton: 'Ver el ajuste' };
    }
    if (id === 'familia') {
      if (aj.estado === 'aprobado') return { titulo: 'Hay novedades para ti', texto: 'El colegio aprobó los ajustes de la actividad. Mira qué cambió y por qué.', hash: '#/kinesis/familia', boton: 'Ver novedades' };
      return { titulo: 'Todavía no hay novedades', texto: 'Cuando el docente prepare una actividad con apoyos y orientación la apruebe, te contaremos aquí.', hash: '#/kinesis/familia', boton: 'Ir a mi vista' };
    }
    if (id === 'estudiante') {
      if (!w.leccion) return { titulo: 'Empieza por la lección', texto: aj.estado === 'aprobado' ? 'Tu actividad ya está lista y quedó a tu medida.' : 'Hoy repasamos el present simple.', hash: '#/wisfox/leccion', boton: 'Ir a la lección' };
      if (!w.quiz) return { titulo: 'Pon a prueba lo que aprendiste', texto: 'Cuatro preguntas cortas.', hash: '#/wisfox/leccion', boton: 'Hacer el quiz' };
      if (!w.ordena) return { titulo: 'Juega a ordenar una frase', texto: 'Un reto corto que suma puntos.', hash: '#/wisfox/juego', boton: 'Jugar' };
      return { titulo: 'Completaste todo por hoy', texto: 'Mira tus logros o pregúntale a ValerIA lo que quieras repasar.', hash: '#/wisfox/logros', boton: 'Ver mis logros' };
    }
    return { titulo: 'Elige tu rol', texto: 'Así sabemos qué mostrarte primero.', hash: '#/', boton: 'Elegir' };
  }

  /* Qué ve y qué hace cada rol con cada dato. Es la regla de la plataforma; la demostración usa solo datos ficticios. */
  const COLUMNAS = ['Docente', 'Orientación', 'Familia', 'Estudiante', 'ValerIA'];
  const MATRIZ = [
    { dato: 'Información clínica', celdas: ['No ve', 'Ve, con permiso', 'No ve', 'No ve', 'Nunca la recibe'], nota: 'Vive aislada en Kinesis. Es lo más protegido.' },
    { dato: 'Apoyos y fortalezas', celdas: ['Ve', 'Ve', 'Ve, en lenguaje sencillo', 'Ve su plan', 'Solo un perfil anónimo'], nota: 'Es lo que el docente necesita para ajustar la clase.' },
    { dato: 'Actividad planeada', celdas: ['Crea', 'Ve', 'Ve el tema', 'Ve la suya', 'Propone ideas'], nota: 'El docente decide; ValerIA solo propone.' },
    { dato: 'Ajuste propuesto', celdas: ['Crea', 'Revisa', 'Ve cuando se aprueba', 'Recibe el ajustado', 'Ayuda a redactarlo'], nota: 'No llega a nadie sin la aprobación de orientación.' },
    { dato: 'Aprobación', celdas: ['Ve el resultado', 'Decide', 'Ve el resultado', 'No ve', 'No participa'], nota: 'La única decisión que desbloquea el paso siguiente.' },
    { dato: 'Progreso del estudiante', celdas: ['Ve el resumen', 'Ve', 'Ve', 'Lo genera', 'No lo ve'], nota: 'Puntos, quiz y logros de Wisfox.' },
  ];

  MT.roles = { lista, por, siguiente, COLUMNAS, MATRIZ };
})(window.MT = window.MT || {});
