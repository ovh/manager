import controller from './list-layout.controller';
import template from './template.html';
import { componentBindings } from './list-layout.utils';

export default {
  bindings: {
    ...componentBindings,
    staticResources: '<?',
    header: '@?',
    changelog: '@?',
    guides: '<?',
    id: '@',
    description: '<',
    loadResource: '<?',
    columns: '<',
    customizableColumns: '<?',
    defaultFilterColumn: '<',
    getServiceNameLink: '<?',
    options: '<?',
    formatters: '<?',
    topbarOptions: '<?',
    customizeColumnsMap: '<?',
  },
  controller,
  template,
};
