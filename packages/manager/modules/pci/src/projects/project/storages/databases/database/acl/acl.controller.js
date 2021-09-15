export default class aclCtrl {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.acl';
    this.loadMessages();
    this.trackDashboard('acl', 'page');
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

  delete(acl) {
    this.deleteAcl(acl.id).then(() => {
      this.refreshAcl(
        this.$translate.instant('pci_databases_acl_tab_delete_success'),
      );
    });
  }
}
