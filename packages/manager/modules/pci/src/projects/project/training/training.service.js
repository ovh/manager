export default class PciProjectTrainingService {
  /* @ngInject */
  constructor($q, $http, OvhApiCloudProjectAi, CucPriceHelper) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.CucPriceHelper = CucPriceHelper;
  }

  // Check if the given projectId has already been authorized on training platform
  isAuthorized(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .get({
        serviceName: projectId,
      })
      .$promise.then((authorization) => authorization.authorized);
  }

  createAuthorization(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .save({
        serviceName: projectId,
      })
      .$promise.then(() => true);
  }

  getPresetImages(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .PresetImage()
      .v6()
      .query({
        serviceName,
      }).$promise;
  }

  // validé
  getFeatures(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Feature()
      .v6()
      .get({
        serviceName,
      }).$promise;
  }

  getPricesFromCatalog(serviceName) {
    return this.CucPriceHelper.getPrices(serviceName);
  }
}
