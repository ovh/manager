import compact from 'lodash/compact';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

export default class Regions {
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

  getAvailableRegions(projectId) {
    return this.OvhApiCloudProjectRegion.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((regions) =>
        Promise.all(
          map(regions, (id) =>
            this.OvhApiCloudProjectRegion.v6()
              .get({
                serviceName: projectId,
                id,
              })
              .$promise.catch(() => null),
          ),
        ).then((regionsDetail) => compact(regionsDetail)),
      );
  }

  getRegions(serviceName) {
    return this.OvhApiCloudProjectRegion.v6()
      .query({ serviceName })
      .$promise.then((regions) =>
        this.$q.all({
          quotas: this.OvhApiCloudProjectQuota.v6().query({ serviceName })
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
      .then(({ quotas, regions }) =>
        regions.map((region) => ({
          ...region,
          quota: quotas.find((quota) => quota.region === region.name),
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
