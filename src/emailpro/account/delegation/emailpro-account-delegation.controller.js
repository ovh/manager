angular.module('Module.emailpro.controllers').controller('EmailProAccountDelegationCtrl', ($scope, $stateParams, EmailPro, $timeout, $translate) => {
  const init = function () {
    $scope.selectedAccount = $scope.currentActionData;
    $scope.form = { search: null };
  };

  const recordChangeOperations = function (account, buffer, changesList) {
    // record the operation to be done for sendAs rights:
    if (account.newSendAsValue !== buffer.sendAs) {
      changesList.sendRights.push({
        id: account.id,
        operation: account.newSendAsValue === true ? 'POST' : 'DELETE',
      });
    }

    // records the operation for sendOnBehalfTo rights:
    if (account.newSendOnBehalfToValue !== buffer.sendOnBehalfTo) {
      changesList.sendOnBehalfToRights.push({
        id: account.id,
        operation: account.newSendOnBehalfToValue === true ? 'POST' : 'DELETE',
      });
    }

    // record the operation to be done for full access rights:
    if (account.newFullAccessValue !== buffer.fullAccess) {
      changesList.fullAccessRights.push({
        id: account.id,
        operation: account.newFullAccessValue === true ? 'POST' : 'DELETE',
      });
    }
    return changesList;
  };

  /**
   * Return an array containing changes from the original configuration
   */
  const getChanges = function () {
    const changesList = {
      account: $scope.selectedAccount.primaryEmailAddress,
      sendRights: [],
      sendOnBehalfToRights: [],
      fullAccessRights: [],
    };

    if ($scope.accounts) {
      angular.forEach($scope.accounts.list.results, (account, index) => {
        recordChangeOperations(account, $scope.bufferAccounts.list.results[index], changesList);
      });
    }
    return changesList;
  };

  const constructResult = function (data) {
    const mainMessage = {
      OK: $translate.instant('emailpro_ACTION_delegation_success_message'),
      PARTIAL: $translate.instant('emailpro_ACTION_delegation_partial_message'),
      ERROR: $translate.instant('emailpro_ACTION_delegation_error_message'),
    };
    let state = 'OK';
    let errors = 0;

    angular.forEach(data, (task) => {
      if (task.status === 'ERROR') {
        _.set(task, 'message', $translate.instant(`emailpro_tab_TASKS_${task.function}`));
        _.set(task, 'type', 'ERROR');
        state = 'PARTIAL';
        errors += 1;
      }
    });
    if (errors === data.length) {
      state = 'ERROR';
    }
    $scope.setMessage(mainMessage, { messages: data, state });
  };

  const checkForBufferChanges = function (account) {
    if ($scope.bufferAccounts) {
      angular.forEach($scope.bufferAccounts.list.results, (bufferAccount) => {
        if (bufferAccount.id === account.id) {
          _.set(account, 'newSendAsValue', bufferAccount.newSendAsValue);
          _.set(account, 'newSendOnBehalfToValue', bufferAccount.newSendOnBehalfToValue);
          _.set(account, 'newFullAccessValue', bufferAccount.newFullAccessValue);
        }
      });
    }
  };

  /**
   * Check if there are changes compared to original configuration
   */
  $scope.hasChanged = function () {
    const changesList = getChanges();
    if (changesList) {
      return changesList.sendRights.length > 0
            || changesList.fullAccessRights.length > 0
            || changesList.sendOnBehalfToRights.length > 0;
    }
    return false;
  };

  $scope.getAccounts = function (count, offset) {
    $scope.setMessage(null);
    $scope.loading = true;

    EmailPro
      .getAccountDelegationRight(
        $stateParams.productId,
        $scope.selectedAccount.primaryEmailAddress,
        count,
        offset,
        $scope.form.search,
      )
      .then((accounts) => {
        $scope.loading = false;
        // make a deep copy of accounts list to use it as model
        $scope.accounts = angular.copy(accounts);
        angular.forEach($scope.accounts.list.results, (account) => {
          _.set(account, 'newSendAsValue', account.sendAs);
          _.set(account, 'newSendOnBehalfToValue', account.sendOnBehalfTo);
          _.set(account, 'newFullAccessValue', account.fullAccess);
          checkForBufferChanges(account);
        });

        // keep the original data as a reference point to compare changes
        $scope.bufferAccounts = $scope.accounts;
      })
      .catch((failure) => {
        $scope.loading = false;
        $scope.setMessage($translate.instant('emailpro_tab_ACCOUNTS_error_message'), failure.data);
      });
  };

  $scope.$on(EmailPro.events.accountsChanged, () => {
    $scope.getAccounts();
  });

  $scope.$watch('form.search', (search) => {
    if ($scope.form.search !== null) {
      $timeout(() => {
        if ($scope.form.search === search) {
          $scope.getAccounts();
        }
      }, 1500);
    }
  }, true);

  $scope.updateDelegationRight = function () {
    $scope.resetAction();
    $scope.setMessage($translate.instant('emailpro_ACTION_delegation_doing_message'), { status: 'success' });

    EmailPro.updateAccountDelegationRights($stateParams.productId, getChanges()).then((data) => {
      constructResult(data);
    }, (failure) => {
      $scope.setMessage($translate.instant('emailpro_ACTION_delegation_error_message'), failure.data);
    });
  };

  init();
});

angular.module('Module.emailpro.controllers').controller('EmailProMailingListDelegationCtrl', ($scope, $stateParams, EmailPro, $timeout, $translate) => {
  const init = function () {
    $scope.selectedGroup = $scope.currentActionData;
    $scope.form = { search: null };
  };

  const recordChangeOperations = function (account, changesList) {
    // record the operation to be done for sendAs rights:
    if (account.newSendAsValue !== account.sendAs) {
      changesList.sendRights.push({
        id: account.id,
        operation: account.newSendAsValue === true ? 'POST' : 'DELETE',
      });
    }

    // records the operation for sendOnBehalfTo rights:
    if (account.newSendOnBehalfToValue !== account.sendOnBehalfTo) {
      changesList.sendOnBehalfToRights.push({
        id: account.id,
        operation: account.newSendOnBehalfToValue === true ? 'POST' : 'DELETE',
      });
    }
    return changesList;
  };

  // Return an array containing changes compared to original configuration
  const getChanges = function () {
    const changesList = {
      account: $scope.selectedGroup.mailingListName,
      sendRights: [],
      sendOnBehalfToRights: [],
    };
    if ($scope.delegationList) {
      angular.forEach($scope.delegationList.list.results, (account) => {
        recordChangeOperations(account, changesList);
      });
    }
    return changesList;
  };

  // Check if there are changes compared to original configuration
  $scope.hasChanged = function () {
    const changesList = getChanges();
    if (changesList) {
      return changesList.sendRights.length > 0 || changesList.sendOnBehalfToRights.length > 0;
    }
    return false;
  };

  $scope.getDelegationRight = function (count, offset) {
    $scope.setMessage(null);
    $scope.loading = true;

    EmailPro
      .getMailingListDelegationRights(
        $stateParams.productId,
        $scope.selectedGroup.mailingListName,
        count,
        offset,
        $scope.form.search,
      )
      .then((accounts) => {
        $scope.loading = false;

        // make a deep copy of accounts list to use it as model
        $scope.delegationList = angular.copy(accounts);

        // keep the original value to have a reference to compare changes
        angular.forEach($scope.delegationList.list.results, (account) => {
          _.set(account, 'newSendAsValue', account.sendAs);
          _.set(account, 'newSendOnBehalfToValue', account.sendOnBehalfTo);
        });
      })
      .catch((failure) => {
        $scope.loading = false;
        $scope.setMessage($translate.instant('emailpro_tab_GROUPS_error_message'), failure.data);
      });
  };

  $scope.$on(EmailPro.events.accountsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'delegationTable');
  });

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
    $scope.setMessage($translate.instant('emailpro_GROUPS_delegation_doing_message'));

    EmailPro
      .updateMailingListDelegationRights($stateParams.productId, getChanges())
      .then((data) => {
        $scope.setMessage($translate.instant('emailpro_GROUPS_delegation_success_message'), data);
      })
      .catch((failure) => {
        $scope.setMessage($translate.instant('emailpro_GROUPS_delegation_error_message'), failure.data);
      });
  };

  init();
});
