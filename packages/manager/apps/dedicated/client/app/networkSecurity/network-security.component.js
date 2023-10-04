import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import controller from './network-security.controller';
import template from './network-security.html';

export default {
  bindings: {
    ...ListLayoutHelper.componentBindings,
    goToScrubbingCenter: '<',
    goToTrafficChart: '<',
    isScrubbingCenterActive: '<',
    isTrafficChartActive: '<',
  },
  controller,
  template,
};
