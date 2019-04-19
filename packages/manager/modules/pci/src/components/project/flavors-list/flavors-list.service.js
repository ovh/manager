import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import Flavor from './flavor.class';
import FlavorGroup from './flavor-group.class';

import { CATEGORIES, LEGACY_FLAVORS } from './flavors-list.constants';

export default class FlavorsList {
  /* @ngInject */
  constructor(
    $q,
    CucPriceHelper,
    OvhApiCloudProjectFlavor,
  ) {
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
  }

  getFlavors(serviceName) {
    return this.$q.all({
      flavors: this.OvhApiCloudProjectFlavor.v6().query({ serviceName }).$promise,
      prices: this.CucPriceHelper.getPrices(serviceName),
    })
      .then(({ flavors, prices }) => map(
        groupBy(flavors, 'name'),
        flavor => new Flavor({
          ...flavor[0],
          prices: mapValues(flavor[0].planCodes, planCode => prices[planCode].price),
          regions: map(flavor, 'region'),
        }),
      ));
  }

  static mapByFlavorType(flavors) {
    return map(FlavorsList.groupByGroupName(flavors), group => new FlavorGroup(group));
  }

  static groupByGroupName(flavors) {
    return groupBy(flavors, 'groupName');
  }

  static groupByCategory(flavors) {
    return CATEGORIES.map(({ category, pattern }) => ({
      category,
      flavors: filter(flavors, flavor => pattern.test(flavor.type)),
    }));
  }

  static isLegacyFlavor(flavor) {
    return LEGACY_FLAVORS.test(flavor.name);
  }
}
