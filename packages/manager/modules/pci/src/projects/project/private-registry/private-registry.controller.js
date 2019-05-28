import get from 'lodash/get';
import { PRIVATE_REGISTRY_STATUS, PRIVATE_REGISTRY_STATUS_MAP, GUIDELINK } from './private-registry.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    CucCloudMessage,
    pciPrivateRegistryService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.projectId = $stateParams.projectId;
    this.CucCloudMessage = CucCloudMessage;
    this.privateRegistryService = pciPrivateRegistryService;
    this.guideLink = GUIDELINK;
    this.PRIVATE_REGISTRY_STATUS = PRIVATE_REGISTRY_STATUS;
    this.PRIVATE_REGISTRY_STATUS_MAP = PRIVATE_REGISTRY_STATUS_MAP;
    this.registryList = [];
  }

  $onInit() {
    this.loadMessages();
    if (this.registries) {
      this.registryList = this.registries;
    }
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.private-registry');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.private-registry', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getRegistryList(clearCache) {
    return this.privateRegistryService.getRegistryList(this.projectId, clearCache)
      .then((res) => {
        this.registryList = res;
      })
      .catch(error => this.CucCloudMessage.error(
        this.$translate.instant('private_registry_query_error', {
          message: get(error, 'data.message'),
        }),
      ));
  }

  createRegistry() {
    return this.$state.go('pci.projects.project.private-registry.create');
  }

  deleteRegistry(registryId, registryName) {
    const promise = this.$state.go('pci.projects.project.private-registry.delete', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
    });
    return promise;
  }

  updateRegistry(registryId, registryName) {
    const promise = this.$state.go('pci.projects.project.private-registry.update', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
    });
    return promise;
  }

  generateCredentials(registryId, registryName, harborURL) {
    const promise = this.$state.go('pci.projects.project.private-registry.credentials', {
      projectId: this.$stateParams.projectId,
      registryId,
      registryName,
      harborURL,
      confirmationRequired: true,
    });
    return promise;
  }

  copyApiUrl(registryId, url) {
    return this.$state.go('pci.projects.project.private-registry.api-url', {
      projectId: this.$stateParams.projectId,
      registryId,
      url,
    });
  }

  refreshRegistryList() {
    this.$state.reload();
  }
}
