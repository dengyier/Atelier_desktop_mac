---
name: atelier-blender-workflow
description: Use for art installations, geometric sculptures, exhibition scenes, and other tasks that require a real Blender model and verifiable visual deliverables.
---

# Atelier Blender workflow

1. Identify the artistic subject, dimensions, materials, scene context, views, and editable deliverables. If a dimension or material is unspecified, make a visible assumption.
2. Check `mcp__blender__get_addon_status` before modeling. If the tool is unavailable, explain that `uvx`, Blender, or the Blender MCP add-on must be installed and connected. Never claim a Blender run occurred when it did not.
3. Build the geometry with Blender MCP. Keep named objects and editable materials; save the `.blend` file in the workspace's output directory.
4. Render at least two distinct views. Open and inspect the resulting images. Check framing, lighting, silhouette, visible details, and whether objects are cut off. Revise and rerender when needed.
5. Export a GLB when requested. Reopen or inspect the exported geometry independently of the source scene.
6. Deliver the actual files as file artifacts with clear names. State which checks were performed and which visual claims still need human review. A path mentioned in prose is not a delivered file.

Do not silently replace a requested modeled 3D artifact with an image or parameterized placeholder.
