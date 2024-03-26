export default class groupIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $q, $translate) {
    this.IAMService = IAMService;
    this.$q = $q;
    this.$translate = $translate;

    this.isSelectingGroups = false;
  }

  $onChanges() {
    this.getIdentitiesGroups().then((data) => {
      this.groups = data;
    });
  }

  getIdentitiesGroups() {
    return this.$q.all(
      this.identities.map((identity) => this.getIdentityGroup(identity)),
    );
  }

  getIdentityGroup(identity) {
    return this.IAMService.getGroup(identity.id).catch((error) => {
      const { message } = error.data ?? {};
      return { ...identity, message };
    });
  }

  openSelectGroupsModal() {
    this.isSelectingGroups = true;
  }

  closeSelectGroupsModal() {
    this.isSelectingGroups = false;
  }

  getGroupList() {
    return this.IAMService.getGroupList()
      .then((result) => ({
        data: result,
      }))
      .catch((error) => {
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

  static groupSearchFilter(option, query) {
    const { name, role } = option;
    return query.length > 0
      ? name.toLowerCase().includes(query.toLowerCase()) ||
          role.toLowerCase().includes(query.toLowerCase())
      : true;
  }

  onAddGroups(selectedOptions) {
    const urns = selectedOptions.map((o) => o.urn);
    this.onAddIdentities({ urns });
    this.closeSelectGroupsModal();
  }

  onRemoveGroup(urn) {
    this.onRemoveIdentity({ urn });
  }
}
