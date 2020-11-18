export default [
  '$scope',
  '$http',
  'User',
  'ssoAuthentication',
  function UserCtrl($scope, $http, User, authentication) {
    $scope.user = null;

    $scope.logout = function logout() {
      authentication.logout();
    };

    User.getUser().then((user) => {
      $scope.user = user;
    });
  },
];
