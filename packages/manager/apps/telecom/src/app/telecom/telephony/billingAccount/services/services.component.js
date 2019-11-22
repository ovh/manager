import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

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
