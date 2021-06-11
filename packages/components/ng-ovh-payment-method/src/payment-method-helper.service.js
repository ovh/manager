import { get } from 'lodash-es';

import { AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM } from '@ovh-ux/ovh-payment-method';

import { IBAN_BIC_RULES } from './payment-method.constants';

import AdyenService from './components/integration/component/adyen/service';

export default class OvhPaymentMethodHelperService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;

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
    return this.$translate.instant(
      `ovh_payment_type_${get(
        typeParam,
        'paymentType',
        typeParam,
      ).toLowerCase()}`,
    );
  }

  static getCallbackIntegrationTypeRelated(locationSearch) {
    return AdyenService.hasCallbackUrlParams(locationSearch)
      ? AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.COMPONENT
      : AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM.REDIRECT;
  }

  /* -----  End of Public methods  ------ */

  /* =====================================
  =            Static methods            =
  ====================================== */

  static isValidIban(ibanParam) {
    let iban = ibanParam;

    const ibanValidationModulo = IBAN_BIC_RULES.IBAN_VALIDATION_MODULO;
    const countryBaseRegExp = IBAN_BIC_RULES.COUNTRY_BASE_REGEXP;
    const ibanRegExp = new RegExp(IBAN_BIC_RULES.IBAN_REGEXP);

    if (!iban) {
      return false;
    }

    iban = iban.replace(/\s/g, '').toUpperCase();
    const ibanTab = ibanRegExp.exec(iban);
    if (!ibanTab) {
      return false;
    }

    const ibanHash = {
      country: ibanTab[1],
      key: ibanTab[2],
      remaining: ibanTab[3],
    };

    if (
      !Object.prototype.hasOwnProperty.call(countryBaseRegExp, ibanHash.country)
    ) {
      return false;
    }

    const baseRegExp = get(countryBaseRegExp, ibanHash.country);
    if (!baseRegExp.test(ibanHash.remaining)) {
      return false;
    }

    const checkString = [
      ibanHash.remaining,
      ibanHash.country,
      ibanHash.key,
    ].join('');

    let numericIbanString = '';
    let currentChar = '';
    let currentCharCode = -1;
    let value = '';

    for (let index = 0; index < checkString.length; index += 1) {
      currentChar = checkString.charAt(index);
      currentCharCode = checkString.charCodeAt(index);

      if (currentCharCode > 47 && currentCharCode < 58) {
        numericIbanString += currentChar;
      } else if (currentCharCode > 64 && currentCharCode < 91) {
        value = currentCharCode - 65 + 10;
        numericIbanString += value;
      } else {
        return false;
      }
    }

    let previousModulo = 0;
    let subpart = '';
    for (let idx = 0; idx < numericIbanString.length; idx += 5) {
      subpart = `${previousModulo}${numericIbanString.substr(idx, 5)}`;
      previousModulo = subpart % ibanValidationModulo;
    }

    return previousModulo === 1;
  }

  static isValidBic(bicParam) {
    let bic = bicParam;

    const bicRegExp = new RegExp(IBAN_BIC_RULES.BIC_REGEXP);

    if (!bic) {
      return false;
    }

    bic = bic.replace(/\s/g, '').toUpperCase();
    const bicTab = bicRegExp.exec(bic);
    if (!bicTab) {
      return false;
    }

    const bicHash = {
      bank: bicTab[1],
      country: bicTab[2],
      location: bicTab[3],
      branch: bicTab[4],
    };

    return !!bicHash.bank;
  }

  /* -----  End of Static methods  ------ */
}
