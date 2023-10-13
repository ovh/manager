import capitalize from 'lodash/capitalize';
import { getCriteria } from '../../project.utils';
import {
  ENGINE_LOGOS,
  DATABASE_TYPES,
  NODES_PER_ROW,
} from './databases.constants';
import isFeatureActivated from './features.constants';

const optionsMenuTrackPrefix = 'table::options_menu::';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    DatabaseService,
  ) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ENGINE_LOGOS = ENGINE_LOGOS;
    this.NODES_PER_ROW = NODES_PER_ROW;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.databaseId);
  }

  hasTypeRedis() {
    return this.databases.find((elm) => elm.engine === DATABASE_TYPES.REDIS);
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
    if (isFeatureActivated('serviceIntegrationTab', database.engine)) {
      return this.DatabaseService.getLinkedServices(
        this.projectId,
        database.engine,
        database.id,
        this.allDatabases,
      ).then((linkedServices) =>
        linkedServices.length > 0
          ? this.goToConfirmDeleteDatabase(database, linkedServices)
          : this.goToDeleteDatabase(database),
      );
    }
    return this.goToDeleteDatabase(database);
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
