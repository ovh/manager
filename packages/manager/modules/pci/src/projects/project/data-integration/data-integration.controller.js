import {
  DATA_INTEGRATION_LAB_LINK,
  DATA_INTEGRATION_TRACKING_PREFIX_FULL,
} from './data-integration.constants';

export default class DataIntegrationCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, atInternet) {
    this.cucCloudMessage = CucCloudMessage;
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

  trackFreeBetaLink() {
    this.atInternet.trackClick({
      name: `${DATA_INTEGRATION_TRACKING_PREFIX_FULL}::dashboard::link-to-free-beta`,
      type: 'action',
    });
  }
}
