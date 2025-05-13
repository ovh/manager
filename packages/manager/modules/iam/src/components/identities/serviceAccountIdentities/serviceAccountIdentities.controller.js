export default class serviceAccountIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $q) {
    this.IAMService = IAMService;
    this.$q = $q;
  }

  $onChanges() {
    this.getIdentitiesServiceAccounts().then((data) => {
      this.serviceAccounts = data;
    });
  }

  getIdentitiesServiceAccounts() {
    return this.$q.all(
      this.identities.map((identity) =>
        this.getIdentityServiceAccount(identity),
      ),
    );
  }

  getIdentityServiceAccount(identity) {
    return this.IAMService.getServiceAccount(identity.id).catch((error) => {
      const { message } = error.data ?? {};
      return {
        clientId: identity.id,
        identity: identity.urn,
        message,
      };
    });
  }

  onRemoveServiceAccount(urn) {
    this.onRemoveIdentity({ urn });
  }
}
