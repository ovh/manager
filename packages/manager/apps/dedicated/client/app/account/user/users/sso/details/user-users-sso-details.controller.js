export default /* @ngInject */ function UserAccountUsersSSODetailsCtrl(
  $scope,
  UseraccountUsersService,
) {
  function initIdentityProvider() {
    UseraccountUsersService.getIdentityProvider()
      .then((identityProvider) => {
        $scope.identityProvider = identityProvider;
      })
      .catch(() => {
        $scope.identityProvider = null;
      });
  }

  function init() {
    initIdentityProvider();
  }

  init();
}
