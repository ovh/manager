import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiCloudProjectQuota,
    OvhApiCloudProjectRegion,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
  }

  getRegions(serviceName) {
    return this.OvhApiCloudProjectRegion.v6()
      .query({ serviceName })
      .$promise.then((regions) =>
        this.$q.all({
          quota: this.OvhApiCloudProjectQuota.v6().query({ serviceName })
            .$promise,
          regions: this.$q.all(
            regions.map(
              (region) =>
                this.OvhApiCloudProjectRegion.v6().get({
                  serviceName,
                  id: region,
                }).$promise,
            ),
          ),
        }),
      )
      .then(({ quota, regions }) =>
        regions.map((region) => ({
          ...region,
          quota: find(quota, { region: region.name }),
        })),
      );
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
