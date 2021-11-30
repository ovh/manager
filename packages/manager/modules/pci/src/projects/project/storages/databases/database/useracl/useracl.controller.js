export default class AclCtrl {
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
    this.aclList = this.usersList.filter((u) => u.acls.length > 0);
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
    return this.usersList.length === 0 || !this.database.aclsEnabled;
  }

  trackAndSetAclState(state) {
    this.trackDashboard(state ? 'acl::enable_acl' : 'acl::disable_acl');
    this.setAclState(state);
  }

  trackAndAddAcl() {
    this.trackDashboard('acl::create_acl_user');
    this.goToAddUserAcl();
  }

  trackAndDeleteAcl(acl) {
    this.trackDashboard('acl_user::delete_acl_user');
    this.goToDeleteUserAcl(acl);
  }
}
