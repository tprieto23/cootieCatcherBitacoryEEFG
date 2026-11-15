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

«Aterrizar» abre `#/estacion-1` (Sintoniza Ultravioleta) o `#/estacion-2` (Sigue la señal de casa). Ambas usan `src/station-visit.jsx`: título de estación, desplegable «Leer entrada», texto completo con sus citas y referencias, y una casilla con «Comparte una palabra o una reflexión después de haber leído este pasaje». La segunda usa la entrada existente «Lo que sigue conversando», sin modificar su escritura. La primera conserva su PDF de referencia.

En Ultravioleta, guardar una reflexión enciende la estrella y recoge el material. En Sigue la señal de casa se requieren las dos señales y una reflexión guardada, en cualquier orden; guardar antes de sintonizar conserva el texto e indica lo que falta. El bolsillo reúne una sola ficha por estación, con estrella, material y palabras exactas; editar actualiza esa ficha. «Mi bolsillo» y «Volver al mapa» permanecen accesibles. Abrir el bolsillo sobre cualquiera de las dos lecturas conserva su posición y borrador. El avance sobrevive a la recarga y las estaciones completadas brillan en el mapa.

El receptor se retiró por completo de la primera visita y su arquitectura se reutilizó en `src/signal-receiver.jsx` para la segunda. Allí se sintonizan dos señales: «¿Desde dónde conocemos?» y «¿Hasta dónde llega lo que compartimos?». Cada una revela la cita y enlace proporcionados por la autora e ilumina un lado de la antena de relevo. Al final de la segunda entrada aparece la invitación «Piensa en algo que aprendiste de otra persona y que después le contaste a alguien más. ¿Qué entendiste de otra manera al escuchar lo que esa persona tenía para decir?». Los datos de señales se guardan como `mission.homeSignals`; las estrellas ganadas antes de incorporar este receptor se conservan mediante migración.

### Tercera estación: Aterriza en lo cotidiano

`#/estacion-3` conserva la entrada completa y sus referencias en «Leer entrada». Después aparece un taller de retazos, sin pregunta ni campo de escritura. Se eligen una o dos palabras entre Encuentros, Etnografía feminista, Pensamiento con cuidado, Reflexividad, Confianza, Escuchar y Afecto. «Descubrir el patchwork» incorpora el retazo de Tania, «Emociones situadas», y anima la costura de las dos o tres telas resultantes; al terminar se habilita «Guardar en mi bolsillo». Con movimiento reducido o pausa se muestra directamente la pieza cosida.

`fabric-workshop.jsx/css` dibuja la tela, sus bordes y el hilo. La elección se guarda en `mission.fabricDraft`; la pieza guardada, en `mission.fabricPatch`. Guardarla enciende la tercera estrella y muestra el patchwork completo, incluido el retazo de Tania, en una única ficha del bolsillo. Se puede cambiar la elección sin perder la pieza anterior hasta guardar de nuevo. Se conservan las reflexiones de versiones anteriores y la estrella cuenta para la barrera final, aunque no exista una respuesta escrita. Abrir el bolsillo conserva la lectura y la elección.

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

Las cinco primeras estaciones comparten la página de visita. Ultravioleta ofrece lectura y reflexión; Sigue la señal de casa incorpora dos señales; Aterriza en lo cotidiano termina con una costura de retazos. La cuarta incorpora el encuentro entre galaxias descrito abajo. La quinta permite descubrir y recoger materia oscura en forma de una cita. Las estaciones 6–7 conservan su lectura en diálogo, con identidad y objetivo propios. Al reunir siete estrellas completas se habilita enlazarlas desde el bolsillo; una red que conecte las siete forma la barrera protectora. Las conexiones también se guardan. Las siete entradas ya están disponibles; las estaciones con materiales propios pueden completar su estrella sin escritura adicional.

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

Al final de la ruta del mapa aparece un agujero negro con el nombre **Órbita hogar**. Al seleccionarlo se abre `#/orbita-hogar`, con «Completaste la misión, astronauta [ALIAS]» y **«Tripulaste NEBULA-F23 satisfactoriamente»**. La nueva figura y su disco se dibujan en SVG con la paleta morada, rosa, amarilla y plateada; respetan pausa y movimiento reducido.

`src/entries/conclusion.md` conserva los cuatro párrafos enviados por la autora. `src/mission-farewell.jsx/css` muestra la despedida, el agujero negro, la conclusión, el agradecimiento y «Regresar a mi órbita hogar», que vuelve a la portada. El bolsillo y el mapa siguen accesibles. La salida es un recurso narrativo de esta historia y está disponible desde el mapa: no añade una octava estrella, no entrega materiales ni modifica los recuerdos. Se conservan las siete estaciones, el alias y el avance al volver a casa.

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
