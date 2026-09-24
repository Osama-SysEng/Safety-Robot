function createOperatorGuard({ tokens, environment }) {
  return (req, res, next) => {
    if (environment !== "production" && tokens.length === 0) return next();
    if (!tokens.includes(req.get("x-operator-token"))) return res.status(403).json({ error: "operator authorization required" });
    return next();
  };
}
module.exports = { createOperatorGuard };
