import { BILLING_BASE_URL } from './constants/billing.constants';

export default /* @ngInject */ ($scope, $location, $filter, $timeout) => {
  $scope.BILLING_BASE_URL = BILLING_BASE_URL;
  $scope.pageSizeAvailables = [10, 20, 50];

  $scope.originUrl =
    $location.search().redirectTo || $location.search().redirectto || '#/';

  $scope.today = new Date();
  $scope.firstDayOfMonth = +new Date(
    $scope.today.getFullYear(),
    $scope.today.getMonth(),
    1,
  );

  $scope.isCurrentMonth = function isCurrentMonth(date) {
    return (
      +new Date(date.getFullYear(), date.getMonth(), 1) ===
      $scope.firstDayOfMonth
    );
  };

  $scope.getDateFormatted = function getDateFormatted(date, type) {
    return $filter('date')(date, type);
  };

  $scope.getDayDateFormatted = function getDayDateFormatted(date) {
    return $filter('date')(date, 'dd');
  };

  $scope.setAction = function setAction(
    action,
    data,
    viewName,
    strictPath = false,
  ) {
    $scope.currentAction = action;
    $scope.currentActionData = data;

    if ($scope.currentAction) {
      $scope.stepPath = strictPath
        ? `billing/autoRenew/${action}.html`
        : `${BILLING_BASE_URL}${viewName}/${action}/billing-${viewName}-${action}.html`;

      $('#currentAction').modal({
        keyboard: false,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');

      $timeout(() => {
        delete $scope.stepPath;
      }, 300);
    }
  };

  $scope.resetAction = function resetAction() {
    $scope.setAction();
  };
};
