import get from 'lodash/get';

export default class UserAccountUsersGroupsDeleteCtrl {
  /* @ngInject */
  constructor($scope, UseraccountGroupsService, Alerter, $translate) {
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
        this.alerter.success(
          this.$translate.instant('user_users_groups_delete_success_message'),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_delete_error_message',
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
