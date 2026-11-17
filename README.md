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

Al final de la introducción aparece una adaptación de la simulación `choque.mp4` de la autora: partículas azules, naranjas y verdes sobre el entorno violeta del sitio. Conserva las trayectorias del video original, sin ejes ni audio, con movimiento lento y bucle de ida y vuelta. El botón **ACEPTAR MISIÓN** queda abajo, acompañado del crédito de Tania Prieto (2023) y de los datos del equipo de astronomía de la Universidad Nacional de Colombia; abre una ventana de vidrio con «Astronauta, ¿cuál es tu alias?». La simulación se pausa fuera de vista, al ocultar la pestaña, con la pausa global o con `prefers-reduced-motion`. **Entrar al mapa** confirma el alias y activa una pantalla de navegación digital. El dispositivo tiene marco morado/plateado, retícula, ruta luminosa, fichas electrónicas y un barrido suave. La pantalla permite desplazarse por las siete estaciones; una franja inferior muestra el progreso real de materiales. La pausa y `prefers-reduced-motion` detienen sus efectos. Este diseño sustituye al mapa de papel arrugado.

El mapa contiene siete estaciones en el orden original de las entradas. La Guía de navegación aparece a su derecha; por debajo en pantallas de hasta 780 px. Las dos galaxias permanecen detrás del mapa. En el mapa cada estación muestra solo su figura celeste y su nombre, sin recuadros ni premisas. Los destinos combinan estrellas irregulares, un sol, planetas y nebulosas, con tonos suaves y movimiento discreto. La ruta los une con curvas. En escritorio el visor y la guía comparten altura y borde inferior. Las pistas y objetivos aparecen al seleccionar el destino. Los objetos de cada parada representan los materiales que se consiguen, no las estaciones. La vista de aproximación muestra la misma figura celeste del destino. Seleccionarla muestra el destino y su objetivo antes de aterrizar. Los estilos del visor están en `src/digital-map.css`.

### Primeras estaciones: lectura, señales y retazos

«Aterrizar» abre `#/estacion-1` (Sintoniza Ultravioleta) o `#/estacion-2` (Sigue la señal de casa). Ambas usan `src/station-visit.jsx`: título de estación, texto completo con sus citas y referencias, y una casilla con «Comparte una palabra o una reflexión después de haber leído este pasaje». La segunda usa la entrada existente «Lo que sigue conversando», sin modificar su escritura. La primera muestra la lectura directamente y conserva su PDF de referencia; la segunda mantiene «Leer entrada» después de las señales.

En Ultravioleta, guardar una reflexión enciende la estrella y recoge el material. En Sigue la señal de casa se requieren las dos señales y una reflexión guardada, en cualquier orden; guardar antes de sintonizar conserva el texto e indica lo que falta. El bolsillo reúne una sola ficha por estación, con estrella, material y palabras exactas; editar actualiza esa ficha. «Mi bolsillo» y «Volver al mapa» permanecen accesibles. Abrir el bolsillo sobre cualquiera de las dos lecturas conserva su posición y borrador. El avance sobrevive a la recarga y las estaciones completadas brillan en el mapa.

El receptor se retiró por completo de la primera visita y su arquitectura se reutilizó en `src/signal-receiver.jsx` para la segunda. Allí se sintonizan dos señales: «¿Desde dónde conocemos?» y «¿Hasta dónde llega lo que compartimos?». Cada una revela la cita y enlace proporcionados por la autora e ilumina un lado de la antena de relevo. Al final de la segunda entrada aparece la invitación «Piensa en algo que aprendiste de otra persona y que después le contaste a alguien más. ¿Qué entendiste de otra manera al escuchar lo que esa persona tenía para decir?». Los datos de señales se guardan como `mission.homeSignals`; las estrellas ganadas antes de incorporar este receptor se conservan mediante migración.

### Tercera estación: Aterriza en lo cotidiano

`#/estacion-3` muestra directamente la entrada completa y sus referencias, sin desplegable. Después aparece un taller de retazos, sin pregunta ni campo de escritura. Se eligen una o dos palabras entre Encuentros, Etnografía feminista, Pensamiento con cuidado, Reflexividad, Confianza, Escuchar y Afecto. «Descubrir el patchwork» incorpora el retazo de Tania, «Emociones situadas», y anima la costura de las dos o tres telas resultantes; al terminar se habilita «Guardar en mi bolsillo». Con movimiento reducido o pausa se muestra directamente la pieza cosida.

`fabric-workshop.jsx/css` dibuja la tela, sus bordes y el hilo. La elección se guarda en `mission.fabricDraft`; la pieza guardada, en `mission.fabricPatch`. Guardarla enciende la tercera estrella y muestra el patchwork completo, incluido el retazo de Tania, en una única ficha del bolsillo. Se puede cambiar la elección sin perder la pieza anterior hasta guardar de nuevo. Se conservan las reflexiones de versiones anteriores y la estrella cuenta para la barrera final, aunque no exista una respuesta escrita. Abrir el bolsillo conserva la lectura y la elección.

Las estaciones sin actividad previa (1, 3, 6 y 7) muestran el escrito directamente, sin pulsar «Leer entrada». La costura de la tercera queda al final de su lectura. Las estaciones 2, 4 y 5 conservan el desplegable para dar espacio a sus actividades de llegada.

### Los siete destinos

| Estación | Material anunciado |
| --- | --- |
| Sintoniza Ultravioleta | Pulso de energía ultravioleta |
| Sigue la señal de casa | Antena de relevo |
| Aterriza en lo cotidiano | Hilo para la red de apoyo |
| Deja que otra voz cambie el rumbo | Energía disipada |
| Comparte el timón | Un fragmento de materia oscura |
| Transmite con tu propia voz | Cápsula de transmisión |
| Busca a las que faltan en mi radar | Filamento de materia oscura |

Las siete estaciones comparten la página de visita. Ultravioleta ofrece lectura y reflexión; Sigue la señal de casa incorpora dos señales; Aterriza en lo cotidiano termina con una costura de retazos. La cuarta incorpora el encuentro entre galaxias descrito abajo. La quinta permite descubrir y recoger materia oscura en forma de una cita. Las estaciones 6 y 7 abren páginas completas con fondo espacial, lectura, reflexión y bolsillo, igual que las anteriores; la sexta conserva su pregunta propia. Al reunir siete estrellas completas se habilita enlazarlas desde el bolsillo; una red que conecte las siete forma la barrera protectora. Las conexiones también se guardan. Las siete entradas ya están disponibles; las estaciones con materiales propios pueden completar su estrella sin escritura adicional.

El recorrido sigue los botones de cada estación, sin menú superior. El texto NEBULA-F23 al pie de todas las pantallas permite regresar a la portada.

Los siete relatos aprobados están copiados en `juego/src/entries/`: entradas 1 a 7. Sus fuentes originales permanecen en las carpetas hermanas `../entradaN/`. `src/notes.js` conserva las ocho posiciones del prototipo anterior para mantener sus datos; el mapa usa únicamente las entradas 1 a 7. La quinta estación, «Comparte el timón», contiene el escrito y las dos citas proporcionadas por la autora. La entrada 8 permanece fuera de la misión actual. Las notas anteriores se conservan en `src/legacy-notes.js`.

Los enlaces locales se conservan en los Markdown fuente. La lectura de la primera estación se incluye íntegra como `src/assets/lectura-ultravioleta.pdf` y su enlace se publica con Vite. Las dos lecturas de la cuarta estación también se incluyen como PDF independientes de Corona Berkin y Briones. Los enlaces de otras lecturas permanecen ocultos hasta incluir sus archivos.

Después de leer una entrada disponible se puede escribir una palabra o una reflexión de hasta 4000 caracteres y guardarla. La estación enciende su estrella y el bolsillo reúne las reflexiones, permite releerlas y volver a editarlas. Las palabras guardadas con el prototipo anterior se conservan en un apartado propio. Las interacciones propias de las estaciones 6 y 7 siguen pendientes; la conclusión ya está disponible en el regreso a la órbita hogar. La presentación y la introducción conservan los textos proporcionados por la autora. La presentación incluye la composición de fotografías de la autora `src/assets/sobreTania.svg`: consultar `src/assets/README.md`.

### Cuarta estación: dos galaxias cambian de rumbo

`#/estacion-4` presenta «Deja que otra voz cambie el rumbo». Antes de la lectura, `src/galactic-encounter.jsx/css` dibuja un encuentro hipotético entre Andrómeda y la Vía Láctea. El arrastre hacia su vecina, Enter sobre Andrómeda o «Acercar las galaxias» inicia el movimiento de ambas por curvas con estelas cortas. Son trayectorias ilustrativas, no una predicción astronómica ni una integración gravitatoria. Al contactar las nubes aparece calor localizado. Cuando termina el encuentro, se toca ese resplandor entre las galaxias para recoger la energía; no hay botón de recogida debajo. Una advertencia indica dónde encontrarla. El resplandor viaja al botón del bolsillo. La pausa y el movimiento reducido muestran el resultado sin animación.

`mission.dissipatedEnergy` conserva un único artículo de la estación 4. Recogerlo completa la parada y enciende su estrella, sin casilla de escritura ni reflexión obligatoria. Repetir la escena conserva el artículo. El bolsillo guarda la energía y su estrella en una única ficha; también conserva palabras de versiones anteriores, si las había. El mapa cuenta por separado materiales y estrellas. Se conservan estrellas antiguas sin inventar energía no recogida.

Después de recoger se abre la pregunta sobre decidir juntas y «Leer la bitácora» revela directamente *Que el asombro encuentre otras formas*, sin respuesta previa. Su texto y referencias permanecen íntegros; las lecturas locales de Corona Berkin y Briones se publican con Vite. Bolsillo y mapa siguen accesibles, con borradores intactos durante la consulta del bolsillo.

### Quinta estación: recoger lo que sostiene la galaxia

`#/estacion-5` abre «Comparte el timón». `src/dark-matter-encounter.jsx/css` presenta una galaxia visible pequeña, estrellas en órbitas ilustrativas y una explicación breve con enlace a [NASA](https://science.nasa.gov/dark-matter/). «Recoge tu materia oscura» revela un halo violeta que representa una distribución de masa inferida, más extensa que la región luminosa. La metáfora conecta ese sostén con los saberes locales y cotidianos que la academia no siempre reconoce.

Una huella del halo abre únicamente la cita de Cornejo y Rufer, «En diez años hemos logrado sistematizar…», con su atribución y enlace al PDF. «Recoger este fragmento» guarda la frase y enciende la estrella de la quinta; no hay casilla de escritura. Volver a tocar la huella permite releerla sin duplicarla. `mission.darkMatterObserved` conserva el descubrimiento y `mission.darkMatterFragments` el índice 0 recogido. La normalización retira el antiguo índice 1 y conserva la primera frase, la estrella completada y las conexiones anteriores. La otra cita permanece en el escrito y su lectura, fuera de la actividad y del bolsillo.

«Leer la bitácora» permanece disponible desde el principio. El escrito se conserva completo y `StoryText` representa sus citas Markdown como bloques con atribución. Las lecturas `lectura-cornejo-rufer-introduccion.pdf` y `lectura-rufer-corona-apertura.pdf` se publican con Vite. La pausa y el movimiento reducido detienen órbitas y transiciones.

### Salida de misión: agujero negro y órbita hogar

Al final de la ruta del mapa aparece un agujero negro con el nombre **Órbita hogar**. Al seleccionarlo se abre `#/orbita-hogar` directamente en **«Mi conclusión»**, sin portada, mensaje de misión cumplida ni ilustración adicional. La figura del mapa mantiene su SVG y respeta pausa/movimiento reducido.

`src/entries/conclusion.md` conserva los cuatro párrafos enviados por la autora. `src/mission-farewell.jsx/css` presenta el escrito y al final el agradecimiento «Gracias por leerme y por darle un lugar a estas preguntas». El botón centrado **«Abrir la red de mis estrellas»** abre la vista existente `#/bolsillo`, que incluye la red para enlazar las estrellas. «Volver al mapa» y «Mi bolsillo» siguen disponibles en la barra; el bolsillo superior mantiene su diálogo emergente y conserva el punto de lectura al cerrarlo. No se añaden premios ni se modifica el avance.

El bolsillo completo `#/bolsillo`, «Lo que llevas contigo», conserva los objetos, las palabras y la red de estrellas sobre el mismo fondo espacial. Su encabezado mantiene los textos y la tipografía sin recuadro ni fondo propio. El botón final de la conclusión abre directamente esta vista, igual que el enlace «Abrir la red de mis estrellas» del bolsillo emergente.

### Red completa, agujero negro y misión completada

Al reunir las siete estrellas aparece la red existente para enlazarlas. Cuando las siete pertenecen a una misma red y forman la barrera protectora, `ConstellationBuilder` muestra el botón **«MISIÓN COMPLETADA»**. No aparece con estaciones incompletas ni con estrellas todavía desconectadas.

El botón abre `#/agujero-de-gusano` y reutiliza el túnel animado de `wormhole-passage.jsx/css`, sin textos ni botones visibles. Tras 3,6 segundos llega automáticamente a `#/mision-completada`; con pausa o movimiento reducido muestra una escena estática durante 0,6 segundos. La llegada reemplaza la ruta del túnel en el historial y se cancela el temporizador al salir. Ambos túneles muestran únicamente la animación.

`mission-complete.jsx/css` presenta **«MISION COMPLETADA»**, el alias y NEBULA-F23 dentro de un recuadro violeta. Debajo aparece en letra expresiva rosa el mensaje: «Has desafiado a los métodos de investigación de la academia tradicional, considérate parte del club que le apuesta a otras formas de construir y compartir conocimiento.». La figura de agujero negro es un botón con foco visible y la indicación «Entrar al agujero negro». También permite volver a la red, abrir el bolsillo emergente o regresar a portada.

Al pulsar la figura abre `#/tunel-al-bolsillo`, una segunda entrada al túnel existente que muestra únicamente la animación, sin textos ni botones visibles. Tras la animación llega automáticamente a **`#/objetos-del-bolsillo`**, reemplazando la ruta del túnel en el historial. Esta página completa mantiene el fondo cósmico, la paleta y las fichas de los objetos, retazos y palabras guardadas; reutiliza `MissionPocket` con `objectsOnly` y `PocketStars`, sin volver a incluir la actividad de la red. Conserva las palabras antiguas y permite volver al mapa, a la red, al cierre o a portada. Las dos transiciones respetan pausa y movimiento reducido.

El control de rutas exige alias y barrera completa para mostrar los túneles y el cierre, también al recargar una dirección directa; la página de objetos requiere alias. No se añade estado de avance ni se borran los recuerdos. La conclusión y el bolsillo superior conservan su funcionamiento.

### Visitas completas de las estaciones 6 y 7

«Aterrizar» en Transmite con tu propia voz abre `#/estacion-6`; en Busca a las que faltan en mi radar abre `#/estacion-7`. Ambas usan `StationVisit` y el fondo espacial, con lectura visible desde el aterrizaje, referencias y casilla de reflexión, «Mi bolsillo» y «Volver al mapa». La sexta recibe la invitación propia de escritura mediante `prompt`. Abrir el bolsillo conserva la lectura y su borrador; las reflexiones guardadas se pueden editar en la misma estrella. No se modifica el esquema de guardado.

`src/navigation.js` centraliza las rutas de las siete visitas y sus índices. Recargar una ruta directa vuelve a su página, con el mismo control de alias y avance. La vista de destino previa al aterrizaje sigue siendo una ventana; la lectura ya no usa el diálogo antiguo sobre el mapa.

## Guardado personal

No hay cuentas, contraseñas, API de respuestas ni base de datos. Alias, estaciones visitadas, reflexiones, borradores, señales sintonizadas, retazos, energía disipada, fragmentos de materia oscura, conexiones de estrellas y los datos del recorrido anterior se guardan en `localStorage`, bajo `bitacory.journey.v1`, en el mismo navegador y perfil. No se envían a la autora. Las estrellas de Ultravioleta guardadas antes de incorporar el receptor conservan su progreso mediante una migración. La opción Borrar mi recorrido elimina esos datos. Si el navegador impide guardarlos, se informa que el recorrido durará durante la sesión.

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
