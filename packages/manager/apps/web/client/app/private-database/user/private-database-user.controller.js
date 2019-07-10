angular.module('App').controller('PrivateDatabaseUsersCtrl', [
  '$scope',

  ($scope) => {
    $scope.userView = 'private-database/user/list/private-database-user-list.html';
    $scope.user = null;

    $scope.goToGrants = (user) => {
      $scope.user = user;
      $scope.userView = 'private-database/user/grants/private-database-user-grants.html';
    };

    $scope.goToList = () => {
      $scope.user = null;
      $scope.userView = 'private-database/user/list/private-database-user-list.html';
    };
  },
]);
