# @ovh-ux/ng-ovh-web-universe-components

> OVH Manager Web Universe Components

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-web-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-web-universe-components) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-web-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-web-universe-components?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-web-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-web-universe-components?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

We extracted all the components of the [web control panel](https://github.com/ovh/manager/tree/master/packages/manager/apps/web) in order to interconnect them
both in our upcoming [monorepo](https://github.com/ovh/manager) but also in the current stack.

At the end we are planning remove this repository and privilege the management of sources directly
inside the monorepo.

## Install

```sh
yarn add @ovh-ux/ng-ovh-web-universe-components
```
## Usage

```js
import angular from 'angular';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';

angular.module('myApp', [ngOvhWebUniverseComponents]);
```

## Test

```sh
yarn test
```

## Related

* [ovh-manager-web](https://github.com/ovh/manager/tree/master/packages/manager/apps/web) - OVH Control Panel Web UI

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
