import { getCriteria } from '../project.utils';
import { PRIVATE_NETWORK_LIST } from './private-networks.constants';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectNetworkPrivateSubnet,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
    this.PRIVATE_NETWORK_LIST = PRIVATE_NETWORK_LIST;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.networkId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(CONTAINER_NAME);
    this.messageHandler = this.CucCloudMessage.subscribe(CONTAINER_NAME, {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
