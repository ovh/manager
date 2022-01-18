# ng-layout-helpers

> Provides a set of utilities and layout components for OVHcloud control panel

## Install

```sh
yarn add @ovh-ux/manager-ng-layout-helpers
```

## Available layouts

### List layout

Provides utilities to create a layout displaying a list of sortable and filterable elements

#### Usage

```js
// module.routing.js

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('product.list', {
    url: `/list?${ListLayoutHelper.urlQueryParams}`,
    views: {
      '': {
        component: 'awesomeListProductComponent',
      },
    },
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      // apiPath to get resources
      apiPath: () => '/productApi',
    },
  });
};

```

```js
// module.controller.js

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class ProductListCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
  }

  $onInit() {
    // Set datagridId
    this.datagridId = 'dg-id';
    this.defaultFilterColumn = 'property';

    super.$onInit();

    this.columnsConfig = [
      {name: 'name', sortable: this.getSorting('name')},
      {name: 'description', sortable: this.getSorting('description')},
      {name: 'status', sortable: this.getSorting('status')},
    ];
  }
}

```

#### Add Simple CTA

You have to define into your routing file a `topbarOptions` object, like this:

```JS
topbarOptions: /* @ngInject */ ($translate, goToOrder) => ({
  cta: {
    type: 'button',
    displayed: true,
    disabled: false,
    label: $translate.instant('netapp_order_cta_label'),
    value: $translate.instant('netapp_order_cta_value'),
    onClick: () => {
      goToOrder();
    },
  },
})
```

#### Add Actions Menu

You have to define into your routing file a `topbarOptions` object, like this:

```JS
topbarOptions: /* @ngInject */ ($translate, myRoutingOnClickFunction) => ({
  cta: {
    type: 'actions',
    displayed: true,
    disabled: false,
    menuText: $translate.instant('netapp_order_cta_menu'),
    actions: [{
      id: 'first-action-item',
      displayed: true,
      disabled: false,
      label: $translate.instant('netapp_order_cta_label'),
      value: $translate.instant('netapp_order_cta_value'),
      onClick: () => {
        myRoutingOnClickFunction();
      },
    },],
  },
})
```

### Onboarding component

[Click here for documentation](src/onboarding/README.md)

## Build

```sh
# Build in production mode
yarn start
```

## Development

If you want to contribute to the project, follow theses instructions:

Foremost, you should launch a global installation at the root folder of this repository:

```sh
yarn install
```

Then you just have to start the project in development mode. For this, two choices are possible according to your needs:

```sh
# Build the `manager-ng-layout-helpers` workspace and all the nested workspaces in development mode and watch only `manager-ng-layout-helpers` workspace
yarn start:dev
# Build and watch the `manager-ng-layout-helpers` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
