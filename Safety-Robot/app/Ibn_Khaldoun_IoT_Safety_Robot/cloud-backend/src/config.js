const asList = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);

module.exports = Object.freeze({
  environment: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  allowedOrigins: asList(process.env.ALLOWED_ORIGINS || "http://localhost:5173"),
  simulationOnly: process.env.SIMULATION_ONLY !== "false",
  operatorTokens: asList(process.env.OPERATOR_TOKENS),
  maxTelemetryAgeMs: Number(process.env.MAX_TELEMETRY_AGE_MS || 30_000),
});
