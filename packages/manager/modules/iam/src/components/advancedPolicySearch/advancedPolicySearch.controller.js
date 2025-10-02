export default class AdvancedPolicySearchController {
  /* @ngInject */
  constructor($state, IAMService) {
    this.$state = $state;
    this.IAMService = IAMService;

    this.model = {
      selectedIdentities: {},
      selectedResources: {},
      selectedActions: {},
    };

    this.localUsers = { loading: true, search: '', items: [] };
    this.userGroups = { loading: true, search: '', items: [] };

    this.filterLocalUsersFn = this.filterLocalUsers.bind(this);
    this.filterUserGroupsFn = this.filterUserGroup.bind(this);
  }

  $onInit() {
    const identities = (this.identitiesFilter || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    const resources = (this.resourcesFilter || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    const actions = (this.actionsFilter || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    this.model = {
      selectedIdentities: identities,
      selectedResources: resources,
      selectedActions: actions,
    };

    this.getLocalUsers().then((localUsers) => {
      this.localUsers.items = localUsers;
      this.localUsers.loading = false;
    });
    this.getGroupList().then((userGroups) => {
      this.userGroups.items = userGroups;
      this.userGroups.loading = false;
    });
  }

  submitSearch() {
    const identities = Object.keys(this.model.selectedIdentities).filter(
      (urn) => !!this.model.selectedIdentities[urn],
    );
    const resources = Object.keys(this.model.selectedResources).filter(
      (urn) => !!this.model.selectedResources[urn],
    );
    const actions = Object.keys(this.model.selectedActions).filter(
      (action) => !!this.model.selectedActions[action],
    );
    const stateParams = {
      identitiesFilter: identities,
      resourcesFilter: resources,
      actionsFilter: actions,
    };
    this.$state.go('^', stateParams);
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
    const query = this.localUsers.search;
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
    const query = this.userGroups.search;
    const { name, role } = userGroup;
    return query.length > 0
      ? name.toLowerCase().includes(query.toLowerCase()) ||
          role.toLowerCase().includes(query.toLowerCase())
      : true;
  }
}
