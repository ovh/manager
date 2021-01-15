# ng-ovh-request-tagger


[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-request-tagger)](https://npmjs.com/package/@ovh-ux/ng-ovh-request-tagger) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/components/ng-ovh-request-tagger)](https://npmjs.com/package/@ovh-ux/ng-ovh-request-tagger?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/components/ng-ovh-request-tagger)](https://npmjs.com/package/@ovh-ux/ng-ovh-request-tagger?activeTab=dependencies)

## Install

```sh
yarn add @ovh-ux/ng-ovh-request-tagger
```
## Usage

```js
import angular from 'angular';
import ngOvhRequestTagger from '@ovh-ux/ng-ovh-request-tagger';

angular.module('myApp', [ngOvhRequestTagger]).config(
  /* @ngInject */ ($httpProvider) => {
    $httpProvider.interceptors.push('OvhNgRequestTaggerInterceptor');
  },
);
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
