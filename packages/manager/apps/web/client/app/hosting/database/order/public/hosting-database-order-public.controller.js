import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WEBHOSTING_PRODUCT_NAME } from '../../hosting-database.constants';
import {
  DB_OFFERS,
  DATACENTER_CONFIGURATION_KEY,
  ENGINE_CONFIGURATION_KEY,
} from './hosting-database-order-public.constants';
import { DATABASES_TRACKING } from '../../../hosting.constants';

export default class HostingDatabaseOrderPublicCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    const { catalog, catalogItemTypeName } = this.getRightCatalogConfig(true);
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        catalog,
        catalogItemTypeName,
        productName: this.getProductName.bind(this),
        serviceNameToAddProduct: this.getServiceNameToAddProduct.bind(this),
        getPlanCode: this.getPlanCode.bind(this),
        getRightCatalogConfig: this.getRightCatalogConfig.bind(this),
        onGetConfiguration: this.getOnGetConfiguration.bind(this),
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
      name: hit,
      type: 'action',
    });
  }

  onDbCategoryClick(dbCategory) {
    this.model.dbCategory = { ...this.model.dbCategory, ...dbCategory };
    this.trackClick(
      `${DATABASES_TRACKING.STEP_1.SELECT_DB_CATEGORY}_${dbCategory.tracking}`,
    );
  }

  onDbCategoryEngineClick(db) {
    this.model.dbCategory.selectEngine = {
      dbGroup: db.dbName,
      selectEngineVersion: db,
    };
    this.trackClick(
      `${DATABASES_TRACKING.STEP_2.SELECT_DB_ENGINE}_${db.dbName}`,
    );
  }

  onGoToNextStepClick() {
    this.trackClick(DATABASES_TRACKING.STEP_2.GO_TO_NEXT_STEP);
  }
}
