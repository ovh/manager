# ng-uirouter-title

> AngularJS module for updating browser title based on the current ui-router state.

[![Downloads](https://badgen.net/npm/dt/ng-uirouter-title)](https://npmjs.com/package/@ovh-ux/ng-uirouter-title) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-uirouter-title)](https://npmjs.com/package/@ovh-ux/ng-uirouter-title?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-uirouter-title)](https://npmjs.com/package/@ovh-ux/ng-uirouter-title?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)


## Install

```sh
yarn add @ovh-ux/ng-uirouter-title
```

## Usage

```js
import 'angular';
import '@ovh-ux/ng-uirouter-title';

angular
  .module('myApp', [
    'ngUirouterTitle',
  ]);
```

When declaring your ui-router state, you can add a custom $title :

```js
$stateProvider.state("app.item", {
    url: "/app/item",
    resolve: {
        $title: function ($stateParams, $translate) {
            return $translate.instant("item_description_", { name: $stateParams.id });
        }
    }
});
```

## Test

```sh
yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-uirouter-title/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-uirouter-title/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
