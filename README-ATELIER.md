# Atelier Desktop: local preview guide

Atelier Desktop is the desktop workspace for Atelier's art and AI workflows. It adapts the DeepSeek Harness runtime and the MIT-licensed DSH Desktop shell while keeping a separate Atelier application identity and profile. This document covers the current local preview; it is not a promise of a signed public installer or of multiuser cloud capacity.

## Product flow

1. Start a new task in **Everyday work** or **Design and creative** mode. The suggestion buttons place a draft in the composer so you can edit it before sending.
2. Choose a workspace and model provider. New sessions use the **Atelier Creative Mode** preset unless you change it. This preset can discover local Skills, use the configured tools, and call the bundled Blender MCP connector when its external service is available.
3. Ask for inspectable deliverables. For 3D work, request the editable `.blend` scene and rendered views. The Blender workflow Skill calls for opening and checking at least two views, and for identifying any visual claim that still needs human review.
4. Review actual file cards and previews in the session. Confirm the file opens and downloads before treating it as handed over. A path or a model's statement by itself is not delivery.

The PPT button enables the inherited editable PPTX workflow for that session. The curated **MCP connector market** can add a published connector to the Atelier preset; a new session is needed to confirm its tools load. Curated entries are discovery and configuration aids, not a guarantee that an external server is running or trustworthy. The community plugin market is hidden in this preview.

## Install and run

Requirements: macOS, Node.js 24, npm, and a model provider that you configure in the app.

```sh
npm ci
npm run dev
```

For a local, unsigned Apple Silicon package:

```sh
npm run package:dev:mac:arm64
```

Output is under `dist-dev/`. The repository also contains inherited Windows packaging code, but this guide does not claim that an Atelier Windows build has been validated or published.

### Blender connection

The preset declares a stdio connector using `uvx --python 3.11 mcp-for-blender==2.0.4`. Install `uvx` and Blender separately, enable the matching Blender MCP add-on, and start the add-on service on `127.0.0.1:9876`. The connector can be configured before Blender is running; tool calls will fail until the service is reachable. Check the connection, save the scene, and inspect the saved `.blend` and rendered images.

## Data and release boundary

Atelier Desktop uses `atelier-desktop` in production builds and `atelier-desktop-dev` in development. It does not import another DSH profile's sessions, plugins, or credentials. On macOS, the development Harness home is under `~/Library/Application Support/atelier-desktop-dev/harness`. Workspace files remain in the workspace you selected.

Atelier has no signed update feed. The [Atelier signed macOS release workflow](docs/atelier-signed-release.md) is configured but cannot produce a signed release until an Apple Developer Program team and its credentials are available. The inherited DSH release workflow remains unsuitable for Atelier; use the [Atelier preview workflow](docs/atelier-preview-release.md) or local build commands for unsigned previews. The desktop app is distinct from Atelier's multiuser web service.

The host is derived from [DSH Desktop](https://github.com/dataelement/dsh-desktop); the Agent runtime comes from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Keep their licenses and component-specific notices when redistributing. See [LICENSE](LICENSE) and the notices in the relevant bundled packages.
