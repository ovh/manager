import capitalize from 'lodash/capitalize';

import { SHELL_NAMES } from '../../databases.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucRegionService, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.general-information';
    this.loadMessages();
    this.connectionInformation = this.getConnectionInformation();
    this.pollDatabaseStatus();
  }

  getConnectionInformation() {
    const nodesConfig = this.database.nodes.map((node) => node.name).join(',');
    return {
      mongoShell: `${
        SHELL_NAMES[this.database.engine]
      } --ssl --host replicaset/${nodesConfig} --username <username> --password <password>`,
      application: `${this.database.engine}://<username>:<password>@${nodesConfig}/?replicaSet=replicaset&tls=True`,
    };
  }

  addNode() {
    this.trackDatabases('dashboard::general_information::add_node');
    this.goToAddNode();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  upgradeVersion() {
    this.trackDatabases('dashboard::general_information::upgrade_version');
    this.goToUpgradeVersion();
  }

  upgradePlan() {
    this.trackDatabases('dashboard::general_information::upgrade_plan');
    this.goToUpgradePlan();
  }

  deleteDatabase() {
    this.trackDatabases('dashboard::general_information::delete_database');
    this.goToDeleteDatabase();
  }

  $onDestroy() {
    this.stopPollingDatabaseStatus();
    this.stopPollingNodesStatus();
  }
}
