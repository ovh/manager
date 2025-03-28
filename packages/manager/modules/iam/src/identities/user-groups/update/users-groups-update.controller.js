import {
  GROUP_ROLES,
  USER_GROUPS_TRACKING_HITS,
} from '../users-groups-constants';

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
    this.$scope.trackPage(USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP_MODAL);
  }

  updateGroup() {
    this.$scope.trackClick(USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP_CONFIRM);
    this.loader = true;

    this.groupsService
      .updateGroup(this.group)
      .then(() => {
        this.$scope.trackPage(
          USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP_SUCCESS,
        );
        return this.alerter.success(
          this.$translate.instant('users_groups_update_success_message'),
          'iam-user-groups-alert',
        );
      })
      .catch((err) => {
        this.$scope.trackPage(
          USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP_ERROR,
        );
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
    this.$scope.trackClick(USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP_CANCEL);
    this.$scope.resetAction();
  }
}
