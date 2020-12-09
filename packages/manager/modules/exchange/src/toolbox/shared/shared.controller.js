import angular from 'angular';

export default /* @ngInject */ function ($scope) {
  $scope.updateShared = function updateShared(shared) {
    if (shared.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/shared/update/shared-update',
        angular.copy(shared),
      );
    }
  };

  $scope.removeShared = function removeShared(shared) {
    if (shared.state === $scope.stateOk && !shared.hasChildren) {
      $scope.setAction(
        'exchange/shared/remove/shared-remove',
        angular.copy(shared),
      );
    }
  };

  $scope.addSharedPermission = function addSharedPermission(shared) {
    if (shared.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/shared/permission/add/shared-permission-add',
        angular.copy(shared),
      );
    }
  };

  $scope.sharedPermissions = function sharedPermissions(shared) {
    if (shared.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/shared/permission/update/shared-permission-update',
        angular.copy(shared),
      );
    }
  };

  $scope.aliasDisplay = function aliasDisplay(shared) {
    if (shared.state === $scope.stateOk) {
      $scope.displayAliasesByGroup(shared);
    }
  };
}
