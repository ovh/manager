export default class IamUsersSsoDetailsCtrl {
  /* @ngInject */
  constructor($scope, $state, goToSSOList, IamSsoService) {
    this.ssoService = IamSsoService;
    this.$scope = $scope;
    this.$state = $state;
    this.identityProvider = null;
    this.goToSSOList = goToSSOList;
  }

  $onInit() {
    this.initIdentityProvider();
  }

  initIdentityProvider() {
    this.ssoService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
