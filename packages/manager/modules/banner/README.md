# manager-banner

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-banner)](https://www.npmjs.com/package/@ovh-ux/manager-banner) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-banner)](https://npmjs.com/package/@ovh-ux/manager-banner) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/banner)](https://npmjs.com/package/@ovh-ux/manager-banner?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/banner)](https://npmjs.com/package/@ovh-ux/manager-banner?activeTab=dependencies)

## Install

```sh
pnpm add @ovh-ux/manager-banner
```

## Usage

```js
import angular from 'angular';
import ovhManagerBanner from '@ovh-ux/manager-banner';

angular.module('myApp', [ovhManagerBanner]);
```

```html
<ovh-manager-banner></ovh-manager-banner>
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
# Build the `manager-banner` workspace and all the nested workspaces in development mode and watch only `manager-banner` workspace
pnpm start:dev
# Build and watch the `manager-banner` workspace and all the nested workspaces in development mode
pnpm start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
