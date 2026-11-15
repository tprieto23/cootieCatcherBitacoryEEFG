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

Al final de la introducción aparece una escena amplia con una galaxia enana a la izquierda y otra mayor a la derecha. **Aceptar misión** abre una ventana de vidrio con «Astronauta, ¿cuál es tu alias?». **Entrar al mapa** confirma el alias y activa una pantalla de navegación digital. El dispositivo tiene marco morado/plateado, retícula, ruta luminosa, fichas electrónicas y un barrido suave. La pantalla permite desplazarse por las siete estaciones; una franja inferior muestra el progreso real de materiales. La pausa y `prefers-reduced-motion` detienen sus efectos. Este diseño sustituye al mapa de papel arrugado.

El mapa contiene siete estaciones en el orden original de las entradas. La Guía de navegación aparece a su derecha; por debajo en pantallas de hasta 780 px. Las dos galaxias permanecen detrás del mapa. En el mapa cada estación muestra solo su figura celeste y su nombre, sin recuadros ni premisas. Los destinos combinan estrellas irregulares, un sol, planetas y nebulosas, con tonos suaves y movimiento discreto. La ruta los une con curvas. En escritorio el visor y la guía comparten altura y borde inferior. Las pistas y objetivos aparecen al seleccionar el destino. Los objetos de cada parada representan los materiales que se consiguen, no las estaciones. La vista de aproximación muestra la misma figura celeste del destino. Seleccionarla muestra el destino y su objetivo antes de aterrizar. Los estilos del visor están en `src/digital-map.css`.

### Primera estación: Sintoniza Ultravioleta

La aproximación a esta estación muestra la antena intermitente y el objetivo «Recupera un pulso de energía ultravioleta». «Aterrizar» abre `#/estacion-1`: un receptor con tres señales débiles. Cada una revela un fragmento literal de «Una voz que aprendió acompañada» e ilumina una parte de la antena. Las tres reunidas producen un pulso violeta.

El desplegable «Leer entrada», debajo del receptor, está disponible desde el principio, sin exigir sintonizar antes. Conserva el texto íntegro, citas, referencia y PDF original. Al final, una única etiqueta invita a escribir: «Comparte una palabra o una reflexión después de haber leído este pasaje». Se puede guardar antes de terminar de sintonizar: la reflexión queda a salvo, y la recogida se completa cuando existen tres señales y reflexión guardada, en cualquier orden.

El bolsillo reúne una sola ficha por visita, con estrella, material y palabras exactas. La primera contiene el pulso violeta y se actualiza al editar. Al volver al mapa aparece «Pulso recogido», con señal continua. «Mi bolsillo» permanece accesible en mapa, aproximación y visita; abrirlo sobre la lectura conserva su posición y borrador. El avance y las señales sobreviven a la recarga.

### Los siete destinos

| Estación | Material anunciado |
| --- | --- |
| Sintoniza Ultravioleta | Pulso de energía ultravioleta |
| Sigue la señal de casa | Antena de relevo |
| Aterriza en lo cotidiano | Hilo para la red de apoyo |
| Deja que otra voz cambie el rumbo | Prisma de navegación |
| Comparte el timón | Brújula compartida |
| Transmite con tu propia voz | Cápsula de transmisión |
| Busca a las que faltan en mi radar | Filamento de materia oscura |

La interacción propia del receptor se desarrolló para la primera estación. Las demás conservan su lectura y reflexión, con identidad y objetivo nuevos. El escrito de «Comparte el timón» sigue pendiente. Al reunir siete estrellas completas se habilita enlazarlas desde el bolsillo; una red que conecte las siete forma la barrera protectora. Las conexiones también se guardan. Este cierre está preparado para cuando las siete páginas estén disponibles; no se inventó la quinta entrada.

El recorrido sigue los botones de cada estación, sin menú superior. El texto NEBULA-F23 al pie de todas las pantallas permite regresar a la portada.

Los seis relatos aprobados están copiados íntegramente en `juego/src/entries/`: entradas 1, 2, 3, 4, 6 y 7. Sus fuentes originales permanecen en las carpetas hermanas `../entradaN/`. `src/notes.js` conserva las ocho posiciones del prototipo anterior para mantener sus datos; el mapa usa únicamente las entradas 1 a 7. La quinta estación se llama «Comparte el timón» y muestra «Página en escritura», sin inventar su texto. La entrada 8 permanece fuera de la misión actual. Las notas anteriores se conservan en `src/legacy-notes.js`.

Los enlaces locales se conservan en los Markdown fuente. La lectura de la primera estación se incluye íntegra como `src/assets/lectura-ultravioleta.pdf` y su enlace se publica con Vite. Los enlaces de otras lecturas permanecen ocultos hasta incluir sus archivos.

Después de leer una entrada disponible se puede escribir una palabra o una reflexión de hasta 4000 caracteres y guardarla. La estación enciende su estrella y el bolsillo reúne las reflexiones, permite releerlas y volver a editarlas. Las palabras guardadas con el prototipo anterior se conservan en un apartado propio. La conclusión de la autora y las interacciones propias de las estaciones 2 a 7 siguen pendientes. La presentación y la introducción conservan los textos proporcionados por la autora. La presentación incluye la composición de fotografías de la autora `src/assets/sobreTania.svg`: consultar `src/assets/README.md`.

## Guardado personal

No hay cuentas, contraseñas, API de respuestas ni base de datos. Alias, estaciones visitadas, reflexiones, borradores, señales sintonizadas, conexiones de estrellas y los datos del recorrido anterior se guardan en `localStorage`, bajo `bitacory.journey.v1`, en el mismo navegador y perfil. No se envían a la autora. Las estrellas de Ultravioleta guardadas antes de incorporar el receptor conservan su progreso mediante una migración. La opción Borrar mi recorrido elimina esos datos. Si el navegador impide guardarlos, se informa que el recorrido durará durante la sesión.

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
