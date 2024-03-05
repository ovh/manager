import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import {
  DATACENTER_CONFIGURATION_KEY,
  DB_OFFERS,
  ENGINE_CONFIGURATION_KEY,
} from '../order/public/hosting-database-order-public.constants';
import {
  PRESELECTED_DB_CATEGORY,
  WEBHOSTING_PRODUCT_NAME,
} from './private-sql-activation.constants';

export default class PrivateSqlActivationController {
  /* @ngInject */
  constructor($q, $translate) {
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.preselectDbCategory = PRESELECTED_DB_CATEGORY;
    const { catalog, catalogItemTypeName } = this.getRightCatalogConfig(true);
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        catalog,
        catalogItemTypeName,
        productName: WEBHOSTING_PRODUCT_NAME,
        serviceNameToAddProduct: this.getServiceNameToAddProduct.bind(this),
        getPlanCode: this.getPlanCode.bind(this),
        getRightCatalogConfig: this.getRightCatalogConfig.bind(this),
        onGetConfiguration: this.getConfiguration.bind(this),
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

  getServiceNameToAddProduct() {
    return this.hosting;
  }

  getConfiguration() {
    const { productName } = this.model.dbCategory;
    if (productName === DB_OFFERS.PRIVATE.PRODUCT_NAME) {
      const { db } = this.model.dbCategory.selectEngine.selectEngineVersion;
      const [
        datacenterValue,
      ] = this.model.dbCategory.selectVersion.configurations.find(
        (item) => item.name === DATACENTER_CONFIGURATION_KEY,
      )?.values;

      return [
        {
          label: ENGINE_CONFIGURATION_KEY,
          value: db,
        },
        {
          label: DATACENTER_CONFIGURATION_KEY,
          value: datacenterValue,
        },
      ];
    }
    return [];
  }

  isValidDbConfig() {
    const { selectEngine } = this.model.dbCategory;
    const { selectEngineVersion } = selectEngine || {};
    return !!selectEngineVersion;
  }

  getRightCatalogConfig() {
    const { ADDON } = workflowConstants.CATALOG_ITEM_TYPE_NAMES;

    return {
      catalog: this.privateSqlCatalog,
      catalogItemTypeName: ADDON,
    };
  }

  onDbCategoryClick(dbCategory) {
    this.model.dbCategory = dbCategory;
  }

  onDbCategoryEngineClick(db) {
    this.model.dbCategory.selectEngine = {
      dbGroup: db.dbName,
      selectEngineVersion: db,
    };
  }
}
