import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

export default class UserAccountUsersCtrl {
  /* @ngInject */
  constructor(
    $scope,
    coreConfig,
    UseraccountUsersService,
    UseraccountGroupsService,
    $q,
    Alerter,
    $translate,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.usersService = UseraccountUsersService;
    this.groupsService = UseraccountGroupsService;
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

    this.$scope.$on('useraccount.security.users.refresh', () => {
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
          'userUsers',
        );
      })
      .finally(() => {
        this.usersLoading = false;
        this.groupsLoading = false;
      });
  }

  onTransformItem(userId) {
    this.usersLoading = true;
    return this.usersService.getUser(userId).then((user) => {
      set(user, 'role', this.groups[user.group].role);
      return user;
    });
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
