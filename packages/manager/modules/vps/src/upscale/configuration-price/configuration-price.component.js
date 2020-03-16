import controller from './configuration-price.controller';
import template from './configuration-price.html';

/**
 * Examples:
 * <vps-upscale-configuration-price price="{ value: 32.30, unit: 'microcents', currency: 'EUR' }" language="'fr_FR'"></vps-upscale-configuration-price>
 * <vps-upscale-configuration-price price="{ value: 32.30, unit: 'cents', currency: 'USD' }" language="'fr_CA'"></vps-upscale-configuration-price>
 * <vps-upscale-configuration-price price="{ value: 32.30, unit: 'cents', currency: 'EUR' }" language="'en_US'"></vps-upscale-configuration-price>
 */
export default {
  bindings: {
    /**
     * string
     * formatted the OVHcloud way
     */
    language: '<',
    /**
     * @ovh-ux/manager-models:Price
     */
    price: '<',
  },
  controller,
  template,
};
