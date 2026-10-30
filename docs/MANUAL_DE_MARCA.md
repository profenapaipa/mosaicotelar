# Manual de marca de Mosaico Telar

Versión 1.0, 30 de octubre de 2026. La versión viva, hecha con los mismos componentes que el
sitio, está en la plataforma (**Marca**). Si algo cambia en `css/tokens.css`, cambia allí.

## 1. Propósito

> **Para que ninguna forma de aprender se quede fuera del aula.**

- **Eslogan:** *Tejemos caminos para aprender.*
- **Descriptor:** Colectivo de educación inclusiva con tecnología.
- **Qué hacemos:** unimos tres proyectos estudiantiles para que el docente planee una clase
  inclusiva, la orientación la valide, la familia la vea y cada estudiante la reciba a su medida.

### Valores

1. **Todos somos mosaico.** Todos aprendemos distinto, también quienes no tienen un diagnóstico.
2. **Cada hilo es autónomo.** Se unen sin perder su nombre, su código ni su cara.
3. **Los datos van primero.** Son menores de edad. Lo que no es necesario, no se pide.
4. **Decimos qué funciona.** Y qué es simulado. Sin adornos.
5. **Hecho por estudiantes,** con revisión de adultos y de otros equipos.

### De dónde viene el nombre

*Mosaico*: la diversidad de formas de aprender, que incluye a los neurotípicos. *Telar*: tejer es un
proceso artesanal donde varios hilos hacen una sola tela. La urdimbre es la malla curricular; la
trama, los ajustes de cada estudiante.

## 2. Logo

**Tres hilos de color y dos pasadas de trama.** Un telar en su forma más simple. Cada hilo es un
proyecto; la trama los cruza por encima y por debajo, y una "costura" del color del fondo separa
lo que pasa por encima. El logo **no lleva ficha ni fondo**.

| Versión | Cuándo |
|---|---|
| Logo horizontal (símbolo + "Mosaico Telar", Nunito 900) | Encabezados, documentos, pie |
| Símbolo solo | Ícono, favicon, riel |
| Sobre fondo oscuro | Colores claros (`#6FD08C`, `#F0B85A`, `#B9A6FF`) y trama blanca |

- **Espacio libre:** el ancho de un hilo, por todos los lados.
- **Tamaño mínimo:** 24 px el símbolo; 96 px el logo horizontal.
- **No:** estirarlo, girarlo, cambiar el color o el orden de un hilo, ponerle sombras, degradados
  o fichas.
- **Archivo:** `assets/logo.svg` (favicon, con trama oscura). En la página se dibuja desde
  `js/ui.js`, con variables, para que cambie con el tema.

## 3. Color

Tres colores de hilo, que **ya existían en los proyectos**, y tres neutros.

| Color | Hex | Origen | Uso | Texto encima |
|---|---|---|---|---|
| Verde bosque | `#1B7F56` | Kinesis, su color de marca. Wisfox usa la misma familia (`#3D9960`, `#2E7D4F`) | Color principal; hilo del aula | Blanco (5,0:1) |
| Ámbar | `#E8A13C` | Wisfox: su acento y el zorro. Kinesis: avisos y PIAR | Hilo del estudiante; avisos. **Nunca rojo**: un PIAR no es un error | Tinta (7,3:1). El blanco no pasa |
| Uva | `#6B4FC8` | Uno de los colores del menú de apariencia de Kinesis | Hilo de la guía (ValerIA) | Blanco (5,9:1) |
| Tinta | `#23202E` | Texto y trama del logo | Texto principal | Blanco |
| Papel | `#FAF6EF` | Entre el menta de Wisfox y el claro de Kinesis | Fondo de las páginas del colectivo | Tinta |
| Hilo | `#E4DAC6` | Los hilos neutros del telar | Trama y patrones | Tinta |

**Cada espacio conserva su paleta y su tema oscuro:** Kinesis, verde bosque y oscuro por defecto
(un verde casi negro, cercano a `#07130E`); Wisfox, menta claro (`#F6F8F4`) con ámbar; ValerIA, uva sobre lavanda. Los componentes solo
leen variables genéricas (`--papel`, `--superficie`, `--e-fuerte`...), así un espacio nuevo
cambia variables, no componentes.

**El color nunca va solo:** todo estado lleva también texto ("Aprobado", "Pendiente", "Simulado").

## 4. Tipografía

**Nunito**, para todo: la que Kinesis y Wisfox ya usaban. Terminaciones redondeadas, amable en
pesos altos. Se aloja en `fonts/`, sin depender de internet (licencia SIL OFL).

| Uso | Peso | Tamaño |
|---|---|---|
| Título | 900 | 32 a 46 px |
| Subtítulo | 800 | 24 px |
| Texto | 400 y 600 | 16 px, interlineado 1,6 |
| Datos y códigos | 700, monoespaciada del sistema | 14 px |

Todo está en `rem`; el menú de apariencia sube la base al 112,5 %.

## 5. Formas

Un mosaico se arma con teselas. **Cada hilo tiene la suya:**

| Hilo | Forma | Origen |
|---|---|---|
| Kinesis | Cuadrado redondeado, con una "K" en movimiento: su brazo superior termina en un punto, el estudiante que avanza | Su identidad original |
| Wisfox | Hexágono con una "W" | Su identidad original |
| IA ValerIA | Círculo con una chispa de cuatro puntas, la guía que ilumina | Nueva, para completar la familia |

Esquinas muy redondeadas (18 a 30 px) y sombras suaves, como ya hacían ambos proyectos.

## 6. Recursos gráficos

El telar y el mosaico dan para más que un logo. Estos recursos salen de los dos símbolos y se usan
con medida: dan identidad sin cargar la pantalla. Todos están en `css/vistas.css`.

| Recurso | Clase | Dónde |
|---|---|---|
| Patrón de trama | `.patron-telar` | Portadas y estados vacíos. Nunca detrás de texto largo |
| Patrón de teselas | `.patron-mosaico` | Fondos y piezas de comunicación |
| Divisor de puntada | `.puntada` | Separa secciones como una costura |
| Barra de hilo | `.medidor--hilo` | Progreso: tres colores avanzando juntos |
| Cargador de trama | `.cargador-trama` | Espera. Se detiene si la persona pide menos movimiento |
| Ficha de logro | las tres teselas | Logros y rangos |

## 7. Estructura de la interfaz

Dos niveles de navegación, como en Slack o Google Workspace:

1. **El riel** (izquierda, siempre igual): el colectivo. Lleva a Kinesis, Wisfox y ValerIA. En
   celular baja a una barra inferior.
2. **La barra lateral de cada espacio:** lo propio de cada proyecto, tal como la tenía.

Bajo la barra lateral, **la hoja**: contenido en tarjetas. Kinesis agrega su encabezado con
degradado y el panel de cifras montado encima; Wisfox, su saludo con puntos y su órbita.

**ValerIA tiene un lugar fijo:** su propio espacio y un panel que se abre desde el botón "Hablar con
ValerIA" en cualquier pantalla. Hoy dice "Simulada"; al conectarse un modelo dirá "En vivo".

## 8. Voz

Hablamos como una persona que te cuenta algo con respeto: claro, concreto, sin tecnicismos. Siempre de tú.

| Así sí | Así no |
|---|---|
| "Tu ajuste espera a orientación." | Prometer lo que no existe |
| "Hoy responde con textos de ejemplo." | Mencionar diagnósticos o etiquetas |
| "Cuando la actividad esté lista te contaremos qué cambió y por qué." | Hablar de "casos" o "problemas" de un estudiante |

## 9. Accesibilidad (reglas, no sugerencias)

- Contraste de texto de al menos 4,5:1 (3:1 en texto grande), en claro y en oscuro.
- Controles de al menos 24 px de alto; los botones, de 44 px.
- Un solo título principal por pantalla; el foco llega a él al cambiar de pantalla.
- Todo control con nombre accesible; la IA y los estados cambian con `aria-live`.
- Respeta "menos movimiento" y el tamaño de texto del sistema.
- Se comprueba con `python herramientas/auditar.py` antes de cada publicación.

## 10. Cómo agregar un espacio nuevo

1. En `css/tokens.css`, un bloque `[data-espacio="nuevo"]` con su paleta clara y oscura.
2. Una vista en `js/vistas/` que use `espacio()` de `comun.js`.
3. Una línea en la lista del riel, en `js/main.js`.
4. Pasar la auditoría.
