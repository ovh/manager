export default class databasesCtrl {
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

  refreshDatabases() {
    this.DatabaseService.getServiceDatabases(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((databasesList) => {
      this.databasesList = databasesList;
      this.refreshing = false;
    });
  }
}
