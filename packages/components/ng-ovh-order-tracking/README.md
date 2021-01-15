# ng-ovh-order-tracking

> OVHcloud order tracking.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-order-tracking)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-order-tracking) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-order-tracking)](https://npmjs.com/package/@ovh-ux/ng-ovh-order-tracking) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-order-tracking)](https://npmjs.com/package/@ovh-ux/ng-ovh-order-tracking?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-order-tracking)](https://npmjs.com/package/@ovh-ux/ng-ovh-order-tracking?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/ng-ovh-order-tracking
```
## Usage

```js
import angular from 'angular';
import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import uiRouter from '@uirouter/angularjs';

angular.module('myApp', [ngOvhOrderTracking, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('order-tracking', {
      url: '/order-tracking/{orderId}',
      component: 'ovhOrderTrackingComponent',
      resolve: {
        orderId: /* @ngInject */ ($transition$) =>
          $transition$.params().orderId,
      },
    });
  },
);
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
