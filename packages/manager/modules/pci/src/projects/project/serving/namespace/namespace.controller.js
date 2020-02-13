import { GUIDE_URL } from './namespace.constants';

export default class PciServingNamespaceController {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
    this.guideUrl = GUIDE_URL;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving.namespace',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
