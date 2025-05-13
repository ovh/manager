import isEmpty from 'lodash/isEmpty';

export default class XdslModemFirmwareCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    OvhApiXdsl,
    TucPackXdslModemMediator,
    TucToast,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$q = $q;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.mediator = TucPackXdslModemMediator;
  }

  undo() {
    this.firmwareTmp = this.firmware;
  }

  getFirmware() {
    return this.OvhApiXdsl.Modem()
      .Firmware()
      .v6()
      .get({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then(({ data }) => {
        this.firmware = data;
        this.firmwareTmp = this.firmware;
        return data;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('xdsl_modem_firmware_error'),
        );
        return this.$q.reject(err);
      });
  }

  getAvailableFirmware() {
    return this.OvhApiXdsl.Modem()
      .Firmware()
      .v6()
      .available({
        xdslId: this.$stateParams.serviceName,
      })
      .$promise.then((result) => {
        this.availableFirmwares = result;
        return result;
      })
      .catch(() => {
        this.availableFirmwares = [this.firmware];
      });
  }

  changeFirmware() {
    if (
      isEmpty(this.$stateParams.serviceName) ||
      !this.firmwareTmp ||
      !this.mediator.capabilities.canChangeFirmware
    ) {
      this.firmwareTmp = this.firmware;
      this.TucToast.error(
        this.$translate.instant('xdsl_modem_firmware_an_error_ocurred'),
      );
      return this.$q.reject();
    }
    this.loading = true;
    return this.OvhApiXdsl.Modem()
      .Firmware()
      .v6()
      .post(
        {
          xdslId: this.$stateParams.serviceName,
        },
        {
          firmware: this.firmwareTmp,
        },
      )
      .$promise.then((data) => {
        this.mediator.disableCapabilities();
        this.mediator.setTask('changeModemConfigFirmware');
        this.firmware = this.firmwareTmp;
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_firmware_doing'),
        );
        return data;
      })
      .catch((err) => {
        this.firmwareTmp = this.firmware;
        this.TucToast.error(
          this.$translate.instant('xdsl_modem_firmware_an_error_ocurred'),
        );
        return this.$q.reject(err);
      });
  }

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */
  $onInit() {
    this.getFirmware();
    this.getAvailableFirmware();
    this.undo();
  }

  /* -----  End of INITIALIZATION  ------*/
}
