import illustration from './assets/activate-bg.png';

export default class ProjectActivateController {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew, CucCloudMessage, atInternet) {
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.CucCloudMessage = CucCloudMessage;
    this.illustration = illustration;
    this.atInternet = atInternet;
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
