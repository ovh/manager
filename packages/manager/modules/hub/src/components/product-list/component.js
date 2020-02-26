import controller from './controller';
import template from './template.html';

/*
 * You can either provides a full API route or a product identifier
 * (if the identifier corresponds to a pre-configured product)
 *
 * @example
 * // Pre-configured product
 *      <ovh-manager-hub-user-product-tile
 *          data-product="'domain'">
 *      </ovh-manager-hub-user-product-tile>
 *
 * @example
 * // Raw api
 *      <ovh-manager-hub-user-product-tile
 *          data-product="'/hosting/web/{serviceName}'">
 *      </ovh-manager-hub-user-product-tile>
 */

export default {
  controller,
  template,
  bindings: {
    product: '<',
  },
};
