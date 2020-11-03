angular.module('App').controller('UserCtrl', [
  '$scope',
  '$http',
  'ducUser',
  'ssoAuthentication',
  function UserCtrl($scope, $http, ducUser, authentication) {
    $scope.user = null;

    $scope.logout = function logout() {
      authentication.logout();
    };

    ducUser.getUser().then((user) => {
      $scope.user = user;
    });
  },
]);
