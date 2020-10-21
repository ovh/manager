import get from 'lodash/get';
import set from 'lodash/set';
import some from 'lodash/some';
import uniq from 'lodash/uniq';

import { ALERTER_ID } from './constants';

export default class BillingPaymentMethodCtrl {
  /* @ngInject */
  constructor(
    OVH_PAYMENT_MEAN_STATUS,
    OVH_PAYMENT_METHOD_TYPE,
    ovhPaymentMethodHelper,
  ) {
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

    uniq(this.paymentMethods, 'status').forEach((paymentMethod) => {
      set(
        this.tableFilterOptions.status.values,
        paymentMethod.status,
        this.ovhPaymentMethodHelper.getPaymentMethodStatusText(
          paymentMethod.status,
        ),
      );
    });

    uniq(this.paymentMethods, 'paymentType').forEach((paymentMethod) => {
      set(
        this.tableFilterOptions.type.values,
        paymentMethod.paymentType,
        this.ovhPaymentMethodHelper.getPaymentMethodTypeText(
          paymentMethod.paymentType,
        ),
      );
    });

    // set guide url
    this.guide = get(this.guides, 'autoRenew', null);

    // set a warn message if a bankAccount is in pendingValidation state
    this.hasPendingValidationBankAccount = some(
      this.paymentMethods,
      (method) =>
        method.paymentType === this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT &&
        method.status === this.OVH_PAYMENT_MEAN_STATUS.PENDING_VALIDATION,
    );
  }

  /* -----  End of INITIALIZATION  ------ */
}
