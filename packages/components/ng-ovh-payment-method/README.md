# Ovh Angular Payment Method

> Help you to get payment methods from different OVH APIs

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-payment-method)](https://npmjs.com/package/@ovh-ux/ng-payment-method) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-payment-method)](https://npmjs.com/package/@ovh-ux/ng-payment-method?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-payment-method)](https://npmjs.com/package/@ovh-ux/ng-payment-method?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-payment-method
```

## Usage

```js
import ovhAngularPaymentMethod from '@ovh-ux/ng-payment-method';

// add the ovhAngularPaymentMethod module as dependency of your angular project
angular.module('myApp', [
  ...
  ovhAngularPaymentMethod,
  ...
]);

...

// set the target - this will tell to the component which APIs the component needs to call
angular.module('myApp').config((ovhPaymentMethodProvider, constants) => {
  ovhPaymentMethodProvider.setTarget(constants.target);
});
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-payment-method/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-payment-method/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
