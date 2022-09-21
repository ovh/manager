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
    this.availableNetworks = null;
    this.gatewaySubnetObj = null;
    this.getNetworksSubnet();
    this.buildGatewaySubnetObj();
  }

  getNetworksSubnet() {
    this.isLoading = true;
    return this.$q
      .all(
        this.privateNetworks.map((privateNetwork) =>
          this.getSubnets(privateNetwork),
        ),
      )
      .then((data) => {
        this.isLoading = false;
        this.availableNetworks = [...data];
        return this.availableNetworks;
      });
  }

  getSubnets(network) {
    return this.PciPrivateNetworks.getSubnets(this.projectId, network.id)
      .then((data) => {
        return {
          ...network,
          subnet: [
            ...data.map((subnet) => ({
              ...subnet,
              gatewayName: this.gatewaySubnetObj[subnet.id],
              allocatedIp: subnet.ipPools
                .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
                .join(' ,'),
              dhcp: subnet.ipPools
                .map((ipPool) =>
                  ipPool.dhcp === true
                    ? this.$translate.instant(
                        'pci_projects_project_network_private_dhcp_active',
                      )
                    : this.$translate.instant(
                        'pci_projects_project_network_private_dhcp_suspended',
                      ),
                )
                .join(),
            })),
          ],
        };
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_error',
            { message: error?.data?.message },
          ),
        );
      });
  }

  buildGatewaySubnetObj() {
    this.gatewaySubnetObj = this.gateways.resources.reduce((acc, item) => {
      item.interfaces.forEach(({ subnetId }) => {
        acc[subnetId] = item.name;
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
