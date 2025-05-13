import assign from 'lodash/assign';

export default class TelephonyLinePhoneOrderAttachCtrl {
  /* @ngInject */
  constructor(OvhApiTelephony, TelephonyMediator, TucToastError) {
    this.OvhApiTelephony = OvhApiTelephony;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.macAddress = null;
    this.line = null;

    return this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) => {
        this.line = group.getLine(this.serviceName);
      })
      .then(() =>
        this.OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: this.line.billingAccount,
            serviceName: this.line.serviceName,
          })
          .$promise.then((result) => {
            assign(this.line, {
              isAttachedToOtherLinesPhone: result.isAttachedToOtherLinesPhone,
            });
          }),
      )
      .then((phone) => {
        this.phone = phone;
      })
      .catch((err) => new this.TucToastError(err));
  }
}
