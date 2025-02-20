export default class IamUsersGroupsDeleteCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamUserGroupsService) {
    this.$scope = $scope;
    this.groupsService = IamUserGroupsService;
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
          this.$translate.instant('users_groups_delete_success_message'),
          'iam-user-groups-alert',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'users_groups_delete_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-user-groups-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('users_groups_delete_error_message')} ${
            err.data.message
          }`,
          'iam-user-groups-alert',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }

  close() {
    this.$scope.resetAction();
  }
}
