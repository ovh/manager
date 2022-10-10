import set from 'lodash/set';

import { getCriteria } from '../project.utils';
import { PRIVATE_NETWORK_LIST } from './private-networks.constants';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork';

export default class {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage, PciPrivateNetworks) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.PRIVATE_NETWORK_LIST = PRIVATE_NETWORK_LIST;
    this.PciPrivateNetworks = PciPrivateNetworks;
  }

  $onInit() {
    this.loadMessages();
    this.isLoading = false;
    this.criteria = getCriteria('id', this.networkId);
    this.gatewaySubnetObj = null;
    this.buildGatewaySubnetObj();
  }

  getSubnets(row) {
    set(row, 'loading', true);
    return this.$q
      .all(
        row.subnets.map(({ region, networkId }) =>
          this.PciPrivateNetworks.getSubnets(this.projectId, region, networkId),
        ),
      )
      .then((subnets) => {
        set(
          row,
          'subnets',
          row.subnets.map((subnet, index) => {
            if (subnets[index]) {
              return {
                ...subnet,
                ...subnets[index],
                allocatedIp: subnets[index].allocationPools
                  .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
                  .join(' ,'),
                gatewayName: this.gatewaySubnetObj[subnet.networkId],
              };
            }
            return subnet;
          }),
        );
        set(row, 'loading', false);
        return row;
      })
      .catch((error) => {
        set(row, 'loading', false);
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_error',
            { message: error?.data?.message },
          ),
        );
        return row;
      });
  }

  buildGatewaySubnetObj() {
    this.gatewaySubnetObj = this.gateways.resources.reduce((acc, item) => {
      item.interfaces.forEach(({ networkId }) => {
        acc[networkId] = item.name;
      });
      return acc;
    }, {});
  }

  onAddPrivateNetworkClick() {
    this.trackClick('PCI_PROJECTS_NETWORK_ADD');
    return this.createNetwork();
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
