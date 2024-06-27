import { get, map, set } from 'lodash-es';

export default class IamUsersCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    IamUsersService,
    IamGroupsService,
    $q,
    Alerter,
    $translate,
    $timeout,
    goToSSO,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$q = $q;
    this.goToSSO = goToSSO;
    this.usersService = IamUsersService;
    this.groupsService = IamGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.userIds = [];
    this.users = [];
    this.groupsArray = [];
    this.groupIds = [];
    this.usersLoading = true;
    this.groupsLoading = true;
    this.identityProvider = null;
    this.descriptionMaxSize = 40;
    this.IAM_BASE_URL = 'iam/dashboard/';

    this.$scope.$on('iam.security.users.refresh', () => {
      this.$onInit();
    });
  }

  $onInit() {
    this.userIds = [];
    this.users = [];
    this.groupIds = [];
    this.groupsArray = [];
    this.usersLoading = true;
    this.initIdentityProvider();

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
          this.$scope.stepPath = `${this.IAM_BASE_URL}${this.$scope.currentAction}.html`;
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
          // eslint-disable-next-line no-param-reassign
          result[item.name] = item;
          return result;
        }, {});
        return this.usersService.getUsers().then((userIds) => {
          this.userIds = userIds;
        });
      })
      .catch((err) => {
        this.alerter.error(
          `${this.$translate.instant('user_users_error')} ${get(
            err,
            'message',
            err,
          )}`,
          'iamUsers',
        );
      })
      .finally(() => {
        this.usersLoading = false;
        this.groupsLoading = false;
      });
  }

  onTransformItem(userId) {
    this.usersLoading = true;
    return this.usersService.getUser(userId);
  }

  onTransformItemDone() {
    this.usersLoading = false;
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

  initIdentityProvider() {
    this.usersService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
