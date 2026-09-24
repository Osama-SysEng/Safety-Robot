const EVENT_TYPES = new Set(["gas", "temperature", "smoke", "device_health"]);
const SEVERITIES = new Set(["normal", "watch", "critical"]);

function assertString(value, name, max = 128) {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) throw new Error(`${name} is invalid`);
  return value.trim();
}

function assertFinite(value, name, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${name} is outside accepted simulation bounds`);
  return value;
}

function validateTelemetry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("telemetry must be an object");
  const deviceId = assertString(input.deviceId, "deviceId", 64);
  const occurredAt = assertFinite(Number(input.occurredAt), "occurredAt", 1, Date.now() + 60_000);
  const readings = input.readings || {};
  return Object.freeze({
    deviceId,
    occurredAt,
    sequence: assertFinite(Number(input.sequence), "sequence", 0, Number.MAX_SAFE_INTEGER),
    location: Object.freeze({
      lat: assertFinite(Number(input.location?.lat), "location.lat", -90, 90),
      lng: assertFinite(Number(input.location?.lng), "location.lng", -180, 180),
    }),
    readings: Object.freeze({
      gasIndex: assertFinite(Number(readings.gasIndex), "readings.gasIndex", 0, 10_000),
      temperatureC: assertFinite(Number(readings.temperatureC), "readings.temperatureC", -40, 180),
      smokeIndex: assertFinite(Number(readings.smokeIndex), "readings.smokeIndex", 0, 10_000),
    }),
  });
}

module.exports = { EVENT_TYPES, SEVERITIES, validateTelemetry };
