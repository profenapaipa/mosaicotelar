/* biblioteca.js: los archivos de la plataforma, con quién puede ver cada uno.

   Regla de visibilidad (mínimo privilegio, igual que en Kinesis):
   - "equipo": solo docentes y orientación.
   - "familia": además, la familia del estudiante al que se dirige.
   - "estudiantes": material para los estudiantes.
   - "clinico": información clínica; solo orientación. Docentes, familias, estudiantes y coordinación no la ven.
   Coordinación no ve archivos: administra la estructura, no el contenido. */
(function (MT) {
  'use strict';
  const { h } = MT.ui;
  const st = MT.store;

  const VISIBILIDAD = {
    equipo: ['Equipo docente', 'Solo docentes y orientación'],
    familia: ['Familia', 'La familia del estudiante elegido'],
    estudiantes: ['Estudiantes', 'Material de apoyo para los estudiantes'],
    clinico: ['Clínico', 'Solo orientación'],
  };
  // Qué puede elegir al subir cada rol.
  const SUBE = { docente: ['equipo', 'familia', 'estudiantes'], orientacion: ['equipo', 'familia', 'clinico'] };

  function visible(rol, a, vinculo) {
    if (rol === 'orientacion') return true;
    if (rol === 'docente') return a.visibilidad !== 'clinico';
    if (rol === 'familia') return a.visibilidad === 'familia' && (!a.estudiante || a.estudiante === vinculo);
    if (rol === 'estudiante') return a.visibilidad === 'estudiantes';
    return false;
  }
  const lista = (rol) => MT.db.lista('archivos').filter((a) => visible(rol, a, st.obtener().vinculo)).sort((x, y) => y.fecha.localeCompare(x.fecha));
  const icono = (ext) => ({ pdf: '📕', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', webp: '🖼️', gif: '🖼️', txt: '📄', csv: '📊', xlsx: '📊', docx: '📝', pptx: '📽️', mp3: '🎧', mp4: '🎬' }[ext] || '📎');

  async function ver(a) {
    const u = await MT.archivos.url(a.id);
    if (!u) { MT.dlg.toast('No se pudo abrir el archivo en este navegador.', 'error'); return; }
    if (MT.archivos.esImagen(a.ext)) {
      const img = h('img', { src: u, alt: 'Vista previa de ' + a.nombre, style: 'max-width:100%;height:auto;border-radius:10px' });
      const d = MT.dlg.abrir({ titulo: a.nombre, cuerpo: img });
      d.el.addEventListener('close', () => URL.revokeObjectURL(u));
    } else if (a.ext === 'pdf') { window.open(u, '_blank', 'noopener'); setTimeout(() => URL.revokeObjectURL(u), 60000); }
    else { descargarUrl(u, a.nombre); }
  }
  function descargarUrl(u, nombre) { const l = h('a', { href: u, download: nombre }); document.body.append(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000); }
  async function descargar(a) { const u = await MT.archivos.url(a.id); if (u) descargarUrl(u, a.nombre); }

  /* Monta la biblioteca en un contenedor. opciones: { rol, titulo, ayuda, filtro } */
  function montar(cont, { rol, titulo, ayuda, filtro }) {
    const puede = SUBE[rol] || null;
    const zona = h('div');
    function pintar() {
      const cs = st.obtener();
      let archivos = lista(rol);
      if (filtro) archivos = archivos.filter(filtro);
      const filas = archivos.map((a) => h('li', { class: 'archivo' },
        h('span', { class: 'archivo__icono', 'aria-hidden': 'true' }, icono(a.ext)),
        h('div', { class: 'archivo__datos' }, h('strong', null, a.nombre),
          h('small', null, [MT.archivos.peso(a.tam), new Date(a.fecha).toLocaleDateString('es-CO'), VISIBILIDAD[a.visibilidad][0] + (a.estudiante ? ' · ' + a.estudiante : '')].join(' · '))),
        h('div', { class: 'archivo__acciones' },
          h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => ver(a), 'aria-label': 'Ver ' + a.nombre }, MT.archivos.esImagen(a.ext) || a.ext === 'pdf' ? 'Ver' : 'Descargar'),
          MT.archivos.esImagen(a.ext) || a.ext === 'pdf' ? h('button', { class: 'btn btn--chico btn--suave', type: 'button', onclick: () => descargar(a), 'aria-label': 'Descargar ' + a.nombre }, 'Descargar') : null,
          puede ? h('button', { class: 'btn btn--chico btn--suave', type: 'button', 'aria-label': 'Borrar ' + a.nombre,
            onclick: async () => { if (await MT.dlg.confirmar(`¿Borrar “${a.nombre}”? No se puede deshacer.`, 'Sí, borrar')) { await MT.archivos.borrar(a.id); MT.dlg.toast('Archivo borrado.'); } } }, 'Borrar') : null)));
      // replaceChildren (nativo) convertiría un null en el texto "null": por eso solo se pasan nodos reales.
      zona.replaceChildren(...[
        archivos.length ? h('ul', { class: 'archivos' }, filas) : h('div', { class: 'vacio' }, puede ? 'Todavía no hay archivos. Sube el primero.' : 'Todavía no hay archivos para ti.'),
        MT.archivos.enMemoria() ? h('p', { class: 'aviso', style: 'margin-top:.8rem' }, 'Este navegador no permite guardar archivos de forma permanente: se conservarán mientras esta pestaña esté abierta.') : null,
      ].filter(Boolean));
      resumen.textContent = `${cs.archivos.length} de ${MT.archivos.TOPE} archivos en total.`;
    }
    const resumen = h('p', { class: 'suave', 'aria-live': 'polite' });
    let subida = null;
    if (puede) {
      const visSel = h('select', { id: 'bib-vis', 'aria-label': 'Quién puede verlo' }, puede.map((v) => h('option', { value: v }, VISIBILIDAD[v][0] + ': ' + VISIBILIDAD[v][1])));
      const estSel = h('select', { id: 'bib-est', 'aria-label': 'Estudiante al que se dirige' }, st.obtener().estudiantes.map((e) => h('option', { value: e.id, selected: e.id === st.obtener().vinculo }, e.id)));
      const estCampo = h('div', { class: 'campo', hidden: true }, h('label', { for: 'bib-est' }, 'Estudiante al que se dirige'), estSel);
      visSel.addEventListener('change', () => { estCampo.hidden = !['familia'].includes(visSel.value); });
      const entrada = h('input', { type: 'file', multiple: true, id: 'bib-archivo', accept: MT.archivos.FORMATOS.map((f) => '.' + f).join(',') });
      const msg = h('p', { class: 'suave', 'aria-live': 'polite' });
      const subir = async (files) => {
        let ok = 0;
        for (const f of files) {
          try { await MT.archivos.guardar(f, { visibilidad: visSel.value, estudiante: visSel.value === 'familia' ? estSel.value : '', autor: rol }); ok += 1; }
          catch (e) { MT.dlg.toast(`${f.name}: ${e.message}`, 'error'); }
        }
        if (ok) MT.dlg.toast(ok === 1 ? 'Archivo subido.' : `${ok} archivos subidos.`);
        entrada.value = '';
      };
      entrada.addEventListener('change', () => subir([...entrada.files]));
      const caja = h('div', { class: 'subida', tabindex: '0', role: 'group', 'aria-label': 'Zona para soltar archivos' },
        h('p', null, h('strong', null, 'Suelta aquí tus archivos'), ' o elígelos desde tu equipo.'),
        h('p', { class: 'suave' }, `Formatos: ${MT.archivos.FORMATOS.join(', ')}. Hasta 6 MB cada uno.`));
      ['dragenter', 'dragover'].forEach((ev) => caja.addEventListener(ev, (e) => { e.preventDefault(); caja.classList.add('subida--activa'); }));
      ['dragleave', 'drop'].forEach((ev) => caja.addEventListener(ev, (e) => { e.preventDefault(); caja.classList.remove('subida--activa'); }));
      caja.addEventListener('drop', (e) => subir([...e.dataTransfer.files]));
      subida = h('div', { class: 'tarjeta tarjeta--plana' }, h('div', { class: 'rejilla rejilla--2' }, h('div', { class: 'campo' }, h('label', { for: 'bib-vis' }, 'Quién puede verlo'), visSel), estCampo),
        caja, h('div', { class: 'campo', style: 'margin-top:.8rem' }, h('label', { for: 'bib-archivo' }, 'Elegir archivos'), entrada), msg,
        h('p', { class: 'suave' }, 'Los archivos se guardan solo en este navegador y no se envían a ningún servidor.'));
    }
    const desuscribir = st.suscribir(pintar);
    MT.router.alSalir(desuscribir);
    cont.append(h('div', { class: 'tarjeta' }, h('h1', null, titulo || 'Archivos'), ayuda ? h('p', { class: 'suave' }, ayuda) : null, subida, zona, resumen));
    pintar();
  }

  MT.biblioteca = { montar, visible, lista, VISIBILIDAD, icono };
})(window.MT = window.MT || {});
