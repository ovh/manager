import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default /* @ngInject */ function XdslModemBridgeModeCtrl(
  $stateParams,
  $q,
  $translate,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
) {
  const self = this;

  this.mediator = TucPackXdslModemMediator;

  this.undo = function undo() {
    set(TucPackXdslModemMediator, 'info.isBridged', !this.isBridged);
  };

  this.changeBridgeMode = function changeBridgeMode() {
    if (isEmpty($stateParams.serviceName)) {
      return TucToast.error(
        $translate.instant('xdsl_modem_bridge_mode_an_error_ocurred'),
      );
    }
    TucPackXdslModemMediator.setTask('changeModemConfigBridgeMode');
    OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          isBridged: self.isBridged,
        },
      )
      .$promise.then((data) => {
        TucPackXdslModemMediator.disableCapabilities();
        TucPackXdslModemMediator.setTask('changeModemConfigBridgeMode');
        if (self.isBridged) {
          TucToast.success(
            $translate.instant('xdsl_modem_bridge_mode_success_validation_on'),
          );
        } else {
          TucToast.success(
            $translate.instant('xdsl_modem_bridge_mode_success_validation_off'),
          );
        }
        return data;
      })
      .catch((err) => {
        self.undo();
        TucToast.error(
          $translate.instant('xdsl_modem_bridge_mode_an_error_ocurred'),
        );
        return $q.reject(err);
      });
    return $q.when(null);
  };

  function init() {
    self.isBridged = TucPackXdslModemMediator.info.isBridged;
  }

  init();
}
