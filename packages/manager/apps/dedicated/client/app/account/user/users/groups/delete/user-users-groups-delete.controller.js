export default class UserAccountUsersGroupsDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, UseraccountGroupsService) {
    this.$scope = $scope;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.group = $scope.currentActionData;
    this.loader = false;
  }

  $onInit() {
    this.$scope.deleteGroup = this.deleteGroup.bind(this);
  }

  deleteGroup() {
    this.loader = true;

    this.groupsService
      .deleteGroup(this.group)
      .then(() => {
        return this.alerter.success(
          this.$translate.instant('user_users_groups_delete_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        return this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_delete_error_message',
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
