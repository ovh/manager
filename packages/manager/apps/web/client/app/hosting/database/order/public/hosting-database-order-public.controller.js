import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WEBHOSTING_PRODUCT_NAME } from '../../hosting-database.constants';
import {
  DB_OFFERS,
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
  ORDER_DATABASE_TRACKING,
} from './hosting-database-order-public.constants';

export default class HostingDatabaseOrderPublicCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.ORDER_DATABASE_TRACKING = ORDER_DATABASE_TRACKING;
  }

  $onInit() {
    const { catalog, catalogItemTypeName } = this.getRightCatalogConfig(true);
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        expressOrder: true,
        catalog,
        catalogItemTypeName,
        productName: this.getProductName.bind(this),
        serviceNameToAddProduct: this.getServiceNameToAddProduct.bind(this),
        getPlanCode: this.getPlanCode.bind(this),
        getRightCatalogConfig: this.getRightCatalogConfig.bind(this),
        onGetConfiguration: this.getOnGetConfiguration.bind(this),
        onPricingSubmit: (pricing) => {
          this.trackClick({
            ...ORDER_DATABASE_TRACKING.PRICING.NEXT,
            name: ORDER_DATABASE_TRACKING.PRICING.NEXT.name
              .replace(/{{pricing}}/g, `${pricing.interval}M`)
              .replace(/{{databaseSolution}}/g, this.databaseSolution()),
          });
        },
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

  getProductName() {
    const { productName } = this.model.dbCategory;
    return productName;
  }

  getServiceNameToAddProduct() {
    return this.model.dbCategory.productName === WEBHOSTING_PRODUCT_NAME
      ? this.serviceName
      : '';
  }

  getOnGetConfiguration() {
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
    const { category, selectVersion, selectEngine } = this.model.dbCategory;
    const { selectEngineVersion } = selectEngine || {};
    const isValidStarterConfig =
      category === DB_OFFERS.STARTER.CATEGORY && selectVersion;
    const isValidPrivateConfig =
      category === DB_OFFERS.PRIVATE.CATEGORY && selectEngineVersion;

    return isValidStarterConfig || isValidPrivateConfig;
  }

  getRightCatalogConfig(isInit = false) {
    const { PLAN, ADDON } = workflowConstants.CATALOG_ITEM_TYPE_NAMES;
    const { category, selectVersion } = this?.model?.dbCategory || {};
    const currentCategory = isInit ? this.preselectDbCategory : category;
    const isValidStarterConfig =
      currentCategory === DB_OFFERS.STARTER.CATEGORY && selectVersion;

    // init case but no preselect db category
    if (isInit && !this.preselectDbCategory) {
      return { catalog: this.catalog };
    }

    return {
      catalog: isValidStarterConfig ? this.catalog : this.webCloudCatalog,
      catalogItemTypeName: isValidStarterConfig ? ADDON : PLAN,
    };
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  }

  onDbCategoryClick(dbCategory) {
    this.model.dbCategory = { ...this.model.dbCategory, ...dbCategory };
  }

  onDbCategoryEngineClick(db) {
    this.model.dbCategory.selectEngine = {
      dbGroup: db.dbName,
      selectEngineVersion: db,
    };
  }

  onGoToNextStepClick() {
    this.trackClick({
      ...ORDER_DATABASE_TRACKING.OPTION.NEXT,
      name: ORDER_DATABASE_TRACKING.OPTION.NEXT.name.replace(
        /{{databaseSolution}}/g,
        this.databaseSolution(),
      ),
    });
  }

  onOptionEdit() {
    if (Object.keys(this.model.dbCategory).length > 0) {
      this.trackClick(ORDER_DATABASE_TRACKING.OPTION.EDIT);
    }
  }

  databaseSolution() {
    const { selectEngine, selectVersion, tracking } = this.model.dbCategory;
    if (selectEngine) {
      return `${selectEngine.dbGroup}-${selectVersion.productSize}`;
    }
    return `${tracking}-${selectVersion.product.split('-')[2]}-${
      selectVersion.productSize
    }`;
  }
}
