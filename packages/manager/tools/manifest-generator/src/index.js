const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const glob = require('glob-promise');
const { parseRoutes } = require('./uirouter');

const generateManifest = async (basePath, { name, manifestFileName }) => {
  const files = await glob(path.resolve(basePath, '**', '*.js'));

  const sources = files.map((file) => readFileSync(file).toString());

  const routes = parseRoutes(sources);

  const manifest = {
    name,
    routes,
  };

  writeFileSync(
    path.resolve(basePath, manifestFileName),
    JSON.stringify(manifest, null, 2),
  );

  return manifest;
};

module.exports = {
  generateManifest,
};
