export default class TelephonyLinePhoneOrderDetachCtrl {
  /* @ngInject */
  constructor($translate, OvhApiTelephony, TelephonyMediator, TucToast) {
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.isLoading = true;
    this.isDetached = false;
    this.line = null;

    return this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) =>
        group
          .getLine(this.serviceName)
          .getPhone()
          .then((data) => {
            this.phone = data;
          }),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  detachPhone() {
    this.isDetaching = true;
    this.OvhApiTelephony.Line()
      .v6()
      .dissociateDevice(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        {
          ipAddress: this.attachedPhoneIpAddress,
          macAddress: this.phone.macAddress,
        },
      )
      .$promise.then(() => {
        this.isDetached = true;
        // Cache reset
        this.OvhApiTelephony.Line()
          .v6()
          .resetAllCache();
        this.OvhApiTelephony.Line()
          .Phone()
          .v6()
          .resetAllCache();
        this.TelephonyMediator.resetAllCache();

        this.goBack(
          this.$translate.instant(
            'telephony_line_phone_order_detach_device_success',
          ),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_line_phone_order_detach_device_error',
            ),
            err.data?.message,
          ].join(' '),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.isDetaching = false;
      });
  }
}
