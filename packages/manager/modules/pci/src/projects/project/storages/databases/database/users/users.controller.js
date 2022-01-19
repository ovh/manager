import some from 'lodash/some';
import isFeatureActivated from '../../features.constants';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';

export default class UsersCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
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

    // Poll the database status
    if (this.database.isProcessing()) {
      this.DatabaseService.pollDatabaseStatus(
        this.projectId,
        this.database.engine,
        this.database.id,
      ).then((databaseInfo) => this.database.updateData(databaseInfo));
    }

    // Poll the users status
    this.users.forEach((user) => {
      if (user.isProcessing()) {
        this.DatabaseService.pollUserStatus(
          this.projectId,
          this.database.engine,
          this.database.id,
          user.id,
        ).then((userInfos) => {
          // If the user is deleted, remove it from the array
          // else, update data
          if (userInfos.status === STATUS.DELETING) {
            this.users.splice(this.users.indexOf(user), 1);
          } else {
            user.updateData({
              ...userInfos,
              rolesArray: userInfos.roles,
            });
          }
        });
      }
    });
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
