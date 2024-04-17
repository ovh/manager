import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './list-domain-layout.controller';
import template from './template.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    header: '<',
    filter: '<',
    topbarOptions: '<',
    getServiceNameLink: '<',
    defaultFilterColumn: '<',
    hideBreadcrumb: '<',
    domainStateEnum: '<',
    domainNsTypeEnum: '<',
    domainRenewalModeEnum: '<',
    goToRestoreRenew: '<',
  },
  controller,
  template,
};
