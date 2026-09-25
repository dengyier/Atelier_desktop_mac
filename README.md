# Atelier Desktop

**Art and AI, in one local workspace.** Atelier Desktop is a macOS-focused desktop preview for turning an artistic brief into research, working files, editable creative output, and visual checks. It is built on [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) and the MIT-licensed [DSH Desktop](https://github.com/dataelement/dsh-desktop) host; Atelier maintains its own identity, creative preset, interface, and isolated user profile.

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Português](README.pt.md)

## What is in this preview

- **Creative work:** the default *Atelier Creative Mode* includes a Blender workflow Skill and a configured `mcp-for-blender` connector. Use it for installations, geometric sculpture, exhibition scenes, and other 3D briefs. Blender and its MCP add-on are separate prerequisites.
- **Everyday work:** document processing, data analysis and visualization, meeting notes, research reports, and slides start from editable prompt suggestions. The suggestions fill the composer; they do not submit a task automatically.
- **Files you can inspect:** the workflow asks for actual project files and rendered views, then checks framing and other visible details before reporting a 3D result. A filename alone is not proof that a deliverable was created or verified.
- **Tools and models:** configure a model provider in the app. The MCP connector market provides curated art and design entries; adding a connector configures the Atelier preset and must be checked in a new session. The community plugin market is currently hidden.
- **Local desktop host:** workspaces, sessions, and settings are held in Atelier Desktop's own application profile, separate from an existing DSH installation. The interface supports Chinese, English, and French. The bundled PPT mode can produce editable PPTX files.

This is an **early local preview**. There is no Atelier signed release feed or automatic updater. The repository contains upstream cross-platform code, but this fork's local instructions and validation currently target macOS; do not treat the upstream DSH installers or release claims as Atelier releases. The desktop app does not replace the multiuser Atelier web service.

## Run locally

Use **Node.js 24** on macOS. From this repository:

```sh
npm ci
npm run dev
```

Set up your model provider in **Settings → Models**. Atelier does not import API keys, sessions, or plugins from another DSH profile. To build an unsigned local Apple Silicon preview:

```sh
npm run package:dev:mac:arm64
```

The local preview artifacts are written to `dist-dev/`; they are not production installers.

For Blender tasks, install Blender and `uvx`, enable the `mcp-for-blender==2.0.4` add-on, and start its service on `127.0.0.1:9876`. Check that the MCP tools connect before asking the Agent to model. See [the detailed Atelier setup and delivery guide](README-ATELIER.md).

## Development

Run `npm test`, `npm run typecheck`, and `npm run build`, then inspect the affected flow in the app. Harness customizations live in host code, Atelier plugins, and tracked compatibility patches. The inherited [architecture](docs/architecture.md), [development guide](docs/development.md), and [PPT runtime guide](packages/ppt-runtime/README.md) describe the underlying host; some of those documents still use upstream DSH names and release procedures.

## Data, security, and provenance

Atelier starts a local Harness service and uses its own per-user data directory. The renderer runs with isolation and sandboxing. Model providers and installed MCP services may send data to their configured endpoints or access workspace files according to their permissions; review a connector before using it with private work. Do not commit credentials or client files.

Atelier Desktop is based on DSH Desktop under the [MIT License](LICENSE). DeepSeek Harness, bundled packages, MCP projects, and other third-party components retain their respective licenses and maintainers. Atelier is an independent adaptation and is not an official DeepSeek or DSH Desktop release.

[Atelier website](https://artsmart.space/) · [Project repository](https://github.com/dengyier/Atelier_desktop_mac)
