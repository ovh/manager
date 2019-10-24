import { ALERTER_ID } from './constants';

export default class BillingPaymentMethodCtrl {
  /* @ngInject */
  constructor(OVH_PAYMENT_MEAN_STATUS, OVH_PAYMENT_METHOD_TYPE, ovhPaymentMethodHelper) {
    this.OVH_PAYMENT_MEAN_STATUS = OVH_PAYMENT_MEAN_STATUS;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;

    // other attributes used in views
    this.ALERTER_ID = ALERTER_ID;
    this.tableFilterOptions = null;
    this.guide = null;
    this.hasPendingValidationBankAccount = false;
  }

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    // set options for status filter
    this.tableFilterOptions = {
      status: {
        values: {},
      },
      type: {
        values: {},
      },
    };

    _.uniq(this.paymentMethods, 'status').forEach((paymentMethod) => {
      _.set(
        this.tableFilterOptions.status.values,
        paymentMethod.status,
        this.ovhPaymentMethodHelper.getPaymentMethodStatusText(paymentMethod.status),
      );
    });

    _.uniq(this.paymentMethods, 'paymentType').forEach((paymentMethod) => {
      _.set(
        this.tableFilterOptions.type.values,
        paymentMethod.paymentType,
        this.ovhPaymentMethodHelper.getPaymentMethodTypeText(paymentMethod.paymentType),
      );
    });

    // set guide url
    this.guide = _.get(this.guides, 'autoRenew', null);

    // set a warn message if a bankAccount is in pendingValidation state
    this.hasPendingValidationBankAccount = _.some(
      this.paymentMethods,
      method => method.paymentType === this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT
          && method.status === this.OVH_PAYMENT_MEAN_STATUS.PENDING_VALIDATION,
    );
  }

  /* -----  End of INITIALIZATION  ------ */
}
