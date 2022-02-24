import { set } from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors';
    this.loadMessages();
    this.trackDashboard('connectors', 'page');

    this.connectorsList.forEach((connector) => {
      this.DatabaseService.poolConnectorTasks(
        this.projectId,
        this.database.engine,
        this.database.id,
        connector.id,
      ).then(null, null, (tasks) => {
        connector.setTasks(tasks);
      });

      this.DatabaseService.poolConnector(
        this.projectId,
        this.database.engine,
        this.database.id,
        connector.id,
      ).then(null, null, (data) => {
        connector.updateData(data);
      });
    });
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

  pauseOrResumeConnector($row) {
    if ($row.isPaused()) {
      this.DatabaseService.resumeConnector(
        this.projectId,
        this.database.engine,
        this.database.id,
        $row.id,
      ).then(() => {
        set($row, 'status', 'RUNNING');
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_connector_resume', {
            name: $row.name,
          }),
        );
      });
    } else {
      this.DatabaseService.pauseConnector(
        this.projectId,
        this.database.engine,
        this.database.id,
        $row.id,
      ).then(() => {
        set($row, 'status', 'PAUSED');
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_connector_paused', {
            name: $row.name,
          }),
        );
      });
    }
  }

  reboot($row) {
    this.trackDashboard('connectors-reboot');
    this.pending = true;
    this.DatabaseService.restartConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      $row.id,
    )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_connector_reboot', {
            name: $row.name,
          }),
        );
      })
      .finally(() => {
        this.pending = false;
      });
  }

  $onDestroy() {
    this.connectorsList.forEach((connector) => {
      this.DatabaseService.stopPollingConnectorTasks(
        this.database.id,
        connector.id,
      );
      this.DatabaseService.stopPollingConnector(this.database.id, connector.id);
    });
  }
}
