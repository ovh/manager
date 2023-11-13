export default class AiDashboardDatastoreCtrl {
  /* @ngInject */
  constructor(atInternet, $translate, CucCloudMessage, AiDashboardService) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    [this.currentRegion] = this.regions;
    this.messageContainer = 'pci.projects.project.ai-dashboard.datastore';
    this.loadMessages();
  }

  onRegionChange() {
    this.AiDashboardService.getAIDatastores(
      this.projectId,
      this.currentRegion.id,
    ).then((data) => {
      this.aiDatastores = data;
    });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
