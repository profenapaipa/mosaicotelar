# Auditoría de unificación

Cómo se unen Kinesis, Wisfox e IA ValerIA en una sola plataforma **sin sacrificar la autonomía, el
diseño, la estética ni la funcionalidad de ninguno**. Versión 2.0, 30 de octubre de 2026.

## 1. Un error que se corrigió

La primera versión **reescribió** lo esencial de Kinesis y de Wisfox para dibujarlos con una identidad
común. Funcionaba, pero **perdía mucho de lo que sus equipos habían construido**: animaciones, recursos,
gráficos y organización. Era el error de fondo.

**La corrección:** los proyectos reales se muestran **intactos**, dentro de la plataforma. La plataforma
no los imita ni los reemplaza; pone alrededor lo que los une.

## 2. Qué se auditó

- **Kinesis:** la demostración pública, pantalla por pantalla, y sus documentos de identidad y permisos.
- **Wisfox v2.1:** la aplicación corriendo, con sus diez pantallas, y su bitácora técnica.
- **IA ValerIA:** su personalidad y su estado real: hoy es un concepto, sin interfaz propia.
- **PIARPLUS,** como referencia de plataforma del sector: su sitio principal (piarplus.co).

Se miraron capturas reales, no solo el código. Lo que no se pudo verificar, se dice.

## 3. Lo que ya tenía cada proyecto, y cómo se conserva

| | Kinesis | Wisfox |
|---|---|---|
| **Pantallas y roles** | Docente, orientación, familia, estudiante y administración; planeación por asignatura, estudiantes, ajustes PIAR | Inicio con árbol de materias, lecciones, quizes, tutora, notas, recursos, logros, perfil, planes y bienvenida |
| **Identidad** | Verde bosque, oscuro por defecto, barra lateral flotante, encabezado con degradado y panel de cifras | Verde hoja con ámbar, hexágono con W, zorro, órbita de materias, misiones |
| **Recursos y extras** | Menú de apariencia con colores y modo, texto grande, cinta de datos ficticios | Idioma español e inglés, temas, minijuegos (verdadero o falso, memoria, ordenar), puntos y niveles, voz |
| **Cómo se conserva** | **Incrustado intacto**, desde su propia dirección: si su equipo la actualiza, aquí se ve | **Incrustado intacto**, desde su propia dirección publicada: si su equipo la actualiza, aquí se ve |

Nada de esto se reimplementó. Cada equipo conserva su repositorio, su código y su autonomía.

## 4. Cómo se unifica por encima

| Capa | Qué aporta | Qué no toca |
|---|---|---|
| **Riel de marca** | Navegación común: Mapa, Kinesis, Wisfox, ValerIA, Demo y Roles | La cara de cada proyecto |
| **Mapa interactivo** | Cómo se conectan los módulos reales y qué viaja entre ellos | El código de cada módulo |
| **Entrada por rol** | "¿Quién eres?" y un siguiente paso según lo que ya hiciste | Los roles de cada proyecto (son los mismos) |
| **Demostración integrada** | El ajuste de punta a punta, lo único que no existía en ninguno de los dos | Las pantallas completas, que siguen en cada proyecto |
| **Identidad común** | Logo, paleta, tipografía, íconos y recursos, en blanco y negro con un verde | La paleta propia de cada proyecto, dentro de su aplicación |
| **Un estado compartido** | El ajuste viaja entre roles en la demostración | Las bases de datos de cada proyecto |

**Por qué un riel y no un solo menú:** es el patrón de Slack o Google Workspace. El riel responde "¿en
qué proyecto estoy?"; la barra de cada proyecto responde "¿qué hago aquí?".

## 5. Autonomía: qué sigue siendo de cada hilo

| | Kinesis | Wisfox | IA ValerIA |
|---|---|---|---|
| Repositorio y código | Propio, sin tocar | Propio, sin tocar | Propio, sin tocar |
| Base de datos e inicio de sesión | Propios | Propios (`localStorage`) | Ninguno aún |
| Identidad | Intacta | Intacta | Nueva, en la misma familia |
| Quién decide su producto | Su líder | Su líder | Su líder |

La plataforma puede retirarse sin que ninguno pierda nada: cada proyecto sigue funcionando por su cuenta.

**Lo único que cruza de un hilo a otro** es el ajuste, y solo en la demostración:

```
ajuste = { estado: "ninguno" | "propuesto" | "aprobado" | "devuelto",
           estudiante: "P-03",                 // un código, nunca un nombre
           items: [{ cambio, porque }], hora, nota }
```

**Lo que nunca cruza:** la información clínica, las claves y cualquier dato real de un estudiante.

## 6. Flujo de roles

Cinco roles, los que ya existían. El inicio pregunta "¿quién eres?" y todo sale de ahí.

| Rol | Entra a | Hace | Recibe | Entrega |
|---|---|---|---|---|
| Docente | Kinesis | Ve apoyos, planea con DUA, ajusta | La decisión de orientación | Actividad y ajuste |
| Orientación | Kinesis | Revisa y aprueba o devuelve | Ajustes propuestos | Aprobación |
| Familia | Kinesis | Mira el proceso | Novedades ya aprobadas | Nada |
| **Coordinación** | Kinesis (administración) | Crea y edita usuarios, cursos, periodos, categorías de apoyo y vínculos con familias | Cifras del colegio | La estructura: quién es quién |
| Estudiante | Wisfox | Hace la actividad, el quiz y el juego | La actividad a su medida | Su progreso |

**Coordinación** es el administrador de Kinesis. Por mínimo privilegio, **no ve el diagnóstico ni el PIAR
completo** (`lib/permissions.ts` de Kinesis: no existe un atajo de "el administrador ve todo"), y ve
**cuántos** ajustes hay, nunca de quién. Solo orientación tiene acceso institucional, porque es su función.

La matriz completa de "quién ve qué" está en la plataforma (Roles, Quién ve qué).

## 7. Flujo de datos

```
Docente ── actividad ──▶ ValerIA ── propuesta ──▶ Docente ── ajuste ──▶ Orientación
                                                                            │
                                      Familia ◀── novedad aprobada ─────────┤
                                      Estudiante ◀── actividad a su medida ─┘
```

Nada llega a la familia ni al estudiante sin la aprobación de orientación.

## 8. El mapa interactivo

Trece módulos reales, agrupados en tres columnas (los tres proyectos), y doce flechas que dicen qué
viaja entre ellos. Cada módulo declara su estado con la misma regla que el resto del sitio:

| Estado | Significa |
|---|---|
| Funciona hoy | Existe en el proyecto real |
| En integración | Existe en parte; falta conectarlo (ValerIA, la tutora de Wisfox) |
| Simulado en la demo | Se representa con reglas sencillas (ajustes individuales y aprobación: fases 5 y 6 de Kinesis) |
| Viene | Es un concepto (la voz de ValerIA) |

Se puede elegir un rol para atenuar lo que no toca, y tocar un módulo para ver qué hace, quién lo usa,
qué recibe y qué entrega, con enlace al proyecto real.

## 9. Frente a PIARPLUS

Se comparó solo con lo que **su propio sitio dice** (piarplus.co, consultado el 30 de octubre de 2026).
Son afirmaciones de la empresa: no se verificaron ni se probó su producto. "No lo dice" significa que no
se encontró en esa página.

| Aspecto | Mosaico Telar | PIARPLUS, según su sitio |
|---|---|---|
| Qué es | Un flujo entre cuatro roles | Un generador de PIAR y de planes de clase con IA para docentes |
| Documento PIAR en el formato oficial del MEN | **Todavía no** (fase 5 de Kinesis) | Sí |
| Planeación con DUA | Sí, en Kinesis | Sí |
| Orientación aprueba antes de llegar al estudiante | **Sí, es el centro** | No lo menciona |
| Pensado para todos, no solo con diagnóstico | **Sí** | No lo dice |
| Información clínica aislada y sin IA | **Sí, por diseño** | No lo dice |
| Material para el estudiante | Wisfox | Menciona una actividad interactiva |
| Alcance hoy | **Prototipo con datos ficticios** | Dice usarse en 207 colegios |

**Dónde vamos atrás, dicho sin rodeos:** no generamos el documento PIAR oficial, no tenemos colegios en
producción y no tenemos blog, descargas ni certificación como las que ofrece PIARPLUS.

**El diferencial** es el flujo y la protección: un ajuste viaja entre roles con aprobación, el DUA es la
base para todos, y la información clínica nunca llega a la IA.

## 10. Riesgos y pendientes

| Riesgo | Estado |
|---|---|
| Kinesis y Wisfox incrustados dependen de que sus páginas publicadas estén en línea | Se abren también en pestaña nueva; si una cae, solo falla ese marco. No se guarda ninguna copia de su código |
| El código de Wisfox lleva una clave de Firebase para web (`apiKey`) en su repositorio público | Es un identificador, no un secreto, pero conviene confirmar las reglas de Firestore. Esta plataforma no la copia |
| No se auditó el contraste dentro de las aplicaciones incrustadas | Se muestran como las hizo su equipo; ejemplo: el gris secundario de Wisfox da ~3,4:1 |
| Las fases 5 y 6 de Kinesis no existen; aquí se simulan | Declarado en pantalla y en el mapa |
| ValerIA no está conectada a un modelo | Declarado; su lugar y su contrato ya existen |
| El logo se lee como un tejido a 48 px o más, pero se vuelve una mancha bajo 32 px | Tamaño mínimo en el manual |
| Solo se probó en Chrome sin pantalla | Falta un teléfono real y Safari |
| "Intuitivo" es criterio de diseño, no se probó con usuarios | Falta que un docente y un estudiante lo prueben sin ayuda |
| La licencia del conjunto no está decidida | Pendiente de la junta |

## 11. Resultado de la auditoría técnica

`python herramientas/auditar.py` carga cada pantalla en un navegador real:

- **72 casos**: 18 pantallas × 2 anchos (390 y 1280 px) × 2 temas (claro y oscuro). **0 fallos.**
- **4.248 textos** medidos por contraste.
- **33 comprobaciones** del recorrido: entrada por rol, los cinco roles, el flujo del ajuste, el quiz, ValerIA,
  el mapa (módulos, flechas, atenuación por rol), la comparación y que Kinesis y Wisfox se incrusten desde su propia dirección.
- `python herramientas/paleta.py` valida la paleta: armonía, contraste y daltonismo para todos los pares.

Además se revisaron **a ojo** capturas de las pantallas clave. Esa revisión encontró fallos que la máquina
no vio (un `[object HTMLFieldSetElement]` en pantalla, un chat colapsado en celular, un logo que se leía
como "#", etiquetas de la comparación sin color) y cada uno se corrigió y, cuando fue posible, se enseñó a
la prueba automática a detectarlo.
