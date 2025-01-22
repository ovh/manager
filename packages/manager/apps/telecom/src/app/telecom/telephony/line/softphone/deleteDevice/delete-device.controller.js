import { SOFTPHONE_TRACKING } from '../softphone.constants';

export default class DeleteModalController {
  /* @ngInject */
  constructor($translate, softphoneService, TucToast) {
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.softphoneService = softphoneService;
    this.SOFTPHONE_TRACKING = SOFTPHONE_TRACKING;
  }

  deleteDevice() {
    this.deleting = true;
    this.softphoneService
      .deleteDevice(this.billingAccount, this.serviceName, this.deviceId)
      .then(() => {
        this.goBack(true).then(() =>
          this.TucToast.success(
            this.$translate.instant(
              `telephony_line_softphone_delete_${
                this.deviceId ? 'device' : 'all_devices'
              }_success`,
            ),
          ),
        );
      })
      .catch(({ data }) => {
        this.goBack(true).then(() =>
          this.TucToast.error(
            this.$translate.instant(
              `telephony_line_softphone_delete_${
                this.deviceId ? 'device' : 'all_devices'
              }_error`,
              { error: data?.message },
            ),
          ),
        );
      });
  }
}
