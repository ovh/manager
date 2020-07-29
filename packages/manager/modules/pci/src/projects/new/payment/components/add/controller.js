import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  PAYMENT_METHOD_AUTHORIZED_ENUM,
  PREFERRED_PAYMENT_METHOD_ORDER,
} from './constants';

import { PCI_REDIRECT_URLS } from '../../../../../constants';

export default class PciProjectNewPaymentMethodAddCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, ovhPaymentMethodHelper) {
    this.$translate = $translate;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;

    // other attributes
    this.authorizedPaymentMethods = null;

    this.paymentSectionHref = get(
      PCI_REDIRECT_URLS,
      `${coreConfig.getRegion()}.paymentMethodAdd`,
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
    this.model.paymentMethod = this.eligibility.isAddPaymentMethodRequired()
      ? head(this.authorizedPaymentMethods)
      : null;
  }

  /* -----  End of Hooks  ------ */
}
