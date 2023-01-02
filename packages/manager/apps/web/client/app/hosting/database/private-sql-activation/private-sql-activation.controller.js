import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WEBHOSTING_PRODUCT_NAME } from '../hosting-database.constants';

export default class PrivateSqlActivationController {
  /* @ngInject */
  constructor($q, $translate, OvhApiHostingWeb) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiHostingWeb = OvhApiHostingWeb;
  }

  $onInit() {
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        catalog: this.catalog,
        catalogItemTypeName: workflowConstants.CATALOG_ITEM_TYPE_NAMES.ADDON,
        productName: WEBHOSTING_PRODUCT_NAME,
        serviceNameToAddProduct: this.hosting,
        getPlanCode: () => this.getPlanCode(),
        onGetConfiguration: () => this.getConfiguration(),
      },
      workflowType: workflowConstants.WORKFLOW_TYPES.ORDER,
    };

    this.options = {
      isEditable: true,
      values: this.getOptionsValues(),
    };

    this.acceptContracts = false;
  }

  getConfiguration() {
    const conf = [
      {
        label: 'dc',
        value: this.datacenter,
      },
      {
        label: 'engine',
        value: this.version.id,
      },
    ];
    return conf;
  }

  getPlanCode() {
    return this.options.value.planCode;
  }

  getPlanCodeDisplay(planCode) {
    const diskSpace = planCode.split('-')[2];
    return this.$translate.instant('privatesql_activation_option_private-sql', {
      diskSpace,
    });
  }

  getOptionsValues() {
    return this.privateSqlOptions.map((e) => ({
      display: this.getPlanCodeDisplay(e.planCode),
      planCode: e.planCode,
    }));
  }

  getOrderState(state) {
    this.options.isEditable = !state.isLoading;
  }
}
