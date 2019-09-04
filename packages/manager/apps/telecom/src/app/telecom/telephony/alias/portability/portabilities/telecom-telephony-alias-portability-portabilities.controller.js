import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

angular.module('managerApp').controller('TelecomTelephonyAliasPortabilitiesCtrl', function TelecomTelephonyAliasPortabilitiesCtrl($translate, $stateParams, $q, OvhApiTelephony, TucToast) {
  const self = this;

  self.loading = {
    cancel: false,
  };

  self.serviceName = $stateParams.serviceName;

  function fetchPortability() {
    return OvhApiTelephony.Portability().v6().query({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(ids => $q.all(map(ids, id => OvhApiTelephony.Portability().v6().get({
      billingAccount: $stateParams.billingAccount,
      id,
    }).$promise.then(porta => $q.all({
      steps: OvhApiTelephony.Portability().v6().getStatus({
        billingAccount: $stateParams.billingAccount,
        id,
      }).$promise,
      canBeCancelled: OvhApiTelephony.Portability().v6().canBeCancelled({
        billingAccount: $stateParams.billingAccount,
        id,
      }).$promise,
    }).then((results) => {
      set(porta, 'steps', results.steps);
      set(porta, 'canBeCancelled', results.canBeCancelled.value);
      return porta;
    })))));
  }

  function groupPortaByNumbers(portabilities) {
    const numbers = [];
    forEach(portabilities, (porta) => {
      forEach(porta.numbersList, (number) => {
        numbers.push({
          number,
          portability: porta,
          lastStepDone: find(porta.steps.slice().reverse(), { status: 'done' }),
        });
      });
    });
    return numbers;
  }

  function init() {
    self.isLoading = true;
    fetchPortability().then((result) => {
      self.numbers = groupPortaByNumbers(result);
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_alias_portabilities_load_error'), get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.isLoading = false;
    });
  }

  self.confirmCancelPortability = function confirmCancelPortability(portability) {
    self.loading.cancel = true;

    return OvhApiTelephony.Portability().v6().cancel({
      billingAccount: $stateParams.billingAccount,
      id: portability.id,
    }, {}).$promise.then(() => {
      TucToast.success($translate.instant('telephony_alias_portabilities_cancel_success'));
      return init();
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_alias_portabilities_cancel_error'), get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.cancel = false;
    });
  };

  init();
});
