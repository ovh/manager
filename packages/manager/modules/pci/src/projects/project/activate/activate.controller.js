import illustration from './assets/activate-bg.png';

export default class ProjectActivateController {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew, CucCloudMessage, $translate) {
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.illustration = illustration;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.activate',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onActivateProjectClick() {
    return this.activateProject();
  }
}
