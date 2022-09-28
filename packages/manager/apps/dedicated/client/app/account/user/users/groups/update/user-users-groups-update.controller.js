export default class UserAccountUsersGroupsUpdateCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, UseraccountGroupsService) {
    this.$scope = $scope;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
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
        return this.alerter.success(
          this.$translate.instant('user_users_groups_update_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        return this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_update_error_message',
          )} ${err.data.message}`,
          'userUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
