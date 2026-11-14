# cootieCatcherBitacoryEEFG
Log of writings and readings for the course Metodologia Feministas II

## Juego de notas secretas

La primera versión del juego está en `juego/`. Es una aplicación pequeña de React con Vite: un comecocos con textura de papel, un dado animado y ocho notas que se descubren jugando.

### Ejecutar

Requiere Node.js 20.19 o posterior.

```sh
cd juego
npm install
npm run dev
```

Para compilar: `npm run build`. Para comprobar la mecánica: `npm test`.

### Publicar en Vercel

La configuración de despliegue está en `juego/vercel.json`. Antes de importar el repositorio, subir a GitHub la carpeta `juego/`, incluido su `package-lock.json`.

En Vercel, crear un proyecto e importar `tprieto23/cootieCatcherBitacoryEEFG` con estos valores:

| Opción | Valor |
| --- | --- |
| Root Directory | `juego` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

Esta versión no necesita variables de entorno. Tras desplegar, abrir la URL de producción y comprobar una tirada, la apertura de una nota y la recarga de la página. Con la integración de GitHub, los siguientes cambios enviados a `main` actualizarán la publicación.

La web publicada funciona sin mantener encendido el computador. El servidor de `npm run dev` sirve únicamente para editar y revisar localmente.

### Dinámica

1. La partida empieza antes de la pestaña 1.
2. Lanza un dado de seis caras. El resultado indica cuántas pestañas avanzar en sentido horario.
3. Al pasar de la pestaña 8, vuelves a la 1. Las siguientes tiradas parten desde tu última posición.
4. Abre la pestaña donde caíste para leer su nota. Las demás permanecen cerradas.
5. Vuelve a lanzar para seguir descubriendo notas. El contador registra notas distintas abiertas durante esa partida.

El progreso vive en memoria: recargar la página o pulsar «Empezar de nuevo» reinicia la partida.

### Escribir las notas

Reemplaza los ocho objetos de `juego/src/notes.js` con las notas de la autora. Cada objeto tiene `title` y `text`; el orden corresponde a las pestañas 1–8. Los textos actuales son ejemplos, no escritos de la autora. Al sustituirlos, actualiza también los rótulos de ejemplo del pie de página y del diálogo en `juego/src/main.jsx`.

«Secretas» describe la experiencia de descubrirlas jugando; la aplicación no utiliza cuentas ni un servidor para proteger los textos.

### Documentación del proyecto

La documentación general se mantiene en `../.agent/` dentro de la carpeta de trabajo Bitacory.
