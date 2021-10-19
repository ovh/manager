import set from 'lodash/set';
import find from 'lodash/find';
import { MAX_TOPIC_PER_LINE } from './replications.constants';

export default class ReplicationsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.MAX_TOPIC_PER_LINE = MAX_TOPIC_PER_LINE;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.replications';
    this.loadMessages();
    this.trackDashboard('replication_flows', 'page');

    this.mappedIntegration = this.serviceIntegrationList.map((i) =>
      set(
        i,
        'serviceName',
        find(this.kafkaServicesList, { id: i.serviceId }).description ||
          this.$translate.instant(
            'pci_databases_replications_tab_no_kafka_service',
          ),
      ),
    );

    this.mappedReplications = this.replicationsList
      .map((r) =>
        set(
          r,
          'serviceNameSource',
          find(this.mappedIntegration, { id: r.sourceService })?.serviceName ||
            this.$translate.instant(
              'pci_databases_replications_tab_no_kafka_service',
            ),
        ),
      )
      .map((r) =>
        set(
          r,
          'serviceNameTarget',
          find(this.mappedIntegration, { id: r.targetService })?.serviceName ||
            this.$translate.instant(
              'pci_databases_replications_tab_no_kafka_service',
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

  trackAndAddReplication() {
    this.trackDashboard('replication_flows::create_replication_flow');
    this.goToAddReplication();
  }

  trackAndEditReplication() {
    this.trackDashboard(
      'replication_flows::actions_menu::modify_replication_flow',
    );
    this.goToEditReplication();
  }

  trackAndDeleteReplication(replication) {
    this.trackDashboard(
      'replication_flows::actions_menu::delete_replication_flow',
    );
    this.goToDeleteReplication(replication);
  }
}
