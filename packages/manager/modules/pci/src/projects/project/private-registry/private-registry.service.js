export default class pciPrivateRegistryService {
  /* @ngInject */
  constructor(
    OvhApiCloudProject,
    OvhApiMe,
  ) {
    this.OvhApiPrivateRegistry = OvhApiCloudProject.ContainerRegistry().v6();
    this.OvhApiPrivateRegistryUser = OvhApiCloudProject.ContainerRegistry().Users().v6();
    this.User = OvhApiMe;
  }

  /**
   * create a new registry
   * @accepts registry name
   * @returns new registry
   * @memberof pciPrivateRegistryService
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

  getContractInfo(contractId) {
    return this.User.Agreements().v6().contract({
      id: contractId,
    })
      .$promise
      .then(contract => contract);
  }

  acceptContract(contractId) {
    return this.User.Agreements().v6().accept({
      id: contractId,
    }, {})
      .$promise
      .then(contract => contract);
  }
}
