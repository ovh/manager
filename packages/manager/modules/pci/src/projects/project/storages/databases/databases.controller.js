import capitalize from 'lodash/capitalize';
import { getCriteria } from '../../project.utils';
import { ENGINE_LOGOS } from './databases.constants';

const optionsMenuTrackPrefix = 'table::options_menu:';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, ovhManagerRegionService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
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
    this.trackDatabases(`${optionsMenuTrackPrefix}delete_database`);
    this.goToDeleteDatabase(database);
  }

  renameDatabase(database) {
    this.trackDatabases(`${optionsMenuTrackPrefix}rename_database`);
    this.goToEditName(database.id);
  }

  upgradeVersion(database) {
    this.trackDatabases(`${optionsMenuTrackPrefix}change_version`);
    this.goToUpgradeVersion(database.id);
  }

  upgradePlan(database) {
    this.trackDatabases(`${optionsMenuTrackPrefix}upgrade_plan`);
    this.goToUpgradePlan(database.id);
  }

  upgradeNode(database) {
    this.trackDatabases(`${optionsMenuTrackPrefix}upgrade_node`);
    this.goToUpgradeNode(database.id);
  }

  getLatestVersion(database) {
    return database.getEngineFromList(this.engines).getLatestVersion().version;
  }

  getLatestPlan(database) {
    return database
      .getEngineFromList(this.engines)
      .getLatestPlan(database.version, database.region).name;
  }

  getHighestFlavorRange(database) {
    return database
      .getEngineFromList(this.engines)
      .getHighestFlavorRange(database.version, database.region, database.plan)
      .name;
  }

  getCurrentFlavor(database) {
    return database
      .getEngineFromList(this.engines)
      .getFlavor(
        database.version,
        database.plan,
        database.region,
        database.flavor,
      );
  }
}
