import get from 'lodash/get';

export default class UserAccountUsersGroupsAddCtrl {
  /* @ngInject */
  constructor($scope, UseraccountGroupsService) {
    this.$scope = $scope;
    this.groupsService = UseraccountGroupsService;
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
        this.alerter.success(
          this.$translate.instant('user_users_groups_add_success_message', {
            login: this.user.login,
          }),
          'userUsers',
        );
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_add_error_message',
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
