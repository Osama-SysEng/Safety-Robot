const asList = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);
const asPort = (value) => {
  const port = Number(value || 3000);
  return Number.isFinite(port) && port > 0 && port < 65536 ? port : 3000;
};

const asPositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
};

module.exports = Object.freeze({
  environment: process.env.NODE_ENV || "development",
  port: asPort(process.env.PORT),
  allowedOrigins: asList(process.env.ALLOWED_ORIGINS || "http://localhost:5173"),
  simulationOnly: process.env.SIMULATION_ONLY !== "false",
  operatorTokens: asList(process.env.OPERATOR_TOKENS),
  maxTelemetryAgeMs: Number(process.env.MAX_TELEMETRY_AGE_MS || 30_000),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || "32kb",
  defaultPageLimit: asPositiveInt(process.env.DEFAULT_PAGE_LIMIT, 50, 500),
  maxPageLimit: asPositiveInt(process.env.MAX_PAGE_LIMIT, 500, 500),
});
