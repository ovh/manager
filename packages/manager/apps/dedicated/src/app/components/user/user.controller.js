angular.module('App').controller('UserCtrl', [
  '$scope',
  '$http',
  'User',
  'ssoAuthentication',
  function ($scope, $http, User, authentication) {
    $scope.user = null;

    $scope.logout = function () {
      authentication.logout();
    };

    User.getUser().then((user) => {
      $scope.user = user;
    });
  },
]);
