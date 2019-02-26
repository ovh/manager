# ng-ovh-cloud-universe-components

> OVH Manager Cloud Universe Components

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-cloud-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-cloud-universe-components) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-cloud-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-cloud-universe-components?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-cloud-universe-components)](https://npmjs.com/package/@ovh-ux/ng-ovh-cloud-universe-components?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

We extracted all the components of the [cloud control panel](https://github.com/ovh-ux/ovh-manager-cloud) in order to interconnect them
both in our upcoming [monorepo](https://github.com/ovh-ux/manager) but also in the current stack.

At the end we are planning remove this repository and privilege the management of sources directly
inside the monorepo.

## Install

```sh
yarn add @ovh-ux/ng-ovh-cloud-universe-components
```
## Usage

```js
import angular from 'angular';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

angular
  .module('myApp', [
    ngOvhCloudUniverseComponents,
  ]);
```

## Test

```sh
yarn test
```

## Related

* [ovh-manager-cloud](https://github.com/ovh-ux/ovh-manager-cloud) - OVH Control Panel Cloud UI

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-cloud-universe-components/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-cloud-universe-components/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
