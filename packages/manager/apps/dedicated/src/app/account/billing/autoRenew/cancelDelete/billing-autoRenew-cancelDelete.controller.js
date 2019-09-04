import pick from 'lodash/pick';
import set from 'lodash/set';

/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.cancelDelete
 * @description
 */
angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.cancelDelete', ($rootScope, $scope, $q, BillingAutoRenew, Alerter, AUTORENEW_EVENT, $translate) => {
  $scope.selectedServices = $scope.currentActionData;

  $scope.deleteRenew = function deleteRenew() {
    const result = [];
    angular.forEach($scope.selectedServices, (service) => {
      set(service, 'renew.deleteAtExpiration', false);
      result.push(pick(service, ['serviceId', 'serviceType', 'renew']));
    });
    return BillingAutoRenew.updateServices(result)
      .then(() => {
        $scope.$emit(AUTORENEW_EVENT.CANCEL_TERMINATE, result);
        Alerter.set('alert-success', $translate.instant('autorenew_service_update_step2_success'));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('autorenew_service_update_step2_error'), err);
        return $q.reject(err);
      })
      .finally(() => {
        $rootScope.$broadcast(BillingAutoRenew.events.AUTORENEW_CHANGED);
        $scope.resetAction();
      });
  };
});
