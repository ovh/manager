import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  CREDIT_PROVISIONING,
  PAYMENT_METHOD_AUTHORIZED_ENUM,
  PREFERRED_PAYMENT_METHOD_ORDER,
} from './constants';

export default class PciProjectNewPaymentMethodAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $location,
    coreConfig,
    coreURLBuilder,
    ovhPaymentMethodHelper,
  ) {
    this.$translate = $translate;
    this.$location = $location;
    this.coreConfig = coreConfig;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;

    // other attributes
    this.customerCurrency = coreConfig.getUser().currency.symbol;
    this.authorizedPaymentMethods = null;

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
      return this.$translate.instant(
        'pci_project_new_payment_method_add_credit',
      );
    }

    return this.ovhPaymentMethodHelper.getPaymentMethodTypeText(
      paymentMethodType.paymentType,
    );
  }

  getPayPalChargeAmount() {
    const uCent = 1000000; // micro cent factor -> 10^-6
    const priceInCent =
      this.creditProvisioningPlan.pricings.find(
        ({ mode }) => mode === CREDIT_PROVISIONING.PRICE_MODE,
      ).price / uCent;

    return priceInCent / 100; // To get the price in currency base
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onPaymentTypeRadioChange() {
    this.model.credit = null;
    this.model.defaultPaymentMethod = null;
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    const paymentMethodsAuthorized = map(
      this.eligibility.paymentMethodsAuthorized,
      (method) => snakeCase(method).toUpperCase(),
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

    this.authorizedPaymentMethods = registerablePaymentMethods.sort(
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

    // set payment method model
    this.preselectPaymentMethod();
  }

  preselectPaymentMethod() {
    // Preselection for redirection case (return from HiPay or Worldline)
    const paymentMethodToPreselect = this.authorizedPaymentMethods.find(
      ({ type }) => type.paymentType === this.$location.search()?.paymentType,
    );
    const defaultPaymentMethod = head(this.authorizedPaymentMethods);

    // preselect payment method
    this.model.paymentMethod = this.eligibility.isAddPaymentMethodRequired()
      ? paymentMethodToPreselect || defaultPaymentMethod
      : null;
  }

  /* -----  End of Hooks  ------ */
}
