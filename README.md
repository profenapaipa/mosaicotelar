# Mosaico Telar

**Tejemos caminos para aprender.**

Colectivo de educación inclusiva con tecnología. Este repositorio es la página pública que
presenta a los tres proyectos estudiantiles que lo forman:

| Hilo | Proyecto | Para quién |
|---|---|---|
| Hilo del aula | [Kinesis](https://github.com/profenapaipa/Kinesis) | Docentes, orientación, familias |
| Hilo del estudiante | [Wisfox](https://github.com/profenapaipa/wisfox) | Estudiantes |
| Hilo de la guía | IA ValerIA | Los tres anteriores |

Cada proyecto conserva su propio repositorio, su código y su autonomía. Aquí solo vive la
página que los presenta como un conjunto.

## Cómo está hecha

Una sola página estática, sin dependencias, sin JavaScript y sin fuentes externas:

```
index.html     contenido
styles.css     estilos (tema claro y oscuro según el sistema)
assets/        logo y trama del telar, en SVG
```

## Cómo verla

Abre `index.html` en el navegador. No necesita servidor.

## Cómo publicarla

En GitHub: **Settings, Pages, Source: Deploy from a branch, rama `main`, carpeta `/ (root)`**.
Queda en `https://profenapaipa.github.io/mosaicotelar/`.

## Qué no va en este repositorio

Es un repositorio **público**. No se suben aquí:

- Datos de estudiantes, ni siquiera con código.
- Claves, tokens ni archivos `.env`.
- Documentos internos de gobierno, negocio o seguridad del colectivo.
- Nombres de estudiantes.

Todo lo que la página muestra sobre el uso del sistema es un ejemplo con datos ficticios.
