# ng-ovh-onboarding

> Display a empty page with details about the service to onboard user.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-onboarding)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-onboarding) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-onboarding)](https://npmjs.com/package/@ovh-ux/ng-ovh-onboarding) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-onboarding)](https://npmjs.com/package/@ovh-ux/ng-ovh-onboarding?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-onboarding)](https://npmjs.com/package/@ovh-ux/ng-ovh-onboarding?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-onboarding
```
## Usage

```js
import angular from 'angular';
import ovhOnboarding from '@ovh-ux/ng-ovh-onboarding';

angular.module('myApp', [ovhOnboarding]);
```

And in your html view:

```html
<ovh-onboarding guides="$ctrl.guides" image-source="$ctrl.illustration">
    <h1 data-translate="title"></h1>
    <p data-translate="onboarding_content1"></p>
    <strong
        data-translate="onboarding_content2"
    ></strong>
    <p data-translate="onboarding_content3"></p>
    <p data-translate="onboarding_content4"></p>

    <oui-button data-variant="primary" data-on-click="$ctrl.onClick()">
        <span
            data-translate="onboarding_action_label"
        ></span>
    </oui-button>
</ovh-onboarding>
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
