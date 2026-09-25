# Atelier Desktop

**Arte e IA en un espacio de trabajo local.** Atelier Desktop es una vista previa para macOS que ayuda a convertir una idea artística en investigación, archivos editables y resultados visuales comprobables. Se basa en [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) y en el host [DSH Desktop](https://github.com/dataelement/dsh-desktop), publicado con licencia MIT. Atelier mantiene su propia identidad, interfaz, configuración creativa y perfil de usuario independiente.

[English](README.md) · [简体中文](README.zh.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## Funciones de esta vista previa

- **Creación artística y 3D:** las nuevas sesiones utilizan de forma predeterminada *Atelier Creative Mode*, que incluye una Skill de trabajo con Blender y la configuración de `mcp-for-blender`. Blender y su complemento MCP se instalan por separado.
- **Trabajo cotidiano:** los botones de documentos, análisis y visualización de datos, actas, informes y presentaciones rellenan el cuadro de texto con una sugerencia editable; no envían la tarea automáticamente.
- **Archivos verificables:** el flujo 3D pide guardar la escena editable y revisar vistas renderizadas. Mencionar un nombre de archivo no demuestra que el resultado exista o se haya comprobado.
- **Modelos y herramientas:** configura un proveedor de modelos en la aplicación. El mercado de conectores MCP reúne proyectos seleccionados de arte y diseño. Tras añadir uno al preset de Atelier, abre una nueva sesión para comprobar que sus herramientas conectan. El mercado de plugins comunitarios está oculto en esta vista previa.
- **Entorno local:** espacios de trabajo, sesiones y ajustes se guardan en un perfil de Atelier separado de DSH. La interfaz admite chino, inglés y francés. El modo PPT integrado puede generar archivos PPTX editables.

Esta es una **vista previa local**. Atelier todavía no tiene un canal propio de versiones firmadas ni actualizaciones automáticas. El repositorio conserva código multiplataforma heredado, pero las instrucciones y comprobaciones actuales se centran en macOS. Las versiones publicadas por DSH Desktop no son versiones de Atelier. Esta aplicación tampoco sustituye al servicio web multiusuario de Atelier.

## Ejecutar en macOS

Usa **Node.js 24** y ejecuta desde la raíz del repositorio:

```sh
npm ci
npm run dev
```

Después configura el proveedor de modelos en **Ajustes → Modelos**. Atelier no importa claves, sesiones ni plugins de otros perfiles DSH. Para crear un paquete local sin firma para Apple Silicon:

```sh
npm run package:dev:mac:arm64
```

El resultado se guarda en `dist-dev/` y no es un instalador de producción.

Para tareas con Blender, instala Blender y `uvx`, activa el complemento `mcp-for-blender==2.0.4` e inicia el servicio en `127.0.0.1:9876`. Comprueba la conexión MCP antes de modelar. Consulta la [guía local y de entregables](README-ATELIER.md).

## Desarrollo, datos y procedencia

Ejecuta `npm test`, `npm run typecheck` y `npm run build`, y comprueba el flujo afectado en la aplicación. La [arquitectura](docs/architecture.md), la [guía de desarrollo](docs/development.md) y la [guía de PPT](packages/ppt-runtime/README.md) describen el host heredado y aún pueden usar nombres de DSH.

Atelier ejecuta Harness localmente y usa su propio directorio de datos. El proceso de interfaz está aislado y en sandbox. Los proveedores de modelos y servicios MCP pueden acceder a archivos o enviar datos según sus permisos; revisa cada conexión antes de usar material privado. No publiques credenciales ni archivos de clientes.

El código derivado de DSH Desktop se distribuye conforme a la [licencia MIT](LICENSE). DeepSeek Harness y los demás componentes conservan sus propias licencias y mantenedores. Atelier es una adaptación independiente, no una versión oficial de DeepSeek o DSH Desktop.

[Sitio de Atelier](https://artsmart.space/) · [Repositorio](https://github.com/dengyier/Atelier_desktop_mac)
