const MESSAGES_CONTAINER_NAME = 'pci.projects.project.failover-ips';

export default class FailoverIpController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectIpFailover) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;
  }

  $onInit() {
    this.messageHandler = this.CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
