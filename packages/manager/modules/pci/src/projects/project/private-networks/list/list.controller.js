import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, OvhApiCloudProjectNetworkPrivateSubnet, PciPrivateNetworks) {
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectNetworkPrivateSubnet = OvhApiCloudProjectNetworkPrivateSubnet;
    this.PciPrivateNetworks = PciPrivateNetworks;

    this.loadMessages();
  }

  $onInit() {
    this.isLoading = true;
    return this.getPrivateNetworks()
      .finally(() => {
        this.isLoading = false;
      });
  }

  getPrivateNetworks() {
    return this.PciPrivateNetworks.getPrivateNetworks(this.projectId)
      .then((privateNetworks) => {
        this.privateNetworks = privateNetworks;
      });
  }

  getCIDR(network) {
    return this.OvhApiCloudProjectNetworkPrivateSubnet.v6().query({
      serviceName: this.projectId,
      networkId: network.id,
    }).$promise
      .then(([firstSubnet]) => ({
        ...network,
        formattedRegions: map(network.regions, 'region').join(', '),
        address: get(firstSubnet, 'cidr'),
      }));
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.privateNetwork');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.privateNetwork',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();

    if (some(this.messages, { type: 'success' })) {
      this.$onInit();
    }
  }
}
