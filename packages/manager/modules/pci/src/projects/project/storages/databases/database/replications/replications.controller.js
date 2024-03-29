import { MAX_TOPIC_PER_LINE, MIN_INTEGRATION } from './replications.constants';

export default class ReplicationsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.MAX_TOPIC_PER_LINE = MAX_TOPIC_PER_LINE;
    this.MIN_INTEGRATION = MIN_INTEGRATION;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.replications';
    this.loadMessages();
    this.trackDashboard('replication_flows', 'page');
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

  trackAndEditReplication(replication) {
    this.trackDashboard(
      'replication_flows::actions_menu::modify_replication_flow',
    );
    this.goToEditReplication(replication);
  }

  trackAndDeleteReplication(replication) {
    this.trackDashboard(
      'replication_flows::actions_menu::delete_replication_flow',
    );
    this.goToDeleteReplication(replication);
  }
}
