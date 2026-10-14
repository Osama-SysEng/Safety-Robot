"use strict";

// Central structured JSON logging (stdlib only: JSON.stringify).
// Schema per line: timestamp (UTC ISO-8601 ms) + level + service + env + version
// + request_id + event + message. Never log secrets (see REDACTED markers).
const crypto = require("crypto");

const SERVICE = process.env.SERVICE_NAME || "safety-robot-cloud-backend";
const ENV = process.env.NODE_ENV || "development";
const VERSION = process.env.GIT_SHA || "dev";
const LOG_LEVEL = (process.env.LOG_LEVEL || (ENV === "production" ? "info" : "debug")).toLowerCase();

// AsyncLocalStorage is stdlib (node:async_hooks) — no extra dependency.
const { AsyncLocalStorage } = require("node:async_hooks");
const requestStore = new AsyncLocalStorage();

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const THRESHOLD = LEVELS[LOG_LEVEL] !== undefined ? LEVELS[LOG_LEVEL] : LEVELS.info;

const REDACT_KEYS = ["password", "passwd", "token", "secret", "apikey", "api_key",
  "authorization", "cookie", "set-cookie", "cvv", "card_number", "national_id", "passport"];

function redact(obj) {
  if (Array.isArray(obj)) return obj.map(redact);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = REDACT_KEYS.some((s) => k.toLowerCase().includes(s)) ? "***" : redact(v);
    }
    return out;
  }
  return obj;
}

function newRequestId() {
  if (crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return crypto.randomBytes(8).toString("hex");
}

function getRequestId() {
  const store = requestStore.getStore();
  return (store && store.requestId) || "-";
}

function emit(level, event, message, fields) {
  if ((LEVELS[level] || 20) < THRESHOLD) return;
  const line = {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE,
    env: ENV,
    version: VERSION,
    request_id: getRequestId(),
    event,
    message,
    ...redact(fields || {}),
  };
  const out = JSON.stringify(line);
  if (level === "error" || level === "warn") process.stderr.write(out + "\n");
  else process.stdout.write(out + "\n");
}

const logger = {
  debug: (event, message, fields) => emit("debug", event, message, fields),
  info: (event, message, fields) => emit("info", event, message, fields),
  warn: (event, message, fields) => emit("warn", event, message, fields),
  error: (event, message, fields) => emit("error", event, message, fields),
};

// Express middleware: assigns/propagates X-Request-ID, binds AsyncLocalStorage,
// and emits a single access line per request (method + path + status + ms).
// Never logs query strings, headers, or bodies.
function requestIdMiddleware(req, res, next) {
  const incoming = req.get("X-Request-ID");
  const requestId = (incoming && String(incoming).slice(0, 64)) || newRequestId();
  res.setHeader("X-Request-ID", requestId);
  const startedAt = Date.now();
  requestStore.run({ requestId }, () => {
    res.on("finish", () => {
      emit("info", "http.access",
        `${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`,
        { method: req.method, path: req.path, status: res.statusCode, duration_ms: Date.now() - startedAt });
    });
    next();
  });
}

module.exports = { logger, requestIdMiddleware, newRequestId, getRequestId, requestStore };
