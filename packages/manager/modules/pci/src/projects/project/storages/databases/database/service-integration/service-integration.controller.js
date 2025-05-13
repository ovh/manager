import find from 'lodash/find';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';
import { ENGINES_TYPES } from '../../databases.constants';

export default class ServiceIntegrationCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.service-integration';
    this.loadMessages();
    this.trackDashboard('service_integration', 'page');
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  isServiceIntegrationDeletable(integration) {
    return (
      integration.statusGroup !== STATUS.READY ||
      find(this.replicationsList, { sourceIntegration: integration.id }) ||
      find(this.replicationsList, { targetIntegration: integration.id })
    );
  }

  goToDatabaseService(id) {
    return this.goToDatabase({ id, type: this.getDatabaseType(id) });
  }

  getDatabaseType(id) {
    const defaultType = ENGINES_TYPES.all.label;
    const service = this.allDatabases.find((database) => database.id === id);
    if (!service) return defaultType;

    const engineType = Object.keys(ENGINES_TYPES).find((type) => {
      return ENGINES_TYPES[type].engines.includes(service.engine);
    });

    return engineType ? ENGINES_TYPES[engineType].label : defaultType;
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  refresh() {
    this.refreshing = true;
    this.refreshServiceIntegration();
  }

  trackAndAddServiceIntegration() {
    this.trackDashboard(`service_integration::add_${this.database.engine}`);
    this.goToAddServiceIntegration();
  }

  trackAndDeleteServiceIntegration(serviceIntegration) {
    this.trackDashboard(`service_integration::delete_${this.database.engine}`);
    this.goToDeleteServiceIntegration(serviceIntegration);
  }

  $onDestroy() {
    this.stopPollingIntegrationsStatus();
  }
}
