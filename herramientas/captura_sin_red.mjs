// captura_sin_red.mjs: prueba el funcionamiento sin conexión con Chrome de verdad, y deja capturas.
//
//   node herramientas/captura_sin_red.mjs [carpeta-de-capturas]
//
// Por qué existe: un service worker no se prueba leyendo su código. Hay que dejarlo instalar con red, cortar la red y ver que la
// página abre. Eso es lo que hace este script, con Chrome sin pantalla y el protocolo de depuración (Node 22 o más, sin dependencias):
//   1. Sirve esta carpeta por http en 127.0.0.1 (un service worker necesita http o https, no file://).
//   2. Abre la página CON red y espera a que el worker guarde la cáscara.
//   3. Corta la red de verdad (apaga el servidor y pone el navegador en modo sin conexión) y recarga.
//   4. Comprueba que la página abre, el aviso se ve, los portales de Kinesis y Wisfox muestran su respaldo y el modo presentación y
//      la versión calmada funcionan; y que todo se alcanza con Tab. Deja capturas de 1920x1080, 1280x720 y 390 px.
//   5. Abre index.html desde el disco (file://), donde no hay service worker: debe degradar sin errores.
// Sale con código 1 si algo falla.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.resolve(process.argv[2] || path.join(RAIZ, 'capturas-sin-red'));
const CHROME = process.env.CHROME || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((r) => fs.existsSync(r));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const resultados = [];
const comprobar = (nombre, ok, detalle) => { resultados.push({ nombre, ok: !!ok }); console.log((ok ? '  bien  ' : '  FALLA ') + nombre + (ok ? '' : ' | ' + (detalle ?? ''))); };

if (!CHROME) { console.error('No encontré Chrome. Indica su ruta en la variable CHROME.'); process.exit(1); }
fs.mkdirSync(SALIDA, { recursive: true });

// ---- servidor estático mínimo ----
const servidor = http.createServer((req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let archivo = path.join(RAIZ, ruta.endsWith('/') ? ruta + 'index.html' : ruta);
  if (!archivo.startsWith(RAIZ) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) { res.writeHead(404); res.end('no existe'); return; }
  const dato = fs.readFileSync(archivo);
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache', ETag: '"' + dato.length + '-' + fs.statSync(archivo).mtimeMs + '"' });
  res.end(dato);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const PUERTO_WEB = servidor.address().port;
const BASE = `http://127.0.0.1:${PUERTO_WEB}/`;

// ---- Chrome ----
const PUERTO_CDP = 9444 + Math.floor(Math.random() * 300);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'mt-sinred-'));
const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PUERTO_CDP}`, `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });
let ws;
for (let i = 0; i < 80 && !ws; i++) {
  try { const t = (await (await fetch(`http://127.0.0.1:${PUERTO_CDP}/json`)).json()).find((x) => x.type === 'page'); ws = t && t.webSocketDebuggerUrl; } catch { /* aún no */ }
  if (!ws) await espera(250);
}
if (!ws) { console.error('Chrome no abrió el puerto de depuración'); process.exit(1); }
const sock = new WebSocket(ws); await new Promise((r) => { sock.onopen = r; });
let nid = 0; const pend = new Map();
sock.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const cdp = (method, params = {}) => new Promise((res) => { const i = ++nid; pend.set(i, res); sock.send(JSON.stringify({ id: i, method, params })); });
const evaluar = async (expr) => { const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const vista = (a, h) => cdp('Emulation.setDeviceMetricsOverride', { width: a, height: h, deviceScaleFactor: 1, mobile: a < 500 });
// Navega y espera a que la pantalla esté pintada (hay un título); guarda cuánto tardó, para ver si abrir sin red es rápido.
let ultimaCarga = 0;
async function ir(url, ms = 1500) {
  const t0 = Date.now();
  await evaluar('window.__viejo = 1');
  await cdp('Page.navigate', { url });
  for (let i = 0; i < 48; i++) {
    await espera(125);
    if (await evaluar(`(!window.__viejo || location.hash !== '') && document.readyState === 'complete' && !!window.MT && !!MT.router && !!document.querySelector('main h1, main [role=heading]')`)) break;
  }
  ultimaCarga = Date.now() - t0;
  await espera(ms);
}
// Cambiar solo el #hash no recarga la página: cuando lo que se prueba depende de lo guardado en el navegador hay que recargar.
async function recargar(url, ms = 1200) {
  await ir(url, 300);
  await evaluar('window.__viejo = 1');
  await cdp('Page.reload');
  // Se espera a que sea de verdad la página nueva (la marca __viejo desaparece) y a que el router haya pintado.
  for (let i = 0; i < 40; i++) { await espera(250); if (await evaluar(`!window.__viejo && document.readyState === 'complete' && !!window.MT && !!MT.router && !!document.querySelector('main h1, main [role=heading]')`)) break; }
  await espera(ms);
}
async function foto(nombre) {
  const r = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SALIDA, nombre + '.png'), Buffer.from(r.result.data, 'base64'));
}
const TAMANOS = [[1920, 1080, '1920x1080'], [1280, 720, '1280x720'], [390, 844, '390']];
async function fotos(base) { for (const [a, h, e] of TAMANOS) { await vista(a, h); await espera(500); await foto(`${base}-${e}`); } }
const hash = async (h, ms = 1000) => { await evaluar(`location.hash = ${JSON.stringify(h)}`); await espera(ms); };
await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');

async function pulsarTab(n) {
  for (let i = 0; i < n; i++) {
    await cdp('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  }
}
// Recorre la página con la tecla Tab y dice cuántos controles visibles se alcanzaron de los que hay.
async function alcanceTeclado() {
  const total = await evaluar(`(() => { let n = 0; document.querySelectorAll('a[href], button, input, select, textarea, summary').forEach((x) => { const r = x.getBoundingClientRect(); const cs = getComputedStyle(x); const d = x.closest('details:not([open])'); const enCerrado = d && !(x.tagName === 'SUMMARY' && x.parentElement === d);
    if (r.width && r.height && !x.disabled && cs.visibility !== 'hidden' && !enCerrado) { x.dataset.k = String(++n); } else delete x.dataset.k; }); window.__tocados = new Set(); document.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.k) window.__tocados.add(e.target.dataset.k); }); document.activeElement && document.activeElement.blur(); return n; })()`);
  await pulsarTab(total + 6);
  const tocados = await evaluar('window.__tocados.size');
  const sin = await evaluar(`[...document.querySelectorAll('[data-k]')].filter((x) => !window.__tocados.has(x.dataset.k)).map((x) => x.tagName + '.' + x.className + ' ' + (x.textContent || '').trim().slice(0, 24)).slice(0, 5)`);
  return { total, tocados, sin };
}
const estadoPagina = () => evaluar(`JSON.stringify({ h1: document.querySelectorAll('main h1').length + [...document.querySelectorAll('main [role=heading][aria-level="1"]')].filter((x) => x.getClientRects().length).length, errores: window.__errores || [], mt: typeof MT, controlado: !!(navigator.serviceWorker && navigator.serviceWorker.controller), enLinea: navigator.onLine, aviso: (document.querySelector('.aviso-conexion:not([hidden])') || {}).innerText || '', respaldo: ([...document.querySelectorAll('.vivo-respaldo')].find((x) => x.getClientRects().length) || {}).innerText || '', presentacion: document.documentElement.dataset.presentacion || '', calmado: document.documentElement.dataset.movimiento || '' })`).then(JSON.parse);

let fallo = false;
try {
  /* ============ 1. Con red: el worker guarda la cáscara ============ */
  console.log('\n1. Con red: instalar el service worker');
  await vista(1280, 720);
  await ir(BASE + 'index.html#/', 2500);
  const listo = await evaluar(`navigator.serviceWorker.ready.then((r) => !!r.active)`);
  comprobar('el service worker se registra y se activa', listo);
  await espera(1500);
  const guardados = await evaluar(`caches.keys().then(async (k) => JSON.stringify({ nombres: k, n: k.length ? (await (await caches.open(k[0])).keys()).length : 0 }))`).then(JSON.parse);
  comprobar('la caché guarda la cáscara (más de 60 archivos)', guardados.n > 60 && guardados.nombres.every((x) => x.startsWith('mosaicotelar-')), JSON.stringify(guardados));
  await foto('00-con-red-1280x720');

  /* ============ 2. Sin red: se corta de verdad ============ */
  console.log('\n2. Sin red: servidor apagado y navegador sin conexión');
  await new Promise((r) => { servidor.closeAllConnections?.(); servidor.close(r); });
  await cdp('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await ir(BASE + 'index.html#/', 2500);
  let e = await estadoPagina();
  comprobar('la página abre sin red, con la pantalla de inicio y un solo título', e.mt === 'object' && e.h1 === 1, JSON.stringify(e));
  console.log(`        (abrir sin red tardó ${ultimaCarga} ms hasta pintar el título)`);
  comprobar('la sirve el service worker (la página está controlada)', e.controlado);
  comprobar('sin errores de ejecución al abrir sin red', e.errores.length === 0, e.errores.join(' | '));
  comprobar('el aviso de "sin conexión" se ve y dice qué sigue funcionando', /Sin conexión/.test(e.aviso) && /sigue funcionando/.test(e.aviso), e.aviso);
  comprobar('el texto de la página no tiene undefined, null ni NaN', !(await evaluar(`/\\bundefined\\b|\\bNaN\\b|\\bnull\\b/.test(document.body.innerText)`)));
  await fotos('01-inicio-sin-red');

  // La entrada por la carpeta y con parámetros también debe abrir (la gente escribe la dirección sin index.html)
  await ir(BASE + '?x=1#/mapa/conexiones', 2000);
  e = await estadoPagina();
  comprobar('entrar por la carpeta y con ?parámetros, sin red, también abre', e.mt === 'object' && e.h1 === 1 && e.errores.length === 0, JSON.stringify(e));

  for (const [portal, nombre] of [['kinesis', 'Kinesis'], ['wisfox', 'Wisfox']]) {
    await vista(1280, 720);
    await ir(BASE + 'index.html#/portales/' + portal, 2500);
    e = await estadoPagina();
    comprobar(`${nombre} sin red: el respaldo reemplaza al portal, no hay recuadro vacío`, new RegExp(`${nombre} no se puede abrir ahora`).test(e.respaldo) && /Mi espacio/.test(e.respaldo) && e.errores.length === 0, e.respaldo + ' ' + e.errores.join('|'));
    comprobar(`${nombre} sin red: no hay ningún marco (iframe) intentando cargar`, !(await evaluar(`!!document.querySelector('.vivo-panel[data-portal="${portal}"] iframe')`)));
    comprobar(`${nombre} sin red: un solo título de nivel 1`, e.h1 === 1, String(e.h1));
    await fotos(`02-${portal}-respaldo-sin-red`);
    const pasa = await evaluar(`(() => { const b = [...document.querySelectorAll('.vivo-respaldo button')].find((x) => /en Mi espacio/.test(x.textContent)); if (b) b.click(); return !!b; })()`);
    await espera(900);
    comprobar(`${nombre} sin red: "Ver ${nombre} en Mi espacio" abre la versión equivalente`, pasa && /^#\/mi/.test(await evaluar('location.hash')) && (await estadoPagina()).h1 === 1);
  }
  await vista(1280, 720);
  await fotos('03-mi-espacio-sin-red');

  /* ============ 3. Modo presentación y versión calmada, sin red ============ */
  console.log('\n3. Modo presentación y versión calmada, sin red');
  await evaluar(`localStorage.setItem('mosaicotelar.presentacion', JSON.stringify({ activo: true, paso: 3 }))`);
  await recargar(BASE + 'index.html#/');
  e = await estadoPagina();
  comprobar('el modo presentación se recuerda y abre sin red', e.presentacion === 'activa' && e.errores.length === 0, JSON.stringify(e));
  await fotos('04-presentacion-inicio');
  await evaluar(`(() => { const b = [...document.querySelectorAll('#guion-mesa button')].find((x) => x.textContent.trim() === 'Siguiente'); b.click(); })()`); await espera(900);
  await fotos('05-presentacion-paso-4');
  await evaluar(`MT.presentacion.ir(4)`); await espera(900);
  await fotos('06-presentacion-docente-ajustes');
  await hash('#/portales/kinesis', 1500);
  await fotos('07-presentacion-kinesis-respaldo');
  const alcancePres = await alcanceTeclado();
  comprobar('modo presentación: todos los controles visibles se alcanzan con Tab', alcancePres.sin.length === 0 && alcancePres.tocados >= alcancePres.total, JSON.stringify(alcancePres));
  await evaluar(`document.getElementById('btn-reiniciar-mesa').click()`); await espera(900);
  e = await estadoPagina();
  comprobar('"Empezar de nuevo" restablece sin confirmación (inicio, sin rol, paso 1)', (await evaluar('location.hash')) === '#/' && (await evaluar(`MT.store.obtener().rol === '' && MT.presentacion.paso() === 0 && !document.querySelector('dialog[open]')`)));
  await evaluar(`localStorage.removeItem('mosaicotelar.presentacion')`);
  await evaluar(`localStorage.setItem('mosaicotelar.apariencia', JSON.stringify({ movimiento: 'calmado' }))`);
  await recargar(BASE + 'index.html#/');
  e = await estadoPagina();
  comprobar('versión calmada: se aplica antes de pintar y abre sin red', e.calmado === 'calmado' && e.errores.length === 0, JSON.stringify(e));
  await fotos('08-calmado-inicio');
  await evaluar(`localStorage.removeItem('mosaicotelar.apariencia')`);
  await recargar(BASE + 'index.html#/', 1500); await vista(1280, 720);
  const alcance = await alcanceTeclado();
  comprobar('sin modo presentación: todos los controles visibles se alcanzan con Tab', alcance.sin.length === 0 && alcance.tocados >= alcance.total, JSON.stringify(alcance));

  // calmado a petición del sistema: prefers-reduced-motion
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await recargar(BASE + 'index.html#/', 1500);
  const quieto = await evaluar(`[...document.querySelectorAll('*')].filter((x) => x.getClientRects().length && (Math.max(...getComputedStyle(x).transitionDuration.split(',').map(parseFloat)) > 0.01 || Math.max(...getComputedStyle(x).animationDuration.split(',').map(parseFloat)) > 0.01)).length`);
  comprobar('prefers-reduced-motion: no queda ninguna animación ni transición de más de 10 ms', quieto === 0, String(quieto));
  await cdp('Emulation.setEmulatedMedia', { features: [] });
} catch (err) { fallo = true; console.error('ERROR del script:', err); }

/* ============ 4. Desde el disco (file://): sin service worker, sin errores ============ */
console.log('\n4. Desde el disco (file://), sin service worker');
try {
  await cdp('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await vista(1280, 720);
  await ir(pathToFileURL(path.join(RAIZ, 'index.html')).href + '#/', 2500);
  let e = await estadoPagina();
  comprobar('file://: abre, con un título y sin errores de ejecución', e.mt === 'object' && e.h1 === 1 && e.errores.length === 0, JSON.stringify(e));
  comprobar('file://: no hay service worker y no se intenta registrar', !(await evaluar(`!!(navigator.serviceWorker && navigator.serviceWorker.controller)`)));
  for (const h of ['#/mi', '#/portales', '#/portales/kinesis', '#/guia/docente']) {
    await hash(h, 1200); e = await estadoPagina();
    comprobar(`file://: ${h} se ve y no da errores`, e.h1 === 1 && e.errores.length === 0, JSON.stringify(e));
  }
  await hash('#/portales/kinesis', 1500);
  const marcoAbre = await evaluar(`!!document.querySelector('.vivo-panel[data-portal="kinesis"] .portal-marco, .vivo-panel[data-portal="kinesis"] .vivo-respaldo:not([hidden])')`);
  comprobar('file://: el portal de Kinesis muestra su marco o su respaldo (nunca un hueco)', marcoAbre);
  await fotos('09-desde-el-disco-file');
  await evaluar(`localStorage.setItem('mosaicotelar.presentacion', JSON.stringify({ activo: true, paso: 0 }))`);
  await recargar(pathToFileURL(path.join(RAIZ, 'index.html')).href + '#/', 1800);
  e = await estadoPagina();
  comprobar('file://: el modo presentación también funciona', e.presentacion === 'activa' && e.errores.length === 0, JSON.stringify(e));
  await evaluar(`localStorage.removeItem('mosaicotelar.presentacion')`);
} catch (err) { fallo = true; console.error('ERROR del script:', err); }

try { sock.close(); } catch { /* ya cerrado */ }
proc.kill();
try { servidor.close(); } catch { /* ya cerrado */ }
const malos = resultados.filter((r) => !r.ok);
console.log(`\nSin conexión: ${resultados.length - malos.length} de ${resultados.length} comprobaciones bien. Capturas en ${SALIDA}`);
process.exit(fallo || malos.length ? 1 : 0);
