export default class PciServingNamespaceTokensController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.serving.namespace.tokens',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving.namespace.tokens',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  // eslint-disable-next-line class-methods-use-this
  loadRow(row) {
    return Object.assign(row, {
      flattenGroups: row.groups.join(' - '),
    });
  }
}
