export default class LogsDetailCtrl {
  /* @ngInject */
  constructor($stateParams, CucCloudMessage) {
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.messages = [];
  }

  $onInit() {
    this.CucCloudMessage.unSubscribe('dbaas-logs.detail');
    this.messageHandler = this.CucCloudMessage.subscribe('dbaas-logs.detail', {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
