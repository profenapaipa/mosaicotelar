/* store.js: el único lugar donde vive el estado compartido de los tres espacios.

   Por qué existe: lo que hace el docente en Kinesis tiene que aparecer en Orientación, en
   Familia y en Wisfox sin que nadie copie nada. Un solo estado, guardado en el navegador de
   quien prueba (localStorage), con datos ficticios. Si el almacenamiento falla (modo privado,
   sitio bloqueado), todo sigue funcionando en memoria. */
(function (MT) {
  'use strict';
  const CLAVE = 'mosaicotelar.v1';

  function inicial() {
    return {
      estudiante: 'P-03',
      plan: { asignatura: 'Inglés', tema: 'Present simple: mi rutina del día', dua: { repr: [], accion: [], compromiso: [] } },
      actividad: '',
      // estado: ninguno | propuesto | aprobado | devuelto
      ajuste: { estado: 'ninguno', estudiante: '', items: [], hora: '', nota: '' },
      wisfox: { xp: 0, logros: [], leccion: false, quiz: null, ordena: false },
      pasos: { apoyos: false, ia: false, ajuste: false, aprobado: false, familia: false, estudiante: false },
      eventos: [],
      ia: [],
    };
  }

  function cargar() {
    try {
      const crudo = window.localStorage.getItem(CLAVE);
      if (crudo) {
        const guardado = JSON.parse(crudo);
        const base = inicial();
        // Mezcla nivel a nivel: si una versión nueva agrega un campo, no se pierde el estado viejo.
        for (const k of Object.keys(base)) {
          if (guardado[k] === undefined) continue;
          base[k] = (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]))
            ? Object.assign(base[k], guardado[k]) : guardado[k];
        }
        return base;
      }
    } catch (e) { /* almacenamiento no disponible: se sigue en memoria */ }
    return inicial();
  }

  let estado = cargar();
  const oyentes = new Set();

  function guardar() {
    try { window.localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* idem */ }
  }
  function avisar() { oyentes.forEach((f) => { try { f(estado); } catch (e) { console.error(e); } }); }

  MT.store = {
    obtener: () => estado,
    cambiar(fn) { fn(estado); guardar(); avisar(); },
    suscribir(f) { oyentes.add(f); return () => oyentes.delete(f); },
    reiniciar() { estado = inicial(); guardar(); avisar(); },
    // Anota algo en la historia. Solo lo marcado para la familia aparece en su vista.
    evento(texto, paraFamilia) {
      estado.eventos.push({ t: new Date().toISOString(), texto, familia: !!paraFamilia });
      if (estado.eventos.length > 50) estado.eventos.shift();
    },
    logro(id) {
      if (!estado.wisfox.logros.includes(id)) estado.wisfox.logros.push(id);
    },
  };
})(window.MT = window.MT || {});
