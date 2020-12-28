/* eslint-disable no-console */
const { proxy, sso: Sso } = require('@ovh-ux/manager-dev-server-config');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { port: defautPort, region: defaultRegion } = require('./configs');

module.exports = (
  path,
  region = defaultRegion,
  port = defautPort,
  { local2API = false, localRegistry = false, registryUrl },
) => {
  const sso = new Sso(region);

  const app = express();

  app.use(express.static(path));

  app.get('/auth', sso.auth.bind(sso));
  app.get('/auth/check', sso.checkAuth.bind(sso));

  if (local2API) {
    app.use(proxy.aapi.context, createProxyMiddleware(proxy.aapi));
  }

  const registryProxy = proxy.registry(region, {
    local: localRegistry,
    registryUrl,
  });
  app.use(createProxyMiddleware(registryProxy.context, registryProxy));

  const v6Proxy = proxy.v6(region);
  app.use(createProxyMiddleware(v6Proxy.context, v6Proxy));

  console.log('');
  console.log(`Serve: ${path} - region: ${region} - localhost:${port}`);
  console.log('');

  app.listen(port);

  return app;
};
/* eslint-enable no-console */
