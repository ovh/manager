import { getCriteria } from '../project.utils';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.failover-ips';

export default class FailoverIpController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    coreURLBuilder,
    CucCloudMessage,
    OvhApiCloudProjectIpFailover,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;

    this.DEDICATED_IPS_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/configuration/ip',
    );
  }

  $onInit() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );
    this.criteria = getCriteria('ip', this.failoverIp);
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
