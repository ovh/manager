import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { PACK_XDSL_MODEM } from '../pack-xdsl-modem.constant';

export default /* @ngInject */ function XdslModemMtuCtrl(
  $stateParams,
  $q,
  OvhApiXdsl,
  $translate,
  TucToast,
  TucPackXdslModemMediator,
) {
  const self = this;

  this.mediator = TucPackXdslModemMediator;

  this.undo = function undo() {
    self.mtuCurrentValueTmp = self.mtuCurrentValue;
  };

  this.changeMtuSize = function changeMtuSize() {
    if (
      isEmpty($stateParams.serviceName) ||
      !self.mtuCurrentValueTmp ||
      !TucPackXdslModemMediator.capabilities.canChangeMtu
    ) {
      self.undo();
      TucToast.error($translate.instant('xdsl_modem_mtu_an_error_ocurred'));
      return $q.reject();
    }
    TucPackXdslModemMediator.setTask('changeMTU');
    this.loading = true;
    return OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          mtuSize: self.mtuCurrentValueTmp.value,
        },
      )
      .$promise.then(() => {
        TucPackXdslModemMediator.disableCapabilities();
        self.mtuCurrentValue = self.mtuCurrentValueTmp;
        TucPackXdslModemMediator.setTask('changeMTU');
        TucToast.success($translate.instant('xdsl_modem_mtu_doing'));
      })
      .catch((err) => {
        self.undo();
        TucToast.error('xdsl_modem_mtu_an_error_ocurred');
        return $q.reject(err);
      })
      .finally(() => {
        self.loading = false;
      });
  };

  this.getDisplayValue = function getDisplayValue() {
    return TucPackXdslModemMediator.info.mtuSize
      ? TucPackXdslModemMediator.info.mtuSize
      : PACK_XDSL_MODEM.mtu.default;
  };

  const init = function init() {
    self.mtuValues = PACK_XDSL_MODEM.mtu.values;
    self.mtuCurrentValue = find(self.mtuValues, {
      value: self.getDisplayValue(),
    });
    self.undo();
  };

  init();
}
