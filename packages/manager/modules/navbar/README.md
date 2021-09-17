# manager-navbar

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-navbar)](https://www.npmjs.com/package/@ovh-ux/manager-navbar) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/navbar)](https://npmjs.com/package/@ovh-ux/manager-navbar?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/manager-navbar
```

## Usage

```js
import angular from 'angular';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';

angular.module('myApp', [ovhManagerNavbar]);
```

```html
<ovh-manager-navbar></ovh-manager-navbar>
```

### Attributes

#### lang-options

Type: `object`

Configure language menu.

```html
<ovh-manager-navbar
    lang-options="$ctrl.langOptions">
</ovh-manager-navbar>
```

The supported langs are:
- cs_CZ
- de_DE
- en_GB
- es_ES
- es_US
- fi_FI
- fr_CA
- fr_FR
- it_IT
- lt_LT
- pl_PL
- pt_PT

If the given options aren't supported, an error will be thrown.

When the lang is being changed, the event `lang.onChange` is emitted.

##### exclude

Type: `string[]`

Array of langs that should be excluded.

##### include

Type: `string[]`

Array of langs that should be included.
Note: `exclude` property will override `include` property.

#### navbar-options

Type: `object`

```html
<ovh-manager-navbar
    navbar-options="$ctrl.navbarOptions">
</ovh-manager-navbar>
```

##### toggle

Type: `object`

Allows to configure responsive toggler.

###### event

Type: `string`

Listens to event to stop toggler loading.

##### version

Type: `string`\
Values: `'beta'`\
Default: `'default'`

Specify universes version to display, if not passed will display default.

##### universe

Type: `string`\
Values: `'hub'`, `'web'`, `'server'`, `'public-cloud'`, `'telecom'`

Indicate current universe.

##### fixed

Type: `boolean`\
Default: `false`

Indicate if fixed position should be applied to component.

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
