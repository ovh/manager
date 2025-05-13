import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

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
    goToTelephonyRepayments: '<',

    viewBillingAccount: '<',
    viewBillingAccountServices: '<',
    gotoOrder: '<',
  },
};
