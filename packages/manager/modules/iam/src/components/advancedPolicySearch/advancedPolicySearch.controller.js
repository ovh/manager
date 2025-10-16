export default class AdvancedPolicySearchController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;

    this.model = {
      selectedIdentities: {},
      selectedResources: {},
      selectedActions: {},
    };

    this.localUsers = { status: 'not-loaded', search: '', items: [] };
    this.userGroups = { status: 'not-loaded', search: '', items: [] };

    this.filterLocalUsersFn = this.filterLocalUsers.bind(this);
    this.filterUserGroupsFn = this.filterUserGroup.bind(this);
  }

  $onInit() {
    const identities = (this.identitiesCriteria || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    const resources = (this.resourcesCriteria || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    const actions = (this.actionsCriteria || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    this.model = {
      selectedIdentities: identities,
      selectedResources: resources,
      selectedActions: actions,
    };
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
      identitiesCriteria: identities,
      resourcesCriteria: resources,
      actionsCriteria: actions,
    };
    this.goBack(stateParams);
  }

  loadFieldItems(expanded, key) {
    // We don't need to load data when closing the collapsible.
    if (!expanded) {
      return;
    }

    let loadFn;
    let fieldData;
    switch (key) {
      case 'localUsers':
        fieldData = this.localUsers;
        loadFn = () => this.IAMService.getUserList();
        break;
      case 'userGroups':
        fieldData = this.userGroups;
        loadFn = () => this.IAMService.getGroupList();
        break;
      default:
        return;
    }

    if (fieldData.status === 'loading' || fieldData.status === 'ok') {
      return;
    }

    fieldData.status = 'loading';
    loadFn()
      .then((items) => {
        fieldData.items = items;
        fieldData.status = items.length > 0 ? 'ok' : 'empty';
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        const errorMessage = this.$translate.instant(
          'iam_identities_groups_load_error',
          {
            message,
          },
        );
        fieldData.status = 'error';
        fieldData.errorMessage = errorMessage;
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

  filterUserGroup(userGroup) {
    const query = this.userGroups.search;
    const { name, role } = userGroup;
    return query.length > 0
      ? name.toLowerCase().includes(query.toLowerCase()) ||
          role.toLowerCase().includes(query.toLowerCase())
      : true;
  }
}
