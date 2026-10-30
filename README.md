# Mosaico Telar

**Tejemos caminos para aprender.**

Colectivo de educación inclusiva con tecnología. Este repositorio es el espacio público donde
tres proyectos estudiantiles se encuentran con una sola identidad, una sola navegación y un
estado compartido:

| Hilo | Proyecto | Para quién | Su proyecto completo |
|---|---|---|---|
| Hilo del aula | Kinesis | Docentes, orientación, familias | [Kinesis](https://github.com/profenapaipa/Kinesis) |
| Hilo del estudiante | Wisfox | Estudiantes | [Wisfox](https://github.com/profenapaipa/wisfox) |
| Hilo de la guía | IA ValerIA | Los tres anteriores | En construcción |

Esto **no reemplaza** a los proyectos completos. Cada uno conserva su repositorio, su código y
su autonomía. Aquí viven la versión unificada de lo esencial de cada uno y lo que los une.

## Qué se conservó de cada proyecto

- **Kinesis:** los roles (docente, orientación, familia), el DUA, los apoyos sin diagnóstico, el
  encabezado en degradado con la hoja de tarjetas, las pestañas en píldora, la barra flotante del
  celular, el menú de apariencia y la cinta de datos ficticios. El color de marca es su verde
  bosque.
- **Wisfox:** el zorro, la ruta con XP, la lección, el quiz de opción múltiple, el minijuego de
  ordenar frases y los logros. Su color es el coral.
- **IA ValerIA:** su lugar propio. Hoy responde con textos de ejemplo, y lo dice en pantalla.
- **Ambos:** la tipografía Nunito, que los dos ya usaban y es la voz común.

## Lo nuevo: un solo hilo entre los espacios

Lo que el docente hace en Kinesis aparece en Orientación, en Familia y en Wisfox sin copiar
nada, porque todo lee un único estado (`js/store.js`). El recorrido completo es: el docente ve los
apoyos, pide ayuda a ValerIA, ajusta la actividad al perfil, orientación aprueba, la familia ve el
proceso y el estudiante recibe la actividad ajustada.

## Cómo está hecha

Sin dependencias, sin paso de construcción, con scripts clásicos. Por eso funciona abriendo
`index.html` directamente, en GitHub Pages y sin internet.

```
index.html          marco: barra, navegación, panel de ValerIA, pie
css/
  tokens.css        la identidad: colores por hilo, tema claro y oscuro, texto grande
  base.css          botones, tarjetas, formularios y demás componentes comunes
  layout.css        encabezado con hoja, pestañas, barra del celular, panel de ValerIA
  vistas.css        lo propio de cada pantalla
js/
  ui.js             constructor de elementos, texto seguro y los símbolos de la marca
  store.js          el estado compartido (localStorage, con respaldo en memoria)
  datos.js          todo lo ficticio: estudiantes, DUA, lección, quiz, respuestas de ejemplo
  ia-config.js      el único archivo que se toca para conectar ValerIA
  ia.js             adaptador de ValerIA, chat y panel
  router.js         navegación por hash (#/kinesis/docente)
  vistas/           una por pantalla: inicio, kinesis, wisfox, valeria, recorrido, estado
herramientas/
  auditar.py        prueba todo en un navegador real
  arnes.html        lo que auditar.py ejecuta dentro del navegador
```

**Cómo agregar un color de hilo o un espacio nuevo:** un bloque `[data-espacio="..."]` en
`css/tokens.css` con las cuatro variables `--e-*`, y una vista nueva en `js/vistas/`. Todos los
componentes se repintan solos.

## Cómo verla

Abre `index.html` en el navegador. Para servirla en local:

```
python -m http.server 8000
```

## Cómo probarla antes de publicar

```
python herramientas/auditar.py            # todo
python herramientas/auditar.py --enlaces  # además, que los enlaces externos respondan
```

Recorre las 11 pantallas en celular y escritorio, en tema claro y oscuro, y mide desborde,
errores de ejecución, un solo título por pantalla, controles sin nombre o menores de 24 px,
texto roto y contraste. Después ejecuta el recorrido completo como lo haría una persona. Necesita
Chrome o Edge y Python 3. Sale con código 1 si algo falla.

## Cómo conectar ValerIA

Hoy responde con textos de ejemplo. Para conectar un modelo real:

1. Un servidor guarda la clave del modelo como **variable de entorno**. La clave nunca va en
   esta página, que es pública.
2. Ese servidor expone `GET /api/estado` (responde `{ "ia": true, "modelo": "..." }`) y
   `POST /api/valeria` (recibe `{ "tarea": "disenar|ajustar|ayuda", "texto": "..." }` y devuelve
   `{ "fuente": "...", "texto": "..." }`).
3. Se sirve esta carpeta desde ese mismo servidor. Con `proveedor: 'auto'` en `js/ia-config.js`,
   la página lo detecta sola y el chat y el panel pasan de "Simulada" a "En vivo".

El perfil del estudiante no viaja desde la página: lo arma el servidor con datos ficticios.

## Qué no va en este repositorio

Es un repositorio **público**. No se suben aquí:

- Datos de estudiantes, ni siquiera con código real.
- Claves, tokens ni archivos `.env`.
- Documentos internos de gobierno, negocio o seguridad del colectivo.
- Nombres de estudiantes.

Todo lo que se muestra es ficticio y está marcado así en pantalla.

## Licencias

La tipografía Nunito se distribuye con la licencia SIL Open Font License. El resto del código es
de los equipos de cada hilo; la licencia del conjunto está por decidir.
