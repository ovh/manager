export default class LogsListCtrl {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    LogsListService,
    LogsConstants,
    CucOrderHelperService,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.LogsListService = LogsListService;
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.messages = [];
    this.initLoaders();
  }

  $onInit() {
    this.CucCloudMessage.unSubscribe('dbaas-logs.list');
    this.messageHandler = this.CucCloudMessage.subscribe('dbaas-logs.list', {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  initLoaders() {
    return this.LogsListService.getServices().then((list) => {
      this.accounts = list;
    });
  }
}
