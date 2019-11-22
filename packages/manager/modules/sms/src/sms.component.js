import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

import controller from './sms.controller';
import template from './sms.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    smsStatusTypes: '<',

    getSmsLink: '<',
    viewSms: '<',
  },
};
