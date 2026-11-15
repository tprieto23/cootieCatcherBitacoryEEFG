# Imagen de presentación de Tania

`sobreTania.svg` es la composición proporcionada por la autora para acompañar su presentación. Es una copia íntegra de `../../../../sobreTania.svg`, en la carpeta de trabajo Bitacory. Contiene sus fotografías incorporadas y no depende de enlaces externos.

Se importa desde `experience.jsx` y se publica al compilar. Conservar su proporción vertical y mostrarla completa, sin recortarla ni sustituirla por una imagen generada. Para actualizarla, reemplazar esta copia con la versión que indique la autora.

La presentación suaviza con CSS el borde inferior de esta composición para integrarla al fondo, sin alterar el archivo.

`Luffy2.svg` es una copia íntegra de `../../../../Luffy2.svg`, proporcionada por la autora. Aparece debajo del texto en el lateral derecho de su presentación, sin marco y con su transparencia y proporción originales. Sus imágenes están incorporadas en el SVG. La interfaz suaviza los bordes inferior y derecho con una máscara CSS y añade el bocadillo «guau guau»; el archivo original permanece intacto.

Luffy ocupa hasta el 52% del bloque final, con un máximo de 310 px en escritorio amplio. En anchos de 561 a 1000 px se limita a 140 px; en móvil queda debajo de los controles y puede crecer hasta 220 px. Se superpone en el lateral derecho del cierre en escritorio. Su espacio de composición aprovecha el margen transparente superior del SVG.

## Lectura de Ultravioleta

`lectura-ultravioleta.pdf` es una copia binaria íntegra del PDF de García-Santesmases proporcionado por la autora en `../../../../entrada1/`. Se incorporó a petición de ella para conservar el enlace «Lectura de referencia» en la primera estación. No se recomprimió ni se alteró. Vite lo publica como archivo independiente (aproximadamente 20,8 MB), enlazado desde `experience.jsx`; no se incrusta en la página ni se descarga antes de abrir el enlace.

## Simulación del encuentro galáctico

`choque-nebula.mp4` deriva de `../../../../choque.mp4`, proporcionado por la autora. Conserva sus trayectorias, recorta la gráfica, suaviza las dos leyendas y adapta las poblaciones de partículas a violeta, rosa y amarillo. Es una versión silenciosa, tres veces más lenta, que regresa sobre sus fotogramas para formar un bucle sin salto. El original no se modifica. `choque-nebula-poster.jpg` procede del primer fotograma adaptado.

Para regenerar ambos archivos, desde `juego/`: `python3 scripts/prepare-collision.py /ruta/choque.mp4` (requiere FFmpeg). El recorte está ajustado al video original de 1920 × 1080. La versión publicada es H.264, 720 × 720, 20 fps, 32,8 segundos y unos 2,7 MB. `collision-scene.jsx` lo usa solo en la escena de aceptación, con opacidad .56 y bordes difuminados. Estrellas, nebulosas suaves, una luna y un planeta con anillo acompañan la simulación. El botón queda en la parte inferior para dejar libre el centro. La reproducción se detiene al salir de vista, ocultar la pestaña, activar la pausa o preferir movimiento reducido; el póster permite mostrar la escena sin reproducción. No se precarga el video fuera de vista.
