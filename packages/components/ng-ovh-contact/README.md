# ng-ovh-contact

> OVH Contact

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-contact)](https://npmjs.com/package/@ovh-ux/ng-ovh-contact) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-contact)](https://npmjs.com/package/@ovh-ux/ng-ovh-contact?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-contact)](https://npmjs.com/package/@ovh-ux/ng-ovh-contact?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

ng-ovh-contact helps you dealing with ovh contacts from [/me/contact](https://api.ovh.com/console/#/me/contact#GET) API.

## Installation

```sh
yarn add @ovh-ux/ng-ovh-contact
```

Then inject actionsMenu module in your module declaration:

```js
import angular from 'angular';
import ngOvhContact from '@ovh-ux/ng-ovh-contact';

angular
  .module('myApp', [
    ngOvhContact,
  ]);
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-contact/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-contact/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
