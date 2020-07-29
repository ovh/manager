import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import some from 'lodash/some';

import Flavor from './flavor.class';
import FlavorGroup from './flavor-group.class';

import {
  CPU_FREQUENCY,
  CATEGORIES,
  LEGACY_FLAVORS,
} from './flavors-list.constants';

export default class FlavorsList {
  /* @ngInject */
  constructor(
    $q,
    CucPriceHelper,
    OvhApiCloudProjectFlavor,
    OvhApiMe,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  getFlavors(serviceName, currentRegion) {
    return this.$q
      .all({
        flavors: this.OvhApiCloudProjectFlavor.v6().query({
          serviceName,
          region: currentRegion,
        }).$promise,
        prices: this.CucPriceHelper.getPrices(serviceName),
        catalog: this.OvhApiMe.v6()
          .get()
          .$promise.then(
            ({ ovhSubsidiary }) =>
              this.OvhApiOrderCatalogPublic.v6().get({
                productName: 'cloud',
                ovhSubsidiary,
              }).$promise,
          ),
      })
      .then(({ flavors, prices, catalog }) =>
        map(
          groupBy(
            flavors.filter(({ planCodes }) => !isNil(planCodes.hourly)),
            'name',
          ),
          (groupedFlavors) =>
            new Flavor({
              ...omit(groupedFlavors[0], ['available', 'region']),
              technicalBlob: get(
                find(catalog.addons, {
                  invoiceName: groupedFlavors[0].name,
                }),
                'blobs.technical',
              ),
              available: some(groupedFlavors, 'available'),
              prices: mapValues(
                groupedFlavors[0].planCodes,
                (planCode) => prices[planCode].price,
              ),
              regions: map(
                filter(groupedFlavors, 'available'),
                ({ id, region }) => ({ id, region }),
              ),
              frequency: get(CPU_FREQUENCY, groupedFlavors[0].type),
              groupName: groupedFlavors[0].groupName.replace(/-flex/, ''),
            }),
        ),
      );
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
    return CATEGORIES.map(({ category, title, pattern }) => ({
      category,
      title,
      flavors: filter(flavors, (flavor) => pattern.test(flavor.type)),
    }));
  }

  static isLegacyFlavor(flavor) {
    return LEGACY_FLAVORS.test(flavor.name);
  }
}
