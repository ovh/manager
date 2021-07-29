export default class PciStoragesObjectStorageController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.objects.objects',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  isUserTabActive() {
    return this.currentActiveLink().includes('users');
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
