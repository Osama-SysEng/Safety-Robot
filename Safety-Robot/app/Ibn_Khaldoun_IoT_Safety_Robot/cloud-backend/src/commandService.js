function createCommandService({ audit, simulationOnly }) {
  const requests = [];
  return Object.freeze({
    request({ deviceId, command, operator }) {
      if (!simulationOnly) throw new Error("field control is not available in this release");
      if (!/^simulate_(inspect|stop|alert)$/.test(command)) throw new Error("only simulation commands are permitted");
      const request = Object.freeze({ id: `command_${requests.length + 1}`, deviceId, command, operator, status: "simulation-recorded", delivery: "not-attempted", createdAt: Date.now() });
      requests.push(request); audit.append("simulation_command_recorded", { requestId: request.id, command, operator });
      return request;
    },
    list() { return requests.slice().reverse(); },
  });
}
module.exports = { createCommandService };
