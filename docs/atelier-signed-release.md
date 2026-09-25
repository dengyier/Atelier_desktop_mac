# Atelier Desktop signed macOS release

The [Atelier signed release workflow](../.github/workflows/atelier-signed-release.yml) builds the production `Atelier Desktop` app for Apple Silicon. It checks the app's Developer ID team, signature, Apple notarization ticket, and the signed/notarized DMG before publishing a GitHub Release and an OCI artifact in GitHub Packages. The OCI artifact contains the same DMG, ZIP, and `SHA256SUMS`; it is not a Docker image. Automatic updates are not enabled.

This workflow is **not ready to produce a signed release until an Apple Developer Program team and its credentials exist**. The unsigned [preview workflow](atelier-preview-release.md) remains a separate distribution channel. Do not run the inherited `Release desktop installers` workflow for Atelier: it still uses DSH-specific release settings.

## One-time Apple setup

1. Enroll the publisher in the [Apple Developer Program](https://developer.apple.com/programs/). An individual or organization team must own the release identity. The DSH project certificate must not be reused for Atelier.
2. In that team, create a **Developer ID Application** certificate for distribution outside the Mac App Store. Export the certificate **with its private key** as a password-protected `.p12` from Keychain Access. Record the Apple Team ID.
3. Create an [App Store Connect API key](https://appstoreconnect.apple.com/access/integrations/api) authorized for notarization. Download its `.p8` file once, and record its Key ID and Issuer ID. Keep the `.p12` and `.p8` outside Git.
4. In this repository's **Settings → Secrets and variables → Actions**, create these repository secrets:

   | Secret | Value |
   | --- | --- |
   | `ATELIER_CSC_LINK` | Base64 text of the entire `.p12` file (`base64 < certificate.p12 | tr -d '\n'`) |
   | `ATELIER_CSC_KEY_PASSWORD` | Password used to export that `.p12` |
   | `ATELIER_APPLE_API_KEY` | Full text of the downloaded `.p8` file |
   | `ATELIER_APPLE_API_KEY_ID` | App Store Connect key ID |
   | `ATELIER_APPLE_API_ISSUER` | App Store Connect issuer ID |
   | `ATELIER_APPLE_TEAM_ID` | Apple Developer Team ID that owns the certificate |

Only repository maintainers with release access should edit the workflow or trigger it. Rotate the credentials if they are exposed. Never put private keys or passwords in an issue, chat, commit, or workflow log.

## Publish and verify

First commit the intended stable version in both `package.json` and `package-lock.json`. Run **Publish signed Atelier Desktop for macOS** from `main` with that new version, such as `0.1.0`. The workflow rejects a mismatched source version or an existing `atelier-v<version>` tag or Release. It runs tests and type checking, builds with the production app ID `space.artsmart.atelier.desktop`, signs and notarizes the app and DMG, verifies the Apple Team ID and Gatekeeper acceptance, then creates the Release and GHCR artifact. It does not publish an update feed.

After the run, inspect its signing and notarization steps. Download the Release's DMG, ZIP, and `SHA256SUMS` to one directory and run `shasum -a 256 -c SHA256SUMS`. Check the GHCR manifest with `oras manifest fetch ghcr.io/dengyier/atelier_desktop_mac:<version>`. On a separate macOS profile, install the DMG and test launch, model configuration, a basic conversation, and a file handoff. A green CI run verifies the checks in the workflow; it does not replace this installation check.

If GitHub Release succeeds but the later package publication fails, leave the published Release assets intact. Investigate the failed step and republish only those exact verified assets; do not reuse a version for a different build. Signing and notarization credentials remain prerequisites for any new release.
