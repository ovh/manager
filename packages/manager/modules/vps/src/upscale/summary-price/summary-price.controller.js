import includes from 'lodash/includes';
import isString from 'lodash/isString';
import values from 'lodash/values';

import { Price } from '@ovh-ux/manager-models';

import { PRICING_MODES } from '../upscale.constants';
import UpscaleService from '../upscale.service';

export default class {
  $onInit() {
    UpscaleService.validateLanguage(this.language);
    this.validatePaymentType();

    this.paymentTypes = PRICING_MODES;
  }

  validatePaymentType() {
    if (!isString(this.paymentType)) {
      throw new TypeError('Attribute "paymentType" should be of type "string"');
    }

    if (!includes(values(PRICING_MODES), this.paymentType)) {
      throw new RangeError(
        `Attribute "paymentType" has an invalid value: ${this.paymentType}`,
      );
    }
  }

  buildPrice() {
    try {
      const price = new Price(this.price);
      return UpscaleService.buildPriceToDisplay(price, this.language);
    } catch (err) {
      return null;
    }
  }
}
