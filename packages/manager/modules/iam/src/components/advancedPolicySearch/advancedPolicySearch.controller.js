export default class AdvancedPolicySearchController {
  /* @ngInject */
  constructor($q, $timeout, IAMService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.IAMService = IAMService;
    this.URL = URL;

    this.display = {
      identities: false,
      resources: false,
      actions: false,
    };

    this.model = {
      identities: { selected: {}, manual: [] },
      resources: { types: [], selection: [] },
      actions: { selection: [], isWildcardActive: false },
      permissionsGroups: [],
    };

    this.localUsers = { status: 'not-loaded', search: '', items: [] };
    this.userGroups = { status: 'not-loaded', search: '', items: [] };
    this.urnSearch = { search: '' };

    this.filterLocalUsersFn = this.filterLocalUsers.bind(this);
    this.filterUserGroupsFn = this.filterUserGroup.bind(this);
  }

  $onInit() {
    this.initIdentitiesModel(this.identities);
    this.initResourcesModel(this.resources);
    this.initActionsModel(this.actions);
  }

  submitSearch() {
    const stateParams = {
      identities: this.getIdentitiesParam(),
      resources: this.getResourcesParam(),
      actions: this.getActionsParam(),
    };
    this.goBack(stateParams);
  }

  /*
   * This hack is a way to force the collapsibles to recalculate their height
   */
  triggerResize() {
    this.$timeout(() => {
      jQuery(window).trigger('resize');
    }, 30);
  }

  // **********************************************************************************************
  // Identities

  initIdentitiesModel(identitiesParam) {
    if (!identitiesParam) {
      return;
    }
    this.model.identities.selected = (identitiesParam?.selection || []).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    this.model.identities.manual = identitiesParam?.manual || [];
  }

  getIdentitiesParam() {
    const { selected } = this.model.identities;
    return {
      selection: Object.keys(selected).filter((key) => !!selected[key]),
      manual: this.model.identities.manual,
    };
  }

  loadLocalUsers(openingCollapsible) {
    // We don't need to load data when closing the collapsible.
    if (!openingCollapsible) {
      return;
    }

    if (['loading', 'ok'].includes(this.localUsers.status)) {
      return;
    }

    this.localUsers.status = 'loading';
    this.IAMService.getUserList()
      .then((items) => {
        this.localUsers.items = items;
        this.localUsers.status = items.length > 0 ? 'ok' : 'empty';
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        const errorMessage = this.$translate.instant(
          'iam_identities_groups_load_error',
          {
            message,
          },
        );
        this.localUsers.status = 'error';
        this.localUsers.errorMessage = errorMessage;
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

  loadUserGroups(openingCollapsible) {
    // We don't need to load data when closing the collapsible.
    if (!openingCollapsible) {
      return;
    }

    if (['loading', 'ok'].includes(this.userGroups.status)) {
      return;
    }

    this.userGroups.status = 'loading';
    this.IAMService.getGroupList()
      .then((items) => {
        this.userGroups.items = items;
        this.userGroups.status = items.length > 0 ? 'ok' : 'empty';
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        const errorMessage = this.$translate.instant(
          'iam_identities_groups_load_error',
          {
            message,
          },
        );
        this.userGroups.status = 'error';
        this.userGroups.errorMessage = errorMessage;
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

  onNicSearchKeyPressed(event) {
    if (event.key.toLowerCase() !== 'enter') {
      return;
    }
    event.preventDefault();
    this.addOvhNic();
  }

  addOvhNic() {
    const newNic = this.urnSearch.search;
    const newItem = { name: newNic };
    this.model.identities.manual = [...this.model.identities.manual, newItem];
    this.urnSearch.search = '';
  }

  // **********************************************************************************************
  // Resources

  initResourcesModel(resourcesParam) {
    if (!resourcesParam) {
      return;
    }
    this.model.resources.types = resourcesParam?.types || [];
    this.model.resources.selection = resourcesParam?.selection || [];
  }

  getResourcesParam() {
    return {
      types: this.model.resources.types,
      selection: this.model.resources.selection,
    };
  }

  // **********************************************************************************************
  // Actions

  initActionsModel(actionsParam) {
    if (!actionsParam) {
      return;
    }
    this.model.actions.selection = actionsParam?.selection || [];
    this.model.permissionsGroups = actionsParam?.groups || [];
  }

  getActionsParam() {
    return {
      selection: this.model.actions.selection,
      groups: this.model.permissionsGroups,
    };
  }

  onResourceTypesConfirmRemove() {
    return this.$q.when(true);
  }
}
