import map from 'lodash/map';

export default class OvhManagerPciServingAddService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectAi) {
    this.$q = $q;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  addNamespace(serviceName, namespaceCreation) {
    return this.OvhApiCloudProjectAi
      .Serving()
      .v6()
      .save({ serviceName }, namespaceCreation)
      .$promise;
  }

  getAvailableRegions(serviceName) {
    return this.OvhApiCloudProjectAi
      .Capabilities()
      .Serving()
      .Region()
      .v6()
      .query({
        serviceName,
      }).$promise
      .then((regions) => {
        const promises = map(
          regions,
          regionName => ({
            name: regionName,
            hasEnoughQuota: () => true,
          }),
        );
        return this.$q.all(promises);
      });
  }
}
