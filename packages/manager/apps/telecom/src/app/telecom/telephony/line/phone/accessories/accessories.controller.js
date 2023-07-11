import assign from 'lodash/assign';

export default class TelephonyLinePhoneAccessoriesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    atInternet,
    OvhApiTelephony,
    TelephonyMediator,
    TucTelephonyAccessoriesOrderProcess,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TelephonyMediator = TelephonyMediator;
    this.TucTelephonyAccessoriesOrderProcess = TucTelephonyAccessoriesOrderProcess;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.process = null;
    this.loading = {
      init: false,
    };
    this.line = null;

    this.loading.init = true;
    return this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) => {
        this.process = this.TucTelephonyAccessoriesOrderProcess.init(
          this.billingAccount,
        );
        this.process.isRetractationAllowed =
          !this.user.isCorporation() && !this.user.isPersonalCorporation();
        this.line = group.getLine(this.serviceName);
        return this.OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: this.line.billingAccount,
            serviceName: this.line.serviceName,
          }).$promise;
      })
      .then((result) => {
        assign(
          this.line,
          { getPublicOffer: result.getPublicOffer },
          {
            isAttachedToOtherLinesPhone: result.isAttachedToOtherLinesPhone,
          },
        );
      })
      .then(() => this.line.hasPendingOfferTasks())
      .then(() => this.line.getPhone())
      .then((phone) => {
        this.phone = phone;
      })
      .catch((err) => this.TucToast.error(err))
      .finally(() => {
        this.loading.init = false;
        return this.atInternet.trackPage({
          name: 'accessories-Tel',
          type: 'navigation',
          level2: 'Telecom',
          chapter1: 'telecom',
        });
      });
  }
}
