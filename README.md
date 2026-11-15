# NEBULA-F23

Bitácora de reflexiones y escrituras automáticas del Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II, de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia. Seminario dirigido por Mara Viveros, con acompañamiento tutorial de Paula Giraldo.

La identidad visual combina morado `#4A1B70`, rosa `#FCA4BC` y amarillo `#FDDD46`, con detalles plateados, tipografía futurista con acentos expresivos y superficies de vidrio.

La aplicación React y Vite está en `juego/`. NEBULA-F23 es una bitácora feminista que invita a descubrir los escritos de Tania. La dirección elegida es un viaje entre galaxias; la nueva mecánica sigue en diseño. El prototipo funcional conserva por ahora el comecocos de ocho pliegues y el dado.

## Desarrollo

Requiere Node.js 20.19 o posterior. Desde este repositorio:

```sh
cd juego
npm ci
npm run dev -- --open
```

Mantener la terminal activa para usar la web local. Abrir la dirección que imprime Vite. `npm test` comprueba la mecánica y el guardado personal; `npm run build` genera `dist/`. `npm run preview` permite revisar la compilación local.

## Recorrido y contenido

La portada centrada presenta el trabajo y permite entrar mediante el botón Tania Prieto. Su presentación se muestra sin barra de navegación y termina con Abrir Bitácora, que conduce a la introducción. Esta se presenta como una primera transmisión a bordo: una página titulada «Nébula F23» con el texto de la autora junto a una ventanilla con una luna cercana y ocho luces distantes. «Comenzar mi misión» lleva al juego si ya hay alias o a su elección si hace falta. El aviso previo del bolsillo se omite en este recorrido; las indicaciones para guardar una palabra aparecen después de una lectura disponible.

La nueva introducción describe el recorrido proyectado de nueve estaciones y la posibilidad de guardar escritura propia. La navegación entre esas estaciones y el guardado de textos libres siguen pendientes; el prototipo actual conserva ocho pliegues y permite guardar palabras sugeridas.

El recorrido sigue los botones de cada estación, sin menú superior. El texto NEBULA-F23 al pie de todas las pantallas permite regresar a la portada.

Los seis relatos aprobados están copiados íntegramente en `juego/src/entries/`: entradas 1, 2, 3, 4, 6 y 7. Sus fuentes originales permanecen en las carpetas hermanas `../entradaN/`. `src/notes.js` organiza los ocho pliegues del prototipo. Los pliegues 5 y 8 invitan a volver a jugar mientras se terminan sus contenidos. Las notas anteriores se conservan en `src/legacy-notes.js`.

Los enlaces a PDF locales se conservan en los Markdown fuente; no se muestran como enlaces públicos porque esas lecturas no están alojadas en la web.

Después de leer se puede elegir una palabra provisional, sin responder preguntas ni escribir. El bolsillo reúne esas palabras y permite releer los relatos abiertos. El cierre recapitula el recorrido; la conclusión final sigue pendiente de escritura. La presentación y la introducción conservan los textos proporcionados por la autora. La presentación incluye la composición de fotografías de la autora `src/assets/sobreTania.svg`: consultar `src/assets/README.md`.

## Guardado personal

No hay cuentas, contraseñas, API de respuestas ni base de datos. Alias, posición, pliegues abiertos y palabras se guardan en `localStorage`, bajo `bitacory.journey.v1`, en el mismo navegador y perfil. No se envían a la autora. La opción Borrar mi recorrido elimina esos datos. Si el navegador impide guardarlos, se informa que el recorrido durará durante la sesión.

## Vercel

Proyecto: `bitacory`, equipo `tania pojects`. La primera versión se publicó en https://bitacory-coral.vercel.app/.

Importar `tprieto23/cootieCatcherBitacoryEEFG` con:

| Opción | Valor |
| --- | --- |
| Root Directory | `juego` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

`juego/vercel.json` fija framework, compilación y salida. Esta versión no necesita variables de entorno. La rama de producción es `main`. Comprobar el despliegue correspondiente al commit nuevo y abrir la URL para verificar la bienvenida, el alias, una tirada y el guardado al recargar; un push por sí solo no confirma la publicación.

La web pública funciona sin mantener encendido el computador. La documentación de continuidad está en `../.agent/`.
