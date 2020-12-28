# ng-ovh-responsive-page-switcher

> It detects available width for displaying page in 2 distinct modes

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-responsive-page-switcher)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-responsive-page-switcher) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-responsive-page-switcher)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-page-switcher) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-responsive-page-switcher)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-page-switcher?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-responsive-page-switcher)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-page-switcher?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-responsive-page-switcher
```

## Usage

```js
import angular from 'angular';
import ngOvhResponsivePageSwitcher from '@ovh-ux/ng-ovh-responsive-page-switcher';

angular.module('myApp', [ngOvhResponsivePageSwitcher]);
```

Directives `responsive-switch` and `responsive-switch-page` will be used. `responsive-switch-page` requires `responsive-switch`, so first we create this directive :

```html
<div data-responsive-switch>
    <div data-responsive-switch-page class="responsive-switch-page-left"></div>
    <div data-responsive-switch-page class="responsive-switch-page-right"></div>
</div>
```

## Test

```sh
yarn test
```

## Related

`ng-ovh-responsive-page-switcher` module depends on different modules :

* [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
* [angular-animate](https://docs.angularjs.org/api/ngAnimate)

__Note__ : `ng-ovh-responsive-page-switcher` is suitable with [ng-ovh-responsive-popover](https://github.com/ovh/manager/tree/master/packages/components/ng-ovh-responsive-popover).

## Module Components

### directive

| Name | Description |
| :--: | :--: |
| [responsiveSwitch](./src/responsive-switch) | Create the container of the page to switch (animate) and manage the display |
| [responsiveSwitchPage](./src/responsive-switch-page) | Create a page to display |

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
