import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import {
  DATACENTER_CONFIGURATION_KEY,
  DB_OFFERS,
  ENGINE_CONFIGURATION_KEY,
} from '../order/public/hosting-database-order-public.constants';
import { DATABASES_TRACKING } from '../../hosting.constants';
import {
  PRESELECTED_DB_CATEGORY,
  WEBHOSTING_PRODUCT_NAME,
} from './private-sql-activation.constants';

export default class PrivateSqlActivationController {
  /* @ngInject */
  constructor($q, atInternet, $translate) {
    this.$q = $q;
    this.atInternet = atInternet;
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

    this.acceptContracts = false;
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
    return selectEngine?.selectEngineVersion;
  }

  getRightCatalogConfig() {
    const { ADDON } = workflowConstants.CATALOG_ITEM_TYPE_NAMES;

    return {
      catalog: this.privateSqlCatalog,
      catalogItemTypeName: ADDON,
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
