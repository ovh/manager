# angular-uirouter-title

> AngularJS module for updating browser title based on the current ui-router state.

[![Downloads](https://badgen.net/npm/dt/angular-uirouter-title)](https://npmjs.com/package/angular-uirouter-title) [![Dependencies](https://badgen.net/david/dep/ovh-ux/angular-uirouter-title)](https://npmjs.com/package/angular-uirouter-title?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/angular-uirouter-title)](https://npmjs.com/package/angular-uirouter-title?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)


## Install

```sh
yarn add @ovh-ux/angular-uirouter-title
```

## Usage

```js
import 'angular';
import '@ovh-ux/angular-uirouter-title';

angular
  .module('myApp', [
    'ovhAngularUiRouterTitle',
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

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/angular-uirouter-title/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/angular-uirouter-title/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
