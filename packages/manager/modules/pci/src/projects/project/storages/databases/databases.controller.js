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
