import get from 'lodash/get';
import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';
import {
  ORDER_WEBCLOUD_DATABASE_TRACKING,
  PRESELECTED_DB_CATEGORY,
  PRODUCT_NAME,
} from './private-database-order-clouddb.constants';
import {
  DATACENTER_CONFIGURATION_KEY,
  DB_OFFERS,
  ENGINE_CONFIGURATION_KEY,
} from '../../../hosting/database/order/public/hosting-database-order-public.constants';

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
        onPricingSubmit: (pricing) => {
          this.trackClick({
            ...ORDER_WEBCLOUD_DATABASE_TRACKING.PRICING.NEXT,
            name: ORDER_WEBCLOUD_DATABASE_TRACKING.PRICING.NEXT.name
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

  trackClick(hit) {
    this.atInternet.trackClick({
      ...hit,
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
  }

  onDbCategoryEngineClick(db) {
    this.model.dbCategory.selectEngine = {
      dbGroup: db.dbName,
      selectEngineVersion: db,
    };
  }

  onGoToNextStepClick() {
    this.trackClick({
      ...ORDER_WEBCLOUD_DATABASE_TRACKING.OPTION.NEXT,
      name: ORDER_WEBCLOUD_DATABASE_TRACKING.OPTION.NEXT.name.replace(
        /{{databaseSolution}}/g,
        this.databaseSolution(),
      ),
    });
  }

  onOptionEdit() {
    if (Object.keys(this.model.dbCategory).length > 0) {
      this.trackClick(ORDER_WEBCLOUD_DATABASE_TRACKING.OPTION.EDIT);
    }
  }

  databaseSolution() {
    const { selectEngine, selectVersion } = this.model.dbCategory;
    return `${selectEngine.dbGroup}-${selectVersion.productSize}`;
  }
}
