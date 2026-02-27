export default class serviceAccountIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $q) {
    this.IAMService = IAMService;
    this.$q = $q;

    this.isSelectingServiceAccounts = false;
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

  openSelectServiceAccountsModal() {
    this.isSelectingServiceAccounts = true;
  }

  closeSelectServiceAccountsModal() {
    this.isSelectingServiceAccounts = false;
  }

  onRemoveServiceAccount(urn) {
    this.onRemoveIdentity({ urn });
  }

  getServiceAccountList() {
    return this.IAMService.getServiceAccountList()
      .then((allServiceAccounts) => {
        const filteredServiceAccounts = allServiceAccounts
          .filter(({ identity }) => !!identity);
        return { data: filteredServiceAccounts };
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        const errorMessage = this.$translate.instant(
          'iam_identities_Service_accounts_load_error',
          {
            message,
          },
        );
        return { errorMessage };
      });
  }

  static ServiceAccountSearchFilter(option, query) {
    const { name, description, clientId } = option;
    return query.length > 0
      ? name.toLowerCase().includes(query.toLowerCase()) ||
      description.toLowerCase().includes(query.toLowerCase()) ||
      clientId.toLowerCase().includes(query.toLowerCase())
      : true;
  }

  onAddServiceAccounts(selectedOptions) {
    const urns = selectedOptions.map((o) => o.identity);
    this.onAddIdentities({ urns });
    this.closeSelectServiceAccountsModal();
  }

  onRemoveServiceAccount(urn) {
    this.onRemoveIdentity({ urn });
  }
}
