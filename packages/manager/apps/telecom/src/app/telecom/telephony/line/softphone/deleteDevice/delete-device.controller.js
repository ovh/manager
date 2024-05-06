export default class DeleteDeviceController {
  /* @ngInject */
  constructor($translate, softphoneService, TucToast) {
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.softphoneService = softphoneService;
  }

  deleteDevice() {
    return this.softphoneService
      .deleteDevice(this.billingAccount, this.serviceName, this.deviceId)
      .then(() => {
        this.goBack(true).then(() =>
          this.TucToast.success(
            this.$translate.instant(
              'telephony_line_softphone_delete_device_success',
            ),
          ),
        );
      })
      .catch(({ status }) => {
        this.goBack(true).then(() =>
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_softphone_delete_device_error',
              { status },
            ),
          ),
        );
      });
  }
}
