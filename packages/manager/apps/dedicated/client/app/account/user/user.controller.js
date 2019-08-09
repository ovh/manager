angular.module('UserAccount').controller('UserAccount.controllers.main', [
  '$scope',
  '$window',
  '$location',
  '$timeout',
  '$state',
  function ($scope, $window, $location, $timeout, $state) {
    $scope.USERACCOUNT_BASE_URL = 'account/user/';

    $scope.originUrl = $location.search().redirectTo || $location.search().redirectto;

    $scope.redirectToOrigin = function () {
      if ($scope.originUrl) {
        _.set($window, 'location.href', $scope.originUrl);
      } else {
        $state.go('app.configuration');
      }
    };

    $scope.stepPath = '';
    $scope.currentAction = null;
    $scope.currentActionData = null;

    $scope.resetAction = function () {
      $scope.setAction(false);
    };

    $scope.setAction = function (action, data) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      if (action) {
        $scope.stepPath = `${$scope.USERACCOUNT_BASE_URL}${$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        $scope.currentActionData = null;
        $timeout(() => {
          $scope.stepPath = '';
        }, 300);
      }
    };
  },
]);
