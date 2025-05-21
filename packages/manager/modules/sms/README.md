# manager-sms

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-sms)](https://www.npmjs.com/package/@ovh-ux/manager-sms) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-sms)](https://npmjs.com/package/@ovh-ux/manager-sms) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/sms)](https://npmjs.com/package/@ovh-ux/manager-sms?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/sms)](https://npmjs.com/package/@ovh-ux/manager-sms?activeTab=dependencies)

## Install

```sh
pnpm install @ovh-ux/manager-sms
```

## Usage

```js
import angular from 'angular';
import ovhManagerSms from '@ovh-ux/manager-sms';

angular.module('myApp', [ovhManagerSms]);
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
# Build the `manager-sms` workspace and all the nested workspaces in development mode and watch only `manager-sms` workspace
pnpm start:dev
# Build and watch the `manager-sms` workspace and all the nested workspaces in development mode
pnpm start:watch
```

## Documentation

* Documentation OVH SMS — [https://docs.ovh.com/fr/sms/](https://docs.ovh.com/fr/sms/)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
