angular.module('Module.emailpro.controllers').controller('EmailProDelegationSettingsCtrl', ['$scope', 'EmailPro', '$timeout', '$translate', function ($scope, EmailPro, $timeout, $translate) {
  const init = function () {
    $scope.selectedAccount = $scope.currentActionData;
    $scope.form = { search: null };
  };

  const recordChangeOperations = function (account, buffer, changesList) {
    // records the operation for sendAs rights:
    if (account.sendAs !== buffer.sendAs) {
      changesList.sendRights.push({
        id: account.id,
        operation: account.sendAs === true ? 'POST' : 'DELETE',
      });
    }

    // records the operation for full access rights:
    if (account.fullAccess !== buffer.fullAccess) {
      changesList.fullAccessRights.push({
        id: account.id,
        operation: account.fullAccess === true ? 'POST' : 'DELETE',
      });
    }
    return changesList;
  };

  // Return an array containing changes compared to original configuration
  const getChanges = function () {
    const changesList = {
      account: $scope.selectedAccount.primaryEmailAddress,
      sendRights: [],
      fullAccessRights: [],
    };
    if ($scope.delegationList) {
      angular.forEach($scope.delegationList.list.results, (account, index) => {
        recordChangeOperations(account, $scope.bufferAccounts.list.results[index], changesList);
      });
    }
    return changesList;
  };

  // Check if there are changes compared to original configuration
  $scope.hasChanged = function () {
    const changesList = getChanges();
    if (changesList) {
      return changesList.sendRights.length > 0 || changesList.fullAccessRights.length > 0;
    }
    return false;
  };

  $scope.getDelegationRight = function (count, offset) {
    $scope.setMessage(null);
    $scope.loading = true;

    EmailPro
      .getDelegationRight(
        $scope.selectedAccount.primaryEmailAddress,
        count,
        offset,
        $scope.form.search,
      )
      .then((accounts) => {
        $scope.loading = false;
        // keep the original data as a reference point to compare changes
        $scope.bufferAccounts = accounts;
        // make a deep copy of accounts list to use it as model
        $scope.delegationList = angular.copy(accounts);
      })
      .catch((failure) => {
        $scope.loading = false;
        $scope.setMessage($translate.instant('emailpro_tab_ACCOUNTS_error_message'), failure.data);
      });
  };

  $scope.$watch('form.search', (search) => {
    if ($scope.form.search !== null) {
      $timeout(() => {
        if ($scope.form.search === search) {
          $scope.$broadcast('paginationServerSide.loadPage', 1, 'delegationTable');
        }
      }, 1500);
    }
  }, true);

  $scope.updateDelegationRight = function () {
    $scope.resetAction();
    $scope.setMessage($translate.instant('emailpro_ACTION_delegation_doing_message'));

    EmailPro.updateDelegationRight(getChanges()).then((data) => {
      $scope.setMessage($translate.instant('emailpro_ACTION_delegation_success_message'), data);
    }, (failure) => {
      $scope.setMessage($translate.instant('emailpro_ACTION_delegation_error_message'), failure.data);
    });
  };

  init();
}]);
