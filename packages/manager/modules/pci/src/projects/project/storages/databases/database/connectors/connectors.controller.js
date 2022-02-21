import { set } from 'lodash';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.connectors';
    this.loadMessages();
    this.trackDashboard('connectors', 'page');
    this.random = Math.random() > 0.5;
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

  reboot($row, $event) {
    this.trackDashboard('connectors-reboot', 'page');
    $($event.target).addClass('spin');
    set($row, 'rebooting', true);
    setTimeout(() => {
      $($event.target).removeClass('spin');
    }, 500);
  }
}
