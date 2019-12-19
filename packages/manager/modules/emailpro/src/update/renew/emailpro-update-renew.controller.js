import angular from 'angular';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import remove from 'lodash/remove';
import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, EmailPro, $location, $translate) => {
  $scope.exchange = angular.copy($scope.currentActionData);
  $scope.search = { value: null };
  $scope.buffer = {
    hasChanged: false,
    changes: [],
    selectedMonthly: [],
    selectedYearly: [],
    selectedDelete: [],
    firstView: true,
    ids: [],
  };

  const setMonthly = function setMonthly(account) {
    set(account, 'renewPeriod', 'MONTHLY');
    if ($scope.buffer.selectedMonthly.indexOf(account.primaryEmailAddress) === -1) {
      $scope.buffer.selectedMonthly.push(account.primaryEmailAddress);
    }
    remove($scope.buffer.selectedYearly, (num) => num === account.primaryEmailAddress);
    remove($scope.buffer.selectedDelete, (num) => num === account.primaryEmailAddress);
  };

  const setYearly = function setYearly(account) {
    set(account, 'renewPeriod', 'YEARLY');
    if ($scope.buffer.selectedYearly.indexOf(account.primaryEmailAddress) === -1) {
      $scope.buffer.selectedYearly.push(account.primaryEmailAddress);
    }
    remove($scope.buffer.selectedMonthly, (num) => num === account.primaryEmailAddress);
    remove($scope.buffer.selectedDelete, (num) => num === account.primaryEmailAddress);
  };

  const setDeleteAtExpiration = function setDeleteAtExpiration(account) {
    set(account, 'renewPeriod', 'DELETE_AT_EXPIRATION');
    if ($scope.buffer.selectedDelete.indexOf(account.primaryEmailAddress) === -1) {
      $scope.buffer.selectedDelete.push(account.primaryEmailAddress);
    }
    remove($scope.buffer.selectedMonthly, (num) => num === account.primaryEmailAddress);
    remove($scope.buffer.selectedYearly, (num) => num === account.primaryEmailAddress);
  };

  const bufferChanges = function bufferChanges(account) {
    const buffer = find($scope.buffer.changes, {
      primaryEmailAddress: account.primaryEmailAddress,
    });
    if (!buffer) {
      $scope.buffer.changes.push({
        primaryEmailAddress: account.primaryEmailAddress,
        primaryEmailDisplayName: account.primaryEmailDisplayName,
        renewPeriod: account.renewPeriod,
        exchangeOffer: $scope.exchange.offer,
      });
    } else {
      buffer.renewPeriod = account.renewPeriod;
    }
  };

  const checkForChanges = function checkForChanges() {
    $scope.displayDeleteWarning = false;
    $scope.bufferedAccounts.list.results
      .forEach((buffer, index) => {
        const newValue = $scope.accounts.list.results[index];
        if (buffer.renewPeriod !== newValue.renewPeriod) {
          bufferChanges(buffer);
          if (buffer.renewPeriod === 'DELETE_AT_EXPIRATION' || newValue.renewPeriod === 'DELETE_AT_EXPIRATION') {
            $scope.displayDeleteWarning = true;
          }
          return false;
        }
        return remove($scope.buffer.changes, { primaryEmailAddress: buffer.primaryEmailAddress });
      });
    $scope.buffer.hasChanged = $scope.buffer.changes.length > 0;
  };

  $scope.getAccounts = function getAccounts(count, offset) {
    $scope.loading = true;
    EmailPro.getAccounts(count, offset, $scope.search.value)
      .then((accounts) => {
        $scope.loading = false;
        $scope.accounts = accounts;

        $scope.bufferedAccounts = cloneDeep(accounts);
        $scope.buffer.selectedMonthly = [];
        $scope.buffer.selectedYearly = [];
        $scope.buffer.selectedDelete = [];
        $scope.buffer.ids = flatten($scope.bufferedAccounts.list.results);

        // roll previous buffered changes
        if ($scope.buffer.hasChanged) {
          $scope.bufferedAccounts.list.results.forEach((account) => {
            const buffer = find($scope.buffer.changes, {
              primaryEmailAddress: account.primaryEmailAddress,
            });
            if (buffer) {
              set(account, 'renewPeriod', buffer.renewPeriod);
            }
          });
        }

        // needed by selectAll checkbox
        $scope.bufferedAccounts.list.results.forEach((account) => {
          $scope.trackSelected(account.primaryEmailAddress, account.renewPeriod);
        });

        $scope.buffer.firstView = false;
      }, (failure) => {
        $scope.loading = false;
        if (failure) {
          $scope.setMessage($translate.instant('emailpro_tab_ACCOUNTS_error_message'), failure.data);
          $scope.resetAction();
        }
      });
  };

  $scope.checkboxStateChange = function checkboxStateChange(state, value) {
    if ($scope.bufferedAccounts
      && $scope.bufferedAccounts.list
      && $scope.buffer.ids
      && $scope.bufferedAccounts.list.results) {
      $scope.selectOnePage(value);
    }
  };

  /**
   * Mark alltems on the page as selected with 'value'.
   * @param value
   */
  $scope.selectOnePage = function selectOnePage(value) {
    clone($scope.buffer.ids)
      .forEach((selected) => {
        $scope.trackSelected(selected.primaryEmailAddress, value);
      });
  };

  $scope.trackSelected = function trackSelected(primaryEmailAddress, value) {
    const account = find($scope.bufferedAccounts.list.results, { primaryEmailAddress });
    if (account) {
      if (value === 'MONTHLY') {
        setMonthly(account);
      } else if (value === 'YEARLY') {
        setYearly(account);
      } else if (value === 'DELETE_AT_EXPIRATION') {
        setDeleteAtExpiration(account);
      }
      checkForChanges();
    }
  };

  $scope.$watch('search.value', (search) => {
    if ($scope.search) {
      if ($scope.search.value === search) {
        $scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
      }
    }
  });

  $scope.reset = function reset() {
    $location.search('action', null);
    $scope.resetAction();
  };

  $scope.submit = function submit() {
    $location.search('action', null);

    $scope.buffer.changes.forEach((c) => {
      set(c, 'is25g', $scope.is25g());
    });

    EmailPro.updateRenew($stateParams.productId, $scope.buffer.changes)
      .then((data) => {
        const updateRenewMessages = {
          OK: $translate.instant('emailpro_update_billing_periode_success'),
          PARTIAL: $translate.instant('emailpro_update_billing_periode_partial'),
          ERROR: $translate.instant('emailpro_update_billing_periode_failure'),
        };
        $scope.setMessage(updateRenewMessages, data);
        $scope.resetAction();
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_update_billing_periode_failure'), failure.data);
        $scope.resetAction();
      });
  };
};
