const asList = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);
const asPort = (value) => {
  const port = Number(value || 3000);
  return Number.isFinite(port) && port > 0 && port < 65536 ? port : 3000;
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
});
