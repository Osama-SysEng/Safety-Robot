const express = require("express");
const config = require("./config");
const { createAuditLog } = require("./auditLog");
const { createIncidentService } = require("./incidentService");
const { createCommandService } = require("./commandService");
const { createOperatorGuard } = require("./auth");

// Helmet-equivalent security headers without an extra dependency
// (express only; keeps offline `npm install` working).
function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  next();
}

function corsGuard(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.get("origin");
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Operator-Token");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  };
}

// Minimal in-memory fixed-window rate limiter (no extra dependency).
function rateLimiter({ windowMs, max }) {
  const hits = new Map();
  const handler = (req, res, next) => {
    const key = req.ip || "unknown";
    const nowMs = Date.now();
    const windowStart = nowMs - windowMs;
    const stamps = (hits.get(key) || []).filter((stamp) => stamp > windowStart);
    stamps.push(nowMs);
    hits.set(key, stamps);
    if (hits.size > 10_000) hits.clear();
    if (stamps.length > max) return res.status(429).json({ error: "rate limit exceeded" });
    return next();
  };
  handler.clear = () => hits.clear();
  return handler;
}

function buildApp(overrides = {}) {
  const app = express(); const audit = createAuditLog();
  const runtime = { ...config, ...overrides };
  const incidents = createIncidentService({ audit, maxTelemetryAgeMs: runtime.maxTelemetryAgeMs });
  const commands = createCommandService({ audit, simulationOnly: runtime.simulationOnly });
  const limiter = rateLimiter({ windowMs: runtime.rateLimitWindowMs, max: runtime.rateLimitMax });
  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(corsGuard(runtime.allowedOrigins));
  app.use(limiter);
  app.use(express.json({ limit: "32kb", strict: true }));
  // Malformed JSON must return JSON, not the default HTML error page.
  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, next) => {
    if (error && (error.type === "entity.parse.failed" || error instanceof SyntaxError)) {
      audit.append("telemetry_rejected", { reason: "malformed json" });
      return res.status(400).json({ error: "invalid telemetry" });
    }
    return next(error);
  });
  app.get("/health", (_req, res) => res.json({ status: "ok", mode: runtime.simulationOnly ? "simulation-only" : "locked" }));
  app.post("/api/v1/telemetry", (req, res) => { try { res.status(202).json(incidents.ingest(req.body)); } catch (error) { audit.append("telemetry_rejected", { reason: error.message }); res.status(400).json({ error: "invalid telemetry" }); } });
  app.get("/api/v1/incidents", createOperatorGuard(runtime), (_req, res) => res.json(incidents.list()));
  app.get("/api/v1/audit", createOperatorGuard(runtime), (_req, res) => res.json(audit.list()));
  app.get("/api/v1/simulation/commands", createOperatorGuard(runtime), (_req, res) => res.json(commands.list()));
  app.post("/api/v1/simulation/commands", createOperatorGuard(runtime), (req, res) => { try { res.status(202).json(commands.request(req.body)); } catch (error) { res.status(409).json({ error: error.message }); } });
  app.use((_req, res) => res.status(404).json({ error: "not found" }));
  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => res.status(500).json({ error: "internal error" }));
  return app;
}

if (require.main === module) buildApp().listen(config.port, () => console.log(`Safety Robot simulation API listening on ${config.port}`));
module.exports = { buildApp };
