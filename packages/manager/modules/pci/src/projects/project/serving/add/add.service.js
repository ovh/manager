import map from 'lodash/map';

export default class OvhManagerPciServingAddService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo, OvhApiCloudProjectServing) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo; // TODO REMOVE
    this.OvhApiCloudProjectServing = OvhApiCloudProjectServing;
  }

  addNamespace(serviceName, namespaceCreation) {
    return this.OvhApiCloudProjectServing
      .Namespace().v6().save({
        serviceName,
      }, namespaceCreation).$promise;
  }

  getAvailableRegion(serviceName, regionName) {
    return this.OvhApiCloudProjectIo
      .Capabilities().Stream().Region().v6()
      .get({
        serviceName,
        regionName,
      }).$promise.then(region => Object.assign(region, {
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
          regionName => this.getAvailableRegion(serviceName, regionName),
        );
        return this.$q.all(promises);
      });
  }
}
