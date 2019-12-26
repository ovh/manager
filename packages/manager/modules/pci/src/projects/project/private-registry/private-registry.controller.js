import {
  PRIVATE_REGISTRY_STATUS,
  PRIVATE_REGISTRY_STATUS_MAP,
  GUIDELINK,
} from './private-registry.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $window,
    CucCloudMessage,
    pciPrivateRegistryService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.projectId = $stateParams.projectId;
    this.CucCloudMessage = CucCloudMessage;
    this.privateRegistryService = pciPrivateRegistryService;
    this.guideLink = GUIDELINK;
    this.PRIVATE_REGISTRY_STATUS = PRIVATE_REGISTRY_STATUS;
    this.PRIVATE_REGISTRY_STATUS_MAP = PRIVATE_REGISTRY_STATUS_MAP;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.private-registry');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.private-registry',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  create() {
    return this.$state.go('pci.projects.project.private-registry.create');
  }

  delete(registryId, registryName) {
    const promise = this.$state.go(
      'pci.projects.project.private-registry.delete',
      {
        projectId: this.$stateParams.projectId,
        registryId,
        registryName,
      },
    );
    return promise;
  }

  update(registryId, registryName) {
    const promise = this.$state.go(
      'pci.projects.project.private-registry.update',
      {
        projectId: this.$stateParams.projectId,
        registryId,
        registryName,
      },
    );
    return promise;
  }

  generateCredentials(registryId) {
    const promise = this.$state.go(
      'pci.projects.project.private-registry.credentials',
      {
        projectId: this.$stateParams.projectId,
        registryId,
        confirmationRequired: true,
      },
    );
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
