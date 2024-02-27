const DATAGRID_MAX_ITEMS_PER_PAGE = 10;

export default class AiAppDashboardAttachDataCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, AppService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DATAGRID_MAX_ITEMS_PER_PAGE = DATAGRID_MAX_ITEMS_PER_PAGE;
    this.AppService = AppService;
  }

  $onInit() {
    this.trackApps('attached_data', 'page');
    this.messageContainer =
      'pci.projects.project.ai.apps.dashboard.attach-data';
    this.loadMessages();
    this.dataStoreVolumes = this.app.spec.volumes.filter(
      ({ dataStore }) => dataStore !== undefined,
    );
    this.publicGitVolumes = this.app.spec.volumes.filter(
      ({ publicGit }) => publicGit !== undefined,
    );
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

  manualDataSync(volume) {
    const selectedVolume = this.app.status.volumes.find(
      ({ mountPath }) => mountPath === volume?.mountPath,
    );
    this.goToManualDataSync(selectedVolume?.id, selectedVolume?.mountPath);
  }
}
