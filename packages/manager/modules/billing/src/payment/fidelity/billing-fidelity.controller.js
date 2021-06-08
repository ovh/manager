export default /* @ngInject */ (
  $scope,
  $filter,
  $timeout,
  $translate,
  BillingFidelity,
  BillingmessageParser,
  BillingdateRangeSelection,
  coreConfig,
) => {
  $scope.fidelityLoading = false;
  $scope.fidelityAccountLoading = false;
  $scope.fidelityAccount = null;
  $scope.currency = null;

  function getItems() {
    $scope.fidelityLoading = true;

    BillingFidelity.getMovements(
      BillingdateRangeSelection.dateFrom,
      BillingdateRangeSelection.dateTo,
    )
      .then((movements) => {
        $scope.tasksId = movements.reverse();
      })
      .catch((data) => {
        $scope.setMessage(
          $translate.instant('fidelity_get_movements_error'),
          data.data,
        );
        $scope.loaders.tasks = false;
      })
      .finally(() => {
        $scope.fidelityLoading = false;
      });
  }
  $scope.onDateRangeChanged = function onDateRangeChanged() {
    getItems();
  };

  $scope.setMessage = function setMessage(message, data) {
    const msg = BillingmessageParser(message, data);
    $scope.message = msg.message;
    $scope.alertType = msg.alertType;
  };

  // Set items count by page
  $scope.itemsPerPage = 10;
  $scope.tasksId = [];
  $scope.tasksDetails = [];

  $scope.loaders = {
    tasks: true,
  };

  /*
   * if you want transform item must return transformated item
   * item is the current item to transform
   */
  $scope.transformItem = function transformItem(item) {
    return BillingFidelity.getMovementsDetails(item);
  };

  /*
   * call when a item of current page is transformed
   * taskDetails contains the transformated items
   */
  $scope.onTransformItemNotify = function onTransformItemNotify(taskDetails) {
    $scope.tasksDetails.push(taskDetails);
  };

  /*
   * call when all item of current page are transformed
   * tasksDetails contains transformated item
   */
  $scope.onTransformItemDone = function onTransformItemDone() {
    $scope.loaders.tasks = false;
  };

  $scope.getLastUpdate = function getLastUpdate(format) {
    if ($scope.fidelityAccount) {
      return $filter('date')($scope.fidelityAccount.lastUpdate, format);
    }
    return '';
  };

  $scope.setAction = function setAction(action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      $scope.stepPath = `billing/payment/fidelity/${$scope.currentAction}/billing-fidelity-${$scope.currentAction}.html`;

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

  /**
   * initialisation
   */
  function getFidelityAccount() {
    $scope.fidelityAccountLoading = true;
    return BillingFidelity.getFidelityAccount()
      .then((fidelityAccount) => {
        $scope.fidelityAccount = fidelityAccount;
        getItems();
      })
      .catch((data) => {
        if (data.status !== 404) {
          $scope.setMessage(
            $translate.instant('fidelity_get_accounts_error'),
            data.data,
          );
        } else {
          $scope.fidelityAccount = null;
        }
      })
      .finally(() => {
        $scope.fidelityAccountLoading = false;
      });
  }

  function init() {
    getFidelityAccount();
    $scope.currency = coreConfig.getUser().currency;
  }

  init();
};
