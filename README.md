# NEBULA-F23

Bitácora de reflexiones y escrituras automáticas del Seminario de Metodología de Investigación con Perspectiva Feminista y de Género II, de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia. Seminario dirigido por Mara Viveros, con acompañamiento tutorial de Paula Giraldo.

La identidad visual combina morado `#4A1B70`, rosa `#FCA4BC` y amarillo `#FDDD46`, con detalles plateados, tipografía futurista con acentos expresivos y superficies de vidrio.

La aplicación React y Vite está en `juego/`. NEBULA-F23 es una bitácora feminista que invita a descubrir los escritos de Tania. El recorrido es una misión entre galaxias con siete estaciones seleccionables, lectura y guardado de reflexiones personales.

## Desarrollo

Requiere Node.js 20.19 o posterior. Desde este repositorio:

```sh
cd juego
npm ci
npm run dev -- --open
```

Mantener la terminal activa para usar la web local. Abrir la dirección que imprime Vite. `npm test` comprueba la mecánica y el guardado personal; `npm run build` genera `dist/`. `npm run preview` permite revisar la compilación local.

## Recorrido y contenido

La portada centrada presenta el trabajo y permite entrar mediante el botón Tania Prieto. Su presentación termina con Abrir Bitácora, que conduce a la introducción aprobada. Esta conserva su transmisión inicial, sus seis párrafos y el enlace NASA/ESA, junto a la cabina y su ventanilla con nebulosas animadas. El título visible es **NEBULA-F23**.

Al final de la introducción aparece una escena amplia con una galaxia enana a la izquierda y otra mayor a la derecha. **Aceptar misión** abre una ventana de vidrio con «Astronauta, ¿cuál es tu alias?». **Entrar al mapa** confirma el alias y despliega una carta con un efecto visual de papel arrugado que se abre; no incluye sonido. La pausa y `prefers-reduced-motion` permiten ver el mapa abierto sin animación.

El mapa contiene siete estaciones en el orden original de las entradas. La Guía de navegación aparece a su derecha; por debajo en pantallas de hasta 780 px. Las dos galaxias permanecen detrás del mapa. Cada estación abre su página y permite volver al mapa. Los componentes de misión están en `src/mission.jsx`, sus estilos en `src/mission.css` y la validación de los datos en `src/mission.js`.

El recorrido sigue los botones de cada estación, sin menú superior. El texto NEBULA-F23 al pie de todas las pantallas permite regresar a la portada.

Los seis relatos aprobados están copiados íntegramente en `juego/src/entries/`: entradas 1, 2, 3, 4, 6 y 7. Sus fuentes originales permanecen en las carpetas hermanas `../entradaN/`. `src/notes.js` conserva las ocho posiciones del prototipo anterior para mantener sus datos; el mapa usa únicamente las entradas 1 a 7. La quinta estación se muestra provisionalmente como «Estación 5 · Por escribir», sin inventar un escrito. La entrada 8 permanece fuera de la misión actual. Las notas anteriores se conservan en `src/legacy-notes.js`.

Los enlaces a PDF locales se conservan en los Markdown fuente; no se muestran como enlaces públicos porque esas lecturas no están alojadas en la web.

Después de leer una entrada disponible se puede escribir una palabra o una reflexión de hasta 4000 caracteres y guardarla. La estación enciende su estrella y el bolsillo reúne las reflexiones, permite releerlas y volver a editarlas. Las palabras guardadas con el prototipo anterior se conservan en un apartado propio. La conexión manual de estrellas, la barrera protectora y la conclusión final siguen pendientes. La presentación y la introducción conservan los textos proporcionados por la autora. La presentación incluye la composición de fotografías de la autora `src/assets/sobreTania.svg`: consultar `src/assets/README.md`.

## Guardado personal

No hay cuentas, contraseñas, API de respuestas ni base de datos. Alias, estaciones visitadas, reflexiones y los datos del recorrido anterior se guardan en `localStorage`, bajo `bitacory.journey.v1`, en el mismo navegador y perfil. No se envían a la autora. La opción Borrar mi recorrido elimina esos datos. Si el navegador impide guardarlos, se informa que el recorrido durará durante la sesión.

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

`juego/vercel.json` fija framework, compilación y salida. Esta versión no necesita variables de entorno. La rama de producción es `main`. Comprobar el despliegue correspondiente al commit nuevo y abrir la URL para verificar la introducción, el alias, el mapa con su guía, una lectura y el guardado de reflexiones al recargar; un push por sí solo no confirma la publicación.

La web pública funciona sin mantener encendido el computador. La documentación de continuidad está en `../.agent/`.
