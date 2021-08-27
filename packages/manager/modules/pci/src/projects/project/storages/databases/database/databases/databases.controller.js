export default class logsCtrl {
  /* @ngInject */
  constructor($anchorScroll, $translate, $q, CucCloudMessage, DatabaseService) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.databases';
    this.loadMessages();
    this.trackDatabases('dashboard::databases', 'page');
    this.databases = [
      { description: 'defaultdb' },
      { description: 'users' },
      { description: 'products' },
    ];
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
