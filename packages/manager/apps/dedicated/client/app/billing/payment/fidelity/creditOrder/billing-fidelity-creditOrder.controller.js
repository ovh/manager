import { CREDIT } from '../../../constants/fidelityEvent.constants';

export default /* @ngInject */ (
  $scope,
  $translate,
  atInternet,
  BillingFidelity,
) => {
  $scope.creditOrder = {
    amount: 1000,
    account: null,
    BC: null,
    loading: false,
    erreurMin: false,
    erreurMax: false,
    erreurFormat: false,
    min: 1000,
    max: 1500000,
  };

  function getFidelityAccount() {
    $scope.creditOrder.loading = true;

    BillingFidelity.getFidelityAccount()
      .then(
        (fidelityAccount) => {
          $scope.creditOrder.account = fidelityAccount;
        },
        (data) => {
          $scope.setMessage(
            $translate.instant('fidelity_get_accounts_error'),
            data.data,
          );
        },
      )
      .finally(() => {
        $scope.creditOrder.loading = false;
      });
  }

  function isAmount(val) {
    if (val && /^[0-9]+$/.test(val)) {
      return val;
    }
    return false;
  }

  function init() {
    getFidelityAccount();
  }

  $scope.getBC = function getBC() {
    $scope.creditOrder.loading = true;
    $scope.creditOrder.BC = null;

    const amount = isAmount($scope.creditOrder.amount);
    if (amount) {
      BillingFidelity.creditOrder(amount).then(
        (data) => {
          $scope.$emit(CREDIT);
          $scope.creditOrder.BC = data;
          $scope.creditOrder.loading = false;
        },
        (data) => {
          $scope.creditOrder.loading = false;
          $scope.resetAction();
          $scope.setMessage(
            $translate.instant('fidelity_creditOrder_step2_error'),
            data.data,
          );
        },
      );
    }
  };

  $scope.displayBC = function displayBC() {
    $scope.resetAction();
    $scope.setMessage(
      $translate.instant('fidelity_creditOrder_step2_success', {
        t0: $scope.creditOrder.BC.url,
        t1: $scope.creditOrder.BC.orderId,
      }),
    );
    window.open($scope.creditOrder.BC.url, '_blank');

    atInternet.trackClick({
      name: 'validation_credit_loyalty_account',
      type: 'action',
      chapter1: 'loyalty_account',
    });
  };

  $scope.checkAmount = function checkAmount() {
    let oldBalance;
    let balance;

    if ($scope.creditOrder.amount === '') {
      $scope.creditOrder.erreurMin = false;
      $scope.creditOrder.erreurMax = false;
      $scope.creditOrder.erreurFormat = false;
      return;
    }

    const amount = isAmount($scope.creditOrder.amount);
    if (amount) {
      $scope.creditOrder.erreurFormat = false;

      oldBalance = $scope.creditOrder.account.balance;
      balance = $scope.creditOrder.account.balance + amount;

      if (amount > $scope.creditOrder.max) {
        $scope.creditOrder.erreurMax = true;
      } else {
        $scope.creditOrder.erreurMax = false;
      }

      if (oldBalance >= 0 && amount < $scope.creditOrder.min) {
        $scope.creditOrder.erreurMin = true;
      } else if (
        oldBalance < 0 &&
        (balance < 0 || amount < $scope.creditOrder.min)
      ) {
        $scope.creditOrder.erreurMin = true;
      } else {
        $scope.creditOrder.erreurMin = false;
      }
    } else {
      $scope.creditOrder.erreurFormat = true;
      $scope.creditOrder.erreurMin = false;
      $scope.creditOrder.erreurMax = false;
    }
  };

  $scope.renewStepValidator = function renewStepValidator() {
    return !(
      $scope.creditOrder.erreurMin ||
      $scope.creditOrder.erreurMax ||
      $scope.creditOrder.erreurFormat ||
      !$scope.creditOrder.amount
    );
  };

  init();
};
