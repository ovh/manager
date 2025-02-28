import { GROUP_ROLES } from '../users-groups-constants';

export default class IamUsersGroupsAddCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamUserGroupsService) {
    this.$scope = $scope;
    this.groupsService = IamUserGroupsService;
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
    this.roles = GROUP_ROLES;
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
          this.$translate.instant('users_groups_add_success_message'),
          'iam-user-groups-alert',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'users_groups_add_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-user-groups-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('users_groups_add_error_message')} ${
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
