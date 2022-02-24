export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors.tasks';
    this.loadMessages();
    this.trackDashboard('connector-tasks', 'page');
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

  restart($row) {
    this.trackDashboard('connectors-task-restart');
    this.pending = true;
    this.DatabaseService.restartConnectorTask(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.connector.id,
      $row.id,
    )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_tasks_restarted', {
            id: $row.id,
          }),
        );
      })
      .finally(() => {
        this.pending = false;
      });
  }
}
