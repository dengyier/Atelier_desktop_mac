# Atelier Desktop (first local preview)

Atelier Desktop is a separate desktop app for art and 3D work. It builds on the MIT-licensed [DSH Desktop](https://github.com/dataelement/dsh-desktop) shell and bundles DeepSeek Harness `0.1.5-rc.2`. The creative preset and Atelier branding are maintained in this fork. Upstream components retain their own licenses and maintainers.

## Included

- Independent application IDs and profiles: `atelier-desktop` and `atelier-desktop-dev`. Startup does not import an existing DSH Web profile, sessions, or credentials.
- `Atelier 创作模式` as the default preset for new sessions, with a local Blender workflow Skill and an `mcp-for-blender` stdio connector.
- Atelier icons, sidebar brand, startup screen, and first-run preview notice.
- Upstream automatic updates disabled until Atelier has its own signed release feed.

## Local run

Use Node 24. Run `npm ci`, then `npm run dev`. To make a local macOS arm64 preview, run `npm run package:dev:mac:arm64`; the unsigned DMG and zip appear under `dist-dev/`. Do not distribute the unsigned preview as a production installer.

Set up a model provider inside Atelier Desktop. Credentials from other DSH profiles are intentionally not copied. For Blender work, install Blender and `uvx`, enable the `mcp-for-blender==2.0.4` add-on in Blender, and start its server on `127.0.0.1:9876`. The connector's presence alone does not create geometry; check the tool connection and open the saved `.blend` and rendered views before treating a 3D result as delivered.

This preview is a local desktop app. It does not replace the multiuser Atelier web backend. The cloned upstream release workflow has not been adapted for Atelier publication; builds should use the local commands above.
