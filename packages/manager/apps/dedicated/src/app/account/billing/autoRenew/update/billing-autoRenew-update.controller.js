import head from 'lodash/head';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import set from 'lodash/set';
import some from 'lodash/some';

/**
 * @ngdoc controller
 * @name Billing.controllers.Method.Add
 * @description
 */
angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.update', [
  '$q',
  '$rootScope',
  '$scope',
  '$translate',
  'Alerter',
  'BillingAutoRenew',
  'AUTORENEW_EVENT',
  'DucUserContractService',
  function (
    $q,
    $rootScope,
    $scope,
    $translate,
    Alerter,
    AutoRenew,
    AUTORENEW_EVENT,
    DucUserContractService,
  ) {
    $scope.selectedServices = $scope.currentActionData.services;
    $scope.nicRenew = $scope.currentActionData.nicRenew;
    $scope.urlRenew = $scope.currentActionData.urlRenew;
    $scope.agree = {};

    $scope.loading = {
      contracts: false,
    };

    angular.forEach($scope.selectedServices, (service) => {
      if (service.renew.automatic) {
        set(service, 'newRenewType', 'auto');
        set(service, 'oldRenewType', 'auto');
        set(service, 'newRenewPeriod', service.renew.period);
      } else if (service.renew.forced) {
        set(service, 'newRenewType', 'auto');
        set(service, 'oldRenewType', 'auto');
        if (service.possibleRenewPeriod.length === 1) {
          set(service, 'newRenewPeriod', head(service.possibleRenewPeriod));
        }
      } else {
        set(service, 'newRenewType', 'manuel');
        set(service, 'oldRenewType', 'manuel');
        if (service.possibleRenewPeriod.length === 1) {
          set(service, 'newRenewPeriod', head(service.possibleRenewPeriod));
        }
      }
    });
    $scope.hasChanged = false;

    function hasServiceChangedToAutorenew() {
      return $scope.selectedServices.some(s => !s.renew.automatic && s.newRenewType === 'auto');
    }

    /* eslint-disable no-return-assign */
    $scope.loadContracts = () => {
      $scope.contracts = [];

      if (hasServiceChangedToAutorenew()) {
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
      }
      $scope.agree.value = true;
      return null;
    };
    /* eslint-enable no-return-assign */

    $scope.updateRenew = function () {
      const result = [];
      angular.forEach($scope.selectedServices, (service) => {
        if ($scope.hasChange(service)) {
          const hasSubProducts = !isEmpty(service.subProducts);
          const isRenewManual = service.newRenewType === 'manuel';
          const renewPeriod = isRenewManual ? null : service.newRenewPeriod;

          if (hasSubProducts) {
            angular.forEach(service.subProducts, (pService) => {
              set(pService, 'renew.period', renewPeriod);
              set(pService, 'renew.manualPayment', isRenewManual);
              result.push(pick(pService, ['serviceId', 'serviceType', 'renew']));
            });
          } else {
            set(service, 'renew.period', renewPeriod);
            set(service, 'renew.manualPayment', isRenewManual);
            result.push(pick(service, ['serviceId', 'serviceType', 'renew']));
          }
        }
      });

      let promise = DucUserContractService.acceptAgreements($scope.contracts)
        .then(() => AutoRenew.updateServices(result))
        .then(() => {
          $scope.$emit(AUTORENEW_EVENT.MODIFY, result);
          Alerter.set('alert-success', $translate.instant('autorenew_service_update_step2_success'));
        })
        .catch((err) => {
          Alerter.alertFromSWS($translate.instant('autorenew_service_update_step2_error'), err);
          return $q.reject(err);
        });

      /**
       *  turns on global autorenew when user activates a service
       */
      if (some(result, 'renew.automatic')) {
        promise = promise.then(() => AutoRenew.getAutorenew().then(({ active, renewDay }) => {
          if (active) {
            return $q.when();
          }

          return AutoRenew.putAutorenew({
            active: true,
            renewDay: renewDay > 0 && renewDay <= 30 ? renewDay : 1,
          })
            .then(() => {
              Alerter.set('alert-success', $translate.instant('autorenew_service_update_renewal_activation_notice'));
            })
            .catch((err) => {
              Alerter.set('alert-danger', $translate.instant('autorenew_service_update_renewal_activation_error', {
                t0: err,
              }));
              return $q.reject(err);
            });
        }));
      }

      promise.finally(() => $scope.closeAction());
    };

    $scope.onChange = function () {
      $scope.hasChanged = false;
      angular.forEach($scope.selectedServices, (service) => {
        if (service.renew.automatic || service.renew.forced) {
          if (service.newRenewType === 'manuel' || service.renew.period !== service.newRenewPeriod) {
            $scope.hasChanged = true;
          }
        } else if (!(service.renew.automatic || service.renew.forced) && service.newRenewType === 'auto') {
          $scope.hasChanged = true;
          if (!service.newRenewPeriod
            && isArray(service.possibleRenewPeriod)
            && !isEmpty(service.possibleRenewPeriod)) {
            set(service, 'newRenewPeriod', service.renew.period || head(service.possibleRenewPeriod));
          }
        }
      });
    };

    $scope.hasChange = function (service) {
      if (service.renew.automatic && service.newRenewType === 'manuel') {
        return true;
      }

      if (service.renew.automatic && service.newRenewPeriod !== service.renew.period) {
        return true;
      }

      if (!service.renew.automatic && service.newRenewType === 'auto') {
        return true;
      }

      return false;
    };

    $scope.getPeriodTranslation = function (period) {
      let message = '';
      switch (period) {
        case 0:
          message = $translate.instant('autorenew_service_renew_manuel');
          break;
        case 12:
          message = $translate.instant('autorenew_service_update_period_12');
          break;
        default:
          message = $translate.instant('autorenew_service_update_period_month', {
            t0: period,
          });
      }
      return message;
    };

    $scope.closeAction = function () {
      $rootScope.$broadcast(AutoRenew.events.AUTORENEW_CHANGED);
      $scope.resetAction();
    };
  },
]);
