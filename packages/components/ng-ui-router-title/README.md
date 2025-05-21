# ng-ui-router-title

> AngularJS module for updating browser title based on the current ui-router state.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ui-router-title)](https://www.npmjs.com/package/@ovh-ux/ng-ui-router-title) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ui-router-title)](https://npmjs.com/package/@ovh-ux/ng-ui-router-title) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ui-router-title)](https://npmjs.com/package/@ovh-ux/ng-ui-router-title?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ui-router-title)](https://npmjs.com/package/@ovh-ux/ng-ui-router-title?activeTab=dependencies)

## Install

```sh
pnpm install @ovh-ux/ng-ui-router-title
```

## Usage

```js
import angular from 'angular';
import '@ovh-ux/ng-ui-router-title';

angular.module('myApp', ['ngUirouterTitle']).config(
  /* @ngInject */ ($stateProvider) => {
    // When declaring your ui-router state, you can add a custom $title:
    $stateProvider.state('app.item', {
      url: '/app/item',
      resolve: {
        $title($stateParams, $translate) {
          return $translate.instant('item_description_', {
            name: $stateParams.id,
          });
        },
      },
    });
  },
);
```

## Test

```sh
pnpm test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
