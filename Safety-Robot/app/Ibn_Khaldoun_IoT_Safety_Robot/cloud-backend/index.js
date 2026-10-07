const { buildApp } = require("./src/app");
const config = require("./src/config");
const app = buildApp();
if (require.main === module) app.listen(config.port, () => console.log(`Safety Robot simulation API listening on ${config.port}`));
module.exports = app;
