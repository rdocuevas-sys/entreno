# Plan de entrenamiento — app instalable

App de una sola página para registrar cargas, comidas y medidas. Se instala en el
teléfono, funciona sin señal y guarda todo en el propio dispositivo.

## Cómo publicar un cambio

1. Editar `index.html` (o lo que corresponda).
2. **Subir el número de versión en `sw.js`** — línea `const VERSION = 'v1'` → `'v2'`, etc.
   Si no se sube, el teléfono sigue mostrando la versión vieja.
3. `git add -A && git commit -m "..." && git push`
4. GitHub Pages publica solo, en un minuto o dos.
5. Al abrir la app en el teléfono aparece abajo **"Hay una versión nueva — Actualizar"**.

## Dónde viven los datos

En `localStorage` del navegador del teléfono, bajo la clave `entreno:v1`. **No se suben
a ninguna parte**: no salen del dispositivo, ni siquiera a GitHub. Consecuencia: si se
borran los datos del navegador o se cambia de teléfono, se pierden. Por eso conviene
guardar de vez en cuando el respaldo de **Resumen → Datos completos (JSON)**, que se
recupera con **Resumen → Restaurar respaldo**.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Toda la app: estilos, ilustraciones SVG, lógica y datos del plan |
| `sw.js` | Service worker: guarda la app para uso sin señal y controla las actualizaciones |
| `manifest.webmanifest` | Nombre, íconos y colores con que se instala |
| `fonts/` | Tipografías locales (Barlow Condensed, Inter, IBM Plex Mono) para que se vea bien sin conexión |
| `icons/` | Íconos de la pantalla de inicio |

## Probar en local

```bash
python -m http.server 4477
# abrir http://127.0.0.1:4477/
```

El service worker necesita `http://localhost`/`127.0.0.1` o HTTPS: abriendo el archivo
con doble clic (`file://`) no se registra y no hay instalación ni modo sin conexión.

## Créditos de las ilustraciones

Las ilustraciones de los ejercicios (`ejercicios.js`) vienen de
[Workout Guide](https://github.com/bryllim/workout-guide), de Bryl Lim,
construida a su vez sobre [Everkinetic](https://github.com/everkinetic/data).

Licencia: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

**Cambios respecto del original:** el color pasó de blanco fijo a `currentColor`
(para que tomen el color de la app y sirvan igual en modo claro y oscuro), y los
números de cada trazo se redondearon a enteros con SVGO (`floatPrecision: 0`),
que a este tamaño no se nota y baja el peso a la cuarta parte: los 35 ejercicios
dibujados ocupan 489 KB en vez de los cerca de 2 MB que pesan los SVG originales.
Los trazos así adaptados quedan bajo la misma licencia CC BY-SA 4.0.

Dos ejercicios NO usan estas ilustraciones y conservan el dibujo propio: el
**pull-over**, que no existe en la biblioteca, y la **elevación de talones**,
porque todas sus versiones traen una máquina o una barra al hombro y acá se hace
con mancuernas y sin rack.

El **remo a una mano con kettlebell** del día F comparte el dibujo del remo con
mancuerna del día B: es literalmente el mismo asset de la biblioteca
(`one-arm-dumbbell-row`) y el movimiento es el mismo, así que no se embutió dos
veces. El historial sí es aparte, porque los registros se guardan por nombre.

De los ejercicios del día F, solo el **swing** y el **peso muerto rumano** existen
dibujados con kettlebell en la biblioteca; el resto usa el dibujo con mancuerna del
mismo movimiento, y el texto del ejercicio avisa en qué se diferencia el dibujo de
lo que hay que hacer. **Clean, snatch, halo y turkish get-up no existen en la
biblioteca** — por eso no están en el plan.

## Créditos del mapa muscular

El cuerpo de frente y de espalda, partido en polígonos por músculo, viene de
[react-body-highlighter](https://github.com/giavinh79/react-body-highlighter),
de Gia Vinh Lam, licencia MIT. De ahí solo se extrajeron los puntos de los
polígonos; el componente de React no se usa.

**Qué músculo trabaja cada ejercicio está escrito a mano en `ejercicios.js`**
(`EJ_MUS`), no sale de ninguna biblioteca: el dato que trae la biblioteca de
ilustraciones describe *su* ejercicio y no el nuestro — su press de banca es de
agarre cerrado y declara «tríceps» como músculo principal, cuando el de este
plan es de agarre normal y manda el pecho.
