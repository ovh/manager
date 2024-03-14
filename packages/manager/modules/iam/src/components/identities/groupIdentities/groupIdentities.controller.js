export default class groupIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $q) {
    this.IAMService = IAMService;
    this.$q = $q;
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

  async getIdentityGroup(identity) {
    try {
      const group = await this.IAMService.getGroup(identity.id);

      return group;
    } catch (error) {
      const { message } = error.data ?? {};

      return { ...identity, message };
    }
  }

  onRemovegroupIdentity(urn) {
    this.onRemoveIdentity({ urn });
  }
}
