import pick from 'lodash/pick';
import set from 'lodash/set';

/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.activation
 * @description
 */
angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.activation', [
  '$filter',
  '$q',
  '$rootScope',
  '$scope',
  '$translate',
  'Alerter',
  'BillingAutoRenew',
  'AUTORENEW_EVENT',
  'DucUserContractService',
  function BillingAutoRenewActivationController(
    $filter,
    $q,
    $rootScope,
    $scope,
    $translate,
    Alerter,
    AutoRenew,
    AUTORENEW_EVENT,
    DucUserContractService,
  ) {
    $scope.selectedServices = $scope.currentActionData;
    $scope.selectedServices[0].expirationText = $filter('date')($scope.selectedServices[0].expiration, 'mediumDate');
    $scope.agree = {};
    $scope.loading = {
      contracts: false,
    };

    $scope.disableAutoRenew = function disableAutoRenew() {
      const result = $scope.selectedServices.map((service) => {
        set(service, 'renew.manualPayment', true);
        return pick(service, ['serviceId', 'serviceType', 'renew']);
      });
      AutoRenew.updateServices(result)
        .then(() => {
          $scope.$emit(AUTORENEW_EVENT.DEACTIVATE_AUTO_PAYMENT, result);
          Alerter.set('alert-success', $translate.instant('autorenew_service_update_step2_success'));
        })
        .catch((err) => {
          Alerter.alertFromSWS($translate.instant('autorenew_service_update_step2_error'), err);
          return $q.reject(err);
        })
        .finally(() => {
          $rootScope.$broadcast(AutoRenew.events.AUTORENEW_CHANGED);
          $scope.resetAction();
        });
    };

    $scope.enableAutoRenew = function enableAutoRenew() {
      const result = $scope.selectedServices.map((service) => {
        set(service, 'renew.manualPayment', false);
        set(service, 'renew.automatic', true);
        set(service, 'renew.deleteAtExpiration', false);
        return pick(service, ['serviceId', 'serviceType', 'renew']);
      });
      return DucUserContractService.acceptAgreements($scope.contracts)
        .then(() => AutoRenew.updateServices(result))
        .then(() => {
          $scope.$emit(AUTORENEW_EVENT.ACTIVATE_AUTO_PAYMENT, result);
          Alerter.set('alert-success', $translate.instant('autorenew_service_update_step2_success'));
        })
        .catch((err) => {
          Alerter.alertFromSWS($translate.instant('autorenew_service_update_step2_error'), err);
          return $q.reject(err);
        })
        .finally(() => {
          $rootScope.$broadcast(AutoRenew.events.AUTORENEW_CHANGED);
          $scope.resetAction();
        });
    };

    /* eslint-disable no-return-assign */
    $scope.loadContracts = () => {
      $scope.contracts = [];

      $scope.loading.contracts = true;

      return DucUserContractService
        .getAgreementsToValidate(contract => AutoRenew.getAutorenewContractIds()
          .includes(contract.contractId))
        .then(
          contracts => ($scope.contracts = contracts.map(a => ({
            name: a.code,
            url: a.pdf,
            id: a.id,
          }))),
        )
        .catch((err) => {
          Alerter.set('alert-danger', $translate.instant('autorenew_service_update_step2_error'));
          return $q.reject(err);
        })
        .finally(() => {
          $scope.loading.contracts = false;
          if ($scope.contracts.length === 0) {
            $scope.agree.value = true;
          }
        });
    };
    /* eslint-enable no-return-assign */
  },
]);
