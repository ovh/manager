import some from 'lodash/some';
import isFeatureActivated from '../../features.constants';

export default class UsersCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.users';
    this.loadMessages();
    this.trackDashboard('users', 'page');
    this.isRolesAvailable = some(this.users, (user) => !!user.roles);
    this.showCertOption = isFeatureActivated('showCert', this.database.engine);
    this.showKeyOption = isFeatureActivated('showKey', this.database.engine);
    this.showUserInformationOption = isFeatureActivated(
      'showUserInformations',
      this.database.engine,
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

  trackAndAddUser() {
    this.trackDashboard('users::add_a_user');
    this.goToAddUser();
  }

  trackAndDeleteUser(user) {
    this.trackDashboard('users::options_menu::delete_user');
    this.goToDeleteUser(user);
  }

  trackAndModifyPassword(user) {
    this.trackDashboard('users::options_menu::modify_password');
    this.goToModifyPassword(user);
  }

  trackAndShowKey(user) {
    this.trackDashboard('users::options_menu::show_key');
    this.goToShowKey(user);
  }

  trackAndShowCert(user) {
    this.trackDashboard('users::options_menu::delete_user');
    this.goToShowCert(user);
  }

  trackAndShowUserInformations(user) {
    this.trackDashboard('users::options_menu::delete_user');
    this.goToUserInformations(user);
  }

  isDisabledOrPending($row) {
    return $row.isProcessing() || this.database.isProcessing();
  }

  $onDestroy() {
    this.stopPollingUsersStatus();
    this.stopPollingDatabaseStatus();
  }
}
