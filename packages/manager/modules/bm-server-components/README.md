# manager-dedicated-server-components

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-dedicated-server-components)](https://www.npmjs.com/package/@ovh-ux/manager-dedicated-server-components) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-dedicated-server-components)](https://npmjs.com/package/@ovh-ux/manager-dedicated-server-components) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/bm-server-components)](https://npmjs.com/package/@ovh-ux/manager-dedicated-server-components?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/bm-server-components)](https://npmjs.com/package/@ovh-ux/manager-dedicated-server-components?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/manager-dedicated-server-components
```

## Usage

```js
// import all the components required individually
import angular from 'angular';
import {
  serverGeneralInfo,
  serverNetwork,
} from '@ovh-ux/manager-dedicated-server-components';

angular.module('myApp', [serverGeneralInfo]);
```

```html
<server-general-info server="$ctrl.server" user="$ctrl.user"></server-general-info>
<server-network server="$ctrl.server"></server-network>
````

## Build

```sh
# Build in production mode
yarn start
```

## Development

If you want to contribute to the project, follow theses instructions:

Foremost, you should launch a global installation at the root folder of this repository:

```sh
yarn install
```

Then you just have to start the project in development mode. For this, two choices are possible according to your needs:

```sh
# Build the `manager-dedicated-server-components` workspace and all the nested workspaces in development mode and watch only `manager-dedicated-server-components` workspace
yarn start:dev
# Build and watch the `manager-dedicated-server-components` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
