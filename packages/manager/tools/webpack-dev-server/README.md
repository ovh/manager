# Manager Webpack Dev Server

> OVH manager webpack development server configuration.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-webpack-dev-server)](https://npmjs.com/package/@ovh-ux/manager-webpack-dev-server) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/webpack-dev-server)](https://npmjs.com/package/@ovh-ux/manager-webpack-dev-server?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/webpack-dev-server)](https://npmjs.com/package/@ovh-ux/manager-webpack-dev-server?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add -D @ovh-ux/manager-webpack-dev-server
```

## Usage

This configuration is meant to be merged with your webpack configuration using
the webpack-merge library.

```js
const merge = require('webpack-merge');
const devServer = require('manager-webpack-dev-server');

const devConfig = devServer.config(env);

module.exports = merge(yourWebpackConfig, devConfig);
```

## Env

The _env_ parameter is an object containing the following values:

```js
const env = {
  dev: [
    // custom configuration to proxy some routes
    {
      context, // Routes to rewrite
      nic,
      target, // API path to target
    },
  ],
  host: '0.0.0.0', // If you want your server to be accessible externally
  https: false, // true to enable https
  local2API: false, // true to make 2API calls on local 8080 port
  port: 9000, // Specify a port number to listen for requests.
  region: 'EU', // manager region (EU, CA, US)
};
```

## Related

* [manager-webpack-config](https://github.com/ovh/manager/tree/master/packages/manager/tools/webpack-config) - OVH manager shared webpack configuration

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
