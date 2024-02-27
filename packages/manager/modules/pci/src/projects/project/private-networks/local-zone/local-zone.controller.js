import { PRIVATE_NETWORK_LIST } from '../private-networks.constants';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork';
export default class PrivateNetworksGlobalRegionsController {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.PRIVATE_NETWORK_LIST = PRIVATE_NETWORK_LIST;
  }

  $onInit() {
    this.loadMessages();
    this.isLoading = false;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(CONTAINER_NAME);
    this.messageHandler = this.CucCloudMessage.subscribe(CONTAINER_NAME, {
      onMessage: () => this.refreshMessages(),
    });
  }

  onAddPrivateNetworkClick() {
    this.trackClick('PCI_PROJECTS_NETWORK_ADD');
    return this.createNetwork();
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  $onDestroy() {
    this.CucCloudMessage.unSubscribe(CONTAINER_NAME);
  }
}
