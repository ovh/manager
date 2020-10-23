# Component Rollup Configuration

> Extensible Rollup configuration to build OVHcloud components.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/component-rollup-config)](https://npmjs.com/package/@ovh-ux/component-rollup-config) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/component-rollup-config)](https://npmjs.com/package/@ovh-ux/component-rollup-config?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/component-rollup-config)](https://npmjs.com/package/@ovh-ux/component-rollup-config?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
$ yarn add -D @ovh-ux/component-rollup-config
```

## Usage

```js
import configGenerator from '@ovh-ux/component-rollup-config';

// generate your configuration with global options
const config = configGenerator({
  input: './src/my-library.js',
});

// export desired list of target(s)
export default [
  // ES6 module
  config.es(),

  // CommonJS
  config.cjs(),

  // UMD (Universal Module Definition)
  config.umd({
    output: {
      globals: {
        angular: 'angular',
        jquery: '$',
      },
    },
  }),

  // IIFE (Immediately Invoked Function Expression)
  config.iife({
    output: {
      globals: {
        angular: 'angular',
        jquery: '$',
      },
    },
  }),
];
```

## Plugins

This configuration provides some plugins to facilitate loading and importing of ovh translations ; as well as a plugin to facilitate less imports.

### translation-xml

Convert translation XML files to JavaScript.

```xml
<translations>
  <translation id="foo" qtlid="1">Foo</translation>
  <translation id="bar" qtlid="2">Bar</translation>
</translations>
```

```js
export default { foo: 'Foo', bar: 'Bar' };
```

### translation-ui-router

Handle `translations` property in ui-router state declaration to dynamically load ovh translations when state is resolved.

```js
// will import `./translations` and `../common/translations` during ui-router state resolve
$stateProvider.state('my-state', {
  url: 'some-template.html',
  translations: ['.', '../common'],
});
```

### translation-inject

Handle `@ngTranslationsInject` comment in order to facilitate dynamic import of ovh translations.

The format is as follows: `@ngTranslationsInject:{format} [translations]`

`format` is a string which represent the format of translations files (XML, json, ...)
`translations` is multiple strings separated by a space

```js
// Load .translations and ../common/translations in xml
angular
  .module('myModule', [])
  .run(/* @ngTranslationsInject ./translations ../common/translations */);

// Load .translations and ../common/translations in xml
angular
  .module('myModule', [])
  .run(/* @ngTranslationsInject:xml ./translations ../common/translations */);

// Load .translations and ../common/translations in json
angular
  .module('myModule', [])
  .run(/* @ngTranslationsInject:json ./translations ../common/translations */);
```

```js
import angular from 'angular';

class MyController {
  /* @ngInject */
  constructor($injector) {
    this.$injector = $injector;
  }

  $onInit() {
    this.isLoading = true;
    return this.$injector
      .invoke(/* @ngTranslationsInject ./translations ./some/other/path */)
      .finally(() => {
        this.isLoading = false;
      });
  }
}

angular.module('myModule', []).controller('myController', MyController);
```

### rollup-plugin-less-tilde-importer

Provides ~ (tilde) prefix to tell less compiler that it should resolve imports using a configured array of paths.

```js
import configGenerator from '@ovh-ux/component-rollup-config';

const config = configGenerator(
  {
    input: './src/my-library.js',
  },
  {
    lessTildeImporter: {
      paths: ['/foo/bar', '/hello/world'],
    },
  },
);

export default [config.cjs()];
```

```less
// try importing bootstrap from '/foo/bar/bootstrap' then from '/hello/world/bootstrap'
@import '~bootstrap';
```

### Performance

Regarding the translations related plugins, it's possible to only process translations files for a single language. Please refer to the example below. This can be useful if you want faster builds in your development environment for example.

```js
import configGenerator from '@ovh-ux/component-rollup-config';

const config = configGenerator(
  {
    input: './src/my-library.js',
  },
  {
    translations: {
      languages: ['fr_FR', 'en_EN'], // only FR and EN translations will be provided
    },
  },
);

export default [config.cjs()];
```

You can also specify languages without modifying your rollup config by using the cli and passing the LANGUAGES environment variable. See the example below.

```sh
$ rollup -c --environment LANGUAGES:fr_FR
$ rollup -c --environment LANGUAGES:fr_FR-en_GB-en_US
```

## Test

```sh
$ yarn test
```

## Related

- [@ovh-ux/rollup-plugin-less-tilde-importer](https://github.com/ovh/rollup-plugin-less-tilde-importer) - Rollup plugin to facilitate less imports with a ~ (tilde) prefix

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
