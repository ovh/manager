import isEmpty from 'lodash/isEmpty';

angular.module('managerApp').controller('XdslModemResetCtrl', function ($stateParams, $scope, $translate, $q, OvhApiXdsl, TucToast, TucPackXdslModemMediator) {
  this.mediator = TucPackXdslModemMediator;

  this.resetModem = function (resetOvhConfig) {
    if (isEmpty($stateParams.serviceName)) {
      return TucToast.error($translate.instant('xdsl_modem_reset_an_error_ocurred'));
    }
    TucPackXdslModemMediator.setTask('resetModem');
    OvhApiXdsl.Modem().Reset().v6().reset({
      xdslId: $stateParams.serviceName,
    }, {
      resetOvhConfig: !!resetOvhConfig,
    }).$promise.then((result) => {
      if (result.status === 'todo' || result.status === 'doing') {
        TucPackXdslModemMediator.setTask('resetModem');
      }
      TucPackXdslModemMediator.disableCapabilities();
      TucToast.success($translate.instant(resetOvhConfig
        ? 'xdsl_modem_reset_ovh_config_success'
        : 'xdsl_modem_reset_success'));
      return result;
    }).catch((err) => {
      TucToast.error($translate.instant(resetOvhConfig
        ? 'xdsl_modem_reset_ovh_config_an_error_ocurred'
        : 'xdsl_modem_reset_an_error_ocurred'));
      return $q.reject(err);
    });
    return $q.when(null);
  };

  const init = function () {
    $scope.$on('pack_xdsl_modem_task_resetModem', (event, state) => {
      if (!state) {
        TucToast.success($translate.instant('xdsl_modem_reset_success_end'));
      }
    });
  };

  init();
});
