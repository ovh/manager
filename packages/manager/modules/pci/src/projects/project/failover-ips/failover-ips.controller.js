import { DEDICATED_IPS_URL } from './failover-ips.constants';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.failover-ips';

export default class FailoverIpController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    coreConfig,
    CucCloudMessage,
    OvhApiCloudProjectIpFailover,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;

    this.DEDICATED_IPS_URL = DEDICATED_IPS_URL[coreConfig.getRegion()];
  }

  $onInit() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
