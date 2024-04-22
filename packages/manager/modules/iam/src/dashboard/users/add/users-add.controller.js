export default class IamUsersAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    IamUsersService,
    IamGroupsService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.coreConfig = coreConfig;
    this.usersService = IamUsersService;
    this.groupsService = IamGroupsService;
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
          'iamUsers',
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
          'iamUsers',
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
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message')} ${
            err.data.message
          }`,
          'iamUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  getUserLogin() {
    return `${this.me.customerCode}/${this.user.login ? this.user.login : ''}`;
  }

  close() {
    this.$scope.resetAction();
  }
}
