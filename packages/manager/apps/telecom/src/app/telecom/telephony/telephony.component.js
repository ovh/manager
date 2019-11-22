import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

import controller from './telephony.controller';
import template from './telephony.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    loadResource: '<',
    telephonyStatusTypes: '<',

    getBillingAccountLink: '<',
    getBillingAccountServicesLink: '<',

    viewBillingAccount: '<',
    viewBillingAccountServices: '<',
  },
};
