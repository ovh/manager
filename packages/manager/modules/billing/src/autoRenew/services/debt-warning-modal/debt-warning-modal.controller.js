export default class DebtWarningModal {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  getReason(service) {
    const reasons = [];

    if (service) {
      const user = this.coreConfig.getUser();
      const userHasBillingRights =
        service.hasBillingRights(user.nichandle) ||
        service.hasBillingRights(user.auth.account);

      if (!userHasBillingRights) {
        reasons.push(
          this.$translate.instant(
            'billing_autorenew_service_modal_debt_warning_userHasBillingRights_reason',
            { contactBilling: service.contactBilling },
          ),
        );
      }
    }

    return reasons;
  }
}
