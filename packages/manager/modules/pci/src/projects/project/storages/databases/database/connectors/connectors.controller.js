import { set } from 'lodash';
import {
  AVAILABLE_CONNECTOR_TYPES,
  CONNECTOR_STATUS,
} from '../../../../../../components/project/storages/databases/connectors.constants';

export default class ConnectorsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.CONNECTOR_TYPES = AVAILABLE_CONNECTOR_TYPES;
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
      this.trackDashboard('connectors::play_connector');
      this.DatabaseService.resumeConnector(
        this.projectId,
        this.database.engine,
        this.database.id,
        $row.id,
      ).then(() => {
        set($row, 'status', CONNECTOR_STATUS.RUNNING);
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_connector_resume', {
            name: $row.name,
          }),
        );
      });
    } else {
      this.trackDashboard('connectors::pause_connector');
      this.DatabaseService.pauseConnector(
        this.projectId,
        this.database.engine,
        this.database.id,
        $row.id,
      ).then(() => {
        set($row, 'status', CONNECTOR_STATUS.PAUSED);
        this.CucCloudMessage.success(
          this.$translate.instant('pci_databases_connectors_connector_paused', {
            name: $row.name,
          }),
        );
      });
    }
  }

  restart($row) {
    this.trackDashboard('connectors::restart_connector');
    this.pending = true;
    this.DatabaseService.restartConnector(
      this.projectId,
      this.database.engine,
      this.database.id,
      $row.id,
    )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_databases_connectors_connector_restart',
            {
              name: $row.name,
            },
          ),
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
