# ng-ovh-telecom-universe-components

> OVH Manager Telecom Universe Components

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-telecom-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-telecom-universe-components) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-telecom-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-telecom-universe-components?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-telecom-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-telecom-universe-components?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

We extracted all the components of the [telecom control panel](https://github.com/ovh/manager/tree/master/packages/manager/apps/telecom) in order to interconnect them
both in our upcoming [monorepo](https://github.com/ovh/manager) but also in the current stack.

At the end we are planning remove this repository and privilege the management of sources directly
inside the monorepo.

## Install

```sh
yarn add @ovh-ux/ng-ovh-telecom-universe-components
```
## Usage

```js
import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';

angular.module('myApp', [ngOvhTelecomUniverseComponents]);
```

## Test

```sh
yarn test
```

## Related

* [ovh-manager-telecom](https://github.com/ovh/manager/tree/master/packages/manager/apps/telecom) - OVH Control Panel Telecom UI

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
