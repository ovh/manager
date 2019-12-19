import map from 'lodash/map';

export default class OvhManagerPciStreamsAddService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo;
  }

  addStream(serviceName, streamCreation) {
    return this.OvhApiCloudProjectIo
      .Stream().v6().save({
        serviceName,
      }, streamCreation).$promise;
  }

  getAvailableRegion(serviceName, regionName) {
    return this.OvhApiCloudProjectIo
      .Capabilities().Stream().Region().v6()
      .get({
        serviceName,
        regionName,
      }).$promise.then((region) => Object.assign(region, {
        // add some properties to be used with pciProjectRegionsList component
        name: region.region,
        hasEnoughQuota: () => true,
      }));
  }

  getAvailableRegions(serviceName) {
    return this.OvhApiCloudProjectIo
      .Capabilities().Stream().Region().v6()
      .query({
        serviceName,
      }).$promise
      .then((regions) => {
        const promises = map(
          regions,
          (regionName) => this.getAvailableRegion(serviceName, regionName),
        );
        return this.$q.all(promises);
      });
  }
}
