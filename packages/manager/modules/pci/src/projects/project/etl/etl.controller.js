export default class EtlCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, coreConfig, atInternet) {
    this.cucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe('pci.projects.project.etl');
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.etl',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  trackClick(guide) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::guide::${guide.id}`,
      type: 'action',
    });
  }
}
