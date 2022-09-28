export default class UserAccountUsersSsoDetailsCtrl {
  /* @ngInject */
  constructor($scope, UseraccountUsersService) {
    this.$scope = $scope;
    this.useraccountUsersService = UseraccountUsersService;
    this.identityProvider = null;
  }

  $onInit() {
    this.useraccountUsersService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
