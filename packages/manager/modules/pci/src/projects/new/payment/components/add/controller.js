import angular from 'angular';

import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import { AvailablePaymentMethod } from '@ovh-ux/ovh-payment-method';

import {
  CREDIT_PROVISIONING,
  PAYMENT_METHOD_AUTHORIZED_ENUM,
  PREFERRED_PAYMENT_METHOD_ORDER,
  PCI_FEATURES,
  CONFIRM_CREDIT_CARD_TEST_AMOUNT,
  LANGUAGE_OVERRIDE,
  PAYMENTS_PER_LINE,
} from './constants';

export default class PciProjectNewPaymentMethodAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $location,
    coreConfig,
    coreURLBuilder,
    ovhPaymentMethodHelper,
    OVH_PAYMENT_METHOD_TYPE,
  ) {
    this.$translate = $translate;
    this.$location = $location;
    this.coreConfig = coreConfig;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;

    const { currency, ovhSubsidiary } = this.coreConfig.getUser();
    this.registrationCharges = new Intl.NumberFormat(
      LANGUAGE_OVERRIDE[ovhSubsidiary]
        ? LANGUAGE_OVERRIDE[ovhSubsidiary]
        : ovhSubsidiary.toLowerCase(),
      {
        style: 'currency',
        currency: currency.code,
      },
    ).format(CONFIRM_CREDIT_CARD_TEST_AMOUNT);

    this.PCI_FEATURES = PCI_FEATURES;

    // other attributes

    this.authorizedPaymentMethods = null;
    this.excludedPaymentMethods = [];
    this.unregisteredPaymentMethods = [];
    this.paymentsPerLine = PAYMENTS_PER_LINE;

    this.paymentSectionHref = coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method/add',
    );

    this.defaultExplanationTextsOptions = {
      creditCard: 'info',
      rupay: 'info',
      sepa: { intro: 'warning', banner: 'info' },
    };
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

  isAuthorizedToUseSepaDirectDebit(authorizedPaymentMethod) {
    const SEPA_DIRECT_DEBIT = 'SEPA_DIRECT_DEBIT';
    const isSepaDirectDebitMethod =
      authorizedPaymentMethod.paymentType === SEPA_DIRECT_DEBIT;

    return (
      !isSepaDirectDebitMethod ||
      (isSepaDirectDebitMethod &&
        this.pciFeatures.isFeatureAvailable(
          PCI_FEATURES.PROJECT.PAYEMENT_SEPA_DIRECT_DEBIT,
        ))
    );
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onPaymentTypeRadioChange() {
    this.model.credit = null;
    this.model.defaultPaymentMethod = null;
    this.model.reloadHandleByComponent = null;
  }

  /* -----  End of Events  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.user = this.coreConfig.getUser();
    this.customerCurrency = this.user.currency.symbol;
    const paymentMethodsAuthorized = map(
      this.eligibility.paymentMethodsAuthorized,
      (method) => snakeCase(method).toUpperCase(),
    );
    const registerablePaymentMethods = filter(
      this.registerablePaymentMethods,
      (methodType) => paymentMethodsAuthorized.includes(methodType.paymentType),
    );
    this.excludedPaymentMethods = filter(
      this.registerablePaymentMethods,
      (methodType) =>
        !paymentMethodsAuthorized.includes(methodType.paymentType),
    ).map((methodType) => methodType.paymentType);

    if (
      paymentMethodsAuthorized.includes(
        PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT.toUpperCase(),
      )
    ) {
      const creditAvailablePaymentMethod = new AvailablePaymentMethod({
        paymentType: PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT.toUpperCase(),
        integration: 'NONE',
        registerable: false,
        icon: { className: 'oui-icon oui-icon-add' },
        humanReadableName: this.$translate.instant(
          'pci_project_new_payment_method_add_credit',
        ),
      });
      registerablePaymentMethods.push(creditAvailablePaymentMethod);
      this.unregisteredPaymentMethods.push(creditAvailablePaymentMethod);
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

    const { paymentsPerLine: paymentsPerLineViewOption } =
      this.viewOptions || {};
    if (paymentsPerLineViewOption) {
      this.paymentsPerLine = angular.isFunction(paymentsPerLineViewOption)
        ? paymentsPerLineViewOption(this.authorizedPaymentMethods)
        : paymentsPerLineViewOption;
    }

    // set payment method model
    this.preselectPaymentMethod();

    if (
      !this.pciFeatures.isFeatureAvailable(
        PCI_FEATURES.PROJECT.PAYEMENT_SEPA_DIRECT_DEBIT,
      )
    ) {
      this.excludedPaymentMethods.push(
        this.OVH_PAYMENT_METHOD_TYPE.SEPA_DIRECT_DEBIT,
      );
    }

    return this.ovhPaymentMethodHelper
      .hasSpecificCrossBorderSentenceForCardPayment()
      .then((hasSpecificCrossBorderSentenceForCardPayment) => {
        // display or not the specific cross border sentence for given subsidiaries
        this.hasSpecificCrossBorderSentenceForCardPayment = hasSpecificCrossBorderSentenceForCardPayment;
      });
  }

  showSpecificCrossBorderSentenceForCardPayment() {
    return (
      this.hasSpecificCrossBorderSentenceForCardPayment &&
      this.model.paymentMethod?.type?.isCreditCard()
    );
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
