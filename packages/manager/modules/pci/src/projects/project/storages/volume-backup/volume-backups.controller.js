export default class VolumeBackupsController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.cucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
