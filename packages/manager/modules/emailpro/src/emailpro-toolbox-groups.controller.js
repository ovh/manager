import angular from 'angular';

export default /* @ngInject */ function($scope) {
  $scope.updateGroup = function updateGroup(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/group/update/emailpro-group-update',
        angular.copy(ml),
      );
    }
  };

  $scope.deleteGroup = function deleteGroup(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/group/remove/emailpro-group-remove',
        angular.copy(ml),
      );
    }
  };

  $scope.addGroupAlias = function addGroupAlias(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/group/alias/add/emailpro-group-alias-add',
        angular.copy(ml),
      );
    }
  };

  $scope.groupDelegation = function groupDelegation(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'emailpro/group/delegation/emailpro-group-delegation',
        angular.copy(ml),
      );
    }
  };

  $scope.aliasDisplay = function aliasDisplay(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.displayAliasesByGroup(ml);
    }
  };
}
