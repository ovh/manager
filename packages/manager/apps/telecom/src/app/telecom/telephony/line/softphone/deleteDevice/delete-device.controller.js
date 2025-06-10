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
      .deleteDevice(this.billingAccount, this.serviceName)
      .then(() => {
        this.goBack(true).then(() =>
          this.TucToast.success(
            this.$translate.instant(
              'telephony_line_softphone_delete_all_devices_success',
            ),
          ),
        );
      })
      .catch(({ data }) => {
        this.goBack(true).then(() =>
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_softphone_delete_all_devices_error',
              { error: data?.message },
            ),
          ),
        );
      });
  }
}
