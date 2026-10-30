# Mosaico Telar

**Tejemos caminos para aprender.**

Colectivo de educación inclusiva con tecnología. Esta es la plataforma pública que une tres proyectos
estudiantiles, **sin reemplazar a ninguno**: Kinesis y Wisfox se muestran tal como los construyeron sus
equipos, y la plataforma pone alrededor lo que los une.

| Hilo | Proyecto | Para quién | Su proyecto |
|---|---|---|---|
| Hilo del aula | Kinesis | Docentes, orientación, familias, coordinación | [Kinesis](https://github.com/profenapaipa/Kinesis) |
| Hilo del estudiante | Wisfox | Estudiantes | [Wisfox](https://github.com/profenapaipa/wisfox) |
| Hilo de la guía | IA ValerIA | Los tres anteriores | En construcción |

## Dónde empezar

- **Quien usa la plataforma:** abre la página y elige su rol. Todo lo demás sale de ahí.
- **Quien quiere entender cómo se conecta todo:** el **Mapa** de la plataforma, o
  [docs/AUDITORIA_DE_UNIFICACION.md](docs/AUDITORIA_DE_UNIFICACION.md).
- **Quien diseña o programa:** [docs/MANUAL_DE_MARCA.md](docs/MANUAL_DE_MARCA.md) y
  [docs/PALETA.md](docs/PALETA.md).

## Qué hay

- **Mapa interactivo** (`#/mapa`): los módulos reales de los tres proyectos, lo que viaja entre ellos, qué
  ve cada rol, y una comparación honesta con PIARPLUS.
- **Kinesis y Wisfox, intactos** (`#/kinesis`, `#/wisfox`): incrustados desde su propia dirección publicada, con su cara, animaciones y recursos. Esta plataforma no guarda copias de su código.
- **Demostración** (`#/demo`): el ajuste de punta a punta entre cinco roles, con datos ficticios.
- **ValerIA** (`#/valeria`): su espacio y un panel fijo. Hoy responde con textos de ejemplo.
- **Roles** (`#/recorrido`): qué hacer, quién ve qué y por dónde viaja la información.
- **Marca** (`#/identidad`): el manual de marca vivo.

## Cómo está hecha

Sin dependencias y sin paso de construcción, con scripts clásicos: funciona abriendo `index.html`, en
GitHub Pages y sin internet, salvo Kinesis y Wisfox, que se cargan desde su propia dirección publicada.

```
index.html          marco: riel, franja, panel de ValerIA, pie
assets/capturas/    capturas reales de Kinesis y Wisfox para la portada
css/                tokens (identidad), base, layout y vistas
js/                 ui, store, datos, roles, ia, router y vistas/ (una por pantalla)
docs/               auditoría de unificación, manual de marca y paleta
herramientas/       auditar.py, arnes.html y paleta.py
```

## Cómo probarla antes de publicar

```
python herramientas/auditar.py            # todo
python herramientas/auditar.py --enlaces  # además, que los enlaces externos respondan
python herramientas/paleta.py             # armonía, contraste y daltonismo de la paleta
```

`auditar.py` recorre todas las pantallas en celular y escritorio, en claro y oscuro, mide desborde, errores,
contraste y controles, y ejecuta el recorrido completo como lo haría una persona. Necesita Chrome o Edge y
Python 3. Sale con código 1 si algo falla.

## Cómo conectar ValerIA

Hoy responde con textos de ejemplo. Para conectar un modelo real:

1. Un servidor guarda la clave del modelo como **variable de entorno**. La clave nunca va en esta página, que es pública.
2. Ese servidor expone `GET /api/estado` (responde `{ "ia": true, "modelo": "..." }`) y `POST /api/valeria`
   (recibe `{ "tarea": "disenar|ajustar|ayuda", "texto": "..." }` y devuelve `{ "fuente": "...", "texto": "..." }`).
3. Se sirve esta carpeta desde ese mismo servidor. Con `proveedor: 'auto'` en `js/ia-config.js`, la página
   lo detecta sola y el chat y el panel pasan de "Simulada" a "En vivo".

## Qué no va en este repositorio

Es un repositorio **público**. No se suben aquí: datos de estudiantes (ni con código real), claves, tokens o
archivos `.env`, documentos internos de gobierno o negocio, ni nombres de estudiantes. Todo lo que se muestra
es ficticio y está marcado así en pantalla.

## Licencias

Las tipografías Nunito y Newsreader se distribuyen con la licencia SIL Open Font License. Kinesis y Wisfox
son de sus equipos y conservan su licencia. La licencia del conjunto está por decidir.
