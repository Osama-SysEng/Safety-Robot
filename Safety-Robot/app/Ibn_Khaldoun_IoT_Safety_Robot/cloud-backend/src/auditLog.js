function createAuditLog() {
  const events = [];
  return Object.freeze({
    append(type, details = {}) {
      const entry = Object.freeze({ id: `audit_${events.length + 1}`, type, details: Object.freeze({ ...details }), at: Date.now() });
      events.push(entry); return entry;
    },
    list() { return events.slice().reverse(); },
  });
}
module.exports = { createAuditLog };
