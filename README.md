# Bitácory · Una bitácora feminista

Bitácora de reflexiones y escrituras automáticas del curso Metodologías Feministas II, de la Especialización en Estudios Feministas y de Género de la Universidad Nacional de Colombia. Curso dirigido por Mara Viveros, con acompañamiento tutorial de Paula Giraldo.

La aplicación React y Vite está en `juego/`. Manzanita del Perú invita a descubrir los escritos de Tania mediante un comecocos de ocho pliegues y un dado.

## Desarrollo

Requiere Node.js 20.19 o posterior. Desde este repositorio:

```sh
cd juego
npm ci
npm run dev -- --open
```

Mantener la terminal activa para usar la web local. Abrir la dirección que imprime Vite. `npm test` comprueba la mecánica y el guardado personal; `npm run build` genera `dist/`. `npm run preview` permite revisar la compilación local.

## Recorrido y contenido

La bienvenida ofrece Introducción, Saber más sobre mí e Iniciar. El cuaderno une la presentación de Tania con la introducción; después aparecen el aviso del bolsillo feminista, la elección de alias y el juego.

Los seis relatos aprobados están copiados íntegramente en `juego/src/entries/`: entradas 1, 2, 3, 4, 6 y 7. Sus fuentes originales permanecen en las carpetas hermanas `../entradaN/`. `src/notes.js` conserva el orden de las ocho clases. Los pliegues 5 y 8 invitan a volver a jugar mientras se terminan sus contenidos. Las notas anteriores se conservan en `src/legacy-notes.js`.

Los enlaces a PDF locales se conservan en los Markdown fuente; no se muestran como enlaces públicos porque esas lecturas no están alojadas en la web.

Después de leer se puede elegir una palabra provisional, sin responder preguntas ni escribir. El bolsillo reúne esas palabras y permite releer los relatos abiertos. El cierre recapitula el recorrido; la conclusión final sigue pendiente de escritura. La presentación y la introducción publicadas son la primera versión acordada durante el diseño. La fotografía está pendiente: consultar `src/assets/README.md`.

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
