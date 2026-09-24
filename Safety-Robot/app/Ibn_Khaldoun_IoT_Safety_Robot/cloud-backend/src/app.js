const express = require("express");
const config = require("./config");
const { createAuditLog } = require("./auditLog");
const { createIncidentService } = require("./incidentService");
const { createCommandService } = require("./commandService");
const { createOperatorGuard } = require("./auth");

function buildApp(overrides = {}) {
  const app = express(); const audit = createAuditLog();
  const runtime = { ...config, ...overrides };
  const incidents = createIncidentService({ audit });
  const commands = createCommandService({ audit, simulationOnly: runtime.simulationOnly });
  app.disable("x-powered-by"); app.use(express.json({ limit: "32kb", strict: true }));
  app.get("/health", (_req, res) => res.json({ status: "ok", mode: runtime.simulationOnly ? "simulation-only" : "locked" }));
  app.post("/api/v1/telemetry", (req, res) => { try { res.status(202).json(incidents.ingest(req.body)); } catch (error) { audit.append("telemetry_rejected", { reason: error.message }); res.status(400).json({ error: "invalid telemetry" }); } });
  app.get("/api/v1/incidents", createOperatorGuard(runtime), (_req, res) => res.json(incidents.list()));
  app.get("/api/v1/audit", createOperatorGuard(runtime), (_req, res) => res.json(audit.list()));
  app.post("/api/v1/simulation/commands", createOperatorGuard(runtime), (req, res) => { try { res.status(202).json(commands.request(req.body)); } catch (error) { res.status(409).json({ error: error.message }); } });
  return app;
}

if (require.main === module) buildApp().listen(config.port, () => console.log(`Safety Robot simulation API listening on ${config.port}`));
module.exports = { buildApp };
