import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from './operation-table.html';
import controller from './operation-table.controller';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    type: '<',
    header: '<',
    filter: '<',
    topbarOptions: '<',
    defaultFilterColumn: '<',
    hideBreadcrumb: '<',
    operationActionEnum: '<',
    operationStatusEnum: '<',
    operationFunctionEnum: '<',
    updateFilterParam: '<',
    displayedColumns: '<',
  },
  template,
  controller,
};
