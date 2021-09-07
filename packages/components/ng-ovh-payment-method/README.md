# ng-ovh-payment-method

> Set of angularJS service and components in order to deal with OVHcloud payment methods.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-payment-method)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-payment-method) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-payment-method)](https://npmjs.com/package/@ovh-ux/ng-ovh-payment-method?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-payment-method
```

## Usage

```js
import angular from 'angular';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

// add the `ngOvhPaymentMethod` module as dependency of your AngularJS project.
angular.module('myApp', [ngOvhPaymentMethod]).config(
  /* @ngInject */ (ovhPaymentMethodProvider) => {
    // Set the url of payment method list page, where the user
    // should be redirected when he has no default payment method.
    ovhPaymentMethodProvider.setPaymentMethodPageUrl(constants.target);

    // set user locale
    ovhPaymentMethodProvider.setUserLocale('fr_FR');
  },
);
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
