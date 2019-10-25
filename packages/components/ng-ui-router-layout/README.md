# ng-ui-router-layout

> Support multiple layouts when using Ui-Router

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ui-router-layout)](https://www.npmjs.com/package/@ovh-ux/ng-ui-router-layout) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ui-router-layout)](https://npmjs.com/package/@ovh-ux/ng-ui-router-layout) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ui-router-layout)](https://npmjs.com/package/@ovh-ux/ng-ui-router-layout?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ui-router-layout)](https://npmjs.com/package/@ovh-ux/ng-ui-router-layout?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ui-router-layout
```
## Usage

### `modal` layout

This layout is now deprecated. Prefer using [`ouiModal` layout](ovh-ux/manager/tree/master/packages/components/ng-ui-router-layout/src/oui-modal/README.md).

```js
// index.js
import angular from 'angular';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

angular
  .module('myApp', [
    ngUiRouterLayout,
  ]);
```

#### With controller and template

```js
// routing.js
import controller from './controller';
import template from './template.html';
...

  $stateProvider
    .state('state.name', {
      url,
      views: {
        modal: {
          controller,
          template
        },
      },
      layout: 'modal',
    });
```

#### With component

```js
// routing.js
  $stateProvider
    .state('state.name', {
      url,
      views: {
        modal: {
          component: 'awesomeModal',
        },
      },
      layout: 'modal',
    });
```

#### With a component provider

```js
// routing.js
  $stateProvider
    .state('state.name', {
      url,
      views: {
        modal: {
          componentProvider:
            predicate => predicate
              ? 'awesomeModalForTruePredicate'
              : 'awesomeModalForFalsePredicate',
        },
      },
      layout: 'modal',
    });
```

### `ouiModal` layout

See [ouiModal layout](src/oui-modal/README.md).


## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/manager/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/manager/issues), our [contributing guide](https://github.com/ovh-ux/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
