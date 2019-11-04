# Order tracking

## Install

```sh
yarn add @ovh-ux/order-tracking
```
## Usage

```js
import angular from 'angular';
import orderTracking from '@ovh-ux/order-tracking';

angular
  .module('myApp', [
    orderTracking,
    uiRouter,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('order-tracking', {
      url: '/order-tracking/{orderId}',
      component: 'orderTrackingComponent',
      resolve: {
        orderId: /* @ngInject */  $transition$ => $transition$.params().orderId,
      }
    });
  });
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
