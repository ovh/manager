import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import toNumber from 'lodash/toNumber';

import {
  DB_OFFERS,
  PRODUCT_NAME,
  REGEX_DB_OFFER_SORT,
  OFFERS_WITHOUT_START_SQL,
} from './hosting-database-order-public.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $http,
    coreConfig,
    iceberg,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.iceberg = iceberg;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  computeCharacteristics(characteristicsOfAvailableProducts) {
    return characteristicsOfAvailableProducts.map((characteristics) => ({
      display: this.$translate.instant(
        characteristics.quantity === 1
          ? 'ovhManagerHostingDatabaseOrderPublic_customization_characteristics_display_1'
          : 'ovhManagerHostingDatabaseOrderPublic_customization_characteristics_display_+',
        {
          diskSpace: characteristics.diskSpace,
          quantity: characteristics.quantity,
        },
      ),
      characteristics,
    }));
  }

  static buildPlanCode(diskSpace, quantity) {
    return `sql_perso_${diskSpace}_${quantity}`;
  }

  getCharacteristicsOfAllProducts(serviceName) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .get({
        productName: PRODUCT_NAME,
        serviceName,
      })
      .$promise.then((products) =>
        sortBy(
          products
            .filter(
              (product) =>
                product.planCode.startsWith('sql_perso') ||
                product.planCode.startsWith('sql_optional'),
            )
            .map((product) => {
              const [, , diskSpace, quantity] = product.planCode.split('_');

              return {
                diskSpace: toNumber(diskSpace),
                quantity: toNumber(quantity),
              };
            }),
          ['diskSpace', 'quantity'],
        ),
      );
  }

  getUnavailableDiskSpaces(serviceName) {
    return this.iceberg(`/hosting/web/${serviceName}/extraSqlPerso`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.map(({ name }) => toNumber(name.match(/\d+/)?.[0] || null)),
      );
  }

  getCharacteristicsOfAvailableProducts(serviceName) {
    return this.$q
      .all([
        this.getCharacteristicsOfAllProducts(serviceName),
        this.getUnavailableDiskSpaces(serviceName),
      ])
      .then(([characteristicsOfAllProducts, unavailableDiskSpaces]) => {
        return characteristicsOfAllProducts.filter(
          (product) =>
            !unavailableDiskSpaces.some(
              (diskSpace) => product.diskSpace === diskSpace,
            ),
        );
      });
  }

  static getStartSqlCategory(catalog) {
    return catalog.addons.filter(({ planCode }) =>
      planCode.startsWith(DB_OFFERS.STARTER.PLAN_CODE_PREFIX),
    );
  }

  static getWebCloudCategory(webCloudCatalog) {
    const offers = webCloudCatalog.plans
      .filter(({ family }) => family === DB_OFFERS.PRIVATE.FAMILY)
      .map((dbGroup) => ({
        ...dbGroup,
        productSize: dbGroup.product.split('-')[2],
        tracking: DB_OFFERS.PRIVATE.TRACKING,
      }));

    // init db engines
    offers.forEach((dbOffer) => {
      const dbms = dbOffer.configurations
        .find(({ name }) => name === 'engine')
        .values.map((db) => {
          const [dbName, dbVersion] = db.split('_');
          return { db, dbName, dbVersion };
        });
      const groupedDbms = groupBy(dbms, 'dbName');
      const engines = Object.keys(groupedDbms).map((dbGroup) => ({
        dbGroup,
        versions: groupedDbms[dbGroup],
      }));

      set(dbOffer, 'engines', engines);
    });

    return offers;
  }

  static dbOfferSort(a, b) {
    return (
      a.planCode.match(REGEX_DB_OFFER_SORT).pop() -
      b.planCode.match(REGEX_DB_OFFER_SORT).pop()
    );
  }

  buildDbCategories(catalog, webCloudCatalog, offer) {
    const startSqlCategory = this.constructor
      .getStartSqlCategory(catalog)
      .sort(this.constructor.dbOfferSort);
    const webCloudCategory = this.constructor
      .getWebCloudCategory(webCloudCatalog)
      .sort(this.constructor.dbOfferSort);

    // const db groups
    const groupedCategories = {
      ...(!OFFERS_WITHOUT_START_SQL.includes(offer) && {
        [DB_OFFERS.STARTER.CATEGORY]: {
          versions: startSqlCategory,
          tracking: DB_OFFERS.STARTER.TRACKING,
          productName: DB_OFFERS.STARTER.PRODUCT_NAME,
        },
      }),
      [DB_OFFERS.PRIVATE.CATEGORY]: {
        versions: webCloudCategory,
        tracking: DB_OFFERS.PRIVATE.TRACKING,
        productName: DB_OFFERS.PRIVATE.PRODUCT_NAME,
      },
    };
    const dbCategories = Object.keys(groupedCategories).map((category) => {
      const { versions, tracking, productName } = groupedCategories[category];

      return {
        category,
        versions,
        tracking,
        selectVersion: versions[0],
        selectEngine: null,
        productName,
      };
    });

    return dbCategories;
  }

  getWebCloudCatalog(ovhSubsidiary) {
    return this.$http
      .get(`/order/catalog/public/cloudDB?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data }) => data);
  }
}
