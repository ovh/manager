# manager-cookie-policy

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-cookie-policy)](https://www.npmjs.com/package/@ovh-ux/manager-cookie-policy) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-cookie-policy)](https://npmjs.com/package/@ovh-ux/manager-cookie-policy) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/banner)](https://npmjs.com/package/@ovh-ux/manager-cookie-policy?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/banner)](https://npmjs.com/package/@ovh-ux/manager-cookie-policy?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/manager-cookie-policy
```

## Usage

```js
import angular from 'angular';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';

angular.module('myApp', [ovhManagerCookiePolicy]);
```

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
# Build the `manager-cookie-policy` workspace and all the nested workspaces in development mode and watch only `manager-cookie-policy` workspace
yarn start:dev
# Build and watch the `manager-cookie-policy` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
