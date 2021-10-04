export default class databasesCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, DatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.databases';
    this.loadMessages();
    this.trackDashboard('databases', 'page');
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
    this.refreshing = true;
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
