import { getCriteria } from '../project.utils';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpsController {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );
    this.criteria = getCriteria('ip', this.additionalIp);
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
