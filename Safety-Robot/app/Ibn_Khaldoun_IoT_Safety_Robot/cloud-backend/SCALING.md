# SCALING — Safety Robot cloud-backend (simulation-only)

## Bottlenecks (current)
1. **In-memory state** — incidents (`MAX_RETAINED = 1000` ring in
   `src/incidentService.js`), audit log (unbounded array in `src/auditLog.js`),
   commands (unbounded array in `src/commandService.js`). Restart = data loss;
   audit/commands grow without bound per process lifetime.
2. **Unbounded list responses** — fixed: `GET /api/v1/incidents`,
   `GET /api/v1/audit`, `GET /api/v1/simulation/commands` now accept
   `limit` (default 50, max 500) + `offset` (default 0). Service-level
   `list()` still returns newest-first full arrays (used by unit tests).
3. **Rate limiter is in-memory per process** (`src/app.js:rateLimiter`,
   fixed window per IP, map cleared past 10 000 keys) — restarts reset it.
4. **No DB / no connection pool** — by design (simulation store); nothing
   to tune here.

## Hardening already present + added
- Security headers: custom `securityHeaders` middleware (nosniff, DENY
  framing, no-referrer, restrictive CSP) — equivalent of `helmet` without
  the dependency; `x-powered-by` disabled; strict CORS allowlist + 204 preflight.
- JSON body: explicit `express.json({ limit: JSON_BODY_LIMIT, strict: true })`
  (default `32kb`); malformed JSON returns JSON 400, never an HTML error page.
- Compression: `compression` middleware (threshold 1024 bytes) added —
  `npm install compression` (now in `dependencies`).

## Tuning variables (.env.example)
| Variable | Default | Effect |
|---|---|---|
| `RATE_LIMIT_WINDOW_MS` | 60000 | Fixed-window length per IP |
| `RATE_LIMIT_MAX` | 120 | Max requests per window per IP |
| `JSON_BODY_LIMIT` | `32kb` | Express JSON body cap |
| `DEFAULT_PAGE_LIMIT` | 50 | List default page size |
| `MAX_PAGE_LIMIT` | 500 | List max page size (clamped) |
| `MAX_TELEMETRY_AGE_MS` | 30000 | Stale-telemetry rejection threshold |

## Remaining capacity limits (honest)
- In-memory everything: one process holds ≈1000 incidents + full audit/command
  history; sustained telemetry ingest grows RSS until restart. A persistent
  store with TTL is the real fix.
- No clustering/Redis: N replicas ≈ N× rate limit and divergent state.
  Telemetry dedupe (`deviceId:sequence` set) is per process only.
- gzip helps dashboard polling payloads but does not reduce JSON parse cost;
  keep `JSON_BODY_LIMIT` small — raising it increases worst-case parse CPU.
