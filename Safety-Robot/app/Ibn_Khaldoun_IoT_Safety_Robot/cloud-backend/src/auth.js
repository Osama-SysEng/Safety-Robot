function createOperatorGuard({ tokens, operatorTokens, environment } = {}) {
  const list = tokens !== undefined ? tokens : (operatorTokens || []);
  return (req, res, next) => {
    if (environment !== "production" && list.length === 0) return next();
    if (!list.includes(req.get("x-operator-token"))) return res.status(403).json({ error: "operator authorization required" });
    return next();
  };
}
module.exports = { createOperatorGuard };
