angular.module('Module.exchange.controllers').controller('ExchangeToolboxGroupsCtrl', [
  '$scope',

  function ($scope) {
    $scope.updateGroup = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.setAction('exchange/group/update/group-update', angular.copy(ml));
      }
    };

    $scope.updateAccounts = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.setAction('exchange/group/accounts/group-accounts', angular.copy(ml));
      }
    };

    $scope.deleteGroup = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.setAction('exchange/group/remove/group-remove', angular.copy(ml));
      }
    };

    $scope.addGroupAlias = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.setAction('exchange/group/alias/add/group-alias-add', angular.copy(ml));
      }
    };

    $scope.groupDelegation = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.setAction('exchange/group/delegation/group-delegation', angular.copy(ml));
      }
    };

    $scope.aliasDisplay = function (ml) {
      if (ml.state === $scope.stateOk) {
        $scope.displayAliasesByGroup(ml);
      }
    };
  },
]);

angular.module('Module.exchange.controllers').controller('ExchangeToolboxDisclaimerCtrl', [
  '$scope',

  function ($scope) {
    $scope.updateDisclaimer = function (disclaimer) {
      if (!disclaimer.taskPendingId) {
        $scope.setAction('exchange/disclaimer/update/disclaimer-update', angular.copy(disclaimer));
      }
    };

    $scope.deleteDisclaimer = function (disclaimer) {
      if (!disclaimer.taskPendingId) {
        $scope.setAction('exchange/disclaimer/remove/disclaimer-remove', angular.copy(disclaimer));
      }
    };
  },
]);

angular.module('Module.exchange.controllers').controller('ExchangeToolboxSharedCtrl', [
  '$scope',

  function ($scope) {
    $scope.updateShared = function (shared) {
      if (shared.state === $scope.stateOk) {
        $scope.setAction('exchange/shared/update/shared-update', angular.copy(shared));
      }
    };

    $scope.removeShared = function (shared) {
      if (shared.state === $scope.stateOk && !shared.hasChildren) {
        $scope.setAction('exchange/shared/remove/shared-remove', angular.copy(shared));
      }
    };

    $scope.addSharedPermission = function (shared) {
      if (shared.state === $scope.stateOk) {
        $scope.setAction(
          'exchange/shared/permission/add/shared-permission-add',
          angular.copy(shared),
        );
      }
    };

    $scope.sharedPermissions = function (shared) {
      if (shared.state === $scope.stateOk) {
        $scope.setAction(
          'exchange/shared/permission/update/shared-permission-update',
          angular.copy(shared),
        );
      }
    };

    $scope.aliasDisplay = function (shared) {
      if (shared.state === $scope.stateOk) {
        $scope.displayAliasesByGroup(shared);
      }
    };
  },
]);
