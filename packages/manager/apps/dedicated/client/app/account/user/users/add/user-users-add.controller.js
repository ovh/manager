import get from 'lodash/get';

export default class UserAccountUsersAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountUsersService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.usersService = UseraccountUsersService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.PASSWORD_MIN_LENGTH = 8;
    this.DESCRIPTION_MAX_LENGTH = 255;
  }

  $onInit() {
    this.$scope.addUser = this.addUser.bind(this);
  }

  addUser() {
    this.loader = true;

    this.usersService
      .addUser(this.user)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_add_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message')} ${get(
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
