import Registry from './registry.class';

export default class PciProjectTrainingRegistryService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  create(projectId, registry) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .save({ serviceName: projectId }, registry)
      .$promise.then((newRegistry) => new Registry(newRegistry));
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .query({ serviceName: projectId })
      .$promise.then((registries) =>
        registries.map((registry) => new Registry(registry)),
      );
  }

  get(projectId, registryId) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .get({
        serviceName: projectId,
        registryId,
      })
      .$promise.then((registry) => new Registry(registry));
  }

  delete(projectId, registryId) {
    return this.OvhApiCloudProjectAi.Training()
      .Registry()
      .v6()
      .delete({
        serviceName: projectId,
        registryId,
      }).$promise;
  }
}
