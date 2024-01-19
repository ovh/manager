import { get } from 'lodash-es';

import { AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM } from '@ovh-ux/ovh-payment-method';
import validator from 'validator';

import AdyenService from './components/integration/component/adyen/service';

export default class OvhPaymentMethodHelperService {
  /* @ngInject */
  constructor($translate, ovhFeatureFlipping) {
    this.$translate = $translate;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.isValidIban = OvhPaymentMethodHelperService.isValidIban;
    this.isValidBic = OvhPaymentMethodHelperService.isValidBic;
  }

  /* =====================================
  =            Public methods            =
  ====================================== */

  getPaymentMethodStatusText(statusParam) {
    return this.$translate.instant(
      `ovh_payment_status_${get(
        statusParam,
        'status',
        statusParam,
      ).toLowerCase()}`,
    );
  }

  getPaymentMethodTypeText(typeParam) {
    return (
      typeParam?.type?.humanReadableName ||
      this.$translate.instant(
        `ovh_payment_type_${get(
          typeParam,
          'paymentType',
          typeParam,
        ).toLowerCase()}`,
      )
    );
  }

  hasSpecificCrossBorderSentenceForCardPayment() {
    const paymentCrossBorderFeatureId = 'payments-cross-border';
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(paymentCrossBorderFeatureId)
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable(paymentCrossBorderFeatureId),
      );
  }

  static getCallbackIntegrationTypeRelated(locationSearch) {
    if (AdyenService.hasCallbackUrlParams(locationSearch)) {
      return AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.COMPONENT;
    }

    return locationSearch.paymentMethodId != null
      ? AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.REDIRECT
      : null;
  }

  /* -----  End of Public methods  ------ */

  /* =====================================
  =            Static methods            =
  ====================================== */

  static isValidIban(ibanParam) {
    return validator.isIBAN(ibanParam);
  }

  static isValidBic(bicParam) {
    return validator.isBIC(bicParam);
  }

  /* -----  End of Static methods  ------ */
}
