# ng-ovh-ui-confirm-modal

> Simple confirmation modal

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-ui-confirm-modal)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-ui-confirm-modal) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-ui-confirm-modal)](https://npmjs.com/package/@ovh-ux/ng-ovh-ui-confirm-modal) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-ui-confirm-modal)](https://npmjs.com/package/@ovh-ux/ng-ovh-ui-confirm-modal?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-ui-confirm-modal)](https://npmjs.com/package/@ovh-ux/ng-ovh-ui-confirm-modal?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)


## Install

```sh
yarn add @ovh-ux/ng-ovh-ui-confirm-modal
```

## Usage

```js
import angular from 'angular';
import ngOvhUiConfirmModal from '@ovh-ux/ng-ovh-ui-confirm-modal';

angular.module('myApp', [ngOvhUiConfirmModal]);
```

```html
<div data-ng-controller="XdslModemResetCtrl as ResetCtrl">
    <button
        <!--
            data-ng-really-click: This parameter is required.
            `resetModem()` will be called if you accept the confimation message.
        -->
        data-ng-really-click="ResetCtrl.resetModem()"
        <!--
            data-ng-really-undo: This parameter is optional
            `undo()` will be called if you cancel the confimation message.
            data-ng-really-undo="ResetCtrl.undo()"
        -->
        data-ng-really-message="{{ 'xdsl_modem_reset_really' | translate }}"
        data-ng-really-confirm="{{ 'ok' | translate }}"
        data-ng-really-cancel="{{ 'cancel' | translate }}">
    </button>
</div>
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
