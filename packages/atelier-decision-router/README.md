# Atelier decision router (experimental)

Opt-in Jev advice for **existing Skills** in the calling Agent's scope. It never loads or installs capabilities. The main model still chooses actions and loads full Skill instructions through the existing `skill` tool.

## Local use

Provide `TYPESAFE_API_KEY` to the server process through your local secret environment. The plugin is disabled unless `enabled: true` is supplied. Do not put the key in YAML, browser storage, or the repository.

In a temporary development Profile with the existing `agents`, `tools` and `skills` services, add this loader entry (adapt the path for your checkout):

```yaml
- id: atelier-jev-advice
  name: file:///Users/molin/Project/atelier-desktop/packages/atelier-decision-router/index.js
  config:
    enabled: true
    timeoutMs: 2000
```

The package declares its shared Harness peers. It is not added to the default preset, cloud image, root dependencies, or distribution bundle. The temporary Profile test copies it with explicitly linked host peers and boots it through the real loader. Production packaging and per-tenant credentials require separate integration.

## Checks and experiments

```sh
npx vitest run test/jev-router.test.ts test/jev-plugin.test.mjs test/jev-profile.test.mjs
node scripts/experiments/jev-skill-routing.mjs
# With TYPESAFE_API_KEY supplied to this process:
node scripts/experiments/jev-skill-routing.mjs --live --output /tmp/jev-experiment.json
```

The experiment uses 24 synthetic English/French tasks and the actual bundled Blender Skill description. Output files are created exclusively, never overwritten. Offline mode validates fixtures and reports only the rule baseline; it does not simulate Jev success. Live mode records advice, tokens and latency, never credentials or raw provider failures.

Requests use the [official TypeSafe API](https://docs.typesafe.ai/api), pinned to `jev-1.13.0`. Inputs are bounded to 8000 task characters, 64 candidates and 1500 description characters per candidate. Response IDs, model, probabilities and usage are validated; no response text becomes instructions. Provider requests, including body decoding, time out. No retries or cross-agent caches are used.

Registry reads rely on the Harness provider cancellation contract. Scope and catalog are rechecked before emitting advice. Full Skill instructions and plugin/attachment messages are excluded from requests. User task text still goes to TypeSafe when explicitly enabled: this is not a local-only model.

The first real run matched 24/24 developer labels; the simple rule baseline matched 20/24. With one Skill and synthetic data, this does not prove end-to-end quality or production capacity. See the [design and measured record](../../docs/jev-harness-integration-design.md).

## Full 3D comparison

The separate `scripts/experiments/jev-3d-batch.mjs` driver mounts the actual Atelier preset in a temporary Harness Profile. It compares unchanged Harness (A), the frozen keyword rule (B), and opt-in Jev advice (C), with one English and one French synthetic sculpture task. Each run has a four-minute process limit. The main model, Blender and permitted tools are shared across arms; no production settings are changed.

Use an experiment-owned Blender instance with the existing Blender MCP add-on listening on localhost:9876. **The batch resets that Blender scene between runs**; do not point it at an unsaved user scene. Supply the configured main-model credentials file from this project and `TYPESAFE_API_KEY` through the process environment:

```sh
node scripts/experiments/jev-3d-batch.mjs --root /tmp/atelier-jev-unique-run --credentials /path/to/project/.credentials.yaml --dedicated-blender
# Read-only checks of an actual generated .blend and reimported GLB:
blender -b /path/to/generated.blend --python scripts/experiments/jev-3d-validate.py -- /tmp/atelier-jev-unique-run/en-C
```

The batch uses `uvx`, Python 3.11 and `mcp-for-blender==2.0.4`. Each run writes events, metrics and actual artifacts to its own directory. The run driver refuses to overwrite a directory; the batch retains completed results when resumed. Only the selected deliverables and sanitized results should be shared: exclude Harness homes, credentials and raw logs. Geometry checks do not replace visual inspection, and one run per arm does not establish a stable quality or speed advantage.
