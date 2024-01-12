import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getAvailableRegions"] }] */
export default class Regions {
  /* @ngInject */
  constructor($q, $http, iceberg, $translate) {
    this.$q = $q;
    this.$http = $http;
    this.iceberg = iceberg;
    this.$translate = $translate;
  }

  getAvailableRegions(serviceName) {
    return this.iceberg(`/cloud/project/${serviceName}/region`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data)
      .catch(() => []);
  }

  getRegions(serviceName) {
    return this.$q
      .all({
        regions: this.getAvailableRegions(serviceName),
        quotas: this.$http
          .get(`/cloud/project/${serviceName}/quota`)
          .then(({ data }) => data),
      })
      .then(({ quotas, regions }) => {
        return regions.map((region) => ({
          ...region,
          quota: quotas.find((quota) => quota.region === region.name),
        }));
      });
  }

  groupByContinentAndDatacenterLocation(regions) {
    return reduce(
      groupBy(regions, 'continent'),
      (previousRegions, regionByContinent, continent) => ({
        ...previousRegions,
        [continent]: groupBy(regionByContinent, 'macroRegion.text'),
      }),
      {
        [this.$translate.instant(
          'pci_project_regions_list_continent_all',
        )]: groupBy(regions, 'macroRegion.text'),
      },
    );
  }
}
