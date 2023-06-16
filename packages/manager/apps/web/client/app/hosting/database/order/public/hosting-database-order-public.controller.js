import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WEBHOSTING_PRODUCT_NAME } from '../../hosting-database.constants';
import { DB_OFFERS } from './hosting-database-order-public.constants';

export default class {
  $onInit() {
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        catalog: this.catalog,
        catalogItemTypeName: workflowConstants.CATALOG_ITEM_TYPE_NAMES.ADDON,
        productName: WEBHOSTING_PRODUCT_NAME,
        serviceNameToAddProduct: this.serviceName,
        getPlanCode: this.getPlanCode.bind(this),
      },
      workflowType: workflowConstants.WORKFLOW_TYPES.ORDER,
    };
    this.model = {
      dbCategory: {},
    };
  }

  getPlanCode() {
    const { selectVersion, selectEngine } = this.model.dbCategory;
    const { selectEngineVersion } = selectEngine || {};

    return selectEngineVersion?.planCode || selectVersion?.planCode;
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }

  isValidDbConfig() {
    const { category, selectVersion, selectEngine } = this.model.dbCategory;
    const { selectEngineVersion } = selectEngine || {};
    const isValidStarterConfig =
      category === DB_OFFERS.STARTER.CATEGORY && selectVersion;
    const isValidPrivateConfig =
      category === DB_OFFERS.PRIVATE.CATEGORY && selectEngineVersion;

    return isValidStarterConfig || isValidPrivateConfig;
  }

  onDbCategoryClick(dbCategory) {
    this.model.dbCategory = dbCategory;
  }
}
