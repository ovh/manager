import { USERS_TRACKING_HITS } from '../users.constants';

export default class IamUsersUpdateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    IamUsersService,
    IamUserGroupsService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.usersService = IamUsersService;
    this.userGroupsService = IamUserGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = angular.copy($scope.currentActionData);
    this.loader = true;
    this.DESCRIPTION_MAX_LENGTH = 255;
  }

  $onInit() {
    this.$scope.updateUser = this.updateUser.bind(this);
    this.$scope.trackPage(USERS_TRACKING_HITS.UPDATE_USER_MODAL);

    this.userGroupsService
      .getGroups()
      .then((data) => {
        this.groups = data;
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message_groups')} ${
            err.data.message
          }`,
          'iam-users-alert',
        );
        this.$scope.resetAction();
      })
      .finally(() => {
        this.loader = false;
      });
  }

  updateUser() {
    this.$scope.trackClick(USERS_TRACKING_HITS.UPDATE_USER_CONFIRM);
    this.loader = true;

    this.usersService
      .updateUser(this.user)
      .then(() => {
        this.$scope.trackPage(USERS_TRACKING_HITS.UPDATE_USER_SUCCESS);
        this.alerter.success(
          this.$translate.instant('user_users_update_success_message', {
            login: this.user.login,
          }),
          'iam-users-alert',
        );
      })
      .catch((err) => {
        this.$scope.trackPage(USERS_TRACKING_HITS.UPDATE_USER_ERROR);
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_update_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-users-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_update_error_message')} ${
            err.data.message
          }`,
          'iam-users-alert',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  close() {
    this.$scope.trackClick(USERS_TRACKING_HITS.UPDATE_USER_CANCEL);
    this.$scope.resetAction();
  }
}
