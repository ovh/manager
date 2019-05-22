export default class {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    CucServiceHelper,
    privateRegistryService,
    PRIVATE_REGISTRY_STATUS_MAP,
    PRIVATE_REGISTRY_STATUS,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.projectId = $stateParams.projectId;
    this.CucCloudMessage = CucCloudMessage;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.privateRegistryService = privateRegistryService;
    this.PRIVATE_REGISTRY_STATUS_MAP = PRIVATE_REGISTRY_STATUS_MAP;
    this.PRIVATE_REGISTRY_STATUS = PRIVATE_REGISTRY_STATUS;
  }

  $onInit() {
    this.loadMessages();
    this.getRegistryList(false);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.private-registry.list');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.private-registry.list', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getRegistryList(clearCache) {
    this.registryList = this.cucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.privateRegistryService.getRegistryList(this.projectId, clearCache)
        .catch(error => this.cucServiceHelper.errorHandler('private_registry_query_error')(error)),
    });
    return this.registryList.load();
  }

  createRegistry() {
    return this.$state.go('pci.projects.project.private-registry.list.create', { fromState: 'list' });
  }

  deleteRegistry(registryId, registryName) {
    const promise = this.$state.go('pci.projects.project.private-registry.list.delete', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
    });
    return promise;
  }

  updateRegistry(registryId, registryName) {
    const promise = this.$state.go('pci.projects.project.private-registry.list.update', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
    });
    return promise;
  }

  generateCredentials(registryId, registryName, harborURL) {
    const promise = this.$state.go('pci.projects.project.private-registry.list.credentials', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
      harborURL,
      confirmationRequired: true,
      fromState: 'list',
    });
    return promise;
  }

  copyApiUrl(registryId, url) {
    return this.$state.go('pci.projects.project.private-registry.list.api-url', {
      projectId: this.$stateParams.projectId,
      registryId,
      url,
    });
  }

  refreshRegistryList() {
    this.$state.reload();
  }
}
