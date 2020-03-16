import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import values from 'lodash/values';

import { Price } from '@ovh-ux/manager-models';

import { PAYMENT_TYPES } from './summary-price.constants';
import UpscaleService from '../upscale.service';

export default class {
  $onInit() {
    UpscaleService.validateLanguage(this.language);
    this.validatePaymentType();

    this.paymentTypes = PAYMENT_TYPES;
  }

  validatePaymentType() {
    if (!isObject(this.paymentType)) {
      throw new TypeError('Attribute "paymentType" should be of type "object"');
    }

    if (!includes(values(PAYMENT_TYPES), this.paymentType.value)) {
      throw new RangeError(
        `Attribute "paymentType.value" has an invalid value: ${this.paymentType.value}`,
      );
    }

    if (
      this.paymentType.value === PAYMENT_TYPES.UPFRONT &&
      !isNumber(this.paymentType.monthNumber)
    ) {
      throw new TypeError(
        'Attribute "paymentType.monthNumber" should be of type "number"',
      );
    }
  }

  buildPrice() {
    const price = new Price(this.price);
    return UpscaleService.buildPriceToDisplay(price, this.language);
  }
}
