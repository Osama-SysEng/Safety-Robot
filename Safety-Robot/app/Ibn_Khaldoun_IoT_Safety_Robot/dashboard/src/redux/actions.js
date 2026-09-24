export const setSensors = (data) => ({ type: "UPDATE_SENSORS", payload: data });
export const addIncident = (incident) => ({ type: "ADD_INCIDENT", payload: incident });
export const toggleRemoteControl = (value) => ({ type: "TOGGLE_REMOTE_CONTROL", payload: value });
export const updatePosition = (pos) => ({ type: "UPDATE_POSITION", payload: pos });
