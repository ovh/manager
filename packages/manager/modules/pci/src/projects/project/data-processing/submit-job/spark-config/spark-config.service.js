export default class SparkConfigService {
  /* @ngInject */
  constructor(PciStoragesContainersService) {
    this.containerService = PciStoragesContainersService;
  }

  listContainers(projectId) {
    return this.containerService.getAll(projectId);
  }

  listObjects(projectId, containerId) {
    return this.containerService.getContainer(projectId, containerId);
  }
}
