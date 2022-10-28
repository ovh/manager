export default class UserAccountUsersGroupsAddCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, UseraccountGroupsService) {
    this.$scope = $scope;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = {
      group: 'DEFAULT',
    };
    this.loader = false;
    this.group = {
      name: null,
      role: null,
      description: null,
    };
  }

  $onInit() {
    this.$scope.addGroup = this.addGroup.bind(this);
  }

  addGroup() {
    this.loader = true;

    this.groupsService
      .addGroup(this.group)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_groups_add_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        return this.alerter.error(
          `${this.$translate.instant('user_users_groups_add_error_message')} ${
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
