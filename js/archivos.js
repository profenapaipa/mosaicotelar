/* archivos.js: los archivos que suben las personas, guardados en este mismo navegador (IndexedDB).

   Por qué así: la plataforma no tiene servidor, así que nada sale del dispositivo. Eso protege la información
   de los estudiantes, y se le dice a la persona en pantalla. Los metadatos (nombre, quién lo ve) viven en el
   estado compartido; el contenido, en IndexedDB. Si el navegador no permite IndexedDB (modo privado), se
   guardan en memoria y se avisa: duran mientras la pestaña esté abierta.

   Qué se valida antes de aceptar un archivo (nunca se confía en lo que diga el navegador):
   - formato por lista cerrada de extensiones, y que la firma de los primeros bytes coincida en PDF e imágenes;
   - tamaño máximo de 6 MB y un tope de 40 archivos;
   - el nombre se limpia de caracteres de ruta y de control, y siempre se muestra como texto, nunca como HTML. */
(function (MT) {
  'use strict';
  const BD = 'mosaicotelar-archivos';
  const TABLA = 'contenido';
  const FORMATOS = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'txt', 'csv', 'docx', 'xlsx', 'pptx', 'mp3', 'mp4'];
  const MAXIMO = 6 * 1024 * 1024;
  const TOPE = 40;
  const FIRMAS = { pdf: [[0x25, 0x50, 0x44, 0x46]], png: [[0x89, 0x50, 0x4E, 0x47]], jpg: [[0xFF, 0xD8, 0xFF]], jpeg: [[0xFF, 0xD8, 0xFF]], gif: [[0x47, 0x49, 0x46, 0x38]], webp: [[0x52, 0x49, 0x46, 0x46]] };

  let bd = null;
  let enMemoria = false;
  const memoria = new Map();

  const listo = new Promise((res) => {
    try {
      const r = indexedDB.open(BD, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(TABLA);
      r.onsuccess = () => { bd = r.result; res(); };
      r.onerror = () => { enMemoria = true; res(); };
    } catch (e) { enMemoria = true; res(); }
  });

  const tx = (modo, fn) => new Promise((res, rej) => { const t = bd.transaction(TABLA, modo); const out = fn(t.objectStore(TABLA)); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); });
  async function poner(id, blob) { await listo; if (!bd) { memoria.set(id, blob); return; } await tx('readwrite', (s) => s.put(blob, id)); }
  async function leer(id) { await listo; if (!bd) return memoria.get(id) || null; return new Promise((res) => { const r = bd.transaction(TABLA).objectStore(TABLA).get(id); r.onsuccess = () => res(r.result || null); r.onerror = () => res(null); }); }
  async function quitar(id) { await listo; if (!bd) { memoria.delete(id); return; } await tx('readwrite', (s) => s.delete(id)); }

  const extension = (nombre) => (nombre.split('.').pop() || '').toLowerCase();
  const limpiarNombre = (n) => n.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || 'archivo';

  async function validar(archivo) {
    const ext = extension(archivo.name);
    if (!FORMATOS.includes(ext)) return `El formato .${ext || '?'} no se admite. Usa ${FORMATOS.map((f) => '.' + f).join(', ')}.`;
    if (archivo.size === 0) return 'El archivo está vacío.';
    if (archivo.size > MAXIMO) return 'El archivo pesa más de 6 MB.';
    if (FIRMAS[ext]) {
      const inicio = new Uint8Array(await archivo.slice(0, 8).arrayBuffer());
      if (!FIRMAS[ext].some((f) => f.every((b, i) => inicio[i] === b))) return `El contenido no corresponde a un archivo .${ext}.`;
    }
    return null;
  }

  async function guardar(archivo, meta) {
    const error = await validar(archivo);
    if (error) throw new Error(error);
    if (MT.db.lista('archivos').length >= TOPE) throw new Error('Se alcanzó el límite de 40 archivos. Borra alguno para subir otro.');
    const reg = MT.db.crear('archivos', Object.assign({ nombre: limpiarNombre(archivo.name), ext: extension(archivo.name), tam: archivo.size, fecha: new Date().toISOString() }, meta));
    await poner(reg.id, archivo);
    return reg;
  }

  async function url(id) { const b = await leer(id); return b ? URL.createObjectURL(b) : null; }
  // Al volver a los datos de ejemplo también se vacía el contenido guardado, para no dejar archivos huérfanos.
  async function vaciar() {
    await listo;
    memoria.clear();
    if (bd) await tx('readwrite', (s) => s.clear());
  }
  async function borrar(id) { await quitar(id); MT.db.borrar('archivos', id); }

  const peso = (n) => (n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(0) + ' KB' : (n / 1048576).toFixed(1) + ' MB');

  MT.archivos = { validar, guardar, url, borrar, vaciar, peso, FORMATOS, MAXIMO, TOPE, enMemoria: () => enMemoria, esImagen: (ext) => ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) };
})(window.MT = window.MT || {});
