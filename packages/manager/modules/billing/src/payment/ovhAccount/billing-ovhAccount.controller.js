import find from 'lodash/find';
import head from 'lodash/head';

import { BILLING_BASE_URL } from '../../constants/billing.constants';

export default /* @ngInject */ (
  $filter,
  $scope,
  $state,
  $timeout,
  $translate,
  atInternet,
  BillingmessageParser,
  BillingOvhAccount,
  BillingdateRangeSelection,
) => {
  $scope.ovhAccountLoading = false;
  $scope.ovhAccountsLoading = false;
  $scope.ovhAccount = {
    model: null,
    refresh: false,
    choice: null,
    list: [],
  };

  function init() {
    $scope.ovhAccountsLoading = true;

    return BillingOvhAccount.getOvhAccount()
      .then((ovhAccountList) => {
        $scope.ovhAccount.list = ovhAccountList;

        if (ovhAccountList.length) {
          const canBeCredited = find(ovhAccountList, {
            canBeCredited: true,
          });
          if (canBeCredited) {
            $scope.ovhAccount.choice = canBeCredited;
          } else {
            $scope.ovhAccount.choice = head(ovhAccountList);
          }
        } else {
          $scope.ovhAccount.model = {
            hasOvhAccount: false,
          };
        }
      })
      .catch((err) => {
        $scope.setMessage(
          $translate.instant('ovhAccount_get_accounts_error'),
          err.data,
        );
      })
      .finally(() => {
        $scope.ovhAccountsLoading = false;
      });
  }

  $scope.changeOvhAccount = function changeOvhAccount() {
    $scope.ovhAccount.model = null;
    $scope.loadOvhAccount({
      offset: 1,
    });
  };

  $scope.loadOvhAccount = function loadOvhAccount({ offset, pageSize }) {
    $scope.ovhAccountLoading = true;

    const date = BillingdateRangeSelection.dateFrom;
    const { dateTo } = BillingdateRangeSelection;
    const ovhAccount = $scope.ovhAccount.choice.ovhAccountId;

    const data = {
      count: pageSize,
      offset: offset - 1,
      date,
      dateTo,
      ovhAccount,
    };

    return BillingOvhAccount.getBillingOvhAccount(data)
      .then((account) => {
        $scope.ovhAccount.model = account;
        return {
          data: account.list.results,
          meta: {
            totalCount: account.count,
          },
        };
      })
      .catch((err) => {
        $scope.setMessage(
          $translate.instant('ovhAccount_renew_step2_error'),
          err.data,
        );
      })
      .finally(() => {
        $scope.ovhAccountLoading = false;
      });
  };

  $scope.onDateRangeChanged = function onDateRangeChanged() {
    $scope.loadOvhAccount({
      offset: 1,
    });
  };

  $scope.getPriceClasses = function getPriceClasses(price) {
    if (price >= 0) {
      return 'bold';
    }
    return 'red bold';
  };

  $scope.$on('module.billing.credit.reload', () => {
    $scope.ovhAccount.refresh = true;
  });

  $scope.refreshCredit = function refreshCredit() {
    $scope.ovhAccount.refresh = false;
    $scope.ovhAccount.model = null;
    $scope.loadOvhAccount();
  };

  $scope.setAction = function setAction(action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      $scope.stepPath = `${BILLING_BASE_URL}payment/ovhAccount/${$scope.currentAction}/billing-ovhAccount-${$scope.currentAction}.html`;

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

  $scope.resetAction = function resetAction() {
    $scope.setAction(false);
  };

  $scope.setMessage = function setMessage(message, data) {
    const msg = BillingmessageParser(message, data);
    $scope.message = msg.message;
    $scope.alertType = msg.alertType;
  };

  $scope.getDatasToExport = function getDatasToExport() {
    const datasToReturn = [
      [
        $translate.instant('ovhAccount_table_head_id'),
        $translate.instant('ovhAccount_table_head_date'),
        $translate.instant('ovhAccount_table_head_debit'),
        $translate.instant('ovhAccount_table_head_credit'),
      ],
    ];
    $scope.csvLoading = true;
    return BillingOvhAccount.getBillingOvhAccount({
      count: 0,
      offset: 0,
      date: BillingdateRangeSelection.dateFrom,
      dateTo: BillingdateRangeSelection.dateTo,
      ovhAccount: $scope.ovhAccount.choice.ovhAccountId,
    })
      .then(
        (ovhAccount) => {
          angular.forEach(ovhAccount.list.results, (bill) => {
            datasToReturn.push([
              bill.factureNumber,
              $filter('date')(bill.date, 'mediumDate'),
              bill.debit,
              bill.credit,
            ]);
          });
          return datasToReturn;
        },
        () => '',
      )
      .finally(() => {
        $scope.csvLoading = false;
      });
  };

  $scope.trackCSVExport = function trackCSVExport() {
    atInternet.trackClick({
      name: 'export_csv',
      type: 'action',
      chapter1: 'payment_types',
      chapter2: 'prepaid_account',
    });
  };

  // TODO: Pass this through resolve when controller is refactored
  $scope.askForRefund = (accountId, movementId) =>
    $state.go('app.account.billing.payment.ovhaccount.refund', {
      accountId,
      movementId,
    });

  init();
};
