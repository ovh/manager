export default class serviceAccountIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $scope) {
    this.$scope = $scope;
    this.IAMService = IAMService;
  }

  $onInit() {
    this.$scope.$watch('$ctrl.identities', async () => {
      this.serviceAccounts = await this.getIdentitiesServiceAccounts();
      this.$scope.$digest();
    });
  }

  getIdentitiesServiceAccounts = async () => {
    return Promise.all(
      this.identities.map((identity) =>
        this.getIdentityServiceAccount(identity),
      ),
    );
  };

  getIdentityServiceAccount = async (identity) => {
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
  };
}
