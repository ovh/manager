import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './cloud-connect.controller';
import template from './template.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    getServiceNameLink: '<',
    gotoOrder: '<',
    goToManageNotifications: '<',
    viewDetail: '<',
    orderFollowUp: '<',
  },
  controller,
  template,
};
