import controller from './model-price.controller';
import template from './model-price.html';

/**
 * Examples:
 * <vps-upscale-model-price price="{ value: 32.30, unit: 'microcents', currency: 'EUR' }" language="'fr_FR'"></vps-upscale-model-price>
 * <vps-upscale-model-price price="{ value: 32.30, unit: 'cents', currency: 'USD' }" language="'fr_CA'"></vps-upscale-model-price>
 * <vps-upscale-model-price price="{ value: 32.30, unit: 'cents', currency: 'EUR' }" language="'en_US'"></vps-upscale-model-price>
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
