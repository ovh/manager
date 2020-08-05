import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import controller from './services.controller';
import template from './services.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    orderUrl: '<',
    getServiceLink: '<',
    viewService: '<',

    telephonyFeatureTypes: '<',
    telephonyServiceTypes: '<',
  },
};
