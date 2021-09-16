import compact from 'lodash/compact';
import map from 'lodash/map';

export default class Regions {
  /* @ngInject */
  constructor(OvhApiCloudProjectRegion) {
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
}
