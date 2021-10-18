import { set } from 'lodash';
import find from 'lodash/find';
import { MIN_KAFKA_SERVICE } from './service-integration.constant';

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
    this.minKafkaService = MIN_KAFKA_SERVICE;

    this.mappedIntegration = this.serviceIntegrationList.map((i) =>
      set(
        i,
        'serviceName',
        find(this.kafkaServicesList, { id: i.serviceId }).description ||
          this.$translate.instant(
            'pci_databases_service_integration_tab_unknown_service',
          ),
      ),
    );
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

  trackAndAddServiceIntegration() {
    this.trackDashboard('service_integration::add_kafka');
    this.goToAddServiceIntegration();
  }

  trackAndDeleteServiceIntegration(serviceIntegration) {
    this.trackDashboard('service_integration::delete_kafka');
    this.goToDeleteServiceIntegration(serviceIntegration);
  }
}
