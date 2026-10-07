const { validateTelemetry } = require("./contracts");
const { classify } = require("./safetyPolicy");

function createIncidentService({ audit, now = () => Date.now(), maxTelemetryAgeMs = 30_000 } = {}) {
  if (!audit || typeof audit.append !== "function") throw new Error("audit log is required");
  const seen = new Set(); const incidents = [];
  const MAX_RETAINED = 1000;
  return Object.freeze({
    ingest(raw) {
      const telemetry = validateTelemetry(raw);
      if (now() - telemetry.occurredAt > maxTelemetryAgeMs) throw new Error("telemetry is stale");
      const dedupeKey = `${telemetry.deviceId}:${telemetry.sequence}`;
      if (seen.has(dedupeKey)) return { accepted: true, duplicate: true, incident: null };
      seen.add(dedupeKey);
      const decision = classify(telemetry.readings);
      const incident = Object.freeze({ id: `incident_${incidents.length + 1}`, telemetry, decision, status: "simulation-open", createdAt: now() });
      incidents.push(incident);
      if (incidents.length > MAX_RETAINED) {
        const evicted = incidents.shift();
        seen.delete(`${evicted.telemetry.deviceId}:${evicted.telemetry.sequence}`);
      }
      audit.append("telemetry_ingested", { incidentId: incident.id, deviceId: telemetry.deviceId, severity: decision.severity });
      return { accepted: true, duplicate: false, incident };
    },
    list() { return incidents.slice().reverse(); },
  });
}
module.exports = { createIncidentService };
