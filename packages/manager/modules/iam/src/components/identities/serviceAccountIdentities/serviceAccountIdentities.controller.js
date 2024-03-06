export default class serviceAccountIdentitiesController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;
  }

  $onChanges() {
    this.getIdentitiesServiceAccounts().then((data) => {
      this.serviceAccounts = data;
    });
  }

  getIdentitiesServiceAccounts() {
    return Promise.all(
      this.identities.map((identity) =>
        this.getIdentityServiceAccount(identity),
      ),
    );
  }

  async getIdentityServiceAccount(identity) {
    try {
      const serviceAccount = await this.IAMService.getServiceAccount(
        identity.id,
      );
      return serviceAccount;
    } catch (error) {
      const { message } = error.data ?? {};

      return {
        clientId: identity.id,
        identity: identity.urn,
        message,
      };
    }
  }
}
