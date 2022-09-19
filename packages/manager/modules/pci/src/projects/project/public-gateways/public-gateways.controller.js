import ipaddr from 'ipaddr.js';

const CONTAINER_NAME = 'pci.projects.project.public-gateways';

export default class PublicGatewaysController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
    this.formatIps();
  }

  formatIps() {
    this.gateways = this.gateways.map((gateway) => {
      const ipv4 = [];
      const ipv6 = [];
      if (gateway.externalInformation) {
        gateway.externalInformation.ips.forEach((ip) => {
          if (ipaddr.parse(ip.ip)?.kind() === 'ipv6') {
            ipv6.push(ip.ip);
          } else {
            ipv4.push(ip.ip);
          }
        });
      }
      return {
        ...gateway,
        formattedIps: [...ipv4, ...ipv6].join(', ') || '',
      };
    });
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

  onAddPublicGatewayClick() {
    this.trackClick('PCI_PROJECTS_PUBLIC_GATEWAY_ADD');
    return this.goToAddPublicGateway();
  }

  onGoToPrivateNetworkClick(row) {
    if (row) {
      this.trackPublicGateways('table-option-menu::connected-network');
      return this.goToPrivateNetwork(this.projectId);
    }
    this.trackPublicGateways('table-option-menu::private-network');
    return this.goToPrivateNetwork(this.projectId);
  }
}
