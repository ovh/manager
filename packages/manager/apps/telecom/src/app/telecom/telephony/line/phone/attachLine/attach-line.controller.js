import assign from 'lodash/assign';
import get from 'lodash/get';

export default class TelephonyLinePhoneOrderAttachCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiTelephony,
    TelephonyMediator,
    TucIpAddress,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TelephonyMediator = TelephonyMediator;
    this.TucIpAddress = TucIpAddress;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.isLoading = true;
    this.macAddress = null;
    this.line = null;

    this.init();
  }

  init() {
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
      .catch((err) => new this.TucToastError(err))
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
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_phone_order_detach_device_success',
          ),
        );

        // Cache reset
        this.OvhApiTelephony.Line()
          .v6()
          .resetAllCache();
        this.OvhApiTelephony.Line()
          .Phone()
          .v6()
          .resetAllCache();
        this.TelephonyMediator.resetAllCache();
        this.init();
      })
      .catch((err) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_line_phone_order_detach_device_error',
            ),
            get(err, 'data.message'),
          ].join(' '),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.isDetaching = false;
      });
  }
}
