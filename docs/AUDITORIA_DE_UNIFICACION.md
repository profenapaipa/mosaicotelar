# Auditoría de unificación

Cómo se unen Kinesis, Wisfox e IA ValerIA en una sola plataforma **sin sacrificar la autonomía,
el diseño, la estética ni la funcionalidad de ninguno**. Hecha el 30 de octubre de 2026.

## 1. Qué se auditó y cómo

- **Kinesis:** la demostración pública, pantalla por pantalla (portada, docente, orientación,
  familia, estudiante, administración) y sus documentos de identidad.
- **Wisfox v2.1:** la aplicación corriendo en local, con sus siete pantallas (inicio, lecciones,
  quizes, tutora, notas, recursos, logros) y su bitácora técnica.
- **IA ValerIA:** su personalidad y su estado real: hoy es un concepto, sin interfaz propia.

Se miraron capturas reales, no solo el código. Lo que se afirma abajo sale de esas capturas o de
los documentos de cada proyecto; lo que no se pudo verificar, se dice.

## 2. Lo que ya compartían (la base de la unión)

| | Kinesis | Wisfox |
|---|---|---|
| Tipografía | Nunito | Nunito |
| Color | Verde bosque `#1B7F56` (oscuro: `#6FD08C`) | Verde hoja `#3D9960` / `#2E7D4F`, con ámbar `#E8A13C` y coral `#E8746A` |
| Estructura | Barra lateral flotante + encabezado + tarjetas | Barra lateral plana + saludo + tarjetas |
| Navegación activa | Píldora verde sólida con brillo | Píldora verde sólida con brillo |
| Formas | Esquinas muy redondeadas (18 a 30 px) | Esquinas muy redondeadas (18 px) |
| Tono | Cercano, sin tecnicismos | Cercano, motivador |
| Zona de ayuda de IA | No tenía | "Mudy Aslan", una pantalla de chat |

**Lectura de diseño:** los dos hablan el mismo idioma visual sin haberse puesto de acuerdo. Eso
significa que la unión no requiere cambiarles la cara: requiere un marco común por encima.

## 3. En qué se diferencian (y por qué se conserva)

| | Kinesis | Wisfox |
|---|---|---|
| Público | Adultos: docentes, orientación, familias | Estudiantes |
| Tema por defecto | Oscuro, profesional | Claro, menta, juguetón |
| Rasgo propio | Encabezado con degradado y panel de cifras montado encima | Árbol de materias en órbita, misiones diarias y el zorro |
| Logo | Cuadrado redondeado con una "K" en movimiento | Hexágono con una "W" |

Cada diferencia responde a su público. Un docente necesita sobriedad; un estudiante necesita
juego. **Unificarlos en una sola cara habría empobrecido a los dos**, así que no se hizo.

## 4. Decisión: qué se comparte, qué se conserva y qué es nuevo

| Se comparte (marco del colectivo) | Se conserva de cada hilo | Es nuevo |
|---|---|---|
| Riel de navegación con los tres hilos | La barra lateral propia de cada espacio | El logo del colectivo |
| Tipografía Nunito, alojada en el sitio | La paleta y el tema de cada proyecto, también en oscuro | El color de ValerIA (uva), tomado del menú de apariencia de Kinesis |
| Menú de apariencia: claro, oscuro, texto grande | El encabezado de Kinesis y la órbita de Wisfox | La entrada por rol y la página "Cómo funciona" |
| Cinta de datos ficticios | Los roles de Kinesis y el zorro de Wisfox | El espacio de ValerIA y su panel fijo |
| Un estado compartido entre espacios | Sus proyectos completos, en sus propios repositorios | La tercera forma de ficha (el círculo) |

**Por qué un riel y no un solo menú:** es el patrón de Slack o Google Workspace. El riel responde
"¿en qué proyecto estoy?"; la barra lateral de cada espacio responde "¿qué hago aquí?". Un solo
menú mezclaría las dos preguntas y obligaría a rehacer la navegación de cada proyecto.

## 5. Autonomía: qué sigue siendo de cada hilo

| | Kinesis | Wisfox | IA ValerIA |
|---|---|---|---|
| Repositorio y código | Propio, sin tocar | Propio, sin tocar | Propio, sin tocar |
| Base de datos e inicio de sesión | Propios (en el proyecto completo) | Propios (`localStorage`, sin backend) | Ninguno aún |
| Identidad | Conservada | Conservada | Nueva, en la misma familia |
| Quién decide su producto | Su líder | Su líder | Su líder |

La plataforma unificada es **una capa de experiencia** que reescribe lo esencial de cada hilo en
un solo código sin dependencias. No reemplaza a los proyectos completos y puede retirarse sin
que ninguno pierda nada: cada uno sigue funcionando por su cuenta.

### Lo único que cruza de un hilo a otro (el contrato)

Un ajuste nace en Kinesis y llega a Wisfox. Es el único dato que viaja entre hilos:

```
ajuste = {
  estado:     "ninguno" | "propuesto" | "aprobado" | "devuelto",
  estudiante: "P-03",                 // un código, nunca un nombre
  items:      [{ cambio, porque }],   // cada apoyo se vuelve un cambio con su razón
  hora, nota
}
```

Lo que **nunca** cruza: la información clínica (vive aislada en Kinesis), las claves, y cualquier
dato real de un estudiante. A la IA solo llega un perfil anónimo armado en el servidor.

## 6. Flujo de roles

Cuatro roles, los mismos que ya tenían los proyectos. El inicio pregunta "¿quién eres?" y todo
sale de ahí: a dónde ir, qué se puede hacer, qué no, qué se recibe y qué se entrega.

| Rol | Entra a | Hace | Recibe | Entrega |
|---|---|---|---|---|
| Docente | Kinesis | Ve apoyos, planea con DUA, ajusta | La decisión de orientación | Actividad y ajuste |
| Orientación | Kinesis | Revisa y aprueba o devuelve | Ajustes propuestos | Aprobación |
| Familia | Kinesis | Mira el proceso | Novedades ya aprobadas | Nada |
| Estudiante | Wisfox | Hace la actividad, el quiz y el juego | La actividad a su medida | Su progreso |

La matriz completa de "quién ve qué" está en la plataforma (Cómo funciona, Quién ve qué).

## 7. Flujo de datos

```
Docente ── actividad ──▶ ValerIA ── propuesta ──▶ Docente ── ajuste ──▶ Orientación
                                                                            │
                                      Familia ◀── novedad aprobada ─────────┤
                                      Estudiante ◀── actividad a su medida ─┘
```

Nada llega a la familia ni al estudiante sin la aprobación de orientación.

## 7 bis. Cómo se evitó que la información abrume

- **Una sola pregunta al entrar:** el rol. Después, un único "siguiente paso", nunca una lista.
- **Tres lecturas separadas** para "cómo funciona" (qué hago, quién ve qué, por dónde viaja),
  en pestañas, en lugar de una página con todo.
- **Cada espacio muestra solo lo de su rol.** Quien entra como familia no ve la planeación.
- **Lo simulado se dice como simulado**, en cada pantalla donde ocurre.

## 8. Riesgos y pendientes

| Riesgo | Estado |
|---|---|
| Las fases 5 y 6 de Kinesis (ajustes individuales y seguimiento con familias) no existen; aquí se representan con reglas sencillas | Declarado en pantalla |
| ValerIA no está conectada a un modelo | Declarado; su lugar y su contrato ya existen |
| Wisfox aquí trae solo la ruta de Inglés; el resto de materias vive en su proyecto completo | Declarado en el árbol |
| Wisfox usa un gris de texto secundario (`#7B8A80`) que sobre su fondo da unos 3,4:1, por debajo de 4,5:1 | Aquí se usó un gris más oscuro; conviene corregirlo en su proyecto |
| Solo se probó en Chrome sin pantalla | Falta probar en un teléfono real y en Safari |
| Los datos reales requieren requisitos legales y técnicos que no se cumplen aún | Todo es ficticio y está marcado |
| La licencia del conjunto no está decidida | Pendiente de la junta |

## 9. Resultado de la auditoría técnica

`python herramientas/auditar.py` carga cada pantalla en un navegador real:

- **60 casos**: 15 pantallas × 2 anchos (390 y 1280 px) × 2 temas (claro y oscuro). **0 fallos.**
- **3.342 textos** medidos por contraste. Otros 72, sobre degradados, se revisaron a ojo.
- **27 comprobaciones** del recorrido completo, desde elegir un rol hasta hablar con ValerIA.
- Además se revisaron a ojo capturas de las pantallas clave en escritorio y celular, claro y
  oscuro. Esa revisión encontró fallos que la máquina no vio (un `[object HTMLFieldSetElement]`
  en pantalla, un chat colapsado en celular, un hueco por una rejilla que estiraba filas), y
  cada uno se corrigió y se enseñó a la prueba automática a detectarlo.
