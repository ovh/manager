import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { omit } from 'lodash-es';
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
    ...omit(ListLayoutHelper.componentBindings, 'onListParamsChange'),
    onParamsChange: '<',
    columns: '<',
    rows: '<?',
    loadRow: '<',
    notifications: '<',
    productType: '<',
    propertyId: '<',
  },
};
