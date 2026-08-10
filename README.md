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
