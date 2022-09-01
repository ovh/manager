export default class TelephonyPortabilitiesCancelCtrl {
  /* @ngInject */
  constructor($translate, TelephonyPortabilitiesService) {
    this.$translate = $translate;
    this.TelephonyPortabilitiesService = TelephonyPortabilitiesService;
    this.isCancelling = false;
  }

  cancelPortability() {
    this.isCancelling = true;

    return this.TelephonyPortabilitiesService.cancelPortability(
      this.billingAccount,
      this.portabilityId,
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'telephony_alias_portabilities_cancel_success',
          ),
        );
      })
      .catch(() => {
        return this.goBack(
          this.$translate.instant('telephony_alias_portabilities_cancel_error'),
          'error',
        );
      })
      .finally(() => {
        this.isCancelling = false;
      });
  }
}
