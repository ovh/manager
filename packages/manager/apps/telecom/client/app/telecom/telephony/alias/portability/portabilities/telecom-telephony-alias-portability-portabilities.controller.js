angular.module('managerApp').controller('TelecomTelephonyAliasPortabilitiesCtrl', function ($translate, $stateParams, $q, OvhApiTelephony, TucToast) {
  const self = this;

  self.loading = {
    cancel: false,
  };

  self.serviceName = $stateParams.serviceName;

  function fetchPortability() {
    return OvhApiTelephony.Portability().v6().query({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(ids => $q.all(_.map(ids, id => OvhApiTelephony.Portability().v6().get({
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
      _.set(porta, 'steps', results.steps);
      _.set(porta, 'canBeCancelled', results.canBeCancelled.value);
      return porta;
    })))));
  }

  function groupPortaByNumbers(portabilities) {
    const numbers = [];
    _.forEach(portabilities, (porta) => {
      _.forEach(porta.numbersList, (number) => {
        numbers.push({
          number,
          portability: porta,
          lastStepDone: _.find(porta.steps.slice().reverse(), { status: 'done' }),
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
      TucToast.error([$translate.instant('telephony_alias_portabilities_load_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.isLoading = false;
    });
  }

  self.confirmCancelPortability = function (portability) {
    self.loading.cancel = true;

    return OvhApiTelephony.Portability().v6().cancel({
      billingAccount: $stateParams.billingAccount,
      id: portability.id,
    }, {}).$promise.then(() => {
      TucToast.success($translate.instant('telephony_alias_portabilities_cancel_success'));
      return init();
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_alias_portabilities_cancel_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.cancel = false;
    });
  };

  init();
});
