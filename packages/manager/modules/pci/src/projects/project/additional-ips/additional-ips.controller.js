import { getCriteria } from '../project.utils';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpController {
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

    this.FAILOVER_IPS_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/ip?serviceName=_FAILOVER&page=1',
    );
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
