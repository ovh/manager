import controller from './list-layout.controller';
import template from './template.html';
import { componentBindings } from './list-layout.utils';

export default {
  bindings: {
    ...componentBindings,
    staticResources: '<?',
    header: '@?',
    id: '@',
    description: '<',
    loadResource: '<?',
    columns: '<',
    customizableColumns: '<?',
    defaultFilterProperty: '<',
    getServiceNameLink: '<?',
    options: '<?',
    formatters: '<?',
  },
  controller,
  template,
};
