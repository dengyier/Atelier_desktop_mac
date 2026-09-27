# Atelier Web multiuser gateway prototype

The browser flow is **anonymous browser cookie → personal Harness runner → Settings → Models → personal provider API key → task**. The gateway does not require an Atelier account or application login. Desktop and the local `npm run web:dev` preview retain their own independent data.

Web Cloud initializes the user settings language to English when no explicit locale preference exists. Later language choices are preserved. The browser preview notice and desktop download link appear at the bottom of the page without a card border; short windows use an inline layout to avoid covering the composer.

## Local smoke setup

Build the runner image from the repository root:

```sh
docker build -f deploy/Dockerfile.web-runner -t atelier-web-runner:dev .
```

Set `ATELIER_WEB_ORIGIN` and `ATELIER_WEB_IMAGE=atelier-web-runner:dev`, then run `npm run web:cloud`. The gateway listens only on `127.0.0.1` at `ATELIER_WEB_PORT` (default `18081`). For a local gateway, use a matching `http://127.0.0.1:18081` origin.

The gateway issues an HttpOnly, SameSite anonymous tenant cookie. A new browser cookie creates a new stable tenant and therefore a separate runner; clearing the cookie creates a new tenant and does not recover the previous workspace. The browser never sees the Harness launch token. The runner redacts the launch URL from Docker logs and stores it in container tmpfs; the gateway reads it with Docker exec, exchanges it, then proxies requests with the private Harness session cookie. Logging must not include tokens, cookies, API keys, request bodies, or query strings.

Each user ID is hashed into a Docker container and named-volume identifier. The volume stores that user's Harness home, including `settings.yaml`, `.credentials.yaml`, sessions, and workspace files. The container has no Docker socket, uses a read-only root filesystem with a writable private volume, drops Linux capabilities, and has CPU, memory, and PID limits. Runner containers are reached only through host-loopback published ports. The configured provider key is entered inside Harness's existing Settings → Models UI; no global model key is passed into the image. A new user also chooses their private `/data/workspace` directory in the workspace picker before sending a task.

## Current boundary before public launch

- This is a bounded prototype with `ATELIER_WEB_MAX_ACTIVE` (default 16). It does not yet queue users, hibernate idle runners, migrate runners between hosts, or support 1,000 concurrent users. The gateway process is stateless with respect to browser identity; tenant routing is carried by the HttpOnly cookie, but a second gateway instance still needs shared Docker access and deterministic routing to the same runner host.
- A container per user protects homes from accidental mixing. The Harness agent can still read its own `.credentials.yaml`, as documented by upstream. Do not describe this as a secret vault. Production needs a credential proxy if keys must be inaccessible to tools.
- Docker's default bridge network and the host Docker daemon remain an operational trust boundary. Use a dedicated rootless Docker service or isolated worker nodes; do not add the gateway user to a privileged Docker group on a public host. Apply egress controls and storage quotas before production.
- The current production dependency graph pulls `image-size@1.2.1` through `pptxgenjs`; npm reports high-severity image parser denial-of-service advisories, and the compatible `image-size` 1.x line has no patched release. Do not accept untrusted image uploads on a public launch until the PPT dependency path is updated and retested.
- Verify WebSocket streaming, file upload/download, long-running task interruption, model-key persistence, two-browser isolation, cookie loss behavior, backup and recovery, and resource exhaustion against the actual release image. Local unit tests and a runner startup smoke do not establish that acceptance.
- The former `deploy/atelier-web.service` and `deploy/atelier-web.nginx.conf` describe the rolled-back single-user preview. Use `deploy/atelier-web-cloud.service` and `deploy/atelier-web-cloud.nginx.conf` for a protected multiuser preview only. The latter retains HTTP Basic authentication until the public-launch issues above are resolved.

## Protected server preview

Install the runner image on the server, then run the gateway as an unprivileged `atelierweb` user with access to **its own rootless Docker daemon**. Do not grant the gateway account membership in the host's rootful `docker` group. Use a dedicated data directory at `/home/atelier_web`; the runner volumes are owned by the rootless daemon. The service template expects Node at `/opt/atelier-node/bin/node` and its environment at `/etc/atelier-web-cloud.env` (mode `0600`). Example non-secret values:

```text
ATELIER_WEB_ORIGIN=https://at.artsmart.space
ATELIER_WEB_IMAGE=atelier-web-runner:<deployed-commit>
ATELIER_WEB_MAX_ACTIVE=4
ATELIER_WEB_PORT=18081
DOCKER_HOST=unix:///run/user/<atelierweb-uid>/docker.sock
```

Install the supplied `at.artsmart.space` certificate and matching private key as `/etc/nginx/ssl/at.artsmart.space/fullchain.pem` and `privkey.pem` (private key mode `0600`, root owned). Ensure the Basic Auth password file exists and is not committed. Enable the new service, replace the old preview's Nginx site only after `nginx -t` succeeds, then verify the HTTPS certificate, anonymous cookie isolation, model setup, WebSocket traffic, and file transfer from a browser. A rollback restores the old Nginx site or disables this subdomain and stops only `atelier-web-cloud.service`; preserve named tenant volumes. Do not reset user data during rollout or rollback.

### Public-domain settings and first workspace

The Cloud runner sets `ATELIER_WEB_CLOUD=1` and applies `build/atelier-web-cloud.patch.yml` after the shared Desktop overlay. Its runner marks the boot HTML with `__ATELIER_CLOUD_SETTINGS__`; the settings patch enables the settings mirror against the browser's private container; ordinary remote Harness sites keep the upstream process-local default. The replayable `dsh-client-ui-settings` patch can be removed when upstream offers equivalent remote-host persistence configuration.

The Cloud-only workspace bootstrap registers `/data/workspace` through `workspaceRegistry` when the registry is empty. Existing workspaces, sessions and credentials remain in their original tenant volume; local Desktop data is not copied to the server.
