import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import controller from './sms.controller';
import template from './sms.html';

export default {
  controller,
  template,
  bindings: {
    ...ListLayoutHelper.componentBindings,
    smsStatusTypes: '<',
    smsChannelEnum: '<',
    getSmsLink: '<',
    viewSms: '<',
    gotoOrder: '<',
    headerGuideLink: '<',
  },
};
