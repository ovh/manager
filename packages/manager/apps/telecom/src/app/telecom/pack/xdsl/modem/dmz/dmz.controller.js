import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default /* @ngInject */ function XdslModemDmzCtrl(
  $stateParams,
  $translate,
  $q,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
  tucValidator,
) {
  const self = this;

  this.editing = false;
  this.validator = tucValidator;
  this.mediator = TucPackXdslModemMediator;

  this.cancel = function cancel() {
    this.editing = false;
  };

  this.changeDmz = function changeDmz() {
    this.editing = false;
    const validIp = self.dmz === null || this.validator.isIP(self.dmz);
    if (
      isEmpty($stateParams.serviceName) ||
      !TucPackXdslModemMediator.capabilities.canChangeDMZ ||
      !validIp
    ) {
      TucToast.error($translate.instant('xdsl_modem_dmz_an_error_ocurred'));
      return $q.reject();
    }
    return OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          dmzIP: self.dmz,
        },
      )
      .$promise.then((data) => {
        TucPackXdslModemMediator.disableCapabilities();
        TucPackXdslModemMediator.setTask('changeModemConfigDMZ');
        set(TucPackXdslModemMediator, 'info.dmzIP', self.dmz);
        TucToast.success($translate.instant('xdsl_modem_dmz_doing'));
        return data;
      })
      .catch((err) => {
        TucToast.error($translate.instant('xdsl_modem_dmz_an_error_ocurred'));
        return $q.reject(err);
      });
  };

  this.setEditMode = function setEditMode() {
    this.editing = true;
    this.dmz = TucPackXdslModemMediator.info.dmzIP;
  };

  this.delete = function deleteFunction() {
    this.dmz = null;
    this.changeDmz();
  };

  const init = function init() {
    return OvhApiXdsl.Modem()
      .Lan()
      .Aapi()
      .getLanDetails({
        xdslId: $stateParams.serviceName,
      })
      .$promise.then((data) => {
        self.modemLan = find(data, { lanName: 'defaultLAN' });
        return data;
      })
      .catch((err) => {
        TucToast.error($translate.instant('xdsl_modem_dmz_an_error_ocurred'));
        return $q.reject(err);
      });
  };

  init();
}
