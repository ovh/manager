import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getAvailableRegions"] }] */
export default class Regions {
  /* @ngInject */
  constructor($q, $translate) {
    this.$q = $q;
    this.$translate = $translate;
  }

  async getAvailableRegions(serviceName) {
    const response = await fetch(
      `/engine/api/cloud/project/${serviceName}/region`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
        },
      },
    );

    return response.json();
  }

  async getRegions(serviceName) {
    return this.$q
      .all({
        regions: this.getAvailableRegions(serviceName),
        quotas: fetch(`/engine/api/cloud/project/${serviceName}/quota`, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json',
          },
        }),
      })
      .then(async ({ quotas, regions }) => {
        const quotaData = await quotas.json();
        return regions.map((region) => ({
          ...region,
          quota: quotaData.find((quota) => quota.region === region.name),
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
