# manager-product-offers

> Set of components and services to handle option order with different workflows.

[![npm version](https://badgen.net/npm/v/@ovh-ux/manager-product-offers)](https://www.npmjs.com/package/@ovh-ux/manager-product-offers) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-product-offers)](https://npmjs.com/package/@ovh-ux/manager-product-offers) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/manager-product-offers)](https://npmjs.com/package/@ovh-ux/manager-product-offers?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/manager-product-offers)](https://npmjs.com/package/@ovh-ux/manager-product-offers?activeTab=dependencies)

## Install

```sh
$ pnpm add @ovh-ux/manager-product-offers
```

## Usage

```js
import angular from 'angular';
import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

// add the `ovhManagerProductOffers` module as dependency of your AngularJS project.
angular.module('myApp', [ovhManagerProductOffers]);
```

## Examples

### Adding a SQL dabatase to an existing webhosting

The view

```html
<ovh-manager-product-offers
  workflow-type=":: $ctrl.workflowConstants.WORKFLOW_TYPES.ORDER"
  workflow-options=":: $ctrl.workflowOptions"
  pricing-type=":: $ctrl.pricingType.PRICING_CAPACITIES.RENEW"
  on-error=":: $ctrl.displayError(error)"
  on-success=":: $ctrl.displaySuccess(checkout)"
  send-current-state=":: $ctrl.getOrderState(state)"
>
  <oui-step-form header="Please select your product">
    <select
      required
      data-ng-options="product for product in ['sql_perso_800_1', 'sql_perso_800_5']"
      data-ng-model="$ctrl.selectedProduct"
    >
    </select>
  </oui-step-form>
</ovh-manager-product-offers>
```

The controller

```js
import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

export default class {
  /* @ngInject */
  constructor($q, OvhApiMe) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.pricingType = pricingConstants;
    this.workflowConstants = workflowConstants;
  }

  $onInit() {
    this.workflowOptions = {
      catalog: this.catalog,
      catalogItemTypeName: workflowConstants.CATALOG_ITEM_TYPE_NAMES.ADDON,
      getPlanCode: this.getPlanCode.bind(this),
      productName: 'webHosting',
      serviceNameToAddProduct: 'nameOfMyProduct',
      onPricingSubmit: () => console.log('onPricingSubmit'),
      onValidateSubmit: () => console.log('onValidateSubmit'),
    };
  }

  static displaySuccess({ orderId }) {
    console.log(`The id of the order is ${orderId}`);
  }

  static displayError(error) {
    console.log('The error is', error);
  }

  static getOrderState({ isLoading }) {
    console.log(`The stepper is currently loading: ${isLoading}`);
  }

  getPlanCode() {
    return this.selectedProduct;
  }
}
```

The routing

```js
export default {
  resolve: {
    catalog: /* @ngInject */ (HostingDatabaseOrderPublicService) =>
      HostingDatabaseOrderPublicService.getCatalog(),
  },
};
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
