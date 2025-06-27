import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from './vps-list.html';
import controller from './vps-list.controller';

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
  name: 'ovhManagerVpsList',
};
