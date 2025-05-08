import { USERS_TRACKING_HITS } from '../users.constants';

export default class IamUsersDisableCtrl {
  /* @ngInject */
  constructor($scope, IamUsersService, Alerter, $translate) {
    this.$scope = $scope;
    this.usersService = IamUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.trackPage(USERS_TRACKING_HITS.DISABLE_USER_MODAL);
    this.$scope.disableUser = this.disableUser.bind(this);
  }

  disableUser() {
    this.$scope.trackClick(USERS_TRACKING_HITS.DISABLE_USER_CONFIRM);
    this.loader = true;

    this.usersService
      .disableUser(this.user)
      .then(() => {
        this.$scope.trackPage(USERS_TRACKING_HITS.DISABLE_USER_SUCCESS);
        this.alerter.success(
          this.$translate.instant('user_users_disable_success_message', {
            login: this.user.login,
          }),
          'iam-users-alert',
        );
      })
      .catch((err) => {
        this.$scope.trackPage(USERS_TRACKING_HITS.DISABLE_USER_ERROR);
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_disable_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-users-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_disable_error_message')} ${
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
    this.$scope.trackClick(USERS_TRACKING_HITS.DISABLE_USER_CANCEL);
    this.$scope.resetAction();
  }
}
