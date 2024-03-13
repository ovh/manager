import get from 'lodash/get';
import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';
import {
  PRESELECTED_DB_CATEGORY,
  PRODUCT_NAME,
} from './private-database-order-clouddb.constants';
import {
  DATACENTER_CONFIGURATION_KEY,
  DB_OFFERS,
  ENGINE_CONFIGURATION_KEY,
} from '../../../hosting/database/order/public/hosting-database-order-public.constants';
import { DATABASES_TRACKING } from '../../../hosting/hosting.constants';

export default class PrivateDatabaseOrderCloudDbCtrl {
  /* @ngInject */
  constructor($translate, PrivateDatabaseOrderCloudDb, atInternet) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.PrivateDatabaseOrderCloudDb = PrivateDatabaseOrderCloudDb;
  }

  $onInit() {
    this.preselectDbCategory = PRESELECTED_DB_CATEGORY;
    this.currentIndex = 0;
    this.defaultModelType = PRODUCT_NAME;
    const { catalog, catalogItemTypeName } = this.getRightCatalogConfig(true);
    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      workflowOptions: {
        expressOrder: true,
        catalog,
        catalogItemTypeName,
        productName: this.getProductName.bind(this),
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

  trackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
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

  getPlanCode() {
    const { selectVersion, selectEngine } = this.model.dbCategory;
    return (
      selectEngine?.selectEngineVersion?.planCode || selectVersion?.planCode
    );
  }

  getProductName() {
    return this.model.dbCategory.productName;
  }

  isValidDbConfig() {
    const { selectEngine } = this.model.dbCategory;
    return selectEngine?.selectEngineVersion;
  }

  prepareCheckout() {
    this.loadingCheckout = true;
    const checkoutData = {
      datacenter: this.datacenter,
      engine: this.model.engine.value,
      ramSize: this.model.ramSize.value,
      duration: this.model.duration.duration,
      pricingMode: this.model.duration.pricingMode,
    };

    return this.PrivateDatabaseOrderCloudDb.prepareCheckout(
      this.cartId,
      checkoutData,
    )
      .then(({ contracts, prices }) => {
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'private_database_order_clouddb_payment_get_checkout_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loadingCheckout = false;
      });
  }

  getRightCatalogConfig() {
    const { PLAN } = workflowConstants.CATALOG_ITEM_TYPE_NAMES;

    return {
      catalog: this.webCloudCatalog,
      catalogItemTypeName: PLAN,
    };
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
