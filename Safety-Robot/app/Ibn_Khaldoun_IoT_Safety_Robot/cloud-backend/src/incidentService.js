const { validateTelemetry } = require("./contracts");
const { classify } = require("./safetyPolicy");

function createIncidentService({ audit, now = () => Date.now() }) {
  const seen = new Set(); const incidents = [];
  return Object.freeze({
    ingest(raw) {
      const telemetry = validateTelemetry(raw);
      const dedupeKey = `${telemetry.deviceId}:${telemetry.sequence}`;
      if (seen.has(dedupeKey)) return { accepted: true, duplicate: true, incident: null };
      seen.add(dedupeKey);
      const decision = classify(telemetry.readings);
      const incident = Object.freeze({ id: `incident_${incidents.length + 1}`, telemetry, decision, status: "simulation-open", createdAt: now() });
      incidents.push(incident);
      audit.append("telemetry_ingested", { incidentId: incident.id, deviceId: telemetry.deviceId, severity: decision.severity });
      return { accepted: true, duplicate: false, incident };
    },
    list() { return incidents.slice().reverse(); },
  });
}
module.exports = { createIncidentService };
