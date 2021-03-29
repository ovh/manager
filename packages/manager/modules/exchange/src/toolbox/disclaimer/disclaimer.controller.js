import angular from 'angular';

export default /* @ngInject */ function ($scope) {
  $scope.updateGroup = function updateGroup(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction('exchange/group/update/group-update', angular.copy(ml));
    }
  };

  $scope.updateAccounts = function updateAccounts(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/group/accounts/group-accounts',
        angular.copy(ml),
      );
    }
  };

  $scope.deleteGroup = function deleteGroup(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction('exchange/group/remove/group-remove', angular.copy(ml));
    }
  };

  $scope.addGroupAlias = function addGroupAlias(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/group/alias/add/group-alias-add',
        angular.copy(ml),
      );
    }
  };

  $scope.groupDelegation = function groupDelegation(ml) {
    if (ml.state === $scope.stateOk) {
      $scope.setAction(
        'exchange/group/delegation/group-delegation',
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
