import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default class XdslModemAcsBackendCtrl {
  /* @ngInject */
  constructor($translate, OvhApiXdsl, TucPackXdslModemMediator, TucToast) {
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
    this.mediator = TucPackXdslModemMediator;
    this.TucToast = TucToast;
  }

  $onInit() {
    return this.getAvailableAcsBackend();
  }

  getAvailableAcsBackend() {
    return this.OvhApiXdsl.Modem()
      .AvailableACSBackend()
      .v6()
      .get({ xdslId: this.serviceName })
      .$promise.then((result) => {
        this.availableAcsList = result;
        this.acsBackendTmp = this.mediator.info.acsBackend;
        this.acsBackend = this.acsBackendTmp;
        return result;
      })
      .catch(() => {
        this.availableAcsList = [this.mediator.info.acsBackend];
      });
  }

  undo() {
    set(this.mediator, 'info.acsBackend', !this.acsBackend);
  }

  changeAcsBackend() {
    if (
      isEmpty(this.serviceName) ||
      !this.acsBackendTmp ||
      !this.mediator.capabilities.canChangeACS
    ) {
      this.acsBackendTmp = this.acsBackend;
      this.TucToast.error(
        this.$translate.instant('xdsl_modem_acs_an_error_ocurred'),
      );
      return this.$q.reject();
    }
    this.loading = true;
    return this.OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: this.serviceName,
        },
        {
          acsBackend: this.acsBackendTmp,
        },
      )
      .$promise.then((data) => {
        this.mediator.disableCapabilities();
        this.mediator.setTask('changeACSBackend');
        this.acsBackend = this.acsBackendTmp;
        this.TucToast.success(
          this.$translate.instant('xdsl_modem_acs_backend_doing'),
        );
        return data;
      })
      .catch((err) => {
        this.acsBackendTmp = this.acsBackend;
        this.undo();
        this.TucToast.error(
          this.$translate.instant('xdsl_modem_acs_backend_an_error_ocurred'),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
