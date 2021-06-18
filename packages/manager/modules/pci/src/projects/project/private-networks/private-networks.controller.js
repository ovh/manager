import get from 'lodash/get';
import map from 'lodash/map';

import { getCriteria } from '../project.utils';

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
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.networkId);
  }

  getCIDR(network) {
    return this.OvhApiCloudProjectNetworkPrivateSubnet.v6()
      .query({
        serviceName: this.projectId,
        networkId: network.id,
      })
      .$promise.then(([firstSubnet]) => ({
        ...network,
        formattedRegions: map(network.regions, 'region').join(', '),
        address: get(firstSubnet, 'cidr'),
      }));
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
