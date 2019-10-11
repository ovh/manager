export default class UserAccountUsersCtrl {
  /* @ngInject */
  constructor($scope, User, UseraccountUsersService, UseraccountGroupsService, $q, Alerter,
    $translate) {
    this.$scope = $scope;
    this.$q = $q;
    this.userService = User;
    this.usersService = UseraccountUsersService;
    this.groupsService = UseraccountGroupsService;
    this.alerter = Alerter;
    this.$translate = $translate;
    this.me = null;
    this.userIds = [];
    this.users = [];
    this.usersLoading = true;

    this.$scope.$on('useraccount.security.users.refresh', () => {
      this.$onInit();
    });
  }

  $onInit() {
    this.userIds = [];
    this.users = [];
    this.usersLoading = true;
    this.userService.getUser()
      .then((data) => {
        this.me = data;
        return this.groupsService.getGroups()
          .then(groups => this.$q.all(_.map(
            groups,
            groupName => this.groupsService.getGroup(groupName),
          )))
          .then((groupsArray) => {
            this.groups = groupsArray.reduce((result, item) => {
              result[item.name] = item; // eslint-disable-line
              return result;
            }, {});
            return this.usersService.getUsers()
              .then((userIds) => {
                this.userIds = userIds;
              });
          });
      })
      .catch((err) => {
        this.alerter.error(`${this.$translate.instant('user_users_error')} ${_.get(err, 'message', err)}`, 'userUsers');
      })
      .finally(() => {
        this.usersLoading = false;
      });
  }

  onTransformItem(userId) {
    return this.usersService.getUser(userId)
      .then((user) => {
        _.set(user, 'role', this.groups[user.group].role);
        return user;
      });
  }

  onTransformItemDone() {
    this.usersLoading = false;
  }
}
