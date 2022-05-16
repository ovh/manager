import find from 'lodash/find';
import capitalize from 'lodash/capitalize';
import { getCriteria } from '../../project.utils';
import { ENGINE_LOGOS, DATABASE_TYPES } from './databases.constants';
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
      return this.DatabaseService.getIntegrations(
        this.projectId,
        database.engine,
        database.id,
      ).then((integrations) => {
        const linkedServices = integrations.reduce((acc, curr) => {
          // if source equals destination, then the service is linked to himself
          // this is the only scenario where we want to display it in the linked service
          if (curr.sourceServiceId === curr.destinationServiceId) {
            if (!acc.find((service) => service.id === curr.sourceServiceId)) {
              acc.push(find(this.databases, { id: curr.sourceServiceId }));
            }
          }
          if (
            database.id !== curr.sourceServiceId &&
            !acc.find((service) => service.id === curr.sourceServiceId)
          ) {
            acc.push(find(this.databases, { id: curr.sourceServiceId }));
          }
          if (
            database.id !== curr.destinationServiceId &&
            !acc.find((service) => service.id === curr.destinationServiceId)
          ) {
            acc.push(find(this.databases, { id: curr.destinationServiceId }));
          }
          return acc;
        }, []);
        if (linkedServices.length > 0) {
          return this.goToConfirmDeleteDatabase(database, linkedServices);
        }
        return this.goToDeleteDatabase(database);
      });
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
