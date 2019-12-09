import map from 'lodash/map';

export default class OvhManagerPciServingAddService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectAiServing) {
    this.$q = $q;
    this.OvhApiCloudProjectAiServing = OvhApiCloudProjectAiServing;
  }

  addNamespace(serviceName, namespaceCreation) {
    return this.OvhApiCloudProjectAiServing
      .v6().save({
        serviceName,
      }, namespaceCreation).$promise;
  }

  getAvailableRegions(serviceName) {
    return this.OvhApiCloudProjectAiServing
      .Capabilities().Region().v6()
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
