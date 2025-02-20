import { get, map } from 'lodash-es';

export default class IamUsersCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    IamUsersService,
    IamUserGroupsService,
    IamSsoService,
    $q,
    Alerter,
    $translate,
    $timeout,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$q = $q;
    this.usersService = IamUsersService;
    this.userGroupsService = IamUserGroupsService;
    this.ssoService = IamSsoService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = coreConfig.getUser();
    this.userIds = [];
    this.users = [];
    this.groupIds = [];
    this.usersLoading = true;
    this.identityProvider = null;
    this.descriptionMaxSize = 40;

    this.$scope.$on('iam.security.users.refresh', () => {
      this.$onInit();
    });
  }

  $onInit() {
    this.userIds = [];
    this.users = [];
    this.groupIds = [];
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
          this.$scope.stepPath = `iam/identities/users/${this.$scope.currentAction}.html`;
        }
      } else {
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }.bind(this);

    return this.userGroupsService
      .getGroups()
      .then((groups) => {
        this.groupIds = groups;
        return this.$q.all(
          map(groups, (groupName) =>
            this.userGroupsService.getGroup(groupName),
          ),
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
          'iam-users-alert',
        );
      })
      .finally(() => {
        this.usersLoading = false;
      });
  }

  onTransformItem(userId) {
    this.usersLoading = true;
    return this.usersService.getUser(userId);
  }

  onTransformItemDone() {
    this.usersLoading = false;
  }

  initIdentityProvider() {
    this.ssoService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
