import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import some from 'lodash/some';
import includes from 'lodash/includes';

import Flavor from './flavor.class';
import FlavorGroup from './flavor-group.class';

import {
  CATEGORIES,
  DEFAULT_CATALOG_ENDPOINT,
  LEGACY_FLAVORS,
} from './flavors-list.constants';

export default class FlavorsList {
  /* @ngInject */
  constructor(
    $q,
    $http,
    coreConfig,
    CucPriceHelper,
    OvhApiCloudProjectFlavor,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  getCatalog(endpoint, ovhSubsidiary) {
    return this.$http
      .get(endpoint, {
        params: {
          productName: 'cloud',
          ovhSubsidiary,
        },
      })
      .then(({ data: catalog }) => catalog);
  }

  getFlavors(
    serviceName,
    currentRegion,
    catalogEndpoint = DEFAULT_CATALOG_ENDPOINT,
  ) {
    return this.$q
      .all({
        flavors: this.OvhApiCloudProjectFlavor.v6().query({
          serviceName,
          region: currentRegion,
        }).$promise,
        prices: this.CucPriceHelper.getPrices(serviceName, catalogEndpoint),
        catalog: this.getCatalog(
          catalogEndpoint,
          this.coreConfig.getUser().ovhSubsidiary,
        ),
      })
      .then(({ flavors, prices, catalog }) => {
        const hourlyPlanCodes = flavors.filter(
          ({ planCodes }) => !isNil(planCodes.hourly),
        );
        const groupedPlanCodesByName = groupBy(hourlyPlanCodes, 'name');

        return map(groupedPlanCodesByName, (groupedFlavors) => {
          const resource = groupedFlavors[0];

          return new Flavor({
            ...omit(resource, ['available', 'region']),
            technicalBlob: get(
              find(catalog.addons, {
                invoiceName: resource.name,
              }),
              'blobs.technical',
            ),
            available: some(groupedFlavors, 'available'),
            prices: mapValues(
              resource.planCodes,
              (planCode) => prices[planCode]?.price,
            ),
            regions: map(
              filter(groupedFlavors, 'available'),
              ({ id, region }) => ({ id, region }),
            ),
            groupName: resource.groupName.replace(/-flex/, ''),
            legacy: includes(
              get(
                find(catalog.addons, {
                  invoiceName: resource.name.replace(/-ssd$/, ''),
                }),
                'blobs.tags',
              ),
              'legacy',
            ),
          });
        });
      });
  }

  static mapByFlavorType(flavors, image) {
    return map(
      FlavorsList.groupByGroupName(flavors),
      (group) => new FlavorGroup(group, image),
    );
  }

  static groupByGroupName(flavors) {
    return groupBy(flavors, 'groupName');
  }

  static groupByCategory(flavors) {
    return CATEGORIES.map(({ category, title, pattern, isNew }) => ({
      category,
      title,
      isNew,
      flavors: filter(flavors, (flavor) => pattern.test(flavor.type)),
    }));
  }

  static isLegacyFlavor(flavor) {
    return LEGACY_FLAVORS.test(flavor.name);
  }
}
