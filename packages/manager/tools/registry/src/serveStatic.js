/* eslint-disable no-console */
const express = require('express');

module.exports = (rootPath, port = 8888) => {
  const app = express();
  app.use(express.static(rootPath));
  app.listen(port);
  console.log(`Serve: ${rootPath} - localhost:${port}`);
  return app;
};
/* eslint-enable no-console */
