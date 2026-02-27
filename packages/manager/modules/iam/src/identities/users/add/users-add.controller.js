import { USERS_TRACKING_HITS } from '../users.constants';

export default class IamUsersAddCtrl {
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
    this.coreConfig = coreConfig;
    this.usersService = IamUsersService;
    this.userGroupsService = IamUserGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {};
    this.otherGroups = [];
    this.groups = [];
    this.loader = true;
    this.PASSWORD_MIN_LENGTH = 8;
    this.DESCRIPTION_MAX_LENGTH = 255;
  }

  $onInit() {
    this.$scope.addUser = this.addUser.bind(this);
    this.$scope.trackPage(USERS_TRACKING_HITS.ADD_USER_MODAL);

    this.userGroupsService
      .getGroups()
      .then((data) => {
        this.groups = data;
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message_groups')} ${
            err.data?.message
          }`,
          'iam-users-alert',
        );
        this.$scope.resetAction();
      })
      .finally(() => {
        this.loader = false;
      });
  }

  addUser() {
    this.$scope.trackClick(USERS_TRACKING_HITS.ADD_USER_CONFIRM);
    this.loader = true;

    this.usersService
      .addUser(this.user)
      .then(() => {
        this.$scope.trackPage(USERS_TRACKING_HITS.ADD_USER_SUCCESS);
        this.alerter.success(
          this.$translate.instant('user_users_add_success_message', {
            login: this.user.login,
          }),
          'iam-users-alert',
        );

        this.otherGroups
          .filter((group) => group !== this.user.group)
          .forEach((group) => this.addUserToGroup(this.user, group));
      })
      .catch((err) => {
        this.$scope.trackPage(USERS_TRACKING_HITS.ADD_USER_ERROR);
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_add_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-users-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_add_error_message')} ${
            err.data?.message
          }`,
          'iam-users-alert',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  addUserToGroup(user, group) {
    this.usersService.addUserToGroup(user, group).catch((err) => {
      const errorMessage = this.$translate.instant(
        'user_group_add_error_message',
        {
          login: user.login,
          group: group,
        },
      );
      let errorContent = '';
      if (err?.status === 403) {
        errorContent = `${this.$translate.instant(
          'user_need_rights_message',
        )} ${err?.data?.details?.unauthorizedActionsByIAM}`;
      } else {
        errorContent = `${err?.data?.message}`;
      }
      return this.alerter.warning(
        `${errorMessage} ${errorContent}`,
        'iam-users-alert',
      );
    });
  }

  getUserLogin() {
    return `${this.me.customerCode}/${this.user.login ? this.user.login : ''}`;
  }

  close() {
    this.$scope.trackClick(USERS_TRACKING_HITS.ADD_USER_CANCEL);
    this.$scope.resetAction();
  }
}
