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
  LOCAL_ZONE,
} from './flavors-list.constants';
import { TAGS_BLOB } from '../../../constants';

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
    this.LOCAL_ZONE = LOCAL_ZONE;
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
        productAvailability: this.getProductAvailability(
          serviceName,
          this.coreConfig.getUser().ovhSubsidiary,
        ),
      })
      .then(({ flavors, prices, catalog, productAvailability }) => {
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
                planCode: resource.planCodes.hourly,
              }),
              'blobs.technical',
            ),
            tagsBlob: get(
              catalog.addons.find(
                (addon) => addon.planCode === resource.planCodes.hourly,
              ),
              'blobs.tags',
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
            locationCompatibility: this.getlocationCompatibility(
              productAvailability.plans.find(
                (plan) => plan.code === resource.planCodes.hourly,
              ),
            ),
          });
        });
      });
  }

  getlocationCompatibility(productAvailability) {
    return {
      isLocalZone: productAvailability?.regions.some(
        (region) => region.type === this.LOCAL_ZONE,
      ),
      isGlobalZone: productAvailability?.regions.some(
        (region) => region.type !== this.LOCAL_ZONE,
      ),
    };
  }

  getProductAvailability(projectId, ovhSubsidiary) {
    return this.$http
      .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
        params: { ovhSubsidiary },
      })
      .then(({ data }) => data);
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
    return CATEGORIES.map(({ category, title, pattern, isNew }) => {
      const filteredAndRearrangedFlavors = filter(flavors, (flavor) =>
        pattern.test(flavor.type),
      );

      return {
        category,
        title,
        isNew,
        flavors: [
          ...filteredAndRearrangedFlavors.filter((flavor) =>
            flavor?.tagsBlob.includes(TAGS_BLOB.IS_NEW),
          ),
          ...filteredAndRearrangedFlavors.filter(
            (flavor) => !flavor?.tagsBlob.includes(TAGS_BLOB.IS_NEW),
          ),
        ],
      };
    });
  }

  static isLegacyFlavor(flavor) {
    return LEGACY_FLAVORS.test(flavor.name);
  }
}
