export default class AdvancedPolicySearchController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;

    this.model = {
      // Identity
      localUsers: { loading: true, search: '', selected: {}, items: [] },
      userGroups: { loading: true, search: '', selected: {}, items: [] },
      // Ressources
      // Actions
    };

    this.filterLocalUsersFn = this.filterLocalUsers.bind(this);
    this.filterUserGroupsFn = this.filterUserGroup.bind(this);
  }

  $onInit() {
    this.getLocalUsers().then((localUsers) => {
      this.model.localUsers.items = localUsers;
      this.model.localUsers.loading = false;
    });
    this.getGroupList().then((userGroups) => {
      this.model.userGroups.items = userGroups;
      this.model.userGroups.loading = false;
    });
  }

  getLocalUsers() {
    return this.IAMService.getUserList().catch((error) => {
      const { message } = error.data ?? {};
      const errorMessage = this.$translate.instant(
        'iam_identities_users_load_error',
        {
          message,
        },
      );
      return { errorMessage };
    });
  }

  filterLocalUsers(localUser) {
    const query = this.model.localUsers.search;
    const { login, email } = localUser;
    return query.length > 0
      ? email.toLowerCase().includes(query.toLowerCase()) ||
          login.toLowerCase().includes(query.toLowerCase())
      : true;
  }

  getGroupList() {
    return this.IAMService.getGroupList().catch((error) => {
      const { message } = error.data ?? {};
      const errorMessage = this.$translate.instant(
        'iam_identities_groups_load_error',
        {
          message,
        },
      );
      return { errorMessage };
    });
  }

  filterUserGroup(userGroup) {
    const query = this.model.userGroups.search;
    const { name, role } = userGroup;
    return query.length > 0
      ? name.toLowerCase().includes(query.toLowerCase()) ||
          role.toLowerCase().includes(query.toLowerCase())
      : true;
  }
}
