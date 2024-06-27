export default class IamUsersSsoDetailsCtrl {
  /* @ngInject */
  constructor($scope, $state, IamUsersService, goToUsers) {
    this.$scope = $scope;
    this.$state = $state;
    this.useraccountUsersService = IamUsersService;
    this.identityProvider = null;
    this.goToUsers = goToUsers;
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
