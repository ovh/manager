export default class NamespacesCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.getStringFromDuration = NamespacesCtrl.getStringFromDuration;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.namespaces';
    this.loadMessages();
    this.trackDashboard('namespaces', 'page');

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('ss', null);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 24);
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

  trackAndEditNamespace(namespace) {
    this.trackDashboard('namespaces::edit_namespace');
    this.goToEditNamespace(namespace);
  }

  trackAndDeleteNamespace(namespace) {
    this.trackDashboard('namespaces::delete_namespace');
    this.goToDeleteNamespace(namespace);
  }

  trackAndAddNamespace() {
    this.trackDashboard('namespaces::add_new_namespace');
    this.goToAddNamespace();
  }

  static getStringFromDuration(duration) {
    return duration ? duration.humanize() : '';
  }
}
