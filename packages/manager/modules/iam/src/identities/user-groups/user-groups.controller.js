import { get, map, set } from 'lodash-es';
import { USER_GROUPS_TRACKING_HITS } from './users-groups-constants';

export default class IamUserGroupsCtrl {
  /* @ngInject */
  constructor($scope, $timeout, $translate, $q, Alerter, IamUserGroupsService) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$q = $q;
    this.alerter = Alerter;
    this.groupsService = IamUserGroupsService;
    this.groupsArray = [];
    this.groupIds = [];
    this.groupsLoading = true;

    this.$scope.$on('iam.user-groups.refresh', () => {
      this.$onInit();
    });
  }

  $onInit() {
    this.$scope.trackPage = this.trackPage;
    this.$scope.trackClick = this.trackClick;
    this.groupIds = [];
    this.groupsArray = [];
    this.groupsLoading = true;

    this.$scope.resetAction = function resetAction() {
      this.$scope.setAction(false);
      this.isModalOpened = false;
    }.bind(this);

    this.$scope.setAction = function setAction(action, data, basePath) {
      this.isModalOpened = true;
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;
      if (action) {
        if (basePath) {
          this.$scope.stepPath = `${basePath}${this.$scope.currentAction}.html`;
        } else {
          this.$scope.stepPath = `iam/identities/user-groups/${this.$scope.currentAction}.html`;
        }
      } else {
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }.bind(this);

    return this.groupsService
      .getGroups()
      .then((groups) => {
        this.groupIds = groups;
        return this.$q.all(
          map(groups, (groupName) => this.groupsService.getGroup(groupName)),
        );
      })
      .then((groupsArray) => {
        this.groups = groupsArray.reduce((result, item) => {
          return { ...result, [item.name]: item };
        }, {});
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_error')} ${get(
            err,
            'message',
            err,
          )}`,
          'iam-user-groups-alert',
        );
      })
      .finally(() => {
        this.groupsLoading = false;
      });
  }

  createUserGroup() {
    this.$scope.trackClick(USER_GROUPS_TRACKING_HITS.ADD_USER_GROUP);
    this.$scope.setAction('add/users-groups-add');
  }

  updateUserGroup(userGroup) {
    this.$scope.trackClick(USER_GROUPS_TRACKING_HITS.UPDATE_USER_GROUP);
    this.$scope.setAction('update/users-groups-update', userGroup);
  }

  deleteUserGroup(userGroup) {
    this.$scope.trackClick(USER_GROUPS_TRACKING_HITS.DELETE_USER_GROUP);
    this.$scope.setAction('delete/users-groups-delete', userGroup);
  }

  onTransformGroup(groupName) {
    this.groupsLoading = true;
    return this.groupsService.getGroup(groupName).then((group) => {
      const shortDescription =
        group.description != null &&
        group.description.length > this.descriptionMaxSize
          ? `${group.description.substring(0, this.descriptionMaxSize)}...`
          : group.description;
      set(group, 'shortDescription', shortDescription);
      return group;
    });
  }

  onTransformGroupDone() {
    this.groupsLoading = false;
  }
}
