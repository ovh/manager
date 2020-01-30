# manager-navbar

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-navbar)](https://www.npmjs.com/package/@ovh-ux/manager-navbar) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/manager-navbar
```

## Usage

```js
import angular from 'angular';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';

angular
  .module('myApp', [
    ovhManagerNavbar,
  ]);
```

```html
<ovh-manager-navbar></ovh-manager-navbar>
````

## Options

Options will be passed through `navbar-options`

```html
<ovh-manager-navbar
    data-navbar-options="$ctrl.navbarOptions">
</ovh-manager-navbar>
````

### Toggle

Allows to configure responsive toggler

#### Event

Listens to event to stop toggler loading

```js
{
  toggle: {
    event: 'sidebar:loaded'
  }
}
```

### universe

Indicate current universe

```js
{
  universe: 'web'
}
```

### fixed position

Indicate if fixed position should be applied to component

```js
{
  fixed: true
}
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
# Build the `manager-navbar` workspace and all the nested workspaces in development mode and watch only `manager-navbar` workspace
yarn start:dev
# Build and watch the `manager-navbar` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
