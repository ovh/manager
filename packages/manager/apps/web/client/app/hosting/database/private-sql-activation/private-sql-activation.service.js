import groupBy from 'lodash/groupBy';
import { PRIVATE_SQL_PLAN_CODE } from '../hosting-database.constants';
import { DB_OFFERS } from '../order/public/hosting-database-order-public.constants';
import { PRIVATE_SQL_PLAN_CODE_PREFIX } from './private-sql-activation.constants';

export default class PrivateSql {
  /* @ngInject */
  constructor($http, coreConfig, Hosting) {
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.Hosting = Hosting;
  }

  buildPrivateSqlDbCategories(webCloudCatalog) {
    const webCloudCategory = this.constructor.getPrivateSqlCategory(
      webCloudCatalog,
    );
    // const db groups
    const groupedCategories = {
      [DB_OFFERS.PRIVATE.CATEGORY]: {
        versions: webCloudCategory,
        tracking: DB_OFFERS.PRIVATE.TRACKING,
        productName: DB_OFFERS.PRIVATE.PRODUCT_NAME,
      },
    };

    return Object.keys(groupedCategories).map((category) => {
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
  }

  getPrivateSqlCatalogForHosting(ovhSubsidiary) {
    return this.$http
      .get(`/order/catalog/public/webHosting?ovhSubsidiary=${ovhSubsidiary}`)
      .then(({ data }) => data);
  }

  getHasPrivateSqlToActivate(serviceName) {
    return this.$http
      .get(`/order/cartServiceOption/webHosting/${serviceName}`)
      .then(({ data }) =>
        data.some((item) => item.planCode === PRIVATE_SQL_PLAN_CODE),
      );
  }

  static getPrivateSqlCategory(catalog) {
    return catalog.addons
      .reduce((acc, current) => {
        const { planCode } = current;
        if (planCode.startsWith(PRIVATE_SQL_PLAN_CODE_PREFIX)) {
          const dbOffer = {
            ...current,
            productSize: current.product.split('-')[2],
            tracking: DB_OFFERS.PRIVATE.TRACKING,
          };
          const dbms = dbOffer.configurations
            .find(({ name }) => name === 'engine')
            .values.map((db) => {
              const [dbName, dbVersion] = db.split('_');
              return { db, dbName, dbVersion };
            });
          const groupedDbms = groupBy(dbms, 'dbName');
          dbOffer.engines = Object.keys(groupedDbms).map((dbGroup) => ({
            dbGroup,
            versions: groupedDbms[dbGroup],
          }));
          acc.push(dbOffer);
        }
        return acc;
      }, [])
      .sort((a, b) => a.productSize - b.productSize);
  }
}
