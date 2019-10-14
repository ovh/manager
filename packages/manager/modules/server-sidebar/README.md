# manager-server-sidebar

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-server-sidebar)](https://www.npmjs.com/package/@ovh-ux/manager-server-sidebar) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-server-sidebar)](https://npmjs.com/package/@ovh-ux/manager-server-sidebar) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/server-sidebar)](https://npmjs.com/package/@ovh-ux/manager-server-sidebar?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/server-sidebar)](https://npmjs.com/package/@ovh-ux/manager-server-sidebar?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/manager-server-sidebar
```

## Usage

```js
import angular from 'angular';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';

angular
  .module('myApp', [
    ovhManagerServerSidebar,
  ]);
```

```html
<ovh-manager-server-sidebar universe="'DEDICATED'"></ovh-manager-server-sidebar>
````

## Options

### universe

Pass a string as `universe` to configure universe (`DEDICATED` or `CLOUD`).

```html
<ovh-manager-server-sidebar
    universe="'DEDICATED'">
</ovh-manager-server-sidebar>
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
# Build the `manager-server-sidebar` workspace and all the nested workspaces in development mode and watch only `manager-server-sidebar` workspace
yarn start:dev
# Build and watch the `manager-server-sidebar` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/manager/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/manager/issues), our [contributing guide](https://github.com/ovh-ux/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
