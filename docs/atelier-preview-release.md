# Atelier Desktop preview distribution

The existing `atelier-v0.1.0-preview.1` DMG is affected by an incomplete app bundle signature and should not be used. The ad-hoc signing and bundle verification described below apply to the next preview build; the existing Release asset is not replaced.

Atelier Desktop publishes an ad-hoc-signed macOS Apple Silicon preview. The GitHub Release contains the DMG, ZIP, and SHA-256 checksums. GitHub Packages stores the same files as an OCI artifact for developer retrieval; it is not a Docker image and cannot be run with `docker run`. Ad-hoc signing seals the app bundle but does not establish an Apple Developer identity or notarization. Neither channel is a notarized production release or an automatic update feed. The separate [signed release workflow](atelier-signed-release.md) requires Apple Developer credentials.

## Publish

Run the [Publish Atelier Desktop preview](../.github/workflows/atelier-preview.yml) workflow from `main` with a unique version such as `0.1.0-preview.2`. The workflow runs tests and type checking, creates the package on a native Apple Silicon runner, verifies the ZIP and checksums, then publishes the GitHub prerelease and GHCR artifact. It rejects an existing Release tag to avoid silently replacing a published build. Do not run the inherited `Release desktop installers` workflow for an Atelier release: it still contains DSH signing, naming, and ModelScope settings.

The Release tag is `atelier-v<version>`. The package is `ghcr.io/dengyier/atelier_desktop_mac:<version>`. Both contain the same DMG, ZIP, and checksums. A failed workflow must be investigated before publication is described as complete. If the Release exists but the package step failed, run [Recover Atelier preview package](../.github/workflows/atelier-package-recovery.yml) for that version. It checks the published files before pushing them to GHCR; do not replace the Release assets.

## Verify

Check that the Release is marked **Pre-release** and contains exactly the DMG, ZIP, and `SHA256SUMS`. Download the assets and run `shasum -a 256 -c SHA256SUMS` in their directory. The package manifest can be checked with `oras manifest fetch ghcr.io/dengyier/atelier_desktop_mac:<version>`, and its files retrieved with `oras pull`. Compare its checksums with the Release assets. Finally, install the preview on a separate macOS profile and exercise launch, model configuration, a basic session, and one file handoff.

Apple Silicon users may need to explicitly allow this unnotarized app in macOS Privacy & Security. Do not describe this preview as Developer ID signed or notarized. Blender workflows additionally require Blender and the `mcp-for-blender` service.
