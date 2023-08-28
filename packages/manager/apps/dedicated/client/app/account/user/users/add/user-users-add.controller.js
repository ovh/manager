import get from 'lodash/get';

export default class UserAccountUsersAddCtrl {
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
    this.coreConfig = coreConfig;
    this.usersService = UseraccountUsersService;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {};
    this.groups = [];
    this.loader = true;
    this.PASSWORD_MIN_LENGTH = 8;
    this.DESCRIPTION_MAX_LENGTH = 255;
  }

  $onInit() {
    this.$scope.addUser = this.addUser.bind(this);

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
