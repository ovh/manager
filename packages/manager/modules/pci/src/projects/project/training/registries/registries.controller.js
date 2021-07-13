export default class PciTrainingRegistryController {
  /* @ngInject */
  constructor(CucCloudMessage, ovhManagerRegionService, atInternet) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMessages();
  }

  deleteRegistry(registryId) {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::registries::delete',
      type: 'action',
    });

    return this.goToRegistryDelete(registryId);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.registries',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
