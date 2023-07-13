import { DATA_INTEGRATION_LAB_LINK } from './data-integration.constants';

export default class DataIntegrationCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, coreConfig, atInternet) {
    this.cucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.loadMessages();
    this.labLink = DATA_INTEGRATION_LAB_LINK;
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe('pci.projects.project.data-integration');
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.data-integration',
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
