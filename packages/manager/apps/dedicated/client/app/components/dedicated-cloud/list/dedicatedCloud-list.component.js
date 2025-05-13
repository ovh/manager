import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from './dedicatedCloud-list.html';
import controller from './dedicatedCloud-list.controller';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    staticResources: '<?',
    header: '@?',
    id: '@',
    description: '<',
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
  name: 'ovhManagerPccList',
};
