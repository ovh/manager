import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  PAYMENT_METHOD_AUTHORIZED_ENUM,
  PREFERRED_PAYMENT_METHOD_ORDER,
} from './constants';

export default class PciProjectNewPaymentRegisterCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, coreURLBuilder, ovhPaymentMethodHelper) {
    this.$translate = $translate;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;

    // other attributes
    this.authorizedPaymentMethods = {
      chunks: null,
      list: null,
    };

    this.paymentSectionHref = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method/add',
    );
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  getPaymentMethodTypeText(paymentMethodType) {
    if (
      paymentMethodType.paymentType ===
      PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT.toUpperCase()
    ) {
      return this.$translate.instant('pci_project_new_payment_register_credit');
    }

    return this.ovhPaymentMethodHelper.getPaymentMethodTypeText(
      paymentMethodType.paymentType,
    );
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onPaymentTypeRadioChange() {
    this.model.credit = null;
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    let { paymentMethodsAuthorized } = this.eligibility;
    paymentMethodsAuthorized = map(paymentMethodsAuthorized, (method) =>
      snakeCase(method).toUpperCase(),
    );
    const registerablePaymentMethods = filter(
      this.registerablePaymentMethods,
      (methodType) => paymentMethodsAuthorized.includes(methodType.paymentType),
    );

    if (
      paymentMethodsAuthorized.includes(
        PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT.toUpperCase(),
      )
    ) {
      const PaymentMethodType = head(this.registerablePaymentMethods)
        .constructor;
      registerablePaymentMethods.push(
        new PaymentMethodType({
          paymentType: PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT.toUpperCase(),
          integration: 'NONE',
        }),
      );
    }

    const mappedPreferredMethodOrder = map(
      PREFERRED_PAYMENT_METHOD_ORDER,
      (paymentType) => snakeCase(paymentType).toUpperCase(),
    );

    this.authorizedPaymentMethods.list = registerablePaymentMethods.sort(
      (methodA, methodB) => {
        const methodAIndex = mappedPreferredMethodOrder.indexOf(
          methodA.paymentType,
        );
        const methodBIndex = mappedPreferredMethodOrder.indexOf(
          methodB.paymentType,
        );
        return methodAIndex - methodBIndex;
      },
    );

    this.authorizedPaymentMethods.chunks = chunk(
      this.authorizedPaymentMethods.list,
      2,
    );

    // set payment method model
    this.model.paymentMethod = this.eligibility.isAddPaymentMethodRequired()
      ? head(this.authorizedPaymentMethods.list)
      : null;
  }

  /* -----  End of Hooks  ------ */
}
