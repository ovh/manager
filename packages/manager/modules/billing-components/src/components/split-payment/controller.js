export default class BillingPaymentMethodSplitPaymentCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getFormattedStatus(status, tagStatusEnum) {
    switch (status) {
      case tagStatusEnum.CREATED:
        return this.$translate.instant(
          'billing_payment_method_split_payment_active',
        );
      case tagStatusEnum.REFUSED:
      case tagStatusEnum.DELETED:
        return this.$translate.instant(
          'billing_payment_method_split_payment_inactive',
        );
      case tagStatusEnum.CREATING:
      case tagStatusEnum.MODERATING:
      case tagStatusEnum.WAIT_MODERATION:
        return this.$translate.instant(
          'billing_payment_method_split_payment_activating',
        );
      case tagStatusEnum.DELETING:
      case tagStatusEnum.REFUSING:
      case tagStatusEnum.REVOCATING:
      case tagStatusEnum.WAIT_REVOCATION:
        return this.$translate.instant(
          'billing_payment_method_split_payment_deactivating',
        );
      default:
        return this.$translate.instant(
          'billing_payment_method_split_payment_inactive',
        );
    }
  }
}
