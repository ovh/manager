import { set } from 'lodash';
import capitalize from 'lodash/capitalize';
import { getCriteria } from '../../project.utils';
import { ENGINE_LOGOS, NODES_PER_ROW } from './databases.constants';
import isFeatureActivated from './features.constants';
import Database from '../../../../components/project/storages/databases/database.class';

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

    this.databasesList = this.databases.map((database) => {
      const enrichedDatabase = new Database(database);
      const databaseEngine = this.engines.find(
        (engine) => engine.name === database.engine,
      );
      const databaseVersion = databaseEngine.versions.find(
        (version) => version.version === database.version,
      );
      const databasePlan = databaseVersion.plans.find(
        (plan) => plan.name === database.plan,
      );
      const databaseRegion = databasePlan.regions.find(
        (region) => region.name === database.region,
      );
      const databaseFlavor = databaseRegion.flavors.find(
        (flavor) => flavor.name === database.flavor,
      );
      set(enrichedDatabase, 'currentFlavor', databaseFlavor);
      set(
        enrichedDatabase,
        'latestVersion',
        databaseEngine.getLatestVersion().version,
      );
      set(
        enrichedDatabase,
        'latestPlan',
        databaseEngine.getLatestPlan(database.version, database.region),
      );
      set(
        enrichedDatabase,
        'highestFlavorRange',
        databaseEngine.getHighestFlavorRange(
          database.version,
          database.region,
          database.plan,
        ).name,
      );
      set(
        enrichedDatabase,
        'translatedRegion',
        this.ovhManagerRegionService.getTranslatedMacroRegion(database.region),
      );
      return enrichedDatabase;
    });
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
}
