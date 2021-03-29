import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import set from 'lodash/set';

import {
  CACHED_OBJECT_LIST_PAGES,
  EXCLUDED_VERSIONS,
  MIGRATION_STATUS,
  X_PAGINATION_MODE,
} from './vps-migration.constants';

export default class VpsMigrationService {
  /* @ngInject */
  constructor($q, $http, $translate, $timeout) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.$timeout = $timeout;
  }

  getVpsList(catalog) {
    return this.$http
      .get(`/vps`, {
        headers: {
          [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
        },
      })
      .then((list) =>
        this.$q
          .all(
            map(
              filter(list.data, (vps) =>
                EXCLUDED_VERSIONS.includes(vps.model.version),
              ),
              (vps) =>
                this.getMigrationDetails(vps.name, catalog)
                  .then((migrationDetails) =>
                    migrationDetails.status === MIGRATION_STATUS.NOT_AVAILABLE
                      ? null
                      : set(vps, 'migration', migrationDetails),
                  )
                  .catch(() => null),
            ),
          )
          .then((filteredList) => compact(filteredList)),
      );
  }

  getMigrationDetails(serviceName, catalog) {
    return this.$http
      .get(`/vps/${serviceName}/migration2014`)
      .then((details) =>
        VpsMigrationService.populateOptionsPrice(details.data, catalog),
      );
  }

  scheduleMigration(serviceName, date) {
    return this.$http.post(`/vps/${serviceName}/migration2014`, { date });
  }

  static getPriceWithTax(price) {
    return (price.price + price.tax) / 100000000;
  }

  static populateOptionsPrice(vpsMigration, catalog) {
    let totalOptionsPrice = 0;
    map(vpsMigration.options, (option) => {
      const prices = find(catalog.addons, {
        planCode: option.vps2020code,
      });
      const price = find(prices.pricings, { mode: 'default', interval: 1 });
      set(option, 'price', VpsMigrationService.getPriceWithTax(price));
      totalOptionsPrice += option.price;
      return option;
    });
    set(vpsMigration, 'totalOptionsPrice', totalOptionsPrice);
    return vpsMigration;
  }

  static getMigrationPlan(catalog, name) {
    const product = find(catalog.products, { name });
    const plan = find(catalog.plans, { planCode: name });
    const price = find(plan.pricings, { mode: 'default', interval: 1 });
    return {
      description: product.description,
      price: VpsMigrationService.getPriceWithTax(price),
    };
  }

  getVpsModelDescription(model) {
    if (typeof model === 'string') {
      return model.replace(/\d+/g, `- $&`);
    }
    // Convert bytes to GiB
    // eslint-disable-next-line no-restricted-properties
    const ram = Math.floor(model.memory / Math.pow(10, 3));

    return (
      `${model.vcore} vCPU - ` +
      `${ram} ${this.$translate.instant('vps_migration_unit_size_GB')} RAM - ` +
      `${model.disk} ${this.$translate.instant(
        'vps_migration_unit_size_GB',
      )} Disk`
    );
  }
}
