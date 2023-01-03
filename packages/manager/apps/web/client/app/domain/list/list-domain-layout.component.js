import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './list-domain-layout.controller';
import template from './template.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    header: '<',
    statusEnum: '<',
    topbarOptions: '<',
    getServiceNameLink: '<',
    defaultFilterColumn: '<',
    hideBreadcrumb: '<',
  },
  controller,
  template,
};
