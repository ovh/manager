import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './listing.controller';
import template from './listing.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    changelog: '<?',
    header: '<',
    staticResources: '<?',
    description: '<?', //
    loadResource: '<',
    resources: '<?',
    columnConfig: '<',
    customizableColumns: '<?',
    defaultFilterColumn: '<',
    getServiceNameLink: '<?',
    options: '<?',
    formatters: '<?',
    topbarOptions: '<',
    customizeColumnsMap: '<?',
    isDeleteOptionsAvailable: '<',
    guideLinks: '<',
  },
  template,
  controller,
};
