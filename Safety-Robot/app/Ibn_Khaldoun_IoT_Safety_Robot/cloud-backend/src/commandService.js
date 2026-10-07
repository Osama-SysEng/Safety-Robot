function assertIdentity(value, name) {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 128) throw new Error(`${name} is invalid`);
  return value.trim();
}

function createCommandService({ audit, simulationOnly }) {
  if (!audit || typeof audit.append !== "function") throw new Error("audit log is required");
  const requests = [];
  return Object.freeze({
    request({ deviceId, command, operator } = {}) {
      const safeDevice = assertIdentity(deviceId, "deviceId");
      const safeOperator = assertIdentity(operator, "operator");
      if (!simulationOnly) throw new Error("field control is not available in this release");
      if (typeof command !== "string" || !/^simulate_(inspect|stop|alert)$/.test(command)) throw new Error("only simulation commands are permitted");
      const request = Object.freeze({ id: `command_${requests.length + 1}`, deviceId: safeDevice, command, operator: safeOperator, status: "simulation-recorded", delivery: "not-attempted", createdAt: Date.now() });
      requests.push(request); audit.append("simulation_command_recorded", { requestId: request.id, command, operator });
      return request;
    },
    list() { return requests.slice().reverse(); },
  });
}
module.exports = { createCommandService };
