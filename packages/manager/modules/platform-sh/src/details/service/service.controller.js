export default class PlatformShProjectServiceCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'platform-sh.details',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'platform-sh.details',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
