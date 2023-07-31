import get from 'lodash/get';

export default class UserAccountUsersUpdateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountUsersService,
    UseraccountGroupsService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = angular.copy($scope.currentActionData);
    this.loader = true;
    this.DESCRIPTION_MAX_LENGTH = 255;
  }

  $onInit() {
    this.$scope.updateUser = this.updateUser.bind(this);

    this.groupsService
      .getGroups()
      .then((data) => {
        this.groups = data;
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant(
            'user_users_add_error_message_groups',
          )} ${get(err, 'message', err)}`,
          'userUsers',
        );
        this.$scope.resetAction();
      })
      .finally(() => {
        this.loader = false;
      });
  }

  updateUser() {
    this.loader = true;

    this.usersService
      .updateUser(this.user)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_update_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_update_error_message')} ${get(
            err,
            'message',
            err,
          )}`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
