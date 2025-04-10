import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './listing.controller';
import template from './listing.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    header: '<',
    staticResources: '<?',
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
    isDeleteOptionsAvailable: '<',
    guideLinks: '<',
  },
  template,
  controller,
};
