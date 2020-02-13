export default class PciServingNamespaceModelsController {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.serving.namespace.models',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving.namespace.models',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
