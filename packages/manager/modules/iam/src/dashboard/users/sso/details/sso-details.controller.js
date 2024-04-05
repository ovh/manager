export default class IamUsersSsoDetailsCtrl {
  /* @ngInject */
  constructor($scope, $state, IamUsersService) {
    this.$scope = $scope;
    this.$state = $state;
    this.useraccountUsersService = IamUsersService;
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

  goToUsers() {
    return this.$state.go('iam.dashboard.users');
  }
}
