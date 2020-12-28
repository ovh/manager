# Manager Webpack Config

> Extensible webpack configuration for the OVH Manager.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-webpack-config)](https://npmjs.com/package/@ovh-ux/manager-webpack-config) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/webpack-config)](https://npmjs.com/package/@ovh-ux/manager-webpack-config?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/webpack-config)](https://npmjs.com/package/@ovh-ux/manager-webpack-config?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add -D @ovh-ux/manager-webpack-config
```

## Usage

The webpack configuration can be imported and extended in the manager.
To import the configuration, simply add manager-webpack-config as a devDependency.

In order to use and extends this configuration, some manager relative parameters needs
to be provided. Please refer to the parameters and example below.

### Parameters

The following configuration parameters needs to be _provided_:

- _template_: path to manager main template file
- _basePath_: the base path of the manager
- _lessPath_: manager paths containing less files
- _root_: root path of the manager
- _assets.files_: see [https://github.com/webpack-contrib/copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)

The following configuration parameters are _optionals_:
- _assets.options_: see [https://github.com/webpack-contrib/copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)
- _translationsRoot_: by default, ui-router-translation loader resolves translations
   relatively to the current resource path. You can override this behavior by providing
   an absolute translationsRoot path. This path will then be used to resolve translations
   instead of current resource path.
- _lessJavascriptEnabled_: adds _javascriptEnabled_ option to the less compiler

## Example

```js
// import config and initialize parameters
const { config } = require('@ovh-ux/manager-webpack-config')({
  template: './client/index.html',
  basePath: './client',
  lessPath: ['./client/app', './client/components', './node_modules'],
  root: path.resolve(__dirname, './client/app'),
  assets: {
    files: [
      {
        from: path.resolve(__dirname, './client/app/common/assets'),
        to: 'assets',
      },
    ],
  },
});

// merge the configuration and export it
module.exports = merge(config, {
  entry: _.assign({
    main: './client/app/index.js',
  }),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js',
  },
});
```

## Related

* [manager-webpack-dev-server](https://github.com/ovh/manager/tree/master/packages/manager/tools/webpack-dev-server) - OVH manager webpack development server configuration

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
