const { SEVERITIES } = require("./contracts");

const DEFAULT_POLICY = Object.freeze({
  gasWatch: 350, gasCritical: 500,
  temperatureWatch: 65, temperatureCritical: 85,
  smokeWatch: 300, smokeCritical: 500,
});

function classify(readings, policy = DEFAULT_POLICY) {
  const critical = readings.gasIndex >= policy.gasCritical || readings.temperatureC >= policy.temperatureCritical || readings.smokeIndex >= policy.smokeCritical;
  const watch = readings.gasIndex >= policy.gasWatch || readings.temperatureC >= policy.temperatureWatch || readings.smokeIndex >= policy.smokeWatch;
  const severity = critical ? "critical" : watch ? "watch" : "normal";
  if (!SEVERITIES.has(severity)) throw new Error("invalid classification");
  return Object.freeze({
    severity,
    recommendedAction: critical ? "isolate-and-verify-by-qualified-operator" : watch ? "inspect-and-monitor" : "continue-simulation-monitoring",
    fieldActuation: "prohibited-by-software-policy",
  });
}

module.exports = { DEFAULT_POLICY, classify };
