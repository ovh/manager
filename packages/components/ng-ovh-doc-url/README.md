# ng-ovh-doc-url

> Easily create links or get urls to 2api endpoint which redirects to documentation systems (Content manager and docs.ovh.com)

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-doc-url)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-doc-url) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-doc-url)](https://npmjs.com/package/@ovh-ux/ng-ovh-doc-url) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-doc-url)](https://npmjs.com/package/@ovh-ux/ng-ovh-doc-url?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-doc-url)](https://npmjs.com/package/@ovh-ux/ng-ovh-doc-url?activeTab=dependencies)

## Install

```sh
$ pnpm install @ovh-ux/ng-ovh-doc-url
```

## Usage

```js
import angular from 'angular';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';

angular
  .module('myApp', [ngOvhDocUrl])
  .config(
    /* @ngInject */ (ovhDocUrlProvider, TranslateServiceProvider) => {
      // User locale configuration
      ovhDocUrlProvider.setUserLocale(TranslateServiceProvider.getUserLocale());

      // Url prefix for 2api
      ovhDocUrlProvider.setUrlPrefix('/engine/2api');
    },
  )
  .controller(
    'MyController',
    class {
      /* @ngInject */
      constructor(ovhDocUrl) {
        this.ovhDocUrl = ovhDocUrl;
      }

      $onInit() {
        this.url = this.ovhDocUrl.getDocUrl('g1769.creating_ssh_keys');
      }
    },
  );
```

```html
<ovh-doc-url data-doc-id="g1769.creating_ssh_keys">My link</ovh-doc-url>
<ovh-doc-url data-doc-id="cloud/dedicated/ovh-ssh-key">My link</ovh-doc-url>
```

## Test

```sh
$ pnpm test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
