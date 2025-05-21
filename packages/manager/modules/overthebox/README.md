# manager-overthebox

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-overthebox)](https://www.npmjs.com/package/@ovh-ux/manager-overthebox) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-overthebox)](https://npmjs.com/package/@ovh-ux/manager-overthebox) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/overthebox)](https://npmjs.com/package/@ovh-ux/manager-overthebox?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/overthebox)](https://npmjs.com/package/@ovh-ux/manager-overthebox?activeTab=dependencies)

## Install

```sh
pnpm install @ovh-ux/manager-overthebox
```

## Usage

```js
import angular from 'angular';
import ovhManagerOverthebox from '@ovh-ux/manager-overthebox';

angular.module('myApp', [ovhManagerOverthebox]);
```

## Build

```sh
# Build in production mode
pnpm start
```

## Development

If you want to contribute to the project, follow theses instructions:

Foremost, you should launch a global installation at the root folder of this repository:

```sh
pnpm install
```

Then you just have to start the project in development mode. For this, two choices are possible according to your needs:

```sh
# Build the `manager-overthebox` workspace and all the nested workspaces in development mode and watch only `manager-overthebox` workspace
pnpm start:dev
# Build and watch the `manager-overthebox` workspace and all the nested workspaces in development mode
pnpm start:watch
```

## Documentation

* Documentation OVH OverTheBox — [https://docs.ovh.com/fr/overthebox/](https://docs.ovh.com/fr/overthebox/)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
