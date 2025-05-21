# sign-up

[![npm version](https://badgen.net/npm/v/@ovh-ux/sign-up)](https://www.npmjs.com/package/@ovh-ux/sign-up) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/sign-up)](https://npmjs.com/package/@ovh-ux/sign-up) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/sign-up)](https://npmjs.com/package/@ovh-ux/sign-up?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/sign-up)](https://npmjs.com/package/@ovh-ux/sign-up?activeTab=dependencies)

## Install

```sh
pnpm install @ovh-ux/sign-up
```

## Usage

```js
import angular from 'angular';
import ovhSignUp from '@ovh-ux/sign-up';

angular.module('myApp', [ovhSignUp]);
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
# Build the `sign-up` workspace and all the nested workspaces in development mode and watch only `sign-up` workspace
pnpm start:dev
# Build and watch the `sign-up` workspace and all the nested workspaces in development mode
pnpm start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
