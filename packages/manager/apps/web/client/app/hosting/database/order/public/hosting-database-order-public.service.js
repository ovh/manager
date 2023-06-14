import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import toNumber from 'lodash/toNumber';

import {
  DB_OFFERS,
  PRODUCT_NAME,
} from './hosting-database-order-public.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $http,
    coreConfig,
    OvhApiHostingWeb,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.OvhApiHostingWeb = OvhApiHostingWeb;
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
            .filter((product) => product.planCode.startsWith('sql_perso'))
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
    return this.OvhApiHostingWeb.ExtraSqlPerso()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((extraSqls) =>
        extraSqls.map((extra) => toNumber(extra.match(/\d+/)[0])),
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

  buildDbCategories(catalog, webCloudCatalog) {
    const startSqlCategory = this.constructor.getStartSqlCategory(catalog);
    const webCloudCategory = this.constructor.getWebCloudCategory(
      webCloudCatalog,
    );

    // const db groups
    const groupedCategories = {
      [DB_OFFERS.STARTER.CATEGORY]: startSqlCategory,
      [DB_OFFERS.PRIVATE.CATEGORY]: webCloudCategory,
    };
    const dbCategories = Object.keys(groupedCategories).map((category) => {
      const versions = groupedCategories[category];

      return {
        category,
        versions,
        selectVersion: versions[0],
        selectEngine: null,
      };
    });

    return dbCategories;
  }

  getWebCloudCatalog(ovhSubsidiary) {
    return this.$http
      .get(`/order/catalog/public/cloudDB?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data }) => data);
  }

  getPreprodCatalog(ovhSubsidiary) {
    return this.$http
      .get(
        `/order/catalog/public/webhostingPreprod?ovhSubsidiary=${ovhSubsidiary}`,
      )
      .then(({ data }) => data);
  }
}
