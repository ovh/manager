import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './repayments-list.controller';
import template from './repayments-list.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    statusEnum: '<',
  },
};
