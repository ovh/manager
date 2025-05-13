# manager-advices

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-advices)](https://www.npmjs.com/package/@ovh-ux/manager-advices) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-advices)](https://npmjs.com/package/@ovh-ux/manager-advices) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/modules/sms)](https://npmjs.com/package/@ovh-ux/manager-advices?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/modules/sms)](https://npmjs.com/package/@ovh-ux/manager-advices?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/manager-advices
```

## Usage

```js
import angular from 'angular';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

angular.module('myApp', [ovhManagerAdvices]);
```

```html
  <ovh-advices
    service-type="dedicated-server"
    service-name="{{ ::$ctrl.serviceName }}"
    on-advice-click="$ctrl.onAdviceClick(advice)">
 </ovh-advices>
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
