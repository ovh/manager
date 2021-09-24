import get from 'lodash/get';

export default class aclCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
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
    this.deleteAcl(acl.id)
      .then(() => {
        this.refreshAcl(
          this.$translate.instant('pci_databases_acl_tab_delete_success'),
        );
      })
      .catch((error) =>
        this.refreshAcl(
          this.$translate.instant('pci_databases_acl_tab_delete_error', {
            databaseName: this.database.description,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
