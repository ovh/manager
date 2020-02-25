import controller from './controller';
import template from './template.html';

/*
 * Usage example :
 *      <ovh-manager-hub-user-product-tile
 *          data-product="'domain'">
 *      </ovh-manager-hub-user-product-tile>
 */

export default {
  controller,
  template,
  bindings: {
    product: '<',
  },
};
