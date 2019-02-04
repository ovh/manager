# ng-ovh-simple-country-list

> OVH simple country list provide a "full" (ISO-3166-1) list of countries with translation possibility. (translations are not available yet)

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-simple-country-list)](https://npmjs.com/package/@ovh-ux/ng-ovh-simple-country-list) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-simple-country-list)](https://npmjs.com/package/@ovh-ux/ng-ovh-simple-country-list?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-simple-country-list)](https://npmjs.com/package/@ovh-ux/ng-ovh-simple-country-list?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-simple-country-list
```

## Usage

```js
import angular from 'angular';
import ngOvhSimpleCountryList from '@ovh-ux/ng-ovh-simple-country-list';

angular
  .module('myApp', [
    ngOvhSimpleCountryList,
  ])
  .controller('myController', /* @ngInject */ (OvhSimpleCountryList) => {
    // set the disired language. Default is iso/en
    OvhSimpleCountryList.setLanguage('en_GB');

    const countryListAsValueLabel = OvhSimpleCountryList.asDataForSelect; // lazy builded property
    // [{'value':'AD', 'label': 'ANDORRA'}, {'value':'AE', 'label': 'UNITED ARAB EMIRATES'}, ... ]

    const countryListAsSimpleArray = OvhSimpleCountryList.asArray; // lazy builded property
    // ['ANDORRA', 'UNITED ARAB EMIRATES', 'AFGHANISTAN', ...]

    const countryListAsSimpleOject = OvhSimpleCountryList.asObject; // lazy builded property
    // {'AD': 'ANDORRA', 'AE': 'UNITED ARAB EMIRATES', ... }
  });
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-simple-country-list/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-simple-country-list/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
