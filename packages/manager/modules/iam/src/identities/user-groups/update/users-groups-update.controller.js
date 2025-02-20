import { GROUP_ROLES } from '../users-groups-constants';

export default class IamUsersGroupsUpdateCtrl {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IamUserGroupsService) {
    this.$scope = $scope;
    this.groupsService = IamUserGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.user = {
      group: 'DEFAULT',
    };
    this.group = $scope.currentActionData;
    this.loader = false;
    this.roles = GROUP_ROLES;
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
          this.$translate.instant('users_groups_update_success_message'),
          'iam-user-groups-alert',
        );
      })
      .catch((err) => {
        if (err.status === 403) {
          return this.alerter.warning(
            `${this.$translate.instant(
              'users_groups_update_error_message',
            )} ${this.$translate.instant('user_need_rights_message')} ${
              err.data.details.unauthorizedActionsByIAM
            }`,
            'iam-user-groups-alert',
          );
        }
        return this.alerter.error(
          `${this.$translate.instant('users_groups_update_error_message')} ${
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
