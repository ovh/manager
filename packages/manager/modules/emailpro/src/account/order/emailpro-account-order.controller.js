import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import map from 'lodash/map';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  EmailPro,
  WucUser,
) => {
  // default values
  $scope.accountsToAdd = {
    duration: '12',
    accountsNumber: 1,
  };

  WucUser.getUser()
    .then(({ ovhSubsidiary }) => {
      $scope.ovhSubsidiary = ovhSubsidiary;
    })
    .catch((failure) => {
      $scope.setMessage(
        $translate.instant('emailpro_ACTION_order_accounts_step1_user_error'),
        failure.data,
      );
      $scope.ovhSubsidiary = 'FR';
    })
    .then(() => {
      $scope.showPriceWithTaxOnly = includes(['DE'], $scope.ovhSubsidiary);
    });

  $scope.valid = { legalWarning: false };
  if ($scope.worldPart === 'CA') {
    $scope.valid.legalWarning = true;
  }
  $scope.ordersList = null;
  $scope.url = null;
  $scope.previewOrder = null;

  $scope.order = function order() {
    $scope.url = null;
    $scope.previewOrder = null;
    EmailPro.orderAccounts($stateParams.productId, $scope.accountsToAdd).then(
      (data) => {
        $scope.previewOrder = data;
        $scope.url = data.url;
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_ACTION_order_accounts_step2_error_message',
          ),
          failure.data,
        );
        $scope.resetAction();
      },
    );
  };

  $scope.loadOrderList = function loadOrderList() {
    EmailPro.getOrderList($stateParams.productId).then(
      (data) => {
        $scope.ordersList = map(data, (datum) => {
          const orderAvailable = cloneDeep(datum);
          orderAvailable.unitaryMonthlyPriceWithTaxes.localizedText = EmailPro.getLocalizedPrice(
            $scope.ovhSubsidiary,
            parseFloat(orderAvailable.duration.duration) *
              orderAvailable.unitaryMonthlyPriceWithTaxes.value,
            orderAvailable.unitaryMonthlyPriceWithTaxes.currencyCode,
          );
          return orderAvailable;
        });
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_ACTION_order_accounts_step1_loading_error',
          ),
          failure.data,
        );
        $scope.resetAction();
      },
    );
  };

  $scope.getSelectedPaymentPrice = function getSelectedPaymentPrice() {
    if ($scope.ordersList) {
      const selected = $.grep(
        $scope.ordersList,
        (e) => $scope.accountsToAdd.duration === e.duration.duration,
      );
      return selected ? selected[0] : null;
    }
    return null;
  };

  $scope.isValid = function isValid() {
    return (
      $scope.ordersList &&
      $scope.accountsToAdd.accountsNumber &&
      $scope.valid.legalWarning
    );
  };

  $scope.addEmailProAccount = function addEmailProAccount() {
    $scope.resetAction();
    window.open($scope.url, '_blank');
  };
};
