export default class privateRegistryService {
  /* @ngInject */
  constructor(
    OvhApiCloudProject,
  ) {
    this.OvhApiPrivateRegistry = OvhApiCloudProject.ContainerRegistry().v6();
    this.OvhApiPrivateRegistryUser = OvhApiCloudProject.ContainerRegistry().users().v6();
  }

  /**
   * create a new registry
   * @accepts registry name
   * @returns new registry
   * @memberof privateRegistryService
   */
  createRegistry(projectId, registry) {
    return this.OvhApiPrivateRegistry.create({ serviceName: projectId }, registry).$promise;
  }

  deleteRegistry(projectId, registryID) {
    return this.OvhApiPrivateRegistry.delete({
      serviceName: projectId,
      registryID,
    }).$promise;
  }

  getRegistryList(projectId, clearCache = false) {
    if (clearCache) {
      this.OvhApiPrivateRegistry.resetQueryCache();
    }
    return this.OvhApiPrivateRegistry.query({
      serviceName: projectId,
    }).$promise;
  }

  getRegistry(serviceName, registryID) {
    return this.OvhApiPrivateRegistry.get({
      serviceName, registryID,
    }).$promise;
  }

  updateRegistry(projectId, registryID, newRegistryName) {
    return this.OvhApiPrivateRegistry.update({
      serviceName: projectId,
      registryID,
    }, {
      name: newRegistryName,
    }).$promise;
  }

  generateCredentials(projectId, registryID) {
    return this.OvhApiPrivateRegistryUser.create({
      serviceName: projectId,
      registryID,
    }).$promise;
  }
}
