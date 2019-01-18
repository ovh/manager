# ng-ovh-otrs

> Manage OVH OTRS tickets

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-otrs)](https://npmjs.com/package/@ovh-ux/ng-ovh-otrs) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-otrs)](https://npmjs.com/package/@ovh-ux/ng-ovh-otrs?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-otrs)](https://npmjs.com/package/@ovh-ux/ng-ovh-otrs?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

# Install

```sh
yarn add @ovh-ux/ng-ovh-otrs
```

## Usage

```js
import angular from 'angular';
import '@ovh-ux/ng-ovh-otrs';

angular
  .module('myApp', ['ngOvhOtrs'])
  .config(/* @ngInject */ (OtrsPopupProvider) => {
    // Inject it to manager-navbar at app.config:
    OtrsPopupProvider.setBaseUrlTickets('…');
  });
```

```js
const assistanceMenu = [{
  title: $translate.instant('otrs_menu_new_ticket'),
  click: (callback) => {
    if (!OtrsPopupService.isLoaded()) {
      OtrsPopupService.init();
    } else {
      OtrsPopupService.toggle();
    }

    if (_.isFunction(callback)) {
      callback();
    }
  },
}];
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-otrs/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-otrs/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
