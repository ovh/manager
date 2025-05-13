# ng-ui-router-breadcrumb

> Display a breadcrumb based on the [UI-Router](https://ui-router.github.io/ng1/) state declaration.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ui-router-breadcrumb)](https://www.npmjs.com/package/@ovh-ux/ng-ui-router-breadcrumb) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ui-router-breadcrumb)](https://npmjs.com/package/@ovh-ux/ng-ui-router-breadcrumb) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ui-router-breadcrumb)](https://npmjs.com/package/@ovh-ux/ng-ui-router-breadcrumb?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ui-router-breadcrumb)](https://npmjs.com/package/@ovh-ux/ng-ui-router-breadcrumb?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/ng-ui-router-breadcrumb
```
## Usage

### `breadcrumb` resolve

```js
import angular from 'angular';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import uiRouter from '@uirouter/angularjs';

angular.module('myApp', [ngUiRouterBreadcrumb, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('foo', {
      url: '/foo',
      template: '<h2>Foo</h2>',
      resolve: {
        breadcrumb() {
          return 'foo';
        },
      },
    });
  },
);
```

### `hideBreadcrumb` resolve

This is meant to be used if you want to hide the breadcrumb for some state but display it for some children.

```js
import angular from 'angular';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import uiRouter from '@uirouter/angularjs';

angular.module('myApp', [ngUiRouterBreadcrumb, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('foo', {
      url: '/foo',
      template: '<h2>Foo</h2>',
      resolve: {
        breadcrumb() {
          return 'foo';
        },
        hideBreadcrumb() {
          return true;
        },
      },
    });
  },
);
```

## Test

```sh
$ yarn test
```

## Related

- [@ovh-ux/ng-ui-router-layout](https://github.com/ovh/manager/tree/master/packages/components/ng-ui-router-layout) - Enhance UI-Router by adding a layout decorator to deal with an UI Bootstrap modal instance
- [@ovh-ux/ng-ui-line-progress](https://github.com/ovh/manager/tree/master/packages/components/ng-ui-router-line-progress) - Display a line progress between UI-Router transition hooks

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
