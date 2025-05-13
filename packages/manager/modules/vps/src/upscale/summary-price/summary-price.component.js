import controller from './summary-price.controller';
import template from './summary-price.html';

/**
 * Examples:
 * <vps-upscale-summary-price commitment-date="2020/01/01" price="{ value: 32.30, unit: 'microcents', currency: 'EUR' }" payment-type="'monthly'" language="'fr_FR'"></vps-upscale-summary-price>
 * <vps-upscale-summary-price commitment-date="2020/01/01" price="{ value: 32.30, unit: 'cents', currency: 'USD' }" payment-type="'monthly'" language="'fr_CA'"></vps-upscale-summary-price>
 * <vps-upscale-summary-price commitment-date="2020/01/01" price="{ value: 32.30, unit: 'cents', currency: 'EUR' }" payment-type="'upfront'" language="'en_US'"></vps-upscale-summary-price>
 */
export default {
  bindings: {
    /**
     * string
     * formatted the OVHcloud way
     */
    language: '<',
    /**
     * object
     * paymentType.value: PAYMENT_TYPES
     * paymentType.monthCount: number, if the value is UPFRONT, the number of months before commitment expiration
     */
    paymentType: '<',
    /**
     * @ovh-ux/manager-models:Price
     */
    price: '<',
  },
  controller,
  template,
};
