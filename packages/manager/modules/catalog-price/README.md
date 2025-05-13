# manager-catalog-price

> Component to display catalog prices, formatted by locale. It can handle price in micro cents.

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-catalog-price)](https://www.npmjs.com/package/@ovh-ux/manager-catalog-price) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-catalog-price)](https://npmjs.com/package/@ovh-ux/manager-catalog-price) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/manager-catalog-price)](https://npmjs.com/package/@ovh-ux/manager-catalog-price?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/manager-catalog-price)](https://npmjs.com/package/@ovh-ux/manager-catalog-price?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/manager-catalog-price
```

## Usage

```js
import angular from 'angular';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

// add the `ovhManagerCatalogPrice` module as dependency of your AngularJS project.
angular.module('myApp', [ovhManagerCatalogPrice]);
```

## Attributes

| Attribute         | Type            | Binding | One-time binding | Values                    | Default    | Description
| ----              | ----            | ----    | ----             | ----                      | ----       | ----
| `price`           | string          | <       | no               |n/a                        | n/a        | The price to be shown
| `interval-unit`   | string          | @?      | no               | n/a                       | n/a        | Time interval for which the price is expressed (e.g: month)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
