import map from 'lodash/map';

export default class PciProjectTrainingService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProjectAi,
    OvhApiCloudProjectUser,
    CucPriceHelper,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
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

  getAllUsers(projectId) {
    this.OvhApiCloudProjectUser.v6().resetQueryCache();
    return this.OvhApiCloudProjectUser.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((users) => {
        return users.filter((user) => {
          const aiRole = user.roles.find(
            (role) =>
              role.name === 'ai_training_operator' ||
              role.name === 'administrator',
          );
          return aiRole !== undefined;
        });
      });
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

  getFeatures(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Feature()
      .v6()
      .get({
        serviceName,
      }).$promise;
  }

  getRegistry(serviceName) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .get({
        serviceName,
      })
      .$promise.catch(() => {
        return { custom: false };
      });
  }

  saveRegistry(serviceName, url, username, password) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .save({ serviceName }, { url, username, password }).$promise;
  }

  deleteRegistry(serviceName) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .delete({
        serviceName,
      }).$promise;
  }

  getPricesFromCatalog(serviceName) {
    return this.CucPriceHelper.getPrices(serviceName);
  }

  getRegions(serviceName) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Region()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((regions) => {
        return map(regions, (region) => ({
          ...region,
          name: region.id,
          hasEnoughQuota: () => true,
        }));
      });
  }

  getGpus(serviceName, region) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Region()
      .Gpu()
      .v6()
      .query({
        serviceName,
        region,
      }).$promise;
  }
}
