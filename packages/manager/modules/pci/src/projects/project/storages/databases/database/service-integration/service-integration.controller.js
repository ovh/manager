import find from 'lodash/find';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';

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
      find(this.replicationsList, { sourceService: integration.id }) ||
      find(this.replicationsList, { targetService: integration.id })
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  trackAndAddServiceIntegration() {
    this.trackDashboard('service_integration::add_kafka');
    this.goToAddServiceIntegration();
  }

  trackAndDeleteServiceIntegration(serviceIntegration) {
    this.trackDashboard('service_integration::delete_kafka');
    this.goToDeleteServiceIntegration(serviceIntegration);
  }

  $onDestroy() {
    this.stopPollingIntegrationsStatus();
  }
}
