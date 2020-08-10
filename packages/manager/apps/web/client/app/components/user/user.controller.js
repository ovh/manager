angular.module('App').controller('UserCtrl', [
  '$scope',
  'WucUser',
  'ssoAuthentication',
  ($scope, WucUser, authentication) => {
    $scope.user = null;

    $scope.logout = () => authentication.logout();

    WucUser.getUser().then((user) => {
      $scope.user = user;
    });
  },
]);
