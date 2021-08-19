import capitalize from 'lodash/capitalize';
import { getCriteria } from '../../project.utils';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, CucRegionService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.databaseId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.databases');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.databases',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  createDatabase() {
    this.trackDatabases('table::create_database');
    this.goToAddDatabase();
  }

  deleteDatabase(database) {
    this.trackDatabases('table::options_menu::delete_database');
    this.goToDeleteDatabase(database);
  }

  renameDatabase(database) {
    this.trackDatabases('table::options_menu::rename_database');
    this.goToEditName(database.id);
  }

  upgradeVersion(database) {
    this.trackDatabases('table::options_menu::change_version');
    this.goToUpgradeVersion(database.id);
  }

  upgradePlan(database) {
    this.trackDatabases('table::options_menu::upgrade_plan');
    this.goToUpgradePlan(database.id);
  }

  upgradeNode(database) {
    this.trackDatabases('table::options_menu::upgrade_node');
    this.goToUpgradeNode(database.id);
  }

  getLatestVersion(database) {
    this.currentEngine = this.engines.find(
      (engine) => engine.name === database.engine,
    );
    return this.currentEngine.getLatestVersion().version;
  }

  getLatestPlan(database) {
    this.currentEngine = this.engines.find(
      (engine) => engine.name === database.engine,
    );
    return this.currentEngine.getLatestPlan(database.version, database.region)
      .name;
  }

  getHighestFlavor(database) {
    this.currentEngine = this.engines.find(
      (engine) => engine.name === database.engine,
    );
    return this.currentEngine.getHighestFlavor(
      database.version,
      database.region,
      database.plan,
    ).name;
  }

  getCurrentFlavor(database) {
    this.currentEngine = this.engines.find(
      (engine) => engine.name === database.engine,
    );
    return this.currentEngine.getFlavor(
      database.version,
      database.plan,
      database.region,
      database.flavor,
    );
  }
}
