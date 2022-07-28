import get from 'lodash/get';

export default class UserAccountUsersGroupsUpdateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountGroupsService,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.user = {
      group: 'DEFAULT',
    };
    this.group = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.updateGroup = this.updateGroup.bind(this);
  }

  updateGroup() {
    this.loader = true;

    this.groupsService
      .updateGroup(this.group)
      .then(() => {
        this.alerter.success(
          this.$translate.instant('user_users_groups_update_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_update_error_message',
          )} ${get(err, 'message', err)}`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
