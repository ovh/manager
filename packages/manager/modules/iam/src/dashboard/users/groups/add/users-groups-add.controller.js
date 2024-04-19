export default class IamUsersGroupsAddCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamGroupsService) {
    this.$scope = $scope;
    this.groupsService = IamGroupsService;
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
          'iamUsers',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'user_users_groups_add_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iamUsers',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('user_users_groups_add_error_message')} ${
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

  close() {
    this.$scope.resetAction();
  }
}
