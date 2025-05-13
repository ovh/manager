# manager-on-boarding-layout

> Display a empty page with details about the service to onboard user.

## Install

```sh
yarn add @ovh-ux/manager-ng-layout-helpers
```
## Usage

```js
import angular from 'angular';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

angular.module('myApp', [OnboardingLayoutHelper]);
```

And in your html view:

```html
<manager-on-boarding-layout guides="$ctrl.guides" image-source="$ctrl.illustration">
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
</manager-on-boarding-layout>
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
