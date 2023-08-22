import controller from './apiv2-list-layout.controller';
import template from './template.html';
import { componentBindings } from './apiv2-list-layout.utils';

export default {
  bindings: {
    ...componentBindings,
    pageSize: '<',
    createItemsPromise: '<',
    header: '@?',
    id: '@',
    description: '<',
    columns: '<',
    customizableColumns: '<?',
    getResourceLink: '<',
    linkProperty: '@',
    resourceIdProperty: '@',
  },
  controller,
  template,
};
