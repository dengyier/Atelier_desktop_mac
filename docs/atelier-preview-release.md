# Atelier Desktop preview distribution

Atelier Desktop publishes an unsigned macOS Apple Silicon preview. The GitHub Release contains the DMG, ZIP, and SHA-256 checksums. GitHub Packages stores the same files as an OCI artifact for developer retrieval; it is not a Docker image and cannot be run with `docker run`. Neither channel is a signed, notarized production release or an automatic update feed.

## Publish

Run the [Publish Atelier Desktop preview](../.github/workflows/atelier-preview.yml) workflow from `main` with a unique version such as `0.1.0-preview.1`. The workflow runs tests and type checking, creates the package on a native Apple Silicon runner, verifies the ZIP and checksums, then publishes the GitHub prerelease and GHCR artifact. It rejects an existing Release tag to avoid silently replacing a published build. Do not run the inherited `Release desktop installers` workflow for an Atelier release: it still contains DSH signing, naming, and ModelScope settings.

The Release tag is `atelier-v<version>`. The package is `ghcr.io/dengyier/atelier-desktop:<version>`. Both point to the same workflow run and source commit. A failed workflow must be investigated before publication is described as complete; if the Release exists but the package step failed, repair the workflow and publish a new preview version rather than replacing its assets.

## Verify

Check that the Release is marked **Pre-release** and contains exactly the DMG, ZIP, and `SHA256SUMS`. Download the assets and run `shasum -a 256 -c SHA256SUMS` in their directory. The package manifest can be checked with `oras manifest fetch ghcr.io/dengyier/atelier-desktop:<version>`, and its files retrieved with `oras pull`. Compare its checksums with the Release assets. Finally, install the preview on a separate macOS profile and exercise launch, model configuration, a basic session, and one file handoff.

Apple Silicon users may need to explicitly allow an unsigned app in macOS. Do not describe this preview as Apple-signed or notarized. Blender workflows additionally require Blender and the `mcp-for-blender` service.
