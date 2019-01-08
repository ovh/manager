# Ovh Angular Payment Method

> Help you to get payment methods from different OVH APIs

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-payment-method
```

## Usage

```js
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

// add the ngOvhPaymentMethod module as dependency of your angular project
angular
  .module('myApp', [
    ngOvhPaymentMethod,
  ])
  .config((ovhPaymentMethodProvider, constants) => {
    // set the target - this will tell to the component which APIs the component needs to call
    ovhPaymentMethodProvider.setTarget(constants.target);
  });
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-payment-method/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-payment-method/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
