export default class IamUsersGroupsUpdateCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamGroupsService) {
    this.$scope = $scope;
    this.groupsService = IamGroupsService;
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
          'iamUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_groups_update_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant(
            'user_users_groups_update_error_message',
          )} ${err.data.message}`,
          'iamUsers',
        );
      })
      .finally(() => {
        this.loader = false;
        this.$scope.resetAction();
      });
  }
}
