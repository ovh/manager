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
          `${this.$translate.instant('user_users_add_error_message_groups')} ${
            err.data.message
          }`,
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
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_add_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'userUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message')} ${
            err.data.message
          }`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
