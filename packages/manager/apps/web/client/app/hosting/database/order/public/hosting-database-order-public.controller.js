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

const UCENTS_FACTOR = 100000000;

export default class HostingDatabaseOrderPublicCtrl {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.ORDER_DATABASE_TRACKING = ORDER_DATABASE_TRACKING;
  }

  $onInit() {
    const renewPeriod = this.serviceInfo?.renew?.period;
    if (renewPeriod != null && this.catalog) {
      this.catalog = {
        ...this.catalog,
        addons: (this.catalog.addons || []).map((addon) => ({
          ...addon,
          pricings: (addon.pricings || []).filter(
            (p) =>
              !(p.capacities || []).includes(
                pricingConstants.PRICING_CAPACITIES.RENEW,
              ) || p.interval === renewPeriod,
          ),
        })),
      };
    }

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

  getStarterPricingSummary() {
    const { category, selectVersion } = this.model?.dbCategory || {};
    if (category !== DB_OFFERS.STARTER.CATEGORY || !selectVersion) {
      this.starterPricingSummaryCache = null;
      return null;
    }
    const cacheKey = `${category}|${selectVersion.planCode ||
      selectVersion.invoiceName}`;
    if (this.starterPricingSummaryCache?.key === cacheKey) {
      return this.starterPricingSummaryCache.value;
    }
    const PRICE_PLACEHOLDER = '__OVH_PRICE_VALUE__';
    const priceTemplate = this.$translate.instant(
      'web_hosting_database_order_components_db_categories_price',
      { priceValue: PRICE_PLACEHOLDER },
    );
    const formattedPrice = this.getStarterPriceLabel(selectVersion);
    const priceLine = priceTemplate.replace(PRICE_PLACEHOLDER, formattedPrice);

    const value = {
      rows: [
        {
          label: this.$translate.instant(
            'ovhManagerHostingDatabaseOrderPublic_pricing_summary_solution',
          ),
          value: this.$translate.instant(
            'web_hosting_database_order_components_db_categories_offers_category_starter',
          ),
        },
        {
          label: this.$translate.instant(
            'ovhManagerHostingDatabaseOrderPublic_pricing_summary_offer',
          ),
          value: selectVersion.invoiceName,
        },
        {
          label: this.$translate.instant(
            'ovhManagerHostingDatabaseOrderPublic_pricing_summary_price',
          ),
          value: priceLine,
        },
      ],
      notes: [
        this.$translate.instant(
          'ovhManagerHostingDatabaseOrderPublic_pricing_summary_prorata',
        ),
        this.$translate.instant(
          'ovhManagerHostingDatabaseOrderPublic_pricing_summary_redirect',
        ),
      ],
    };
    this.starterPricingSummaryCache = { key: cacheKey, value };
    return value;
  }

  getStarterPriceLabel(selectVersion) {
    const pricePerMonth = selectVersion?.pricings?.find(
      ({ interval }) => interval === 1,
    )?.price;
    const pricePerYear =
      selectVersion?.pricings?.find(({ interval }) => interval === 12)?.price /
      12;
    const priceInUcents = pricePerMonth || pricePerYear || 0;
    return HostingDatabaseOrderPublicCtrl.formatCurrency(
      priceInUcents / UCENTS_FACTOR,
      this.user,
    );
  }

  static formatCurrency(price, user) {
    const code = user?.currency?.code;
    const locale = (user?.language || 'en_GB').replace('_', '-');
    if (code) {
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: code,
        }).format(price);
      } catch (e) {
        // fall through to fallback below
      }
    }
    // Fallback: decode HTML-encoded symbol (e.g. "&#8364;") if currency
    // code is missing for some reason.
    const symbol = HostingDatabaseOrderPublicCtrl.decodeHtmlEntities(
      user?.currency?.symbol || '',
    );
    return `${price.toFixed(2)} ${symbol}`.trim();
  }

  static decodeHtmlEntities(text) {
    if (!text) return '';
    return String(text)
      .replace(/&#(\d+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
      .replace(/&amp;/g, '&')
      .replace(/&euro;/g, '€')
      .replace(/&pound;/g, '£')
      .replace(/&dollar;/g, '$')
      .replace(/&yen;/g, '¥');
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
