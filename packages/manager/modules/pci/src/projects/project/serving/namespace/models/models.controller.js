import { API_STATUS, VERSION_STATUS } from './models.constants';

export default class PciServingNamespaceModelsController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.API_STATUS = API_STATUS;
    this.VERSION_STATUS = VERSION_STATUS;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.serving.namespace.models');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.serving.namespace.models', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
