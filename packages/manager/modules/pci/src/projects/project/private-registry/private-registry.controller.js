import {
  PRIVATE_REGISTRY_STATUS,
  PRIVATE_REGISTRY_STATUS_MAP,
  GUIDELINK,
} from './private-registry.constants';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
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
}
