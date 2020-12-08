import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslModemRebootCtrl(
  $stateParams,
  $scope,
  $translate,
  $q,
  OvhApiXdsl,
  TucPackXdslModemMediator,
  TucToast,
) {
  this.mediator = TucPackXdslModemMediator;

  this.rebootModem = function rebootModem() {
    if (isEmpty($stateParams.serviceName)) {
      return TucToast.error(
        $translate.instant('xdsl_modem_reboot_an_error_ocurred'),
      );
    }
    TucPackXdslModemMediator.setTask('rebootModem');
    OvhApiXdsl.Modem()
      .Reboot()
      .v6()
      .save(
        {
          xdslId: $stateParams.serviceName,
        },
        null,
      )
      .$promise.then((result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          TucPackXdslModemMediator.setTask('rebootModem');
        }
        TucPackXdslModemMediator.disableCapabilities();
        TucToast.success($translate.instant('xdsl_modem_reboot_success'));
        return result;
      })
      .catch((err) => {
        TucToast.error(
          $translate.instant('xdsl_modem_reboot_an_error_ocurred'),
        );
        return $q.reject(err);
      });
    return $q.when(null);
  };

  const init = function init() {
    $scope.$on('pack_xdsl_modem_task_rebootModem', (event, state) => {
      if (!state) {
        TucToast.success($translate.instant('xdsl_modem_reboot_success_end'));
      }
    });
  };

  init();
}
