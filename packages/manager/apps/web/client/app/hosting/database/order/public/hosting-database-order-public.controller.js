import { PRODUCT_NAME } from './hosting-database-order-public.constants';

import HostingDatabaseOrderPublic from './hosting-database-order-public.service';

export default class {
  /* @ngInject */
  constructor(
    OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS,
    OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS,
    HostingDatabaseOrderPublicService,
  ) {
    this.OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS = OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS;
    this.OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS = OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS;
    this.HostingDatabaseOrderPublicService = HostingDatabaseOrderPublicService;
  }

  $onInit() {
    this.productOffers = {
      pricingType: this.OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS
        .PRICING_CAPACITIES.RENEW,
      user: this.user,
      workflowOptions: {
        catalog: this.catalog,
        catalogItemTypeName: this.OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS
          .CATALOG_ITEM_TYPE_NAMES.ADDON,
        productName: PRODUCT_NAME,
        serviceNameToAddProduct: this.serviceName,
        getPlanCode: this.getPlanCode.bind(this),
      },
      workflowType: this.OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS
        .WORKFLOW_TYPES.ORDER,
    };

    this.characteristics = {
      isEditable: true,
      values: this.HostingDatabaseOrderPublicService.computeCharacteristics(
        this.characteristicsOfAvailableProducts,
      ),
    };
  }

  getPlanCode() {
    const { diskSpace, quantity } = this.characteristics.value.characteristics;

    return HostingDatabaseOrderPublic.buildPlanCode(diskSpace, quantity);
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }
}
