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

### El respaldo es un ARCHIVO, no texto copiado

Un año de uso medido —2.920 registros de comida, 6.525 series, 365 pesajes— pesa
**1,2 MB**. Eso no se selecciona a mano en un teléfono ni cabe en un correo escrito, así
que copiar y pegar el JSON dejaba de funcionar solo con el tiempo. **Guardar respaldo**
produce `entreno-AAAA-MM-DD.json` (la fecha en el nombre para reconocer el último sin
abrir ninguno) y lo entrega por tres escalones, de mejor a peor:

1. **La hoja de compartir del teléfono** (`navigator.share` con `files`). Es la única
   puerta que una página web tiene a **iCloud Drive** en iPhone: no existe API para
   escribir ahí sola. Por eso «automático a iCloud» no es una opción que exista.
2. **Descarga directa** (`<a download>`), para el computador y Android.
3. **El texto a la vista** para copiarlo, que funciona siempre.

⚠**Cancelar la hoja de compartir NO marca el respaldo.** Marcarlo ahí apagaría el aviso
dos semanas por un respaldo que nunca existió, y eso es peor que no avisar: te hace
confiar en algo que no está. Solo un `AbortError` se trata como cancelación; cualquier
otro fallo cae al escalón siguiente en vez de dejar sin salida.

**Dónde guardarlo importa.** En «En mi iPhone» cubre el caso más frecuente —borrar los
datos de Safari, reinstalar la app— pero se va con el teléfono. En **iCloud Drive**
cubre también perderlo. Es el mismo gesto, y el texto de la app lo dice.

**Restaurar acepta el archivo**, con el mismo selector, y también pegar el texto. Las dos
puertas pasan por la misma validación y la misma confirmación: si cargar un archivo se
saltara los avisos, elegir el respaldo equivocado borraría todo sin preguntar. Un archivo
que no es un respaldo se rechaza sin tocar nada.

**El aviso.** Al guardar se anota el día en `cfg.resp`, y si pasan **14 días** *y además*
hay registros posteriores a esa fecha, aparece un recuadro en Resumen y un punto en la
pestaña. Las dos condiciones importan: sin datos nuevos no hay nada que perder y el aviso
sería ruido, y un aviso que se ignora deja de ser un aviso.

Lo que se marca es que **generó** el respaldo, no que esté a salvo en alguna parte: eso
la app no puede comprobarlo, y el texto lo dice así en vez de prometerlo. Por la misma
razón el JSON se arma **antes** de estampar la fecha — si no, el archivo que se lleva
vendría diciendo que ya estaba respaldado.

**Lo que sigue sin cubrir:** todo esto depende de que aprietes el botón. La app no tiene
servidor a propósito, y sin uno no hay respaldo automático posible. La salida sería subir
el JSON solo a un repositorio privado; no está hecho, y tiene su propio filo —si la app
sube sola, un día que los datos se pierdan localmente también subiría el vacío.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Toda la app: estilos, lógica y datos del plan |
| `ejercicios.js` | Ilustraciones de los ejercicios y el mapa muscular |
| `alimentos.js` | Tabla de alimentos con sus macros y porciones caseras |
| `sw.js` | Service worker: guarda la app para uso sin señal y controla las actualizaciones |
| `manifest.webmanifest` | Nombre, íconos y colores con que se instala |
| `fonts/` | Tipografías locales (Barlow Condensed, Inter, IBM Plex Mono) para que se vea bien sin conexión |
| `icons/` | Íconos de la pantalla de inicio |

## El registro de comida

La pestaña **Comida** pedía kcal, proteína, carbos y grasa escritos a mano, que
es justo el dato que nadie tiene al terminar de almorzar. Ahora se escribe lo que
se comió, con su hora, en lenguaje normal —`2 huevos duros`, `un litro de agua`,
`una taza de arroz con un pedazo de carne`— y la app estima.

**Cómo funciona.** `alimentos.js` tiene los alimentos con sus macros **por 100 g**
(cocidos donde corresponde) y sus medidas caseras en gramos: una taza de arroz son
180 g, un huevo 55 g, una marraqueta 100 g. El texto se normaliza (sin tildes, sin
ñ, en minúscula) sólo **para comparar**; lo que se guarda y se muestra es lo que
escribió el usuario.

**Una línea puede traer varias cosas.** Se corta por coma, por `y` y también por
`con`, porque «arroz con un pedazo de carne» son dos alimentos. El costo de esa
regla es que «café con leche» se partiría en dos, así que va como fila propia en la
tabla y se busca entera antes de cortar nada.

**Lo que no se reconoce NO se inventa.** Queda guardado con el texto tal cual,
marcado `sin estimar` y con los macros en `null` — nunca en cero, que sería un
total falsamente completo. Esos registros salen señalados en el resumen exportado
para estimarlos y agregarlos a la tabla.

**Los totales del día se calculan**, no se escriben. Si se escribe un total a mano
(la etiqueta de un envase, por ejemplo), ése manda y la app lo dice; «volver al
calculado» **borra** la corrección en vez de dejar un cero.

**Precisión, dicho de frente:** son valores de referencia y las porciones caseras
son promedios. «Un pedazo de carne» está entre 80 y 250 g en el mundo real y
ninguna tabla arregla eso; por eso cada registro se puede ajustar. Lo que importa
para recomposición es estimar siempre igual, no acertar al gramo.

**El día es un selector, no «hoy».** La pestaña mostraba solo el día en curso, así que
una cena que se olvidara anotar no tenía dónde ir. Ahora se elige el día arriba —igual
que en Medidas— y **todo** lo de la pestaña es de ese día: lo que se anota, los totales,
la corrección a mano y el tipo de día. Cada registro guarda la semana **de su propia
fecha** (`semanaDe(f)`, no `semanaHoy()`): anotar el jueves pasado y que el registro
cayera en la semana en curso duplicaría el volumen de una semana y vaciaría la otra sin
que se note en pantalla. Al entrar a la pestaña se vuelve siempre a hoy.

**Repetir lo de siempre.** Dos atajos que evitan retipear:

- **Tus comidas** (`S.platos`) — frases guardadas con un nombre. Se guarda lo que esté
  escrito en el campo o, si está vacío, todo lo anotado ese día unido por comas. Se
  guarda **la frase**, no los macros: al usarla vuelve a pasar por el estimador, así que
  no quedan números congelados que envejecerían al corregir la tabla de alimentos.
- **Lo que más repites** — las frases con dos o más apariciones, agrupadas por su forma
  normalizada («Plátano» y «platano» son la misma) pero mostradas como se escribieron la
  última vez. Con una sola aparición no entra: eso no es «lo de siempre».

El botón de guardar está **siempre**, también cuando no hay nada guardado todavía;
metido dentro del bloque de los atajos quedaba un círculo cerrado en el que la primera
comida no había manera de crearla.

## Las curvas de calorías y proteína

Están en **Medidas → Lo que comes**, junto a las de peso y cintura, con la misma media
móvil de 7 días. Tres decisiones que no son obvias:

- **El objetivo entra en el rango vertical del gráfico.** Si no, con 1.500 kcal contra un
  objetivo de 2.476 la línea punteada se dibujaría fuera del recuadro y la curva parecería
  ir pegada al objetivo cuando va muy por debajo.
- **La cifra de la derecha es la media móvil, no la diferencia punta a punta.** Con
  registro diario, comparar el primer día contra el último no dice nada: salía «0 kcal»
  con siete días anotados. La media contra el objetivo sí es con lo que se decide subir o
  bajar calorías.
- **Las calorías no se pintan de verde ni de rojo** (`neutro`): pasarse y quedarse corto
  son igual de malos. La proteína sí, y con el **mismo** umbral que ya usa la Lectura
  semanal —el 90 % del objetivo— para no tener dos avisos de lo mismo discrepando.

Un día sin anotar **no tiene punto**: un cero hundiría la media y diría que no comió
cuando lo que pasó es que no anotó.

## Probar en local

```bash
python -m http.server 4477
# abrir http://127.0.0.1:4477/
```

El service worker necesita `http://localhost`/`127.0.0.1` o HTTPS: abriendo el archivo
con doble clic (`file://`) no se registra y no hay instalación ni modo sin conexión.

### Las pruebas

Viven fuera del repo (en el directorio de trabajo de la sesión) y **extraen el código
directamente de `index.html`**: no hay copia del parser que mantener al día. El bloque
que se extrae está delimitado por las marcas `@parser-inicio` y `@parser-fin` dentro del
`<script>` — **no borrarlas**: sin ellas la suite revienta, que es justo lo que tiene
que pasar.

Cada suite lleva su **control negativo**: rompe a propósito, *en memoria y nunca en el
archivo*, lo que dice proteger, y comprueba que con el código roto la suite falla. Una
prueba que pasa igual con el defecto puesto no está midiendo nada.

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
