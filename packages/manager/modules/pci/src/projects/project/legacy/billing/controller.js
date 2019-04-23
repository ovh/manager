export default class CloudProjectBillingCtrl {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    $stateParams,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = $stateParams.projectId;

    this.messages = [];
  }

  $onInit() {
    this.loadMessage();
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.legacy.billing');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.legacy.billing', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
