export default class aclCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.useracl';
    this.loadMessages();
    this.trackDashboard('acl', 'page');
    this.permissionOptions = {
      values: {
        admin: this.$translate.instant(
          'pci_databases_useracl_permission_admin',
        ),
        read: this.$translate.instant('pci_databases_useracl_permission_read'),
        write: this.$translate.instant(
          'pci_databases_useracl_permission_write',
        ),
        readwrite: this.$translate.instant(
          'pci_databases_useracl_permission_readwrite',
        ),
        deny: this.$translate.instant('pci_databases_useracl_permission_deny'),
      },
    };
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

  isDisabled() {
    return this.usersList.length === 0 || !this.aclState;
  }
}
