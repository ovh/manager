export default class AiDashboardRegistryController {
  /* @ngInject */
  constructor(atInternet, $translate, CucCloudMessage, AiDashboardService) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    [this.currentRegion] = this.regions;
    this.loadMessages();
  }

  deleteRegistry(registryId) {
    return this.goToRegistryDelete(registryId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.ai-dashboard.registries',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.ai-dashboard.registries',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
