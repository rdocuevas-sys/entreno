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
dibujados ocupan 436 KB en vez de los cerca de 2 MB que pesan los SVG originales.
Los trazos así adaptados quedan bajo la misma licencia CC BY-SA 4.0.

Dos ejercicios NO usan estas ilustraciones y conservan el dibujo propio: el
**pull-over**, que no existe en la biblioteca, y la **elevación de talones**,
porque todas sus versiones traen una máquina o una barra al hombro y acá se hace
con mancuernas y sin rack.

### Ejercicios sin dibujo, a propósito

Tres ejercicios del **día F** —*halo de rodillas*, *iron trident* y *marcha cargada
a una mano*— **no existen en la biblioteca** y van deliberadamente sin ilustración:
la app muestra un aviso («Este no tiene dibujo en la biblioteca») y el botón de
video apunta a su nombre en inglés mediante el campo `busca`, porque buscándolos en
español no se encuentran. **Sí conservan su mapa muscular**: eso se consigue
poniéndolos en `EJ_MUS` pero no en `EJ_IMG`, la misma combinación que ya usaban el
pull-over y la elevación de talones.

Se prefirió eso antes que reutilizar un dibujo parecido. El `farmer-carry` de la
biblioteca, por ejemplo, sale con **dos** mancuernas y sin marcha, y la marcha
cargada es con **una**: copiar ese dibujo borraría el ejercicio, porque con las dos
manos cargadas los pesos se anulan y el costado deja de trabajar. Donde sí se
reutiliza un dibujo de otro implemento —el press de tríceps y el curl con
kettlebell— **el texto del ejercicio avisa en qué se diferencia**.

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
